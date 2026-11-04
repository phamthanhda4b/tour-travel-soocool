package org.example.service;

import org.example.modal.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface IVoucherService {
	List<Voucher> getVouchers();

	Optional<Voucher> findVoucherById(int id);

	Voucher createVoucher(Voucher voucher);

	boolean updateVoucher(int id, Voucher voucher);

	boolean updateStatusVoucher(int id, int status);

	boolean deleteVoucher(int id);

	int totalVouchers();

	// phan trang voucher
	Page<Voucher> pageVouchers(Pageable pageable);
}
