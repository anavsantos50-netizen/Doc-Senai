/* =====================================================
   DADOS DAS TURMAS
===================================================== */

const turmas = [
    {
        id: 1,
        nome: "Turma 2026.1",
        curso: "Informática",
        cursoFiltro: "informatica",
        periodo: "2026.1",
        turno: "Matutino",
        atividades: [
            {
                titulo: "Introdução ao Desenvolvimento Web",
                data: "05/09/2026"
            },
            {
                titulo: "Estrutura básica de páginas HTML",
                data: "08/09/2026"
            },
            {
                titulo: "Estilização com CSS",
                data: "10/09/2026"
            }
        ]
    },

    {
        id: 2,
        nome: "Turma 2026.2",
        curso: "Administração",
        cursoFiltro: "administracao",
        periodo: "2026.2",
        turno: "Vespertino",
        atividades: [
            {
                titulo: "Introdução à Administração",
                data: "04/09/2026"
            },
            {
                titulo: "Organização e Planejamento",
                data: "09/09/2026"
            }
        ]
    },

    {
        id: 3,
        nome: "Turma 2026.3",
        curso: "Mecânica",
        cursoFiltro: "mecanica",
        periodo: "2026.3",
        turno: "Noturno",
        atividades: [
            {
                titulo: "Introdução à Mecânica",
                data: "03/09/2026"
            },
            {
                titulo: "Segurança no ambiente de trabalho",
                data: "07/09/2026"
            },
            {
                titulo: "Ferramentas e equipamentos",
                data: "11/09/2026"
            }
        ]
    }
];


/* =====================================================
   ELEMENTOS DO DOM
===================================================== */

const classesGrid = document.getElementById("classesGrid");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");
const cursoFilter = document.getElementById("cursoFilter");

const clearFilters = document.getElementById("clearFilters");
const emptyClearBtn = document.getElementById("emptyClearBtn");

const resultsCount = document.getElementById("resultsCount");


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


    /* Fecha o menu ao clicar em algum link */

    const menuLinks = mainNav.querySelectorAll(".nav-link");

    menuLinks.forEach(link => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("open");

            const icon = menuMobile.querySelector("i");

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
   CRIAÇÃO DOS CARDS
===================================================== */

function renderTurmas(lista) {

    classesGrid.innerHTML = "";


    /* Nenhuma turma */

    if (lista.length === 0) {

        classesGrid.style.display = "none";

        emptyState.style.display = "block";

        resultsCount.textContent =
            "0 turmas encontradas";

        return;
    }


    /* Existem turmas */

    classesGrid.style.display = "grid";

    emptyState.style.display = "none";


    /* Quantidade */

    if (lista.length === 1) {

        resultsCount.textContent =
            "1 turma encontrada";

    } else {

        resultsCount.textContent =
            `${lista.length} turmas encontradas`;

    }


    /* Cards */

    lista.forEach(turma => {

        const quantidadeAtividades =
            turma.atividades.length;


        const card = document.createElement("article");

        card.className = "class-card";


        card.innerHTML = `

            <div class="class-icon">

                <i class="fa-solid fa-users"></i>

            </div>


            <h2>
                ${turma.nome}
            </h2>


            <p class="class-course">
                ${turma.curso}
            </p>


            <div class="class-details">

                <div class="class-detail">

                    <i class="fa-regular fa-calendar"></i>

                    <span>
                        Período: ${turma.periodo}
                    </span>

                </div>


                <div class="class-detail">

                    <i class="fa-regular fa-clock"></i>

                    <span>
                        Turno: ${turma.turno}
                    </span>

                </div>

            </div>


            <div class="class-card-footer">

                <span class="activity-badge">

                    <i class="fa-solid fa-file-lines"></i>

                    ${quantidadeAtividades}
                    ${quantidadeAtividades === 1
                        ? "atividade"
                        : "atividades"}

                </span>


                <button
                    type="button"
                    class="view-class-btn"
                    data-id="${turma.id}">

                    Ver turma

                    <i class="fa-solid fa-arrow-right"></i>

                </button>

            </div>

        `;


        classesGrid.appendChild(card);

    });


    /* Eventos dos botões */

    const buttons =
        document.querySelectorAll(".view-class-btn");


    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const id =
                Number(button.dataset.id);

            abrirModal(id);

        });

    });

}


/* =====================================================
   FILTROS
===================================================== */

function aplicarFiltros() {

    const texto =
        searchInput.value
            .trim()
            .toLowerCase();


    const curso =
        cursoFilter.value;


    const resultado =
        turmas.filter(turma => {

            const correspondeBusca =

                turma.nome
                    .toLowerCase()
                    .includes(texto)

                ||

                turma.curso
                    .toLowerCase()
                    .includes(texto);


            const correspondeCurso =

                curso === "todos"

                ||

                turma.cursoFiltro === curso;


            return
                correspondeBusca &&
                correspondeCurso;

        });


    renderTurmas(resultado);

}


