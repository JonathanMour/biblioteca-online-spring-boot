const paginaUsuario =
    document.getElementById("nomeUsuarioMenu") ||
    document.getElementById("nomePerfil") ||
    document.getElementById("nomeBoasVindasUsuario");
/* DASHBOARD ADMIN */

if (document.getElementById("totalUsuariosDashboard")) {

    fetch("/usuarios")
        .then(function (response) {
            return response.json();
        })
        .then(function (usuarios) {

            document.getElementById(
                "totalUsuariosDashboard"
            ).textContent = usuarios.length;
        });

    fetch("/livros")
        .then(function (response) {
            return response.json();
        })
        .then(function (livros) {

            document.getElementById(
                "totalLivrosDashboard"
            ).textContent = livros.length;
        });
}
if (paginaUsuario) {
    fetch("/usuarios/me")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Erro ao carregar usuário.");
            }
            return response.json();
        })

        .then(function (usuario) {


            usuarioAtual = usuario;

            const nomeUsuarioMenu =
                document.getElementById("nomeUsuarioMenu");

            const emailUsuarioMenu =
                document.getElementById("emailUsuarioMenu");

            const nomePerfil =
                document.getElementById("nomePerfil");

            const emailPerfil =
                document.getElementById("emailPerfil");

            const cpfPerfil =
                document.getElementById("cpfPerfil");

            const telefonePerfil =
                document.getElementById("telefonePerfil");

            const nomePerfilInput =
                document.getElementById("nomePerfilInput");

            const telefonePerfilInput =
                document.getElementById("telefonePerfilInput");

            if (nomeUsuarioMenu) {
                nomeUsuarioMenu.textContent = usuario.nome;
            }

            if (emailUsuarioMenu) {
                emailUsuarioMenu.textContent = usuario.email;
            }

            if (nomePerfil) {
                nomePerfil.textContent = usuario.nome;
            }

            if (emailPerfil) {
                emailPerfil.textContent = usuario.email;
            }

            if (cpfPerfil) {
                cpfPerfil.textContent = usuario.cpf;
            }

            if (telefonePerfil) {
                telefonePerfil.textContent = usuario.telefone;
            }

            if (nomePerfilInput) {
                nomePerfilInput.value = usuario.nome;
            }

            if (telefonePerfilInput) {
                telefonePerfilInput.value = usuario.telefone;
            }

        })

        .catch(function (erro) {

            console.error(
                "ERRO AO CARREGAR USUÁRIO:",
                erro
            );

        });

}
//* HOME DO USUÁRIO */

(function () {

    const inicioEmprestimosAtivos =
        document.getElementById(
            "inicioEmprestimosAtivos"
        );

    const inicioDevolucoesPendentes =
        document.getElementById(
            "inicioDevolucoesPendentes"
        );

    const inicioDevolucoesRealizadas =
        document.getElementById(
            "inicioDevolucoesRealizadas"
        );

    const inicioLivrosDisponiveis =
        document.getElementById(
            "inicioLivrosDisponiveis"
        );

    const inicioTabelaEmprestimos =
        document.getElementById(
            "inicioTabelaEmprestimos"
        );

    const inicioProximaDevolucao =
        document.getElementById(
            "inicioProximaDevolucao"
        );

    const inicioLivrosDestaque =
        document.getElementById(
            "inicioLivrosDestaque"
        );


    /* VERIFICA SE ESTÁ NA HOME */

    if (
        !inicioEmprestimosAtivos &&
        !inicioTabelaEmprestimos &&
        !inicioLivrosDestaque
    ) {
        return;
    }


    /* FORMATAR DATA */

    function formatarDataHome(data) {

        if (!data) {
            return "-";
        }

        const partes =
            data.split("-");

        if (partes.length !== 3) {
            return data;
        }

        return (
            partes[2] +
            "/" +
            partes[1] +
            "/" +
            partes[0]
        );
    }


    /* VERIFICAR ATRASO */

    function emprestimoAtrasadoHome(
        emprestimo
    ) {

        if (
            emprestimo.status ===
            "DEVOLVIDO"
        ) {
            return false;
        }

        if (
            !emprestimo.dataPrevistaDevolucao
        ) {
            return false;
        }

        const hoje =
            new Date();

        hoje.setHours(
            0,
            0,
            0,
            0
        );

        const dataPrevista =
            new Date(
                emprestimo
                    .dataPrevistaDevolucao +
                "T00:00:00"
            );

        return dataPrevista < hoje;
    }


    /* STATUS */

    function obterStatusHome(
        emprestimo
    ) {

        if (
            emprestimo.status ===
            "DEVOLVIDO"
        ) {

            return {
                texto: "Devolvido",
                classe: "devolvido"
            };
        }

        if (
            emprestimoAtrasadoHome(
                emprestimo
            )
        ) {

            return {
                texto: "Atrasado",
                classe: "atrasado"
            };
        }

        return {
            texto: "Ativo",
            classe: "ativo"
        };
    }


    /* CARREGAR HOME */

    Promise.all([
        fetch("/usuarios/me"),
        fetch("/Emprestimo"),
        fetch("/livros")
    ])

        .then(function (responses) {

            if (!responses[0].ok) {
                throw new Error(
                    "Erro ao buscar usuário"
                );
            }

            if (!responses[1].ok) {
                throw new Error(
                    "Erro ao buscar empréstimos"
                );
            }

            if (!responses[2].ok) {
                throw new Error(
                    "Erro ao buscar livros"
                );
            }

            return Promise.all([
                responses[0].json(),
                responses[1].json(),
                responses[2].json()
            ]);
        })

        .then(function (dados) {

            const usuario =
                dados[0];

            const emprestimos =
                dados[1];

            const livros =
                dados[2];


            /* EMPRÉSTIMOS DO USUÁRIO */

            const emprestimosUsuario =
                emprestimos.filter(
                    function (emprestimo) {

                        return (
                            emprestimo.usuario &&
                            emprestimo.usuario.id ===
                            usuario.id
                        );
                    }
                );


            /* ATIVOS */

            const emprestimosAtivos =
                emprestimosUsuario.filter(
                    function (emprestimo) {

                        return (
                            emprestimo.status !==
                            "DEVOLVIDO"
                        );
                    }
                );


            /* DEVOLVIDOS */

            const emprestimosDevolvidos =
                emprestimosUsuario.filter(
                    function (emprestimo) {

                        return (
                            emprestimo.status ===
                            "DEVOLVIDO"
                        );
                    }
                );


            /* LIVROS DISPONÍVEIS */

            const livrosDisponiveis =
                livros.filter(
                    function (livro) {

                        return (
                            (
                                livro.quantidadeDisponivel ??
                                0
                            ) > 0
                        );
                    }
                );


            /* CARD EMPRÉSTIMOS ATIVOS */

            if (
                inicioEmprestimosAtivos
            ) {

                inicioEmprestimosAtivos
                    .textContent =
                    emprestimosAtivos.length;
            }


            /* CARD DEVOLUÇÕES PENDENTES */

            if (
                inicioDevolucoesPendentes
            ) {

                inicioDevolucoesPendentes
                    .textContent =
                    emprestimosAtivos.length;
            }


            /* CARD DEVOLUÇÕES REALIZADAS */

            if (
                inicioDevolucoesRealizadas
            ) {

                inicioDevolucoesRealizadas
                    .textContent =
                    emprestimosDevolvidos.length;
            }


            /* CARD LIVROS DISPONÍVEIS */

            if (
                inicioLivrosDisponiveis
            ) {

                inicioLivrosDisponiveis
                    .textContent =
                    livrosDisponiveis.length;
            }


            /* TABELA MEUS EMPRÉSTIMOS */

            if (
                inicioTabelaEmprestimos
            ) {

                inicioTabelaEmprestimos
                    .innerHTML = "";

                const emprestimosTabela =
                    [...emprestimosAtivos]
                        .sort(
                            function (a, b) {

                                return (
                                    new Date(
                                        b.dataEmprestimo
                                    ) -
                                    new Date(
                                        a.dataEmprestimo
                                    )
                                );
                            }
                        )
                        .slice(
                            0,
                            3
                        );


                if (
                    emprestimosTabela.length ===
                    0
                ) {

                    inicioTabelaEmprestimos
                        .innerHTML = `
                            <tr>
                                <td
                                    colspan="4"
                                    style="
                                        text-align:center;
                                        padding:30px;
                                    "
                                >
                                    Nenhum empréstimo ativo.
                                </td>
                            </tr>
                        `;

                } else {

                    emprestimosTabela.forEach(
                        function (emprestimo) {

                            const linha =
                                document.createElement(
                                    "tr"
                                );

                            const status =
                                obterStatusHome(
                                    emprestimo
                                );

                            linha.innerHTML = `
                                <td>
                                    <div class="livro-tabela">

                                        <div class="mini-capa">
                                            📕
                                        </div>

                                        <div>
                                            <strong>
                                                ${
                                emprestimo
                                    .livro
                                    ?.titulo ||
                                "-"
                            }
                                            </strong>

                                            <span>
                                                ${
                                emprestimo
                                    .livro
                                    ?.autor ||
                                "-"
                            }
                                            </span>
                                        </div>

                                    </div>
                                </td>

                                <td>
                                    ${
                                formatarDataHome(
                                    emprestimo
                                        .dataEmprestimo
                                )
                            }
                                </td>

                                <td>
                                    ${
                                formatarDataHome(
                                    emprestimo
                                        .dataPrevistaDevolucao
                                )
                            }
                                </td>

                                <td>
                                    <span
                                        class="status ${status.classe}"
                                    >
                                        ${status.texto}
                                    </span>
                                </td>
                            `;

                            inicioTabelaEmprestimos
                                .appendChild(
                                    linha
                                );
                        }
                    );
                }
            }


            /* PRÓXIMA DEVOLUÇÃO */

            if (
                inicioProximaDevolucao
            ) {

                const listaOrdenada =
                    [...emprestimosAtivos]
                        .filter(
                            function (emprestimo) {

                                return (
                                    emprestimo
                                        .dataPrevistaDevolucao
                                );
                            }
                        )
                        .sort(
                            function (a, b) {

                                return (
                                    new Date(
                                        a.dataPrevistaDevolucao
                                    ) -
                                    new Date(
                                        b.dataPrevistaDevolucao
                                    )
                                );
                            }
                        );


                if (
                    listaOrdenada.length ===
                    0
                ) {

                    inicioProximaDevolucao
                        .innerHTML = `
                            <div>

                                <p>
                                    Nenhuma devolução pendente.
                                </p>

                                <a
                                    href="/usuario/emprestimos"
                                    class="botao-meus-emprestimos"
                                >
                                    Ver meus empréstimos →
                                </a>

                            </div>

                            <div
                                class="icone-calendario-grande"
                            >
                                📅
                            </div>
                        `;

                } else {

                    const proximo =
                        listaOrdenada[0];

                    inicioProximaDevolucao
                        .innerHTML = `
                            <div>

                                <h3>
                                    ${
                        proximo
                            .livro
                            ?.titulo ||
                        "Livro"
                    }
                                </h3>

                                <p>
                                    ${
                        proximo
                            .livro
                            ?.autor ||
                        "-"
                    }
                                </p>

                                <span>
                                    Data prevista:
                                </span>

                                <strong
                                    class="data-atraso"
                                >
                                    ${
                        formatarDataHome(
                            proximo
                                .dataPrevistaDevolucao
                        )
                    }
                                </strong>

                                <a
                                    href="/usuario/emprestimos"
                                    class="botao-meus-emprestimos"
                                >
                                    Ver meus empréstimos →
                                </a>

                            </div>

                            <div
                                class="icone-calendario-grande"
                            >
                                📅
                            </div>
                        `;
                }
            }


            /* LIVROS EM DESTAQUE */

            if (
                inicioLivrosDestaque
            ) {

                inicioLivrosDestaque
                    .innerHTML = "";

                const destaques =
                    livros
                        .filter(
                            function (livro) {

                                return (
                                    (
                                        livro
                                            .quantidadeDisponivel ??
                                        0
                                    ) > 0
                                );
                            }
                        )
                        .slice(
                            0,
                            6
                        );


                if (
                    destaques.length ===
                    0
                ) {

                    inicioLivrosDestaque
                        .innerHTML = `
                            <p>
                                Nenhum livro disponível.
                            </p>
                        `;

                } else {

                    destaques.forEach(
                        function (livro) {

                            const card =
                                document.createElement(
                                    "div"
                                );

                            card.className =
                                "livro-destaque";

                            card.innerHTML = `

                                <div
                                    class="capa-destaque"
                                >
                                    📕
                                </div>

                                <strong>
                                    ${
                                livro.titulo ||
                                "Livro"
                            }
                                </strong>

                                <span>
                                    ${
                                livro.autor ||
                                "-"
                            }
                                </span>

                            `;

                            inicioLivrosDestaque
                                .appendChild(
                                    card
                                );
                        }
                    );
                }
            }


            console.log(
                "HOME CARREGADA"
            );

            console.log(
                "EMPRÉSTIMOS DO USUÁRIO:",
                emprestimosUsuario
            );

            console.log(
                "LIVROS:",
                livros
            );

        })

        .catch(function (erro) {

            console.error(
                "ERRO NA HOME DO USUÁRIO:",
                erro
            );

        });

})();
/* LIVROS DO USUÁRIO */

const corpoTabelaLivrosUsuario =
    document.getElementById("corpoTabelaLivros");

if (corpoTabelaLivrosUsuario) {

    fetch("/livros")
        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Erro ao carregar livros: " +
                    response.status
                );
            }

            return response.json();
        })

        .then(function (livros) {

            console.log(
                "LIVROS CARREGADOS:",
                livros
            );

            /* LIVROS DO BACKEND PARA A PESQUISA */

            catalogoLivros = livros;

            livrosFiltrados = [
                ...catalogoLivros
            ];

            paginaAtualLivros = 1;

            mostrarLivrosCatalogo();


            /* ATUALIZA LIVROS DISPONÍVEIS */

            const quantidadeDisponiveis =
                document.getElementById(
                    "quantidadeLivrosDisponiveis"
                );

            if (quantidadeDisponiveis) {

                quantidadeDisponiveis.textContent =
                    livros.filter(function (livro) {

                        const quantidade =
                            livro.quantidadeDisponivel ??
                            livro.quantidade ??
                            livro.disponiveis ??
                            0;

                        return quantidade > 0;

                    }).length;
            }

        })

        .catch(function (erro) {

            console.error(
                "ERRO LIVROS DO USUÁRIO:",
                erro
            );

        });
}


/* RESERVAR LIVRO */

function reservarLivro(livroId) {

    fetch("/usuarios/me")

        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Erro ao buscar usuário"
                );
            }

            return response.json();
        })

        .then(function (usuario) {

            return fetch("/Emprestimo", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    usuario: {
                        id: usuario.id
                    },

                    livro: {
                        id: livroId
                    }

                })
            });
        })

        .then(function (response) {

            if (!response.ok) {

                return response.text()
                    .then(function (mensagem) {

                        throw new Error(
                            mensagem
                        );
                    });
            }

            return response.json();
        })

        .then(function () {

            alert(
                "Livro reservado com sucesso!"
            );

            location.reload();
        })

        .catch(function (erro) {

            console.error(
                "ERRO AO RESERVAR:",
                erro
            );

            alert(
                "Não foi possível reservar o livro."
            );
        });
}
/* CADASTRO DE LIVRO */
const formLivro = document.getElementById("formLivro");
const formCadastro = document.getElementById("formCadastro");
let usuarioAtual = null;
const formPerfil = document.getElementById("formPerfil");

