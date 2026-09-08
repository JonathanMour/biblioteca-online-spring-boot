package jonathan_spring_boot_biblioteca.service;

import jonathan_spring_boot_biblioteca.dto.RelatorioDTO;
import jonathan_spring_boot_biblioteca.model.Emprestimo;
import jonathan_spring_boot_biblioteca.repository.EmprestimoRepository;
import jonathan_spring_boot_biblioteca.repository.LivroRepository;
import jonathan_spring_boot_biblioteca.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class RelatorioService {

    private final UsuarioRepository usuarioRepository;
    private final LivroRepository livroRepository;
    private final EmprestimoRepository emprestimoRepository;


    public RelatorioService(UsuarioRepository usuarioRepository, LivroRepository livroRepository, EmprestimoRepository emprestimoRepository) {

        this.usuarioRepository = usuarioRepository;
        this.livroRepository = livroRepository;
        this.emprestimoRepository = emprestimoRepository;
    }


    public RelatorioDTO gerarRelatorio() {

        RelatorioDTO relatorio = new RelatorioDTO();


        /* TOTAL DE USUÁRIOS */

        relatorio.setTotalUsuarios(usuarioRepository.count());


        /* TOTAL DE LIVROS */

        relatorio.setTotalLivros(livroRepository.count());


        /* TODOS OS EMPRÉSTIMOS */

        List<Emprestimo> emprestimos = emprestimoRepository.findAll();


        relatorio.setTotalEmprestimos(emprestimos.size());


        /* TOTAL DE DEVOLUÇÕES */

        long totalDevolucoes = emprestimos.stream().filter(emprestimo -> "DEVOLVIDO".equalsIgnoreCase(emprestimo.getStatus())).count();


        relatorio.setTotalDevolucoes(totalDevolucoes);


        /* TOTAL DE ATRASADOS */

        long totalAtrasados = emprestimos.stream().filter(emprestimo -> !"DEVOLVIDO".equalsIgnoreCase(emprestimo.getStatus())).filter(emprestimo -> emprestimo.getDataPrevistaDevolucao().isBefore(LocalDate.now())).count();


        relatorio.setTotalAtrasados(totalAtrasados);


        return relatorio;
    }
}