package org.example.response;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class JwtResponse {
	private int userId;
	private String token;
	private String userName;
	private String iat; // Dạng String (yyyy-MM-dd HH:mm:ss)
	private String exp; // Dạng String (yyyy-MM-dd HH:mm:ss)

	public JwtResponse(int userId, String token,String userName, String iat, String exp) {
		this.userId = userId;
		this.token = token;
		this.iat = iat;
		this.exp = exp;
		this.userName=userName;
	}

}
