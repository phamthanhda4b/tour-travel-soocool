package org.example;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {
	public static void main(String[] args) {
		Dotenv dotenv = null;
		try {
			dotenv = Dotenv.configure().ignoreIfMissing().ignoreIfMalformed().load();
		} catch (Exception ignored) {
			// Ignore missing or malformed .env files in Docker/container environments.
		}

		String mailUsername = System.getenv("MAIL_USERNAME");
		if (mailUsername == null && dotenv != null) {
			mailUsername = dotenv.get("MAIL_USERNAME");
		}
		if (mailUsername != null) {
			System.setProperty("MAIL_USERNAME", mailUsername);
		}

		String mailPassword = System.getenv("MAIL_PASSWORD");
		if (mailPassword == null && dotenv != null) {
			mailPassword = dotenv.get("MAIL_PASSWORD");
		}
		if (mailPassword != null) {
			System.setProperty("MAIL_PASSWORD", mailPassword);
		}

		SpringApplication.run(Main.class, args);
	}
}