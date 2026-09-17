/* =====================================================
   CONFIGURAÇÃO DA API
===================================================== */

const API_BASE = "https://localhost:7082";


/* =====================================================
   MENU MOBILE
===================================================== */

const menuMobile =
    document.getElementById("menuMobile");

const mainNav =
    document.getElementById("mainNav");


if (menuMobile && mainNav) {

    menuMobile.addEventListener("click", () => {

        mainNav.classList.toggle("open");

        const icon =
            menuMobile.querySelector("i");

        if (!icon) return;


        if (mainNav.classList.contains("open")) {

            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");

            menuMobile.setAttribute(
                "aria-label",
                "Fechar menu"
            );

        } else {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

            menuMobile.setAttribute(
                "aria-label",
                "Abrir menu"
            );
        }
    });


    /* Fecha o menu ao clicar em um link */

    const menuLinks =
        mainNav.querySelectorAll(".nav-link");


    menuLinks.forEach(link => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("open");

            const icon =
                menuMobile.querySelector("i");

            if (icon) {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

            menuMobile.setAttribute(
                "aria-label",
                "Abrir menu"
            );
        });
    });
}


/* =====================================================
   ELEMENTOS DO PERFIL
===================================================== */

const btnEditar =
    document.getElementById("btnEditar");

const editModal =
    document.getElementById("editModal");

const modalClose =
    document.getElementById("modalClose");

const btnCancelar =
    document.getElementById("btnCancelar");

const profileForm =
    document.getElementById("profileForm");


/* =====================================================
   ELEMENTOS DAS INFORMAÇÕES
===================================================== */

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const infoNome =
    document.getElementById("infoNome");

const infoEmail =
    document.getElementById("infoEmail");

const infoCargo =
    document.getElementById("infoCargo");


/* =====================================================
   CAMPOS DO FORMULÁRIO
===================================================== */

const campoNome =
    document.getElementById("nome");

const campoEmail =
    document.getElementById("email");

const campoCargo =
    document.getElementById("cargo");


/* =====================================================
   DADOS DO PROFESSOR
===================================================== */

let professor = {

    id: null,

    nome: "",

    email: "",

    cargo: ""
};


/* =====================================================
   CARREGAR PERFIL DO BANCO
===================================================== */

async function carregarPerfil() {

    try {

        const resposta =
            await fetch(
                `${API_BASE}/Usuario/perfil`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        /* Sessão expirou */

        if (resposta.status === 401) {

            alert(
                "Sua sessão expirou. Faça login novamente."
            );

            window.location.href =
                "login.html";

            return;
        }


        /* Outro erro */

        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar o perfil."
            );
        }


        const dados =
            await resposta.json();


        /*
         * Guarda os dados reais
         * recebidos do banco.
         */

        professor.id =
            dados.id;

        professor.nome =
            dados.nome || "";

        professor.email =
            dados.email || "";

        professor.cargo =
            dados.cargo || "";


        /*
         * Atualiza a tela.
         */

        atualizarPerfil();


    } catch (erro) {

        console.error(
            "Erro ao carregar perfil:",
            erro
        );

        alert(
            "Não foi possível carregar seus dados."
        );
    }
}


/* =====================================================
   ATUALIZAR PERFIL NA TELA
===================================================== */

function atualizarPerfil() {

    if (profileName) {

        profileName.textContent =
            professor.nome ||
            "Professor";
    }


    if (profileEmail) {

        profileEmail.textContent =
            professor.email ||
            "E-mail não informado";
    }


    if (infoNome) {

        infoNome.textContent =
            professor.nome ||
            "Não informado";
    }


    if (infoEmail) {

        infoEmail.textContent =
            professor.email ||
            "Não informado";
    }


    if (infoCargo) {

        infoCargo.textContent =
            professor.cargo ||
            "Professor";
    }
}


/* =====================================================
   ABRIR MODAL DE EDIÇÃO
===================================================== */

function abrirEdicao() {

    if (!editModal) {
        return;
    }


    if (campoNome) {

        campoNome.value =
            professor.nome;
    }


    if (campoEmail) {

        campoEmail.value =
            professor.email;
    }


    if (campoCargo) {

        campoCargo.value =
            professor.cargo;
    }


    editModal.classList.add("show");

    document.body.style.overflow =
        "hidden";
}


if (btnEditar) {

    btnEditar.addEventListener(
        "click",
        abrirEdicao
    );
}


/* =====================================================
   FECHAR MODAL DE EDIÇÃO
===================================================== */

function fecharEdicao() {

    if (!editModal) {
        return;
    }


    editModal.classList.remove("show");

    document.body.style.overflow =
        "";
}


