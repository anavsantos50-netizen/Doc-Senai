/* =========================================================
   DOCSENAI - MINHAS ATIVIDADES
========================================================= */

const API_BASE = "https://localhost:7082";


/* =========================================================
   ELEMENTOS
========================================================= */

const searchInput =
    document.getElementById("searchInput");

const turmaFilter =
    document.getElementById("turmaFilter");

const periodoFilter =
    document.getElementById("periodoFilter");

const clearFilters =
    document.getElementById("clearFilters");

const emptyClearFilters =
    document.getElementById("emptyClearFilters");

const sortFilter =
    document.getElementById("sortFilter");

const resultsCount =
    document.getElementById("resultsCount");

const activitiesList =
    document.getElementById("activitiesList");

const emptyState =
    document.getElementById("emptyState");


/* =========================================================
   MODAL DA ATIVIDADE
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
    document.getElementById("modalObservationSection");

const modalGallery =
    document.getElementById("modalGallery");

const evidenceCount =
    document.getElementById("evidenceCount");

const modalEdit =
    document.getElementById("modalEdit");


/* =========================================================
   MODAL DE EXCLUSÃO
========================================================= */

const confirmModal =
    document.getElementById("confirmModal");

const cancelDelete =
    document.getElementById("cancelDelete");

const confirmDelete =
    document.getElementById("confirmDelete");


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

let atividades = [];

let atividadeSelecionada = null;

let atividadeParaExcluir = null;


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarAtividades();

        configurarEventos();

    }
);


/* =========================================================
   CONFIGURAR EVENTOS
========================================================= */

function configurarEventos() {

    /* BUSCA */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderizarAtividades
        );

    }


    /* FILTRO TURMA */

    if (turmaFilter) {

        turmaFilter.addEventListener(
            "change",
            renderizarAtividades
        );

    }


    /* FILTRO PERÍODO */

    if (periodoFilter) {

        periodoFilter.addEventListener(
            "change",
            renderizarAtividades
        );

    }


    /* ORDENAÇÃO */

    if (sortFilter) {

        sortFilter.addEventListener(
            "change",
            renderizarAtividades
        );

    }


    /* LIMPAR FILTROS */

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


    /* FECHAR MODAL */

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


    /* EDITAR */

    if (modalEdit) {

        modalEdit.addEventListener(
            "click",
            editarAtividade
        );

    }


    /* CONFIRMAR EXCLUSÃO */

    if (confirmDelete) {

        confirmDelete.addEventListener(
            "click",
            excluirAtividade
        );

    }


    /* CANCELAR EXCLUSÃO */

    if (cancelDelete) {

        cancelDelete.addEventListener(
            "click",
            fecharConfirmacao
        );

    }


    /* CLICAR FORA DO MODAL */

    if (activityModal) {

        activityModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    activityModal
                ) {

                    fecharModal();

                }

            }
        );

    }


    if (confirmModal) {

        confirmModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    confirmModal
                ) {

                    fecharConfirmacao();

                }

            }
        );

    }


    /* ESC */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            fecharModal();

            fecharConfirmacao();

        }
    );


    /* =====================================================
       BOTÕES DOS CARDS
    ===================================================== */

    if (activitiesList) {

        activitiesList.addEventListener(
            "click",
            event => {

                const botao =
                    event.target.closest(
                        "[data-action]"
                    );


                if (!botao) {
                    return;
                }


                const id =
                    Number(
                        botao.dataset.id
                    );


                const action =
                    botao.dataset.action;


                if (action === "visualizar") {

                    abrirModal(id);

                }


                if (action === "excluir") {

                    abrirConfirmacao(id);

                }

            }
        );

    }


    /* MENU MOBILE */

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


    /* LOGOUT */

    if (btnLogout) {

        btnLogout.addEventListener(
            "click",
            logout
        );

    }

}


/* =========================================================
   CARREGAR ATIVIDADES
========================================================= */

