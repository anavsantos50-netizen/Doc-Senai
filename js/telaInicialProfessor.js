/* =========================================================
   DOCSENAI
   MINHAS ATIVIDADES - PROFESSOR
========================================================= */


/* =========================================================
   DADOS DAS ATIVIDADES
========================================================= */

let atividades = [

    {
        id: 1,

        titulo: "Introdução à programação",

        descricao: "Desenvolvimento de páginas web com HTML e CSS",

        turma: "Desenvolvimento Web",

        periodo: "2026",

        data: "2026-09-10",

        observacao: "Atividade prática realizada em laboratório.",

        fotos: [
            "../img/atividade1.jpg",
            "../img/atividade1.jpg",
            "../img/atividade1.jpg",
            "../img/atividade1.jpg",
            "../img/atividade1.jpg"
        ]

    },

    {
        id: 2,

        titulo: "Projeto Banco de Dados",

        descricao: "Criação e organização de banco de dados",

        turma: "Informática para Internet",

        periodo: "2026",

        data: "2026-09-09",

        observacao: "Os alunos desenvolveram tabelas e relacionamentos.",

        fotos: [
            "../img/atividade2.jpg",
            "../img/atividade2.jpg",
            "../img/atividade2.jpg",
            "../img/atividade2.jpg"
        ]

    },

    {
        id: 3,

        titulo: "Segurança da Informação",

        descricao: "Boas práticas de segurança digital",

        turma: "Informática",

        periodo: "2026",

        data: "2026-09-08",

        observacao: "Discussão sobre segurança digital e proteção de dados.",

        fotos: [
            "../img/atividade3.jpg",
            "../img/atividade3.jpg",
            "../img/atividade3.jpg"
        ]

    },

    {
        id: 4,

        titulo: "Desenvolvimento de páginas web",

        descricao: "Estruturação de páginas utilizando HTML.",

        turma: "Desenvolvimento Web",

        periodo: "2026",

        data: "2026-09-05",

        observacao: "Atividade prática em laboratório.",

        fotos: [
            "../img/atividade4.jpg",
            "../img/atividade4.jpg"
        ]

    },

    {
        id: 5,

        titulo: "Modelagem de dados",

        descricao: "Introdução à modelagem e organização de dados.",

        turma: "Informática para Internet",

        periodo: "2026",

        data: "2026-09-03",

        observacao: "Construção do modelo lógico do banco de dados.",

        fotos: [
            "../img/atividade5.jpg"
        ]

    },

    {
        id: 6,

        titulo: "Práticas de segurança digital",

        descricao: "Aplicação de conceitos de segurança da informação.",

        turma: "Informática",

        periodo: "2026",

        data: "2026-09-01",

        observacao: "Exercícios sobre segurança e proteção de informações.",

        fotos: [
            "../img/atividade6.jpg",
            "../img/atividade6.jpg"
        ]

    }

];


/* =========================================================
   ELEMENTOS DA PÁGINA
========================================================= */

const activitiesList = document.getElementById("activitiesList");

const emptyState = document.getElementById("emptyState");

const resultsCount = document.getElementById("resultsCount");

const searchInput = document.getElementById("searchInput");

const turmaFilter = document.getElementById("turmaFilter");

const periodoFilter = document.getElementById("periodoFilter");

const clearFilters = document.getElementById("clearFilters");

const emptyClearFilters = document.getElementById("emptyClearFilters");

const sortFilter = document.getElementById("sortFilter");


/* =========================================================
   ELEMENTOS DO MODAL
========================================================= */

const activityModal = document.getElementById("activityModal");

const modalClose = document.getElementById("modalClose");

const modalCloseBottom = document.getElementById("modalCloseBottom");

const modalTitle = document.getElementById("modalTitle");

const modalDate = document.getElementById("modalDate");

const modalTurma = document.getElementById("modalTurma");

const modalPeriodo = document.getElementById("modalPeriodo");

const modalDescription = document.getElementById("modalDescription");

const modalObservation = document.getElementById("modalObservation");

const modalObservationSection =
    document.getElementById("modalObservationSection");

const modalGallery = document.getElementById("modalGallery");

const evidenceCount = document.getElementById("evidenceCount");

const modalEdit = document.getElementById("modalEdit");


/* =========================================================
   ELEMENTOS DO MODAL DE EXCLUSÃO
========================================================= */

const confirmModal = document.getElementById("confirmModal");

