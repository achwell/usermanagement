package net.axelwulff.usermanagement.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP;

@Configuration
public class OpenApiConfig {

    private final String appName;

    private final String description;

    private final String appVersion;

    public OpenApiConfig(@Value("${info.app.name}") String appName, @Value("${info.app.description}") String description, @Value("${info.app.version}") String appVersion) {
        this.appName = appName;
        this.description = description;
        this.appVersion = appVersion;
    }

    @Bean
    public OpenAPI api() {
        return new OpenAPI()
                .info(info())
                .addSecurityItem(security())
                .components(components());
    }

    private Components components() {
        Components components = new Components();
        SecurityScheme securityScheme = new SecurityScheme();
        securityScheme.type(HTTP);
        securityScheme.scheme("bearer");
        securityScheme.bearerFormat("JWT");
        components.addSecuritySchemes("bearerAuth", securityScheme);
        return components;
    }

    private SecurityRequirement security() {
        SecurityRequirement securityRequirement = new SecurityRequirement();
        securityRequirement.addList("bearerAuth");
        return securityRequirement;
    }

    private Info info() {
        return new Info()
                .title(appName)
                .description(description)
                .version(appVersion);
    }
}
