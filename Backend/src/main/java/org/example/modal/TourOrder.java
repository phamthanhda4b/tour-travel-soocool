package org.example.modal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "tour_order")
@Getter
@Setter
@ToString
@NoArgsConstructor
public class TourOrder {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;

	@Column(name = "total_price")
	private Double totalPrice;

	@Column(name = "note")
	private String note;

	@Column(name = "order_date")
	@CreationTimestamp
	@Temporal(TemporalType.TIMESTAMP)
	private Timestamp orderDate;

	@Column(name = "total_member")
	private int totalMember;

	@OneToOne
	@JoinColumn(name = "tour_id", referencedColumnName = "id")
	private Tour tour;

	@OneToMany(mappedBy = "tourOrder")
	private List<Member> members;
}
