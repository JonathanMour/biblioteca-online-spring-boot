package jonathan_spring_boot_biblioteca.service;

import jonathan_spring_boot_biblioteca.model.Perfil;
import jonathan_spring_boot_biblioteca.model.Usuario;
import jonathan_spring_boot_biblioteca.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado")
                );
    }

    public Usuario salvar(Usuario usuario) {

        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("E-mail já cadastrado");
        }

        if (usuarioRepository.findByCpf(usuario.getCpf()).isPresent()) {
            throw new RuntimeException("CPF já cadastrado");
        }

        usuario.setPerfil(Perfil.USUARIO);

        usuario.setSenha(
                passwordEncoder.encode(
                        usuario.getSenha()
                )
        );

        return usuarioRepository.save(usuario);
    }

    public Usuario atualizar(Long id, Usuario usuario) {

        Usuario usuarioExistente = buscarPorId(id);

        usuarioExistente.setNome(usuario.getNome());
        usuarioExistente.setEmail(usuario.getEmail());
        usuarioExistente.setTelefone(usuario.getTelefone());
        usuarioExistente.setCpf(usuario.getCpf());

        if (usuario.getSenha() != null && !usuario.getSenha().isBlank()) {

            usuarioExistente.setSenha(
                    passwordEncoder.encode(
                            usuario.getSenha()
                    )
            );
        }

        return usuarioRepository.save(usuarioExistente);
    }

    public void deletar(Long id) {

        Usuario usuario = buscarPorId(id);

        usuarioRepository.delete(usuario);
    }

    public Usuario login(String email, String senha) {

        Usuario usuario = usuarioRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "E-mail ou senha inválidos"
                        )
                );

        if (!passwordEncoder.matches(
                senha,
                usuario.getSenha()
        )) {
            throw new RuntimeException(
                    "E-mail ou senha inválidos"
            );
        }

        return usuario;
    }
    public Usuario buscarPorEmail(String email) {

        return usuarioRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado")
                );
    }
}