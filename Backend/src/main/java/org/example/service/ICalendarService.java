package org.example.service;

import org.example.dto.CalendarDTO;
import org.example.modal.Calendar;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

public interface ICalendarService {
	List<Calendar> getAllCalendar();

	Calendar createNewCalendar(Calendar calendar);

	List<CalendarDTO> findCalendarbyTour(String tourID);

	List<CalendarDTO> getExpiredCalendars();

	List<CalendarDTO> getCalendarsWithinThreeDaysFromNow();

	List<CalendarDTO> getCalendarsInCurrentAndNextMonth();

	List<Date> getAllStartedDate();

	List<Object> calendarInMonth(int month, int year, String tourId);
	CalendarDTO getCalendarById(int id);
	Calendar updateCalendar(int id, Calendar calendarDetails);
	Boolean delCalendar(int id);
}
