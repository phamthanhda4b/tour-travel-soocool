package org.example.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.example.dto.TourDTO;
import org.example.dto.UserDTO;
import org.example.exception.ExistedException;
import org.example.exception.UserException;
import org.example.mail.GenericResponse;
import org.example.mail.ISendMailService;
import org.example.modal.PasswordResetToken;
import org.example.modal.Tour;
import org.example.modal.Users;
import org.example.response.ApiResponse;
import org.example.service.IPasswordTokenService;
import org.example.service.IUserService;
import org.example.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import static org.example.modal.PasswordResetToken.EXPIRATION;
import static org.springframework.http.HttpStatus.CONFLICT;

import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/User")
public class UserController {
	@Autowired
	private IUserService userService;
	@Autowired
	private ISendMailService sendMailService;
	@Autowired
	private MessageSource messages;
	@Autowired
	private JavaMailSender mailSender;
	@Autowired
	private IPasswordTokenService passwordResetToken;
	@Autowired
	private ModelMapper modelMapper;
	@GetMapping("/users")
	public List<UserDTO> getUsers() {
		List<Users> uses = userService.getAllUSer();
		List<UserDTO> toursdto = uses.stream()
				.map(u -> modelMapper.map(u, UserDTO.class)) // Ánh xạ từng đối tượng
				.collect(Collectors.toList());
		return toursdto;
	}


	@PostMapping("/users")
	public ResponseEntity<ApiResponse> addNewUser(@RequestBody Users user) {
		try {
			userService.createNewUser(user);
			return ResponseEntity.ok(new ApiResponse("Create Successful", user));
		} catch (ExistedException e) {
			return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), null));
		}
	}

	@PutMapping("/users/{userID}")
	public boolean updateUser(@RequestBody Users user, @PathVariable int userID) {
		return userService.updateUser(userID, user);
	}

	@GetMapping("/TotalUsers")
	public int getTotalUsers() {
		return userService.getTotalAccountUser();
	}

	@GetMapping("Users/{email}")
	public Users getbyEmail(@PathVariable("email") String email) {
		return userService.findUserByEmail(email);
	}

	@PostMapping("/resetPassword")
	public GenericResponse resetPassword(HttpServletRequest request, @RequestParam("email") String userEmail) {
		Users user = userService.findUserByEmail(userEmail);
		if (user == null) {
			throw new UserException("No user found with email: " + userEmail);
		}


		
		// Tạo token mới và thiết lập thời gian hết hạn
		PasswordResetToken token = new PasswordResetToken();
		token.setToken(UUID.randomUUID().toString());
		token.setUser(user);
		Timestamp now = new Timestamp(System.currentTimeMillis());
		Timestamp expiryDate = new Timestamp(now.getTime() + (EXPIRATION * 60 * 1000)); // 24 giờ
		token.setExpiryDate(expiryDate);
		token.setCreatedAt(now);

		// Lưu token vào csdl
		passwordResetToken.createNewPasswordToken(token);

		// Gửi email chứa token reset mật khẩu
		SimpleMailMessage mail = sendMailService.constructResetTokenEmail("http://localhost:3124", request.getLocale(),
				token.getToken(), user);
		mailSender.send(mail);

		// Trả về thông báo thành công
		String message = messages.getMessage("message.resetPassword", null, "Vui lòng kiểm tra email của bạn",
				request.getLocale());
		return new GenericResponse(message);
	}

	@GetMapping("/changePassword")
	public ResponseEntity<?> showChangePasswordPage(Locale locale, @RequestParam("token") String token) {
		String result = sendMailService.validatePasswordResetToken(token);
		if (result != null) {
			String message = messages.getMessage("auth.message." + result, null, locale);
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new GenericResponse(message));
		}
		return ResponseEntity.ok(new GenericResponse("Token hợp lệ. Tiến hành đặt lại mật khẩu."));
	}

	@PostMapping("/savePassword")
	public GenericResponse savePassword(final Locale locale, @RequestBody UserDTO userDTO) {
		String result = sendMailService.validatePasswordResetToken(userDTO.getToken());
		if (result != null) {
			String message = messages.getMessage("message.resetPassword", null, "Lỗi trong quá trình đặt lại mật khẩu",
					locale);
			return new GenericResponse(message);
		}

		Optional<Users> user = userService.getUserByPasswordResetToken(userDTO.getToken());
		if (user.isPresent()) {
			userService.changeUserPassword(user.get(), userDTO.getNewPassword());
			return new GenericResponse(
					messages.getMessage("message.resetPasswordSuc", null, "Thay đổi mật khẩu thành công", locale));
		} else {
			return new GenericResponse(messages.getMessage("auth.message.invalid", null, locale));
		}
	}

	private String getAppUrl(HttpServletRequest request) {
		return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/api/User"
				+ request.getContextPath();
	}

	@PutMapping("/lock/{userId}")
	public ResponseEntity<ApiResponse> lockUser(@PathVariable("userId") int userId) {
		try {
			// Kiểm tra xem người dùng có tồn tại không
			Users user = userService.getUserById(userId);
			if (user == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body(new ApiResponse("User not found", null));
			}

			// Kiểm tra nếu người dùng đã bị khóa
			if (user.getRole() == -1) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body(new ApiResponse("User is already locked", null));
			}

			// Cập nhật role thành -1 (khóa người dùng)
			user.setRole(-1);
			userService.updateUser(userId, user);

			return ResponseEntity.ok(new ApiResponse("User locked successfully", user));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ApiResponse("Error locking user: " + e.getMessage(), null));
		}
	}

	@PutMapping("/refresh/{userId}")
	public ResponseEntity<ApiResponse> unlockUser(@PathVariable("userId") int userId) {
		try {
			// Kiểm tra xem người dùng có tồn tại không
			Users user = userService.getUserById(userId);
			if (user == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body(new ApiResponse("User not found", null));
			}

			// Kiểm tra nếu người dùng đang bị khóa (role = -1)
			if (user.getRole() != -1) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body(new ApiResponse("User is not locked", null));
			}

			// Cập nhật role thành 0 (mở khóa người dùng)
			user.setRole(0);
			userService.updateUser(userId, user);

			return ResponseEntity.ok(new ApiResponse("User unlocked successfully", user));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ApiResponse("Error unlocking user: " + e.getMessage(), null));
		}
	}

}

