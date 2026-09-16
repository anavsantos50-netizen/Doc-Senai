/* =========================================================
   CONFIGURAÇÃO DA API
========================================================= */

const API_URL =
    "https://localhost:7082/api";


/* =========================================================
   VARIÁVEIS
========================================================= */

let professores = [];

let turmas = [];

let professorSelecionado = null;


/* =========================================================
   MENU MOBILE
========================================================= */

const menuMobile =
    document.getElementById("menuMobile");

const mobileNav =
    document.getElementById("mobileNav");


if (menuMobile && mobileNav) {

    menuMobile.addEventListener(
        "click",
        function () {

            mobileNav.classList.toggle(
                "open"
            );


            const aberto =
                mobileNav.classList.contains(
                    "open"
                );


            menuMobile.setAttribute(
                "aria-expanded",
                aberto
            );


            const icon =
                menuMobile.querySelector(
                    "i"
                );


            if (icon) {

                if (aberto) {

                    icon.classList.remove(
                        "fa-bars"
                    );

                    icon.classList.add(
                        "fa-xmark"
                    );

                } else {

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

}


/* =========================================================
   ELEMENTOS
========================================================= */

const searchProfessor =
    document.getElementById(
        "searchProfessor"
    );


const statusFilter =
    document.getElementById(
        "statusFilter"
    );


const courseFilter =
    document.getElementById(
        "courseFilter"
    );


const clearFilters =
    document.getElementById(
        "clearFilters"
    );


const sortProfessor =
    document.getElementById(
        "sortProfessor"
    );


const professorsList =
    document.getElementById(
        "professorsList"
    );


const resultCount =
    document.getElementById(
        "resultCount"
    );


const resultDescription =
    document.getElementById(
        "resultDescription"
    );


const emptyState =
    document.getElementById(
        "emptyState"
    );


/* =========================================================
   RESUMO
========================================================= */

const totalProfessores =
    document.getElementById(
        "totalProfessores"
    );


const professoresAtivos =
    document.getElementById(
        "professoresAtivos"
    );


const totalVinculos =
    document.getElementById(
        "totalVinculos"
    );


const professoresComTurma =
    document.getElementById(
        "professoresComTurma"
    );


/* =========================================================
   MODAL PROFESSOR
========================================================= */

const professorModal =
    document.getElementById(
        "professorModal"
    );


const modalClose =
    document.getElementById(
        "modalClose"
    );


const modalCloseFooter =
    document.getElementById(
        "modalCloseFooter"
    );


const modalProfessorName =
    document.getElementById(
        "modalProfessorName"
    );


const modalProfessorEmail =
    document.getElementById(
        "modalProfessorEmail"
    );


const modalAvatar =
    document.getElementById(
        "modalAvatar"
    );


const modalCourse =
    document.getElementById(
        "modalCourse"
    );


const modalRecords =
    document.getElementById(
        "modalRecords"
    );


const modalDate =
    document.getElementById(
        "modalDate"
    );


const modalStatus =
    document.getElementById(
        "modalStatus"
    );


const linkedClassesList =
    document.getElementById(
        "linkedClassesList"
    );


const modalAddClass =
    document.getElementById(
        "modalAddClass"
    );


/* =========================================================
   MODAL TURMA
========================================================= */

const turmaModal =
    document.getElementById(
        "turmaModal"
    );


const turmaModalClose =
    document.getElementById(
        "turmaModalClose"
    );


const turmaCancelar =
    document.getElementById(
        "turmaCancelar"
    );


const turmaProfessorNome =
    document.getElementById(
        "turmaProfessorNome"
    );


const turmaSelect =
    document.getElementById(
        "turmaSelect"
    );


const turmaSalvar =
    document.getElementById(
        "turmaSalvar"
    );


const turmaMessage =
    document.getElementById(
        "turmaMessage"
    );


/* =========================================================
   OBTER ID
========================================================= */

function obterIdProfessor(professor) {

    return Number(
        professor.dataset.id
    );

}


/* =========================================================
   AVATAR
========================================================= */

function gerarAvatar(nome) {

    return nome
        .trim()
        .split(/\s+/)
        .map(function (parte) {

            return parte
                .charAt(0)
                .toUpperCase();

        })
        .slice(0, 2)
        .join("");

}


/* =========================================================
   FORMATAR TURNO
========================================================= */

function formatarTurno(turno) {

    if (!turno) {

        return "";

    }


    return turno
        .toString()
        .charAt(0)
        .toUpperCase() +
        turno
            .toString()
            .slice(1);

}


/* =========================================================
   FORMATAR PERÍODO
========================================================= */

function formatarPeriodo(periodo) {

    if (!periodo) {

        return "";

    }


    const data =
        new Date(periodo);


    if (isNaN(data.getTime())) {

        return periodo;

    }


    return data.toLocaleDateString(
        "pt-BR"
    );

}


/* =========================================================
   CARREGAR PROFESSORES
========================================================= */

async function carregarProfessores() {

    try {

        const response =
            await fetch(
                `${API_URL}/ProfessorTurma/professores`
            );


        if (!response.ok) {

            throw new Error(
                "Erro ao carregar professores."
            );

        }


        const dados =
            await response.json();


        professores =
            dados.map(function (professor) {

                return {

                    id:
                        professor.id_usuario ??
                        professor.idUsuario ??
                        professor.Id_Usuario,

                    nome:
                        professor.nome ??
                        professor.Nome,

                    email:
                        professor.email ??
                        professor.Email,

                    status:
                        "ativo",

                    curso:
                        "todos",

                    registros:
                        0,

                    ultimoRegistro:
                        "-",

                    turmas:
                        []

                };

            });


        await carregarVinculosProfessores();


        montarFiltroCursos();

        renderizarProfessores();

        atualizarResumo();


    } catch (error) {

        console.error(error);


        professorsList.innerHTML = "";


        resultDescription.textContent =
            "Não foi possível carregar os professores.";


        emptyState.style.display =
            "block";


        emptyState.querySelector(
            "h3"
        ).textContent =
            "Erro ao carregar professores";


        emptyState.querySelector(
            "p"
        ).textContent =
            "Verifique se a API está executando.";

    }

}


/* =========================================================
   CARREGAR VÍNCULOS
========================================================= */

async function carregarVinculosProfessores() {

    for (
        const professor
        of professores
    ) {

        try {

            const response =
                await fetch(
                    `${API_URL}/ProfessorTurma/professor/${professor.id}`
                );


            if (!response.ok) {

                continue;

            }


            const dados =
                await response.json();


            professor.turmas =
                dados || [];


        } catch (error) {

            console.error(
                `Erro ao carregar turmas do professor ${professor.id}:`,
                error
            );

            professor.turmas = [];

        }

    }

}


/* =========================================================
   FILTRO DE CURSOS
========================================================= */

function montarFiltroCursos() {

    if (!courseFilter) {

        return;

    }


    const cursos =
        new Set();


    professores.forEach(function (professor) {

        professor.turmas.forEach(
            function (turma) {

                if (turma.curso) {

                    cursos.add(
                        turma.curso
                    );

                }

            }
        );

    });


    courseFilter.innerHTML =
        `<option value="todos">
            Todos os cursos
        </option>`;


    Array.from(cursos)
        .sort(function (a, b) {

            return a.localeCompare(
                b,
                "pt-BR"
            );

        })
        .forEach(function (curso) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                curso;


            option.textContent =
                curso;


            courseFilter.appendChild(
                option
            );

        });

}


/* =========================================================
   CURSO PRINCIPAL
========================================================= */

function obterCursoProfessor(professor) {

    if (
        !professor.turmas ||
        professor.turmas.length === 0
    ) {

        return "Sem turma";

    }


    if (
        professor.turmas.length === 1
    ) {

        return (
            professor.turmas[0].curso ||
            "Sem curso"
        );

    }


    return `${professor.turmas.length} turmas`;

}


/* =========================================================
   CRIAR CARD DO PROFESSOR
========================================================= */

function criarProfessorHTML(professor, indice) {

    const avatar =
        gerarAvatar(
            professor.nome
        );


    const curso =
        obterCursoProfessor(
            professor
        );


    const quantidadeTurmas =
        professor.turmas.length;


    const status =
        professor.status;


    const classeAvatar =
        [
            "avatar-blue",
            "avatar-orange",
            "avatar-purple",
            "avatar-green"
        ][indice % 4];


    return `

        <article
            class="professor-item"
            data-id="${professor.id}"
            data-name="${escapeHTML(professor.nome)}"
            data-email="${escapeHTML(professor.email)}"
            data-status="${status}"
            data-course="${escapeHTML(curso)}"
            data-registros="${professor.registros}"
        >


            <!-- AVATAR -->

            <div class="professor-avatar ${classeAvatar}">

                ${avatar}

            </div>


            <!-- INFORMAÇÕES -->

            <div class="professor-main">

                <div class="professor-name">

                    <h3>
                        ${escapeHTML(professor.nome)}
                    </h3>


                    <span
                        class="status-tag ${status === "ativo" ? "active" : "inactive"}"
                    >

                        <i class="fa-solid fa-circle"></i>

                        ${status === "ativo" ? "Ativo" : "Inativo"}

                    </span>

                </div>


                <div class="professor-email">

                    <i class="fa-regular fa-envelope"></i>

                    ${escapeHTML(professor.email)}

                </div>

            </div>


            <!-- TURMAS -->

            <div class="professor-data">

                <span class="data-label">
                    Turmas
                </span>

                <strong>
                    ${quantidadeTurmas}
                </strong>

            </div>


            <!-- CURSO -->

            <div class="professor-data">

                <span class="data-label">
                    Curso
                </span>

                <strong>
                    ${escapeHTML(curso)}
                </strong>

            </div>


            <!-- REGISTROS -->

            <div class="professor-date">

                <span class="data-label">
                    Registros
                </span>

                <strong>
                    ${professor.registros}
                </strong>

            </div>


            <!-- AÇÕES -->

            <div class="professor-actions">


                <button
                    class="view-btn"
                    type="button"
                    data-action="registros"
                >

                    <i class="fa-regular fa-eye"></i>

                    Ver registros

                </button>


                <button
                    class="class-btn"
                    type="button"
                    data-action="turma"
                >

                    <i class="fa-solid fa-link"></i>

                    Cadastrar turma

                </button>


                <button
                    class="more-btn"
                    type="button"
                    aria-label="Mais opções"
                >

                    <i class="fa-solid fa-ellipsis-vertical"></i>

                </button>

            </div>

        </article>

    `;

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escapeHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   RENDERIZAR PROFESSORES
========================================================= */

function renderizarProfessores() {

    professorsList.innerHTML = "";


    professores.forEach(
        function (professor, indice) {

            professorsList.insertAdjacentHTML(
                "beforeend",
                criarProfessorHTML(
                    professor,
                    indice
                )
            );

        }
    );


    adicionarEventosProfessores();


    ordenarProfessores();

    filtrarProfessores();

}


/* =========================================================
   EVENTOS DOS PROFESSORES
========================================================= */

function adicionarEventosProfessores() {

    const cards =
        professorsList.querySelectorAll(
            ".professor-item"
        );


    cards.forEach(function (card) {


        const botaoRegistros =
            card.querySelector(
                '[data-action="registros"]'
            );


        const botaoTurma =
            card.querySelector(
                '[data-action="turma"]'
            );


        if (botaoRegistros) {

            botaoRegistros.addEventListener(
                "click",
                function () {

                    abrirModalProfessor(
                        card
                    );

                }
            );

        }


        if (botaoTurma) {

            botaoTurma.addEventListener(
                "click",
                function () {

                    abrirModalTurma(
                        card
                    );

                }
            );

        }

    });

}


/* =========================================================
   FILTRAR
========================================================= */

function filtrarProfessores() {

    if (!searchProfessor) {

        return;

    }


    const busca =
        searchProfessor.value
            .trim()
            .toLowerCase();


    const status =
        statusFilter.value;


    const curso =
        courseFilter.value;


    const cards =
        Array.from(
            professorsList.querySelectorAll(
                ".professor-item"
            )
        );


    let encontrados = 0;


    cards.forEach(function (card) {

        const nome =
            card.dataset.name
                .toLowerCase();


        const email =
            card.dataset.email
                .toLowerCase();


        const statusProfessor =
            card.dataset.status;


        const professorId =
            Number(
                card.dataset.id
            );


        const professor =
            professores.find(
                function (item) {

                    return item.id === professorId;

                }
            );


        let correspondeCurso =
            true;


        if (
            curso !== "todos"
        ) {

            correspondeCurso =
                professor &&
                professor.turmas.some(
                    function (turma) {

                        return turma.curso === curso;

                    }
                );

        }


        const correspondeBusca =
            nome.includes(busca) ||
            email.includes(busca);


        const correspondeStatus =
            status === "todos" ||
            statusProfessor === status;


        const mostrar =
            correspondeBusca &&
            correspondeStatus &&
            correspondeCurso;


        if (mostrar) {

            card.style.display = "";

            encontrados++;

        } else {

            card.style.display =
                "none";

        }

    });


    resultCount.textContent =
        `(${encontrados})`;


    resultDescription.textContent =
        encontrados === 1
            ? "1 professor encontrado"
            : `${encontrados} professores encontrados`;


    if (encontrados === 0) {

        emptyState.style.display =
            "block";

    } else {

        emptyState.style.display =
            "none";

    }

}


/* =========================================================
   ORDENAR
========================================================= */

function ordenarProfessores() {

    if (!sortProfessor) {

        return;

    }


    const valor =
        sortProfessor.value;


    const cards =
        Array.from(
            professorsList.querySelectorAll(
                ".professor-item"
            )
        );


    cards.sort(function (a, b) {

        if (
            valor === "nome"
        ) {

            return a.dataset.name
                .localeCompare(
                    b.dataset.name,
                    "pt-BR"
                );

        }


        if (
            valor === "nome-desc"
        ) {

            return b.dataset.name
                .localeCompare(
                    a.dataset.name,
                    "pt-BR"
                );

        }


        if (
            valor === "registros"
        ) {

            return Number(
                b.dataset.registros
            ) -
            Number(
                a.dataset.registros
            );

        }


        return 0;

    });


    cards.forEach(function (card) {

        professorsList.appendChild(
            card
        );

    });

}


/* =========================================================
   EVENTOS FILTROS
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

            searchProfessor.value =
                "";

            statusFilter.value =
                "todos";

            courseFilter.value =
                "todos";

            sortProfessor.value =
                "nome";


            ordenarProfessores();

            filtrarProfessores();

        }
    );

}


/* =========================================================
   ABRIR MODAL PROFESSOR
========================================================= */

function abrirModalProfessor(card) {

    const professorId =
        Number(
            card.dataset.id
        );


    const professor =
        professores.find(
            function (item) {

                return item.id === professorId;

            }
        );


    if (!professor) {

        return;

    }


    professorSelecionado =
        professor;


    modalProfessorName.textContent =
        professor.nome;


    modalProfessorEmail.textContent =
        professor.email;


    modalAvatar.textContent =
        gerarAvatar(
            professor.nome
        );


    modalCourse.textContent =
        obterCursoProfessor(
            professor
        );


    modalRecords.textContent =
        `${professor.registros} atividades`;


    modalDate.textContent =
        professor.ultimoRegistro;


    modalStatus.innerHTML =
        `<i class="fa-solid fa-circle"></i>
         ${professor.status === "ativo" ? "Ativo" : "Inativo"}`;


    if (
        professor.status !== "ativo"
    ) {

        modalStatus.classList.add(
            "inactive-status"
        );

    } else {

        modalStatus.classList.remove(
            "inactive-status"
        );

    }


    professorModal.classList.add(
        "open"
    );


    document.body.style.overflow =
        "hidden";


    carregarTurmasProfessor(
        professor.id
    );

}


/* =========================================================
   CARREGAR TURMAS DO PROFESSOR
========================================================= */

async function carregarTurmasProfessor(
    professorId
) {

    linkedClassesList.innerHTML = `

        <div class="linked-loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

            Carregando turmas...

        </div>

    `;


    try {

        const response =
            await fetch(
                `${API_URL}/ProfessorTurma/professor/${professorId}`
            );


        if (!response.ok) {

            throw new Error(
                "Erro ao carregar vínculos."
            );

        }


        const dados =
            await response.json();


        const professor =
            professores.find(
                function (item) {

                    return item.id === professorId;

                }
            );


        if (professor) {

            professor.turmas =
                dados || [];

        }


        renderizarTurmasVinculadas(
            dados
        );


        atualizarResumo();

        montarFiltroCursos();


    } catch (error) {

        console.error(error);


        linkedClassesList.innerHTML = `

            <div class="linked-empty">

                Não foi possível carregar as turmas.

            </div>

        `;

    }

}


/* =========================================================
   RENDERIZAR TURMAS
========================================================= */

function renderizarTurmasVinculadas(
    turmasProfessor
) {

    linkedClassesList.innerHTML =
        "";


    if (
        !turmasProfessor ||
        turmasProfessor.length === 0
    ) {

        linkedClassesList.innerHTML = `

            <div class="linked-empty">

                <i class="fa-solid fa-link-slash"></i>

                Nenhuma turma vinculada a este professor.

            </div>

        `;

        return;

    }


    turmasProfessor.forEach(
        function (turma) {

            const idVinculo =
                turma.id_professor_turma ??
                turma.idProfessorTurma ??
                turma.Id_Professor_Turma;


            const nome =
                turma.nome_turma ??
                turma.nomeTurma ??
                turma.Nome_Turma ??
                "Turma";


            const curso =
                turma.curso ??
                turma.Curso ??
                "";


            const periodo =
                formatarPeriodo(
                    turma.periodo ??
                    turma.Periodo
                );


            const turno =
                formatarTurno(
                    turma.turno ??
                    turma.Turno
                );


            const detalhes =
                [
                    curso,
                    periodo,
                    turno
                ]
                .filter(Boolean)
                .join(" • ");


            linkedClassesList.insertAdjacentHTML(
                "beforeend",
                `

                    <div
                        class="linked-class-item"
                        data-vinculo="${idVinculo}"
                    >

                        <div class="linked-class-icon">

                            <i class="fa-solid fa-users"></i>

                        </div>


                        <div class="linked-class-info">

                            <strong>
                                ${escapeHTML(nome)}
                            </strong>

                            <span>
                                ${escapeHTML(detalhes || "Sem informações adicionais")}
                            </span>

                        </div>


                        <button
                            class="remove-class-btn"
                            type="button"
                            data-vinculo="${idVinculo}"
                            title="Remover vínculo"
                        >

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                `
            );

        }
    );


    const removeButtons =
        linkedClassesList.querySelectorAll(
            ".remove-class-btn"
        );


    removeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const idVinculo =
                        Number(
                            button.dataset.vinculo
                        );


                    removerVinculo(
                        idVinculo
                    );

                }
            );

        }
    );

}


