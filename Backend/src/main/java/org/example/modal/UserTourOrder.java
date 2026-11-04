package org.example.modal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "user_tour_order")
@Getter
@Setter
@ToString
@NoArgsConstructor
public class UserTourOrder {

	@EmbeddedId
	private UserTourOrderKey id;

	@ManyToOne
	@MapsId("userId") // Chỉ ra rằng userId trong UserTourOrderKey là khóa ngoại
	@JoinColumn(name = "user_id") // Tên cột trong bảng UserTourOrder là user_id
	private Users user;

	@ManyToOne
	@MapsId("tourOrderId") // Chỉ ra rằng tourOrderId trong UserTourOrderKey là khóa ngoại
	@JoinColumn(name = "tour_order_id") // Tên cột trong bảng UserTourOrder là tour_order_id
	private TourOrder tourOrder;

	@Column(name = "status")
	private int status; // 0: Dang cho xu ly - 1: Da tiep nhan - 2: Da hoan thanh - -1:Da huy

	@Column(name = "tour_start_date")
	private Date tourStartDate;
	@Embeddable
	@Getter
	@Setter
	@ToString
	@NoArgsConstructor
	public static class UserTourOrderKey implements Serializable {
		@Column(name = "user_id")
		private int userId;

		@Column(name = "tour_order_id")
		private int tourOrderId;

	}
}
