package org.example.dto;

import java.util.Date;

public class TransportDTO {

	private int transportId;
	private long quantity;
	private Date orderDate;

	// Constructor
	public TransportDTO(int transportId, long quantity, Date orderDate) {
		this.transportId = transportId;
		this.quantity = quantity;
		this.orderDate = orderDate;
	}

	// Getters and Setters
	public int getTransportId() {
		return transportId;
	}

	public void setTransportId(int transportId) {
		this.transportId = transportId;
	}

	public long getQuantity() {
		return quantity;
	}

	public void setQuantity(long quantity) {
		this.quantity = quantity;
	}

	public Date getOrderDate() {
		return orderDate;
	}

	public void setOrderDate(Date orderDate) {
		this.orderDate = orderDate;
	}
}
