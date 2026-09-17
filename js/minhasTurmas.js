/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const API_BASE = "https://localhost:7082";


/* =========================================================
   ELEMENTOS
========================================================= */

const searchInput =
    document.getElementById("searchInput");

const cursoFilter =
    document.getElementById("cursoFilter");

const resultsCount =
    document.getElementById("resultsCount");

const classesGrid =
    document.getElementById("classesGrid");

const emptyState =
    document.getElementById("emptyState");

const emptyClearBtn =
    document.getElementById("emptyClearBtn");


/* =========================================================
   MODAL
========================================================= */

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


/* =========================================================
   MENU MOBILE
========================================================= */

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const mobileNav =
    document.getElementById("mobileNav");


/* =========================================================
   LOGOUT
========================================================= */

const btnLogout =
    document.getElementById("btnLogout");


/* =========================================================
   VARIÁVEIS
========================================================= */

let turmas = [];

let turmaSelecionada = null;


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    carregarTurmas();

    configurarEventos();

});


/* =========================================================
   CONFIGURAR EVENTOS
========================================================= */

function configurarEventos() {

    /* -----------------------------------------------------
       BUSCA
    ----------------------------------------------------- */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderizarTurmas
        );

    }


    /* -----------------------------------------------------
       FILTRO DE CURSO
    ----------------------------------------------------- */

    if (cursoFilter) {

        cursoFilter.addEventListener(
            "change",
            renderizarTurmas
        );

    }


    /* -----------------------------------------------------
       LIMPAR FILTROS
    ----------------------------------------------------- */

    if (emptyClearBtn) {

        emptyClearBtn.addEventListener(
            "click",
            limparFiltros
        );

    }


    /* -----------------------------------------------------
       FECHAR MODAL
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       CLICAR FORA DO MODAL
    ----------------------------------------------------- */

    if (classModal) {

        classModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === classModal
                ) {

                    fecharModal();

                }

            }
        );

    }


    /* -----------------------------------------------------
       TECLA ESC
    ----------------------------------------------------- */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                fecharModal();

            }

        }
    );


    /* -----------------------------------------------------
       BOTÕES DOS CARDS
    ----------------------------------------------------- */

    if (classesGrid) {

        classesGrid.addEventListener(
            "click",
            (event) => {

                const botao =
                    event.target.closest(
                        "[data-action]"
                    );

                if (!botao) {
                    return;
                }


                const action =
                    botao.dataset.action;


                const id =
                    Number(
                        botao.dataset.id
                    );


                if (
                    action === "detalhes"
                ) {

                    abrirDetalhes(id);

                }

            }
        );

    }


    /* -----------------------------------------------------
       MENU MOBILE
    ----------------------------------------------------- */

    if (
        mobileMenuBtn &&
        mobileNav
    ) {

        mobileMenuBtn.addEventListener(
            "click",
            () => {

                const aberto =
                    mobileNav.classList.toggle(
                        "active"
                    );


                mobileMenuBtn.setAttribute(
                    "aria-expanded",
                    aberto
                        ? "true"
                        : "false"
                );

            }
        );

    }


    /* -----------------------------------------------------
       LOGOUT
    ----------------------------------------------------- */

    if (btnLogout) {

        btnLogout.addEventListener(
            "click",
            logout
        );

    }

}


/* =========================================================
   CARREGAR TURMAS
========================================================= */

async function carregarTurmas() {

    try {

        const resposta =
            await fetch(
                `${API_BASE}/api/Atividade/minhas-turmas`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        /* -------------------------------------------------
           SESSÃO EXPIRADA
        ------------------------------------------------- */

        if (
            resposta.status === 401
        ) {

            alert(
                "Sua sessão expirou. Faça login novamente."
            );


            window.location.href =
                "login.html";


            return;

        }


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar suas turmas."
            );

        }


        const dados =
            await resposta.json();


        turmas =
            Array.isArray(dados)
                ? dados
                : [];


        preencherFiltroCursos();

        renderizarTurmas();

    }

    catch (erro) {

        console.error(
            "Erro ao carregar turmas:",
            erro
        );


        if (classesGrid) {

            classesGrid.innerHTML = `
                <div class="error-state">

                    <i class="fa-solid fa-circle-exclamation"></i>

                    <h2>
                        Não foi possível carregar as turmas
                    </h2>

                    <p>
                        Verifique sua conexão com o sistema
                        e tente novamente.
                    </p>

                </div>
            `;

        }


        if (resultsCount) {

            resultsCount.textContent =
                "0";

        }

    }

}


