package jonathan_spring_boot_biblioteca.controller;

import jonathan_spring_boot_biblioteca.dto.UsuarioResponseDTO;
import jonathan_spring_boot_biblioteca.model.Usuario;
import jonathan_spring_boot_biblioteca.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://127.0.0.1:5501")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<Usuario> listar() {
        return usuarioService.listar();
    }

    @GetMapping("/{id}")
    public Usuario buscarPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Usuario usuario) {

        try {

            return ResponseEntity.ok(
                    usuarioService.salvar(usuario)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Usuario atualizar(
            @PathVariable Long id,
            @RequestBody Usuario usuario
    ) {

        return usuarioService.atualizar(
                id,
                usuario
        );
    }

    /* ATUALIZAR PRÓPRIO PERFIL */

    @PutMapping("/me")
    public Usuario atualizarMeuPerfil(
            Authentication authentication,
            @RequestBody Usuario usuario
    ) {

        String email =
                authentication.getName();

        Usuario usuarioLogado =
                usuarioService.buscarPorEmail(email);

        return usuarioService.atualizar(
                usuarioLogado.getId(),
                usuario
        );
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        usuarioService.deletar(id);
    }

    @PostMapping("/login")
    public Usuario login(
            @RequestBody Usuario usuario
    ) {

        return usuarioService.login(
                usuario.getEmail(),
                usuario.getSenha()
        );
    }

    /* USUÁRIO LOGADO */

    @GetMapping("/me")
    public UsuarioResponseDTO usuarioLogado(
            Authentication authentication
    ) {

        String email =
                authentication.getName();

        Usuario usuario =
                usuarioService.buscarPorEmail(email);

        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone(),
                usuario.getCpf(),
                usuario.getPerfil()
        );
    }
}