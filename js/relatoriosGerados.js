document.addEventListener("DOMContentLoaded", () => {

    const API_BASE = "https://localhost:7082";

    /* =========================================================
       ELEMENTOS
    ========================================================= */

    const totalReports = document.getElementById("totalReports");
    const monthReports = document.getElementById("monthReports");
    const totalActivities = document.getElementById("totalActivities");

    const searchInput = document.getElementById("searchInput");
    const periodFilter = document.getElementById("periodFilter");
    const courseFilter = document.getElementById("courseFilter");
    const clearFilters = document.getElementById("clearFilters");

    const resultsCount = document.getElementById("resultsCount");
    const sortFilter = document.getElementById("sortFilter");

    const reportsList = document.getElementById("reportsList");
    const emptyState = document.getElementById("emptyState");
    const emptyClear = document.getElementById("emptyClear");

    const reportModal = document.getElementById("reportModal");
    const modalClose = document.getElementById("modalClose");
    const modalCloseBottom = document.getElementById("modalCloseBottom");

    const modalTitle = document.getElementById("modalTitle");
    const modalPeriod = document.getElementById("modalPeriod");
    const modalProfessor = document.getElementById("modalProfessor");
    const modalClass = document.getElementById("modalClass");
    const modalCourse = document.getElementById("modalCourse");
    const modalActivities = document.getElementById("modalActivities");
    const modalDescription = document.getElementById("modalDescription");
    const modalDownload = document.getElementById("modalDownload");

    const menuMobile = document.getElementById("menuMobile");
    const mobileNav = document.getElementById("mobileNav");

    const btnLogout = document.getElementById("btnLogout");
    const btnLogoutMobile = document.getElementById("btnLogoutMobile");


    /* =========================================================
       VARIÁVEIS
    ========================================================= */

    let relatorios = [];
    let relatorioSelecionado = null;


    /* =========================================================
       INICIAR
    ========================================================= */

    carregarRelatorios();


    /* =========================================================
       CARREGAR RELATÓRIOS
    ========================================================= */

    async function carregarRelatorios() {

        try {

            const response = await fetch(
                `${API_BASE}/api/Relatorio/listar`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (response.status === 401) {

                window.location.href =
                    "../html/login.html";

                return;
            }

            if (!response.ok) {

                throw new Error(
                    `Erro HTTP: ${response.status}`
                );
            }

            const texto =
                await response.text();

            let dados;

            try {

                dados = JSON.parse(texto);

            } catch {

                throw new Error(
                    "A API retornou uma resposta inválida."
                );
            }

            if (!Array.isArray(dados)) {

                throw new Error(
                    "Os dados dos relatórios não estão no formato esperado."
                );
            }

            relatorios = dados;

            atualizarResumo();

            preencherCursos();

            renderizarRelatorios();

        } catch (erro) {

            console.error(
                "Erro ao carregar relatórios:",
                erro
            );

            reportsList.innerHTML = "";

            emptyState.classList.add("visible");

            resultsCount.textContent =
                "Erro ao carregar os relatórios";
        }
    }


    /* =========================================================
       ATUALIZAR RESUMO
    ========================================================= */

    function atualizarResumo() {

        totalReports.textContent =
            relatorios.length;

        const agora =
            new Date();

        const mesAtual =
            agora.getMonth();

        const anoAtual =
            agora.getFullYear();

        let quantidadeMes = 0;
        let quantidadeAtividades = 0;

        relatorios.forEach(relatorio => {

            const dataCriacao =
                converterData(
                    relatorio.data_criacao
                );

            if (
                dataCriacao &&
                dataCriacao.getMonth() === mesAtual &&
                dataCriacao.getFullYear() === anoAtual
            ) {

                quantidadeMes++;
            }

            quantidadeAtividades +=
                Number(
                    relatorio.quantidade_atividades || 0
                );
        });

        monthReports.textContent =
            quantidadeMes;

        totalActivities.textContent =
            quantidadeAtividades;
    }


    /* =========================================================
       PREENCHER CURSOS
    ========================================================= */

    function preencherCursos() {

        if (!courseFilter) {
            return;
        }

        const cursos =
            new Set();

        relatorios.forEach(relatorio => {

            /*
             * O backend envia "curso".
             */

            if (relatorio.curso) {

                String(relatorio.curso)
                    .split(",")
                    .map(curso => curso.trim())
                    .filter(curso => curso)
                    .forEach(curso => {
                        cursos.add(curso);
                    });
            }

            /*
             * Também aceita "cursos", caso
             * o relatório tenha mais de um.
             */

            if (Array.isArray(relatorio.cursos)) {

                relatorio.cursos.forEach(curso => {

                    if (curso) {
                        cursos.add(
                            String(curso).trim()
                        );
                    }
                });
            }
        });


        const cursosOrdenados =
            [...cursos].sort(
                (a, b) =>
                    a.localeCompare(
                        b,
                        "pt-BR"
                    )
            );


        courseFilter.innerHTML = `
            <option value="">
                Todos os cursos
            </option>
        `;


        cursosOrdenados.forEach(curso => {

            const option =
                document.createElement("option");

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
       RENDERIZAR RELATÓRIOS
    ========================================================= */

    function renderizarRelatorios() {

        const busca =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const periodo =
            periodFilter
                ? periodFilter.value
                : "";


        const curso =
            courseFilter
                ? courseFilter.value
                : "";


        let lista =
            [...relatorios];


        /* =====================================================
           BUSCA
        ===================================================== */

        if (busca) {

            lista =
                lista.filter(relatorio => {

                    const titulo =
                        String(
                            relatorio.titulo || ""
                        ).toLowerCase();


                    const descricao =
                        String(
                            relatorio.descricao || ""
                        ).toLowerCase();


                    const responsavel =
                        String(
                            relatorio.responsavel || ""
                        ).toLowerCase();


                    const cursoRelatorio =
                        String(
                            relatorio.curso || ""
                        ).toLowerCase();


                    const turmas =
                        Array.isArray(
                            relatorio.turmas
                        )
                            ? relatorio.turmas.join(" ")
                                .toLowerCase()
                            : "";


                    return (
                        titulo.includes(busca) ||
                        descricao.includes(busca) ||
                        responsavel.includes(busca) ||
                        cursoRelatorio.includes(busca) ||
                        turmas.includes(busca)
                    );
                });
        }


        /* =====================================================
           FILTRO DE PERÍODO
        ===================================================== */

        if (periodo) {

            lista =
                lista.filter(relatorio => {

                    /*
                     * O select normalmente usa:
                     *
                     * 2026-08
                     * 2026-09
                     *
                     * Vamos verificar TODAS as datas
                     * importantes do relatório.
                     */

                    const inicio =
                        converterData(
                            relatorio.periodo_inicio
                        );


                    const fim =
                        converterData(
                            relatorio.periodo_fim
                        );


                    const criacao =
                        converterData(
                            relatorio.data_criacao
                        );


                    /*
                     * Função para verificar
                     * se uma data pertence ao
                     * mês selecionado.
                     */

                    function pertenceAoPeriodo(data) {

                        if (!data) {
                            return false;
                        }

                        const ano =
                            data.getFullYear();

                        const mes =
                            String(
                                data.getMonth() + 1
                            ).padStart(2, "0");


                        return (
                            `${ano}-${mes}` ===
                            periodo
                        );
                    }


                    /*
                     * O relatório aparece quando
                     * o mês selecionado corresponde
                     * ao período do relatório.
                     */

                    return (
                        pertenceAoPeriodo(inicio) ||
                        pertenceAoPeriodo(fim) ||
                        pertenceAoPeriodo(criacao)
                    );
                });
        }


        /* =====================================================
           FILTRO DE CURSO
        ===================================================== */

        if (curso) {

            lista =
                lista.filter(relatorio => {

                    /*
                     * Primeiro verifica o campo "curso".
                     */

                    const cursoPrincipal =
                        String(
                            relatorio.curso || ""
                        );


                    if (
                        cursoPrincipal
                            .split(",")
                            .map(c =>
                                c.trim()
                            )
                            .includes(curso)
                    ) {

                        return true;
                    }


                    /*
                     * Depois verifica "cursos".
                     */

                    if (
                        Array.isArray(
                            relatorio.cursos
                        )
                    ) {

                        return relatorio.cursos
                            .map(c =>
                                String(c).trim()
                            )
                            .includes(curso);
                    }


                    return false;
                });
        }


        /* =====================================================
           ORDENAÇÃO
        ===================================================== */

        if (sortFilter) {

            const ordenacao =
                sortFilter.value;


            if (
                ordenacao === "recentes"
            ) {

                lista.sort(
                    (a, b) => {

                        const dataA =
                            converterData(
                                a.data_criacao
                            );

                        const dataB =
                            converterData(
                                b.data_criacao
                            );


                        return (
                            (dataB?.getTime() || 0) -
                            (dataA?.getTime() || 0)
                        );
                    }
                );
            }


            else if (
                ordenacao === "antigos"
            ) {

                lista.sort(
                    (a, b) => {

                        const dataA =
                            converterData(
                                a.data_criacao
                            );

                        const dataB =
                            converterData(
                                b.data_criacao
                            );


                        return (
                            (dataA?.getTime() || 0) -
                            (dataB?.getTime() || 0)
                        );
                    }
                );
            }


            else if (
                ordenacao === "az"
            ) {

                lista.sort(
                    (a, b) =>
                        String(
                            a.titulo || ""
                        ).localeCompare(
                            String(
                                b.titulo || ""
                            ),
                            "pt-BR"
                        )
                );
            }


            else if (
                ordenacao === "za"
            ) {

                lista.sort(
                    (a, b) =>
                        String(
                            b.titulo || ""
                        ).localeCompare(
                            String(
                                a.titulo || ""
                            ),
                            "pt-BR"
                        )
                );
            }
        }


        /* =====================================================
           CONTADOR
        ===================================================== */

        resultsCount.textContent =
            `${lista.length} ${
                lista.length === 1
                    ? "relatório"
                    : "relatórios"
            } encontrados`;


        /* =====================================================
           ESTADO VAZIO
        ===================================================== */

        if (lista.length === 0) {

            reportsList.innerHTML = "";

            emptyState.classList.add(
                "visible"
            );

            return;
        }


        emptyState.classList.remove(
            "visible"
        );


        /* =====================================================
           RENDER
        ===================================================== */

        reportsList.innerHTML =
            lista.map(
                relatorio =>
                    criarCardRelatorio(
                        relatorio
                    )
            ).join("");
    }


    /* =========================================================
       CRIAR CARD
    ========================================================= */

    function criarCardRelatorio(
        relatorio
    ) {

        const titulo =
            escaparHTML(
                relatorio.titulo ||
                "Relatório sem título"
            );


        const responsavel =
            escaparHTML(
                relatorio.responsavel ||
                "Não informado"
            );


        const periodoInicio =
            relatorio.periodo_inicio
                ? formatarData(
                    relatorio.periodo_inicio
                )
                : null;


        const periodoFim =
            formatarData(
                relatorio.periodo_fim
            );


        let periodoTexto;


        if (
            periodoInicio &&
            periodoInicio !== "Não informado"
        ) {

            periodoTexto =
                `${periodoInicio} - ${periodoFim}`;

        } else {

            periodoTexto =
                periodoFim;
        }


        const dataCriacao =
            formatarDataHora(
                relatorio.data_criacao
            );


        const quantidade =
            Number(
                relatorio.quantidade_atividades || 0
            );


        const id =
            Number(
                relatorio.id
            );


        return `
            <article class="report-item">

                <div class="report-file-icon">
                    <i class="fa-solid fa-file-pdf"></i>
                </div>


                <div class="report-info">

                    <h3>
                        ${titulo}
                    </h3>


                    <p>
                        Responsável:
                        ${responsavel}
                    </p>


                    <div class="report-meta">

                        <span class="report-tag">
                            ${escaparHTML(
                                periodoTexto
                            )}
                        </span>


                        <span class="report-date">
                            Criado em
                            ${dataCriacao}
                        </span>

                    </div>

                </div>


                <div class="report-activities">

                    <strong>
                        ${quantidade}
                    </strong>


                    <span>
                        ${
                            quantidade === 1
                                ? "atividade"
                                : "atividades"
                        }
                    </span>

                </div>


                <div class="report-actions">

                    <button
                        type="button"
                        class="report-action-btn"
                        title="Visualizar relatório"
                        data-acao="visualizar"
                        data-id="${id}"
                    >
                        <i class="fa-regular fa-eye"></i>
                    </button>


                    <button
                        type="button"
                        class="report-action-btn download"
                        title="Baixar PDF"
                        data-acao="baixar"
                        data-id="${id}"
                    >
                        <i class="fa-solid fa-download"></i>
                    </button>

                </div>

            </article>
        `;
    }


    /* =========================================================
       CLIQUE NOS BOTÕES DOS CARDS
    ========================================================= */

    reportsList.addEventListener(
        "click",
        evento => {

            const botao =
                evento.target.closest(
                    "[data-acao]"
                );


            if (!botao) {
                return;
            }


            const id =
                Number(
                    botao.dataset.id
                );


            const acao =
                botao.dataset.acao;


            const relatorio =
                relatorios.find(
                    item =>
                        Number(item.id) === id
                );


            if (!relatorio) {
                return;
            }


            if (
                acao === "visualizar"
            ) {

                abrirModal(
                    relatorio
                );
            }


            if (
                acao === "baixar"
            ) {

                abrirPDF(id);
            }
        }
    );


    /* =========================================================
       MODAL
    ========================================================= */

    function abrirModal(
        relatorio
    ) {

        relatorioSelecionado =
            relatorio;


        modalTitle.textContent =
            relatorio.titulo ||
            "Relatório";


        const inicio =
            relatorio.periodo_inicio
                ? formatarData(
                    relatorio.periodo_inicio
                )
                : null;


        const fim =
            formatarData(
                relatorio.periodo_fim
            );


        if (
            inicio &&
            inicio !== "Não informado"
        ) {

            modalPeriod.textContent =
                `${inicio} - ${fim}`;

        } else {

            modalPeriod.textContent =
                fim;
        }


        modalProfessor.textContent =
            relatorio.responsavel ||
            "Não informado";


        modalClass.textContent =
            formatarDataHora(
                relatorio.data_criacao
            );


        modalCourse.textContent =
            relatorio.curso ||
            "Não informado";


        modalActivities.textContent =
            Number(
                relatorio.quantidade_atividades || 0
            );


        modalDescription.textContent =
            relatorio.descricao ||
            "Nenhuma descrição informada.";


        reportModal.classList.add(
            "show"
        );


        document.body.style.overflow =
            "hidden";
    }


    /* =========================================================
       FECHAR MODAL
    ========================================================= */

    function fecharModal() {

        reportModal.classList.remove(
            "show"
        );


        document.body.style.overflow =
            "";


        relatorioSelecionado =
            null;
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


    if (reportModal) {

        reportModal.addEventListener(
            "click",
            evento => {

                if (
                    evento.target ===
                    reportModal
                ) {

                    fecharModal();
                }
            }
        );
    }


    /* =========================================================
       DOWNLOAD DO MODAL
    ========================================================= */

    if (modalDownload) {

        modalDownload.addEventListener(
            "click",
            () => {

                if (
                    !relatorioSelecionado
                ) {

                    return;
                }


                abrirPDF(
                    relatorioSelecionado.id
                );
            }
        );
    }


    /* =========================================================
       ABRIR PDF
    ========================================================= */

    function abrirPDF(id) {

        const url =
            `${API_BASE}/api/Relatorio/pdf/${id}`;


        window.open(
            url,
            "_blank"
        );
    }


    /* =========================================================
       FILTROS
    ========================================================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderizarRelatorios
        );
    }


    if (periodFilter) {

        periodFilter.addEventListener(
            "change",
            renderizarRelatorios
        );
    }


    if (courseFilter) {

        courseFilter.addEventListener(
            "change",
            renderizarRelatorios
        );
    }


    if (sortFilter) {

        sortFilter.addEventListener(
            "change",
            renderizarRelatorios
        );
    }


    /* =========================================================
       LIMPAR FILTROS
    ========================================================= */

    function limparFiltros() {

        if (searchInput) {

            searchInput.value =
                "";
        }


        if (periodFilter) {

            periodFilter.value =
                "";
        }


        if (courseFilter) {

            courseFilter.value =
                "";
        }


        renderizarRelatorios();
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
       MENU MOBILE
    ========================================================= */

    if (
        menuMobile &&
        mobileNav
    ) {

        menuMobile.addEventListener(
            "click",
            () => {

                mobileNav.classList.toggle(
                    "show"
                );
            }
        );
    }


    /* =========================================================
       LOGOUT
    ========================================================= */

    async function fazerLogout() {

        try {

            await fetch(
                `${API_BASE}/Usuario/logout`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

        } catch (erro) {

            console.error(
                "Erro ao fazer logout:",
                erro
            );

        } finally {

            window.location.href =
                "../html/login.html";
        }
    }


    if (btnLogout) {

        btnLogout.addEventListener(
            "click",
            fazerLogout
        );
    }


    if (btnLogoutMobile) {

        btnLogoutMobile.addEventListener(
            "click",
            fazerLogout
        );
    }


    /* =========================================================
       CONVERTER DATA
    ========================================================= */

    function converterData(valor) {

        if (!valor) {
            return null;
        }


        if (valor instanceof Date) {
            return valor;
        }


        const texto =
            String(valor).trim();


        /* -----------------------------------------------------
           dd/MM/yyyy HH:mm
        ----------------------------------------------------- */

        const brasileira =
            texto.match(
                /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/
            );


        if (brasileira) {

            const dia =
                Number(
                    brasileira[1]
                );


            const mes =
                Number(
                    brasileira[2]
                ) - 1;


            const ano =
                Number(
                    brasileira[3]
                );


            const hora =
                Number(
                    brasileira[4] || 0
                );


            const minuto =
                Number(
                    brasileira[5] || 0
                );


            return new Date(
                ano,
                mes,
                dia,
                hora,
                minuto
            );
        }


        /* -----------------------------------------------------
           yyyy-MM-dd
        ----------------------------------------------------- */

        const isoData =
            texto.match(
                /^(\d{4})-(\d{2})-(\d{2})/
            );


        if (isoData) {

            return new Date(
                Number(
                    isoData[1]
                ),
                Number(
                    isoData[2]
                ) - 1,
                Number(
                    isoData[3]
                )
            );
        }


        /* -----------------------------------------------------
           yyyy-MM-ddTHH:mm:ss
        ----------------------------------------------------- */

        const isoCompleto =
            texto.match(
                /^(\d{4})-(\d{2})-(\d{2})T/
            );


        if (isoCompleto) {

            const data =
                new Date(texto);


            if (
                !Number.isNaN(
                    data.getTime()
                )
            ) {

                return data;
            }
        }


        const data =
            new Date(texto);


        if (
            Number.isNaN(
                data.getTime()
            )
        ) {

            return null;
        }


        return data;
    }


    /* =========================================================
       FORMATAR DATA
    ========================================================= */

    function formatarData(valor) {

        const data =
            converterData(valor);


        if (!data) {

            return "Não informado";
        }


        return data.toLocaleDateString(
            "pt-BR"
        );
    }


    /* =========================================================
       FORMATAR DATA + HORA
    ========================================================= */

    function formatarDataHora(valor) {

        const data =
            converterData(valor);


        if (!data) {

            return "Não informado";
        }


        return data.toLocaleString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }


    /* =========================================================
       ESCAPAR HTML
    ========================================================= */

    function escaparHTML(valor) {

        return String(valor)
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

});