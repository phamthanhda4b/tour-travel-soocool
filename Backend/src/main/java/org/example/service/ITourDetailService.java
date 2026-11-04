package org.example.service;

import org.example.dto.TourDetailDTO;
import org.example.dto.TourDetailDTOv2;
import org.example.modal.TourDetail;

import java.util.List;

public interface ITourDetailService {
	List<TourDetail> getAllTourDetail();

	TourDetailDTOv2 findTourDetailByTourId(String tourId);

	boolean createNewTourDetail(TourDetailDTO tourDetailDTO);

	boolean deleteTourDetail(int id);

	int sumTour();

	boolean updateTourDeltail(TourDetailDTO tourDetailDTO);
	boolean checkTourDeTailByIDTour(String id);
}
