package org.example.service;

import jakarta.transaction.Transactional;
import org.example.modal.Voucher;
import org.example.reponsitory.VoucherReponsitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VoucherService implements IVoucherService {
	@Autowired
	private VoucherReponsitory voucherReponsitory;

	// get all voucher
	public List<Voucher> getVouchers() {
		return voucherReponsitory.findAll();
	}

	// get Voucher by id
	public Optional<Voucher> findVoucherById(int id) {
		return voucherReponsitory.findById(id);
	}

	// add voucher
	public Voucher createVoucher(Voucher voucher) {
		return voucherReponsitory.save(voucher);
	}

	// update Voucher by ID
	public boolean updateVoucher(int id, Voucher voucher) {
		Optional<Voucher> optionalVoucher = voucherReponsitory.findById(id);
		if (optionalVoucher.isPresent()) {
			Voucher updatedVoucher = optionalVoucher.get();
			updatedVoucher.setVoucherName(voucher.getVoucherName());
			updatedVoucher.setValue(voucher.getValue());
			updatedVoucher.setType(voucher.getType());
			updatedVoucher.setStartDate(voucher.getStartDate());
			updatedVoucher.setExpiryDate(voucher.getExpiryDate());
			voucherReponsitory.save(updatedVoucher);
			return true;
		}
		return false;
	}

	@Override
	@Transactional
	public boolean updateStatusVoucher(int id, int status) {
		return voucherReponsitory.updateStatus(id, status) > 0;
	}

	// delete voucher by id
	public boolean deleteVoucher(int id) {
		if (voucherReponsitory.existsById(id)) {
			voucherReponsitory.deleteById(id);
			return true;
		}
		return false;
	}

	// total quantity voucher
	public int totalVouchers() {
		return voucherReponsitory.totalVouchers();
	}

	@Override
	public Page<Voucher> pageVouchers(Pageable pageable) {
		return voucherReponsitory.findAllByOrderByStartDateDesc(pageable);
	}
}
