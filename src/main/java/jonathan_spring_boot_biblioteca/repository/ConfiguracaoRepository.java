package jonathan_spring_boot_biblioteca.repository;

import jonathan_spring_boot_biblioteca.model.ConfiguracaoSistema;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfiguracaoRepository extends JpaRepository<ConfiguracaoSistema, Long> {
}