async function carregarAtividades() {

    try {

        const resposta =
            await fetch(
                `${API_BASE}/api/Atividade/minhas`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        /* SESSÃO */

        if (resposta.status === 401) {

            alert(
                "Sua sessão expirou. Faça login novamente."
            );

            window.location.href =
                "login.html";

            return;

        }


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar as atividades."
            );

        }


        atividades =
            await resposta.json();


        preencherFiltros();

        renderizarAtividades();

    }
    catch (erro) {

        console.error(
            "Erro ao carregar atividades:",
            erro
        );


        if (activitiesList) {

            activitiesList.innerHTML = `
                <div class="error-state">

                    <i class="fa-solid fa-circle-exclamation"></i>

                    <h2>
                        Não foi possível carregar as atividades
                    </h2>

                    <p>
                        Verifique sua conexão com o sistema
                        e tente novamente.
                    </p>

                </div>
            `;

        }


        if (resultsCount) {
            resultsCount.textContent = "0";
        }

    }

}


/* =========================================================
   PREENCHER FILTROS
========================================================= */

function preencherFiltros() {

    /* =====================================================
       TURMAS
    ===================================================== */

    if (turmaFilter) {

        const turmas =
            [
                ...new Set(
                    atividades
                        .map(
                            atividade =>
                                atividade.turma
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


        turmaFilter.innerHTML = `
            <option value="">
                Todas as turmas
            </option>
        `;


        turmas.forEach(
            turma => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    turma;

                option.textContent =
                    turma;


                turmaFilter.appendChild(
                    option
                );

            }
        );

    }


    /* =====================================================
       PERÍODOS
    ===================================================== */

    if (periodoFilter) {

        const periodos =
            [
                ...new Set(
                    atividades
                        .map(
                            atividade =>
                                atividade.periodo
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


        periodoFilter.innerHTML = `
            <option value="">
                Todos os períodos
            </option>
        `;


        periodos.forEach(
            periodo => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    periodo;

                option.textContent =
                    periodo;


                periodoFilter.appendChild(
                    option
                );

            }
        );

    }

}


/* =========================================================
   RENDERIZAR ATIVIDADES
========================================================= */

function renderizarAtividades() {

    if (!activitiesList) {
        return;
    }


    const busca =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const turmaSelecionada =
        turmaFilter
            ? turmaFilter.value
            : "";


    const periodoSelecionado =
        periodoFilter
            ? periodoFilter.value
            : "";


    const ordenacao =
        sortFilter
            ? sortFilter.value
            : "recent";


    /* =====================================================
       FILTRAR
    ===================================================== */

    let resultado =
        atividades.filter(
            atividade => {

                const texto =
                    `
                    ${atividade.titulo || ""}
                    ${atividade.descricao || ""}
                    ${atividade.turma || ""}
                    ${atividade.periodo || ""}
                    `
                        .toLowerCase();


                const correspondeBusca =
                    !busca ||
                    texto.includes(
                        busca
                    );


                const correspondeTurma =
                    !turmaSelecionada ||
                    atividade.turma ===
                    turmaSelecionada;


                const correspondePeriodo =
                    !periodoSelecionado ||
                    atividade.periodo ===
                    periodoSelecionado;


                return (
                    correspondeBusca &&
                    correspondeTurma &&
                    correspondePeriodo
                );

            }
        );


    /* =====================================================
       ORDENAR
    ===================================================== */

    resultado.sort(
        (a, b) => {

            if (
                ordenacao ===
                "title"
            ) {

                return (
                    a.titulo || ""
                ).localeCompare(
                    b.titulo || "",
                    "pt-BR"
                );

            }


            const dataA =
                converterData(
                    a.data
                );


            const dataB =
                converterData(
                    b.data
                );


            if (
                ordenacao ===
                "oldest"
            ) {

                return (
                    dataA -
                    dataB
                );

            }


            return (
                dataB -
                dataA
            );

        }
    );


    /* CONTADOR */

    if (resultsCount) {

        resultsCount.textContent =
            resultado.length;

    }


    /* ESTADO VAZIO */

    if (
        resultado.length ===
        0
    ) {

        activitiesList.innerHTML =
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


    /* CARDS */

    activitiesList.innerHTML =
        resultado
            .map(
                atividade =>
                    criarCardAtividade(
                        atividade
                    )
            )
            .join("");

}


/* =========================================================
   CRIAR CARD
========================================================= */

function criarCardAtividade(
    atividade
) {

    const quantidadeFotos =
        Array.isArray(
            atividade.fotos
        )
            ? atividade.fotos.length
            : 0;


    const titulo =
        escaparHTML(
            atividade.titulo ||
            "Atividade pedagógica"
        );


    const turma =
        escaparHTML(
            atividade.turma ||
            "Turma não encontrada"
        );


    const periodo =
        escaparHTML(
            atividade.periodo ||
            "—"
        );


    const data =
        escaparHTML(
            atividade.data ||
            "—"
        );


    return `
        <article class="activity-card">

            <div class="activity-card-content">

                <div class="activity-card-header">

                    <div>

                        <span class="activity-label">
                            ATIVIDADE PEDAGÓGICA
                        </span>

                        <h2>
                            ${titulo}
                        </h2>

                    </div>

                    <span class="activity-date">

                        <i class="fa-regular fa-calendar"></i>

                        ${data}

                    </span>

                </div>


                <div class="activity-info">

                    <span>

                        <i class="fa-solid fa-users"></i>

                        ${turma}

                    </span>


                    <span>

                        <i class="fa-regular fa-calendar"></i>

                        ${periodo}

                    </span>


                    <span>

                        <i class="fa-regular fa-images"></i>

                        ${quantidadeFotos}

                        ${
                            quantidadeFotos === 1
                                ? "foto"
                                : "fotos"
                        }

                    </span>

                </div>


                <p class="activity-description">

                    ${
                        escaparHTML(
                            atividade.descricao ||
                            "Sem descrição."
                        )
                    }

                </p>


                <div class="activity-actions">

                    <button
                        type="button"
                        class="activity-view-btn"
                        data-action="visualizar"
                        data-id="${atividade.id}"
                    >

                        <i class="fa-regular fa-eye"></i>

                        Visualizar

                    </button>


                    <button
                        type="button"
                        class="activity-delete-btn"
                        data-action="excluir"
                        data-id="${atividade.id}"
                    >

                        <i class="fa-regular fa-trash-can"></i>

                        Excluir

                    </button>

                </div>

            </div>

        </article>
    `;

}


/* =========================================================
   ABRIR MODAL
========================================================= */

async function abrirModal(id) {

    try {

        const resposta =
            await fetch(
                `${API_BASE}/api/Atividade/${id}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        /* SESSÃO */

        if (resposta.status === 401) {

            alert(
                "Sua sessão expirou. Faça login novamente."
            );

            window.location.href =
                "login.html";

            return;

        }


        if (
            resposta.status ===
            404
        ) {

            alert(
                "Atividade não encontrada."
            );

            return;

        }


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível buscar a atividade."
            );

        }


        const detalhe =
            await resposta.json();


        /*
         * IMPORTANTE:
         *
         * O endpoint /{id} retorna:
         *
         * fk_turma_id_turma
         * data_atividade
         * descricao_atividade
         * observacao
         * fotos
         *
         * Já o endpoint /minhas retorna:
         *
         * turma
         * periodo
         * data
         * descricao
         *
         * Então juntamos os dois objetos aqui.
         */


        const atividadeLista =
            atividades.find(
                atividade =>
                    Number(
                        atividade.id
                    ) === Number(id)
            );


        atividadeSelecionada = {

            id:
                detalhe.id ||
                id,


            /* DADOS DO ENDPOINT DE DETALHE */

            fk_turma_id_turma:
                detalhe.fk_turma_id_turma,


            data_atividade:
                detalhe.data_atividade,


            descricao_atividade:
                detalhe.descricao_atividade,


            observacao:
                detalhe.observacao || "",


            fotos:
                Array.isArray(
                    detalhe.fotos
                )
                    ? detalhe.fotos
                    : [],


            /* DADOS DA LISTAGEM */

            titulo:
                atividadeLista
                    ? atividadeLista.titulo
                    : detalhe.descricao_atividade,


            data:
                atividadeLista
                    ? atividadeLista.data
                    : formatarData(
                        detalhe.data_atividade
                    ),


            turma:
                atividadeLista
                    ? atividadeLista.turma
                    : "Turma não encontrada",


            periodo:
                atividadeLista
                    ? atividadeLista.periodo
                    : "—",


            descricao:
                detalhe.descricao_atividade ||
                (
                    atividadeLista
                        ? atividadeLista.descricao
                        : ""
                )

        };


        preencherModal(
            atividadeSelecionada
        );


        if (activityModal) {

            activityModal.classList.add(
                "show"
            );

        }


        document.body.style.overflow =
            "hidden";

    }
    catch (erro) {

        console.error(
            "Erro ao abrir atividade:",
            erro
        );


        alert(
            "Não foi possível abrir a atividade."
        );

    }

}


/* =========================================================
   PREENCHER MODAL
========================================================= */

function preencherModal(
    atividade
) {

    /* =====================================================
       TÍTULO
    ===================================================== */

    if (modalTitle) {

        modalTitle.textContent =
            atividade.descricao_atividade ||
            atividade.descricao ||
            "Atividade pedagógica";

    }


    /* =====================================================
       DATA
    ===================================================== */

    if (modalDate) {

        modalDate.textContent =
            formatarData(
                atividade.data_atividade ||
                atividade.data
            );

    }


    /* =====================================================
       TURMA
    ===================================================== */

    if (modalTurma) {

        modalTurma.textContent =
            atividade.turma ||
            "Turma não encontrada";

    }


    /* =====================================================
       PERÍODO
    ===================================================== */

    if (modalPeriodo) {

        modalPeriodo.textContent =
            atividade.periodo ||
            "—";

    }


    /* =====================================================
       DESCRIÇÃO
    ===================================================== */

    if (modalDescription) {

        modalDescription.textContent =
            atividade.descricao_atividade ||
            atividade.descricao ||
            "Sem descrição.";

    }


    /* =====================================================
       OBSERVAÇÃO
    ===================================================== */

    const observacao =
        atividade.observacao
            ? atividade.observacao.trim()
            : "";


    if (
        observacao &&
        modalObservation &&
        modalObservationSection
    ) {

        modalObservation.textContent =
            observacao;


        modalObservationSection.style.display =
            "block";

    }
    else if (
        modalObservationSection
    ) {

        modalObservationSection.style.display =
            "none";

    }


    /* =====================================================
       FOTOS
    ===================================================== */

    const fotos =
        Array.isArray(
            atividade.fotos
        )
            ? atividade.fotos
            : [];


    if (evidenceCount) {

        evidenceCount.textContent =
            `${fotos.length} ${
                fotos.length === 1
                    ? "foto"
                    : "fotos"
            }`;

    }


    if (!modalGallery) {
        return;
    }


    modalGallery.innerHTML =
        "";


    if (
        fotos.length ===
        0
    ) {

        modalGallery.innerHTML = `
            <div class="no-photos">

                <i class="fa-regular fa-image"></i>

                <p>
                    Nenhuma fotografia cadastrada.
                </p>

            </div>
        `;

        return;

    }


    /* =====================================================
       RENDERIZAR FOTOS
    ===================================================== */

    fotos.forEach(
        (foto, index) => {

            const url =
                typeof foto === "string"
                    ? foto
                    : (
                        foto.url ||
                        foto.caminho ||
                        foto.nome_arquivo ||
                        ""
                    );


            if (!url) {
                return;
            }


            const urlCompleta =
                url.startsWith("http")
                    ? url
                    : `${API_BASE}${url}`;


            const imagem =
                document.createElement(
                    "img"
                );


            imagem.src =
                urlCompleta;


            imagem.alt =
                `Evidência ${index + 1} da atividade`;


            imagem.className =
                "activity-photo";


            /*
             * Se uma foto antiga não existir
             * fisicamente no servidor, não quebra
             * o restante do modal.
             */

            imagem.onerror =
                () => {

                    imagem.style.display =
                        "none";

                };


            modalGallery.appendChild(
                imagem
            );

        }
    );

}


/* =========================================================
   EDITAR ATIVIDADE
========================================================= */

function editarAtividade() {

    if (!atividadeSelecionada) {
        return;
    }


    const id =
        atividadeSelecionada.id;


    if (!id) {
        return;
    }


    window.location.href =
        `registrarAtividade.html?id=${id}`;

}


/* =========================================================
   ABRIR CONFIRMAÇÃO
========================================================= */

function abrirConfirmacao(id) {

    atividadeParaExcluir =
        id;


    fecharModal();


    if (confirmModal) {

        confirmModal.classList.add(
            "show"
        );

    }


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   EXCLUIR ATIVIDADE
========================================================= */

async function excluirAtividade() {

    if (!atividadeParaExcluir) {
        return;
    }


    const id =
        atividadeParaExcluir;


    if (confirmDelete) {

        confirmDelete.disabled =
            true;


        confirmDelete.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Excluindo...
        `;

    }


    try {

        const resposta =
            await fetch(
                `${API_BASE}/api/Atividade/${id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );


        /* SESSÃO */

        if (
            resposta.status ===
            401
        ) {

            alert(
                "Sua sessão expirou. Faça login novamente."
            );

            window.location.href =
                "login.html";

            return;

        }


        const dados =
            await resposta.json()
                .catch(
                    () => ({})
                );


        if (!resposta.ok) {

            throw new Error(
                dados.mensagem ||
                "Não foi possível excluir a atividade."
            );

        }


        /* =================================================
           REMOVER DA LISTA LOCAL
        ================================================= */

        atividades =
            atividades.filter(
                atividade =>
                    Number(
                        atividade.id
                    ) !== Number(id)
            );


        fecharConfirmacao();

        renderizarAtividades();


        alert(
            dados.mensagem ||
            "Atividade excluída com sucesso."
        );

    }
    catch (erro) {

        console.error(
            "Erro ao excluir:",
            erro
        );


        alert(
            erro.message ||
            "Não foi possível excluir a atividade."
        );

    }
    finally {

        if (confirmDelete) {

            confirmDelete.disabled =
                false;


            confirmDelete.innerHTML =
                "Excluir";

        }


        atividadeParaExcluir =
            null;

    }

}


/* =========================================================
   FECHAR MODAL
========================================================= */

function fecharModal() {

    if (!activityModal) {
        return;
    }


    activityModal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";


    atividadeSelecionada =
        null;

}


/* =========================================================
   FECHAR CONFIRMAÇÃO
========================================================= */

function fecharConfirmacao() {

    if (!confirmModal) {
        return;
    }


    confirmModal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";


    atividadeParaExcluir =
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


    if (turmaFilter) {

        turmaFilter.value =
            "";

    }


    if (periodoFilter) {

        periodoFilter.value =
            "";

    }


    if (sortFilter) {

        sortFilter.value =
            "recent";

    }


    renderizarAtividades();

}


/* =========================================================
   CONVERTER DATA
========================================================= */

function converterData(
    data
) {

    if (!data) {
        return 0;
    }


    if (
        typeof data ===
        "string" &&
        data.includes("/")
    ) {

        const partes =
            data.split("/");


        if (
            partes.length !==
            3
        ) {

            return 0;

        }


        return new Date(
            Number(partes[2]),
            Number(partes[1]) - 1,
            Number(partes[0])
        ).getTime();

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
   FORMATAR DATA
========================================================= */

function formatarData(
    data
) {

    if (!data) {
        return "—";
    }


    /* DATA DD/MM/YYYY */

    if (
        typeof data ===
        "string" &&
        data.includes("/")
    ) {

        return data;

    }


    /* DATA ISO */

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