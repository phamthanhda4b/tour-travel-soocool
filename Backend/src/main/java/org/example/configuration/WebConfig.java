package org.example.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		// Cho phép yêu cầu từ localhost:3124 (hoặc frontend của bạn)
		registry.addMapping("/**") // Cấu hình cho tất cả các endpoint
				.allowedOrigins("http://localhost:3124") // Địa chỉ frontend
				.allowedMethods("GET", "POST", "PUT", "DELETE") // Các phương thức HTTP cho phép
				.allowedHeaders("*") // Cho phép tất cả các header
				.allowCredentials(true); // Cho phép cookie trong CORS
	}
}
