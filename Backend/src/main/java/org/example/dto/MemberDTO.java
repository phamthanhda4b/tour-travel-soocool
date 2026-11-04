package org.example.dto;

import java.util.Date;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MemberDTO {
	private int id;
	
	private String name;
	
	private String gender;

	private Date dob;

	private int role;
	
	private int tourOrderId;
}
