package org.example.modal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "`tour_detail`")
@Getter
@Setter
@ToString
@NoArgsConstructor
public class TourDetail {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;
	@Column(name = "file_name")
	private String fileName;
	@Column(name = "url")
	private String url;
	@Column(name = "sight_seeing")
	private String sightSeeing;
	@Column(name = "cuisine")
	private String cuisine;
	@Column(name = "suitable_people")
	private String suitablePeople;
	@Column(name = "time_suiable")
	private String timeSuitable;
	@Column(name = "transport")
	private String transport;
	@Column(name = "sale_description")
	private String saleDescription;
	@OneToOne
	@JoinColumn(name = "tour_id", referencedColumnName = "id")
	private Tour tour;

}