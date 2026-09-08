package jonathan_spring_boot_biblioteca.controller;
import jonathan_spring_boot_biblioteca.model.Emprestimo;
import jonathan_spring_boot_biblioteca.service.EmprestimoService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/Emprestimo")
public class EmprestimoController {
    private final EmprestimoService emprestimoService;
    public EmprestimoController(EmprestimoService emprestimoService){
        this.emprestimoService= emprestimoService;
    }
    @GetMapping
    public List<Emprestimo> listar(){
        return emprestimoService.listar();
    }
    @GetMapping("/{id}")
    public Emprestimo buscarPorId(@PathVariable Long id){
        return  emprestimoService.buscarPorId(id);
    }
    @PostMapping
    public  Emprestimo salvar(@RequestBody Emprestimo emprestimo){
        return emprestimoService.salvar(emprestimo);
    }
    @PutMapping("/{id}")
    public Emprestimo atualizar(@PathVariable Long id,
                                @RequestBody Emprestimo emprestimo) {

        return emprestimoService.atualizar(id, emprestimo);
    }
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        emprestimoService.deletar(id);
    }
    @PutMapping("/{id}/devolver")
    public Emprestimo devolver(@PathVariable Long id) {
        return emprestimoService.devolver(id);
    }
}