const cancelDelete = document.getElementById("cancelDelete");

const confirmDelete = document.getElementById("confirmDelete");

let atividadeParaExcluir = null;


/* =========================================================
   MENU MOBILE
========================================================= */

const mobileMenuBtn = document.getElementById("mobileMenuBtn");

const mobileNav = document.getElementById("mobileNav");


if (mobileMenuBtn && mobileNav) {

    mobileMenuBtn.addEventListener("click", function () {

        const aberto = mobileNav.classList.toggle("show");

        mobileMenuBtn.setAttribute(
            "aria-expanded",
            aberto ? "true" : "false"
        );

        const icon = mobileMenuBtn.querySelector("i");

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


    /* Fecha o menu ao clicar em algum link */

    mobileNav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", function () {

            mobileNav.classList.remove("show");

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

            const icon = mobileMenuBtn.querySelector("i");

            if (icon) {

                icon.classList.remove("fa-xmark");

                icon.classList.add("fa-bars");

            }

        });

    });

}


/* =========================================================
   PREENCHER FILTROS
========================================================= */

function preencherFiltros() {

    if (turmaFilter) {

        turmaFilter.innerHTML =
            '<option value="">Todas as turmas</option>';

        const turmas = [
            ...new Set(
                atividades.map(
                    atividade => atividade.turma
                )
            )
        ];

        turmas.sort();

        turmas.forEach(turma => {

            const option =
                document.createElement("option");

            option.value = turma;

            option.textContent = turma;

            turmaFilter.appendChild(option);

        });

    }


    if (periodoFilter) {

        periodoFilter.innerHTML =
            '<option value="">Todos os períodos</option>';

        const periodos = [
            ...new Set(
                atividades.map(
                    atividade => atividade.periodo
                )
            )
        ];

        periodos.sort();

        periodos.forEach(periodo => {

            const option =
                document.createElement("option");

            option.value = periodo;

            option.textContent = periodo;

            periodoFilter.appendChild(option);

        });

    }

}


/* =========================================================
   FORMATAR DATA
========================================================= */

function formatarData(data) {

    if (!data) {
        return "—";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    const ano = partes[0];

    const mes = partes[1];

    const dia = partes[2];

    const meses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];

    return `${dia} de ${meses[Number(mes) - 1]} de ${ano}`;

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escaparHTML(texto) {

    if (texto === null || texto === undefined) {
        return "";
    }

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   RENDERIZAR ATIVIDADES
========================================================= */

function renderizarAtividades(lista) {

    if (!activitiesList) {
        return;
    }

    activitiesList.innerHTML = "";

    if (resultsCount) {

        resultsCount.textContent = lista.length;

    }


    if (lista.length === 0) {

        activitiesList.style.display = "none";

        if (emptyState) {
            emptyState.style.display = "flex";
        }

        return;

    }


    activitiesList.style.display = "flex";

    if (emptyState) {
        emptyState.style.display = "none";
    }


    lista.forEach(atividade => {

        const data =
            new Date(
                atividade.data + "T00:00:00"
            );

        const dia =
            String(data.getDate()).padStart(2, "0");

        const mes =
            data.toLocaleDateString(
                "pt-BR",
                { month: "short" }
            )
            .replace(".", "")
            .toUpperCase();


        const article =
            document.createElement("article");

        article.className = "activity-item";


        article.innerHTML = `

            <div class="activity-date">

                <strong>
                    ${dia}
                </strong>

                <span>
                    ${mes}
                </span>

            </div>


            <div class="activity-type blue">

                <i class="fa-solid fa-clipboard-list"></i>

            </div>


            <div class="activity-info">

                <h3>
                    ${escaparHTML(atividade.titulo)}
                </h3>

                <p>
                    ${escaparHTML(atividade.descricao)}
                </p>

            </div>


            <div class="activity-class">

                <span>
                    TURMA
                </span>

                <strong>
                    ${escaparHTML(atividade.turma)}
                </strong>

            </div>


            <div class="activity-photos">

                <i class="fa-regular fa-image"></i>

                <span>
                    ${atividade.fotos.length}
                    ${atividade.fotos.length === 1 ? "foto" : "fotos"}
                </span>

            </div>


            <button
                type="button"
                class="view-button"
                data-id="${atividade.id}"
                title="Visualizar"
            >

                <i class="fa-solid fa-chevron-right"></i>

            </button>

        `;


        activitiesList.appendChild(article);

    });


    /* =====================================================
       BOTÕES DE VISUALIZAR
    ===================================================== */

    activitiesList
        .querySelectorAll(".view-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(
                            this.dataset.id
                        );

                    abrirModal(id);

                }
            );

        });

}


