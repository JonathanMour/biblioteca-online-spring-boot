package jonathan_spring_boot_biblioteca.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PaginaController {

    // ==============================
    // ÁREA DO USUÁRIO
    // ==============================

    @GetMapping("/usuario")
    public String usuario() {
        return "forward:/usuario/usuario.html";
    }

    @GetMapping("/usuario/livros")
    public String livros() {
        return "forward:/usuario/livros.html";
    }

    @GetMapping("/usuario/emprestimos")
    public String meusEmprestimos() {
        return "forward:/usuario/meus-emprestimos.html";
    }

    @GetMapping("/usuario/devolucoes")
    public String minhasDevolucoes() {
        return "forward:/usuario/minhas-devolucoes.html";
    }

    @GetMapping("/usuario/perfil")
    public String meuPerfil() {
        return "forward:/usuario/meu-perfil.html";
    }


    // ==============================
    // LOGIN E CADASTRO
    // ==============================

    @GetMapping("/login")
    public String login() {
        return "forward:/login.html";
    }

    @GetMapping("/cadastro")
    public String cadastro() {
        return "forward:/cadastro.html";
    }


    // ==============================
    // ÁREA DO ADMIN
    // ==============================

    @GetMapping("/admin")
    public String admin() {
        return "forward:/admin/index.html";
    }

    @GetMapping("/admin/usuarios")
    public String usuarios() {
        return "forward:/admin/usuarios.html";
    }

    @GetMapping("/admin/livros")
    public String adminLivros() {
        return "forward:/admin/livros.html";
    }

    @GetMapping("/admin/novo-livro")
    public String novoLivro() {
        return "forward:/admin/novo-livro.html";
    }

    @GetMapping("/admin/emprestimos")
    public String emprestimos() {
        return "forward:/admin/emprestimos.html";
    }

    @GetMapping("/admin/devolucoes")
    public String devolucoes() {
        return "forward:/admin/devolucoes.html";
    }

    @GetMapping("/admin/configuracoes")
    public String configuracoes() {
        return "forward:/admin/configuracoes.html";
    }

    @GetMapping("/admin/relatorios")
    public String relatorios() {
        return "forward:/admin/relatorio.html";
    }
}