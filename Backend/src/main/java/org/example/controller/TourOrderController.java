package org.example.controller;

import org.example.dto.TourOrderDTO;
import org.example.dto.TourOrderStats;
import org.example.modal.TourOrder;
import org.example.service.ITourOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class TourOrderController {
	@Autowired
	private ITourOrderService tourOrderService;

	@GetMapping("/TourOrders")
	public List<TourOrderDTO> getTourOrders() {
		return tourOrderService.getAllTourOrder();
	}

	@GetMapping("/Revenue/{type}")
	public Double getRevenue(@PathVariable("type") String type) {
		return tourOrderService.getRevenue(type);
	}

	@GetMapping("/TopTour")
	public List<TourOrderDTO> getTopTour(@RequestParam("type") String type) {
		return tourOrderService.listTopTours(type);
	}

	@GetMapping("/TourOrderByMonth")
	public int getTourOrderByMonth() {
		return tourOrderService.countTourOrderByMonth();
	}

	@PostMapping("/TourOrders/{tourID}")
	public void addTourOrder(@RequestBody TourOrder tourOrder, @PathVariable("tourID") String tourID) {
		tourOrderService.createNewTourOrder(tourOrder, tourID);
	}

	@GetMapping("/TourOrders/TourOrdersByType/{type}")
	public int totalIn(@PathVariable("type") String type) {
		return tourOrderService.totalTourOrderByType(type);
	}

	@GetMapping("/TourOrders/statsbyMonth")
	public TourOrderStats getOrderStats() {
		return tourOrderService.getTourOrderStatsByMonth();
	}

	@GetMapping("/TourOrders/StatsRevenue/{type}")
	public List<TourOrderDTO> getRevenueStats(@PathVariable("type") String type) {
		return tourOrderService.listTourOrderStatsByType(type);
	}
}
