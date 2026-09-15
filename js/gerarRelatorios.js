/* =========================================================
   DOCSENAI
   GERAR RELATÓRIO - SUPERVISÃO
========================================================= */


/* =========================================================
   DADOS DE EXEMPLO
========================================================= */

const atividades = [

    {
        id: 1,
        data: "24/05/2026",
        professor: "João Silva",
        turma: "3º Informática A",
        turmaId: "informatica-a",
        curso: "informatica",
        descricao: "Atividade prática de HTML e CSS"
    },

    {
        id: 2,
        data: "25/05/2026",
        professor: "Maria Santos",
        turma: "2º Informática B",
        turmaId: "informatica-b",
        curso: "informatica",
        descricao: "Projeto de Banco de Dados"
    },

    {
        id: 3,
        data: "26/05/2026",
        professor: "João Silva",
        turma: "3º Informática A",
        turmaId: "informatica-a",
        curso: "informatica",
        descricao: "Aula sobre Segurança da Informação"
    },

    {
        id: 4,
        data: "27/05/2026",
        professor: "Ana Oliveira",
        turma: "Desenvolvimento Web",
        turmaId: "desenvolvimento",
        curso: "desenvolvimento-web",
        descricao: "Estruturação de páginas responsivas"
    },

    {
        id: 5,
        data: "28/05/2026",
        professor: "João Silva",
        turma: "3º Informática A",
        turmaId: "informatica-a",
        curso: "informatica",
        descricao: "Introdução ao JavaScript"
    },

    {
        id: 6,
        data: "29/05/2026",
        professor: "Maria Santos",
        turma: "2º Informática B",
        turmaId: "informatica-b",
        curso: "informatica",
        descricao: "Modelagem de dados"
    }

];


/* =========================================================
   ELEMENTOS
========================================================= */

const activitiesList =
    document.getElementById("activitiesList");

const activitiesCount =
    document.getElementById("activitiesCount");

const selectedInfo =
    document.getElementById("selectedInfo");

const summaryText =
    document.getElementById("summaryText");

const noResults =
    document.getElementById("noResults");

const selectAllInput =
    document.getElementById("selectAllInput");

const professor =
    document.getElementById("professor");

const turma =
    document.getElementById("turma");

const curso =
    document.getElementById("curso");

const dataInicio =
    document.getElementById("dataInicio");

const dataFim =
    document.getElementById("dataFim");

const tituloRelatorio =
    document.getElementById("tituloRelatorio");

const btnGerar =
    document.getElementById("btnGerar");

const btnLogout =
    document.getElementById("btnLogout");


/* =========================================================
   RENDERIZAR
========================================================= */

function renderizarAtividades(lista) {

    activitiesList.innerHTML = "";


    activitiesCount.textContent =
        lista.length;


    if (lista.length === 0) {

        noResults.classList.add("visible");

        atualizarResumo();

        return;

    }


    noResults.classList.remove("visible");


    lista.forEach(atividade => {

        const row =
            document.createElement("label");


        row.className = "activity-row";


        row.innerHTML = `

            <input
                type="checkbox"
                class="activity-checkbox"
                value="${atividade.id}"
                checked
            >


            <span class="custom-checkbox">

                <i class="fa-solid fa-check"></i>

            </span>


            <div class="activity-content">

                <div class="activity-main">

                    <span class="activity-date">
                        ${atividade.data}
                    </span>


                    <span class="activity-separator">
                        •
                    </span>


                    <span class="activity-professor">
                        ${atividade.professor}
                    </span>


                    <span class="activity-class">
                        ${atividade.turma}
                    </span>

                </div>


                <div class="activity-info">

                    ${atividade.descricao}

                </div>

            </div>

        `;


        activitiesList.appendChild(row);

    });


    adicionarEventosCheckbox();

    atualizarResumo();

}


/* =========================================================
   CHECKBOXES
========================================================= */

function adicionarEventosCheckbox() {

    const checkboxes =
        document.querySelectorAll(
            ".activity-checkbox"
        );


    checkboxes.forEach(checkbox => {

        checkbox.addEventListener(
            "change",
            function () {

                atualizarResumo();

            }
        );

    });

}


/* =========================================================
   ATUALIZAR RESUMO
========================================================= */

function atualizarResumo() {

    const checkboxes =
        document.querySelectorAll(
            ".activity-checkbox"
        );


    const selecionadas =
        Array.from(checkboxes)
            .filter(
                checkbox =>
                    checkbox.checked
            );


    const quantidade =
        selecionadas.length;


    selectedInfo.textContent =
        `${quantidade} ${
            quantidade === 1
                ? "selecionada"
                : "selecionadas"
        }`;


    summaryText.textContent =
        `${quantidade} ${
            quantidade === 1
                ? "atividade será incluída"
                : "atividades serão incluídas"
        } no PDF.`;


    atualizarSelecionarTodos();

}


/* =========================================================
   SELECIONAR TODAS
========================================================= */

function atualizarSelecionarTodos() {

    const checkboxes =
        document.querySelectorAll(
            ".activity-checkbox"
        );


    if (checkboxes.length === 0) {

        selectAllInput.checked = false;

        return;

    }


    selectAllInput.checked =
        Array.from(checkboxes)
            .every(
                checkbox =>
                    checkbox.checked
            );

}


