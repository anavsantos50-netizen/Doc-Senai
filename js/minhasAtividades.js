/* =========================================================
   DOCSENAI
   MINHAS ATIVIDADES
========================================================= */


/* =========================================================
   DADOS DAS ATIVIDADES
   =========================================================
   Depois podemos trocar estes dados pela API/SQL Server.
========================================================= */

let atividades = [

    {
        id: 1,
        titulo: "Introdução ao desenvolvimento web",
        data: "04/06/2026",
        turma: "Informática 2026",
        periodo: "1º Semestre",
        descricao:
            "Apresentação dos conceitos fundamentais de desenvolvimento web, estrutura de páginas HTML e organização de projetos.",
        observacao:
            "Os alunos realizaram uma atividade prática de criação de uma página simples.",
        fotos: [
            "../img/evidencia1.jpg",
            "../img/evidencia2.jpg",
            "../img/evidencia3.jpg"
        ]
    },

    {
        id: 2,
        titulo: "Estrutura básica do HTML",
        data: "10/06/2026",
        turma: "Informática 2026",
        periodo: "1º Semestre",
        descricao:
            "Estudo da estrutura básica de documentos HTML, utilização de tags e organização dos elementos da página.",
        observacao:
            "Atividade realizada individualmente pelos alunos.",
        fotos: [
            "../img/evidencia1.jpg",
            "../img/evidencia2.jpg"
        ]
    },

    {
        id: 3,
        titulo: "Introdução ao CSS",
        data: "17/06/2026",
        turma: "Informática 2026",
        periodo: "1º Semestre",
        descricao:
            "Apresentação dos principais conceitos de CSS, incluindo cores, fontes, espaçamentos e estilização de elementos.",
        observacao:
            "Foram realizados exercícios práticos de estilização.",
        fotos: [
            "../img/evidencia2.jpg"
        ]
    },

    {
        id: 4,
        titulo: "Criação de formulários",
        data: "24/06/2026",
        turma: "Informática Básica",
        periodo: "1º Semestre",
        descricao:
            "Desenvolvimento de formulários utilizando campos de texto, seleção, botões e outros elementos de entrada.",
        observacao:
            "Os alunos desenvolveram um formulário como atividade prática.",
        fotos: [
            "../img/evidencia1.jpg",
            "../img/evidencia3.jpg"
        ]
    },

    {
        id: 5,
        titulo: "Projeto prático de página web",
        data: "02/07/2026",
        turma: "Informática 2026",
        periodo: "2º Semestre",
        descricao:
            "Desenvolvimento de uma página web aplicando os conceitos estudados nas aulas anteriores.",
        observacao:
            "Atividade realizada em grupos.",
        fotos: [
            "../img/evidencia1.jpg",
            "../img/evidencia2.jpg"
        ]
    },

    {
        id: 6,
        titulo: "Revisão dos conteúdos",
        data: "08/07/2026",
        turma: "Administração 2026",
        periodo: "2º Semestre",
        descricao:
            "Revisão dos principais conteúdos trabalhados durante o período, com exercícios para fixação.",
        observacao:
            "A atividade foi utilizada como preparação para a avaliação.",
        fotos: [
            "../img/evidencia3.jpg"
        ]
    }

];


/* =========================================================
   ELEMENTOS DO DOM
========================================================= */

const activitiesList = document.getElementById("activitiesList");

const emptyState = document.getElementById("emptyState");

const resultsCount = document.getElementById("resultsCount");

const searchInput = document.getElementById("searchInput");

const turmaFilter = document.getElementById("turmaFilter");

const periodoFilter = document.getElementById("periodoFilter");

const clearFilters = document.getElementById("clearFilters");

const emptyClearFilters =
    document.getElementById("emptyClearFilters");

const sortFilter = document.getElementById("sortFilter");


/* =========================================================
   MENU MOBILE
========================================================= */

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const mobileNav =
    document.getElementById("mobileNav");


