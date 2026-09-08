package jonathan_spring_boot_biblioteca.service;

import jonathan_spring_boot_biblioteca.model.Emprestimo;
import jonathan_spring_boot_biblioteca.model.Livro;
import jonathan_spring_boot_biblioteca.repository.EmprestimoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.time.LocalDate;

@Service
public class EmprestimoService {

    private final EmprestimoRepository emprestimoRepository;
    private final LivroService livroService;

    public EmprestimoService(
            EmprestimoRepository emprestimoRepository,
            LivroService livroService
    ) {
        this.emprestimoRepository = emprestimoRepository;
        this.livroService = livroService;
    }

    public List<Emprestimo> listar() {
        return emprestimoRepository.findAll();
    }

    public Emprestimo buscarPorId(Long id) {
        return emprestimoRepository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Empréstimo não encontrado"
                        )
                );
    }

    public Emprestimo salvar(Emprestimo emprestimo) {

        if (emprestimo.getLivro() == null ||
                emprestimo.getLivro().getId() == null) {

            throw new RuntimeException(
                    "Livro não informado"
            );
        }

        if (emprestimo.getUsuario() == null ||
                emprestimo.getUsuario().getId() == null) {

            throw new RuntimeException(
                    "Usuário não informado"
            );
        }

        Livro livro =
                livroService.buscarPorId(
                        emprestimo.getLivro().getId()
                );

        if (livro.getQuantidadeDisponivel() == null ||
                livro.getQuantidadeDisponivel() <= 0) {

            throw new RuntimeException(
                    "Livro indisponível"
            );
        }

        livro.setQuantidadeDisponivel(
                livro.getQuantidadeDisponivel() - 1
        );

        livroService.salvar(livro);

        emprestimo.setLivro(livro);

        emprestimo.setDataEmprestimo(
                LocalDate.now()
        );

        emprestimo.setDataPrevistaDevolucao(
                LocalDate.now().plusDays(7)
        );

        emprestimo.setStatus("ATIVO");

        return emprestimoRepository.save(
                emprestimo
        );
    }

    public Emprestimo atualizar(
            Long id,
            Emprestimo emprestimo
    ) {

        Emprestimo emprestimoExistente =
                buscarPorId(id);

        emprestimoExistente.setDataEmprestimo(
                emprestimo.getDataEmprestimo()
        );

        emprestimoExistente.setDataPrevistaDevolucao(
                emprestimo.getDataPrevistaDevolucao()
        );

        emprestimoExistente.setStatus(
                emprestimo.getStatus()
        );

        return emprestimoRepository.save(
                emprestimoExistente
        );
    }

    public void deletar(Long id) {

        Emprestimo emprestimo =
                buscarPorId(id);

        emprestimoRepository.delete(
                emprestimo
        );
    }

    public Emprestimo devolver(Long id) {

        Emprestimo emprestimo = buscarPorId(id);

        if ("DEVOLVIDO".equals(emprestimo.getStatus())) {
            throw new RuntimeException("Este empréstimo já foi devolvido");
        }

        Livro livro = emprestimo.getLivro();

        livro.setQuantidadeDisponivel(
                livro.getQuantidadeDisponivel() + 1
        );

        livroService.salvar(livro);

        emprestimo.setStatus("DEVOLVIDO");

        emprestimo.setDataDevolucao(
                LocalDate.now()
        );

        return emprestimoRepository.save(emprestimo);
    }

}