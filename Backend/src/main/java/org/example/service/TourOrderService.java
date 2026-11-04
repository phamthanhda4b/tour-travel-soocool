package org.example.service;

import com.mysql.cj.Session;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.example.dto.TourOrderDTO;
import org.example.dto.TourOrderStats;
import org.example.modal.Tour;
import org.example.modal.TourOrder;
import org.example.reponsitory.TourOrderReponsitory;
import org.example.reponsitory.TourReponsitory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class TourOrderService implements ITourOrderService {
	@Autowired
	private TourOrderReponsitory tourOrderReponsitory;
	@Autowired
	private TourReponsitory tourReponsitory;

	public List<TourOrderDTO> getAllTourOrder() {
		List<TourOrderDTO> tourOrderDTOs = new ArrayList<>();
		for (TourOrder tourOrder : tourOrderReponsitory.findAll()) {
			TourOrderDTO tourOrderDTO = new TourOrderDTO(tourOrder);
			tourOrderDTOs.add(tourOrderDTO);
		}
		return tourOrderDTOs;
	}

	// lay doanh thu
	@Override
	public Double getRevenue(String type) {
		Timestamp startDate;
		Timestamp endDate;

		// Tính toán phạm vi ngày, tháng, năm tùy theo type
		String timeType = type.toUpperCase();
		Double revenue = null;
		switch (timeType) {
		case "DAY":
			// Chuyển LocalDate thành LocalDateTime và sau đó thành Timestamp
			startDate = Timestamp.valueOf(LocalDate.now().atStartOfDay()); // Tính từ 00:00:00 của ngày hiện tại
			endDate = Timestamp.valueOf(LocalDate.now().atTime(23, 59, 59)); // Tính đến 23:59:59 của ngày hiện tại
			revenue = tourOrderReponsitory.totalRevenueByDay(startDate, endDate);
			return revenue != null ? revenue : 0;

		case "MONTH":
			// Tính từ ngày đầu tháng đến ngày cuối tháng
			startDate = Timestamp.valueOf(LocalDate.now().withDayOfMonth(1).atStartOfDay()); // Ngày đầu tháng
			endDate = Timestamp
					.valueOf(LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()).atTime(23, 59, 59)); // Ngày
																													// cuối
																													// tháng
			revenue = tourOrderReponsitory.totalRevenueByMonth(startDate, endDate);
			return revenue != null ? revenue : 0;

		case "YEAR":
			// Tính từ ngày đầu năm đến ngày cuối năm
			startDate = Timestamp.valueOf(LocalDate.now().withDayOfYear(1).atStartOfDay()); // Ngày đầu năm
			endDate = Timestamp
					.valueOf(LocalDate.now().withDayOfYear(LocalDate.now().lengthOfYear()).atTime(23, 59, 59)); // Ngày
																												// cuối
																												// năm
			revenue = tourOrderReponsitory.totalRevenueByYear(startDate, endDate);
			return revenue != null ? revenue : 0;

		default:
			// Trường hợp mặc định, tính doanh thu trong ngày
			startDate = Timestamp.valueOf(LocalDate.now().atStartOfDay());
			endDate = Timestamp.valueOf(LocalDate.now().atTime(23, 59, 59));
			revenue = tourOrderReponsitory.totalRevenueByDay(startDate, endDate);
			return revenue != null ? revenue : 0;
		}
	}

	// get top tour
	@Override
	public List<TourOrderDTO> listTopTours(String type) {
		Pageable pageable = PageRequest.of(0, 10);
		Timestamp startDate;
		Timestamp endDate;
		switch (type.toUpperCase()) {
		case "DAY":
			startDate = Timestamp.valueOf(LocalDate.now().atStartOfDay());
			endDate = Timestamp.valueOf(LocalDate.now().atTime(23, 59, 59));
			return tourOrderReponsitory.getTopTourOrdersByDay(startDate, endDate, pageable);
		case "MONTH":
			startDate = Timestamp.valueOf(LocalDate.now().withDayOfMonth(1).atStartOfDay()); // Ngày đầu tháng
			endDate = Timestamp
					.valueOf(LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()).atTime(23, 59, 59)); // Ngày cuối tháng
			return tourOrderReponsitory.getTopTourOrdersByMonth(startDate, endDate, pageable);
		case "YEAR":
			startDate = Timestamp.valueOf(LocalDate.now().withDayOfYear(1).atStartOfDay()); // Ngày đầu năm
			endDate = Timestamp
					.valueOf(LocalDate.now().withDayOfYear(LocalDate.now().lengthOfYear()).atTime(23, 59, 59)); // Ngày cuối năm
			return tourOrderReponsitory.getTopTourOrdersByYear(startDate, endDate, pageable);
		default:
			startDate = Timestamp.valueOf(LocalDate.now().atStartOfDay());
			endDate = Timestamp.valueOf(LocalDate.now().atTime(23, 59, 59));
			return tourOrderReponsitory.getTopTourOrdersByDay(startDate, endDate, pageable);
		}
	}

	// tour order by month
	@Override
	public int countTourOrderByMonth() {
		Timestamp startDate = Timestamp.valueOf(LocalDate.now().withDayOfMonth(1).atStartOfDay());
		Timestamp endDate = Timestamp
				.valueOf(LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()).atTime(23, 59, 59));
		return tourOrderReponsitory.countTourOrderByMonth(startDate, endDate);
	}

	// tao 1 tour order
	@Override
	@Transactional
	public void createNewTourOrder(TourOrder tourOrder, String tourId) {
		Optional<Tour> optionalTour = tourReponsitory.findById(tourId);

		if (optionalTour.isPresent()) {
			Tour tour = optionalTour.get();
			tourOrder.setTour(tour);
			tourOrderReponsitory.save(tourOrder);
		} else {
			throw new EntityNotFoundException("Tour with ID " + tourId + " not found.");
		}
	}

	public int totalTourOrderByType(String type) {
		switch (type) {
		case "DAY":
			return tourOrderReponsitory.totalTourOrderInDay();
		case "MONTH":
			return tourOrderReponsitory.totalTourOrderInMonth();
		case "YEAR":
			return tourOrderReponsitory.totalTourOrderInYear();
		default:
			return tourOrderReponsitory.totalTourOrderInMonth();
		}
	}

	// lay totalorder theo tung thang
	@Override
	public TourOrderStats getTourOrderStatsByMonth() {
		List<Object[]> results = tourOrderReponsitory.getMonthlyOrderStats();
		List<String> months = new ArrayList<>(12);
		List<Integer> totalOrders = new ArrayList<>(12);
		for (int i = 1; i <= 12; i++) {
			months.add("tháng " + i);
			totalOrders.add(0);
		}
		for (Object[] result : results) {
			int month = (int) result[0];
			long totalOrder = (long) result[1];
			totalOrders.set(month - 1, (int) totalOrder);
		}
		return new TourOrderStats(months, totalOrders);
	}

	// thong ke doanh thu
	@Override
	public List<TourOrderDTO> listTourOrderStatsByType(String type) {
		switch (type.toUpperCase()) {
		case "DAY":
			return tourOrderReponsitory.listTourOrderStatsByDay();
		case "MONTH":
			return tourOrderReponsitory.listTourOrderStatsByMonth();
		default:
			return tourOrderReponsitory.listTourOrderStatsByDay();
		}
	}
}
