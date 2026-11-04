package org.example.service;

import org.example.modal.UserTourOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IUserTourOrderService {
	
	// Lay danh sach
	Page<UserTourOrder> pageUTOs(Pageable pageable, int status);

	// findByTourOrderId
	UserTourOrder findUserTourOrderById(int userId, int orderId);

	// update status
	void updateStatus(int userId, int orderId, int status);
	
}
