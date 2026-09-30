/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const API_BASE = "https://localhost:7082";


/* =========================================================
   ELEMENTOS
========================================================= */

const profileModal =
    document.getElementById("profileModal");

const btnEditar =
    document.getElementById("btnEditar");

const btnAlterarSenha =
    document.getElementById("btnAlterarSenha");

const modalClose =
    document.getElementById("modalClose");

const btnCancelar =
    document.getElementById("btnCancelar");

const btnSalvar =
    document.getElementById("btnSalvar");

const btnLogout =
    document.getElementById("btnLogout");

const btnSair =
    document.getElementById("btnSair");

const menuMobile =
    document.getElementById("menuMobile");

const mobileNav =
    document.getElementById("mobileNav");


/* =========================================================
   CAMPOS DO PERFIL
========================================================= */

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

const inputNome =
    document.getElementById("nome");

const inputEmail =
    document.getElementById("email");

const inputCargo =
    document.getElementById("cargo");

const inputSenha =
    document.getElementById("senha");


/* =========================================================
   CARREGAR PERFIL
========================================================= */

async function carregarPerfil() {

    try {

        const resposta = await fetch(
            `${API_BASE}/Usuario/perfil`,
            {
                method: "GET",
                credentials: "include"
            }
        );


        /* ---------------------------------------------
           SESSÃO EXPIRADA
        --------------------------------------------- */

        if (resposta.status === 401) {

            alert(
                "Sua sessão expirou. Faça login novamente."
            );

            window.location.href =
                "login.html";

            return;
        }


        /* ---------------------------------------------
           ERRO
        --------------------------------------------- */

        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar o perfil."
            );

        }


        const dados =
            await resposta.json();


        console.log(
            "Perfil carregado:",
            dados
        );


        /* ---------------------------------------------
           NOME
        --------------------------------------------- */

        if (profileName) {

            profileName.textContent =
                dados.nome || "Supervisão";

        }


        if (infoNome) {

            infoNome.textContent =
                dados.nome || "—";

        }


        /* ---------------------------------------------
           E-MAIL
        --------------------------------------------- */

        if (profileEmail) {

            profileEmail.textContent =
                dados.email || "—";

        }


        if (infoEmail) {

            infoEmail.textContent =
                dados.email || "—";

        }


        /* ---------------------------------------------
           CARGO
        --------------------------------------------- */

        if (infoCargo) {

            infoCargo.textContent =
                dados.cargo || "Supervisão";

        }


        if (inputCargo) {

            inputCargo.value =
                dados.cargo || "Supervisão";

        }


        /* ---------------------------------------------
           CAMPOS DO MODAL
        --------------------------------------------- */

        if (inputNome) {

            inputNome.value =
                dados.nome || "";

        }


        if (inputEmail) {

            inputEmail.value =
                dados.email || "";

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar perfil:",
            erro
        );

        alert(
            "Não foi possível carregar as informações do perfil."
        );

    }

}


/* =========================================================
   ABRIR MODAL
========================================================= */

function abrirModal() {

    if (!profileModal) {
        return;
    }


    profileModal.classList.add("show");


    if (inputSenha) {

        inputSenha.value = "";

    }


    if (inputNome) {

        inputNome.focus();

    }

}


/* =========================================================
   FECHAR MODAL
========================================================= */

function fecharModal() {

    if (!profileModal) {
        return;
    }


    profileModal.classList.remove("show");


    if (inputSenha) {

        inputSenha.value = "";

    }

}


/* =========================================================
   SALVAR PERFIL
========================================================= */

