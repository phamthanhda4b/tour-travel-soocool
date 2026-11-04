package org.example.dto;

import org.example.modal.Calendar;
import org.example.modal.Tour;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.modal.Voucher;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
public class CalendarDTO {
	// private
//  private int calendarId;
//    private Timestamp calendarStartDate ;
//    private int calendarSlot
//
//
//
	private int calendarId;
	private Timestamp calendarStartDate;
	private int calendarSlot;
	private String tourId;
	private Voucher voucher;

	public CalendarDTO(Calendar calendar) {
		this.calendarId=calendar.getId();
		this.tourId = calendar.getTour().getId();
		this.calendarStartDate = calendar.getStartDate();
		this.voucher = calendar.getVoucher();
		this.calendarSlot = calendar.getSlot();
	}

}