if (formLivro) {

    formLivro.addEventListener("submit", function (event) {

        event.preventDefault();

        alert("Livro cadastrado apenas como demonstração.");

    });

}
/* CADASTRAR NOVO LIVRO*/

const formNovoLivro =
    document.getElementById("formNovoLivro");

if (formNovoLivro) {

    formNovoLivro.addEventListener("submit", function (event) {

        event.preventDefault();

        const titulo =
            document.getElementById("tituloLivro").value.trim();

        const autor =
            document.getElementById("autorLivro").value.trim();

        const categoria =
            document.getElementById("generoLivro").value;

        const isbn =
            document.getElementById("isbnLivro").value.trim();

        const quantidade =
            Number(document.getElementById("quantidadeLivro").value);


        const livro = {
            titulo: titulo,
            autor: autor,
            categoria: categoria,
            isbn: isbn,
            quantidadeTotal: quantidade,
            quantidadeDisponivel: quantidade
        };


        fetch("/livros", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(livro)

        })

            .then(function (response) {

                if (!response.ok) {
                    throw new Error("Erro ao cadastrar livro.");
                }

                return response.json();

            })

            .then(function (livroSalvo) {

                alert("Livro cadastrado com sucesso!");

                console.log("Livro cadastrado:", livroSalvo);

                formNovoLivro.reset();

            })

            .catch(function (erro) {

                console.error("Erro ao cadastrar livro:", erro);

                alert("Não foi possível cadastrar o livro.");

            });

    });

}

/* CADASTRO DE USUÁRIO*/

if (formCadastro) {

    formCadastro.addEventListener("submit", function (event) {

        event.preventDefault();

        const nome = document
            .getElementById("nome")
            .value
            .trim();


        const cpf = document
            .getElementById("cpf")
            .value
            .trim();


        const email = document
            .getElementById("email")
            .value
            .trim();


        const telefone = document
            .getElementById("telefone")
            .value
            .trim();


        const senha = document
            .getElementById("senha").value;


        const confirmarSenha = document.getElementById("confirmarSenha");


        if (confirmarSenha && senha !== confirmarSenha.value) {

            alert("As senhas não são iguais.");

            return;

        }


        const usuario = {

            nome: nome,

            cpf: cpf,

            email: email,

            telefone: telefone,

            senha: senha

        };

        console.log("Enviando usuário:", usuario);

        fetch("/usuarios", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(usuario)

        })

            .then(function (response) {

                if (!response.ok) {

                    return response
                        .text()
                        .then(function (mensagem) {

                            throw new Error(mensagem);

                        });

                }

                return response.json();

            })

            .then(function (data) {

                console.log("Usuário cadastrado:", data);

                alert("Conta criada com sucesso!");

                window.location.href = "/login";

            })

            .catch(function (error) {
                console.error("Erro no cadastro:", error);
                alert(error.message);
            });
    });

}

/* MOSTRAR / ESCONDER SENHA */

const botaoMostrarSenha = document.getElementById("mostrarSenha");

const campoSenhaLogin = document.getElementById("senhaLogin");

if (botaoMostrarSenha && campoSenhaLogin) {

    botaoMostrarSenha.addEventListener("click", function () {

        if (campoSenhaLogin.type === "password") {
            campoSenhaLogin.type = "text";
            botaoMostrarSenha.innerHTML = '<span class="icone-olho">👁</span>';

        } else {
            campoSenhaLogin.type = "password";

            botaoMostrarSenha.innerHTML = '<span class="icone-olho olho-riscado">👁</span>';
        }
    });
}

/* MOSTRAR DADOS DO USUÁRIO */

function mostrarDadosUsuario(usuarioAtual) {

    const elementoUsuario = document.getElementById("usuarioLogado");

    if (elementoUsuario) {
        elementoUsuario.textContent = usuarioAtual.nome || "Usuário";
    }

    const nomeAdminMenu = document.getElementById("nomeAdminMenu");

    if (nomeAdminMenu) {
        nomeAdminMenu.textContent =
            usuarioAtual.nome || "Administrador";
    }

    const nomeBoasVindas = document.getElementById("nomeBoasVindas");

    if (nomeBoasVindas) {
        nomeBoasVindas.textContent =
            usuarioAtual.nome || "Usuário";
    }

    const nomeBoasVindasUsuario =
        document.getElementById("nomeBoasVindasUsuario");

    if (nomeBoasVindasUsuario) {
        nomeBoasVindasUsuario.textContent =
            usuarioAtual.nome || "Usuário";
    }

    const nomeUsuarioMenu =
        document.getElementById("nomeUsuarioMenu");

    if (nomeUsuarioMenu) {
        nomeUsuarioMenu.textContent =
            usuarioAtual.nome || "Usuário";
    }

    const emailUsuarioMenu =
        document.getElementById("emailUsuarioMenu");

    if (emailUsuarioMenu) {
        emailUsuarioMenu.textContent =
            usuarioAtual.email || "";
    }

    const nomeUsuarioCard =
        document.getElementById("nomeUsuarioCard");

    if (nomeUsuarioCard) {
        nomeUsuarioCard.textContent =
            usuarioAtual.nome || "Usuário";
    }

    const nomePerfil =
        document.getElementById("nomePerfil");

    const emailPerfil =
        document.getElementById("emailPerfil");

    const cpfPerfil =
        document.getElementById("cpfPerfil");

    const telefonePerfil =
        document.getElementById("telefonePerfil");


    if (nomePerfil) {
        nomePerfil.textContent =
            usuarioAtual.nome || "Usuário";
    }

    if (emailPerfil) {
        emailPerfil.textContent =
            usuarioAtual.email || "-";
    }

    if (cpfPerfil) {
        cpfPerfil.textContent =
            usuarioAtual.cpf || "-";
    }

    if (telefonePerfil) {
        telefonePerfil.textContent =
            usuarioAtual.telefone || "-";
    }
}

/* INPUTS DO PERFIL */

const nomePerfilInput =
    document.getElementById("nomePerfilInput");

const telefonePerfilInput =
    document.getElementById("telefonePerfilInput");

if (usuarioAtual) {
    if (nomePerfilInput) {
        nomePerfilInput.value = usuarioAtual.nome || "";
    }

    if (telefonePerfilInput) {
        telefonePerfilInput.value = usuarioAtual.telefone || "";
    }

}
/* FOTO DE PERFIL */

const inputFotoPerfil =
    document.getElementById("inputFotoPerfil");

const botaoAlterarFoto =
    document.getElementById("botaoAlterarFoto");

const fotoPerfil =
    document.getElementById("fotoPerfil");

const iconePerfilPadrao =
    document.getElementById("iconePerfilPadrao");

const fotoUsuarioMenu =
    document.getElementById("fotoUsuarioMenu");

const iconeUsuarioMenu =
    document.getElementById("iconeUsuarioMenu");

const fotoUsuarioTopo =
    document.getElementById("fotoUsuarioTopo");

const iconeUsuarioTopo =
    document.getElementById("iconeUsuarioTopo");
const botaoRemoverFoto =
    document.getElementById("botaoRemoverFoto");

function obterChaveFotoPerfil() {

    if (!usuarioAtual || !usuarioAtual.email) {
        return null;
    }

    return "fotoPerfil_" + usuarioAtual.email;
}


function aplicarFotoUsuario(imagem) {

    if (fotoPerfil) {
        fotoPerfil.src = imagem;
        fotoPerfil.style.display = "block";
    }

    if (iconePerfilPadrao) {
        iconePerfilPadrao.style.display = "none";
    }

    if (fotoUsuarioMenu) {
        fotoUsuarioMenu.src = imagem;
        fotoUsuarioMenu.style.display = "block";
    }

    if (iconeUsuarioMenu) {
        iconeUsuarioMenu.style.display = "none";
    }

    if (fotoUsuarioTopo) {
        fotoUsuarioTopo.src = imagem;
        fotoUsuarioTopo.style.display = "block";
    }

    if (iconeUsuarioTopo) {
        iconeUsuarioTopo.style.display = "none";
    }
    if (botaoRemoverFoto) {
        botaoRemoverFoto.style.display = "inline-block";
    }
}


function carregarFotoPerfil() {

    const chaveFotoPerfil =
        obterChaveFotoPerfil();

    if (!chaveFotoPerfil) {
        return;
    }

    const fotoPerfilSalva =
        localStorage.getItem(chaveFotoPerfil);

    if (fotoPerfilSalva) {
        aplicarFotoUsuario(fotoPerfilSalva);
    }
}


/* ALTERAR FOTO */

if (botaoAlterarFoto && inputFotoPerfil) {

    botaoAlterarFoto.addEventListener(
        "click",
        function () {

            inputFotoPerfil.value = "";
            inputFotoPerfil.click();
        }
    );
}


/* ESCOLHER NOVA FOTO */

if (inputFotoPerfil) {

    inputFotoPerfil.addEventListener(
        "change",
        function () {

            const arquivo =
                inputFotoPerfil.files[0];

            if (!arquivo) {
                return;
            }

            if (!arquivo.type.startsWith("image/")) {

                alert("Selecione uma imagem válida.");
                return;
            }

            const chaveFotoPerfil =
                obterChaveFotoPerfil();

            if (!chaveFotoPerfil) {

                alert("Usuário ainda não foi carregado.");
                return;
            }

            const leitor =
                new FileReader();

            leitor.onload = function (event) {

                const imagem =
                    event.target.result;

                localStorage.setItem(
                    chaveFotoPerfil,
                    imagem
                );

                aplicarFotoUsuario(imagem);
            };

            leitor.readAsDataURL(arquivo);
        }
    );
}

/*  SALVAR ALTERAÇÕES DO PERFIL*/

if (formPerfil) {

    formPerfil.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!usuarioAtual) {
            alert("Não foi possível carregar o usuário.");
            return;
        }

        const nomePerfilInput =
            document.getElementById("nomePerfilInput");

        const telefonePerfilInput =
            document.getElementById("telefonePerfilInput");

        const senhaPerfil =
            document.getElementById("senhaPerfil");

        const confirmarSenhaPerfil =
            document.getElementById("confirmarSenhaPerfil");


        const nome =
            nomePerfilInput ? nomePerfilInput.value.trim() : "";

        const telefone =
            telefonePerfilInput ? telefonePerfilInput.value.trim() : "";

        const senha =
            senhaPerfil ? senhaPerfil.value : "";

        const confirmarSenha =
            confirmarSenhaPerfil ? confirmarSenhaPerfil.value : "";


        if (nome === "") {
            alert("Digite seu nome.");
            return;
        }

        if (senha !== confirmarSenha) {
            alert("As senhas não são iguais.");
            return;
        }

        const usuarioAtualizado = {
            nome: nome,
            email: usuarioAtual.email,
            telefone: telefone,
            cpf: usuarioAtual.cpf
        };

        if (senha !== "") {
            usuarioAtualizado.senha = senha;
        }
        fetch("/usuarios/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuarioAtualizado)

        })

            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Erro ao atualizar usuário.");
                }
                return response.json();

            })

            .then(function (usuario) {
                carregarFotoPerfil();
                alert("Perfil atualizado com sucesso!");

            })

            .catch(function (erro) {
                console.error("Erro ao atualizar perfil:", erro);
                alert("Não foi possível atualizar o perfil.");
            });
    });
}
/* REMOVER FOTO */

if (botaoRemoverFoto) {

    botaoRemoverFoto.addEventListener(
        "click",
        function () {

            const chaveFotoPerfil =
                obterChaveFotoPerfil();

            if (!chaveFotoPerfil) {
                return;
            }

            localStorage.removeItem(
                chaveFotoPerfil
            );

            if (fotoPerfil) {
                fotoPerfil.src = "";
                fotoPerfil.style.display = "none";
            }

            if (iconePerfilPadrao) {
                iconePerfilPadrao.style.display = "";
            }

            if (fotoUsuarioMenu) {
                fotoUsuarioMenu.src = "";
                fotoUsuarioMenu.style.display = "none";
            }

            if (iconeUsuarioMenu) {
                iconeUsuarioMenu.style.display = "";
            }

            botaoRemoverFoto.style.display = "none";
        }
    );
}
/*  CANCELAR ALTERAÇÕES*/

const cancelarPerfil =
    document.getElementById("cancelarPerfil");
if (cancelarPerfil) {
    cancelarPerfil.addEventListener("click", function () {

        if (!usuarioAtual) {
            return;
        }
        const nomePerfilInput =
            document.getElementById("nomePerfilInput");
        const telefonePerfilInput =
            document.getElementById("telefonePerfilInput");
        const senhaPerfil =
            document.getElementById("senhaPerfil");
        const confirmarSenhaPerfil =
            document.getElementById("confirmarSenhaPerfil");


        if (nomePerfilInput) {
            nomePerfilInput.value =
                usuarioAtual.nome || "";
        }

        if (telefonePerfilInput) {
            telefonePerfilInput.value =
                usuarioAtual.telefone || "";
        }

        if (senhaPerfil) {
            senhaPerfil.value = "";
        }

        if (confirmarSenhaPerfil) {
            confirmarSenhaPerfil.value = "";
        }

    });

}
/* LOGOUT*/

const botoesSair =
    document.querySelectorAll(".botao-sair, .sair-usuario");

botoesSair.forEach(function (botao) {

    botao.addEventListener("click", function () {

        localStorage.removeItem("usuarioLogado");

    });

});

/* FUNÇÕES AUXILIARES */

function carregarListaLocal(chave) {
    const dados = localStorage.getItem(chave);
    if (!dados) {
        return [];
    }

    try {
        const lista = JSON.parse(dados);
        if (Array.isArray(lista)) {
            return lista;
        }
        return [];

    } catch (erro) {

        consle.error("Erro ao carregar:", chave, erro);
        return [];
    }
}

/*  CATÁLOGO DE LIVROS */

let catalogoLivros = carregarListaLocal("catalogoLivros");

/* CATÁLOGO DO USUÁRIO */

const corpoTabelaLivros = document.getElementById("corpoTabelaLivros");
const paginacaoLivros = document.getElementById("paginacaoLivros");
const textoPaginacao = document.getElementById("textoPaginacao");
const campoPesquisaCatalogo = document.getElementById("pesquisaLivro");
const formPesquisaCatalogo = document.getElementById("formPesquisa");
const quantidadeLivrosDisponiveis = document.getElementById("quantidadeLivrosDisponiveis");

let livrosFiltrados = [...catalogoLivros];
let paginaAtualLivros = 1;
const livrosPorPagina = 5;

/* MOSTRAR CATÁLOGO */

