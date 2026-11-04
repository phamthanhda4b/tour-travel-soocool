package org.example.exception;

//solve user problem not found
public class UserNameNotFoundException extends RuntimeException {
	public UserNameNotFoundException(String userNotFound) {
		super(userNotFound);
	}
}
