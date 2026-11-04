package org.example.reponsitory;

import org.example.modal.Calendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.sql.Timestamp;
import java.util.List;

@Repository
public interface CalendarReponsitory extends JpaRepository<Calendar, Integer> {
	@Query("SELECT c FROM Calendar c WHERE c.startDate BETWEEN :startOfMonth AND :endOfMonth")
	List<Calendar> getCalendarByMonth(@Param("startOfMonth") Timestamp startOfMonth,
			@Param("endOfMonth") Timestamp endOfMonth);

	@Query(value = "SELECT * FROM tour_calendar WHERE DATE(start_date) >= CURDATE() AND DATE(start_date) <= CURDATE() + INTERVAL 1 DAY", nativeQuery = true)
	List<Calendar> getCalendarsWithinOneDaysFromNow();

	@Query(value = "SELECT * FROM tour_calendar WHERE DATE(start_date) < CURDATE()", nativeQuery = true)
	List<Calendar> getExpiredCalendars();

	@Query(value = "SELECT * FROM tour_calendar WHERE start_date >= CURRENT_DATE AND start_date < DATE_ADD(CURRENT_DATE, INTERVAL 2 MONTH)", nativeQuery = true)
	List<Calendar> getCalendarsInCurrentAndNextMonth();

	@Query("SELECT FUNCTION('DAY',c.startDate), c.tour.price FROM Calendar c WHERE FUNCTION('MONTH',c.startDate) = :month AND FUNCTION('YEAR',c.startDate) = :year AND c.tour.id = :tourId")
	List<Object> calendarInMonth(@Param("month") int month, @Param("year") int year, @Param("tourId") String tourId);
}
