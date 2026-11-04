package org.example.dto;

import java.util.List;

import org.example.modal.UserTourOrder;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class UserDTO {

	private String oldPassword;

	private String token;

	private String newPassword;
	
	private int id;

    private String userName;

    private String passWord;

    private String name;

    private String phoneNumber;

    private String email;

    private String address;

    private int role;

//    private List<UserTourOrder> userTourOrders;
}
