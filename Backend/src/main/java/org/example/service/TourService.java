package org.example.service;
import java.util.*;
import java.util.stream.Collectors;

import org.example.dto.TourDTOv2;
import org.example.form.TourFilterForm;
import org.example.modal.Calendar;
import org.example.modal.Tour;
import org.example.modal.TourType;
import org.example.modal.Transport;
import org.example.reponsitory.TourReponsitory;
import org.example.specification.TourSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class TourService implements ITourService {
	@Autowired
	private TourReponsitory tourReponsitory;

	@Override
	public List<Tour> getAllTours() {
		return tourReponsitory.findAll();
	}

	// add tour
	@Override
	public Tour createNewTour(Tour tour) {
		return tourReponsitory.save(tour);
	}

	// delete Tour By ID
	@Override
	public boolean deleteTourById(String id) {
		if (tourReponsitory.existsById(id)) {
			tourReponsitory.deleteById(id);
			return true;
		}
		return false;
	}

	// phan trang tour
	@Override
	public Page<Tour> getPageTours(Pageable pageable, Date date) {
		Specification<Tour> where = TourSpecification.buildWhere("home_default", date);
		Page<Tour> pageTours = tourReponsitory.findAll(where, pageable);

		for (Tour t : pageTours.getContent()) {
			List<Calendar> calendars = t.getCalendar();
			if (calendars != null) {
				calendars.removeIf(calendar -> calendar.getStartDate().before(date));
			}
			calendars.sort(Comparator.comparing(Calendar::getStartDate));
		}

		return pageTours;
	}

	// update tour by id
//    public Tour updateTour(String id, Tour tourDetails) {
//            Optional<Tour> optionalTour = tourReponsitory.findById(id);
//            if(optionalTour.isPresent()) {
//                Tour existingTour = optionalTour.get();
//                existingTour.setName(tourDetails.getName());
//                existingTour.setPrice(tourDetails.getPrice());
//                existingTour.setImageLink(tourDetails.getImageLink());
//                existingTour.setFileName(tourDetails.getFileName());
//                existingTour.setDestination(tourDetails.getDestination());
//                existingTour.setDeparturePoint(tourDetails.getDeparturePoint());
//                existingTour.setSlot(tourDetails.getSlot());
//                existingTour.setTransportId(tourDetails.getTransportId());
//                existingTour.setTourTypeId(tourDetails.getTourTypeId());
//                return tourReponsitory.save(existingTour);
//            }else {
//                System.out.println("Tour not found with id " + id);
//                return null;
//            }
//    }

	// search tour by name
	@Override
	public List<Tour> getTourByName(String Name) {
		List<Tour> listTourByName = new ArrayList<>();
		for (Tour tour : tourReponsitory.findAll()) {
			if (tour.getName().toLowerCase().contains(Name.toLowerCase())) {
				listTourByName.add(tour);
			}
		}
		return listTourByName;
	}

	@Override
	public Page<Tour> filterTours(Pageable pageable, TourFilterForm tourFilterForm, String departure,
								  String destination, Integer tourType, Integer transportId, Date startDate) {
		Specification<Tour> where = TourSpecification.buildWhere("filter_tour", tourFilterForm, departure, destination,
				tourType, transportId, startDate);
		List<Tour> pageTourss = tourReponsitory.findAll(where);
		System.out.println(pageTourss.size());
		Page<Tour> pageTours = tourReponsitory.findAll(where, pageable);
		System.out.println(pageTours.getTotalElements());
		for (Tour t : pageTours.getContent()) {
			System.out.println(t);
		}
		Date currentDate = new Date();
		Date tourStartDate = (startDate != null) ? startDate : currentDate;
		pageTours.getContent().forEach(tour -> {
			List<Calendar> calendars = tour.getCalendar();
			if (calendars != null && !calendars.isEmpty()) {
				List<Calendar> filteredAndSortedCalendars = calendars.stream()
						.filter(calendar -> !calendar.getStartDate().before(tourStartDate))
						.sorted(Comparator.comparing(Calendar::getStartDate))
						.collect(Collectors.toList());
				tour.setCalendar(filteredAndSortedCalendars);
			}
		});

		return pageTours;
	}


	@Override
	public Long totalTour() {
		return tourReponsitory.count();
	}

	@Override
	public List<Long> getTotalByType() {
		List<Long> totalTourByType = new ArrayList<>();
		Long tk = 0L;
		Long gt = 0L;
		Long tc = 0L;
		Long cc = 0L;
		for (Tour tour : tourReponsitory.findAll()){
			switch (tour.getTourType().getId()){
				case 1 : tk++; break;
				case 2 : gt++; break;
				case 3 : tc++; break;
				case 4 : cc++; break;
			}
		}
		totalTourByType.add(tk);
		totalTourByType.add(gt);
		totalTourByType.add(tc);
		totalTourByType.add(cc);
		return totalTourByType;
	}

	@Override
	public Page<TourDTOv2> getTours(int page ,int size) {
		Pageable pageable = PageRequest.of(page, size);
		return tourReponsitory.findAll(pageable).map(TourDTOv2::new);
	}

	@Override
	public Optional<TourDTOv2> getTourById(String tourId) {
		return tourReponsitory.findById(tourId).map(TourDTOv2::new);
	}

	@Override
	public Tour updateTour(String tourId, Tour updatedTour) {
		Optional<Tour> existingTourOpt = tourReponsitory.findById(tourId);
		if (existingTourOpt.isPresent()) {
			Tour existingTour = existingTourOpt.get();
			existingTour.setName(updatedTour.getName());
			existingTour.setPrice(updatedTour.getPrice());
			existingTour.setDestination(updatedTour.getDestination());
			existingTour.setDeparturePoint(updatedTour.getDeparturePoint());
			existingTour.setImageLink(updatedTour.getImageLink());
			existingTour.setTourType(new TourType(updatedTour.getTourType().getId(), updatedTour.getName()));
			existingTour.setTransport(new Transport(updatedTour.getTransport().getId(),updatedTour.getTransport().getName()));
			return tourReponsitory.save(existingTour);
		}
		return null; // Nếu không tìm thấy tour với ID, trả về null hoặc bạn có thể ném exception
	}

	@Override
	public List<TourDTOv2> getAllTour() {
		List<TourDTOv2> tourDTOv2s = new ArrayList<>();
		for (Tour tour : tourReponsitory.findAll()){
			TourDTOv2 tourDTOv2 = new TourDTOv2(tour);
			tourDTOv2s.add(tourDTOv2);
		}
		return tourDTOv2s;
	}
}


