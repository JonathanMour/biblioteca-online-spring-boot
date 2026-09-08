package jonathan_spring_boot_biblioteca.controller;

import jonathan_spring_boot_biblioteca.model.ConfiguracaoSistema;
import jonathan_spring_boot_biblioteca.service.ConfiguracaoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/configuracoes")
public class ConfiguracaoController {
    private final ConfiguracaoService configuracaoservice;
    public ConfiguracaoController(ConfiguracaoService configuracaoservice){
        this. configuracaoservice=  configuracaoservice;
    }
    @GetMapping
    public List<ConfiguracaoSistema> listar(){
        return configuracaoservice.listar();
    }
    @GetMapping("/{id}")
    public ConfiguracaoSistema buscarPorId(@PathVariable Long id){
        return  configuracaoservice.buscarPorId(id);
    }
    @PostMapping
    public  ConfiguracaoSistema salvar(@RequestBody ConfiguracaoSistema configuracao){
        return configuracaoservice.salvar(configuracao);
    }
    @PutMapping("/{id}")
    public ConfiguracaoSistema atualizar(@PathVariable Long id,
                                         @RequestBody ConfiguracaoSistema configuracao) {

        return configuracaoservice.atualizar(id, configuracao);
    }
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        configuracaoservice.deletar(id);
    }
}