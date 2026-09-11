/* =====================================================
   MENU MOBILE
===================================================== */

const menuMobile = document.getElementById("menuMobile");
const mainNav = document.getElementById("mainNav");

if (menuMobile && mainNav) {

    menuMobile.addEventListener("click", () => {

        mainNav.classList.toggle("open");

        const icon = menuMobile.querySelector("i");

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


    /* Fecha ao clicar em um link */

    const menuLinks =
        mainNav.querySelectorAll(".nav-link");

    menuLinks.forEach(link => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("open");

            const icon =
                menuMobile.querySelector("i");

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

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
   DADOS DO PROFESSOR
===================================================== */

let professor = {

    nome: "Professor",

    email: "professor@senai.br",

    cargo: "Professor"

};


/* =====================================================
   ABRIR MODAL DE EDIÇÃO
===================================================== */

function abrirEdicao() {

    document.getElementById("nome").value =
        professor.nome;

    document.getElementById("email").value =
        professor.email;

    document.getElementById("cargo").value =
        professor.cargo;


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
   SALVAR PERFIL
===================================================== */

if (profileForm) {

    profileForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const nome =
                document.getElementById("nome")
                    .value
                    .trim();


            const email =
                document.getElementById("email")
                    .value
                    .trim();


            if (!nome || !email) {

                alert(
                    "Preencha todos os campos."
                );

                return;
            }


            professor.nome =
                nome;

            professor.email =
                email;


            atualizarPerfil();


            fecharEdicao();


            alert(
                "Perfil atualizado com sucesso!"
            );

        }
    );

}


/* =====================================================
   ATUALIZAR TELA
===================================================== */

function atualizarPerfil() {

    profileName.textContent =
        professor.nome;

    profileEmail.textContent =
        professor.email;

    infoNome.textContent =
        professor.nome;

    infoEmail.textContent =
        professor.email;

    infoCargo.textContent =
        professor.cargo;

}


/* =====================================================
   MODAL ALTERAR SENHA
===================================================== */

const btnAlterarSenha =
    document.getElementById("btnAlterarSenha");

const passwordModal =
    document.getElementById("passwordModal");

const passwordModalClose =
    document.getElementById("passwordModalClose");

const btnCancelarSenha =
    document.getElementById("btnCancelarSenha");

const passwordForm =
    document.getElementById("passwordForm");


/* =====================================================
   ABRIR SENHA
===================================================== */

if (btnAlterarSenha) {

    btnAlterarSenha.addEventListener(
        "click",
        () => {

            passwordModal.classList.add("show");

            document.body.style.overflow =
                "hidden";

        }
    );

}


/* =====================================================
   FECHAR SENHA
===================================================== */

function fecharSenha() {

    passwordModal.classList.remove("show");

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
        event => {

            event.preventDefault();


            const senhaAtual =
                document.getElementById(
                    "senhaAtual"
                ).value;


            const novaSenha =
                document.getElementById(
                    "novaSenha"
                ).value;


            const confirmarSenha =
                document.getElementById(
                    "confirmarSenha"
                ).value;


            if (
                !senhaAtual ||
                !novaSenha ||
                !confirmarSenha
            ) {

                alert(
                    "Preencha todos os campos."
                );

                return;
            }


            if (novaSenha.length < 6) {

                alert(
                    "A nova senha deve ter pelo menos 6 caracteres."
                );

                return;
            }


            if (novaSenha !== confirmarSenha) {

                alert(
                    "A confirmação da senha não corresponde."
                );

                return;
            }


            fecharSenha();


            passwordForm.reset();


            alert(
                "Senha alterada com sucesso!"
            );

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
   ESC FECHA MODAIS
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
    document.getElementById("btnLogout");

const btnLogoutPerfil =
    document.getElementById("btnLogoutPerfil");


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

            mainNav.classList.remove("open");


            if (menuMobile) {

                const icon =
                    menuMobile.querySelector("i");


                if (icon) {

                    icon.classList.remove(
                        "fa-xmark"
                    );

                    icon.classList.add(
                        "fa-bars"
                    );

                }

            }

        }

    }
);


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

atualizarPerfil();