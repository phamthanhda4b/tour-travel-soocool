package org.example.reponsitory;

import org.example.modal.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserReponsitory extends JpaRepository<Users, Integer> {
	@Query("SELECT COUNT(u.id) FROM Users u WHERE u.role = 0")
	int totalAccountUser();

	@Query("SELECT u FROM Users u WHERE u.email = :param OR u.userName = :param")
	Users findByEmailOrUsername(@Param("param") String param);

	boolean existsByEmail(String email);

	boolean existsByUserName(String userName);

	Users findByEmail(String email);

	Optional<Users> findById(int id);
	boolean existsById(int id);
}
