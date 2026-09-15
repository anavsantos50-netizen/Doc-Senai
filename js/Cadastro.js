// =========================================================
// CADASTRAR USUÁRIO
// =========================================================

function cadastrar() {

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const cargo = document.getElementById("cargo").value;

    // =========================================================
    // VERIFICAR CAMPOS VAZIOS
    // =========================================================

    if (
        nome === "" ||
        email === "" ||
        senha === "" ||
        cargo === ""
    ) {

        mostrarModalErro(
            "Campos obrigatórios",
            "Preencha todos os campos para realizar o cadastro."
        );

        return;
    }


    // =========================================================
    // VERIFICAR TAMANHO DA SENHA
    // =========================================================

    if (senha.length !== 8) {

        mostrarModalErro(
            "Senha inválida",
            "A senha deve ter exatamente 8 caracteres."
        );

        return;
    }


    // =========================================================
    // ENVIAR CADASTRO PARA O BACKEND
    // =========================================================

    fetch("https://localhost:7082/Usuario", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        credentials: "include",

        body: JSON.stringify({
            nome: nome,
            email: email,
            senha: senha,
            cargo: cargo
        })

    })

    .then(async response => {

        console.log("Status do cadastro:", response.status);

        // =====================================================
        // ERRO VINDO DO BACKEND
        // =====================================================

        if (!response.ok) {

            const mensagem = await response.text();

            throw new Error(
                mensagem || "Não foi possível realizar o cadastro."
            );
        }

        return response.json();

    })

    // =========================================================
    // CADASTRO REALIZADO
    // =========================================================

    .then(usuario => {

        console.log("Usuário cadastrado:", usuario);

        const modal = document.getElementById("modalSucesso");

        if (modal) {

            modal.classList.add("show");

        } else {

            console.error("Modal de sucesso não encontrado!");

        }

    })

    // =========================================================
    // TRATAMENTO DE ERRO
    // =========================================================

    .catch(error => {

        console.error("Erro no cadastro:", error);

        mostrarModalErro(
            "Não foi possível realizar o cadastro",
            error.message
        );

    });
}


// =========================================================
// MOSTRAR / OCULTAR SENHA
// =========================================================

const toggleSenha = document.getElementById("toggleSenha");
const senhaInput = document.getElementById("senha");

if (toggleSenha && senhaInput) {

    toggleSenha.addEventListener("click", function () {

        if (senhaInput.type === "password") {

            senhaInput.type = "text";

            toggleSenha.classList.remove("fa-eye");
            toggleSenha.classList.add("fa-eye-slash");

            toggleSenha.parentElement.setAttribute(
                "aria-label",
                "Ocultar senha"
            );

        } else {

            senhaInput.type = "password";

            toggleSenha.classList.remove("fa-eye-slash");
            toggleSenha.classList.add("fa-eye");

            toggleSenha.parentElement.setAttribute(
                "aria-label",
                "Mostrar senha"
            );

        }

    });

}


// =========================================================
// MODAL DE SUCESSO
// =========================================================

const modalSucesso = document.getElementById("modalSucesso");
const btnContinuar = document.getElementById("btnContinuar");

function mostrarModalSucesso() {

    if (modalSucesso) {

        modalSucesso.classList.add("show");

    }

}


// =========================================================
// BOTÃO CONTINUAR
// =========================================================

if (btnContinuar) {

    btnContinuar.addEventListener("click", function () {

        modalSucesso.classList.remove("show");

        window.location.href = "login.html";

    });

}


// =========================================================
// MODAL DE ERRO
// =========================================================

const modalErro = document.getElementById("modalErro");
const btnFecharErro = document.getElementById("btnFecharErro");
const tituloErro = document.getElementById("tituloErro");
const mensagemErro = document.getElementById("mensagemErro");

function mostrarModalErro(titulo, mensagem) {

    if (tituloErro) {

        tituloErro.textContent = titulo;

    }

    if (mensagemErro) {

        mensagemErro.textContent = mensagem;

    }

    if (modalErro) {

        modalErro.classList.add("show");

    } else {

        console.error("Modal de erro não encontrado!");

    }

}


// =========================================================
// FECHAR MODAL DE ERRO
// =========================================================

if (btnFecharErro) {

    btnFecharErro.addEventListener("click", function () {

        if (modalErro) {

            modalErro.classList.remove("show");

        }

    });

}


// =========================================================
// BOTÃO CADASTRO
// =========================================================

const btnCadastro = document.getElementById("btnCadastro");

if (btnCadastro) {

    btnCadastro.addEventListener("click", function () {

        window.location.href = "cadastro.html";

    });

}