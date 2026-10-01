/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const API_BASE = "https://localhost:7082";


/* =========================================================
   ELEMENTOS
========================================================= */

const profileModal =
    document.getElementById("profileModal");

const passwordModal =
    document.getElementById("passwordModal");

const btnEditar =
    document.getElementById("btnEditar");

const btnAlterarSenha =
    document.getElementById("btnAlterarSenha");

const modalClose =
    document.getElementById("modalClose");

const passwordModalClose =
    document.getElementById("passwordModalClose");

const btnCancelar =
    document.getElementById("btnCancelar");

const btnCancelarSenha =
    document.getElementById("btnCancelarSenha");

const btnSalvar =
    document.getElementById("btnSalvar");

const btnSalvarSenha =
    document.getElementById("btnSalvarSenha");

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


/* =========================================================
   CAMPOS DA SENHA
========================================================= */

const inputSenhaAtual =
    document.getElementById("senhaAtual");

const inputNovaSenha =
    document.getElementById("novaSenha");


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
   ABRIR MODAL DE EDITAR PERFIL
========================================================= */

function abrirModalPerfil() {

    if (!profileModal) {
        return;
    }


    profileModal.classList.add("show");


    if (inputNome) {

        inputNome.focus();

    }

}


/* =========================================================
   FECHAR MODAL DE EDITAR PERFIL
========================================================= */

function fecharModalPerfil() {

    if (!profileModal) {
        return;
    }


    profileModal.classList.remove("show");

}


/* =========================================================
   ABRIR MODAL DE ALTERAR SENHA
========================================================= */

function abrirModalSenha() {

    if (!passwordModal) {
        return;
    }


    passwordModal.classList.add("show");


    if (inputSenhaAtual) {

        inputSenhaAtual.value = "";

    }


    if (inputNovaSenha) {

        inputNovaSenha.value = "";

    }


    if (inputSenhaAtual) {

        inputSenhaAtual.focus();

    }

}


/* =========================================================
   FECHAR MODAL DE ALTERAR SENHA
========================================================= */

function fecharModalSenha() {

    if (!passwordModal) {
        return;
    }


    passwordModal.classList.remove("show");


    if (inputSenhaAtual) {

        inputSenhaAtual.value = "";

    }


    if (inputNovaSenha) {

        inputNovaSenha.value = "";

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
           FECHAR MODAL
        ============================================= */

        fecharModalPerfil();


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
   ALTERAR SENHA
========================================================= */

async function alterarSenha() {

    if (
        !inputSenhaAtual ||
        !inputNovaSenha ||
        !btnSalvarSenha
    ) {

        return;

    }


    const senhaAtual =
        inputSenhaAtual.value.trim();

    const novaSenha =
        inputNovaSenha.value.trim();


    /* ---------------------------------------------
       VALIDAR CAMPOS
    --------------------------------------------- */

    if (!senhaAtual || !novaSenha) {

        alert(
            "Preencha a senha atual e a nova senha."
        );

        return;
    }


    /* ---------------------------------------------
       VALIDAR NOVA SENHA
    --------------------------------------------- */

    if (novaSenha.length !== 8) {

        alert(
            "A nova senha deve ter exatamente 8 caracteres."
        );

        inputNovaSenha.focus();

        return;
    }


    /* ---------------------------------------------
       BOTÃO
    --------------------------------------------- */

    const textoOriginal =
        btnSalvarSenha.innerHTML;


    btnSalvarSenha.disabled = true;

    btnSalvarSenha.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Alterando...';


    try {


        /* =============================================
           ALTERAR SENHA
        ============================================= */

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
                        senhaAtual: senhaAtual,
                        novaSenha: novaSenha
                    })
                }
            );


        /* ---------------------------------------------
           SESSÃO EXPIRADA
        --------------------------------------------- */

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


        /* ---------------------------------------------
           ERRO
        --------------------------------------------- */

        if (!respostaSenha.ok) {

            alert(
                resultadoSenha.mensagem ||
                "Não foi possível alterar a senha."
            );

            return;
        }


        /* ---------------------------------------------
           LIMPAR CAMPOS
        --------------------------------------------- */

        inputSenhaAtual.value = "";

        inputNovaSenha.value = "";


        /* ---------------------------------------------
           FECHAR MODAL
        --------------------------------------------- */

        fecharModalSenha();


        /* ---------------------------------------------
           MENSAGEM
        --------------------------------------------- */

        alert(
            resultadoSenha.mensagem ||
            "Senha alterada com sucesso."
        );


    } catch (erro) {

        console.error(
            "Erro ao alterar senha:",
            erro
        );

        alert(
            "Não foi possível alterar a senha."
        );


    } finally {

        btnSalvarSenha.disabled = false;

        btnSalvarSenha.innerHTML =
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
        abrirModalPerfil
    );

}


/* ALTERAR SENHA */

if (btnAlterarSenha) {

    btnAlterarSenha.addEventListener(
        "click",
        abrirModalSenha
    );

}


/* FECHAR MODAL DE PERFIL PELO X */

if (modalClose) {

    modalClose.addEventListener(
        "click",
        fecharModalPerfil
    );

}


/* FECHAR MODAL DE SENHA PELO X */

if (passwordModalClose) {

    passwordModalClose.addEventListener(
        "click",
        fecharModalSenha
    );

}


/* CANCELAR PERFIL */

if (btnCancelar) {

    btnCancelar.addEventListener(
        "click",
        fecharModalPerfil
    );

}


/* CANCELAR SENHA */

if (btnCancelarSenha) {

    btnCancelarSenha.addEventListener(
        "click",
        fecharModalSenha
    );

}


/* SALVAR PERFIL */

if (btnSalvar) {

    btnSalvar.addEventListener(
        "click",
        salvarPerfil
    );

}


/* SALVAR SENHA */

if (btnSalvarSenha) {

    btnSalvarSenha.addEventListener(
        "click",
        alterarSenha
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


/* MODAL DE PERFIL */

if (profileModal) {

    profileModal.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target === profileModal
            ) {

                fecharModalPerfil();

            }

        }
    );

}


/* MODAL DE SENHA */

if (passwordModal) {

    passwordModal.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target === passwordModal
            ) {

                fecharModalSenha();

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
            evento.key !== "Escape"
        ) {

            return;

        }


        if (
            profileModal &&
            profileModal.classList.contains("show")
        ) {

            fecharModalPerfil();

        }


        if (
            passwordModal &&
            passwordModal.classList.contains("show")
        ) {

            fecharModalSenha();

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