/* =========================================================
   APLICAR FILTROS
========================================================= */

function aplicarFiltros() {

    const busca =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const turma =
        turmaFilter
            ? turmaFilter.value
            : "";


    const periodo =
        periodoFilter
            ? periodoFilter.value
            : "";


    let resultado =
        atividades.filter(atividade => {

            const correspondeBusca =
                !busca ||

                atividade.titulo
                    .toLowerCase()
                    .includes(busca) ||

                atividade.descricao
                    .toLowerCase()
                    .includes(busca) ||

                atividade.turma
                    .toLowerCase()
                    .includes(busca);


            const correspondeTurma =
                !turma ||
                atividade.turma === turma;


            const correspondePeriodo =
                !periodo ||
                atividade.periodo === periodo;


            return (
                correspondeBusca &&
                correspondeTurma &&
                correspondePeriodo
            );

        });


    /* =====================================================
       ORDENAÇÃO
    ===================================================== */

    if (sortFilter) {

        const ordem =
            sortFilter.value;


        if (ordem === "recent") {

            resultado.sort(
                (a, b) =>
                    new Date(b.data) -
                    new Date(a.data)
            );

        }


        if (ordem === "oldest") {

            resultado.sort(
                (a, b) =>
                    new Date(a.data) -
                    new Date(b.data)
            );

        }


        if (ordem === "title") {

            resultado.sort(
                (a, b) =>
                    a.titulo.localeCompare(
                        b.titulo,
                        "pt-BR"
                    )
            );

        }

    }


    renderizarAtividades(resultado);

}


/* =========================================================
   EVENTOS DOS FILTROS
========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        aplicarFiltros
    );

}


if (turmaFilter) {

    turmaFilter.addEventListener(
        "change",
        aplicarFiltros
    );

}


if (periodoFilter) {

    periodoFilter.addEventListener(
        "change",
        aplicarFiltros
    );

}


if (sortFilter) {

    sortFilter.addEventListener(
        "change",
        aplicarFiltros
    );

}


/* =========================================================
   LIMPAR FILTROS
========================================================= */

function limparFiltros() {

    if (searchInput) {
        searchInput.value = "";
    }

    if (turmaFilter) {
        turmaFilter.value = "";
    }

    if (periodoFilter) {
        periodoFilter.value = "";
    }

    aplicarFiltros();

}


if (clearFilters) {

    clearFilters.addEventListener(
        "click",
        limparFiltros
    );

}


if (emptyClearFilters) {

    emptyClearFilters.addEventListener(
        "click",
        limparFiltros
    );

}


/* =========================================================
   ABRIR MODAL
========================================================= */

function abrirModal(id) {

    const atividade =
        atividades.find(
            item => item.id === Number(id)
        );


    if (!atividade) {

        console.log(
            "Atividade não encontrada:",
            id
        );

        return;

    }


    /* Título */

    if (modalTitle) {
        modalTitle.textContent =
            atividade.titulo;
    }


    /* Data */

    if (modalDate) {

        modalDate.textContent =
            formatarData(
                atividade.data
            );

    }


    /* Turma */

    if (modalTurma) {

        modalTurma.textContent =
            atividade.turma;

    }


    /* Período */

    if (modalPeriodo) {

        modalPeriodo.textContent =
            atividade.periodo;

    }


    /* Descrição */

    if (modalDescription) {

        modalDescription.textContent =
            atividade.descricao;

    }


    /* Observação */

    if (modalObservationSection) {

        if (
            atividade.observacao &&
            atividade.observacao.trim() !== ""
        ) {

            modalObservationSection.style.display =
                "block";

            if (modalObservation) {

                modalObservation.textContent =
                    atividade.observacao;

            }

        } else {

            modalObservationSection.style.display =
                "none";

        }

    }


    /* =====================================================
       GALERIA DE FOTOS
    ===================================================== */

    if (modalGallery) {

        modalGallery.innerHTML = "";


        atividade.fotos.forEach(
            (foto, index) => {

                const img =
                    document.createElement("img");

                img.src = foto;

                img.alt =
                    `Evidência ${index + 1}`;

                img.loading = "lazy";


                img.addEventListener(
                    "error",
                    function () {

                        this.style.display =
                            "none";

                    }
                );


                modalGallery.appendChild(img);

            }
        );

    }


    /* Quantidade de fotos */

    if (evidenceCount) {

        evidenceCount.textContent =
            `${atividade.fotos.length} ${
                atividade.fotos.length === 1
                    ? "foto"
                    : "fotos"
            }`;

    }


    /* Editar */

    if (modalEdit) {

        modalEdit.onclick = function () {

            window.location.href =
                `registrar-atividade.html?id=${atividade.id}`;

        };

    }


    /* Mostrar modal */

    if (activityModal) {

        activityModal.classList.add("show");

        document.body.style.overflow =
            "hidden";

    }

}