async function salvarPerfil() {

    if (
        !inputNome ||
        !inputEmail ||
        !btnSalvar
    ) {

        return;

    }


    const nome =
        inputNome.value.trim();

    const email =
        inputEmail.value.trim();

    const senha =
        inputSenha
            ? inputSenha.value.trim()
            : "";


    /* ---------------------------------------------
       VALIDAÇÃO DO NOME
    --------------------------------------------- */

    if (!nome) {

        alert(
            "Digite seu nome."
        );

        inputNome.focus();

        return;
    }


    /* ---------------------------------------------
       VALIDAÇÃO DO E-MAIL
    --------------------------------------------- */

    if (!email) {

        alert(
            "Digite seu e-mail."
        );

        inputEmail.focus();

        return;
    }


    /* ---------------------------------------------
       VALIDAÇÃO SIMPLES DO E-MAIL
    --------------------------------------------- */

    const emailValido =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
        );


    if (!emailValido) {

        alert(
            "Digite um e-mail válido."
        );

        inputEmail.focus();

        return;
    }


    /* ---------------------------------------------
       BOTÃO
    --------------------------------------------- */

    const textoOriginal =
        btnSalvar.innerHTML;


    btnSalvar.disabled = true;

    btnSalvar.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';


    try {


        /* =============================================
           ATUALIZAR NOME E E-MAIL
        ============================================= */

        const respostaPerfil =
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


        /* ---------------------------------------------
           SESSÃO EXPIRADA
        --------------------------------------------- */

        if (
            respostaPerfil.status === 401
        ) {

            alert(
                "Sua sessão expirou. Faça login novamente."
            );

            window.location.href =
                "login.html";

            return;
        }


        const resultadoPerfil =
            await respostaPerfil.json();


        /* ---------------------------------------------
           ERRO AO ATUALIZAR PERFIL
        --------------------------------------------- */

        if (!respostaPerfil.ok) {

            alert(
                resultadoPerfil.mensagem ||
                "Não foi possível atualizar o perfil."
            );

            return;
        }


        /* =============================================
           ALTERAR SENHA
           SOMENTE SE PREENCHIDA
        ============================================= */

        if (senha) {

            const respostaSenha =
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
                            senha: senha
                        })
                    }
                );


            /* -----------------------------------------
               SESSÃO EXPIRADA
            ----------------------------------------- */

            if (
                respostaSenha.status === 401
            ) {

                alert(
                    "Sua sessão expirou. Faça login novamente."
                );

                window.location.href =
                    "login.html";

                return;
            }


            const resultadoSenha =
                await respostaSenha.json();


            /* -----------------------------------------
               ERRO AO ALTERAR SENHA
            ----------------------------------------- */

            if (!respostaSenha.ok) {

                alert(
                    resultadoSenha.mensagem ||
                    "Não foi possível alterar a senha."
                );

                return;
            }

        }


        /* =============================================
           ATUALIZAR A TELA
        ============================================= */

        if (profileName) {

            profileName.textContent =
                nome;

        }


        if (profileEmail) {

            profileEmail.textContent =
                email;

        }


        if (infoNome) {

            infoNome.textContent =
                nome;

        }


        if (infoEmail) {

            infoEmail.textContent =
                email;

        }


        /* =============================================
           LIMPAR SENHA
        ============================================= */

        if (inputSenha) {

            inputSenha.value = "";

        }


        /* =============================================
           FECHAR MODAL
        ============================================= */

        fecharModal();


        /* =============================================
           MENSAGEM
        ============================================= */

        alert(
            "Perfil atualizado com sucesso!"
        );


    } catch (erro) {

        console.error(
            "Erro ao salvar perfil:",
            erro
        );

        alert(
            "Não foi possível salvar as alterações."
        );


    } finally {

        btnSalvar.disabled = false;

        btnSalvar.innerHTML =
            textoOriginal;

    }

}


/* =========================================================
   LOGOUT
========================================================= */

async function sairDaConta() {

    /* ---------------------------------------------
       CONFIRMAR SAÍDA
    --------------------------------------------- */

    const confirmar =
        confirm(
            "Deseja realmente sair?"
        );


    /* ---------------------------------------------
       CANCELAR
    --------------------------------------------- */

    if (!confirmar) {

        return;

    }


    /* ---------------------------------------------
       REALIZAR LOGOUT
    --------------------------------------------- */

    try {

        await fetch(
            `${API_BASE}/Usuario/logout`,
            {
                method: "POST",
                credentials: "include"
            }
        );

    } catch (erro) {

        console.error(
            "Erro ao realizar logout:",
            erro
        );

    } finally {

        window.location.href =
            "login.html";

    }

}


/* =========================================================
   EVENTOS DO PERFIL
========================================================= */


/* EDITAR PERFIL */

if (btnEditar) {

    btnEditar.addEventListener(
        "click",
        abrirModal
    );

}


/* ALTERAR SENHA */

if (btnAlterarSenha) {

    btnAlterarSenha.addEventListener(
        "click",
        abrirModal
    );

}


/* FECHAR PELO X */

if (modalClose) {

    modalClose.addEventListener(
        "click",
        fecharModal
    );

}


/* CANCELAR */

if (btnCancelar) {

    btnCancelar.addEventListener(
        "click",
        fecharModal
    );

}


/* SALVAR */

if (btnSalvar) {

    btnSalvar.addEventListener(
        "click",
        salvarPerfil
    );

}


/* LOGOUT TOPBAR */

if (btnLogout) {

    btnLogout.addEventListener(
        "click",
        sairDaConta
    );

}


/* LOGOUT DO PERFIL */

if (btnSair) {

    btnSair.addEventListener(
        "click",
        sairDaConta
    );

}


/* =========================================================
   FECHAR MODAL CLICANDO FORA
========================================================= */

if (profileModal) {

    profileModal.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target === profileModal
            ) {

                fecharModal();

            }

        }
    );

}


/* =========================================================
   TECLA ESC
========================================================= */

document.addEventListener(
    "keydown",
    function (evento) {

        if (
            evento.key === "Escape" &&
            profileModal &&
            profileModal.classList.contains("show")
        ) {

            fecharModal();

        }

    }
);


/* =========================================================
   MENU MOBILE
========================================================= */

function configurarMenuMobile() {

    if (
        !menuMobile ||
        !mobileNav
    ) {

        return;

    }


    /* ---------------------------------------------
       ABRIR / FECHAR MENU
    --------------------------------------------- */

    menuMobile.addEventListener(
        "click",
        function () {

            const aberto =
                mobileNav.classList.toggle("ativo");


            menuMobile.setAttribute(
                "aria-expanded",
                aberto
                    ? "true"
                    : "false"
            );

        }
    );


    /* ---------------------------------------------
       FECHAR AO CLICAR EM UM LINK
    --------------------------------------------- */

    const links =
        mobileNav.querySelectorAll(
            ".mobile-nav-link"
        );


    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    mobileNav.classList.remove(
                        "ativo"
                    );


                    menuMobile.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        configurarMenuMobile();

        carregarPerfil();

    }
);