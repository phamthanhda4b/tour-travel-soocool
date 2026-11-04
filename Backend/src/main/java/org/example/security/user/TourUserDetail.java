package org.example.security.user;

import org.example.modal.Users;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

public class TourUserDetail implements UserDetails {
	private int id;
	private String username;
	private String email;
	private String password;
	private Collection<GrantedAuthority> authorities;

	public static String mapRoleToString(int role) {
		if (role == 0) {
			return "ROLE_USER";
		}
		return "ROLE_ADMIN";
	}

	public static TourUserDetail buildUserDetails(Users user) {
		String role = mapRoleToString(user.getRole());
		GrantedAuthority authority = new SimpleGrantedAuthority(role);

		return new TourUserDetail(user.getId(),user.getUserName() ,user.getEmail(), user.getPassWord(),
				Collections.singletonList(authority));
	}

	public TourUserDetail() {
	}

	public TourUserDetail(int id,String username, String email, String password, Collection<GrantedAuthority> authorities) {
		this.id = id;
		this.username=username;
		this.email = email;
		this.password = password;
		this.authorities = authorities;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setAuthorities(Collection<GrantedAuthority> authorities) {
		this.authorities = authorities;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return username;
	}

	@Override
	public boolean isAccountNonExpired() {
		return UserDetails.super.isAccountNonExpired();
	}

	@Override
	public boolean isAccountNonLocked() {
		return UserDetails.super.isAccountNonLocked();
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return UserDetails.super.isCredentialsNonExpired();
	}

	@Override
	public boolean isEnabled() {
		return UserDetails.super.isEnabled();
	}
}
