package org.example.configuration;

import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfig {
	@Bean
	public OpenAPI openAPI() {
		return new OpenAPI()
				.info(new Info().title("API Document Test").version("1.0").description("API Document")
						.license(new License().name("API License").url("https://github.com/M/Example/API-Document")))
				.servers(List.of(new Server().url("http://localhost:8080/")));
	}

	@Bean
	public GroupedOpenApi groupedOpenApi() {
		return GroupedOpenApi.builder().group("Api-service-1").packagesToScan("org.example.controller").build();
	}
}
