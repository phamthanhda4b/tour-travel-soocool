package org.example.request;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
public class LoginRequest {
	@NotBlank(message = "Email cannot be blank")
	@JsonProperty("emailOrUserName")
	private String emailOrUserName;
	@NotBlank(message = "password cannot be blank")
	@JsonProperty("password")
	private String password;

	public LoginRequest(String emailOrUserName, String password) {
		this.emailOrUserName = emailOrUserName;
		this.password = password;
	}

	public LoginRequest() {
	}

	public @NotBlank(message = "Email cannot be blank") String getEmailOrUserName() {
		return emailOrUserName;
	}

	public void setEmailOrUserName(@NotBlank(message = "Email cannot be blank") String emailOrUserName) {
		this.emailOrUserName = emailOrUserName;
	}

	public @NotBlank(message = "password cannot be blank") String getPassword() {
		return password;
	}

	public void setPassword(@NotBlank(message = "password cannot be blank") String password) {
		this.password = password;
	}
}
