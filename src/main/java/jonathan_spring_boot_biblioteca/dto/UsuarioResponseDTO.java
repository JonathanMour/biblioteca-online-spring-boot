package jonathan_spring_boot_biblioteca.dto;

import jonathan_spring_boot_biblioteca.model.Perfil;

public class UsuarioResponseDTO {

    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private String cpf;
    private Perfil perfil;

    public UsuarioResponseDTO() {
    }

    public UsuarioResponseDTO(
            Long id,
            String nome,
            String email,
            String telefone,
            String cpf,
            Perfil perfil
    ) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cpf = cpf;
        this.perfil = perfil;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getCpf() {
        return cpf;
    }

    public Perfil getPerfil() {
        return perfil;
    }
}