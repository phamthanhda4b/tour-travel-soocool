package org.example.controller;

import jakarta.validation.Valid;
import org.example.request.LoginRequest;
import org.example.response.ApiResponse;
import org.example.response.JwtResponse;
import org.example.security.jwt.JwtUtils;
import org.example.security.user.TourUserDetail;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api")
public class AuthController {

	private final AuthenticationManager authenticationManager;
	private final JwtUtils jwtUtils;

	@Value("${auth.token.expirationInMils}")
	private int expTime; // thời gian hết hạn token tính bằng mili giây

	public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
		this.authenticationManager = authenticationManager;
		this.jwtUtils = jwtUtils;
	}

	@PostMapping("/auth/login")
	public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
		try {
			// Xác thực thông tin đăng nhập
			Authentication authentication = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(request.getEmailOrUserName(), request.getPassword()));
			SecurityContextHolder.getContext().setAuthentication(authentication);

			// Tạo JWT token. 
			String jwt = jwtUtils.generateTokenForUser(authentication);

			// Lấy thông tin người dùng
			TourUserDetail tourUserDetail = (TourUserDetail) authentication.getPrincipal();

			// Lấy thời gian tạo token và thời gian hết hạn
			long issuedAt = Instant.now().getEpochSecond();
			long expirationTime = issuedAt + (expTime / 1000); // chuyển mili giây thành giây

			// Chuyển đổi thời gian tạo token và thời gian hết hạn thành ZonedDateTime với
			// múi giờ VN (Asia/Ho_Chi_Minh)
			ZonedDateTime issuedAtZonedDateTime = ZonedDateTime.ofInstant(Instant.ofEpochSecond(issuedAt),
					ZoneId.of("Asia/Ho_Chi_Minh"));
			ZonedDateTime expirationTimeZonedDateTime = ZonedDateTime.ofInstant(Instant.ofEpochSecond(expirationTime),
					ZoneId.of("Asia/Ho_Chi_Minh"));

			// Định dạng thời gian
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
			String formattedIssuedAt = issuedAtZonedDateTime.format(formatter);
			String formattedExpirationTime = expirationTimeZonedDateTime.format(formatter);
			// Tạo đối tượng JwtResponse bao gồm thông tin thời gian
			JwtResponse jwtResponse = new JwtResponse(tourUserDetail.getId(),jwt,tourUserDetail.getUsername(), formattedIssuedAt,
					formattedExpirationTime);

			// Trả về phản hồi với JWT và thông tin thời gian
			return ResponseEntity.ok(new ApiResponse("Login Successful", jwtResponse));
		} catch (AuthenticationException e) {
			// Xử lý khi đăng nhập thất bại
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(e.getMessage(), null));
		}
	}
}
