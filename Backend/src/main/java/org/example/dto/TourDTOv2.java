package org.example.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.modal.Tour;
@Data
@NoArgsConstructor
public class TourDTOv2 {
    private String tourId;
    private String name;
    private double tourPrice;
    private String tourImageLink;

    private String tourDestination;

    private String tourDeparturePoint;

    private String nameTransport;

    private String nameType;


    public TourDTOv2(Tour tour){
        this.tourId = tour.getId();
        this.name=tour.getName();
        this.tourPrice = tour.getPrice();
        this.tourImageLink = tour.getImageLink();
        this.tourDestination=tour.getDestination();
        this.tourDeparturePoint = tour.getDeparturePoint();
        this.nameTransport = tour.getTransport().getName();
        this.nameType=tour.getTourType().getName();
    }
}