/* =========================================================
   REMOVER VÍNCULO
========================================================= */

async function removerVinculo(
    idVinculo
) {

    const confirmar =
        window.confirm(
            "Deseja realmente remover esta turma do professor?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/ProfessorTurma/${idVinculo}`,
                {
                    method: "DELETE"
                }
            );


        const texto =
            await response.text();


        let dados = null;


        try {

            dados =
                texto
                    ? JSON.parse(texto)
                    : null;

        } catch {

            dados = null;

        }


        if (!response.ok) {

            throw new Error(
                dados?.mensagem ??
                "Não foi possível remover o vínculo."
            );

        }


        if (
            professorSelecionado
        ) {

            await carregarTurmasProfessor(
                professorSelecionado.id
            );

        }


        renderizarProfessores();


        alert(
            dados?.mensagem ??
            "Vínculo removido com sucesso."
        );


    } catch (error) {

        console.error(error);


        alert(
            error.message ||
            "Erro ao remover vínculo."
        );

    }

}


/* =========================================================
   ABRIR MODAL TURMA
========================================================= */

function abrirModalTurma(card) {

    const professorId =
        Number(
            card.dataset.id
        );


    const professor =
        professores.find(
            function (item) {

                return item.id === professorId;

            }
        );


    if (!professor) {

        return;

    }


    professorSelecionado =
        professor;


    turmaProfessorNome.textContent =
        professor.nome;


    turmaMessage.textContent =
        "";


    turmaMessage.className =
        "turma-message";


    turmaSelect.value =
        "";


    carregarTurmas();


    turmaModal.classList.add(
        "open"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CARREGAR TURMAS
========================================================= */

async function carregarTurmas() {

    turmaSelect.innerHTML = `

        <option value="">
            Carregando turmas...
        </option>

    `;


    try {

        const response =
            await fetch(
                `${API_URL}/ProfessorTurma/turmas`
            );


        if (!response.ok) {

            throw new Error(
                "Não foi possível carregar as turmas."
            );

        }


        turmas =
            await response.json();


        turmaSelect.innerHTML = `

            <option value="">
                Selecione uma turma
            </option>

        `;


        turmas.forEach(
            function (turma) {

                const id =
                    turma.id_turma ??
                    turma.idTurma ??
                    turma.Id_Turma;


                const nome =
                    turma.nome_turma ??
                    turma.nomeTurma ??
                    turma.Nome_Turma ??
                    "Turma";


                const curso =
                    turma.curso ??
                    turma.Curso ??
                    "";


                const periodo =
                    formatarPeriodo(
                        turma.periodo ??
                        turma.Periodo
                    );


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    id;


                option.textContent =
                    [
                        nome,
                        curso,
                        periodo
                    ]
                    .filter(Boolean)
                    .join(" - ");


                turmaSelect.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(error);


        turmaSelect.innerHTML = `

            <option value="">
                Erro ao carregar turmas
            </option>

        `;


        turmaMessage.textContent =
            "Não foi possível carregar as turmas.";


        turmaMessage.className =
            "turma-message error";

    }

}


/* =========================================================
   SALVAR VÍNCULO
========================================================= */

if (turmaSalvar) {

    turmaSalvar.addEventListener(
        "click",
        async function () {

            if (
                !professorSelecionado
            ) {

                return;

            }


            const turmaId =
                Number(
                    turmaSelect.value
                );


            if (!turmaId) {

                turmaMessage.textContent =
                    "Selecione uma turma.";


                turmaMessage.className =
                    "turma-message error";


                return;

            }


            turmaSalvar.disabled =
                true;


            turmaSalvar.innerHTML = `

                <i class="fa-solid fa-spinner fa-spin"></i>

                Cadastrando...

            `;


            turmaMessage.textContent =
                "";


            try {

                const response =
                    await fetch(
                        `${API_URL}/ProfessorTurma`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    fk_Professor_Id_Usuario:
                                        professorSelecionado.id,

                                    fk_Turma_Id_Turma:
                                        turmaId

                                })

                        }
                    );


                const texto =
                    await response.text();


                let dados = null;


                try {

                    dados =
                        texto
                            ? JSON.parse(texto)
                            : null;

                } catch {

                    dados = null;

                }


                /* =========================================
                   SUCESSO
                ========================================== */

                if (response.ok) {

                    turmaMessage.textContent =
                        dados?.mensagem ??
                        "Turma cadastrada com sucesso.";


                    turmaMessage.className =
                        "turma-message success";


                    await carregarTurmasProfessor(
                        professorSelecionado.id
                    );


                    setTimeout(
                        function () {

                            fecharModalTurma();

                            atualizarCardProfessor(
                                professorSelecionado.id
                            );

                            atualizarResumo();

                            montarFiltroCursos();

                        },
                        800
                    );


                    return;

                }


                /* =========================================
                   DUPLICADO
                ========================================== */

                if (
                    response.status === 409
                ) {

                    turmaMessage.textContent =
                        dados?.mensagem ??
                        "Este professor já está vinculado a esta turma.";


                    turmaMessage.className =
                        "turma-message error";


                    return;

                }


                /* =========================================
                   ERRO
                ========================================== */

                turmaMessage.textContent =
                    dados?.mensagem ??
                    "Não foi possível cadastrar a turma.";


                turmaMessage.className =
                    "turma-message error";


            } catch (error) {

                console.error(error);


                turmaMessage.textContent =
                    "Erro de conexão com a API.";


                turmaMessage.className =
                    "turma-message error";

            } finally {

                turmaSalvar.disabled =
                    false;


                turmaSalvar.innerHTML = `

                    <i class="fa-solid fa-link"></i>

                    Cadastrar turma

                `;

            }

        }
    );

}


/* =========================================================
   ATUALIZAR CARD
========================================================= */

function atualizarCardProfessor(
    professorId
) {

    const professor =
        professores.find(
            function (item) {

                return item.id === professorId;

            }
        );


    if (!professor) {

        return;

    }


    const card =
        professorsList.querySelector(
            `.professor-item[data-id="${professorId}"]`
        );


    if (!card) {

        renderizarProfessores();

        return;

    }


    const curso =
        obterCursoProfessor(
            professor
        );


    card.dataset.course =
        curso;


    const dados =
        card.querySelectorAll(
            ".professor-data"
        );


    if (dados[0]) {

        const strong =
            dados[0].querySelector(
                "strong"
            );


        if (strong) {

            strong.textContent =
                professor.turmas.length;

        }

    }


    if (dados[1]) {

        const strong =
            dados[1].querySelector(
                "strong"
            );


        if (strong) {

            strong.textContent =
                curso;

        }

    }


    filtrarProfessores();

}


/* =========================================================
   FECHAR MODAL PROFESSOR
========================================================= */

function fecharModalProfessor() {

    professorModal.classList.remove(
        "open"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   FECHAR MODAL TURMA
========================================================= */

function fecharModalTurma() {

    turmaModal.classList.remove(
        "open"
    );


    document.body.style.overflow =
        "";


    turmaMessage.textContent =
        "";


    turmaMessage.className =
        "turma-message";

}


/* =========================================================
   BOTÕES MODAL PROFESSOR
========================================================= */

if (modalClose) {

    modalClose.addEventListener(
        "click",
        fecharModalProfessor
    );

}


if (modalCloseFooter) {

    modalCloseFooter.addEventListener(
        "click",
        fecharModalProfessor
    );

}


/* =========================================================
   BOTÃO CADASTRAR TURMA DENTRO DO MODAL
========================================================= */

if (modalAddClass) {

    modalAddClass.addEventListener(
        "click",
        function () {

            if (
                !professorSelecionado
            ) {

                return;

            }


            fecharModalProfessor();


            const card =
                professorsList.querySelector(
                    `.professor-item[data-id="${professorSelecionado.id}"]`
                );


            if (card) {

                abrirModalTurma(
                    card
                );

            }

        }
    );

}


/* =========================================================
   FECHAR MODAL TURMA
========================================================= */

if (turmaModalClose) {

    turmaModalClose.addEventListener(
        "click",
        fecharModalTurma
    );

}


if (turmaCancelar) {

    turmaCancelar.addEventListener(
        "click",
        fecharModalTurma
    );

}


/* =========================================================
   CLICAR FORA DO MODAL
========================================================= */

if (professorModal) {

    professorModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                professorModal
            ) {

                fecharModalProfessor();

            }

        }
    );

}


