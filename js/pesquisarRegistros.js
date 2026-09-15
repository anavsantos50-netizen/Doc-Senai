// ======================================================
// MENU MOBILE
// ======================================================

const menuMobile = document.getElementById("menuMobile");
const mainNav = document.querySelector(".main-nav");

if (menuMobile && mainNav) {

    menuMobile.addEventListener("click", () => {

        mainNav.classList.toggle("menu-aberto");

    });

}


// ======================================================
// LIMPAR FILTROS
// ======================================================

const btnLimpar = document.getElementById("btnLimpar");

if (btnLimpar) {

    btnLimpar.addEventListener("click", () => {

        const professor = document.getElementById("professor");
        const turma = document.getElementById("turma");
        const curso = document.getElementById("curso");
        const dataInicial = document.getElementById("dataInicial");
        const dataFinal = document.getElementById("dataFinal");

        if (professor) {
            professor.value = "";
        }

        if (turma) {
            turma.value = "";
        }

        if (curso) {
            curso.value = "";
        }

        if (dataInicial) {
            dataInicial.value = "";
        }

        if (dataFinal) {
            dataFinal.value = "";
        }

    });

}


// ======================================================
// PESQUISAR REGISTROS
// ======================================================

const formulario = document.getElementById("formPesquisa");

if (formulario) {

    formulario.addEventListener("submit", (event) => {

        event.preventDefault();

        const professor =
            document.getElementById("professor").value;

        const turma =
            document.getElementById("turma").value;

        const curso =
            document.getElementById("curso").value;

        const dataInicial =
            document.getElementById("dataInicial").value;

        const dataFinal =
            document.getElementById("dataFinal").value;


        console.log("=================================");
        console.log("FILTROS DE PESQUISA");
        console.log("=================================");

        console.log("Professor:", professor);
        console.log("Turma:", turma);
        console.log("Curso:", curso);
        console.log("Data inicial:", dataInicial);
        console.log("Data final:", dataFinal);


        /*
            FUTURAMENTE:

            Aqui vamos conectar com a API C#.

            Exemplo:

            fetch("https://localhost:xxxx/api/Atividade")
                .then(response => response.json())
                .then(dados => {
                    // mostrar os registros
                });

        */

    });

}


// ======================================================
// ELEMENTOS DO MODAL
// ======================================================

const modalDetalhes =
    document.getElementById("modalDetalhes");

const btnFecharModal =
    document.getElementById("btnFecharModal");

const detalheData =
    document.getElementById("detalheData");

const detalheProfessor =
    document.getElementById("detalheProfessor");

const detalheTurma =
    document.getElementById("detalheTurma");

const detalheCurso =
    document.getElementById("detalheCurso");

const detalheDescricao =
    document.getElementById("detalheDescricao");

const detalheObservacao =
    document.getElementById("detalheObservacao");

const detalheFotos =
    document.getElementById("detalheFotos");


// ======================================================
// BOTÕES "VER DETALHES"
// ======================================================

const botoesDetalhes =
    document.querySelectorAll(".btn-detalhes");


botoesDetalhes.forEach((botao) => {

    botao.addEventListener("click", () => {

        const atividade =
            botao.closest(".atividade-card");


        if (!atividade) {
            return;
        }


        // ==============================================
        // PEGAR DADOS DO CARD
        // ==============================================

        const data =
            atividade.dataset.data;

        const professor =
            atividade.dataset.professor;

        const turma =
            atividade.dataset.turma;

        const curso =
            atividade.dataset.curso;

        const descricao =
            atividade.dataset.descricao;

        const observacao =
            atividade.dataset.observacao;


        // ==============================================
        // PREENCHER MODAL
        // ==============================================

        detalheData.textContent =
            data || "-";

        detalheProfessor.textContent =
            professor || "-";

        detalheTurma.textContent =
            turma || "-";

        detalheCurso.textContent =
            curso || "-";

        detalheDescricao.textContent =
            descricao || "-";

        detalheObservacao.textContent =
            observacao || "-";


        // ==============================================
        // ABRIR MODAL
        // ==============================================

        modalDetalhes.classList.add("ativo");

        document.body.style.overflow = "hidden";

    });

});


// ======================================================
// FECHAR MODAL
// ======================================================

function fecharModal() {

    modalDetalhes.classList.remove("ativo");

    document.body.style.overflow = "";

}


// ======================================================
// BOTÃO X
// ======================================================

if (btnFecharModal) {

    btnFecharModal.addEventListener("click", () => {

        fecharModal();

    });

}


// ======================================================
// CLICAR FORA DO MODAL
// ======================================================

if (modalDetalhes) {

    modalDetalhes.addEventListener("click", (event) => {

        if (event.target === modalDetalhes) {

            fecharModal();

        }

    });

}


// ======================================================
// TECLA ESC
// ======================================================

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        if (
            modalDetalhes &&
            modalDetalhes.classList.contains("ativo")
        ) {

            fecharModal();

        }

    }

});


// ======================================================
// BOTÃO SAIR
// ======================================================

const btnSair =
    document.getElementById("btnSair");

if (btnSair) {

    btnSair.addEventListener("click", () => {

        const confirmar =
            confirm("Tem certeza que deseja sair do sistema?");


        if (confirmar) {

            /*
                FUTURAMENTE:

                Aqui vamos limpar a autenticação
                e voltar para o login.

                Por enquanto:
            */

            window.location.href = "login.html";

        }

    });

}