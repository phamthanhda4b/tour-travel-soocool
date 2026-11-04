package org.example.reponsitory;

import org.example.dto.TourOrderDTO;
import org.example.modal.TourOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface TourOrderReponsitory extends JpaRepository<TourOrder, Integer> {

	// So tour duoc dat trong thang
	@Query("SELECT COUNT(to.id) FROM TourOrder to WHERE to.orderDate BETWEEN :startOfMonth AND :endOfMonth")
	public int countTourOrderByMonth(@Param("startOfMonth") Timestamp startOfMonth,
			@Param("endOfMonth") Timestamp endOfMonth);

	// Doanh thu theo ngày
	@Query("SELECT SUM(to.totalPrice) FROM TourOrder to WHERE to.orderDate BETWEEN :startOfDay AND :endOfDay")
	Double totalRevenueByDay(@Param("startOfDay") Timestamp startOfDay, @Param("endOfDay") Timestamp endOfDay);

	// Doanh thu theo tháng
	@Query("SELECT SUM(to.totalPrice) FROM TourOrder to WHERE to.orderDate BETWEEN :startOfMonth AND :endOfMonth")
	Double totalRevenueByMonth(@Param("startOfMonth") Timestamp startOfMonth,
			@Param("endOfMonth") Timestamp endOfMonth);

	// Doanh thu theo năm
	@Query("SELECT SUM(to.totalPrice) FROM TourOrder to WHERE to.orderDate BETWEEN :startOfYear AND :endOfYear")
	Double totalRevenueByYear(@Param("startOfYear") Timestamp startOfYear, @Param("endOfYear") Timestamp endOfYear);

	// Top tour được đặt nhiều nhất theo ngay
	@Query("SELECT new org.example.dto.TourOrderDTO(MAX(to.id),COUNT(to.id), SUM(to.totalPrice), to.tour) FROM TourOrder to WHERE to.orderDate BETWEEN :startOfDay AND :endOfDay GROUP BY to.tour ORDER BY COUNT(to.id) DESC")
	List<TourOrderDTO> getTopTourOrdersByDay(@Param("startOfDay") Timestamp startOfDay,
			@Param("endOfDay") Timestamp endOfDay, Pageable pageable);

	// Top tour duoc dat nhieu nhat theo thang
	@Query("SELECT new org.example.dto.TourOrderDTO(MAX(to.id),COUNT(to.id), SUM(to.totalPrice), to.tour) FROM TourOrder to WHERE to.orderDate BETWEEN :startOfMonth AND :endOfMonth GROUP BY to.tour ORDER BY COUNT(to.id) DESC")
	List<TourOrderDTO> getTopTourOrdersByMonth(@Param("startOfMonth") Timestamp startOfMonth,
			@Param("endOfMonth") Timestamp endOfMonth, Pageable pageable);

	// Top tour duoc dat nhieu nhat theo nam
	@Query("SELECT new org.example.dto.TourOrderDTO(MAX(to.id),COUNT(to.id), SUM(to.totalPrice), to.tour) FROM TourOrder to WHERE to.orderDate BETWEEN :startOfYear AND :endOfYear GROUP BY to.tour ORDER BY COUNT(to.id) DESC")
	List<TourOrderDTO> getTopTourOrdersByYear(@Param("startOfYear") Timestamp startOfYear,
			@Param("endOfYear") Timestamp endOfYear, Pageable pageable);

	// Tong Tour dat trong ngay
	@Query("SELECT COUNT(t) FROM TourOrder t WHERE DATE(t.orderDate) = CURRENT_DATE")
	int totalTourOrderInDay();

	@Query("SELECT COUNT(t) FROM TourOrder t WHERE MONTH(t.orderDate) = MONTH(CURRENT_DATE) AND YEAR(t.orderDate) = YEAR(CURRENT_DATE)")
	int totalTourOrderInMonth();

	@Query("SELECT COUNT(t) FROM TourOrder t WHERE YEAR(t.orderDate) = YEAR(CURRENT_DATE)")
	int totalTourOrderInYear();

	// Lấy số touroder theo từng tháng
	@Query("SELECT MONTH(b.orderDate) AS month, COUNT(b) AS totalTourOrder " + "FROM TourOrder b "
			+ "WHERE YEAR(b.orderDate) = YEAR(CURDATE()) " + "GROUP BY MONTH(b.orderDate) " + "ORDER BY month")
	List<Object[]> getMonthlyOrderStats();

	// thong ke doanh thu theo ngay
	@Query("SELECT new org.example.dto.TourOrderDTO(SUM(to.totalPrice),DATE(to.orderDate) ) FROM TourOrder to WHERE MONTH(to.orderDate) = MONTH(CURRENT_DATE) GROUP BY DATE(to.orderDate)  ORDER BY DATE(to.orderDate)")
	List<TourOrderDTO> listTourOrderStatsByDay();

	// thong ke doanh thu theo thang
	@Query("SELECT new org.example.dto.TourOrderDTO(SUM(to.totalPrice),MONTH(to.orderDate)) FROM TourOrder to GROUP BY MONTH(to.orderDate) ORDER BY MONTH(to.orderDate)")
	List<TourOrderDTO> listTourOrderStatsByMonth();

}
