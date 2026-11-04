package org.example.mail;

import org.example.modal.PasswordResetToken;
import org.example.modal.Users;
import org.springframework.mail.SimpleMailMessage;

import java.util.Locale;

public interface ISendMailService {
	void sendPasswordResetEmail(String contextPath, Locale locale, String token, Users user);

	String validatePasswordResetToken(String token);

	boolean isTokenFound(PasswordResetToken passToken);

	boolean isTokenExpired(PasswordResetToken passToken);

	SimpleMailMessage constructResetTokenEmail(String contextPath, Locale locale, String token, Users user);

	SimpleMailMessage constructEmail(String subject, String body, Users user);
}
