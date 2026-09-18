// ======================================================
// TELA INICIAL - SUPERVISÃO
// ======================================================

const API_BASE = "https://localhost:7082";


// ======================================================
// CARREGAR DASHBOARD
// ======================================================

async function carregarDashboard() {

    try {

        const resposta =
            await fetch(
                `${API_BASE}/api/Supervisao/dashboard`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        // --------------------------------------------------
        // USUÁRIO NÃO AUTENTICADO
        // --------------------------------------------------

        if (resposta.status === 401) {

            window.location.href =
                "login.html";

            return;
        }


        // --------------------------------------------------
        // ACESSO NEGADO
        // --------------------------------------------------

        if (resposta.status === 403) {

            alert(
                "Você não possui permissão para acessar esta área."
            );

            window.location.href =
                "login.html";

            return;
        }


        if (!resposta.ok) {

            throw new Error(
                "Erro ao carregar o dashboard."
            );
        }


        const dados =
            await resposta.json();


        console.log(
            "DADOS DO DASHBOARD:",
            dados
        );


        // ==================================================
        // NOME DA SUPERVISÃO
        // ==================================================

        const nomeSupervisor =
            document.getElementById(
                "nomeSupervisor"
            );


        if (nomeSupervisor) {

            nomeSupervisor.textContent =
                dados.nome || "Supervisor";
        }


        // ==================================================
        // TOTAL DE ATIVIDADES
        // ==================================================

        const totalAtividades =
            document.getElementById(
                "totalAtividades"
            );


        if (totalAtividades) {

            totalAtividades.textContent =
                dados.totalAtividades ?? 0;
        }


        // ==================================================
        // TOTAL DE TURMAS
        // ==================================================

        const totalTurmas =
            document.getElementById(
                "totalTurmas"
            );


        if (totalTurmas) {

            totalTurmas.textContent =
                dados.totalTurmas ?? 0;
        }


        // ==================================================
        // TOTAL DE PROFESSORES
        // ==================================================

        const totalProfessores =
            document.getElementById(
                "totalProfessores"
            );


        if (totalProfessores) {

            totalProfessores.textContent =
                dados.totalProfessores ?? 0;
        }


        // ==================================================
        // TOTAL DE RELATÓRIOS
        // ==================================================

        const totalRelatorios =
            document.getElementById(
                "totalRelatorios"
            );


        if (totalRelatorios) {

            totalRelatorios.textContent =
                dados.totalRelatorios ?? 0;
        }


    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

        alert(
            "Não foi possível carregar os dados da Supervisão."
        );
    }
}


// ======================================================
// MENU MOBILE
// ======================================================

const menuMobile =
    document.getElementById(
        "menuMobile"
    );

const mainNav =
    document.querySelector(
        ".main-nav"
    );


if (menuMobile && mainNav) {

    menuMobile.addEventListener(
        "click",
        () => {

            mainNav.classList.toggle(
                "menu-aberto"
            );

        }
    );

}


// ======================================================
// DATA ATUAL
// ======================================================

const dataAtual =
    document.getElementById(
        "dataAtual"
    );


if (dataAtual) {

    const hoje =
        new Date();


    const opcoes = {

        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"

    };


    let dataFormatada =
        hoje.toLocaleDateString(
            "pt-BR",
            opcoes
        );


    dataFormatada =
        dataFormatada.charAt(0).toUpperCase() +
        dataFormatada.slice(1);


    dataAtual.textContent =
        dataFormatada;

}


// ======================================================
// BOTÃO SAIR
// ======================================================

const btnSair =
    document.getElementById(
        "btnSair"
    );


if (btnSair) {

    btnSair.addEventListener(
        "click",
        async () => {

            const confirmar =
                confirm(
                    "Tem certeza que deseja sair do sistema?"
                );


            if (!confirmar) {
                return;
            }


            /*
             * Por enquanto mantém o comportamento atual.
             * Depois vamos integrar o logout da sessão.
             */

            window.location.href =
                "login.html";

        }
    );

}


// ======================================================
// INICIAR DASHBOARD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarDashboard();

    }
);