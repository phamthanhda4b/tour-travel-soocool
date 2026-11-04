package org.example.dto;

import java.util.List;

import jakarta.persistence.Column;
import org.example.modal.TourType;
import org.example.modal.Transport;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourDTO {
	private String tourId;

	private String name;

	private double tourPrice;

	private String tourImageLink;

	private String tourFileName;

	private String tourDestination;

	private String tourDeparturePoint;

	private String destinationSlug;

	private String departureSlug;

	private Transport transport;

	private TourTypeDTO tourType;

	private List<CalendarDTO> calendar;

	public TourDTO(String tourId, String name, double tourPrice, String tourImageLink, String tourFileName,
			String tourDestination, String tourDeparturePoint, Transport transport) {
		super();
		this.tourId = tourId;
		this.name = name;
		this.tourPrice = tourPrice;
		this.tourImageLink = tourImageLink;
		this.tourFileName = tourFileName;
		this.tourDestination = tourDestination;
		this.tourDeparturePoint = tourDeparturePoint;
		this.transport = transport;
	}
	
}
