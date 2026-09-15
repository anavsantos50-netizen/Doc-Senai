/* =========================================================
   DADOS DOS RELATÓRIOS
   ========================================================= */

let relatorios = [

    {
        id: 1,

        titulo: "Relatório de atividades - Maio/2026",

        periodo: "Maio/2026",

        periodoFiltro: "maio",

        professor: "João Silva",

        turma: "3º Informática A",

        curso: "Informática para Internet",

        cursoFiltro: "informatica",

        atividades: 12,

        dataGeracao: "2026-05-31",

        descricao:
            "Relatório contendo as atividades pedagógicas realizadas durante o mês de maio de 2026, com os respectivos registros e evidências."
    },


    {
        id: 2,

        titulo: "Relatório de atividades - Abril/2026",

        periodo: "Abril/2026",

        periodoFiltro: "abril",

        professor: "Maria Santos",

        turma: "2º Informática B",

        curso: "Informática para Internet",

        cursoFiltro: "informatica",

        atividades: 9,

        dataGeracao: "2026-04-30",

        descricao:
            "Relatório das atividades desenvolvidas pela turma durante o mês de abril de 2026."
    },


    {
        id: 3,

        titulo: "Atividades pedagógicas - Abril/2026",

        periodo: "Abril/2026",

        periodoFiltro: "abril",

        professor: "Ana Oliveira",

        turma: "Desenvolvimento Web",

        curso: "Desenvolvimento Web",

        cursoFiltro: "desenvolvimento",

        atividades: 15,

        dataGeracao: "2026-04-29",

        descricao:
            "Registro consolidado das atividades pedagógicas e evidências realizadas pela turma de Desenvolvimento Web."
    },


    {
        id: 4,

        titulo: "Relatório mensal - Março/2026",

        periodo: "Março/2026",

        periodoFiltro: "marco",

        professor: "João Silva",

        turma: "3º Informática A",

        curso: "Informática para Internet",

        cursoFiltro: "informatica",

        atividades: 11,

        dataGeracao: "2026-03-31",

        descricao:
            "Relatório mensal das atividades realizadas durante o período de março de 2026."
    },


    {
        id: 5,

        titulo: "Relatório pedagógico - Março/2026",

        periodo: "Março/2026",

        periodoFiltro: "marco",

        professor: "Maria Santos",

        turma: "2º Informática B",

        curso: "Informática para Internet",

        cursoFiltro: "informatica",

        atividades: 8,

        dataGeracao: "2026-03-28",

        descricao:
            "Relatório contendo os registros das atividades desenvolvidas e suas respectivas evidências."
    },


    {
        id: 6,

        titulo: "Relatório Desenvolvimento Web - Maio/2026",

        periodo: "Maio/2026",

        periodoFiltro: "maio",

        professor: "Ana Oliveira",

        turma: "Desenvolvimento Web",

        curso: "Desenvolvimento Web",

        cursoFiltro: "desenvolvimento",

        atividades: 13,

        dataGeracao: "2026-05-30",

        descricao:
            "Relatório das atividades realizadas no curso de Desenvolvimento Web durante o mês de maio."
    }

];


/* =========================================================
   ELEMENTOS
   ========================================================= */

const reportsList =
    document.getElementById("reportsList");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const periodFilter =
    document.getElementById("periodFilter");

const courseFilter =
    document.getElementById("courseFilter");

const sortFilter =
    document.getElementById("sortFilter");

const clearFilters =
    document.getElementById("clearFilters");

const emptyClear =
    document.getElementById("emptyClear");

const resultsCount =
    document.getElementById("resultsCount");

const totalReports =
    document.getElementById("totalReports");

const monthReports =
    document.getElementById("monthReports");

const totalActivities =
    document.getElementById("totalActivities");


/* =========================================================
   MENU MOBILE
   ========================================================= */

const menuMobile =
    document.getElementById("menuMobile");

const mobileNav =
    document.getElementById("mobileNav");


if (menuMobile && mobileNav) {

    menuMobile.addEventListener("click", () => {

        mobileNav.classList.toggle("show");

        const aberto =
            mobileNav.classList.contains("show");

        menuMobile.setAttribute(
            "aria-expanded",
            aberto
        );


        const icon =
            menuMobile.querySelector("i");


        if (icon) {

            icon.classList.toggle(
                "fa-bars",
                !aberto
            );

            icon.classList.toggle(
                "fa-xmark",
                aberto
            );
        }

    });


    mobileNav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            mobileNav.classList.remove("show");

            menuMobile.setAttribute(
                "aria-expanded",
                "false"
            );


            const icon =
                menuMobile.querySelector("i");


            if (icon) {

                icon.classList.remove("fa-xmark");

                icon.classList.add("fa-bars");
            }

        });

    });

}


/* =========================================================
   FORMATAR DATA
   ========================================================= */

