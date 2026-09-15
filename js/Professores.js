/* =========================================================
   MENU MOBILE
========================================================= */

const menuMobile = document.getElementById("menuMobile");
const mobileNav = document.getElementById("mobileNav");

if (menuMobile && mobileNav) {

    menuMobile.addEventListener("click", function () {

        mobileNav.classList.toggle("open");

        const aberto = mobileNav.classList.contains("open");

        menuMobile.setAttribute(
            "aria-expanded",
            aberto
        );

        const icon = menuMobile.querySelector("i");

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

}


/* =========================================================
   ELEMENTOS
========================================================= */

const searchProfessor =
    document.getElementById("searchProfessor");

const statusFilter =
    document.getElementById("statusFilter");

const courseFilter =
    document.getElementById("courseFilter");

const clearFilters =
    document.getElementById("clearFilters");

const sortProfessor =
    document.getElementById("sortProfessor");

const professorsList =
    document.getElementById("professorsList");

const resultCount =
    document.getElementById("resultCount");

const resultDescription =
    document.getElementById("resultDescription");

const emptyState =
    document.getElementById("emptyState");


/* =========================================================
   FILTRAR PROFESSORES
========================================================= */

function filtrarProfessores() {

    const busca =
        searchProfessor.value
            .trim()
            .toLowerCase();

    const status =
        statusFilter.value;

    const curso =
        courseFilter.value;

    const professores =
        Array.from(
            professorsList.querySelectorAll(".professor-item")
        );

    let encontrados = 0;


    professores.forEach(function (professor) {

        const nome =
            professor.dataset.name.toLowerCase();

        const email =
            professor.dataset.email.toLowerCase();

        const statusProfessor =
            professor.dataset.status;

        const cursoProfessor =
            professor.dataset.course;


        const correspondeBusca =
            nome.includes(busca) ||
            email.includes(busca);


        const correspondeStatus =
            status === "todos" ||
            statusProfessor === status;


        const correspondeCurso =
            curso === "todos" ||
            cursoProfessor === curso;


        const mostrar =
            correspondeBusca &&
            correspondeStatus &&
            correspondeCurso;


        if (mostrar) {

            professor.style.display = "";

            encontrados++;

        } else {

            professor.style.display = "none";

        }

    });


    resultCount.textContent =
        `(${encontrados})`;


    resultDescription.textContent =
        encontrados === 1
            ? "1 professor encontrado"
            : `${encontrados} professores encontrados`;


    if (encontrados === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }

}


/* =========================================================
   ORDENAR
========================================================= */

function ordenarProfessores() {

    const valor =
        sortProfessor.value;

    const professores =
        Array.from(
            professorsList.querySelectorAll(".professor-item")
        );


    professores.sort(function (a, b) {

        if (valor === "nome") {

            return a.dataset.name
                .localeCompare(
                    b.dataset.name,
                    "pt-BR"
                );

        }


        if (valor === "nome-desc") {

            return b.dataset.name
                .localeCompare(
                    a.dataset.name,
                    "pt-BR"
                );

        }


        if (valor === "registros") {

            return Number(b.dataset.registros) -
                   Number(a.dataset.registros);

        }


        return 0;

    });


    professores.forEach(function (professor) {

        professorsList.appendChild(professor);

    });

}


/* =========================================================
   EVENTOS DOS FILTROS
========================================================= */

if (searchProfessor) {

    searchProfessor.addEventListener(
        "input",
        filtrarProfessores
    );

}

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        filtrarProfessores
    );

}

if (courseFilter) {

    courseFilter.addEventListener(
        "change",
        filtrarProfessores
    );

}

if (sortProfessor) {

    sortProfessor.addEventListener(
        "change",
        function () {

            ordenarProfessores();

            filtrarProfessores();

        }
    );

}


/* =========================================================
   LIMPAR FILTROS
========================================================= */

if (clearFilters) {

    clearFilters.addEventListener(
        "click",
        function () {

            searchProfessor.value = "";

            statusFilter.value = "todos";

            courseFilter.value = "todos";

            sortProfessor.value = "nome";

            ordenarProfessores();

            filtrarProfessores();

        }
    );

}


/* =========================================================
   MODAL
========================================================= */

const professorModal =
    document.getElementById("professorModal");

const modalClose =
    document.getElementById("modalClose");

const modalCloseFooter =
    document.getElementById("modalCloseFooter");

const modalProfessorName =
    document.getElementById("modalProfessorName");

const modalProfessorEmail =
    document.getElementById("modalProfessorEmail");

const modalAvatar =
    document.getElementById("modalAvatar");

const modalCourse =
    document.getElementById("modalCourse");

const modalRecords =
    document.getElementById("modalRecords");

const modalDate =
    document.getElementById("modalDate");

const viewRecordsBtn =
    document.getElementById("viewRecordsBtn");


/* =========================================================
   ABRIR MODAL
========================================================= */

function abrirModal(professor) {

    const nome =
        professor.dataset.name;

    const email =
        professor.dataset.email;

    const curso =
        professor.dataset.course;

    const registros =
        professor.dataset.registros;

    const avatar =
        nome
            .split(" ")
            .map(function (parte) {
                return parte.charAt(0);
            })
            .slice(0, 2)
            .join("")
            .toUpperCase();


    modalProfessorName.textContent =
        nome;

    modalProfessorEmail.textContent =
        email;

    modalAvatar.textContent =
        avatar;

    modalCourse.textContent =
        curso.charAt(0).toUpperCase() +
        curso.slice(1);

    modalRecords.textContent =
        `${registros} atividades`;


    const ultimoRegistro =
        professor.querySelector(
            ".professor-date strong"
        );

    if (ultimoRegistro) {

        modalDate.textContent =
            ultimoRegistro.textContent;

    }


    professorModal.classList.add("open");

    document.body.style.overflow = "hidden";

}


/* =========================================================
   BOTÕES VER REGISTROS
========================================================= */

const viewButtons =
    document.querySelectorAll(".view-btn");

viewButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const professor =
                button.closest(".professor-item");

            if (professor) {

                abrirModal(professor);

            }

        }
    );

});


/* =========================================================
   FECHAR MODAL
========================================================= */

function fecharModal() {

    professorModal.classList.remove("open");

    document.body.style.overflow = "";

}


if (modalClose) {

    modalClose.addEventListener(
        "click",
        fecharModal
    );

}

if (modalCloseFooter) {

    modalCloseFooter.addEventListener(
        "click",
        fecharModal
    );

}


if (professorModal) {

    professorModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === professorModal
            ) {

                fecharModal();

            }

        }
    );

}


/* =========================================================
   ESC FECHA MODAL
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            professorModal.classList.contains("open")
        ) {

            fecharModal();

        }

    }
);


/* =========================================================
   VER REGISTROS COMPLETOS
========================================================= */

if (viewRecordsBtn) {

    viewRecordsBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "pesquisarRegistros.html";

        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "../index.html";

        }
    );

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

ordenarProfessores();
filtrarProfessores();