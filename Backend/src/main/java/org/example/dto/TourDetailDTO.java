package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.modal.Tour;
import org.example.modal.TourDetail;

@Data
@NoArgsConstructor
public class TourDetailDTO {
    private int id;
    private String sightSeeing;
    private String cuisine;
    private String suitablePeople;
    private String timeSuitable;
    private String transport;
    private String saleDescription;
    private Tour tour;
    public TourDetailDTO(TourDetail tourDetail){
        this.id = tourDetail.getId();
        this.sightSeeing = tourDetail.getSightSeeing();
        this.cuisine = tourDetail.getCuisine();
        this.suitablePeople = tourDetail.getSuitablePeople();
        this.timeSuitable = tourDetail.getTimeSuitable();
        this.saleDescription = tourDetail.getSaleDescription();
        this.transport = tourDetail.getTransport();
        this.tour=tourDetail.getTour();
    }
}
