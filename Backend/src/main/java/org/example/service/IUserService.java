package org.example.service;

import org.example.modal.Users;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface IUserService {
	List<Users> getAllUSer();

	// create user
	void createNewUser(Users user);

	// finc user by email
	Users findUserByEmail(String email);

	// update user
	boolean updateUser(int userId, Users user);

	// get total account user
	int getTotalAccountUser();

	Optional<Users> getUserByPasswordResetToken(String token);

	void changeUserPassword(Users user, String password);

	// Lấy thông tin người dùng theo ID
	Users getUserById(int userId);
}
