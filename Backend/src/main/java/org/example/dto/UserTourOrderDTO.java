package org.example.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.modal.UserTourOrder.UserTourOrderKey;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class UserTourOrderDTO {

	private UserTourOrderKey id;
	private UserDTO user;
	private TourOrderDTO tourOrder;
	private int status;
	private Date tourStartDate;
}
