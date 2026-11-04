package org.example.reponsitory;

import org.example.modal.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VoucherReponsitory extends JpaRepository<Voucher, Integer> {

	@Query("SELECT v FROM Voucher v")
	Page<Voucher> pageVouchers(Pageable pageable);

	@Query("SELECT COUNT(v) FROM Voucher v")
	Integer totalVouchers();

	@Modifying
	@Query("UPDATE Voucher v SET v.status = :status WHERE v.id = :id")
	int updateStatus(@Param("id") int id, @Param("status") int status);

	Page<Voucher> findAllByOrderByStartDateDesc(Pageable pageable);

}