/* =====================================================
   BUSCA
===================================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        aplicarFiltros
    );

}


/* =====================================================
   FILTRO DE CURSO
===================================================== */

if (cursoFilter) {

    cursoFilter.addEventListener(
        "change",
        aplicarFiltros
    );

}


/* =====================================================
   LIMPAR FILTROS
===================================================== */

function limparFiltros() {

    searchInput.value = "";

    cursoFilter.value = "todos";

    renderTurmas(turmas);

}


if (clearFilters) {

    clearFilters.addEventListener(
        "click",
        limparFiltros
    );

}


if (emptyClearBtn) {

    emptyClearBtn.addEventListener(
        "click",
        limparFiltros
    );

}


/* =====================================================
   MODAL
===================================================== */

const classModal =
    document.getElementById("classModal");

const modalClose =
    document.getElementById("modalClose");

const modalCloseBottom =
    document.getElementById("modalCloseBottom");


const modalTitle =
    document.getElementById("modalTitle");

const modalCourse =
    document.getElementById("modalCourse");

const modalCourseInfo =
    document.getElementById("modalCourseInfo");

const modalPeriod =
    document.getElementById("modalPeriod");

const modalShift =
    document.getElementById("modalShift");

const modalActivities =
    document.getElementById("modalActivities");

const modalActivitiesList =
    document.getElementById("modalActivitiesList");


/* =====================================================
   ABRIR MODAL
===================================================== */

function abrirModal(id) {

    const turma =
        turmas.find(item => item.id === id);


    if (!turma) {
        return;
    }


    /* Informações */

    modalTitle.textContent =
        turma.nome;

    modalCourse.textContent =
        turma.curso;

    modalCourseInfo.textContent =
        turma.curso;

    modalPeriod.textContent =
        turma.periodo;

    modalShift.textContent =
        turma.turno;


    /* Quantidade */

    const quantidade =
        turma.atividades.length;


    modalActivities.textContent =
        quantidade === 1
            ? "1 atividade"
            : `${quantidade} atividades`;


    /* Lista */

    modalActivitiesList.innerHTML = "";


    if (turma.atividades.length === 0) {

        modalActivitiesList.innerHTML = `

            <div class="modal-empty">

                <i class="fa-regular fa-folder-open"></i>

                <span>
                    Nenhuma atividade registrada.
                </span>

            </div>

        `;

    } else {

        turma.atividades.forEach(atividade => {

            const data =
                formatarData(atividade.data);


            const item =
                document.createElement("div");


            item.className =
                "modal-activity";


            item.innerHTML = `

                <div class="modal-activity-date">

                    <strong>
                        ${data.dia}
                    </strong>

                    <span>
                        ${data.mes}
                    </span>

                </div>


                <div class="modal-activity-info">

                    <strong>
                        ${atividade.titulo}
                    </strong>

                    <span>
                        Registrada em ${atividade.data}
                    </span>

                </div>

            `;


            modalActivitiesList.appendChild(item);

        });

    }


    /* Abre */

    classModal.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   FORMATAR DATA
===================================================== */

function formatarData(data) {

    const partes =
        data.split("/");


    if (partes.length !== 3) {

        return {
            dia: "--",
            mes: "---"
        };

    }


    const dia =
        partes[0];

    const mesNumero =
        Number(partes[1]);


    const meses = [
        "JAN",
        "FEV",
        "MAR",
        "ABR",
        "MAI",
        "JUN",
        "JUL",
        "AGO",
        "SET",
        "OUT",
        "NOV",
        "DEZ"
    ];


    return {

        dia: dia,

        mes:
            meses[mesNumero - 1] || "---"

    };

}


/* =====================================================
   FECHAR MODAL
===================================================== */

function fecharModal() {

    classModal.classList.remove("show");

    document.body.style.overflow =
        "";

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


/* =====================================================
   FECHAR CLICANDO FORA
===================================================== */

if (classModal) {

    classModal.addEventListener(
        "click",
        event => {

            if (
                event.target === classModal
            ) {

                fecharModal();

            }

        }
    );

}


/* =====================================================
   FECHAR COM ESC
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            classModal.classList.contains("show")
        ) {

            fecharModal();

        }

    }
);


/* =====================================================
   LOGOUT
===================================================== */

const btnLogout =
    document.getElementById("btnLogout");


if (btnLogout) {

    btnLogout.addEventListener(
        "click",
        () => {

            const confirmar =
                confirm(
                    "Deseja realmente sair do sistema?"
                );


            if (!confirmar) {
                return;
            }


            /*
             * Limpa os dados da sessão
             * utilizados no projeto.
             */

            localStorage.clear();

            sessionStorage.clear();


            /* Redireciona para o login */

            window.location.href =
                "login.html";

        }
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

renderTurmas(turmas);