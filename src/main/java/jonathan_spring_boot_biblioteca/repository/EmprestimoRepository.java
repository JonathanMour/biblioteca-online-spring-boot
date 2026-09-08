package jonathan_spring_boot_biblioteca.repository;

import jonathan_spring_boot_biblioteca.model.Emprestimo;

import org.springframework.data.jpa.repository.JpaRepository;


public interface  EmprestimoRepository extends JpaRepository<Emprestimo, Long> {
}