function mostrarLivrosCatalogo() {

    console.log("MOSTRAR CATÁLOGO EXECUTOU");

    if (!corpoTabelaLivros) {
        return;
    }

    corpoTabelaLivros.innerHTML = "";

    const inicio =
        (paginaAtualLivros - 1) * livrosPorPagina;

    const fim =
        inicio + livrosPorPagina;

    const livrosPagina =
        livrosFiltrados.slice(inicio, fim);


    if (livrosPagina.length === 0) {

        corpoTabelaLivros.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    style="text-align:center; padding:35px;"
                >
                    Nenhum livro encontrado.
                </td>
            </tr>
        `;

        atualizarPaginacaoLivros();

        return;
    }


    livrosPagina.forEach(function (livro) {

        console.log("LIVRO:", livro);

        const linha =
            document.createElement("tr");

        const disponiveis =
            livro.quantidadeDisponivel ??
            livro.disponiveis ??
            livro.quantidade ??
            0;


        linha.innerHTML = `

            <td>
                ${livro.capa || "📕"}
            </td>

            <td>
                ${livro.titulo || "-"}
            </td>

            <td>
                ${livro.autor || "-"}
            </td>

            <td>
                ${livro.categoria || livro.genero || "-"}
            </td>

            <td>
                <span class="status ativo">
                    ${disponiveis}
                </span>
            </td>

            <td>
                <button
                    type="button"
                    class="botao-reservar"
                    onclick="reservarLivro(${livro.id})"
                    ${disponiveis <= 0 ? "disabled" : ""}
                >
                    ${
            disponiveis > 0
                ? "Reservar"
                : "Indisponível"
        }
                </button>
            </td>
        `;


        corpoTabelaLivros.appendChild(
            linha
        );
    });


    atualizarPaginacaoLivros();
}
/*  PAGINAÇÃO DOS LIVROS  */

function atualizarPaginacaoLivros() {

    if (!textoPaginacao || !paginacaoLivros) {

        return;

    }
    const total = livrosFiltrados.length;
    const totalPaginas = Math.ceil(total / livrosPorPagina);

    if (total === 0) {

        textoPaginacao.textContent = "Mostrando 0 livros";

    } else {

        const inicio = (paginaAtualLivros - 1) * livrosPorPagina + 1;
        const fim = Math.min(paginaAtualLivros * livrosPorPagina, total);

        textoPaginacao.textContent = `Mostrando ${inicio} a ${fim} de ${total} livros`;

    }
    paginacaoLivros.innerHTML = "";

    if( totalPaginas === 0) {

        return;
    }

    /* ANTERIOR */

    const anterior = document.createElement("button");
    anterior.type = "button";
    anterior.textContent = "<";
    anterior.disabled = paginaAtualLivros === 1;
    anterior.addEventListener("click", function () {

        if (paginaAtualLivros > 1) {
            paginaAtualLivros--;
            mostrarLivrosCatalogo();

        }

    });
    paginacaoLivros.appendChild(anterior);

    /* NÚMEROS */

    for (let pagina = 1; pagina <= totalPaginas; pagina++) {

        const botao = document.createElement("button");
        botao.type = "button";
        botao.textContent = pagina;

        if (pagina === paginaAtualLivros) {
            botao.classList.add("pagina-ativa");
        }


        botao.addEventListener("click", function () {
            paginaAtualLivros = pagina;
            mostrarLivrosCatalogo();

        });
        paginacaoLivros.appendChild(botao);
    }

    /* PRÓXIMO */

    const proximo = document.createElement("button");

    proximo.type = "button";
    proximo.textContent = ">";
    proximo.disabled = paginaAtualLivros === totalPaginas;

    proximo.addEventListener("click", function () {

        if (paginaAtualLivros < totalPaginas) {
            paginaAtualLivros++;
            mostrarLivrosCatalogo();
        }
    });

    paginacaoLivros.appendChild(proximo);
}

/* PESQUISA DO CATÁLOGO*/

if (formPesquisaCatalogo && campoPesquisaCatalogo) {

    formPesquisaCatalogo.addEventListener("submit", function (event) {

        event.preventDefault();

        const pesquisa = campoPesquisaCatalogo
            .value
            .trim()
            .toLowerCase();

        livrosFiltrados = catalogoLivros.filter(function (livro) {

            const titulo = (livro.titulo || "")
                .toLowerCase();

            const autor = (livro.autor || "")
                .toLowerCase();

            const genero = (
                livro.genero ||
                livro.categoria ||
                ""
            ).toLowerCase();

            return (
                titulo.includes(pesquisa) ||
                autor.includes(pesquisa) ||
                genero.includes(pesquisa)
            );

        });

        paginaAtualLivros = 1;

        mostrarLivrosCatalogo();

    });
}

/* LIMPOU PESQUISA */
if (campoPesquisaCatalogo) {

    campoPesquisaCatalogo.addEventListener(
        "input",
        function () {

            if (
                campoPesquisaCatalogo
                    .value
                    .trim() === ""
            ) {

                livrosFiltrados = [
                    ...catalogoLivros
                ];

                paginaAtualLivros = 1;

                mostrarLivrosCatalogo();
            }

        }
    );
}
/* QUANTIDADE DE LIVROS */

if (quantidadeLivrosDisponiveis) {
    quantidadeLivrosDisponiveis.textContent = catalogoLivros.length;
}

/* INICIAR */
if (corpoTabelaLivros) {
    mostrarLivrosCatalogo();

}

/*  HOME PÚBLICA */

const listaLivrosPublicos = document.getElementById("listaLivrosPublicos");
const mensagemSemLivrosPublicos = document.getElementById("mensagemSemLivrosPublicos");
const formPesquisaPublica = document.getElementById("formPesquisaPublica");
const pesquisaPublica = document.getElementById("pesquisaPublica");
const pesquisaTopoPublica = document.getElementById("pesquisaTopoPublica");
const botaoVerTodosLivrosPublicos = document.getElementById("verTodosLivrosPublicos");

let mostrarTodosPublicos = false;
let filtroPublico = "";

/* MOSTRAR LIVROS NA HOME*/

function mostrarLivrosHome() {
    if (!listaLivrosPublicos) {
        return;
    }
    listaLivrosPublicos.innerHTML = "";
    let lista = catalogoLivros.filter(function (livro) {
        if (filtroPublico === "") {
            return true;
        }

        const texto = ((livro.titulo || "") + " " + (livro.autor || "") + " " + (livro.genero || ""))
            .toLowerCase();
        return texto.includes(filtroPublico);
    });

    if (!mostrarTodosPublicos) {
        lista = lista.slice(0, 6);
    }

    if (lista.length === 0) {
        if (mensagemSemLivrosPublicos) {
            mensagemSemLivrosPublicos.style.display = "block";
        }
        return;
    }

    if (mensagemSemLivrosPublicos) {
        mensagemSemLivrosPublicos.style.display = "none";
    }

    lista.forEach(function (livro) {
        const card = document.createElement("article");
        card.className = "home-card-livros";
        card.innerHTML = `

        <div class="home-capa-livros">
          ${livro.capa || "📕"}
        </div>

        <div class="home-info-livros">
          <h3>
            ${livro.titulo || "Livro"}
          </h3>

          <p>
            ${livro.autor || "-"}
          </p>

          <span>

            ${Number(livro.disponiveis || 0) > 0
            ? "Disponível"
            : "Indisponível"}
          </span>
        </div>

      `;
        listaLivrosPublicos.appendChild(card);
    });
}

/* PESQUISA PRINCIPAL */

if (formPesquisaPublica && pesquisaPublica) {
    formPesquisaPublica.addEventListener("submit", function (event) {
        event.preventDefault();
        filtroPublico = pesquisaPublica
            .value
            .trim()
            .toLowerCase();
        mostrarTodosPublicos = true;
        mostrarLivrosHome();
    });
}

/* PESQUISA DO TOPO */
if (pesquisaTopoPublica) {
    pesquisaTopoPublica.addEventListener("input", function () {
        filtroPublico = pesquisaTopoPublica
            .value
            .trim()
            .toLowerCase();
        mostrarTodosPublicos = true;
        mostrarLivrosHome();
    });
}

/* EMPRÉSTIMOS DO USUÁRIO */

(function () {

    const corpoTabela =
        document.getElementById(
            "corpoTabelaEmprestimos"
        );

    if (!corpoTabela) {
        return;
    }


    const pesquisa =
        document.getElementById(
            "pesquisaEmprestimo"
        );

    const botaoPesquisar =
        document.getElementById(
            "botaoPesquisarEmprestimo"
        );

    const abaEmAndamento =
        document.getElementById(
            "abaEmAndamento"
        );

    const abaHistorico =
        document.getElementById(
            "abaHistorico"
        );

    const textoPaginacao =
        document.getElementById(
            "textoPaginacaoEmprestimos"
        );

    const paginacao =
        document.getElementById(
            "paginacaoEmprestimos"
        );

    const totalAtivos =
        document.getElementById(
            "totalEmprestimosAtivos"
        );

    const totalAtrasados =
        document.getElementById(
            "totalEmprestimosAtrasados"
        );

    const totalDevolvidos =
        document.getElementById(
            "totalEmprestimosDevolvidos"
        );

    const totalEmprestimos =
        document.getElementById(
            "totalEmprestimos"
        );


    let emprestimosUsuario = [];

    let abaAtual =
        "andamento";

    let filtro =
        "";

    let paginaAtual =
        1;

    const porPagina =
        5;


    /* FORMATAR DATA */

    function formatarData(data) {

        if (!data) {
            return "-";
        }

        const partes =
            data.split("-");

        if (
            partes.length !== 3
        ) {
            return data;
        }

        return (
            partes[2] +
            "/" +
            partes[1] +
            "/" +
            partes[0]
        );
    }


    /* VERIFICAR ATRASO */

    function estaAtrasado(
        emprestimo
    ) {

        if (
            emprestimo.status ===
            "DEVOLVIDO"
        ) {
            return false;
        }

        if (
            !emprestimo
                .dataPrevistaDevolucao
        ) {
            return false;
        }

        const hoje =
            new Date();

        hoje.setHours(
            0,
            0,
            0,
            0
        );

        const devolucao =
            new Date(
                emprestimo
                    .dataPrevistaDevolucao +
                "T00:00:00"
            );

        return devolucao < hoje;
    }


    /* STATUS */

    function obterStatus(
        emprestimo
    ) {

        if (
            emprestimo.status ===
            "DEVOLVIDO"
        ) {

            return {
                texto:
                    "Devolvido",

                classe:
                    "devolvido"
            };
        }


        if (
            estaAtrasado(
                emprestimo
            )
        ) {

            return {
                texto:
                    "Atrasado",

                classe:
                    "atrasado"
            };
        }


        return {
            texto:
                "Em andamento",

            classe:
                "ativo"
        };
    }



    /* CARREGAR BACKEND */

    function carregarEmprestimos() {

        Promise.all([
            fetch("/usuarios/me"),
            fetch("/Emprestimo")
        ])

            .then(function (responses) {

                if (!responses[0].ok) {
                    throw new Error(
                        "Erro ao buscar usuário"
                    );
                }

                if (!responses[1].ok) {
                    throw new Error(
                        "Erro ao buscar empréstimos"
                    );
                }

                return Promise.all([
                    responses[0].json(),
                    responses[1].json()
                ]);
            })

            .then(function (dados) {

                const usuario =
                    dados[0];

                const emprestimos =
                    dados[1];


                /* EMPRÉSTIMOS SOMENTE DO USUÁRIO LOGADO */

                emprestimosUsuario =
                    emprestimos.filter(
                        function (emprestimo) {

                            return (
                                emprestimo.usuario &&
                                emprestimo.usuario.id ===
                                usuario.id
                            );
                        }
                    );


                console.log(
                    "USUÁRIO LOGADO:",
                    usuario
                );

                console.log(
                    "EMPRÉSTIMOS DO USUÁRIO:",
                    emprestimosUsuario
                );


                atualizarCards();

                mostrarEmprestimos();
            })

            .catch(function (erro) {

                console.error(
                    "ERRO AO CARREGAR EMPRÉSTIMOS:",
                    erro
                );

                corpoTabela.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        style="
                            text-align:center;
                            padding:30px;
                        "
                    >
                        Não foi possível carregar
                        os empréstimos.
                    </td>
                </tr>
            `;
            });
    }
    /* ATUALIZAR CARDS DOS EMPRÉSTIMOS */

    function atualizarCards() {

        const ativos =
            emprestimosUsuario.filter(
                function (emprestimo) {

                    return (
                        emprestimo.status !==
                        "DEVOLVIDO"
                    );
                }
            );

        const atrasados =
            emprestimosUsuario.filter(
                function (emprestimo) {

                    return estaAtrasado(
                        emprestimo
                    );
                }
            );

        const devolvidos =
            emprestimosUsuario.filter(
                function (emprestimo) {

                    return (
                        emprestimo.status ===
                        "DEVOLVIDO"
                    );
                }
            );


        if (totalAtivos) {
            totalAtivos.textContent =
                ativos.length;
        }

        if (totalAtrasados) {
            totalAtrasados.textContent =
                atrasados.length;
        }

        if (totalDevolvidos) {
            totalDevolvidos.textContent =
                devolvidos.length;
        }

        if (totalEmprestimos) {
            totalEmprestimos.textContent =
                emprestimosUsuario.length;
        }
    }

    /* FILTRAR */

    function filtrarEmprestimos() {

        return emprestimosUsuario.filter(
            function (emprestimo) {

                const titulo =
                    (
                        emprestimo.livro?.titulo ||
                        ""
                    ).toLowerCase();

                const autor =
                    (
                        emprestimo.livro?.autor ||
                        ""
                    ).toLowerCase();

                if (filtro !== "") {

                    return (
                        titulo.includes(filtro) ||
                        autor.includes(filtro)
                    );
                }
                const devolvido =
                    emprestimo.status ===
                    "DEVOLVIDO";

                if (
                    abaAtual === "andamento" &&
                    devolvido
                ) {
                    return false;
                }

                if (
                    abaAtual === "historico" &&
                    !devolvido
                ) {
                    return false;
                }

                return true;
            }
        );
    }

    /* MOSTRAR */

    function mostrarEmprestimos() {

        const lista =
            filtrarEmprestimos();
        corpoTabela.innerHTML =
            "";
        if (
            lista.length === 0
        ) {
            let mensagem =
                "Nenhum empréstimo encontrado.";

            if (
                filtro !== ""
            ) {
                mensagem =
                    "Nenhum empréstimo encontrado para essa pesquisa.";

            } else if (
                abaAtual ===
                "historico"
            ) {
                mensagem =
                    "Você ainda não possui empréstimos devolvidos.";
            } else {
                mensagem =
                    "Você não possui empréstimos em andamento.";
            }


            corpoTabela.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#667085;
                    "
                >
                    ${mensagem}
                </td>
            </tr>
        `;


            atualizarPaginacao(
                0
            );

            return;
        }

        const inicio =
            (
                paginaAtual - 1
            ) *
            porPagina;

        const fim =
            inicio +
            porPagina;

        const pagina =
            lista.slice(
                inicio,
                fim
            );

        pagina.forEach(
            function (emprestimo) {

                const linha =
                    document.createElement(
                        "tr"
                    );

                const status =
                    obterStatus(
                        emprestimo
                    );

                const botaoDevolver =
                    emprestimo.status !== "DEVOLVIDO"
                        ? `
                        <button
                            type="button"
                            class="botao-principal"
                            onclick="devolverLivro(${emprestimo.id})"
                        >
                            Devolver
                        </button>
                    `
                        : "-";

                linha.innerHTML = `

                <td>
                    ${
                    emprestimo
                        .livro
                        ?.titulo ||
                    "-"
                }
                </td>
                <td>
                    ${
                    emprestimo
                        .livro
                        ?.autor ||
                    "-"
                }
                </td>
                <td>
                    ${
                    formatarData(
                        emprestimo
                            .dataEmprestimo
                    )
                }
                </td>
                <td>
                    ${
                    formatarData(
                        emprestimo
                            .dataPrevistaDevolucao
                    )
                }
                </td>

                <td>
                    <span
                        class="status ${status.classe}"
                    >
                        ${status.texto}
                    </span>
                </td>

                <td>
                    ${botaoDevolver}
                </td>
            `;


                corpoTabela.appendChild(
                    linha
                );
            }
        );


        atualizarPaginacao(
            lista.length
        );
    }
    window.devolverLivro = function (idEmprestimo) {

        const confirmar =
            confirm("Deseja realmente devolver este livro?");

        if (!confirmar) {
            return;
        }

        fetch("/Emprestimo/" + idEmprestimo + "/devolver", {
            method: "PUT"
        })
            .then(function (response) {

                if (!response.ok) {
                    throw new Error("Erro ao devolver o livro");
                }

                return response.json();
            })
            .then(function () {

                alert("Livro devolvido com sucesso!");

                location.reload();
            })
            .catch(function (erro) {

                console.error("ERRO AO DEVOLVER:", erro);

                alert("Não foi possível devolver o livro.");
            });
    };


    /* PAGINAÇÃO */

    function atualizarPaginacao(
        total
    ) {

        if (
            !textoPaginacao ||
            !paginacao
        ) {
            return;
        }


        paginacao.innerHTML =
            "";


        if (
            total === 0
        ) {

            textoPaginacao.textContent =
                "Mostrando 0 empréstimos";

            return;
        }


        const totalPaginas =
            Math.ceil(
                total /
                porPagina
            );


        const inicio =
            (
                paginaAtual - 1
            ) *
            porPagina +
            1;


        const fim =
            Math.min(
                paginaAtual *
                porPagina,
                total
            );


        textoPaginacao.textContent =
            "Mostrando " +
            inicio +
            " a " +
            fim +
            " de " +
            total +
            " empréstimo(s)";


        for (
            let numero = 1;
            numero <=
            totalPaginas;
            numero++
        ) {

            const botao =
                document.createElement(
                    "button"
                );


            botao.type =
                "button";


            botao.textContent =
                numero;


            if (
                numero ===
                paginaAtual
            ) {

                botao.classList.add(
                    "pagina-ativa"
                );
            }


            botao.addEventListener(
                "click",
                function () {

                    paginaAtual =
                        numero;

                    mostrarEmprestimos();
                }
            );


            paginacao.appendChild(
                botao
            );
        }
    }


    /* PESQUISAR */

    if (pesquisa) {

        pesquisa.addEventListener(
            "input",
            function () {

                filtro =
                    pesquisa.value
                        .trim()
                        .toLowerCase();

                paginaAtual = 1;

                mostrarEmprestimos();
            }
        );
    }

    /* ABA EM ANDAMENTO */

    if (
        abaEmAndamento
    ) {

        abaEmAndamento.addEventListener(
            "click",
            function () {

                abaAtual =
                    "andamento";

                paginaAtual =
                    1;


                abaEmAndamento
                    .classList.add(
                    "ativa"
                );


                if (
                    abaHistorico
                ) {

                    abaHistorico
                        .classList.remove(
                        "ativa"
                    );
                }


                mostrarEmprestimos();
            }
        );
    }


    /* ABA HISTÓRICO */

    if (
        abaHistorico
    ) {

        abaHistorico.addEventListener(
            "click",
            function () {

                abaAtual =
                    "historico";

                paginaAtual =
                    1;


                abaHistorico
                    .classList.add(
                    "ativa"
                );


                if (
                    abaEmAndamento
                ) {

                    abaEmAndamento
                        .classList.remove(
                        "ativa"
                    );
                }


                mostrarEmprestimos();
            }
        );
    }


    /* INICIAR */

    carregarEmprestimos();

})();
/* CONTADORES NA TELA DE LIVROS */

const quantidadeEmprestimosAtivos =
    document.getElementById(
        "quantidadeEmprestimosAtivos"
    );

const quantidadeDevolucoesRealizadas =
    document.getElementById(
        "quantidadeDevolucoesRealizadas"
    );

if (
    quantidadeEmprestimosAtivos ||
    quantidadeDevolucoesRealizadas
) {

    Promise.all([
        fetch("/usuarios/me"),
        fetch("/Emprestimo")
    ])

        .then(function (responses) {

            if (!responses[0].ok) {
                throw new Error(
                    "Erro ao buscar usuário"
                );
            }

            if (!responses[1].ok) {
                throw new Error(
                    "Erro ao buscar empréstimos"
                );
            }

            return Promise.all([
                responses[0].json(),
                responses[1].json()
            ]);
        })

        .then(function (dados) {

            const usuario =
                dados[0];

            const emprestimos =
                dados[1];


            /* EMPRÉSTIMOS DO USUÁRIO LOGADO */

            const emprestimosUsuario =
                emprestimos.filter(
                    function (emprestimo) {

                        return (
                            emprestimo.usuario &&
                            emprestimo.usuario.id ===
                            usuario.id
                        );
                    }
                );


            /* EMPRÉSTIMOS ATIVOS */

            const ativos =
                emprestimosUsuario.filter(
                    function (emprestimo) {

                        return (
                            emprestimo.status !==
                            "DEVOLVIDO"
                        );
                    }
                );


            /* DEVOLUÇÕES REALIZADAS */

            const devolvidos =
                emprestimosUsuario.filter(
                    function (emprestimo) {

                        return (
                            emprestimo.status ===
                            "DEVOLVIDO"
                        );
                    }
                );


            /* ATUALIZAR CARD ATIVOS */

            if (
                quantidadeEmprestimosAtivos
            ) {

                quantidadeEmprestimosAtivos
                    .textContent =
                    ativos.length;
            }


            /* ATUALIZAR CARD DEVOLVIDOS */

            if (
                quantidadeDevolucoesRealizadas
            ) {

                quantidadeDevolucoesRealizadas
                    .textContent =
                    devolvidos.length;
            }

        })

        .catch(function (erro) {

            console.error(
                "ERRO NOS CONTADORES DA TELA DE LIVROS:",
                erro
            );

        });
}

/* CONFIGURAÇÕES DO ADMIN*/

document.addEventListener("DOMContentLoaded", function () {

    /*  ABAS DAS CONFIGURAÇÕES*/

    const botoesConfiguracao = document.querySelectorAll(".config-aba");
    const conteudosConfiguracao = document.querySelectorAll(".config-conteudo");

    if (botoesConfiguracao.length > 0 && conteudosConfiguracao.length > 0) {

        botoesConfiguracao.forEach(function (botao) {

            botao.addEventListener("click", function () {

                const abaSelecionada = botao.getAttribute("data-config");


                if (!abaSelecionada) {

                    console.error("Aba sem data-config:", botao);

                    return;

                }


                /* REMOVE ATIVO DOS BOTÕES */

                botoesConfiguracao.forEach(function (item) {

                    item.classList.remove("ativa");

                });


                /* ESCONDE TODOS OS CONTEÚDOS */

                conteudosConfiguracao.forEach(function (conteudo) {

                    conteudo.classList.remove("ativo");

                });


                /* ATIVA O BOTÃO CLICADO */

                botao.classList.add("ativa");


                /* PROCURA O CONTEÚDO DA ABA */

                const conteudoSelecionado = document.querySelector('[data-config-conteudo="' + abaSelecionada + '"]');

                /* MOSTRA O CONTEÚDO */

                if (conteudoSelecionado) {
                    conteudoSelecionado.classList.add("ativo");
                } else {
                    console.error("Conteúdo não encontrado para a aba:", abaSelecionada);
                }
            });
        });
    }


    /*  CONFIGURAÇÕES GERAIS */

    const formConfiguracaoBiblioteca = document.getElementById("formConfiguracaoBiblioteca");
    const nomeBiblioteca = document.getElementById("nomeBiblioteca");
    const enderecoBiblioteca = document.getElementById("enderecoBiblioteca");
    const cidadeBiblioteca = document.getElementById("cidadeBiblioteca");
    const estadoBiblioteca = document.getElementById("estadoBiblioteca");
    const telefoneBiblioteca = document.getElementById("telefoneBiblioteca");
    const emailBiblioteca = document.getElementById("emailBiblioteca");
    const descricaoBiblioteca = document.getElementById("descricaoBiblioteca");

    /* = CARREGAR CONFIGURAÇÕES GERAIS */

    if (formConfiguracaoBiblioteca) {

        let configuracaoGeralSalva = null;


        try {

            const dadosSalvos = localStorage.getItem("configuracaoGeral");


            if (dadosSalvos) {

                configuracaoGeralSalva = JSON.parse(dadosSalvos);

            }

        } catch (erro) {

            console.error("Erro ao carregar configurações gerais:", erro);

        }


        if (configuracaoGeralSalva) {

            if (nomeBiblioteca) {

                nomeBiblioteca.value = configuracaoGeralSalva.nome || "";

            }


            if (enderecoBiblioteca) {

                enderecoBiblioteca.value = configuracaoGeralSalva.endereco || "";

            }


            if (cidadeBiblioteca) {

                cidadeBiblioteca.value = configuracaoGeralSalva.cidade || "";

            }


            if (estadoBiblioteca) {

                estadoBiblioteca.value = configuracaoGeralSalva.estado || "";

            }


            if (telefoneBiblioteca) {

                telefoneBiblioteca.value = configuracaoGeralSalva.telefone || "";

            }


            if (emailBiblioteca) {

                emailBiblioteca.value = configuracaoGeralSalva.email || "";

            }


            if (descricaoBiblioteca) {

                descricaoBiblioteca.value = configuracaoGeralSalva.descricao || "";

            }

        }


        /* =========================================
           SALVAR CONFIGURAÇÕES GERAIS
        ========================================= */

        formConfiguracaoBiblioteca.addEventListener("submit", function (event) {

            event.preventDefault();


            const configuracaoGeral = {

                nome: nomeBiblioteca ? nomeBiblioteca.value.trim() : "",


                endereco: enderecoBiblioteca ? enderecoBiblioteca.value.trim() : "",


                cidade: cidadeBiblioteca ? cidadeBiblioteca.value.trim() : "",


                estado: estadoBiblioteca ? estadoBiblioteca.value.trim() : "",


                telefone: telefoneBiblioteca ? telefoneBiblioteca.value.trim() : "",


                email: emailBiblioteca ? emailBiblioteca.value.trim() : "",


                descricao: descricaoBiblioteca ? descricaoBiblioteca.value.trim() : ""

            };


            localStorage.setItem("configuracaoGeral", JSON.stringify(configuracaoGeral));


            alert("Configurações gerais salvas com sucesso!");

        });

    }


    /* CONFIGURAÇÕES DE EMPRÉSTIMO */

    const formConfiguracaoEmprestimo = document.getElementById("formConfiguracaoEmprestimo");
    const prazoEmprestimo = document.getElementById("prazoEmprestimo");
    const limiteLivrosUsuario = document.getElementById("limiteLivrosUsuario");
    const permitirRenovacao = document.getElementById("permitirRenovacao");
    const diasTolerancia = document.getElementById("diasTolerancia");


    /*  CARREGAR CONFIGURAÇÕES DE EMPRÉSTIMO*/

    if (formConfiguracaoEmprestimo) {
        let configuracaoEmprestimoSalva = null;

        try {

            const dadosSalvos = localStorage.getItem("configuracaoEmprestimo");
            if (dadosSalvos) {
                configuracaoEmprestimoSalva = JSON.parse(dadosSalvos);
            }

        } catch (erro) {
            console.error("Erro ao carregar configurações de empréstimo:", erro);
        }

        if (configuracaoEmprestimoSalva) {
            if (prazoEmprestimo) {
                prazoEmprestimo.value = configuracaoEmprestimoSalva.prazo ?? "";
            }

            if (limiteLivrosUsuario) {
                limiteLivrosUsuario.value = configuracaoEmprestimoSalva.limite ?? "";
            }

            if (permitirRenovacao) {
                permitirRenovacao.checked = configuracaoEmprestimoSalva.renovacao === true;
            }
            if (diasTolerancia) {
                diasTolerancia.value = configuracaoEmprestimoSalva.tolerancia ?? "";
            }

        }
    }

    /* CONFIGURAÇÕES DE MULTA*/

    const formConfiguracaoMulta = document.getElementById("formConfiguracaoMulta");
    const valorMultaDia = document.getElementById("valorMultaDia");
    const multaAutomatica = document.getElementById("multaAutomatica");
    const bloquearUsuarioMulta = document.getElementById("bloquearUsuarioMulta");


});


// RELATÓRIO - RESUMO GERAL

function carregarResumoRelatorio() {

    fetch("/relatorios/resumo")

        .then(function (response) {

            if (!response.ok) {
                throw new Error("Erro ao carregar relatório.");
            }

            return response.json();
        })

        .then(function (data) {

            console.log("Relatório recebido:", data);

            const totalUsuarios = document.getElementById("relatorioTotalUsuarios");
            const totalLivros = document.getElementById("relatorioTotalLivros");
            const totalEmprestimos = document.getElementById("relatorioTotalEmprestimos");
            const totalDevolucoes = document.getElementById("relatorioTotalDevolucoes");
            const totalAtrasos = document.getElementById("relatorioTotalAtrasos");

            if (totalUsuarios) {
                totalUsuarios.textContent = data.totalUsuarios;
            }
            if (totalLivros) {
                totalLivros.textContent = data.totalLivros;
            }
            if (totalEmprestimos) {
                totalEmprestimos.textContent = data.totalEmprestimos;
            }
            if (totalDevolucoes) {
                totalDevolucoes.textContent = data.totalDevolucoes;
            }

            if (totalAtrasos) {
                totalAtrasos.textContent = data.totalAtrasados;
            }

        })

        .catch(function (error) {
            console.error("Erro ao carregar resumo do relatório:", error);
        });
}
/* RELATÓRIO - FILTROS E TABELAS */

(function () {

    const formRelatorio =
        document.getElementById("formRelatorio");

    if (!formRelatorio) {
        return;
    }

    const tipoRelatorio =
        document.getElementById("tipoRelatorio");
    const periodoRelatorio =
        document.getElementById("periodoRelatorio");
    const dataInicialRelatorio =
        document.getElementById("dataInicialRelatorio");
    const dataFinalRelatorio =
        document.getElementById("dataFinalRelatorio");

    const corpoPeriodo =
        document.getElementById(
            "corpoRelatorioEmprestimosPeriodo"
        );

    const corpoMaisEmprestados =
        document.getElementById(
            "corpoLivrosMaisEmprestados"
        );

    const corpoRecentes =
        document.getElementById(
            "corpoRelatorioEmprestimosRecentes"
        );


    let todosEmprestimos = [];


    /* FORMATAR DATA */

    function formatarDataRelatorio(data) {

        if (!data) {
            return "-";
        }

        const partes =
            data.split("-");

        if (partes.length !== 3) {
            return data;
        }

        return (
            partes[2] +
            "/" +
            partes[1] +
            "/" +
            partes[0]
        );
    }


    /* DATA PARA COMPARAÇÃO */

    function criarData(data) {

        if (!data) {
            return null;
        }

        return new Date(
            data + "T00:00:00"
        );
    }


    /* DESCOBRIR PERÍODO */

    function obterDatasPeriodo() {

        const hoje =
            new Date();

        hoje.setHours(
            0,
            0,
            0,
            0
        );


        let inicio =
            new Date(hoje);

        let fim =
            new Date(hoje);


        const periodo =
            periodoRelatorio.value;


        if (periodo === "semana") {

            const diaSemana =
                hoje.getDay();

            const diferenca =
                diaSemana === 0
                    ? 6
                    : diaSemana - 1;

            inicio.setDate(
                hoje.getDate() -
                diferenca
            );

            fim.setDate(
                inicio.getDate() + 6
            );

        } else if (
            periodo === "mes"
        ) {

            inicio =
                new Date(
                    hoje.getFullYear(),
                    hoje.getMonth(),
                    1
                );

            fim =
                new Date(
                    hoje.getFullYear(),
                    hoje.getMonth() + 1,
                    0
                );

        } else if (
            periodo === "ano"
        ) {

            inicio =
                new Date(
                    hoje.getFullYear(),
                    0,
                    1
                );

            fim =
                new Date(
                    hoje.getFullYear(),
                    11,
                    31
                );

        } else if (
            periodo === "personalizado"
        ) {

            if (
                !dataInicialRelatorio.value ||
                !dataFinalRelatorio.value
            ) {

                alert(
                    "Informe a data inicial e a data final."
                );

                return null;
            }

            inicio =
                criarData(
                    dataInicialRelatorio.value
                );

            fim =
                criarData(
                    dataFinalRelatorio.value
                );


            if (inicio > fim) {

                alert(
                    "A data inicial não pode ser maior que a data final."
                );

                return null;
            }
        }


        inicio.setHours(
            0,
            0,
            0,
            0
        );

        fim.setHours(
            23,
            59,
            59,
            999
        );


        return {
            inicio: inicio,
            fim: fim
        };
    }


    /* FILTRAR EMPRÉSTIMOS */

    periodoRelatorio.addEventListener(
        "change",
        function () {

            const personalizado =
                periodoRelatorio.value === "personalizado";

            dataInicialRelatorio.disabled =
                !personalizado;

            dataFinalRelatorio.disabled =
                !personalizado;

            if (!personalizado) {

                dataInicialRelatorio.value = "";
                dataFinalRelatorio.value = "";
            }
        }
    );
    /* EMPRÉSTIMOS POR PERÍODO */

    function mostrarEmprestimosPeriodo(
        emprestimos
    ) {

        corpoPeriodo.innerHTML =
            "";


        if (
            emprestimos.length === 0
        ) {

            corpoPeriodo.innerHTML = `
                <tr>
                    <td colspan="3"
                        style="
                            text-align:center;
                            padding:25px;
                        "
                    >
                        Nenhum empréstimo encontrado no período.
                    </td>
                </tr>
            `;

            return;
        }


        const agrupados = {};


        emprestimos.forEach(
            function (emprestimo) {

                const data =
                    emprestimo.dataEmprestimo;

                if (!data) {
                    return;
                }

                if (!agrupados[data]) {
                    agrupados[data] = 0;
                }

                agrupados[data]++;
            }
        );


        const datas =
            Object.keys(agrupados)
                .sort();


        datas.forEach(
            function (data) {

                const quantidade =
                    agrupados[data];


                const linha =
                    document.createElement(
                        "tr"
                    );


                linha.innerHTML = `
                    <td>
                        ${formatarDataRelatorio(data)}
                    </td>

                    <td>
                        ${quantidade}
                    </td>

                    <td>
                        ${quantidade}
                    </td>
                `;


                corpoPeriodo.appendChild(
                    linha
                );
            }
        );
    }


    /* LIVROS MAIS EMPRESTADOS */

    function mostrarLivrosMaisEmprestados(
        emprestimos
    ) {

        corpoMaisEmprestados.innerHTML =
            "";


        if (
            emprestimos.length === 0
        ) {

            corpoMaisEmprestados.innerHTML = `
                <tr>
                    <td colspan="3"
                        style="
                            text-align:center;
                            padding:25px;
                        "
                    >
                        Nenhum livro encontrado.
                    </td>
                </tr>
            `;

            return;
        }


        const livros = {};


        emprestimos.forEach(
            function (emprestimo) {

                if (
                    !emprestimo.livro
                ) {
                    return;
                }


                const id =
                    emprestimo.livro.id;


                if (!livros[id]) {

                    livros[id] = {
                        titulo:
                            emprestimo
                                .livro
                                .titulo ||
                            "-",

                        quantidade: 0
                    };
                }


                livros[id]
                    .quantidade++;
            }
        );


        const ranking =
            Object.values(livros)
                .sort(
                    function (a, b) {

                        return (
                            b.quantidade -
                            a.quantidade
                        );
                    }
                );


        ranking.forEach(
            function (
                livro,
                indice
            ) {

                const linha =
                    document.createElement(
                        "tr"
                    );


                linha.innerHTML = `
                    <td>
                        ${indice + 1}
                    </td>

                    <td>
                        ${livro.titulo}
                    </td>

                    <td>
                        ${livro.quantidade}
                    </td>
                `;


                corpoMaisEmprestados
                    .appendChild(
                        linha
                    );
            }
        );
    }


    /* EMPRÉSTIMOS RECENTES */

    function mostrarEmprestimosRecentes(
        emprestimos
    ) {

        corpoRecentes.innerHTML =
            "";


        if (
            emprestimos.length === 0
        ) {

            corpoRecentes.innerHTML = `
                <tr>
                    <td colspan="6"
                        style="
                            text-align:center;
                            padding:25px;
                        "
                    >
                        Nenhum empréstimo encontrado.
                    </td>
                </tr>
            `;

            return;
        }


        const recentes =
            [...emprestimos]

                .sort(
                    function (a, b) {

                        return (
                            new Date(
                                b.dataEmprestimo
                            ) -
                            new Date(
                                a.dataEmprestimo
                            )
                        );
                    }
                )

                .slice(
                    0,
                    5
                );


        recentes.forEach(
            function (emprestimo) {

                let status =
                    "Em andamento";


                if (
                    emprestimo.status ===
                    "DEVOLVIDO"
                ) {

                    status =
                        "Devolvido";

                } else if (
                    emprestimo
                        .dataPrevistaDevolucao
                ) {

                    const hoje =
                        new Date();

                    hoje.setHours(
                        0,
                        0,
                        0,
                        0
                    );


                    const prevista =
                        criarData(
                            emprestimo
                                .dataPrevistaDevolucao
                        );


                    if (
                        prevista < hoje
                    ) {

                        status =
                            "Atrasado";
                    }
                }


                const linha =
                    document.createElement(
                        "tr"
                    );


                linha.innerHTML = `
                    <td>
                        ${emprestimo.id}
                    </td>

                    <td>
                        ${
                    emprestimo.usuario
                        ?.nome ||
                    "-"
                }
                    </td>

                    <td>
                        ${
                    emprestimo.livro
                        ?.titulo ||
                    "-"
                }
                    </td>

                    <td>
                        ${
                    formatarDataRelatorio(
                        emprestimo
                            .dataEmprestimo
                    )
                }
                    </td>

                    <td>
                        ${
                    formatarDataRelatorio(
                        emprestimo
                            .dataPrevistaDevolucao
                    )
                }
                    </td>

                    <td>
                        ${status}
                    </td>
                `;


                corpoRecentes.appendChild(
                    linha
                );
            }
        );
    }
    /* FILTRAR EMPRÉSTIMOS DO RELATÓRIO */

    function filtrarEmprestimosRelatorio() {

        const datas = obterDatasPeriodo();

        if (!datas) {
            return null;
        }

        const tipo = tipoRelatorio.value;

        return todosEmprestimos.filter(
            function (emprestimo) {

                let dataReferencia;

                if (tipo === "devolucoes") {

                    if (emprestimo.status !== "DEVOLVIDO") {
                        return false;
                    }

                    dataReferencia =
                        emprestimo.dataDevolucao;

                } else {

                    dataReferencia =
                        emprestimo.dataEmprestimo;
                }

                if (!dataReferencia) {
                    return false;
                }

                const data =
                    criarData(dataReferencia);

                return (
                    data >= datas.inicio &&
                    data <= datas.fim
                );
            }
        );
    }
    /* GERAR RELATÓRIO */

    function gerarRelatorio() {

        if (
            tipoRelatorio.value ===
            ""
        ) {

            alert(
                "Selecione o tipo de relatório."
            );

            return;
        }


        if (
            tipoRelatorio.value ===
            "multas"
        ) {

            alert(
                "O sistema ainda não possui módulo de multas."
            );

            return;
        }


        const emprestimos =
            filtrarEmprestimosRelatorio();


        if (!emprestimos) {
            return;
        }


        mostrarEmprestimosPeriodo(
            emprestimos
        );

        mostrarLivrosMaisEmprestados(
            emprestimos
        );

        mostrarEmprestimosRecentes(
            emprestimos
        );
    }


    /* PERÍODO PERSONALIZADO */

    periodoRelatorio.addEventListener(
        "change",
        function () {

            const personalizado =
                periodoRelatorio.value === "personalizado";

            dataInicialRelatorio.disabled =
                !personalizado;

            dataFinalRelatorio.disabled =
                !personalizado;

            if (!personalizado) {

                dataInicialRelatorio.value = "";
                dataFinalRelatorio.value = "";

                gerarRelatorio();
            }
        }
    );

    /* FORMULÁRIO */

    formRelatorio.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            console.log("GERANDO RELATÓRIO");

            gerarRelatorio();
        });

    /* CARREGAR BACKEND */

    fetch("/Emprestimo")

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Erro ao carregar empréstimos."
                );

            }

            return response.json();
        })

        .then(function (emprestimos) {

            todosEmprestimos =
                emprestimos;


            tipoRelatorio.value =
                "geral";


            dataInicialRelatorio.disabled =
                true;

            dataFinalRelatorio.disabled =
                true;


            gerarRelatorio();
        })

        .catch(function (erro) {

            console.error(
                "ERRO NO RELATÓRIO:",
                erro
            );
        });


})();


// Executa somente se estiver na página de relatório
if (document.getElementById("relatorioTotalUsuarios")) {
    carregarResumoRelatorio();
}
// CONFIGURAÇÕES - API SPRING BOOT

let idConfiguracaoAtual = null;

// CARREGAR CONFIGURAÇÃO DO BANCO

function carregarConfiguracaoSistema() {
    fetch("/configuracoes")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Erro ao carregar configurações.");
            }
            return response.json();
        })

        .then(function (data) {
            console.log("Configurações recebidas:", data);

            if (Array.isArray(data) && data.length > 0) {
                preencherConfiguracao(data[0]);
            }

        })
        .catch(function (error) {
            console.error("Erro ao carregar configurações:", error);

        });

}

// PREENCHER CAMPOS DO HTML

function preencherConfiguracao(configuracao) {
    idConfiguracaoAtual = configuracao.id;
    const nomeBiblioteca = document.getElementById("nomeBiblioteca");
    const enderecoBiblioteca = document.getElementById("enderecoBiblioteca");
    const cidadeBiblioteca = document.getElementById("cidadeBiblioteca");
    const estadoBiblioteca = document.getElementById("estadoBiblioteca");
    const telefoneBiblioteca = document.getElementById("telefoneBiblioteca");
    const emailBiblioteca = document.getElementById("emailBiblioteca");
    const descricaoBiblioteca = document.getElementById("descricaoBiblioteca");
    const prazoEmprestimo = document.getElementById("prazoEmprestimo");
    const limiteLivrosUsuario = document.getElementById("limiteLivrosUsuario");
    const permitirRenovacao = document.getElementById("permitirRenovacao");
    const diasTolerancia = document.getElementById("diasTolerancia");
    const valorMultaDia = document.getElementById("valorMultaDia");
    const multaAutomatica = document.getElementById("multaAutomatica");
    const bloquearUsuarioMulta = document.getElementById("bloquearUsuarioMulta");

    if (nomeBiblioteca) {
        nomeBiblioteca.value = configuracao.nomeBiblioteca || "";
    }

    if (enderecoBiblioteca) {
        enderecoBiblioteca.value = configuracao.endereco || "";
    }

    if (cidadeBiblioteca) {
        cidadeBiblioteca.value = configuracao.cidade || "";
    }

    if (estadoBiblioteca) {
        estadoBiblioteca.value = configuracao.estado || "";
    }

    if (telefoneBiblioteca) {
        telefoneBiblioteca.value = configuracao.telefone || "";
    }

    if (emailBiblioteca) {
        emailBiblioteca.value = configuracao.email || "";
    }

    if (descricaoBiblioteca) {
        descricaoBiblioteca.value = configuracao.descricao || "";
    }


    if (prazoEmprestimo) {
        prazoEmprestimo.value = configuracao.prazoEmprestimo ?? "";
    }

    if (limiteLivrosUsuario) {
        limiteLivrosUsuario.value = configuracao.limiteLivrosUsuario ?? "";
    }

    if (permitirRenovacao) {
        permitirRenovacao.checked = configuracao.permitirRenovacao === true;
    }

    if (diasTolerancia) {
        diasTolerancia.value = configuracao.diasTolerancia ?? "";
    }


    if (valorMultaDia) {
        valorMultaDia.value = configuracao.valorMultaDia ?? "";
    }

    if (multaAutomatica) {
        multaAutomatica.checked = configuracao.multaAutomatica === true;
    }

    if (bloquearUsuarioMulta) {
        bloquearUsuarioMulta.checked = configuracao.bloquearUsuarioMulta === true;
    }

}

// PEGAR DADOS DOS CAMPOS
function pegarDadosConfiguracao() {
    return {
        nomeBiblioteca: document.getElementById("nomeBiblioteca")?.value.trim() || "",
        endereco: document.getElementById("enderecoBiblioteca")?.value.trim() || "",
        cidade: document.getElementById("cidadeBiblioteca")?.value.trim() || "",
        estado: document.getElementById("estadoBiblioteca")?.value.trim() || "",
        telefone: document.getElementById("telefoneBiblioteca")?.value.trim() || "",
        email: document.getElementById("emailBiblioteca")?.value.trim() || "",
        descricao: document.getElementById("descricaoBiblioteca")?.value.trim() || "",
        prazoEmprestimo: Number(document.getElementById("prazoEmprestimo")?.value) || 0,
        limiteLivrosUsuario: Number(document.getElementById("limiteLivrosUsuario")?.value) || 0,
        permitirRenovacao: document.getElementById("permitirRenovacao")?.checked || false,
        diasTolerancia: Number(document.getElementById("diasTolerancia")?.value) || 0,
        valorMultaDia: Number(document.getElementById("valorMultaDia")?.value) || 0,
        multaAutomatica: document.getElementById("multaAutomatica")?.checked || false,
        bloquearUsuarioMulta: document.getElementById("bloquearUsuarioMulta")?.checked || false

    };

}
// SALVAR / ATUALIZAR CONFIGURAÇÃO
function salvarConfiguracaoSistema() {
    const configuracao = pegarDadosConfiguracao();
    let url = "/configuracoes";
    let metodo = "POST";


    if (idConfiguracaoAtual) {
        url += "/" + idConfiguracaoAtual;
        metodo = "PUT";

    }

    fetch(url, {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(configuracao)

    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Erro ao salvar configuração.");
            }
            return response.json();

        })
        .then(function (data) {
            console.log("Configuração salva:", data);
            idConfiguracaoAtual = data.id;
            alert("Configurações salvas com sucesso!");

        })

        .catch(function (error) {

            console.error("Erro ao salvar configurações:", error);
            alert("Não foi possível salvar as configurações.");
        });
}



// CARREGAR AO ABRIR CONFIGURAÇÕES
if (document.getElementById("formConfiguracaoBiblioteca")) {
    carregarConfiguracaoSistema();
}
/* BLOQUEIO DOS LIVROS EM DESTAQUE */

const livrosProtegidos =
    document.querySelectorAll(".livro-protegido");

livrosProtegidos.forEach(function (livro) {
    livro.addEventListener("click", function (event) {

    });

});
/* CARREGAR USUÁRIO AUTENTICADO */

fetch("/usuarios/me")

    .then(function (response) {

        const contentType =
            response.headers.get(
                "content-type"
            );

        if (
            !contentType ||
            !contentType.includes(
                "application/json"
            )
        ) {
            return null;
        }

        if (!response.ok) {
            throw new Error(
                "Erro ao carregar usuário"
            );
        }

        return response.json();
    })

    .then(function (usuario) {

        if (!usuario) {
            return;
        }

        usuarioAtual = usuario;

        carregarFotoPerfil();

        console.log(
            "USUÁRIO RECEBIDO:",
            usuario
        );


        const nomeUsuarioMenu =
            document.getElementById(
                "nomeUsuarioMenu"
            );

        const emailUsuarioMenu =
            document.getElementById(
                "emailUsuarioMenu"
            );


        if (nomeUsuarioMenu) {
            nomeUsuarioMenu.textContent =
                usuario.nome || "Usuário";
        }

        if (emailUsuarioMenu) {
            emailUsuarioMenu.textContent =
                usuario.email || "";
        }


        const nomePerfil =
            document.getElementById(
                "nomePerfil"
            );

        const emailPerfil =
            document.getElementById(
                "emailPerfil"
            );

        const cpfPerfil =
            document.getElementById(
                "cpfPerfil"
            );

        const telefonePerfil =
            document.getElementById(
                "telefonePerfil"
            );


        if (nomePerfil) {
            nomePerfil.textContent =
                usuario.nome || "Usuário";
        }

        if (emailPerfil) {
            emailPerfil.textContent =
                usuario.email || "";
        }

        if (cpfPerfil) {
            cpfPerfil.textContent =
                usuario.cpf || "";
        }

        if (telefonePerfil) {
            telefonePerfil.textContent =
                usuario.telefone || "";
        }


        const nomePerfilInput =
            document.getElementById(
                "nomePerfilInput"
            );

        const telefonePerfilInput =
            document.getElementById(
                "telefonePerfilInput"
            );


        if (nomePerfilInput) {
            nomePerfilInput.value =
                usuario.nome || "";
        }

        if (telefonePerfilInput) {
            telefonePerfilInput.value =
                usuario.telefone || "";
        }

    })

    .catch(function (erro) {

        console.error(
            "ERRO AO CARREGAR USUÁRIO:",
            erro
        );

    });
/*  LISTAR USUÁRIOS DO ADMIN */

const corpoTabelaUsuarios =
    document.getElementById("corpoTabelaUsuarios");

const textoPaginacaoUsuarios =
    document.getElementById("textoPaginacaoUsuarios");

const pesquisaUsuario =
    document.getElementById("pesquisaUsuario");

const formPesquisaUsuario =
    document.getElementById("formPesquisaUsuario");

let listaUsuarios = [];


function mostrarUsuarios(lista) {

    if (!corpoTabelaUsuarios) {
        return;
    }

    corpoTabelaUsuarios.innerHTML = "";

    if (lista.length === 0) {

        corpoTabelaUsuarios.innerHTML = `
            <tr>
                <td colspan="6"
                    style="text-align:center; padding:30px;">
                    Nenhum usuário encontrado.
                </td>
            </tr>
        `;

        if (textoPaginacaoUsuarios) {
            textoPaginacaoUsuarios.textContent =
                "Mostrando 0 usuários";
        }

        return;
    }


    lista.forEach(function (usuario) {

        const linha =
            document.createElement("tr");

        linha.innerHTML = `
            <td>${usuario.id ?? "-"}</td>

            <td>${usuario.nome ?? "-"}</td>

            <td>${usuario.cpf ?? "-"}</td>

            <td>${usuario.email ?? "-"}</td>

            <td>${usuario.telefone ?? "-"}</td>

            <td>${usuario.perfil ?? "-"}</td>
        `;

        corpoTabelaUsuarios.appendChild(linha);

    });


    if (textoPaginacaoUsuarios) {

        textoPaginacaoUsuarios.textContent =
            "Mostrando " +
            lista.length +
            " usuário(s)";
    }
}


/* BUSCAR USUÁRIOS NO SPRING BOOT */

function carregarUsuariosAdmin() {

    if (!corpoTabelaUsuarios) {
        return;
    }


    fetch("/usuarios")

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Erro ao carregar usuários. Status: " +
                    response.status
                );

            }

            return response.json();

        })

        .then(function (usuarios) {

            console.log(
                "USUÁRIOS RECEBIDOS:",
                usuarios
            );

            listaUsuarios = usuarios;

            mostrarUsuarios(listaUsuarios);

        })

        .catch(function (erro) {

            console.error(
                "ERRO AO CARREGAR USUÁRIOS:",
                erro
            );

        });

}


/* PESQUISA */

if (formPesquisaUsuario && pesquisaUsuario) {

    formPesquisaUsuario.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const pesquisa =
                pesquisaUsuario.value
                    .trim()
                    .toLowerCase();


            const usuariosFiltrados =
                listaUsuarios.filter(
                    function (usuario) {

                        const nome =
                            (usuario.nome || "")
                                .toLowerCase();

                        const cpf =
                            (usuario.cpf || "")
                                .toLowerCase();

                        const email =
                            (usuario.email || "")
                                .toLowerCase();


                        return (
                            nome.includes(pesquisa) ||
                            cpf.includes(pesquisa) ||
                            email.includes(pesquisa)
                        );

                    }
                );


            mostrarUsuarios(
                usuariosFiltrados
            );

        }
    );

}


/* MOSTRA TODOS NOVAMENTE
   QUANDO APAGAR A PESQUISA */

if (pesquisaUsuario) {

    pesquisaUsuario.addEventListener(
        "input",
        function () {

            if (
                pesquisaUsuario.value.trim() === ""
            ) {

                mostrarUsuarios(
                    listaUsuarios
                );

            }

        }
    );

}


/* INICIAR */

if (corpoTabelaUsuarios) {

    carregarUsuariosAdmin();

}
/* LISTAR LIVROS DO ADMIN */

const corpoTabelaLivrosAdmin =
    document.getElementById("corpoTabelaLivrosAdmin");

const textoPaginacaoLivrosAdmin =
    document.getElementById("textoPaginacaoLivrosAdmin");

const pesquisaLivroAdmin =
    document.getElementById("pesquisaLivroAdmin");

const formPesquisaLivroAdmin =
    document.getElementById("formPesquisaLivroAdmin");

let listaLivrosAdmin = [];


function mostrarLivrosAdmin(lista) {

    if (!corpoTabelaLivrosAdmin) {
        return;
    }

    corpoTabelaLivrosAdmin.innerHTML = "";

    if (lista.length === 0) {

        corpoTabelaLivrosAdmin.innerHTML = `
            <tr>
                <td colspan="7"
                    style="text-align:center; padding:30px;">
                    Nenhum livro encontrado.
                </td>
            </tr>
        `;

        if (textoPaginacaoLivrosAdmin) {
            textoPaginacaoLivrosAdmin.textContent =
                "Mostrando 0 livros";
        }

        return;
    }

    lista.forEach(function (livro) {

        const linha =
            document.createElement("tr");

        linha.innerHTML = `
            <td>${livro.id ?? "-"}</td>
            <td>📕</td>
            <td>${livro.titulo ?? "-"}</td>
            <td>${livro.autor ?? "-"}</td>
            <td>${livro.categoria ?? livro.genero ?? "-"}</td>
            <td>${livro.isbn ?? "-"}</td>
            <td>${livro.quantidadeDisponivel ?? livro.quantidade ?? 0}</td>
        `;

        corpoTabelaLivrosAdmin.appendChild(linha);
    });

    if (textoPaginacaoLivrosAdmin) {

        textoPaginacaoLivrosAdmin.textContent =
            "Mostrando " +
            lista.length +
            " livro(s)";
    }
}


/* BUSCAR LIVROS NO BACKEND */

function carregarLivrosAdmin() {

    if (!corpoTabelaLivrosAdmin) {
        return;
    }

    fetch("/livros")

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Erro ao carregar livros. Status: " +
                    response.status
                );
            }

            return response.json();
        })

        .then(function (livros) {

            console.log(
                "LIVROS RECEBIDOS:",
                livros
            );

            listaLivrosAdmin = livros;

            mostrarLivrosAdmin(
                listaLivrosAdmin
            );
        })

        .catch(function (erro) {

            console.error(
                "ERRO AO CARREGAR LIVROS:",
                erro
            );
        });
}


/* PESQUISA */

if (formPesquisaLivroAdmin && pesquisaLivroAdmin) {

    formPesquisaLivroAdmin.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const pesquisa =
                pesquisaLivroAdmin.value
                    .trim()
                    .toLowerCase();

            const livrosFiltrados =
                listaLivrosAdmin.filter(
                    function (livro) {

                        const titulo =
                            (livro.titulo || "")
                                .toLowerCase();

                        const autor =
                            (livro.autor || "")
                                .toLowerCase();

                        const genero =
                            (
                                livro.categoria ||
                                livro.genero ||
                                ""
                            ).toLowerCase();

                        const isbn =
                            (livro.isbn || "")
                                .toLowerCase();

                        return (
                            titulo.includes(pesquisa) ||
                            autor.includes(pesquisa) ||
                            genero.includes(pesquisa) ||
                            isbn.includes(pesquisa)
                        );
                    }
                );

            mostrarLivrosAdmin(
                livrosFiltrados
            );
        }
    );
}


/* MOSTRAR TODOS AO LIMPAR PESQUISA */

if (pesquisaLivroAdmin) {

    pesquisaLivroAdmin.addEventListener(
        "input",
        function () {

            if (pesquisaLivroAdmin.value.trim() === "") {

                mostrarLivrosAdmin(
                    listaLivrosAdmin
                );
            }
        }
    );
}


/* INICIAR */

if (corpoTabelaLivrosAdmin) {
    carregarLivrosAdmin();


}
/* CARREGAR USUÁRIOS NO NOVO EMPRÉSTIMO */

const usuarioEmprestimo =
    document.getElementById("usuarioEmprestimo");

if (usuarioEmprestimo) {

    fetch("/usuarios")
        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Erro ao carregar usuários. Status: " +
                    response.status
                );
            }

            return response.json();
        })
        .then(function (usuarios) {

            usuarioEmprestimo.innerHTML = `
                <option value="">
                    Selecione um usuário
                </option>
            `;

            usuarios.forEach(function (usuario) {

                const option =
                    document.createElement("option");

                option.value = usuario.id;
                option.textContent = usuario.nome;

                usuarioEmprestimo.appendChild(option);
            });

        })
        .catch(function (erro) {

            console.error(
                "ERRO AO CARREGAR USUÁRIOS:",
                erro
            );

        });
    /* CARREGAR LIVROS NO NOVO EMPRÉSTIMO */

    const livroEmprestimo =
        document.getElementById("livroEmprestimo");

    if (livroEmprestimo) {

        fetch("/livros")
            .then(function (response) {

                if (!response.ok) {
                    throw new Error(
                        "Erro ao carregar livros. Status: " +
                        response.status
                    );
                }

                return response.json();
            })

            .then(function (livros) {

                console.log(
                    "LIVROS DO EMPRÉSTIMO:",
                    livros
                );

                livroEmprestimo.innerHTML = `
                <option value="">
                    Selecione um livro
                </option>
            `;

                livros.forEach(function (livro) {

                    const option =
                        document.createElement("option");

                    option.value = livro.id;
                    option.textContent = livro.titulo;

                    livroEmprestimo.appendChild(option);
                });

            })

            .catch(function (erro) {

                console.error(
                    "ERRO AO CARREGAR LIVROS:",
                    erro
                );

            });
    }
    /* MOSTRAR USUÁRIO SELECIONADO */
    if (usuarioEmprestimo) {
        usuarioEmprestimo.addEventListener("change", function () {

            const usuarioSelecionado =
                usuarioEmprestimo.options[usuarioEmprestimo.selectedIndex];

            const nomeUsuario =
                usuarioSelecionado.textContent;

            if (usuarioEmprestimo.value === "") {

                document.getElementById(
                    "nomeUsuarioEmprestimo"
                ).textContent =
                    "Nenhum usuário selecionado";

                document.getElementById(
                    "emailUsuarioEmprestimo"
                ).textContent =
                    "Selecione um usuário acima";

                return;
            }

            document.getElementById(
                "nomeUsuarioEmprestimo"
            ).textContent =
                nomeUsuario;

            const usuario =
                usuariosNovoEmprestimo.find(
                    function (item) {
                        return item.id == usuarioEmprestimo.value;
                    }
                );

            if (usuario) {

                document.getElementById(
                    "emailUsuarioEmprestimo"
                ).textContent =
                    usuario.email;
            }
        });
    }


    /* MOSTRAR LIVRO SELECIONADO */
    if (livroEmprestimo) {

        livroEmprestimo.addEventListener("change", function () {

            const livroSelecionado =
                livroEmprestimo.options[livroEmprestimo.selectedIndex];

            const tituloLivro =
                livroSelecionado.textContent;

            if (livroEmprestimo.value === "") {

                document.getElementById(
                    "tituloLivroEmprestimo"
                ).textContent =
                    "Nenhum livro selecionado";

                document.getElementById(
                    "autorLivroEmprestimo"
                ).textContent =
                    "Selecione um livro acima";

                document.getElementById(
                    "disponibilidadeLivro"
                ).textContent =
                    "Disponibilidade: -";

                return;
            }

            document.getElementById(
                "tituloLivroEmprestimo"
            ).textContent =
                tituloLivro;

            const livro =
                livrosNovoEmprestimo.find(
                    function (item) {
                        return item.id == livroEmprestimo.value;
                    }
                );

            if (livro) {

                document.getElementById(
                    "autorLivroEmprestimo"
                ).textContent =
                    livro.autor || "-";

                document.getElementById(
                    "disponibilidadeLivro"
                ).textContent =
                    "Disponibilidade: " +
                    (livro.disponiveis ??
                        livro.quantidadeDisponivel ??
                        livro.quantidade ??
                        0);
            }
        });
    }

}
(function () {

    console.log("1 - ENTROU NAS DEVOLUÇÕES");

    const corpoTabela =
        document.getElementById("corpoTabelaDevolucoes");

    const pesquisa =
        document.getElementById("pesquisaDevolucao");

    const abaDevolvidos =
        document.getElementById("abaDevolvidos");

    const abaTodas =
        document.getElementById("abaTodasDevolucoes");
    const textoPaginacao =
        document.getElementById("textoPaginacaoDevolucoes");
    const paginacao =
        document.getElementById("paginacaoDevolucoes");
    const totalRealizadas =
        document.getElementById("totalDevolucoesRealizadas");
    const totalAtivas =
        document.getElementById("totalDevolucoesAtivas");
    const totalAtrasadas =
        document.getElementById("totalDevolucoesAtrasadas");
    const totalHistorico =
        document.getElementById("totalHistoricoDevolucoes");

    console.log("2 - TABELA:", corpoTabela);

    if (!corpoTabela) {
        console.log("3 - NÃO ACHOU A TABELA");
        return;
    }
    console.log("3 - ACHOU A TABELA");
    let emprestimosUsuario = [];
    let filtro = "";
    let abaAtual = "devolvidos";
    let paginaAtual = 1;
    const porPagina = 5;


    /* FORMATAR DATA */

    function formatarDataDevolucao(data) {

        if (!data) {
            return "-";
        }

        const partes = data.split("-");

        if (partes.length !== 3) {
            return data;
        }

        return (
            partes[2] +
            "/" +
            partes[1] +
            "/" +
            partes[0]
        );
    }


    /* VERIFICAR ATRASO */

    function estaAtrasadoDevolucao(emprestimo) {

        if (
            emprestimo.status === "DEVOLVIDO"
        ) {
            return false;
        }

        if (
            !emprestimo.dataPrevistaDevolucao
        ) {
            return false;
        }

        const hoje = new Date();

        hoje.setHours(
            0,
            0,
            0,
            0
        );

        const dataPrevista =
            new Date(
                emprestimo.dataPrevistaDevolucao +
                "T00:00:00"
            );

        return dataPrevista < hoje;
    }


    /* ATUALIZAR CARDS */

    function atualizarCardsDevolucao() {

        const devolvidos =
            emprestimosUsuario.filter(
                function (emprestimo) {

                    return (
                        emprestimo.status ===
                        "DEVOLVIDO"
                    );
                }
            );

        const ativos =
            emprestimosUsuario.filter(
                function (emprestimo) {

                    return (
                        emprestimo.status !==
                        "DEVOLVIDO"
                    );
                }
            );

        const atrasados =
            emprestimosUsuario.filter(
                function (emprestimo) {

                    return estaAtrasadoDevolucao(
                        emprestimo
                    );
                }
            );


        if (totalRealizadas) {
            totalRealizadas.textContent =
                devolvidos.length;
        }

        if (totalAtivas) {
            totalAtivas.textContent =
                ativos.length;
        }

        if (totalAtrasadas) {
            totalAtrasadas.textContent =
                atrasados.length;
        }

        if (totalHistorico) {
            totalHistorico.textContent =
                emprestimosUsuario.length;
        }
    }


    /* FILTRAR */

    function filtrarDevolucoes() {

        return emprestimosUsuario.filter(
            function (emprestimo) {

                if (
                    abaAtual === "devolvidos" &&
                    emprestimo.status !== "DEVOLVIDO"
                ) {
                    return false;
                }


                if (filtro !== "") {

                    const titulo =
                        (
                            emprestimo.livro?.titulo ||
                            ""
                        ).toLowerCase();

                    const autor =
                        (
                            emprestimo.livro?.autor ||
                            ""
                        ).toLowerCase();

                    return (
                        titulo.includes(filtro) ||
                        autor.includes(filtro)
                    );
                }


                return true;
            }
        );
    }


    /* MOSTRAR TABELA */

    function mostrarDevolucoes() {

        const lista =
            filtrarDevolucoes();

        corpoTabela.innerHTML = "";


        if (lista.length === 0) {

            corpoTabela.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        style="
                            text-align:center;
                            padding:35px;
                        "
                    >
                        ${
                abaAtual === "devolvidos"
                    ? "Você ainda não possui devoluções realizadas."
                    : "Nenhum empréstimo encontrado."
            }
                    </td>
                </tr>
            `;

            atualizarPaginacaoDevolucao(0);

            return;
        }


        const inicio =
            (paginaAtual - 1) *
            porPagina;

        const fim =
            inicio +
            porPagina;

        const pagina =
            lista.slice(
                inicio,
                fim
            );


        pagina.forEach(
            function (emprestimo) {

                const linha =
                    document.createElement("tr");

                let status = "Em andamento";

                if (
                    emprestimo.status ===
                    "DEVOLVIDO"
                ) {
                    status = "Devolvido";

                } else if (
                    estaAtrasadoDevolucao(
                        emprestimo
                    )
                ) {
                    status = "Atrasado";
                }


                linha.innerHTML = `

                    <td>
                        ${
                    emprestimo.livro?.titulo ||
                    "-"
                }
                    </td>

                    <td>
                        ${
                    emprestimo.livro?.autor ||
                    "-"
                }
                    </td>

                    <td>
                        ${
                    formatarDataDevolucao(
                        emprestimo.dataEmprestimo
                    )
                }
                    </td>

                    <td>
                        ${
                    formatarDataDevolucao(
                        emprestimo.dataPrevistaDevolucao
                    )
                }
                    </td>

                    <td>
                        ${
                    formatarDataDevolucao(
                        emprestimo.dataDevolucao
                    )
                }
                    </td>

                    <td>
                        ${status}
                    </td>
                `;

                corpoTabela.appendChild(
                    linha
                );
            }
        );


        atualizarPaginacaoDevolucao(
            lista.length
        );
    }


    /* PAGINAÇÃO */

    function atualizarPaginacaoDevolucao(
        total
    ) {

        if (
            !textoPaginacao ||
            !paginacao
        ) {
            return;
        }

        paginacao.innerHTML = "";


        if (total === 0) {

            textoPaginacao.textContent =
                "Mostrando 0 devoluções";

            return;
        }


        const totalPaginas =
            Math.ceil(
                total /
                porPagina
            );

        const inicio =
            (paginaAtual - 1) *
            porPagina +
            1;

        const fim =
            Math.min(
                paginaAtual *
                porPagina,
                total
            );


        textoPaginacao.textContent =
            "Mostrando " +
            inicio +
            " a " +
            fim +
            " de " +
            total;


        for (
            let numero = 1;
            numero <= totalPaginas;
            numero++
        ) {

            const botao =
                document.createElement(
                    "button"
                );

            botao.type = "button";

            botao.textContent =
                numero;

            if (
                numero === paginaAtual
            ) {
                botao.classList.add(
                    "pagina-ativa"
                );
            }

            botao.addEventListener(
                "click",
                function () {

                    paginaAtual =
                        numero;

                    mostrarDevolucoes();
                }
            );

            paginacao.appendChild(
                botao
            );
        }
    }


    /* PESQUISA */

    if (pesquisa) {

        pesquisa.addEventListener(
            "input",
            function () {

                filtro =
                    pesquisa.value
                        .trim()
                        .toLowerCase();

                paginaAtual = 1;

                mostrarDevolucoes();
            }
        );
    }


    /* ABA DEVOLVIDOS */

    if (abaDevolvidos) {

        abaDevolvidos.addEventListener(
            "click",
            function () {

                abaAtual =
                    "devolvidos";

                paginaAtual = 1;

                abaDevolvidos
                    .classList.add(
                    "ativa"
                );

                if (abaTodas) {
                    abaTodas
                        .classList.remove(
                        "ativa"
                    );
                }

                mostrarDevolucoes();
            }
        );
    }


    /* ABA TODOS */

    if (abaTodas) {

        abaTodas.addEventListener(
            "click",
            function () {

                abaAtual =
                    "todos";

                paginaAtual = 1;

                abaTodas
                    .classList.add(
                    "ativa"
                );

                if (abaDevolvidos) {
                    abaDevolvidos
                        .classList.remove(
                        "ativa"
                    );
                }

                mostrarDevolucoes();
            }
        );
    }


    /* CARREGAR BACKEND */

    Promise.all([
        fetch("/usuarios/me"),
        fetch("/Emprestimo")
    ])

        .then(function (responses) {

            if (!responses[0].ok) {
                throw new Error(
                    "Erro ao buscar usuário"
                );
            }

            if (!responses[1].ok) {
                throw new Error(
                    "Erro ao buscar empréstimos"
                );
            }

            return Promise.all([
                responses[0].json(),
                responses[1].json()
            ]);
        })

        .then(function (dados) {

            const usuario =
                dados[0];

            const emprestimos =
                dados[1];


            emprestimosUsuario =
                emprestimos.filter(
                    function (emprestimo) {

                        return (
                            emprestimo.usuario &&
                            emprestimo.usuario.id ===
                            usuario.id
                        );
                    }
                );


            atualizarCardsDevolucao();

            mostrarDevolucoes();

        })

        .catch(function (erro) {

            console.error(
                "ERRO NAS DEVOLUÇÕES:",
                erro
            );
        });

})();
/* EMPRÉSTIMOS ADMIN */

