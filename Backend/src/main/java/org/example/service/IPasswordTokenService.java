package org.example.service;

import org.example.modal.PasswordResetToken;

public interface IPasswordTokenService {
	void createNewPasswordToken(PasswordResetToken passwordResetToken);
}
