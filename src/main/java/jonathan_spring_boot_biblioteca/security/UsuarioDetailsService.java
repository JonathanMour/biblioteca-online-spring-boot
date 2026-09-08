package jonathan_spring_boot_biblioteca.security;

import jonathan_spring_boot_biblioteca.model.Usuario;
import jonathan_spring_boot_biblioteca.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UsuarioDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        Usuario usuario = usuarioRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Usuário não encontrado."
                        )
                );
        System.out.println("EMAIL: " + usuario.getEmail());
        System.out.println("PERFIL: " + usuario.getPerfil());
        System.out.println("SENHA COMEÇA COM: " +
                usuario.getSenha().substring(0, Math.min(7, usuario.getSenha().length())));
        return new UsuarioDetails(usuario);

    }

}
