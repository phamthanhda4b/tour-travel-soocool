package org.example.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.example.dto.TourDTO;
import org.example.dto.UserTourOrderDTO;
import org.example.modal.Tour;
import org.example.modal.UserTourOrder;
import org.example.service.IUserTourOrderService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
public class UserTourOrderController {
	@Autowired
	private IUserTourOrderService userTourOrderService;
	@Autowired
	private ModelMapper modelMapper;
	@GetMapping
	public Page<UserTourOrderDTO> pageUTOs(Pageable pageable, @RequestParam(required = false) int status) {
	    Page<UserTourOrder> pageUTOs = userTourOrderService.pageUTOs(pageable,status);

	    // Ánh xạ từ List<UserTourOrder> sang List<UserTourOrderDTO>
	    List<UserTourOrderDTO> pageUTOsDTO = pageUTOs.getContent().stream()
	            .map(uto -> modelMapper.map(uto, UserTourOrderDTO.class))
	            .collect(Collectors.toList());

	    // Tạo Page<UserTourOrderDTO> từ List<UserTourOrderDTO>
	    Page<UserTourOrderDTO> dtoPage = new PageImpl<>(pageUTOsDTO, pageable, pageUTOs.getTotalElements());
	    return dtoPage;
	}
	@GetMapping("/utos-by-order")
	public UserTourOrderDTO findUserTourOrderById(@RequestParam int userId, @RequestParam int orderId){
		UserTourOrder uto = userTourOrderService.findUserTourOrderById(userId,orderId);
		UserTourOrderDTO userTourOrderDTO = modelMapper.map(uto, UserTourOrderDTO.class);
		return userTourOrderDTO;
	}

	@PutMapping
	public void updateStaus (@RequestParam int userId, @RequestParam int orderId, @RequestParam int status) {
		userTourOrderService.updateStatus(userId,orderId,status);
	}

}
