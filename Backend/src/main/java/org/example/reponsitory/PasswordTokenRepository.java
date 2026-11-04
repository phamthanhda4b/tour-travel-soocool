package org.example.reponsitory;

import org.example.modal.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordTokenRepository extends JpaRepository<PasswordResetToken, Integer> {
	@Query("SELECT t FROM PasswordResetToken t WHERE t.token = :Param")
	PasswordResetToken findByToken(@Param("Param") String token);
}
