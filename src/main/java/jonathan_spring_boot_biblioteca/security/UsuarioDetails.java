package jonathan_spring_boot_biblioteca.security;
import jonathan_spring_boot_biblioteca.model.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UsuarioDetails implements UserDetails {

    public UsuarioDetails(Usuario usuario) {
        this.usuario = usuario;
    }

    private Usuario usuario;

    @Override
    public String getUsername() {
        return usuario.getEmail();
    }

    @Override
    public String getPassword() {
        return usuario.getSenha();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + usuario.getPerfil())
        );
    }
}