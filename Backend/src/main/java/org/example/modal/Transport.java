package org.example.modal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "transport")
@Getter
@Setter
@ToString
@NoArgsConstructor
public class Transport {
	@Column(name = "id")
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "name")
	private String name;
	public Transport(int id, String name) {
		this.id = id;
		this.name = name;
	}

}
