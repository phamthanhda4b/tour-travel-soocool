package org.example.service;

import org.example.dto.TourDTOv2;
import org.example.form.TourFilterForm;
import org.example.modal.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface ITourService {

	// get all tour
	List<Tour> getAllTours();

	// create tour
	Tour createNewTour(Tour tour);

	// delete Tour By ID
	boolean deleteTourById(String id);

	// phan trang tour
	Page<Tour> getPageTours(Pageable pageable, Date date);

	// update tour by id
	// Tour updateTour(String id, Tour tourDetails);

	// search tour by name
	List<Tour> getTourByName(String Name);

	// bo loc tim kiem
	Page<Tour> filterTours(Pageable pageable, TourFilterForm tourFilterForm, String departure, String destination,
			Integer tourType, Integer transportId, Date startDate);

	Long totalTour();

	List<Long> getTotalByType();
	Page<TourDTOv2> getTours(int page, int size);

	Optional<TourDTOv2> getTourById(String tourId);
	Tour updateTour(String tourId, Tour updatedTour);
	List<TourDTOv2> getAllTour();
}
