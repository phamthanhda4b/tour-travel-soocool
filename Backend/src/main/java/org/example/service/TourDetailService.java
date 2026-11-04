package org.example.service;

import org.example.dto.TourDetailDTO;
import org.example.dto.TourDetailDTOv2;
import org.example.modal.TourDetail;
import org.example.reponsitory.TourDetailReponsitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TourDetailService implements ITourDetailService {
	@Autowired
	private TourDetailReponsitory tourDetailRepository;

	@Override
	public List<TourDetail> getAllTourDetail() {
		return tourDetailRepository.findAll();
	}

	// Xem theo id_tour
	@Override
	public TourDetailDTOv2 findTourDetailByTourId(String tourId) {
		TourDetail tourDetail = tourDetailRepository.findTourDetailByTourId(tourId);

		if (tourDetail == null) {
			// Xử lý khi không tìm thấy tourDetail
			throw new RuntimeException("TourDetail not found for ID: " + tourId);
		}
        return new TourDetailDTOv2(tourDetail);
	}

	// Add tour_detail
	@Override
	public boolean createNewTourDetail(TourDetailDTO tourDetailDTO) {
		TourDetail detail = new TourDetail();
		detail.setCuisine(tourDetailDTO.getCuisine());
		detail.setSaleDescription(tourDetailDTO.getSaleDescription());
		detail.setSightSeeing(tourDetailDTO.getSightSeeing());
		detail.setSuitablePeople(tourDetailDTO.getSuitablePeople());
		detail.setTransport(tourDetailDTO.getTransport());
		detail.setTimeSuitable(tourDetailDTO.getTimeSuitable());
		detail.setTour(tourDetailDTO.getTour());
		tourDetailRepository.save(detail);
		return true;
	}

	// Delete TourDetail by ID
	@Override
	public boolean deleteTourDetail(int id) {
		if (tourDetailRepository.existsById(id)) {
			tourDetailRepository.deleteById(id);
			return true;
		}
		return false; // Có thể thêm thông điệp ở đây nếu cần
	}

	@Override
	public int sumTour() {
		return tourDetailRepository.findAll().size();
	}

	@Override
	public boolean updateTourDeltail(TourDetailDTO tourDetailDTO) {
		Optional<TourDetail> tourDetailOptional = tourDetailRepository.findById(tourDetailDTO.getId());
		if(tourDetailOptional.isEmpty()) return false;
		TourDetail tourDetail = tourDetailOptional.get();
		tourDetail.setCuisine(tourDetailDTO.getCuisine());
		tourDetail.setSaleDescription(tourDetailDTO.getSaleDescription());
		tourDetail.setSightSeeing(tourDetailDTO.getSightSeeing());
		tourDetail.setSuitablePeople(tourDetailDTO.getSuitablePeople());
		tourDetail.setTransport(tourDetailDTO.getTransport());
		tourDetail.setTimeSuitable(tourDetailDTO.getTimeSuitable());
		tourDetailRepository.save(tourDetail);
        return true;
	}

	@Override
	public boolean checkTourDeTailByIDTour(String id) {
		TourDetail tourDetail = tourDetailRepository.findTourDetailByTourId(id);
		if(tourDetail == null ) return false;
		return true;

	}


}
