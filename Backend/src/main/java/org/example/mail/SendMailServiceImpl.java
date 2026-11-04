package org.example.mail;

import org.example.modal.PasswordResetToken;
import org.example.modal.Users;
import org.example.reponsitory.PasswordTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class SendMailServiceImpl implements ISendMailService {
	@Autowired
	private PasswordTokenRepository passwordTokenRepository;

	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	private MessageSource messages;

	@Value("${support.email}")
	private String supportEmail;

	@Override
	public void sendPasswordResetEmail(String contextPath, Locale locale, String token, Users user) {
		SimpleMailMessage email = constructResetTokenEmail(contextPath, locale, token, user);
		mailSender.send(email); // Gửi email qua JavaMailSender
	}

	@Override
	public String validatePasswordResetToken(String token) {
		PasswordResetToken passToken = passwordTokenRepository.findByToken(token);
		return !isTokenFound(passToken) ? "invalidToken" : isTokenExpired(passToken) ? "expired" : null;
	}

	@Override
	public boolean isTokenFound(PasswordResetToken passToken) {
		return passToken != null;
	}

	@Override
	public boolean isTokenExpired(PasswordResetToken passToken) {
		long currentTimeMillis = System.currentTimeMillis();
		long expiryTimeMillis = passToken.getExpiryDate().getTime();
		return expiryTimeMillis < currentTimeMillis;
	}

	@Override
	public SimpleMailMessage constructResetTokenEmail(String contextPath, Locale locale, String token, Users user) {
		if (locale == null) {
			locale = Locale.US; // Fallback cho locale mặc định
		}
		String url = contextPath + "/change-password?token=" + token;
		String message = messages.getMessage("message.resetPassword", null,
				"Vui lòng click vào đường link dưới đây để khôi phục mật khẩu", locale);
		return constructEmail("Reset Password", message + " \r\n" + url, user);
	}

	@Override
	public SimpleMailMessage constructEmail(String subject, String body, Users user) {
		SimpleMailMessage email = new SimpleMailMessage();
		email.setSubject(subject);
		email.setText(body);
		email.setTo(user.getEmail());
		email.setFrom(supportEmail);
		return email;
	}
}