selectAllInput.addEventListener(
    "change",
    function () {

        const checkboxes =
            document.querySelectorAll(
                ".activity-checkbox"
            );


        checkboxes.forEach(checkbox => {

            checkbox.checked =
                selectAllInput.checked;

        });


        atualizarResumo();

    }
);


/* =========================================================
   FILTROS
========================================================= */

function filtrarAtividades() {

    let resultado =
        [...atividades];


    /* PROFESSOR */

    if (professor.value) {

        const nomes = {

            joao: "João Silva",

            maria: "Maria Santos",

            ana: "Ana Oliveira"

        };


        resultado =
            resultado.filter(
                atividade =>
                    atividade.professor ===
                    nomes[professor.value]
            );

    }


    /* TURMA */

    if (turma.value) {

        resultado =
            resultado.filter(
                atividade =>
                    atividade.turmaId ===
                    turma.value
            );

    }


    /* CURSO */

    if (curso.value) {

        resultado =
            resultado.filter(
                atividade =>
                    atividade.curso ===
                    curso.value
            );

    }


    /* DATA */

    if (dataInicio.value) {

        const inicio =
            new Date(
                dataInicio.value +
                "T00:00:00"
            );


        resultado =
            resultado.filter(
                atividade => {

                    const partes =
                        atividade.data.split("/");


                    const data =
                        new Date(
                            partes[2],
                            partes[1] - 1,
                            partes[0]
                        );


                    return data >= inicio;

                }
            );

    }


    if (dataFim.value) {

        const fim =
            new Date(
                dataFim.value +
                "T23:59:59"
            );


        resultado =
            resultado.filter(
                atividade => {

                    const partes =
                        atividade.data.split("/");


                    const data =
                        new Date(
                            partes[2],
                            partes[1] - 1,
                            partes[0]
                        );


                    return data <= fim;

                }
            );

    }


    renderizarAtividades(resultado);

}


/* =========================================================
   EVENTOS DOS FILTROS
========================================================= */

professor.addEventListener(
    "change",
    filtrarAtividades
);


turma.addEventListener(
    "change",
    filtrarAtividades
);


curso.addEventListener(
    "change",
    filtrarAtividades
);


dataInicio.addEventListener(
    "change",
    filtrarAtividades
);


dataFim.addEventListener(
    "change",
    filtrarAtividades
);


/* =========================================================
   GERAR RELATÓRIO
========================================================= */

btnGerar.addEventListener(
    "click",
    function () {

        const titulo =
            tituloRelatorio.value.trim();


        if (!titulo) {

            alert(
                "Digite um título para o relatório."
            );

            tituloRelatorio.focus();

            return;

        }


        if (
            !dataInicio.value ||
            !dataFim.value
        ) {

            alert(
                "Informe o período do relatório."
            );

            return;

        }


        if (
            new Date(dataInicio.value) >
            new Date(dataFim.value)
        ) {

            alert(
                "A data inicial não pode ser maior que a data final."
            );

            return;

        }


        const checkboxes =
            document.querySelectorAll(
                ".activity-checkbox"
            );


        const selecionadas =
            Array.from(checkboxes)
                .filter(
                    checkbox =>
                        checkbox.checked
                )
                .map(
                    checkbox =>
                        Number(
                            checkbox.value
                        )
                );


        if (
            selecionadas.length === 0
        ) {

            alert(
                "Selecione pelo menos uma atividade."
            );

            return;

        }


        const dadosRelatorio = {

            titulo: titulo,

            professor:
                professor.value,

            turma:
                turma.value,

            curso:
                curso.value,

            periodoInicio:
                dataInicio.value,

            periodoFim:
                dataFim.value,

            atividades:
                selecionadas

        };


        console.log(
            "Dados que serão enviados para a API:",
            dadosRelatorio
        );


        /*
         * FUTURA INTEGRAÇÃO COM C#
         *
         * fetch("/api/relatorios/gerar", {
         *
         *     method: "POST",
         *
         *     headers: {
         *         "Content-Type":
         *             "application/json"
         *     },
         *
         *     body:
         *         JSON.stringify(
         *             dadosRelatorio
         *         )
         *
         * })
         *
         */


        alert(
            `Relatório preparado com ${selecionadas.length} ${
                selecionadas.length === 1
                    ? "atividade"
                    : "atividades"
            } selecionadas.`
        );

    }
);


/* =========================================================
   LOGOUT
========================================================= */

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
   MENU MOBILE
========================================================= */

const menuMobile =
    document.getElementById(
        "menuMobile"
    );

const mobileNav =
    document.getElementById(
        "mobileNav"
    );


if (
    menuMobile &&
    mobileNav
) {

    menuMobile.addEventListener(
        "click",
        function () {

            const aberto =
                mobileNav.classList.toggle(
                    "show"
                );


            menuMobile.setAttribute(
                "aria-expanded",
                aberto
                    ? "true"
                    : "false"
            );


            const icon =
                menuMobile.querySelector(
                    "i"
                );


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

        }
    );


    mobileNav
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                function () {

                    mobileNav.classList.remove(
                        "show"
                    );


                    menuMobile.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    const icon =
                        menuMobile.querySelector(
                            "i"
                        );


                    if (icon) {

                        icon.classList.remove(
                            "fa-xmark"
                        );

                        icon.classList.add(
                            "fa-bars"
                        );

                    }

                }
            );

        });

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        filtrarAtividades();

    }
);