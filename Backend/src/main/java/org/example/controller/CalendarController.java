package org.example.controller;

import org.example.dto.CalendarDTO;
import org.example.modal.Calendar;
import org.example.service.ICalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@RestController
@RequestMapping("api/Calendar")
public class CalendarController {
	@Autowired
	private ICalendarService calendarService;

	@GetMapping("/Calendars")
	public List<Calendar> listCalendar() {
		List<Calendar> calendars = calendarService.getAllCalendar();
		return calendars;
	}

	@PostMapping("/Calendars")
	public ResponseEntity<?> createCalendar(@RequestBody Calendar calendar) {
        try {
            Calendar newCalendar = calendarService.createNewCalendar(calendar);
            return new ResponseEntity<>(newCalendar, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }

	@GetMapping("/Calendars/{tourId}")
	public List<CalendarDTO> listCalendarByTourId(@PathVariable("tourId") String tourId) {
        return calendarService.findCalendarbyTour(tourId);
	}

	// API để lấy các calendar đã hết hạn
	@GetMapping("/Calendars/expired")
	public ResponseEntity<?> getExpiredCalendars() {
		try {
			// Gọi service để lấy các calendar hết hạn
			List<CalendarDTO> expiredCalendars = calendarService.getExpiredCalendars();
			// Trả về danh sách các calendar hết hạn nếu có
			return new ResponseEntity<>(expiredCalendars, HttpStatus.OK);
		} catch (RuntimeException rx) {
			// Trả về thông báo lỗi 404 nếu không có calendar hết hạn
			return new ResponseEntity<>(rx.getMessage(), HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/Calendars/near-future")
	public ResponseEntity<?> getCalendarsWithinThreeDaysFromNow() {
		try {
			List<CalendarDTO> CalendarsWithinOneDays = calendarService.getCalendarsWithinThreeDaysFromNow();
			return new ResponseEntity<>(CalendarsWithinOneDays, HttpStatus.OK);
		} catch (RuntimeException re) {
			return new ResponseEntity<>(re.getMessage(), HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/Calendars/current-and-next-month")
	public ResponseEntity<?> getCalendarsInCurrentAndNextMonth() {
		try {
			List<CalendarDTO> calendarDTOS = calendarService.getCalendarsInCurrentAndNextMonth();
			return new ResponseEntity<>(calendarDTOS, HttpStatus.OK);
		} catch (RuntimeException re) {
			return new ResponseEntity<>(re.getMessage(), HttpStatus.NOT_FOUND);

		}
	}

	@GetMapping("/tours")
	public ResponseEntity<?> getCalendarsInMonth(@RequestParam("month") int month, @RequestParam("year") int year,
			@RequestParam("tourId") String tourId) {
		try {
			List<Object> timestampList = calendarService.calendarInMonth(month, year, tourId);
			return new ResponseEntity<>(timestampList, HttpStatus.OK);
		} catch (RuntimeException e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
		}

	}
	@DeleteMapping("/Calendar/{id}")
	public Boolean delCalendar(@PathVariable("id") int id){
		try {
			calendarService.delCalendar(id);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
	@GetMapping("/Calendars/id/{id}")
	public CalendarDTO getCalendarDTObyId(@PathVariable("id") int id){
		return calendarService.getCalendarById(id);
	}
	@PutMapping("/Calendars/{id}")
	public ResponseEntity<?> updateCalendar(@PathVariable("id") int id, @RequestBody Calendar calendarDetails) {
		// Gọi service để cập nhật Calendar
		try {
			Calendar updatedCalendar = calendarService.updateCalendar(id, calendarDetails);
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (RuntimeException e) {
			return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
		}
	}


//    @GetMapping("/Calendar/StarteDates")
//    public List<Date> listDate(){
//        List<Date> startDates = calendarService.getAllStartedDate();
//        return startDates;
//    }

}