if (mobileMenuBtn && mobileNav) {

    mobileMenuBtn.addEventListener("click", function () {

        const aberto =
            mobileNav.classList.toggle("show");

        mobileMenuBtn.setAttribute(
            "aria-expanded",
            aberto
        );

        const icon =
            mobileMenuBtn.querySelector("i");

        if (icon) {

            if (aberto) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            } else {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

        }

    });


    /* Fecha o menu quando clicar em um link */

    const mobileLinks =
        mobileNav.querySelectorAll("a");

    mobileLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            mobileNav.classList.remove("show");

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

            const icon =
                mobileMenuBtn.querySelector("i");

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

        const turmas = [
            ...new Set(
                atividades.map(
                    atividade => atividade.turma
                )
            )
        ];

        turmas.sort();

        turmas.forEach(function (turma) {

            const option =
                document.createElement("option");

            option.value = turma;
            option.textContent = turma;

            turmaFilter.appendChild(option);

        });

    }


    if (periodoFilter) {

        const periodos = [
            ...new Set(
                atividades.map(
                    atividade => atividade.periodo
                )
            )
        ];

        periodos.sort();

        periodos.forEach(function (periodo) {

            const option =
                document.createElement("option");

            option.value = periodo;
            option.textContent = periodo;

            periodoFilter.appendChild(option);

        });

    }

}


/* =========================================================
   CONVERTER DATA
========================================================= */

function converterData(data) {

    const partes = data.split("/");

    return new Date(
        partes[2],
        partes[1] - 1,
        partes[0]
    );

}


/* =========================================================
   FORMATAR TEXTO
========================================================= */

