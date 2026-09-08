package jonathan_spring_boot_biblioteca.exception;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public String tratarRuntimeException(RuntimeException erro) {
        return erro.getMessage();
    }

}