function formatarData(data) {

    const partes =
        data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


/* =========================================================
   ESCAPAR HTML
   ========================================================= */

function escaparHTML(texto) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   ATUALIZAR RESUMO
   ========================================================= */

function atualizarResumo(lista) {

    if (resultsCount) {

        resultsCount.textContent =
            lista.length;
    }


    if (totalReports) {

        totalReports.textContent =
            relatorios.length;
    }


    const mesAtual =
        relatorios.filter(relatorio =>
            relatorio.periodoFiltro === "maio"
        );


    if (monthReports) {

        monthReports.textContent =
            mesAtual.length;
    }


    const atividades =
        relatorios.reduce(
            (total, relatorio) =>
                total + relatorio.atividades,
            0
        );


    if (totalActivities) {

        totalActivities.textContent =
            atividades;
    }

}


/* =========================================================
   CRIAR CARD
   ========================================================= */

function criarCard(relatorio) {

    const article =
        document.createElement("article");

    article.className =
        "report-item";


    article.innerHTML = `

        <div class="report-file-icon">

            <i class="fa-regular fa-file-pdf"></i>

        </div>


        <div class="report-info">

            <h3>
                ${escaparHTML(relatorio.titulo)}
            </h3>


            <p>
                ${escaparHTML(relatorio.professor)}
                •
                ${escaparHTML(relatorio.turma)}
                •
                ${escaparHTML(relatorio.curso)}
            </p>


            <div class="report-meta">

                <span class="report-tag">
                    ${escaparHTML(relatorio.periodo)}
                </span>


                <span class="report-date">

                    Gerado em
                    ${formatarData(relatorio.dataGeracao)}

                </span>

            </div>

        </div>


        <div class="report-activities">

            <strong>
                ${relatorio.atividades}
            </strong>

            <span>
                atividades
            </span>

        </div>


        <div class="report-actions">

            <button
                type="button"
                class="report-action-btn"
                title="Visualizar relatório"
                data-action="view"
                data-id="${relatorio.id}"
            >

                <i class="fa-regular fa-eye"></i>

            </button>


            <button
                type="button"
                class="report-action-btn download"
                title="Baixar PDF"
                data-action="download"
                data-id="${relatorio.id}"
            >

                <i class="fa-solid fa-download"></i>

            </button>


            <button
                type="button"
                class="report-action-btn delete"
                title="Excluir relatório"
                data-action="delete"
                data-id="${relatorio.id}"
            >

                <i class="fa-regular fa-trash-can"></i>

            </button>

        </div>

    `;


    return article;
}


/* =========================================================
   RENDERIZAR RELATÓRIOS
   ========================================================= */

function renderizarRelatorios(lista) {

    reportsList.innerHTML = "";


    if (lista.length === 0) {

        emptyState.classList.add("visible");

        atualizarResumo(lista);

        return;
    }


    emptyState.classList.remove("visible");


    lista.forEach(relatorio => {

        const card =
            criarCard(relatorio);

        reportsList.appendChild(card);

    });


    atualizarResumo(lista);
}


/* =========================================================
   FILTRAR E ORDENAR
   ========================================================= */

function aplicarFiltros() {

    const busca =
        searchInput.value
            .trim()
            .toLowerCase();


    const periodo =
        periodFilter.value;


    const curso =
        courseFilter.value;


    let lista =
        relatorios.filter(relatorio => {


            const correspondeBusca =

                !busca ||

                relatorio.titulo
                    .toLowerCase()
                    .includes(busca) ||

                relatorio.professor
                    .toLowerCase()
                    .includes(busca) ||

                relatorio.turma
                    .toLowerCase()
                    .includes(busca) ||

                relatorio.curso
                    .toLowerCase()
                    .includes(busca);


            const correspondePeriodo =

                !periodo ||

                relatorio.periodoFiltro === periodo;


            const correspondeCurso =

                !curso ||

                relatorio.cursoFiltro === curso;


            return (
                correspondeBusca &&
                correspondePeriodo &&
                correspondeCurso
            );

        });


    /* =====================================================
       ORDENAÇÃO
    ====================================================== */

    switch (sortFilter.value) {

        case "oldest":

            lista.sort(
                (a, b) =>
                    new Date(a.dataGeracao) -
                    new Date(b.dataGeracao)
            );

            break;


        case "title":

            lista.sort(
                (a, b) =>
                    a.titulo.localeCompare(
                        b.titulo,
                        "pt-BR"
                    )
            );

            break;


        case "recent":

        default:

            lista.sort(
                (a, b) =>
                    new Date(b.dataGeracao) -
                    new Date(a.dataGeracao)
            );

            break;

    }


    renderizarRelatorios(lista);
}


/* =========================================================
   LIMPAR FILTROS
   ========================================================= */

function limparFiltros() {

    searchInput.value = "";

    periodFilter.value = "";

    courseFilter.value = "";

    sortFilter.value = "recent";


    aplicarFiltros();
}


if (clearFilters) {

    clearFilters.addEventListener(
        "click",
        limparFiltros
    );

}


if (emptyClear) {

    emptyClear.addEventListener(
        "click",
        limparFiltros
    );

}


/* =========================================================
   EVENTOS DOS FILTROS
   ========================================================= */

searchInput.addEventListener(
    "input",
    aplicarFiltros
);


periodFilter.addEventListener(
    "change",
    aplicarFiltros
);


courseFilter.addEventListener(
    "change",
    aplicarFiltros
);


sortFilter.addEventListener(
    "change",
    aplicarFiltros
);


/* =========================================================
   MODAL
   ========================================================= */

const reportModal =
    document.getElementById("reportModal");

const modalClose =
    document.getElementById("modalClose");

const modalCloseBottom =
    document.getElementById("modalCloseBottom");

const modalTitle =
    document.getElementById("modalTitle");

const modalPeriod =
    document.getElementById("modalPeriod");

const modalProfessor =
    document.getElementById("modalProfessor");

const modalClass =
    document.getElementById("modalClass");

const modalCourse =
    document.getElementById("modalCourse");

const modalActivities =
    document.getElementById("modalActivities");

const modalDescription =
    document.getElementById("modalDescription");

const modalDownload =
    document.getElementById("modalDownload");


let relatorioSelecionado = null;


/* =========================================================
   ABRIR MODAL
   ========================================================= */

function abrirModal(id) {

    const relatorio =
        relatorios.find(
            item => item.id === id
        );


    if (!relatorio) {
        return;
    }


    relatorioSelecionado =
        relatorio;


    modalTitle.textContent =
        relatorio.titulo;


    modalPeriod.textContent =
        relatorio.periodo;


    modalProfessor.textContent =
        relatorio.professor;


    modalClass.textContent =
        relatorio.turma;


    modalCourse.textContent =
        relatorio.curso;


    modalActivities.textContent =
        `${relatorio.atividades} atividades`;


    modalDescription.textContent =
        relatorio.descricao;


    reportModal.classList.add("show");


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   FECHAR MODAL
   ========================================================= */

function fecharModal() {

    reportModal.classList.remove("show");

    document.body.style.overflow = "";

    relatorioSelecionado = null;
}


if (modalClose) {

    modalClose.addEventListener(
        "click",
        fecharModal
    );

}


if (modalCloseBottom) {

    modalCloseBottom.addEventListener(
        "click",
        fecharModal
    );

}


/* =========================================================
   FECHAR CLICANDO FORA
   ========================================================= */

reportModal.addEventListener(
    "click",
    event => {

        if (
            event.target === reportModal
        ) {

            fecharModal();

        }

    }
);


/* =========================================================
   DOWNLOAD
   ========================================================= */

function baixarPDF(relatorio) {

    if (!relatorio) {
        return;
    }


    /*
       POR ENQUANTO É UMA SIMULAÇÃO.

       Quando o backend estiver pronto,
       aqui vamos chamar a API do C# para
       buscar o PDF verdadeiro.
    */

    alert(
        `Download do relatório "${relatorio.titulo}" será realizado quando o PDF estiver disponível no sistema.`
    );

}


/* =========================================================
   EVENTOS DOS BOTÕES DOS CARDS
   ========================================================= */

reportsList.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".report-action-btn"
            );


        if (!button) {
            return;
        }


        const id =
            Number(button.dataset.id);


        const action =
            button.dataset.action;


        const relatorio =
            relatorios.find(
                item => item.id === id
            );


        if (!relatorio) {
            return;
        }


        /* VISUALIZAR */

        if (action === "view") {

            abrirModal(id);

        }


        /* DOWNLOAD */

        if (action === "download") {

            baixarPDF(relatorio);

        }


        /* EXCLUIR */

        if (action === "delete") {

            const confirmar =
                confirm(
                    `Deseja realmente excluir o relatório "${relatorio.titulo}"?`
                );


            if (!confirmar) {
                return;
            }


            relatorios =
                relatorios.filter(
                    item => item.id !== id
                );


            aplicarFiltros();

        }

    }
);


