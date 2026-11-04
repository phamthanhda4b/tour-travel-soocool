package org.example.controller;

import org.example.dto.TourDetailDTO;
import org.example.dto.TourDetailDTOv2;
import org.example.modal.TourDetail;
import org.example.service.ITourDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/TourDetail")
public class TourDetailController {
	@Autowired
	private ITourDetailService tourDetailService;

	@GetMapping("/TourDetails")
	public ResponseEntity<List<TourDetail>> listTourDetail() {
		List<TourDetail> tourDetails = tourDetailService.getAllTourDetail();
		return new ResponseEntity<>(tourDetails, HttpStatus.OK);
	}

	@GetMapping("/TourDetails/{tourId}")
	public ResponseEntity<TourDetailDTOv2> tourDetailById(@PathVariable("tourId") String tourId) {
		TourDetailDTOv2 tourDetailDTO = tourDetailService.findTourDetailByTourId(tourId);
		if (tourDetailDTO == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<>(tourDetailDTO, HttpStatus.OK);
	}

	@PostMapping("/TourDetail")
	public boolean addNewTourDetail(@RequestBody TourDetailDTO tourDetailDTO) {
		return tourDetailService.createNewTourDetail(tourDetailDTO);
	}
	@PutMapping("/TourDetails")
	public boolean updateTourDetail(@RequestBody TourDetailDTO tourDetailDTO){
		return tourDetailService.updateTourDeltail(tourDetailDTO);
	}
//add more 
	@GetMapping("/TourDetals/total")
	public int getTotalTour() {
		return tourDetailService.sumTour();
	}
	@GetMapping("TourDetail/exist/{tourId}")
	public boolean checkTourDetailByTourId(@PathVariable("tourId") String tourId){
		return tourDetailService.checkTourDeTailByIDTour(tourId);
	}
}
