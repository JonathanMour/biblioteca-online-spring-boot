package jonathan_spring_boot_biblioteca.service;

import jonathan_spring_boot_biblioteca.model.ConfiguracaoSistema;
import jonathan_spring_boot_biblioteca.repository.ConfiguracaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConfiguracaoService {

    private final ConfiguracaoRepository configuracaoRepository;

    public ConfiguracaoService(
            ConfiguracaoRepository configuracaoRepository
    ) {
        this.configuracaoRepository =
                configuracaoRepository;
    }


    public List<ConfiguracaoSistema> listar() {

        return configuracaoRepository.findAll();
    }


    public ConfiguracaoSistema buscarPorId(Long id) {

        return configuracaoRepository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Configuração não encontrada"
                        )
                );
    }


    public ConfiguracaoSistema salvar(
            ConfiguracaoSistema configuracao
    ) {

        return configuracaoRepository.save(
                configuracao
        );
    }


    public ConfiguracaoSistema atualizar(
            Long id,
            ConfiguracaoSistema novaConfiguracao
    ) {

        ConfiguracaoSistema configuracao =
                buscarPorId(id);


        /* GERAL */

        configuracao.setNomeBiblioteca(
                novaConfiguracao.getNomeBiblioteca()
        );

        configuracao.setEndereco(
                novaConfiguracao.getEndereco()
        );

        configuracao.setCidade(
                novaConfiguracao.getCidade()
        );

        configuracao.setEstado(
                novaConfiguracao.getEstado()
        );

        configuracao.setTelefone(
                novaConfiguracao.getTelefone()
        );

        configuracao.setEmail(
                novaConfiguracao.getEmail()
        );

        configuracao.setDescricao(
                novaConfiguracao.getDescricao()
        );

        configuracao.setPermitirCadastroUsuarios(
                novaConfiguracao.getPermitirCadastroUsuarios()
        );

        configuracao.setExigirCpf(
                novaConfiguracao.getExigirCpf()
        );

        configuracao.setPermitirEditarPerfil(
                novaConfiguracao.getPermitirEditarPerfil()
        );

        configuracao.setMostrarLivrosIndisponiveis(
                novaConfiguracao.getMostrarLivrosIndisponiveis()
        );

        configuracao.setItensPorPagina(
                novaConfiguracao.getItensPorPagina()
        );

        configuracao.setMensagemSistema(
                novaConfiguracao.getMensagemSistema()
        );


        /* EMPRÉSTIMOS */

        configuracao.setPrazoEmprestimo(
                novaConfiguracao.getPrazoEmprestimo()
        );

        configuracao.setLimiteLivrosUsuario(
                novaConfiguracao.getLimiteLivrosUsuario()
        );

        configuracao.setPermitirRenovacao(
                novaConfiguracao.getPermitirRenovacao()
        );

        configuracao.setDiasTolerancia(
                novaConfiguracao.getDiasTolerancia()
        );


        /* MULTAS */

        configuracao.setValorMultaDia(
                novaConfiguracao.getValorMultaDia()
        );

        configuracao.setMultaAutomatica(
                novaConfiguracao.getMultaAutomatica()
        );

        configuracao.setBloquearUsuarioMulta(
                novaConfiguracao.getBloquearUsuarioMulta()
        );


        return configuracaoRepository.save(
                configuracao
        );
    }


    public void deletar(Long id) {

        ConfiguracaoSistema configuracao =
                buscarPorId(id);

        configuracaoRepository.delete(
                configuracao
        );
    }
}