/* =========================================================
   PREENCHER FILTRO DE CURSOS
========================================================= */

function preencherFiltroCursos() {

    if (!cursoFilter) {
        return;
    }


    const cursos =
        [
            ...new Set(
                turmas
                    .map(
                        turma =>
                            turma.curso
                    )
                    .filter(Boolean)
            )
        ]
        .sort(
            (a, b) =>
                a.localeCompare(
                    b,
                    "pt-BR"
                )
        );


    cursoFilter.innerHTML = `
        <option value="">
            Todos os cursos
        </option>
    `;


    cursos.forEach(
        curso => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                curso;


            option.textContent =
                curso;


            cursoFilter.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   RENDERIZAR TURMAS
========================================================= */

function renderizarTurmas() {

    if (!classesGrid) {
        return;
    }


    const busca =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const cursoSelecionado =
        cursoFilter
            ? cursoFilter.value
            : "";


    const resultado =
        turmas.filter(
            turma => {

                const nome =
                    turma.nome_turma ||
                    "";


                const curso =
                    turma.curso ||
                    "";


                const texto =
                    `${nome} ${curso}`
                        .toLowerCase();


                const correspondeBusca =
                    !busca ||
                    texto.includes(
                        busca
                    );


                const correspondeCurso =
                    !cursoSelecionado ||
                    curso ===
                    cursoSelecionado;


                return (
                    correspondeBusca &&
                    correspondeCurso
                );

            }
        );


    /* -----------------------------------------------------
       CONTADOR
    ----------------------------------------------------- */

    if (resultsCount) {

        resultsCount.textContent =
            resultado.length;

    }


    /* -----------------------------------------------------
       ESTADO VAZIO
    ----------------------------------------------------- */

    if (
        resultado.length === 0
    ) {

        classesGrid.innerHTML =
            "";


        if (emptyState) {

            emptyState.style.display =
                "block";

        }


        return;

    }


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    /* -----------------------------------------------------
       CARDS
    ----------------------------------------------------- */

    classesGrid.innerHTML =
        resultado
            .map(
                turma =>
                    criarCardTurma(
                        turma
                    )
            )
            .join("");

}


/* =========================================================
   CRIAR CARD DA TURMA
========================================================= */

function criarCardTurma(
    turma
) {

    const id =
        Number(
            turma.id_turma ??
            turma.idTurma ??
            turma.Id_Turma ??
            0
        );


    const nome =
        turma.nome_turma ??
        turma.nomeTurma ??
        "Turma";


    const curso =
        turma.curso ??
        "Curso não informado";


    const periodo =
        formatarPeriodo(
            turma.periodo
        );


    const turno =
        turma.turno ??
        "Não informado";


    const quantidadeAtividades =
        obterQuantidadeAtividades(
            turma
        );


    return `
        <article class="class-card">

            <div class="class-card-content">

                <div class="class-card-header">

                    <div>

                        <span class="class-label">
                            TURMA
                        </span>

                        <h2>
                            ${escaparHTML(nome)}
                        </h2>

                    </div>

                    <span class="class-icon">
                        <i class="fa-solid fa-users"></i>
                    </span>

                </div>


                <div class="class-info">

                    <span>
                        <i class="fa-solid fa-graduation-cap"></i>
                        ${escaparHTML(curso)}
                    </span>

                    <span>
                        <i class="fa-regular fa-calendar"></i>
                        ${escaparHTML(periodo)}
                    </span>

                    <span>
                        <i class="fa-regular fa-clock"></i>
                        ${escaparHTML(turno)}
                    </span>

                </div>


                <div class="class-card-footer">

                    <span class="activity-total">

                        <i class="fa-regular fa-file-lines"></i>

                        ${quantidadeAtividades}

                        ${
                            quantidadeAtividades === 1
                                ? "atividade"
                                : "atividades"
                        }

                    </span>


                    <button
                        type="button"
                        class="class-detail-btn"
                        data-action="detalhes"
                        data-id="${id}"
                    >

                        <i class="fa-regular fa-eye"></i>

                        Detalhes

                    </button>

                </div>

            </div>

        </article>
    `;

}


/* =========================================================
   ABRIR DETALHES
========================================================= */

async function abrirDetalhes(
    id
) {

    const turma =
        turmas.find(
            item =>
                Number(
                    item.id_turma ??
                    item.idTurma ??
                    item.Id_Turma
                ) ===
                Number(id)
        );


    if (!turma) {

        alert(
            "Não foi possível encontrar esta turma."
        );

        return;

    }


    turmaSelecionada =
        turma;


    /* -----------------------------------------------------
       DADOS DA TURMA
    ----------------------------------------------------- */

    const nome =
        turma.nome_turma ??
        turma.nomeTurma ??
        "Turma";


    const curso =
        turma.curso ??
        "Curso não informado";


    const periodo =
        formatarPeriodo(
            turma.periodo
        );


    const turno =
        turma.turno ??
        "Não informado";


    if (modalTitle) {

        modalTitle.textContent =
            nome;

    }


    if (modalCourse) {

        modalCourse.textContent =
            curso;

    }


    if (modalCourseInfo) {

        modalCourseInfo.textContent =
            curso;

    }


    if (modalPeriod) {

        modalPeriod.textContent =
            periodo;

    }


    if (modalShift) {

        modalShift.textContent =
            turno;

    }


    /* -----------------------------------------------------
       ATIVIDADES
    ----------------------------------------------------- */

    let atividadesDaTurma =
        obterAtividadesDaTurma(
            turma
        );


    /* -----------------------------------------------------
       SE O OBJETO NÃO TROUXER AS ATIVIDADES,
       BUSCA AS ATIVIDADES DO PROFESSOR
    ----------------------------------------------------- */

    if (
        atividadesDaTurma.length === 0
    ) {

        try {

            const resposta =
                await fetch(
                    `${API_BASE}/api/Atividade/minhas`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );


            if (
                resposta.ok
            ) {

                const atividades =
                    await resposta.json();


                atividadesDaTurma =
                    atividades.filter(
                        atividade =>
                            atividadePertenceATurma(
                                atividade,
                                id
                            )
                    );

            }

        }

        catch (erro) {

            console.error(
                "Erro ao carregar atividades da turma:",
                erro
            );

        }

    }


    renderizarAtividadesModal(
        atividadesDaTurma
    );


    /* -----------------------------------------------------
       ABRIR MODAL
    ----------------------------------------------------- */

    if (classModal) {

        classModal.classList.add(
            "show"
        );


        classModal.style.display =
            "flex";

    }


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   OBTER ATIVIDADES DA TURMA
========================================================= */

function obterAtividadesDaTurma(
    turma
) {

    const possiveis =
        [
            turma.atividades,
            turma.Atividades,
            turma.activities
        ];


    for (
        const lista of possiveis
    ) {

        if (
            Array.isArray(lista)
        ) {

            return lista;

        }

    }


    return [];

}


/* =========================================================
   VERIFICAR SE ATIVIDADE PERTENCE À TURMA
========================================================= */

function atividadePertenceATurma(
    atividade,
    idTurma
) {

    const fkTurma =
        atividade.fk_turma_id_turma ??
        atividade.fkTurmaIdTurma ??
        atividade.id_turma ??
        atividade.idTurma ??
        atividade.turma?.id ??
        atividade.turma?.id_turma;


    if (
        fkTurma !== undefined &&
        fkTurma !== null
    ) {

        return (
            Number(fkTurma) ===
            Number(idTurma)
        );

    }


    const nomeTurmaAtividade =
        atividade.turma?.nome ??
        atividade.turma?.nome_turma ??
        atividade.turma ??
        "";


    const nomeTurmaSelecionada =
        turmaSelecionada?.nome_turma ??
        turmaSelecionada?.nomeTurma ??
        "";


    if (
        typeof nomeTurmaAtividade ===
        "string" &&
        typeof nomeTurmaSelecionada ===
        "string"
    ) {

        return (
            nomeTurmaAtividade
                .trim()
                .toLowerCase() ===
            nomeTurmaSelecionada
                .trim()
                .toLowerCase()
        );

    }


    return false;

}


/* =========================================================
   RENDERIZAR ATIVIDADES NO MODAL
========================================================= */

function renderizarAtividadesModal(
    atividades
) {

    if (!modalActivitiesList) {
        return;
    }


    if (
        !Array.isArray(atividades) ||
        atividades.length === 0
    ) {

        modalActivitiesList.innerHTML = `
            <div class="modal-empty">

                <i class="fa-regular fa-file-lines"></i>

                <p>
                    Nenhuma atividade registrada
                    para esta turma.
                </p>

            </div>
        `;


        if (modalActivities) {

            modalActivities.style.display =
                "block";

        }


        return;

    }


    const ordenadas =
        [...atividades]
            .sort(
                (a, b) =>
                    converterData(
                        obterDataAtividade(b)
                    ) -
                    converterData(
                        obterDataAtividade(a)
                    )
            );


    modalActivitiesList.innerHTML =
        ordenadas
            .map(
                atividade =>
                    criarAtividadeModal(
                        atividade
                    )
            )
            .join("");


    if (modalActivities) {

        modalActivities.style.display =
            "block";

    }

}


/* =========================================================
   CRIAR ATIVIDADE DO MODAL
========================================================= */

function criarAtividadeModal(
    atividade
) {

    const descricao =
        atividade.descricao ??
        atividade.descricao_atividade ??
        atividade.Descricao_Atividade ??
        "Atividade pedagógica";


    const observacao =
        atividade.observacao ??
        atividade.Observacao ??
        "";


    const data =
        obterDataAtividade(
            atividade
        );


    const fotos =
        Array.isArray(
            atividade.fotos
        )
            ? atividade.fotos.length
            : Array.isArray(
                atividade.Fotos
            )
                ? atividade.Fotos.length
                : 0;


    return `
        <div class="modal-activity-item">

            <div class="modal-activity-date">

                <i class="fa-regular fa-calendar"></i>

                ${escaparHTML(
                    formatarData(data)
                )}

            </div>


            <h4>
                ${escaparHTML(
                    descricao
                )}
            </h4>


            ${
                observacao
                    ? `
                        <p>
                            ${escaparHTML(
                                observacao
                            )}
                        </p>
                    `
                    : ""
            }


            <span class="modal-activity-photos">

                <i class="fa-regular fa-images"></i>

                ${fotos}

                ${
                    fotos === 1
                        ? "foto"
                        : "fotos"
                }

            </span>

        </div>
    `;

}


/* =========================================================
   OBTER DATA DA ATIVIDADE
========================================================= */

function obterDataAtividade(
    atividade
) {

    return (
        atividade.data ??
        atividade.data_atividade ??
        atividade.Data_Atividade ??
        ""
    );

}


/* =========================================================
   QUANTIDADE DE ATIVIDADES
========================================================= */

function obterQuantidadeAtividades(
    turma
) {

    const atividades =
        obterAtividadesDaTurma(
            turma
        );


    return atividades.length;

}


/* =========================================================
   FECHAR MODAL
========================================================= */

function fecharModal() {

    if (!classModal) {
        return;
    }


    classModal.classList.remove(
        "show"
    );


    classModal.style.display =
        "none";


    document.body.style.overflow =
        "";


    turmaSelecionada =
        null;

}


/* =========================================================
   LIMPAR FILTROS
========================================================= */

function limparFiltros() {

    if (searchInput) {

        searchInput.value =
            "";

    }


    if (cursoFilter) {

        cursoFilter.value =
            "";

    }


    renderizarTurmas();

}


/* =========================================================
   FORMATAR DATA
========================================================= */

function formatarData(
    data
) {

    if (!data) {

        return "—";

    }


    if (
        typeof data === "string" &&
        data.includes("/")
    ) {

        return data;

    }


    const dataObj =
        new Date(data);


    if (
        Number.isNaN(
            dataObj.getTime()
        )
    ) {

        return "—";

    }


    return dataObj.toLocaleDateString(
        "pt-BR"
    );

}


/* =========================================================
   FORMATAR PERÍODO
========================================================= */

function formatarPeriodo(
    periodo
) {

    if (!periodo) {

        return "—";

    }


    const data =
        new Date(periodo);


    if (
        Number.isNaN(
            data.getTime()
        )
    ) {

        return "—";

    }


    return data.toLocaleDateString(
        "pt-BR",
        {
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================================================
   CONVERTER DATA PARA ORDENAÇÃO
========================================================= */

function converterData(
    data
) {

    if (!data) {

        return 0;

    }


    if (
        typeof data === "string" &&
        data.includes("/")
    ) {

        const partes =
            data.split("/");


        if (
            partes.length === 3
        ) {

            return new Date(
                Number(partes[2]),
                Number(partes[1]) - 1,
                Number(partes[0])
            ).getTime();

        }

    }


    const dataObj =
        new Date(data);


    if (
        Number.isNaN(
            dataObj.getTime()
        )
    ) {

        return 0;

    }


    return dataObj.getTime();

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escaparHTML(
    texto
) {

    if (
        texto === null ||
        texto === undefined
    ) {

        return "";

    }


    return String(texto)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    sessionStorage.clear();

    localStorage.clear();

    window.location.href =
        "login.html";

}