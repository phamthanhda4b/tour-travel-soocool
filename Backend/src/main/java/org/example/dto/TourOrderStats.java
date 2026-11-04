package org.example.dto;

import java.util.List;

public class TourOrderStats {
	private List<String> month;
	private List<Integer> totalOrder;

	public TourOrderStats(List<String> month, List<Integer> totalOrder) {
		this.month = month;
		this.totalOrder = totalOrder;
	}

	public TourOrderStats() {
	}

	public List<String> getMonth() {
		return month;
	}

	public void setMonth(List<String> month) {
		this.month = month;
	}

	public List<Integer> getTotalOrder() {
		return totalOrder;
	}

	public void setTotalOrder(List<Integer> totalOrder) {
		this.totalOrder = totalOrder;
	}
}