(function () {

    const corpoTabela =
        document.getElementById("corpoTabelaEmprestimosAdmin");

    if (!corpoTabela) {
        return;
    }

    const pesquisa =
        document.getElementById("pesquisaEmprestimoAdmin");

    const formPesquisa =
        document.getElementById("formPesquisaEmprestimoAdmin");

    const textoPaginacao =
        document.getElementById("textoPaginacaoEmprestimosAdmin");

    const paginacao =
        document.getElementById("paginacaoEmprestimosAdmin");

    let emprestimos = [];
    let filtro = "";
    let paginaAtual = 1;
    const porPagina = 5;


    /* FORMATAR DATA */

    function formatarDataAdmin(data) {

        if (!data) {
            return "-";
        }

        const partes =
            data.split("-");

        if (partes.length !== 3) {
            return data;
        }

        return (
            partes[2] +
            "/" +
            partes[1] +
            "/" +
            partes[0]
        );
    }


    /* STATUS */

    function obterStatusAdmin(emprestimo) {

        if (emprestimo.status === "DEVOLVIDO") {
            return "Devolvido";
        }

        if (emprestimo.dataPrevistaDevolucao) {

            const hoje = new Date();

            hoje.setHours(
                0,
                0,
                0,
                0
            );

            const prevista =
                new Date(
                    emprestimo.dataPrevistaDevolucao +
                    "T00:00:00"
                );

            if (prevista < hoje) {
                return "Atrasado";
            }
        }

        return "Em andamento";
    }


    /* FILTRAR */

    function filtrarEmprestimosAdmin() {

        return emprestimos.filter(
            function (emprestimo) {

                const usuario =
                    (
                        emprestimo.usuario?.nome ||
                        ""
                    ).toLowerCase();

                const livro =
                    (
                        emprestimo.livro?.titulo ||
                        ""
                    ).toLowerCase();

                return (
                    usuario.includes(filtro) ||
                    livro.includes(filtro)
                );
            }
        );
    }


    /* MOSTRAR TABELA */

    function mostrarEmprestimosAdmin() {

        const lista =
            filtrarEmprestimosAdmin();

        corpoTabela.innerHTML = "";

        if (lista.length === 0) {

            corpoTabela.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        style="
                            text-align:center;
                            padding:30px;
                        "
                    >
                        Nenhum empréstimo encontrado.
                    </td>
                </tr>
            `;

            textoPaginacao.textContent =
                "Mostrando 0 empréstimos";

            paginacao.innerHTML = "";

            return;
        }


        const inicio =
            (paginaAtual - 1) *
            porPagina;

        const fim =
            inicio +
            porPagina;

        const pagina =
            lista.slice(
                inicio,
                fim
            );


        pagina.forEach(
            function (emprestimo) {

                const linha =
                    document.createElement("tr");

                linha.innerHTML = `

                    <td>
                        ${emprestimo.id}
                    </td>

                    <td>
                        ${
                    emprestimo.usuario?.nome ||
                    "-"
                }
                    </td>

                    <td>
                        ${
                    emprestimo.livro?.titulo ||
                    "-"
                }
                    </td>

                    <td>
                        ${
                    formatarDataAdmin(
                        emprestimo.dataEmprestimo
                    )
                }
                    </td>

                    <td>
                        ${
                    formatarDataAdmin(
                        emprestimo.dataPrevistaDevolucao
                    )
                }
                    </td>

                    <td>
                        ${obterStatusAdmin(emprestimo)}
                    </td>
                `;

                corpoTabela.appendChild(
                    linha
                );
            }
        );


        textoPaginacao.textContent =
            "Mostrando " +
            lista.length +
            " empréstimo(s)";


        /* PAGINAÇÃO */

        paginacao.innerHTML = "";

        const totalPaginas =
            Math.ceil(
                lista.length /
                porPagina
            );


        for (
            let i = 1;
            i <= totalPaginas;
            i++
        ) {

            const botao =
                document.createElement("button");

            botao.type = "button";

            botao.textContent = i;

            if (i === paginaAtual) {
                botao.classList.add("ativo");
            }

            botao.addEventListener(
                "click",
                function () {

                    paginaAtual = i;

                    mostrarEmprestimosAdmin();
                }
            );

            paginacao.appendChild(
                botao
            );
        }
    }


    /* PESQUISA */

    if (formPesquisa) {

        formPesquisa.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                filtro =
                    pesquisa.value
                        .trim()
                        .toLowerCase();

                paginaAtual = 1;

                mostrarEmprestimosAdmin();
            }
        );
    }


    /* CARREGAR EMPRÉSTIMOS */

    fetch("/Emprestimo")

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Erro ao carregar empréstimos"
                );
            }

            return response.json();
        })

        .then(function (dados) {

            console.log(
                "EMPRÉSTIMOS ADMIN:",
                dados
            );

            emprestimos =
                dados;

            mostrarEmprestimosAdmin();
        })

        .catch(function (erro) {

            console.error(
                "ERRO EMPRÉSTIMOS ADMIN:",
                erro
            );

            corpoTabela.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        style="
                            text-align:center;
                            padding:30px;
                        "
                    >
                        Não foi possível carregar os empréstimos.
                    </td>
                </tr>
            `;
        });


})();
/* DEVOLUÇÕES ADMIN */

