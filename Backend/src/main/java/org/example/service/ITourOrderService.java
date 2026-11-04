package org.example.service;

import org.example.dto.TourOrderDTO;
import org.example.dto.TourOrderStats;
import org.example.modal.TourOrder;

import java.util.List;

public interface ITourOrderService {
	List<TourOrderDTO> getAllTourOrder();

	Double getRevenue(String type);

	List<TourOrderDTO> listTopTours(String type);

	int countTourOrderByMonth();

	void createNewTourOrder(TourOrder tourOrder, String tourId);

	int totalTourOrderByType(String type);

	TourOrderStats getTourOrderStatsByMonth();

	List<TourOrderDTO> listTourOrderStatsByType(String type);
}
