package org.example.modal;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name = "voucher")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Voucher {

	@Column(name = "id")
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "voucher_name")
	private String voucherName;

	@Column(name = "value")
	private int value;

	@Column(name = "type")
	private int type; // 0: phan tram - 1: Gia tri tien

	@Column(name = "status")
	private int status; // 0: Het han 1:Active -1: Khoa

	@Column(name = "start_date")
	private Timestamp startDate;

	@Column(name = "expiry_date")
	private Timestamp expiryDate;
}
