package jonathan_spring_boot_biblioteca.repository;

import jonathan_spring_boot_biblioteca.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;


public interface LivroRepository extends JpaRepository<Livro, Long> {
}
