package org.example.service;

import org.example.modal.PasswordResetToken;
import org.example.reponsitory.PasswordTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PasswordTokenServiceimpl implements IPasswordTokenService {
	@Autowired
	private PasswordTokenRepository passwordTokenRepository;

	@Override
	public void createNewPasswordToken(PasswordResetToken passwordResetToken) {
		passwordTokenRepository.save(passwordResetToken);
	}
}
