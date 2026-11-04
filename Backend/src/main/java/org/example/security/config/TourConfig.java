package org.example.security.config;

import org.example.security.jwt.AuthTokenFilter;
import org.example.security.jwt.JwtAuthEntryPoint;
import org.example.security.user.TourUserDetailService;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@EnableWebSecurity
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class TourConfig {
	private final TourUserDetailService tourUserDetailService;
	private final JwtAuthEntryPoint authEntryPoint;
	private static final List<String> SECURED_URLS = List.of("/api");
	private static final List<String> PUBLIC_URLS = List.of(
			"/api/auth/login",
			"/api/User/users",
			"/api/User/resetPassword",
			"/api/User/savePassword",
			"/api/User/changePassword"
	);

	public TourConfig(TourUserDetailService tourUserDetailService, JwtAuthEntryPoint authEntryPoint) {
		this.tourUserDetailService = tourUserDetailService;
		this.authEntryPoint = authEntryPoint;
	}

//ModelMapper giup chuyen đổi dữ liệu DTO , như construcDTO
	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new PasswordEncoder() {
			private final PasswordEncoder bcryptEncoder = new BCryptPasswordEncoder();

			@Override
			public String encode(CharSequence rawPassword) {
				return bcryptEncoder.encode(rawPassword);
			}

			@Override
			public boolean matches(CharSequence rawPassword, String encodedPassword) {
				if (encodedPassword == null) {
					return false;
				}
				if (encodedPassword.equals(rawPassword)) {
					return true;
				}
				return bcryptEncoder.matches(rawPassword, encodedPassword);
			}

			@Override
			public boolean upgradeEncoding(String encodedPassword) {
				return encodedPassword != null && encodedPassword.startsWith("$2");
			}
		};
	}

	@Bean
	public AuthTokenFilter authTokenFilter() {
		return new AuthTokenFilter();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
			throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	public DaoAuthenticationProvider daoAuthenticationProvider() {
		var authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(tourUserDetailService);
		authProvider.setPasswordEncoder(passwordEncoder());
		return authProvider;
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(AbstractHttpConfigurer::disable)
				.exceptionHandling(exception -> exception.authenticationEntryPoint(authEntryPoint))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(PUBLIC_URLS.toArray(String[]::new)).permitAll()
						.requestMatchers(SECURED_URLS.toArray(String[]::new)).authenticated()
						.anyRequest().permitAll());
		http.authenticationProvider(daoAuthenticationProvider());
		http.addFilterBefore(authTokenFilter(), UsernamePasswordAuthenticationFilter.class);
		return http.build();

	}
}