(function () {

    const corpoTabela =
        document.getElementById("corpoTabelaDevolucoesAdmin");

    if (!corpoTabela) {
        return;
    }

    const pesquisa =
        document.getElementById("pesquisaDevolucaoAdmin");

    const formPesquisa =
        document.getElementById("formPesquisaDevolucaoAdmin");

    const textoPaginacao =
        document.getElementById("textoPaginacaoDevolucoesAdmin");

    const paginacao =
        document.getElementById("paginacaoDevolucoesAdmin");

    let devolucoes = [];
    let filtro = "";
    let paginaAtual = 1;
    const porPagina = 5;


    /* FORMATAR DATA */

    function formatarDataAdmin(data) {

        if (!data) {
            return "-";
        }

        const partes =
            data.split("-");

        if (partes.length !== 3) {
            return data;
        }

        return (
            partes[2] +
            "/" +
            partes[1] +
            "/" +
            partes[0]
        );
    }


    /* FILTRAR */

    function filtrarDevolucoesAdmin() {

        return devolucoes.filter(
            function (emprestimo) {

                const usuario =
                    (
                        emprestimo.usuario?.nome ||
                        ""
                    ).toLowerCase();

                const livro =
                    (
                        emprestimo.livro?.titulo ||
                        ""
                    ).toLowerCase();

                return (
                    usuario.includes(filtro) ||
                    livro.includes(filtro)
                );
            }
        );
    }


    /* MOSTRAR TABELA */

    function mostrarDevolucoesAdmin() {

        const lista =
            filtrarDevolucoesAdmin();

        corpoTabela.innerHTML = "";

        if (lista.length === 0) {

            corpoTabela.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        style="
                            text-align:center;
                            padding:30px;
                        "
                    >
                        Nenhuma devolução encontrada.
                    </td>
                </tr>
            `;

            textoPaginacao.textContent =
                "Mostrando 0 devoluções";

            paginacao.innerHTML = "";

            return;
        }


        const inicio =
            (paginaAtual - 1) *
            porPagina;

        const fim =
            inicio +
            porPagina;

        const pagina =
            lista.slice(
                inicio,
                fim
            );


        pagina.forEach(
            function (emprestimo) {

                const linha =
                    document.createElement("tr");

                linha.innerHTML = `

                    <td>
                        ${emprestimo.id}
                    </td>

                    <td>
                        ${
                    emprestimo.usuario?.nome ||
                    "-"
                }
                    </td>

                    <td>
                        ${
                    emprestimo.livro?.titulo ||
                    "-"
                }
                    </td>

                    <td>
                        ${
                    formatarDataAdmin(
                        emprestimo.dataEmprestimo
                    )
                }
                    </td>

                    <td>
                        ${
                    formatarDataAdmin(
                        emprestimo.dataPrevistaDevolucao
                    )
                }
                    </td>

                    <td>
                        ${
                    formatarDataAdmin(
                        emprestimo.dataDevolucao
                    )
                }
                    </td>

                    <td>
                        Devolvido
                    </td>

                    <td>
                        -
                    </td>
                `;

                corpoTabela.appendChild(
                    linha
                );
            }
        );


        textoPaginacao.textContent =
            "Mostrando " +
            lista.length +
            " devolução(ões)";


        /* PAGINAÇÃO */

        paginacao.innerHTML = "";

        const totalPaginas =
            Math.ceil(
                lista.length /
                porPagina
            );


        for (
            let i = 1;
            i <= totalPaginas;
            i++
        ) {

            const botao =
                document.createElement("button");

            botao.type = "button";

            botao.textContent = i;

            if (i === paginaAtual) {
                botao.classList.add("ativo");
            }

            botao.addEventListener(
                "click",
                function () {

                    paginaAtual = i;

                    mostrarDevolucoesAdmin();
                }
            );

            paginacao.appendChild(
                botao
            );
        }
    }


    /* PESQUISA */

    if (formPesquisa) {

        formPesquisa.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                filtro =
                    pesquisa.value
                        .trim()
                        .toLowerCase();

                paginaAtual = 1;

                mostrarDevolucoesAdmin();
            }
        );
    }


    /* CARREGAR DEVOLUÇÕES */

    fetch("/Emprestimo")

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Erro ao carregar devoluções"
                );
            }

            return response.json();
        })

        .then(function (dados) {

            console.log(
                "DEVOLUÇÕES ADMIN:",
                dados
            );

            devolucoes =
                dados.filter(
                    function (emprestimo) {

                        return (
                            emprestimo.status ===
                            "DEVOLVIDO"
                        );
                    }
                );

            mostrarDevolucoesAdmin();
        })

        .catch(function (erro) {

            console.error(
                "ERRO DEVOLUÇÕES ADMIN:",
                erro
            );

            corpoTabela.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        style="
                            text-align:center;
                            padding:30px;
                        "
                    >
                        Não foi possível carregar as devoluções.
                    </td>
                </tr>
            `;
        });

})();
/* CONFIGURAÇÕES GERAIS */

