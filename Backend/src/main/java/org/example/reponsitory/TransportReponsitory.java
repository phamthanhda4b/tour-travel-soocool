package org.example.reponsitory;

import org.example.dto.TransportDTO;
import org.example.modal.Transport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransportReponsitory extends JpaRepository<Transport, Integer> {
	// thong ke luong su dung phuong tien trong thang

	@Query("SELECT new org.example.dto.TransportDTO(t.transport.id, COUNT(td.id), DATE(td.orderDate)) " + "FROM Tour t "
			+ "JOIN TourOrder td ON td.tour.id = t.id "
			+ "WHERE MONTH(td.orderDate) = MONTH(CURRENT DATE ) AND YEAR(td.orderDate) = 2024 "
			+ "GROUP BY t.transport.id, DATE(td.orderDate)")
	List<TransportDTO> countByTransportIdForMonth();
}
