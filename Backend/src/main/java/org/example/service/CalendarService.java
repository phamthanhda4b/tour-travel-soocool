package org.example.service;

import org.example.dto.CalendarDTO;
import org.example.modal.Calendar;
import org.example.modal.Tour;
import org.example.modal.Voucher;
import org.example.reponsitory.CalendarReponsitory;
import org.example.reponsitory.TourReponsitory;
import org.example.reponsitory.VoucherReponsitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CalendarService implements ICalendarService {
	@Autowired
	private CalendarReponsitory calendarReponsitory;
	@Autowired
	private TourReponsitory tourReponsitory;
	@Autowired
	private VoucherReponsitory voucherReponsitory;

	// getAll
	@Override
	public List<Calendar> getAllCalendar() {
		return calendarReponsitory.findAll();
	}

	// CreateCalendarService
	@Override
	public Calendar createNewCalendar(Calendar calendar) {
		Tour tour = tourReponsitory.findById(calendar.getTour().getId())
				.orElseThrow(() -> new RuntimeException("Tour not found"));
		calendar.setTour(tour);

		// Lấy thông tin Voucher từ CSDL
		Voucher voucher = voucherReponsitory.findById(calendar.getVoucher().getId())
				.orElseThrow(() -> new RuntimeException("Voucher not found"));
		calendar.setVoucher(voucher);
		return calendarReponsitory.save(calendar);


	}

	// FindCalendarbyTourId
	@Override
	public List<CalendarDTO> findCalendarbyTour(String tourID) {
		List<Calendar> calendars = new ArrayList<>();
		List<CalendarDTO> calendarDTOS = new ArrayList<>();
		for (Calendar calendar : calendarReponsitory.findAll()) {
			if (calendar.getTour().getId().equals(tourID)) {
				calendars.add(calendar);
			}
		}
		for (Calendar calendar: calendars){
			CalendarDTO calendarDTO = new CalendarDTO(calendar);
			calendarDTOS.add(calendarDTO);
		}
		return calendarDTOS;
	}

	@Override
	public List<CalendarDTO> getExpiredCalendars() {
		List<Calendar> expiredCalendars = calendarReponsitory.getExpiredCalendars();
		List<CalendarDTO> calendarExpiredDTO = new ArrayList<>();
		for (Calendar calendar : expiredCalendars) {
			CalendarDTO calendarDTO = new CalendarDTO(calendar);
			calendarExpiredDTO.add(calendarDTO);
		}

		if (calendarExpiredDTO.isEmpty()) {
			throw new RuntimeException("Not found expiredCalendars ");
		}
		return calendarExpiredDTO;
	}

	@Override
	public List<CalendarDTO> getCalendarsWithinThreeDaysFromNow() {
		List<Calendar> OneDaysFromNow = calendarReponsitory.getCalendarsWithinOneDaysFromNow();
		List<CalendarDTO> OneCalendarDTOS = new ArrayList<>();
		for (Calendar calendar : OneDaysFromNow) {
			CalendarDTO calendarDTO = new CalendarDTO(calendar);
			OneCalendarDTOS.add(calendarDTO);
		}
		if (OneCalendarDTOS.isEmpty()) {
			throw new RuntimeException("Not found calendars");
		}
		return OneCalendarDTOS;
	}

	@Override
	public List<CalendarDTO> getCalendarsInCurrentAndNextMonth() {
		List<Calendar> calendarsInCurrentAndNextMonth = calendarReponsitory.getCalendarsInCurrentAndNextMonth();
		List<CalendarDTO> calendarsInCurrentAndNextMonthDTOS = new ArrayList<>();
		for (Calendar calendar : calendarsInCurrentAndNextMonth) {
			CalendarDTO calendarDTO = new CalendarDTO(calendar);
			calendarsInCurrentAndNextMonthDTOS.add(calendarDTO);
		}
		if (calendarsInCurrentAndNextMonthDTOS.isEmpty()) {
			throw new RuntimeException("Not found calendars");
		}
		return calendarsInCurrentAndNextMonthDTOS;
	}

//    //GetAllStartDate
	@Override
	public List<Date> getAllStartedDate() {
//        List<Date> listStartDate = new ArrayList<>();
//        for (Calendar calendar : getAllCalendar()){
//            listStartDate.add(calendar.getStartDate());
//        }
		return null;
	}

	@Override
	public List<Object> calendarInMonth(int month, int year, String tourId) {
		if (calendarReponsitory.calendarInMonth(month, year, tourId).isEmpty())
			throw new RuntimeException("Khong co lich nao trong thang nay!!");
		return calendarReponsitory.calendarInMonth(month, year, tourId);

	}

	@Override
	public CalendarDTO getCalendarById(int id) {
		CalendarDTO calendarDTO = new CalendarDTO();
		for (Calendar calendar : calendarReponsitory.findAll()){
			if(calendar.getId()==id) {
				calendarDTO = new CalendarDTO(calendar);
			}
		}
		return calendarDTO;

	}

	@Override
	public Calendar updateCalendar(int id, Calendar calendarDetails) {
		Optional<Calendar> existingCalendar = calendarReponsitory.findById(id);
		if(existingCalendar.isPresent()){
			Calendar exCalendar = existingCalendar.get();
			exCalendar.setStartDate(calendarDetails.getStartDate());
			exCalendar.setSlot(calendarDetails.getSlot());
//			exCalendar.setTour(calendarDetails.getTour());
			return calendarReponsitory.save(exCalendar);
		}
		return null;
	}

	@Override
	public Boolean delCalendar(int id) {
		Optional<Calendar> checkCalendar = calendarReponsitory.findById(id);
		if(checkCalendar.isPresent()){
			calendarReponsitory.deleteById(id);
			return true;
		}
		return false;
	}
}
