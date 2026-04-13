package com.carinosas.apigateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Map;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(Customizer.withDefaults())
                .authorizeExchange(exchanges -> exchanges
                        // Actuator - no token needed
                        .pathMatchers("/actuator/**").permitAll()

                        // CORS preflight - must be allowed without auth
                        .pathMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()

                        // GET - all roles can read
                        .pathMatchers(HttpMethod.GET, "/api/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_DETECTIVE", "ROLE_ANALYST")

                        // DELETE - only ADMIN
                        .pathMatchers(HttpMethod.DELETE, "/api/**")
                        .hasAuthority("ROLE_ADMIN")

                        // POST, PUT, PATCH - ADMIN and DETECTIVE
                        .pathMatchers(HttpMethod.POST, "/api/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_DETECTIVE")
                        .pathMatchers(HttpMethod.PUT, "/api/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_DETECTIVE")
                        .pathMatchers(HttpMethod.PATCH, "/api/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_DETECTIVE")

                        // Everything else needs login
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(keycloakJwtConverter()))
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public ReactiveJwtAuthenticationConverter keycloakJwtConverter() {
        ReactiveJwtAuthenticationConverter converter = new ReactiveJwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
            if (realmAccess == null) return Flux.empty();

            List<String> roles = (List<String>) realmAccess.get("roles");
            if (roles == null) return Flux.empty();

            return Flux.fromIterable(roles)
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
        });

        return converter;
    }
}