function escaparHTML(texto) {

    if (texto === undefined || texto === null) {
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

    if (!activitiesList) return;


    activitiesList.innerHTML = "";


    /* Quantidade */

    if (resultsCount) {
        resultsCount.textContent = lista.length;
    }


    /* Nenhum resultado */

    if (lista.length === 0) {

        activitiesList.style.display = "none";

        if (emptyState) {
            emptyState.classList.add("show");
        }

        return;

    }


    activitiesList.style.display = "flex";

    if (emptyState) {
        emptyState.classList.remove("show");
    }


    /* Criar cards */

    lista.forEach(function (atividade) {

        const card =
            document.createElement("article");

        card.className = "activity-card";


        card.innerHTML = `

            <div class="activity-main">

                <div class="activity-top">

                    <span class="activity-date">
                        <i class="fa-regular fa-calendar"></i>
                        ${escaparHTML(atividade.data)}
                    </span>

                    <span class="activity-tag">
                        ${escaparHTML(atividade.turma)}
                    </span>

                </div>


                <h2>
                    ${escaparHTML(atividade.titulo)}
                </h2>


                <p class="activity-description">
                    ${escaparHTML(atividade.descricao)}
                </p>


                <div class="activity-meta">

                    <div class="activity-meta-item">

                        <i class="fa-solid fa-users"></i>

                        <span>
                            Turma:
                            <strong>
                                ${escaparHTML(atividade.turma)}
                            </strong>
                        </span>

                    </div>


                    <div class="activity-meta-item">

                        <i class="fa-regular fa-calendar-days"></i>

                        <span>
                            Período:
                            <strong>
                                ${escaparHTML(atividade.periodo)}
                            </strong>
                        </span>

                    </div>


                    <div class="activity-meta-item">

                        <i class="fa-regular fa-image"></i>

                        <span>
                            <strong>
                                ${atividade.fotos.length}
                            </strong>
                            ${atividade.fotos.length === 1 ? "foto" : "fotos"}
                        </span>

                    </div>

                </div>

            </div>


            <div class="activity-actions">

                <button
                    type="button"
                    class="activity-action"
                    title="Visualizar"
                    data-action="view"
                    data-id="${atividade.id}"
                >
                    <i class="fa-regular fa-eye"></i>
                </button>


                <button
                    type="button"
                    class="activity-action edit"
                    title="Editar"
                    data-action="edit"
                    data-id="${atividade.id}"
                >
                    <i class="fa-solid fa-pen"></i>
                </button>


                <button
                    type="button"
                    class="activity-action delete"
                    title="Excluir"
                    data-action="delete"
                    data-id="${atividade.id}"
                >
                    <i class="fa-regular fa-trash-can"></i>
                </button>

            </div>

        `;


        activitiesList.appendChild(card);

    });


    adicionarEventosCards();

}


/* =========================================================
   EVENTOS DOS CARDS
========================================================= */

function adicionarEventosCards() {

    const botoes =
        document.querySelectorAll(
            ".activity-action"
        );


    botoes.forEach(function (botao) {

        botao.addEventListener(
            "click",
            function () {

                const id =
                    Number(
                        botao.dataset.id
                    );

                const action =
                    botao.dataset.action;


                if (action === "view") {
                    abrirModal(id);
                }


                if (action === "edit") {
                    editarAtividade(id);
                }


                if (action === "delete") {
                    abrirConfirmacao(id);
                }

            }
        );

    });

}


/* =========================================================
   APLICAR FILTROS
========================================================= */

function aplicarFiltros() {

    const texto =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
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
        atividades.filter(function (atividade) {

            const correspondeTexto =

                atividade.titulo
                    .toLowerCase()
                    .includes(texto)

                ||

                atividade.descricao
                    .toLowerCase()
                    .includes(texto)

                ||

                atividade.turma
                    .toLowerCase()
                    .includes(texto);


            const correspondeTurma =
                !turma ||
                atividade.turma === turma;


            const correspondePeriodo =
                !periodo ||
                atividade.periodo === periodo;


            return (
                correspondeTexto &&
                correspondeTurma &&
                correspondePeriodo
            );

        });


    /* =====================================================
       ORDENAÇÃO
    ===================================================== */

    const ordem =
        sortFilter
            ? sortFilter.value
            : "recent";


    if (ordem === "recent") {

        resultado.sort(function (a, b) {

            return converterData(b.data)
                - converterData(a.data);

        });

    }


    if (ordem === "oldest") {

        resultado.sort(function (a, b) {

            return converterData(a.data)
                - converterData(b.data);

        });

    }


    if (ordem === "title") {

        resultado.sort(function (a, b) {

            return a.titulo.localeCompare(
                b.titulo,
                "pt-BR"
            );

        });

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

    if (sortFilter) {
        sortFilter.value = "recent";
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
   MODAL DE ATIVIDADE
========================================================= */

const activityModal =
    document.getElementById("activityModal");

const modalClose =
    document.getElementById("modalClose");

const modalCloseBottom =
    document.getElementById("modalCloseBottom");

const modalTitle =
    document.getElementById("modalTitle");

const modalDate =
    document.getElementById("modalDate");

const modalTurma =
    document.getElementById("modalTurma");

const modalPeriodo =
    document.getElementById("modalPeriodo");

const modalDescription =
    document.getElementById("modalDescription");

const modalObservation =
    document.getElementById("modalObservation");

const modalObservationSection =
    document.getElementById(
        "modalObservationSection"
    );

const modalGallery =
    document.getElementById("modalGallery");

const evidenceCount =
    document.getElementById("evidenceCount");

const modalEdit =
    document.getElementById("modalEdit");


/* Atividade atualmente aberta */

let atividadeSelecionada = null;


/* =========================================================
   ABRIR MODAL
========================================================= */

function abrirModal(id) {

    const atividade =
        atividades.find(
            item => item.id === id
        );


    if (!atividade || !activityModal) {
        return;
    }


    atividadeSelecionada = atividade;


    if (modalTitle) {
        modalTitle.textContent =
            atividade.titulo;
    }


    if (modalDate) {
        modalDate.textContent =
            atividade.data;
    }


    if (modalTurma) {
        modalTurma.textContent =
            atividade.turma;
    }


    if (modalPeriodo) {
        modalPeriodo.textContent =
            atividade.periodo;
    }


    if (modalDescription) {
        modalDescription.textContent =
            atividade.descricao;
    }


    /* Observação */

    if (modalObservation) {

        modalObservation.textContent =
            atividade.observacao || "Nenhuma observação.";

    }


    if (modalObservationSection) {

        modalObservationSection.style.display =
            atividade.observacao
                ? "block"
                : "none";

    }


    /* Galeria */

    if (modalGallery) {

        modalGallery.innerHTML = "";


        if (
            atividade.fotos &&
            atividade.fotos.length > 0
        ) {

            atividade.fotos.forEach(
                function (foto) {

                    const item =
                        document.createElement("div");

                    item.className =
                        "gallery-item";


                    const img =
                        document.createElement("img");

                    img.src = foto;

                    img.alt =
                        "Evidência da atividade";

                    img.loading = "lazy";


                    img.onerror =
                        function () {

                            item.innerHTML = `
                                <div style="
                                    width:100%;
                                    height:100%;
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    color:#8B91A0;
                                    font-size:12px;
                                    text-align:center;
                                    padding:10px;
                                ">
                                    <i class="fa-regular fa-image"
                                       style="font-size:22px;margin-right:7px;">
                                    </i>
                                    Imagem não encontrada
                                </div>
                            `;

                        };


                    item.appendChild(img);

                    modalGallery.appendChild(item);

                }
            );

        } else {

            modalGallery.innerHTML = `
                <div style="
                    grid-column:1/-1;
                    padding:30px;
                    text-align:center;
                    color:#858B9A;
                    font-size:13px;
                ">
                    Nenhuma evidência cadastrada.
                </div>
            `;

        }

    }


    if (evidenceCount) {

        const quantidade =
            atividade.fotos
                ? atividade.fotos.length
                : 0;

        evidenceCount.textContent =
            quantidade === 1
                ? "1 foto"
                : `${quantidade} fotos`;

    }


    activityModal.classList.add("show");

    document.body.style.overflow = "hidden";

}


/* =========================================================
   FECHAR MODAL
========================================================= */

function fecharModal() {

    if (!activityModal) return;

    activityModal.classList.remove("show");

    document.body.style.overflow = "";

    atividadeSelecionada = null;

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


/* Fechar clicando fora */

if (activityModal) {

    activityModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                activityModal
            ) {

                fecharModal();

            }

        }
    );

}


/* =========================================================
   EDITAR ATIVIDADE
========================================================= */

function editarAtividade(id) {

    const atividade =
        atividades.find(
            item => item.id === id
        );


    if (!atividade) return;


    /*
       Página de edição.
       Caso você ainda não tenha uma página
       específica, podemos criar depois.
    */

    window.location.href =
        `registrar-atividade.html?id=${atividade.id}`;

}


/* Botão editar dentro do modal */

if (modalEdit) {

    modalEdit.addEventListener(
        "click",
        function () {

            if (!atividadeSelecionada) {
                return;
            }

            editarAtividade(
                atividadeSelecionada.id
            );

        }
    );

}


/* =========================================================
   MODAL DE CONFIRMAÇÃO
========================================================= */

const confirmModal =
    document.getElementById("confirmModal");

const cancelDelete =
    document.getElementById("cancelDelete");

const confirmDelete =
    document.getElementById("confirmDelete");


let atividadeParaExcluir = null;


/* =========================================================
   ABRIR CONFIRMAÇÃO
========================================================= */

function abrirConfirmacao(id) {

    const atividade =
        atividades.find(
            item => item.id === id
        );


    if (!atividade || !confirmModal) {
        return;
    }


    atividadeParaExcluir = atividade;

    confirmModal.classList.add("show");

    document.body.style.overflow = "hidden";

}


/* =========================================================
   FECHAR CONFIRMAÇÃO
========================================================= */

function fecharConfirmacao() {

    if (!confirmModal) return;

    confirmModal.classList.remove("show");

    document.body.style.overflow = "";

    atividadeParaExcluir = null;

}


if (cancelDelete) {

    cancelDelete.addEventListener(
        "click",
        fecharConfirmacao
    );

}


/* =========================================================
   CONFIRMAR EXCLUSÃO
========================================================= */

if (confirmDelete) {

    confirmDelete.addEventListener(
        "click",
        function () {

            if (!atividadeParaExcluir) {
                return;
            }


            const id =
                atividadeParaExcluir.id;


            atividades =
                atividades.filter(
                    atividade =>
                        atividade.id !== id
                );


            fecharConfirmacao();


            preencherFiltros();

            aplicarFiltros();

        }
    );

}


/* Fechar confirmação clicando fora */

if (confirmModal) {

    confirmModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                confirmModal
            ) {

                fecharConfirmacao();

            }

        }
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

            fecharConfirmacao();

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
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
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
                    "Deseja realmente sair do sistema?"
                );


            if (!confirmar) {
                return;
            }


            /*
               Limpa dados de sessão,
               caso estejam sendo utilizados.
            */

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
   REDIMENSIONAMENTO
========================================================= */

window.addEventListener(
    "resize",
    function () {

        /*
           Se voltar para desktop,
           fecha o menu mobile.
        */

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
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }

            }

        }

    }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        preencherFiltros();

        aplicarFiltros();

    }
);