(function () {

    const form =
        document.getElementById("formConfiguracaoGeral");

    if (!form) {
        return;
    }

    const nomeSistema =
        document.getElementById("nomeSistema");

    const permitirCadastroUsuarios =
        document.getElementById("permitirCadastroUsuarios");

    const exigirCpf =
        document.getElementById("exigirCpf");

    const permitirEditarPerfil =
        document.getElementById("permitirEditarPerfil");

    const mostrarLivrosIndisponiveis =
        document.getElementById("mostrarLivrosIndisponiveis");

    const itensPorPagina =
        document.getElementById("itensPorPagina");

    const mensagemSistema =
        document.getElementById("mensagemSistema");


    /* CARREGAR CONFIGURAÇÃO */

    function carregarConfiguracaoGeral() {

        fetch("/configuracoes")

            .then(function (response) {

                if (!response.ok) {
                    throw new Error(
                        "Erro ao carregar configurações"
                    );
                }

                return response.json();
            })

            .then(function (configuracoes) {

                if (
                    !configuracoes ||
                    configuracoes.length === 0
                ) {
                    return;
                }

                const configuracao =
                    configuracoes[
                    configuracoes.length - 1
                        ];

                nomeSistema.value =
                    configuracao.nomeBiblioteca || "";

                permitirCadastroUsuarios.checked =
                    configuracao.permitirCadastroUsuarios ?? true;

                exigirCpf.checked =
                    configuracao.exigirCpf ?? true;

                permitirEditarPerfil.checked =
                    configuracao.permitirEditarPerfil ?? true;

                mostrarLivrosIndisponiveis.checked =
                    configuracao.mostrarLivrosIndisponiveis ?? true;

                itensPorPagina.value =
                    configuracao.itensPorPagina || 10;

                mensagemSistema.value =
                    configuracao.mensagemSistema || "";

                console.log(
                    "CONFIGURAÇÃO CARREGADA:",
                    configuracao
                );
            })

            .catch(function (erro) {

                console.error(
                    "ERRO AO CARREGAR CONFIGURAÇÕES:",
                    erro
                );
            });
    }
    /* CONFIGURAÇÕES DE EMPRÉSTIMO */

    (function () {

        const form =
            document.getElementById("formConfiguracaoEmprestimo");

        if (!form) {
            return;
        }

        const prazoEmprestimo =
            document.getElementById("prazoEmprestimo");

        const limiteLivrosUsuario =
            document.getElementById("limiteLivrosUsuario");

        const permitirRenovacao =
            document.getElementById("permitirRenovacao");

        const diasTolerancia =
            document.getElementById("diasTolerancia");

        let configuracaoAtual = null;


        /* CARREGAR */

        function carregarConfiguracaoEmprestimo() {

            fetch("/configuracoes")

                .then(function (response) {

                    if (!response.ok) {
                        throw new Error(
                            "Erro ao carregar configurações"
                        );
                    }

                    return response.json();
                })

                .then(function (configuracoes) {

                    if (
                        !configuracoes ||
                        configuracoes.length === 0
                    ) {
                        return;
                    }

                    configuracaoAtual =
                        configuracoes[
                        configuracoes.length - 1
                            ];

                    prazoEmprestimo.value =
                        configuracaoAtual.prazoEmprestimo ?? 7;

                    limiteLivrosUsuario.value =
                        configuracaoAtual.limiteLivrosUsuario ?? 3;

                    permitirRenovacao.checked =
                        configuracaoAtual.permitirRenovacao ?? false;

                    diasTolerancia.value =
                        configuracaoAtual.diasTolerancia ?? 0;

                    console.log(
                        "CONFIGURAÇÃO EMPRÉSTIMO CARREGADA:",
                        configuracaoAtual
                    );
                })

                .catch(function (erro) {

                    console.error(
                        "ERRO AO CARREGAR CONFIGURAÇÃO DE EMPRÉSTIMO:",
                        erro
                    );
                });
        }


        /* SALVAR */

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                if (!configuracaoAtual) {

                    alert(
                        "Configuração do sistema não encontrada."
                    );

                    return;
                }

                configuracaoAtual.prazoEmprestimo =
                    Number(prazoEmprestimo.value);

                configuracaoAtual.limiteLivrosUsuario =
                    Number(limiteLivrosUsuario.value);

                configuracaoAtual.permitirRenovacao =
                    permitirRenovacao.checked;

                configuracaoAtual.diasTolerancia =
                    Number(diasTolerancia.value);


                fetch(
                    "/configuracoes/" +
                    configuracaoAtual.id,
                    {

                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body:
                            JSON.stringify(configuracaoAtual)
                    }
                )

                    .then(function (response) {

                        if (!response.ok) {
                            throw new Error(
                                "Erro ao salvar configurações de empréstimo"
                            );
                        }

                        return response.json();
                    })

                    .then(function (data) {

                        configuracaoAtual = data;

                        console.log(
                            "CONFIGURAÇÃO EMPRÉSTIMO SALVA:",
                            data
                        );

                        alert(
                            "Configurações de empréstimo salvas com sucesso!"
                        );
                    })

                    .catch(function (erro) {

                        console.error(
                            "ERRO CONFIGURAÇÃO EMPRÉSTIMO:",
                            erro
                        );

                        alert(
                            "Não foi possível salvar as configurações de empréstimo."
                        );
                    });
            }
        );


        carregarConfiguracaoEmprestimo();

    })();

    /* SALVAR CONFIGURAÇÃO */

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const configuracao = {

                nomeBiblioteca:
                nomeSistema.value,

                endereco: "",

                cidade: "",

                estado: "",

                telefone: "",

                email: "",

                descricao: "",

                permitirCadastroUsuarios:
                permitirCadastroUsuarios.checked,

                exigirCpf:
                exigirCpf.checked,

                permitirEditarPerfil:
                permitirEditarPerfil.checked,

                mostrarLivrosIndisponiveis:
                mostrarLivrosIndisponiveis.checked,

                itensPorPagina:
                    Number(itensPorPagina.value),

                mensagemSistema:
                mensagemSistema.value,

                prazoEmprestimo: 7,

                limiteLivrosUsuario: 3,

                permitirRenovacao: false,

                diasTolerancia: 0,

                valorMultaDia: 0,

                multaAutomatica: false,

                bloquearUsuarioMulta: false
            };

            fetch("/configuracoes", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body:
                    JSON.stringify(configuracao)
            })

                .then(function (response) {

                    if (!response.ok) {
                        throw new Error(
                            "Erro ao salvar configurações"
                        );
                    }

                    return response.json();
                })

                .then(function (data) {

                    console.log(
                        "CONFIGURAÇÃO SALVA:",
                        data
                    );

                    alert(
                        "Configurações salvas com sucesso!"
                    );
                })

                .catch(function (erro) {

                    console.error(
                        "ERRO CONFIGURAÇÕES:",
                        erro
                    );

                    alert(
                        "Não foi possível salvar as configurações."
                    );
                });
        }
    );


    /* CARREGAR AO ABRIR A PÁGINA */

    carregarConfiguracaoGeral();

})();
/* EMPRÉSTIMOS RECENTES DO DASHBOARD */

