package jonathan_spring_boot_biblioteca.controller;

import jonathan_spring_boot_biblioteca.model.Livro;
import jonathan_spring_boot_biblioteca.service.LivroService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/livros")
public class LivroController {

    private final LivroService livroService;

    public LivroController(LivroService livroService) {
        this.livroService = livroService;
    }

    @GetMapping
    public List<Livro> listar() {
        return livroService.listar();
    }
    @GetMapping("/{id}")
    public Livro buscarPorId(@PathVariable Long id) {
        return livroService.buscarPorId(id);
    }
    @PostMapping
    public Livro salvar(@RequestBody Livro livro) {
        return livroService.salvar(livro);
    }
    @PutMapping("/{id}")
    public Livro atualizar(@PathVariable Long id,
                           @RequestBody Livro livro) {
        return livroService.atualizar(id, livro);
    }
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        livroService.deletar(id);
    }
}