/* =========================================================
   FECHAR MODAL
========================================================= */

function fecharModal() {

    if (activityModal) {

        activityModal.classList.remove("show");

    }

    document.body.style.overflow = "";

}


/* =========================================================
   EVENTOS DO MODAL
========================================================= */

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


/* Clicar fora do modal */

if (activityModal) {

    activityModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === activityModal
            ) {

                fecharModal();

            }

        }
    );

}


/* =========================================================
   EXCLUIR ATIVIDADE
========================================================= */

function abrirConfirmacaoExclusao(id) {

    atividadeParaExcluir =
        Number(id);


    if (confirmModal) {

        confirmModal.classList.add("show");

        document.body.style.overflow =
            "hidden";

    }

}


function fecharConfirmacaoExclusao() {

    atividadeParaExcluir =
        null;


    if (confirmModal) {

        confirmModal.classList.remove("show");

    }

    document.body.style.overflow = "";

}


/* Confirmar exclusão */

if (confirmDelete) {

    confirmDelete.addEventListener(
        "click",
        function () {

            if (
                atividadeParaExcluir === null
            ) {

                return;

            }


            atividades =
                atividades.filter(
                    atividade =>
                        atividade.id !==
                        atividadeParaExcluir
                );


            preencherFiltros();

            aplicarFiltros();

            fecharConfirmacaoExclusao();

            fecharModal();

        }
    );

}


/* Cancelar */

if (cancelDelete) {

    cancelDelete.addEventListener(
        "click",
        fecharConfirmacaoExclusao
    );

}


/* =========================================================
   TECLA ESC
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }


        if (
            activityModal &&
            activityModal.classList.contains("show")
        ) {

            fecharModal();

        }


        if (
            confirmModal &&
            confirmModal.classList.contains("show")
        ) {

            fecharConfirmacaoExclusao();

        }


        if (
            mobileNav &&
            mobileNav.classList.contains("show")
        ) {

            mobileNav.classList.remove("show");


            if (mobileMenuBtn) {

                mobileMenuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );


                const icon =
                    mobileMenuBtn.querySelector("i");


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


/* =========================================================
   MENU MOBILE AO REDIMENSIONAR
========================================================= */

window.addEventListener(
    "resize",
    function () {

        if (
            window.innerWidth > 750 &&
            mobileNav &&
            mobileNav.classList.contains("show")
        ) {

            mobileNav.classList.remove("show");


            if (mobileMenuBtn) {

                mobileMenuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );


                const icon =
                    mobileMenuBtn.querySelector("i");


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


/* =========================================================
   LOGOUT
========================================================= */

const btnLogout =
    document.getElementById("btnLogout");


if (btnLogout) {

    btnLogout.addEventListener(
        "click",
        function () {

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
   ABRIR ATIVIDADE VINDO DA TELA INICIAL
========================================================= */

function verificarAtividadeDaURL() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const id =
        Number(
            parametros.get("id")
        );


    if (!id) {
        return;
    }


    const atividade =
        atividades.find(
            item => item.id === id
        );


    if (!atividade) {

        console.log(
            "Nenhuma atividade encontrada para o ID:",
            id
        );

        return;

    }


    /* Abre o modal automaticamente */

    abrirModal(id);

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        preencherFiltros();

        aplicarFiltros();

        /*
         * Verifica se a página foi aberta
         * através de uma seta da Tela Inicial.
         */

        verificarAtividadeDaURL();

    }
);
document.querySelectorAll(".view-button").forEach(button => {

    button.addEventListener("click", function () {

        const id = this.dataset.id;

        window.location.href =
            `minhasAtividades.html?id=${id}`;

    });

});