if (turmaModal) {

    turmaModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                turmaModal
            ) {

                fecharModalTurma();

            }

        }
    );

}


/* =========================================================
   ESC
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        if (
            professorModal &&
            professorModal.classList.contains(
                "open"
            )
        ) {

            fecharModalProfessor();

        }


        if (
            turmaModal &&
            turmaModal.classList.contains(
                "open"
            )
        ) {

            fecharModalTurma();

        }

    }
);


/* =========================================================
   VER REGISTROS COMPLETOS
========================================================= */

if (professorsList) {

    /*
       O botão individual "Ver registros"
       atualmente abre o modal.

       O botão "Ver registros" dentro de
       outra tela pode continuar levando
       para pesquisarRegistros.html.
    */

}


/* =========================================================
   LOGOUT
========================================================= */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


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
   ATUALIZAR RESUMO
========================================================= */

function atualizarResumo() {

    if (totalProfessores) {

        totalProfessores.textContent =
            professores.length;

    }


    if (professoresAtivos) {

        const ativos =
            professores.filter(
                function (professor) {

                    return professor.status === "ativo";

                }
            ).length;


        professoresAtivos.textContent =
            ativos;

    }


    if (totalVinculos) {

        const vinculos =
            professores.reduce(
                function (total, professor) {

                    return total +
                        professor.turmas.length;

                },
                0
            );


        totalVinculos.textContent =
            vinculos;

    }


    if (professoresComTurma) {

        const comTurma =
            professores.filter(
                function (professor) {

                    return professor.turmas.length > 0;

                }
            ).length;


        professoresComTurma.textContent =
            comTurma;

    }

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

carregarProfessores();