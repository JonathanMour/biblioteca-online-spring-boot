package jonathan_spring_boot_biblioteca.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http.csrf(csrf -> csrf.disable());

        http.authorizeHttpRequests(auth -> auth

                .requestMatchers(
                        "/",
                        "/index.html",
                        "/login",
                        "/login.html",
                        "/cadastro",
                        "/cadastro.html",
                        "/css/**",
                        "/js/**",
                        "/img/**"
                ).permitAll()

                .requestMatchers(HttpMethod.POST, "/usuarios").permitAll()

                .requestMatchers(HttpMethod.GET, "/livros", "/livros/**").permitAll()

                .requestMatchers("/usuarios/me").authenticated()

                .requestMatchers("/usuarios/**").hasRole("ADMIN")

                .requestMatchers("/admin/**").hasRole("ADMIN")

                .requestMatchers("/usuario/**").hasRole("USUARIO")

                .anyRequest()
                .authenticated()
        );

        http.formLogin(form -> form

                .loginPage("/login")

                .loginProcessingUrl("/login")

                .usernameParameter("email")
                .passwordParameter("senha")

                .successHandler((request, response, authentication) -> {

                    boolean admin = authentication
                            .getAuthorities()
                            .stream()
                            .anyMatch(authority ->
                                    authority.getAuthority()
                                            .equals("ROLE_ADMIN")
                            );

                    if (admin) {
                        response.sendRedirect("/admin");
                    } else {
                        response.sendRedirect("/usuario");
                    }
                })

                .failureUrl("/login?erro=true")
                .permitAll()
        );
        http.logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
                .permitAll()
        );
        http.logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
        );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}