(function () {

    const corpoTabela =
        document.getElementById(
            "corpoRelatorioEmprestimosRecentes"
        );

    if (!corpoTabela) {
        return;
    }

    fetch("/Emprestimo")
        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Erro ao carregar empréstimos recentes"
                );
            }

            return response.json();
        })
        .then(function (emprestimos) {

            corpoTabela.innerHTML = "";

            if (
                !emprestimos ||
                emprestimos.length === 0
            ) {

                corpoTabela.innerHTML = `
                    <tr>
                        <td colspan="6"
                            style="
                                text-align:center;
                                padding:25px;
                            "
                        >
                            Nenhum empréstimo encontrado.
                        </td>
                    </tr>
                `;

                return;
            }

            const recentes =
                [...emprestimos]
                    .sort(function (a, b) {

                        return (
                            Number(b.id) -
                            Number(a.id)
                        );
                    })
                    .slice(0, 5);

            recentes.forEach(
                function (emprestimo) {

                    let status =
                        "Em andamento";

                    if (
                        emprestimo.status ===
                        "DEVOLVIDO"
                    ) {

                        status =
                            "Devolvido";
                    }

                    const linha =
                        document.createElement(
                            "tr"
                        );

                    linha.innerHTML = `
                        <td>
                            ${emprestimo.id}
                        </td>

                        <td>
                            ${
                        emprestimo.usuario
                            ?.nome || "-"
                    }
                        </td>

                        <td>
                            ${
                        emprestimo.livro
                            ?.titulo || "-"
                    }
                       <td>
    ${emprestimo.dataEmprestimo || "-"}
</td>

<td>
    ${emprestimo.dataPrevistaDevolucao || "-"}
</td>

                        <td>
                            ${status}
                        </td>
                    `;

                    corpoTabela.appendChild(
                        linha
                    );
                }
            );
        })
        .catch(function (erro) {

            console.error(
                "ERRO EMPRÉSTIMOS RECENTES:",
                erro
            );
        });

})();
/* DEVOLUÇÕES PENDENTES DO DASHBOARD */

