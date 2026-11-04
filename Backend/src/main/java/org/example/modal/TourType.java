package org.example.modal;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "tour_type")
@Getter
@Setter
@ToString
@NoArgsConstructor
public class TourType {

	@Column(name = "id")
	@Id
	private int id;

	@Column(name = "name")
	private String name;

	@OneToMany
	@JoinColumn(name = "id", referencedColumnName = "id")
	private List<Tour> tours;
	public TourType(int id, String name){
		this.id = id;
		this.name = name;
	}

}