if (modalClose) {

    modalClose.addEventListener(
        "click",
        fecharEdicao
    );
}


if (btnCancelar) {

    btnCancelar.addEventListener(
        "click",
        fecharEdicao
    );
}


/* =====================================================
   SALVAR ALTERAÇÕES DO PERFIL
===================================================== */

if (profileForm) {

    profileForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const nome =
                campoNome
                    ? campoNome.value.trim()
                    : "";


            const email =
                campoEmail
                    ? campoEmail.value.trim()
                    : "";


            /* Validação */

            if (!nome || !email) {

                alert(
                    "Preencha todos os campos."
                );

                return;
            }


            /* Validação básica de e-mail */

            const emailValido =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailValido.test(email)) {

                alert(
                    "Digite um e-mail válido."
                );

                return;
            }


            /*
             * Desabilita o botão enquanto salva.
             */

            const botaoSalvar =
                profileForm.querySelector(
                    ".save-btn"
                );


            if (botaoSalvar) {

                botaoSalvar.disabled = true;

                botaoSalvar.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Salvando...
                `;
            }


            try {

                const resposta =
                    await fetch(
                        `${API_BASE}/Usuario/perfil`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            credentials: "include",

                            body: JSON.stringify({
                                nome: nome,
                                email: email
                            })
                        }
                    );


                const dados =
                    await resposta.json()
                        .catch(() => null);


                /*
                 * Sessão expirada.
                 */

                if (resposta.status === 401) {

                    alert(
                        "Sua sessão expirou. Faça login novamente."
                    );

                    window.location.href =
                        "login.html";

                    return;
                }


                /*
                 * Erro da API.
                 */

                if (!resposta.ok) {

                    alert(
                        dados?.mensagem ||
                        "Não foi possível atualizar o perfil."
                    );

                    return;
                }


                /*
                 * Atualiza os dados locais
                 * com o retorno do backend.
                 */

                professor.nome =
                    dados.nome;

                professor.email =
                    dados.email;

                professor.cargo =
                    dados.cargo;


                atualizarPerfil();


                fecharEdicao();


                alert(
                    dados.mensagem ||
                    "Perfil atualizado com sucesso!"
                );


            } catch (erro) {

                console.error(
                    "Erro ao atualizar perfil:",
                    erro
                );

                alert(
                    "Erro de conexão com o servidor."
                );


            } finally {

                /*
                 * Volta o botão ao estado normal.
                 */

                if (botaoSalvar) {

                    botaoSalvar.disabled =
                        false;

                    botaoSalvar.innerHTML = `
                        <i class="fa-solid fa-check"></i>
                        Salvar alterações
                    `;
                }
            }
        }
    );
}


/* =====================================================
   MODAL ALTERAR SENHA
===================================================== */

const btnAlterarSenha =
    document.getElementById(
        "btnAlterarSenha"
    );

const passwordModal =
    document.getElementById(
        "passwordModal"
    );

const passwordModalClose =
    document.getElementById(
        "passwordModalClose"
    );

const btnCancelarSenha =
    document.getElementById(
        "btnCancelarSenha"
    );

const passwordForm =
    document.getElementById(
        "passwordForm"
    );


/* =====================================================
   CAMPOS DA SENHA
===================================================== */

const senhaAtual =
    document.getElementById(
        "senhaAtual"
    );

const novaSenha =
    document.getElementById(
        "novaSenha"
    );

const confirmarSenha =
    document.getElementById(
        "confirmarSenha"
    );


/* =====================================================
   ABRIR MODAL DE SENHA
===================================================== */

if (btnAlterarSenha) {

    btnAlterarSenha.addEventListener(
        "click",
        () => {

            if (!passwordModal) {
                return;
            }


            passwordModal.classList.add(
                "show"
            );

            document.body.style.overflow =
                "hidden";
        }
    );
}


/* =====================================================
   FECHAR MODAL DE SENHA
===================================================== */

function fecharSenha() {

    if (!passwordModal) {
        return;
    }


    passwordModal.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "";
}


if (passwordModalClose) {

    passwordModalClose.addEventListener(
        "click",
        fecharSenha
    );
}


if (btnCancelarSenha) {

    btnCancelarSenha.addEventListener(
        "click",
        fecharSenha
    );
}


/* =====================================================
   ALTERAR SENHA
===================================================== */

if (passwordForm) {

    passwordForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const senhaAtualValor =
                senhaAtual
                    ? senhaAtual.value
                    : "";


            const novaSenhaValor =
                novaSenha
                    ? novaSenha.value
                    : "";


            const confirmarSenhaValor =
                confirmarSenha
                    ? confirmarSenha.value
                    : "";


            /* =================================================
               VALIDAÇÕES
            ================================================= */


            if (
                !senhaAtualValor ||
                !novaSenhaValor ||
                !confirmarSenhaValor
            ) {

                alert(
                    "Preencha todos os campos."
                );

                return;
            }


            /*
             * O cadastro do sistema usa
             * exatamente 8 caracteres.
             */

            if (
                novaSenhaValor.length !== 8
            ) {

                alert(
                    "A nova senha deve ter exatamente 8 caracteres."
                );

                return;
            }


            /*
             * Confirmação.
             */

            if (
                novaSenhaValor !==
                confirmarSenhaValor
            ) {

                alert(
                    "A confirmação da senha não corresponde."
                );

                return;
            }


            /*
             * Botão de alteração.
             */

            const botaoSenha =
                passwordForm.querySelector(
                    ".save-btn"
                );


            if (botaoSenha) {

                botaoSenha.disabled = true;

                botaoSenha.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Alterando...
                `;
            }


            try {

                const resposta =
                    await fetch(
                        `${API_BASE}/Usuario/senha`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            credentials: "include",

                            body: JSON.stringify({

                                senhaAtual:
                                    senhaAtualValor,

                                novaSenha:
                                    novaSenhaValor
                            })
                        }
                    );


                const dados =
                    await resposta.json()
                        .catch(() => null);


                /*
                 * Sessão expirada.
                 */

                if (
                    resposta.status === 401
                ) {

                    alert(
                        "Sua sessão expirou. Faça login novamente."
                    );

                    window.location.href =
                        "login.html";

                    return;
                }


                /*
                 * Erro retornado pelo backend.
                 */

                if (!resposta.ok) {

                    alert(
                        dados?.mensagem ||
                        "Não foi possível alterar a senha."
                    );

                    return;
                }


                /*
                 * Limpa o formulário.
                 */

                passwordForm.reset();


                fecharSenha();


                alert(
                    dados.mensagem ||
                    "Senha alterada com sucesso!"
                );


            } catch (erro) {

                console.error(
                    "Erro ao alterar senha:",
                    erro
                );

                alert(
                    "Erro de conexão com o servidor."
                );


            } finally {

                if (botaoSenha) {

                    botaoSenha.disabled =
                        false;

                    botaoSenha.innerHTML = `
                        <i class="fa-solid fa-check"></i>
                        Alterar senha
                    `;
                }
            }
        }
    );
}