(function () {

    const lista =
        document.getElementById(
            "listaDevolucoesPendentesAdmin"
        );

    if (!lista) {
        return;
    }

    fetch("/Emprestimo")
        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Erro ao carregar devoluções pendentes"
                );
            }

            return response.json();
        })
        .then(function (emprestimos) {

            lista.innerHTML = "";

            const pendentes =
                emprestimos.filter(
                    function (emprestimo) {

                        return (
                            emprestimo.status !==
                            "DEVOLVIDO"
                        );
                    }
                );

            if (pendentes.length === 0) {

                lista.innerHTML = `
                    <p style="
                        text-align:center;
                        padding:20px;
                    ">
                        Nenhuma devolução pendente.
                    </p>
                `;

                return;
            }

            pendentes
                .slice(0, 5)
                .forEach(
                    function (emprestimo) {

                        const item =
                            document.createElement(
                                "div"
                            );

                        item.classList.add(
                            "item-devolucao"
                        );

                        item.innerHTML = `
                            <strong>
                                ${emprestimo.usuario?.nome || "-"}
                            </strong>

                            <span>
                                ${emprestimo.livro?.titulo || "-"}
                            </span>

                            <span>
                                Prevista:
                                ${emprestimo.dataPrevistaDevolucao || "-"}
                            </span>
                        `;

                        lista.appendChild(item);
                    }
                );
        })
        .catch(function (erro) {

            console.error(
                "ERRO DEVOLUÇÕES PENDENTES:",
                erro
            );
        });

})();
/* CARDS DE EMPRÉSTIMOS E DEVOLUÇÕES DO DASHBOARD */

(function () {

    const totalEmprestimos =
        document.getElementById(
            "totalEmprestimosAtivosAdmin"
        );

    const totalDevolucoes =
        document.getElementById(
            "totalDevolucoesPendentesAdmin"
        );

    if (!totalEmprestimos || !totalDevolucoes) {
        return;
    }

    fetch("/Emprestimo")
        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Erro ao carregar empréstimos"
                );
            }

            return response.json();
        })
        .then(function (emprestimos) {

            const ativos =
                emprestimos.filter(
                    function (emprestimo) {

                        return (
                            emprestimo.status !==
                            "DEVOLVIDO"
                        );
                    }
                );

            totalEmprestimos.textContent =
                ativos.length;

            totalDevolucoes.textContent =
                ativos.length;
        })
        .catch(function (erro) {

            console.error(
                "ERRO CARDS DASHBOARD:",
                erro
            );
        });

})();
/* LIVROS EM DESTAQUE DA HOME */

(function () {

    const listaLivros =
        document.getElementById("listaLivrosPublicos");

    const mensagemSemLivros =
        document.getElementById("mensagemSemLivrosPublicos");

    if (!listaLivros) {
        return;
    }

    fetch("/livros")
        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Erro ao carregar livros"
                );
            }

            return response.json();
        })
        .then(function (livros) {
            catalogoLivros = livros;
            listaLivros.innerHTML = "";

            if (!livros || livros.length === 0) {

                if (mensagemSemLivros) {
                    mensagemSemLivros.style.display = "block";
                }

                return;
            }

            if (mensagemSemLivros) {
                mensagemSemLivros.style.display = "none";
            }

            const livrosDestaque =
                livros.slice(0, 4);

            livrosDestaque.forEach(function (livro) {

                const card =
                    document.createElement("article");

                card.classList.add("home-card-livro");

                card.style.cursor = "pointer";

                card.addEventListener("click", function () {

                    const confirmar = confirm(
                        "Para reservar este livro, você precisa ter uma conta. Deseja se cadastrar?"
                    );

                    if (confirmar) {
                        window.location.href = "/cadastro";
                    }
                });

                card.innerHTML = `
                    <div class="home-card-livro-icone">
                        📚
                    </div>

                    <h3>
                        ${livro.titulo || "-"}
                    </h3>

                    <p>
                        ${livro.autor || "-"}
                    </p>

                    <span>
                        ${livro.categoria || "-"}
                    </span>

                    <strong>
                        ${
                    livro.quantidadeDisponivel > 0
                        ? "Disponível"
                        : "Indisponível"
                }
                    </strong>
                `;

                listaLivros.appendChild(card);
            });
        })
        .catch(function (erro) {

            console.error(
                "ERRO LIVROS DA HOME:",
                erro
            );

            if (mensagemSemLivros) {
                mensagemSemLivros.style.display = "block";
            }
        });

})();
/* BOTÃO VER TODOS OS LIVROS */

(function () {

    const botaoVerTodos =
        document.getElementById(
            "verTodosLivrosPublicos"
        );

    if (!botaoVerTodos) {
        return;
    }

    botaoVerTodos.addEventListener(
        "click",
        function () {

            window.location.href =
                "/usuario/livros";
        }
    );

})();
