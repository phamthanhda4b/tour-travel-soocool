package org.example.service;

import org.example.modal.UserTourOrder;
import org.example.reponsitory.UserTourOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserTourOrderService implements IUserTourOrderService {
	@Autowired
	private UserTourOrderRepository userTourOrderRepository;
	@Override
	public Page<UserTourOrder> pageUTOs(Pageable pageable,int status) {
		
		return userTourOrderRepository.findUserTourOrderByStatusOrderByIdDesc(pageable,status);
	}

	@Override
	public UserTourOrder findUserTourOrderById(int userId, int orderId) {
		UserTourOrder.UserTourOrderKey userTourOrderKey = new UserTourOrder.UserTourOrderKey();
		userTourOrderKey.setUserId(userId);
		userTourOrderKey.setTourOrderId(orderId);
		return userTourOrderRepository.findUserTourOrderById(userTourOrderKey);
	}

	@Override
	public void updateStatus(int userId, int orderId, int status) {
		UserTourOrder.UserTourOrderKey userTourOrderKey = new UserTourOrder.UserTourOrderKey();
		userTourOrderKey.setUserId(userId);
		userTourOrderKey.setTourOrderId(orderId);
		Optional<UserTourOrder> userTourOrder = userTourOrderRepository.findById(userTourOrderKey);
		if (userTourOrder.isPresent()) {
			userTourOrder.get().setStatus(status);
			userTourOrderRepository.save(userTourOrder.get());
		}
	}

}
