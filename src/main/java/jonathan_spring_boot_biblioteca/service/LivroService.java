package jonathan_spring_boot_biblioteca.service;

import jonathan_spring_boot_biblioteca.model.Livro;
import jonathan_spring_boot_biblioteca.repository.LivroRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LivroService {
    private LivroRepository livroRepository;

    public LivroService(LivroRepository livroRepository) {
        this.livroRepository = livroRepository;
    }
    public List<Livro> listar() {
        return livroRepository.findAll();
    }
    public Livro buscarPorId(Long id) {
        return livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
    }
    public Livro salvar(Livro livro) {
        return livroRepository.save(livro);
    }
    public Livro atualizar(Long id, Livro livro) {
        Livro livroExistente = buscarPorId(id);
        livroExistente.setTitulo(livro.getTitulo());
        livroExistente.setAutor(livro.getAutor());
        livroExistente.setCategoria(livro.getCategoria());
        livroExistente.setIsbn(livro.getIsbn());
        livroExistente.setQuantidadeTotal(livro.getQuantidadeTotal());
        livroExistente.setQuantidadeDisponivel(livro.getQuantidadeDisponivel());

        return livroRepository.save(livroExistente);

    }
    public void deletar(Long id) {
        Livro livro = buscarPorId(id);
        livroRepository.delete(livro);

    }
}
