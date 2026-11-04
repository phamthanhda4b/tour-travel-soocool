package org.example.controller;

import org.example.dto.TourDTO;
import org.example.dto.TourDTOv2;
import org.example.form.TourFilterForm;
import org.example.modal.Tour;
import org.example.service.ITourService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/tours")
public class TourController {

	@Autowired
	private ITourService tourService;
	@Autowired
	private ModelMapper modelMapper;

	// get all tour
	@GetMapping
	public List<Tour> listAllTours() {
		return tourService.getAllTours();
	}
	@GetMapping("tours")
	public List<TourDTOv2> tourDTOv2List(){
		return tourService.getAllTour();
	}

	// get tour by name
	@GetMapping("/search")
	public List<Tour> getTourByName(@RequestParam("tourName") String tourName) {
		return tourService.getTourByName(tourName);
	}

	// add tour
	@PostMapping
	public Tour addNewTour(@RequestBody Tour tour) {
		Tour newTour = tourService.createNewTour(tour);
		return new ResponseEntity<>(newTour, HttpStatus.CREATED).getBody();
	}

	// delete tour by id
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteTour(@PathVariable("id") String id) {
		boolean isDeleted = tourService.deleteTourById(id);
		if (isDeleted) {
			return ResponseEntity.noContent().build(); // 204 No Content
		} else {
			return ResponseEntity.notFound().build(); // 404 Not Found
		}
	}


	// Phan trang tour
	@GetMapping("/page")
	public Page<TourDTO> getToursByPage(Pageable pageable) {
		Date date = new Date();

		Page<Tour> pageTours = tourService.getPageTours(pageable, date);

		// Ánh xạ từ List<Tour> sang List<TourDTO>
		List<TourDTO> toursDTO = pageTours.getContent().stream().map(tour -> modelMapper.map(tour, TourDTO.class))
				.collect(Collectors.toList());

		// Tạo Page<TourDTO> từ List<TourDTO>
		Page<TourDTO> dtoTours = new PageImpl<>(toursDTO, pageable, pageTours.getTotalElements());

		return dtoTours;
	}

	@GetMapping("/filter-tour")
	public Page<TourDTO> filterTours(Pageable pageable, TourFilterForm tourFilterForm,
									 @RequestParam(name="departure", required = false) String departure,
									 @RequestParam(name="destination", required = false) String destination,
									 @RequestParam(name="tourType", required = false) Integer tourType,
									 @RequestParam(name="transportId", required = false) Integer transportId,
									 @RequestParam(name="startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate) {

		Page<Tour> pageTours = tourService.filterTours(pageable, tourFilterForm, departure, destination, tourType, transportId, startDate);

		// Ánh xạ từ List<Tour> sang List<TourDTO>
		List<TourDTO> dtoTours = modelMapper.map(pageTours.getContent(), new TypeToken<List<TourDTO>>(){}.getType());
		Page<TourDTO> dtoTour = new PageImpl<>(dtoTours, pageable, pageTours.getTotalElements());
		return dtoTour;
	}

	@GetMapping("/total")
	public long getTotal() {
		return tourService.totalTour();
	}
	@GetMapping("/totalType")
	public List<Long> getTotalType(){
		return tourService.getTotalByType();
	}
	@GetMapping("/admin/page")
	public ResponseEntity<Page<TourDTOv2>> getTours(
			@RequestParam(name = "page",defaultValue = "0") int page,
			@RequestParam(name = "size",defaultValue = "5") int size
	) {
		Page<TourDTOv2> tours = tourService.getTours(page, size);
		return ResponseEntity.ok(tours);
	}
	@GetMapping("tour/{tourId}")
	public ResponseEntity<TourDTOv2> getTourById(@PathVariable("tourId") String tourId){
		Optional<TourDTOv2> tour =tourService.getTourById(tourId);
		return tour.map(value -> new ResponseEntity<>(value, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}
	@PutMapping("tour/{tourId}")
	public ResponseEntity<Tour> updateTour(@PathVariable("tourId") String tourId, @RequestBody Tour updatedTour) {
		Tour tour = tourService.updateTour(tourId, updatedTour);
		if (tour != null) {
			return new ResponseEntity<>(HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
}