/* =========================================================
   DOWNLOAD PELO MODAL
   ========================================================= */

if (modalDownload) {

    modalDownload.addEventListener(
        "click",
        () => {

            baixarPDF(
                relatorioSelecionado
            );

        }
    );

}


/* =========================================================
   TECLA ESC
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }


        if (
            reportModal.classList.contains("show")
        ) {

            fecharModal();

        }


        if (
            mobileNav &&
            mobileNav.classList.contains("show")
        ) {

            mobileNav.classList.remove("show");

            menuMobile.setAttribute(
                "aria-expanded",
                "false"
            );


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
);


/* =========================================================
   REDIMENSIONAMENTO
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 800 &&
            mobileNav
        ) {

            mobileNav.classList.remove("show");

            menuMobile.setAttribute(
                "aria-expanded",
                "false"
            );


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
);


/* =========================================================
   LOGOUT
   ========================================================= */

const btnLogout =
    document.getElementById("btnLogout");


if (btnLogout) {

    btnLogout.addEventListener(
        "click",
        () => {

            const confirmar =
                confirm(
                    "Deseja realmente sair?"
                );


            if (!confirmar) {
                return;
            }


            sessionStorage.clear();

            localStorage.removeItem(
                "usuarioLogado"
            );


            window.location.href =
                "login.html";

        }
    );

}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        aplicarFiltros();

    }
);