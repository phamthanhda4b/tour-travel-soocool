package org.example.controller;

import org.example.modal.Voucher;
import org.example.service.IVoucherService;
import org.example.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/vouchers")
public class VoucherController {
	@Autowired
	private IVoucherService voucherService;

	@GetMapping
	public List<Voucher> getAllVoucher() {
		return voucherService.getVouchers();
	}

	@GetMapping("/voucherId/{id}")
	public Voucher getVoucherById(@PathVariable int id) {
		Optional<Voucher> isExists = voucherService.findVoucherById(id);
		if (isExists.isPresent()) {
			return isExists.get();
		}
		return null;
	}

	@GetMapping("/TotalVoucher")
	public int getTotalVoucher() {
		return voucherService.totalVouchers();
	}

	@PostMapping
	public boolean addNewVoucher(@RequestBody Voucher voucher) {
		Voucher newVoucher = voucherService.createVoucher(voucher);
		if (newVoucher != null) {
			return true;
		}
		return false;
	}

	

	// update voucher.

	@PutMapping("/{id}")
	public boolean updateVoucher(@PathVariable("id") int id, @RequestBody Voucher voucher) {
		Optional<Voucher> isExists = voucherService.findVoucherById(id);
		if (isExists.isPresent()) {
			voucherService.updateVoucher(id, voucher);
			return true;
		}
		return false;
	}

	@DeleteMapping("/{id}")
	public boolean deleteVoucher(@PathVariable("id") int id) {
		Optional<Voucher> isExists = voucherService.findVoucherById(id);
		if (isExists.isPresent()) {
			voucherService.deleteVoucher(id);
			return true;
		}
		return false;
	}

	@PutMapping("/{id}/{status}")
	public boolean updateStatusVoucher(@PathVariable("id") int id, @PathVariable("status") int status) {
		return voucherService.updateStatusVoucher(id, status);
	}

	@GetMapping("/page")
	public Page<Voucher> pageVouchers(Pageable pageable) {
		return voucherService.pageVouchers(pageable);
	}

}
