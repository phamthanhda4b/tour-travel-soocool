package org.example.modal;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Member")
@Data
@NoArgsConstructor
public class Member {
	private static final long serialVersionUID = 1L;
	@Column(name = "id")
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "name")
	private String name;
	
	@Column(name = "gender")
	private String gender;
	
	@Column(name = "bod")
	private Date dob;
	
	@Column(name = "role")
	private int role; // 0:em be - 1:tre nho  - 2:Tre em - 3:Nguoi lon
	
	@ManyToOne
	@JoinColumn(name = "tour_order_id")
	private TourOrder tourOrder;

}
