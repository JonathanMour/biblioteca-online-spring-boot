package jonathan_spring_boot_biblioteca.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RelatorioDTO {
    private long totalUsuarios;
    private long totalLivros;
    private long totalEmprestimos;
    private long totalDevolucoes;
    private long totalAtrasados;
}
