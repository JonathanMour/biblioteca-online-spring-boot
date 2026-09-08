package jonathan_spring_boot_biblioteca.controller;

import jonathan_spring_boot_biblioteca.dto.RelatorioDTO;
import jonathan_spring_boot_biblioteca.service.RelatorioService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/relatorios")
public class RelatorioController {

    private final RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    @GetMapping("/resumo")
    public RelatorioDTO gerarRelatorio() {
        return relatorioService.gerarRelatorio();
    }
}