/* =====================================================
   FECHAR MODAIS CLICANDO FORA
===================================================== */

if (editModal) {

    editModal.addEventListener(
        "click",
        event => {

            if (
                event.target === editModal
            ) {

                fecharEdicao();
            }
        }
    );
}


if (passwordModal) {

    passwordModal.addEventListener(
        "click",
        event => {

            if (
                event.target === passwordModal
            ) {

                fecharSenha();
            }
        }
    );
}


/* =====================================================
   ESC FECHA OS MODAIS
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }


        if (
            editModal &&
            editModal.classList.contains("show")
        ) {

            fecharEdicao();
        }


        if (
            passwordModal &&
            passwordModal.classList.contains("show")
        ) {

            fecharSenha();
        }
    }
);


/* =====================================================
   LOGOUT
===================================================== */

function fazerLogout() {

    const confirmar =
        confirm(
            "Deseja realmente sair do sistema?"
        );


    if (!confirmar) {
        return;
    }


    localStorage.clear();

    sessionStorage.clear();


    window.location.href =
        "login.html";
}


const btnLogout =
    document.getElementById(
        "btnLogout"
    );

const btnLogoutPerfil =
    document.getElementById(
        "btnLogoutPerfil"
    );


if (btnLogout) {

    btnLogout.addEventListener(
        "click",
        fazerLogout
    );
}


if (btnLogoutPerfil) {

    btnLogoutPerfil.addEventListener(
        "click",
        fazerLogout
    );
}


/* =====================================================
   RESPONSIVIDADE DO MENU
===================================================== */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 800 &&
            mainNav
        ) {

            mainNav.classList.remove(
                "open"
            );


            if (menuMobile) {

                const icon =
                    menuMobile.querySelector(
                        "i"
                    );


                if (icon) {

                    icon.classList.remove(
                        "fa-xmark"
                    );

                    icon.classList.add(
                        "fa-bars"
                    );
                }


                menuMobile.setAttribute(
                    "aria-label",
                    "Abrir menu"
                );
            }
        }
    }
);


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

carregarPerfil();