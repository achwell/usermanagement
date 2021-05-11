package net.axelwulff.usermanagement.configuration;

import java.util.List;
import net.axelwulff.usermanagement.filter.JwtAccessDeniedHandler;
import net.axelwulff.usermanagement.filter.JwtAuthenticationEntryPoint;
import net.axelwulff.usermanagement.filter.JwtAuthorizationFilter;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import static java.util.Arrays.asList;
import static org.apache.commons.lang3.ObjectUtils.isNotEmpty;
import static java.util.stream.Collectors.toList;
import static net.axelwulff.usermanagement.constant.SecurityConstant.PUBLIC_URLS;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpMethod.*;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;
import static org.springframework.http.HttpHeaders.*;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final JwtAuthorizationFilter jwtAuthorizationFilter;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final List<String> cors;

    public SecurityConfiguration(AppProperties appProperties, JwtAuthorizationFilter jwtAuthorizationFilter, JwtAccessDeniedHandler jwtAccessDeniedHandler, JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {
        this.cors = appProperties.getCorsallowedorigins().stream().filter(StringUtils::isNotBlank).collect(toList());
        this.jwtAuthorizationFilter = jwtAuthorizationFilter;
        this.jwtAccessDeniedHandler = jwtAccessDeniedHandler;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        HttpSecurity httpSecurity = http.sessionManagement().sessionCreationPolicy(STATELESS).and();
        if (isNotEmpty(cors)) {
            httpSecurity.cors().configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(cors);
                config.setAllowedMethods(asList(GET.name(), POST.name(), PUT.name(), DELETE.name(), OPTIONS.name()));
                config.setAllowCredentials(true);
                config.setAllowedHeaders(asList(ORIGIN, ACCESS_CONTROL_ALLOW_ORIGIN, CONTENT_TYPE, ACCEPT, "Jwt-Token", AUTHORIZATION, "Origin, Accept", "X-Requested-With", ACCESS_CONTROL_REQUEST_METHOD, ACCESS_CONTROL_REQUEST_HEADERS));
                config.setExposedHeaders(asList(ORIGIN, CONTENT_TYPE, ACCEPT, "Jwt-Token", AUTHORIZATION, ACCESS_CONTROL_ALLOW_ORIGIN, ACCESS_CONTROL_ALLOW_CREDENTIALS));
                config.setMaxAge(180L);
                return config;
            }).and();
        }
        httpSecurity
            .csrf().disable()
            .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeRequests()
                .antMatchers(OPTIONS, "/**").permitAll()
                .mvcMatchers(PUBLIC_URLS).permitAll()
                .anyRequest().authenticated()
                .and().headers().httpStrictTransportSecurity().disable()
                .and().headers().frameOptions().sameOrigin()
                .and().exceptionHandling()
                    .accessDeniedHandler(jwtAccessDeniedHandler)
                    .authenticationEntryPoint(jwtAuthenticationEntryPoint)
        ;
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
