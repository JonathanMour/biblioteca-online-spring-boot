package jonathan_spring_boot_biblioteca.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConfiguracaoSistema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* GERAL */

    private String nomeBiblioteca;

    private String endereco;

    private String cidade;

    private String estado;

    private String telefone;

    private String email;

    private String descricao;

    private Boolean permitirCadastroUsuarios;

    private Boolean exigirCpf;

    private Boolean permitirEditarPerfil;

    private Boolean mostrarLivrosIndisponiveis;

    private Integer itensPorPagina;

    private String mensagemSistema;


    /* EMPRÉSTIMOS */

    private Integer prazoEmprestimo;

    private Integer limiteLivrosUsuario;

    private Boolean permitirRenovacao;

    private Integer diasTolerancia;


    /* MULTAS */

    private BigDecimal valorMultaDia;

    private Boolean multaAutomatica;

    private Boolean bloquearUsuarioMulta;
}