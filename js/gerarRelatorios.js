/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const API_BASE = "https://localhost:7082";

let atividades = [];

let atividadesSelecionadas = new Set();

let gerandoRelatorio = false;


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    configurarMenu();

    configurarLogout();

    configurarFiltros();

    configurarSelecao();

    configurarGeracao();

    carregarProfessores();

    carregarTurmas();

    carregarCursos();

    buscarAtividades();

});


/* =========================================================
   MENU MOBILE
========================================================= */

function configurarMenu() {

    const btnMenu =
        document.getElementById("menuMobile");

    const mobileNav =
        document.getElementById("mobileNav");


    if (!btnMenu || !mobileNav) {
        return;
    }


    btnMenu.addEventListener("click", () => {

        const aberto =
            mobileNav.classList.toggle("ativo");


        btnMenu.setAttribute(
            "aria-expanded",
            aberto ? "true" : "false"
        );

    });


    const links =
        mobileNav.querySelectorAll("a");


    links.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mobileNav.classList.remove(
                    "ativo"
                );


                btnMenu.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }
        );

    });

}


/* =========================================================
   LOGOUT
========================================================= */

function configurarLogout() {

    const btnLogout =
        document.getElementById("btnLogout");

    const btnLogoutMobile =
        document.getElementById("btnLogoutMobile");


    async function fazerLogout(event) {

        if (event) {
            event.preventDefault();
        }


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
                "Erro ao realizar logout:",
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

}


/* =========================================================
   FILTROS
========================================================= */

function configurarFiltros() {

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


    if (professor) {

        professor.addEventListener(
            "change",
            buscarAtividades
        );

    }


    if (turma) {

        turma.addEventListener(
            "change",
            buscarAtividades
        );

    }


    if (curso) {

        curso.addEventListener(
            "change",
            buscarAtividades
        );

    }


    if (dataInicio) {

        dataInicio.addEventListener(
            "change",
            buscarAtividades
        );

    }


    if (dataFim) {

        dataFim.addEventListener(
            "change",
            buscarAtividades
        );

    }

}


/* =========================================================
   CARREGAR PROFESSORES
========================================================= */

async function carregarProfessores() {

    const select =
        document.getElementById("professor");


    if (!select) {
        return;
    }


    try {

        const resposta =
            await fetch(
                `${API_BASE}/api/Supervisao/professores`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!resposta.ok) {

            throw new Error(
                `Erro ao carregar professores: ${resposta.status}`
            );

        }


        const professores =
            await resposta.json();


        select.innerHTML = `
            <option value="">
                Todos os professores
            </option>
        `;


        professores.forEach(professor => {

            const option =
                document.createElement("option");


            option.value =
                professor.id;


            option.textContent =
                professor.nome;


            select.appendChild(option);

        });


    } catch (erro) {

        console.error(
            "Erro ao carregar professores:",
            erro
        );

    }

}


/* =========================================================
   CARREGAR TURMAS
========================================================= */

async function carregarTurmas() {

    const select =
        document.getElementById("turma");


    if (!select) {
        return;
    }


    try {

        const resposta =
            await fetch(
                `${API_BASE}/api/Supervisao/turmas`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!resposta.ok) {

            throw new Error(
                `Erro ao carregar turmas: ${resposta.status}`
            );

        }


        const turmas =
            await resposta.json();


        select.innerHTML = `
            <option value="">
                Todas as turmas
            </option>
        `;


        turmas.forEach(turma => {

            const option =
                document.createElement("option");


            option.value =
                turma.id;


            option.textContent =
                turma.nome;


            select.appendChild(option);

        });


    } catch (erro) {

        console.error(
            "Erro ao carregar turmas:",
            erro
        );

    }

}


/* =========================================================
   CARREGAR CURSOS
========================================================= */

async function carregarCursos() {

    const select =
        document.getElementById("curso");


    if (!select) {
        return;
    }


    try {

        const resposta =
            await fetch(
                `${API_BASE}/api/Supervisao/cursos`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!resposta.ok) {

            throw new Error(
                `Erro ao carregar cursos: ${resposta.status}`
            );

        }


        const cursos =
            await resposta.json();


        select.innerHTML = `
            <option value="">
                Todos os cursos
            </option>
        `;


        cursos.forEach(curso => {

            const option =
                document.createElement("option");


            option.value =
                curso;


            option.textContent =
                curso;


            select.appendChild(option);

        });


    } catch (erro) {

        console.error(
            "Erro ao carregar cursos:",
            erro
        );

    }

}


/* =========================================================
   BUSCAR ATIVIDADES
========================================================= */

async function buscarAtividades() {

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


    const parametros =
        new URLSearchParams();


    if (professor && professor.value) {

        parametros.append(
            "professor",
            professor.value
        );

    }


    if (turma && turma.value) {

        parametros.append(
            "turma",
            turma.value
        );

    }


    if (curso && curso.value) {

        parametros.append(
            "curso",
            curso.value
        );

    }


    if (dataInicio && dataInicio.value) {

        parametros.append(
            "dataInicial",
            dataInicio.value
        );

    }


    if (dataFim && dataFim.value) {

        parametros.append(
            "dataFinal",
            dataFim.value
        );

    }


    const url =
        `${API_BASE}/api/Supervisao/registros?${parametros.toString()}`;


    console.log(
        "========== BUSCANDO ATIVIDADES =========="
    );

    console.log(
        "URL:",
        url
    );


    try {

        const resposta =
            await fetch(
                url,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!resposta.ok) {

            const erroTexto =
                await resposta.text();


            console.error(
                "Erro retornado pela API:",
                erroTexto
            );


            throw new Error(
                `Erro ao buscar atividades: ${resposta.status}`
            );

        }


        atividades =
            await resposta.json();


        console.log(
            "ATIVIDADES RECEBIDAS:",
            atividades
        );


        atividadesSelecionadas =
            new Set(
                atividades.map(
                    atividade =>
                        atividade.id
                )
            );


        renderizarAtividades();

        atualizarQuantidade();

        atualizarSelecionadas();

        atualizarCheckboxTodas();


    } catch (erro) {

        console.error(
            "Erro ao buscar atividades:",
            erro
        );


        atividades = [];

        atividadesSelecionadas.clear();


        renderizarAtividades();

        atualizarQuantidade();

        atualizarSelecionadas();

        atualizarCheckboxTodas();

    }

}


/* =========================================================
   RENDERIZAR ATIVIDADES
========================================================= */

function renderizarAtividades() {

    const lista =
        document.getElementById("activitiesList");

    const noResults =
        document.getElementById("noResults");


    if (!lista) {
        return;
    }


    lista.innerHTML = "";


    if (atividades.length === 0) {

        if (noResults) {

            noResults.style.display =
                "flex";

        }

        return;

    }


    if (noResults) {

        noResults.style.display =
            "none";

    }


    atividades.forEach(atividade => {

        const item =
            document.createElement("div");


        item.className =
            "activity-item";


        const selecionada =
            atividadesSelecionadas.has(
                atividade.id
            );


        item.innerHTML = `

            <label class="activity-checkbox">

                <input
                    type="checkbox"
                    class="checkbox-atividade"
                    data-id="${atividade.id}"
                    ${selecionada ? "checked" : ""}
                >

                <span class="custom-checkbox">

                    <i class="fa-solid fa-check"></i>

                </span>

            </label>


            <div class="activity-content">

                <div class="activity-main">

                    <div class="activity-date">

                        <i class="fa-regular fa-calendar"></i>

                        <span>
                            ${escaparHTML(
                                atividade.data || ""
                            )}
                        </span>

                    </div>


                    <h3>
                        ${escaparHTML(
                            primeiraLinha(
                                atividade.descricao || ""
                            )
                        )}
                    </h3>


                    ${
                        atividade.observacao
                            ? `
                                <p>
                                    ${escaparHTML(
                                        atividade.observacao
                                    )}
                                </p>
                              `
                            : ""
                    }

                </div>


                <div class="activity-details">

                    <span>

                        <i class="fa-solid fa-user"></i>

                        ${escaparHTML(
                            atividade.professor?.nome ||
                            "Professor não informado"
                        )}

                    </span>


                    <span>

                        <i class="fa-solid fa-users"></i>

                        ${escaparHTML(
                            atividade.turma?.nome ||
                            "Turma não informada"
                        )}

                    </span>


                    <span>

                        <i class="fa-solid fa-graduation-cap"></i>

                        ${escaparHTML(
                            atividade.turma?.curso ||
                            "Curso não informado"
                        )}

                    </span>

                </div>

            </div>

        `;


        lista.appendChild(item);

    });


    configurarCheckboxes();

}


/* =========================================================
   CHECKBOXES INDIVIDUAIS
========================================================= */

function configurarCheckboxes() {

    const checkboxes =
        document.querySelectorAll(
            ".checkbox-atividade"
        );


    checkboxes.forEach(checkbox => {

        checkbox.addEventListener(
            "change",
            () => {

                const id =
                    Number(
                        checkbox.dataset.id
                    );


                if (checkbox.checked) {

                    atividadesSelecionadas.add(
                        id
                    );

                } else {

                    atividadesSelecionadas.delete(
                        id
                    );

                }


                atualizarSelecionadas();

                atualizarCheckboxTodas();

            }
        );

    });

}


/* =========================================================
   SELECIONAR TODAS
========================================================= */

function configurarSelecao() {

    const checkboxTodas =
        document.getElementById(
            "selecionarTodas"
        );


    if (!checkboxTodas) {
        return;
    }


    checkboxTodas.addEventListener(
        "change",
        () => {

            if (checkboxTodas.checked) {

                atividades.forEach(
                    atividade => {

                        atividadesSelecionadas.add(
                            atividade.id
                        );

                    }
                );

            } else {

                atividadesSelecionadas.clear();

            }


            renderizarAtividades();

            atualizarSelecionadas();

            atualizarCheckboxTodas();

        }
    );

}


/* =========================================================
   ATUALIZAR CHECKBOX "TODAS"
========================================================= */

function atualizarCheckboxTodas() {

    const checkboxTodas =
        document.getElementById(
            "selecionarTodas"
        );


    if (!checkboxTodas) {
        return;
    }


    if (atividades.length === 0) {

        checkboxTodas.checked =
            false;

        checkboxTodas.indeterminate =
            false;

        return;

    }


    const quantidade =
        atividadesSelecionadas.size;


    if (quantidade === atividades.length) {

        checkboxTodas.checked =
            true;

        checkboxTodas.indeterminate =
            false;

    } else if (quantidade > 0) {

        checkboxTodas.checked =
            false;

        checkboxTodas.indeterminate =
            true;

    } else {

        checkboxTodas.checked =
            false;

        checkboxTodas.indeterminate =
            false;

    }

}


/* =========================================================
   ATUALIZAR QUANTIDADE ENCONTRADAS
========================================================= */

function atualizarQuantidade() {

    const elemento =
        document.getElementById(
            "quantidadeEncontradas"
        );


    if (!elemento) {
        return;
    }


    elemento.textContent =
        atividades.length;

}


/* =========================================================
   ATUALIZAR QUANTIDADE SELECIONADAS
========================================================= */

function atualizarSelecionadas() {

    const elemento =
        document.getElementById(
            "quantidadeSelecionadas"
        );


    if (!elemento) {
        return;
    }


    const quantidade =
        atividadesSelecionadas.size;


    elemento.textContent =
        `${quantidade} selecionada${
            quantidade === 1
                ? ""
                : "s"
        }`;


    const resumo =
        document.getElementById(
            "summaryText"
        );


    if (resumo) {

        if (quantidade === 0) {

            resumo.textContent =
                "Nenhuma atividade selecionada.";

        } else if (quantidade === 1) {

            resumo.textContent =
                "1 atividade selecionada.";

        } else {

            resumo.textContent =
                `${quantidade} atividades selecionadas.`;

        }

    }

}


/* =========================================================
   CONFIGURAR GERAÇÃO
========================================================= */

function configurarGeracao() {

    const botao =
        document.getElementById(
            "btnGerar"
        );


    if (!botao) {

        console.error(
            "Botão #btnGerar não encontrado."
        );

        return;

    }


    botao.addEventListener(
        "click",
        gerarRelatorio
    );

}


/* =========================================================
   GERAR RELATÓRIO
========================================================= */

async function gerarRelatorio(event) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();

    }


    if (gerandoRelatorio) {
        return;
    }


    /* =====================================================
       CAMPOS
    ===================================================== */

    const campoTitulo =
        document.getElementById(
            "tituloRelatorio"
        );

    const campoProfessor =
        document.getElementById(
            "professor"
        );

    const campoTurma =
        document.getElementById(
            "turma"
        );

    const campoCurso =
        document.getElementById(
            "curso"
        );

    const campoInicio =
        document.getElementById(
            "dataInicio"
        );

    const campoFim =
        document.getElementById(
            "dataFim"
        );


    const titulo =
        campoTitulo
            ? campoTitulo.value.trim()
            : "";


    /* =====================================================
       VALIDAR TÍTULO
    ===================================================== */

    if (!titulo) {

        alert(
            "Preencha o título do relatório."
        );


        if (campoTitulo) {
            campoTitulo.focus();
        }


        return;

    }


    /* =====================================================
       VALIDAR PROFESSOR
    ===================================================== */

    if (
        !campoProfessor ||
        !campoProfessor.value
    ) {

        alert(
            "Selecione um professor."
        );


        if (campoProfessor) {
            campoProfessor.focus();
        }


        return;

    }


    /* =====================================================
       VALIDAR TURMA
    ===================================================== */

    if (
        !campoTurma ||
        !campoTurma.value
    ) {

        alert(
            "Selecione uma turma."
        );


        if (campoTurma) {
            campoTurma.focus();
        }


        return;

    }


    /* =====================================================
       VALIDAR CURSO
    ===================================================== */

    if (
        !campoCurso ||
        !campoCurso.value
    ) {

        alert(
            "Selecione um curso."
        );


        if (campoCurso) {
            campoCurso.focus();
        }


        return;

    }


    /* =====================================================
       VALIDAR DATA INICIAL
    ===================================================== */

    if (
        !campoInicio ||
        !campoInicio.value
    ) {

        alert(
            "Selecione a data inicial."
        );


        if (campoInicio) {
            campoInicio.focus();
        }


        return;

    }


    /* =====================================================
       VALIDAR DATA FINAL
    ===================================================== */

    if (
        !campoFim ||
        !campoFim.value
    ) {

        alert(
            "Selecione a data final."
        );


        if (campoFim) {
            campoFim.focus();
        }


        return;

    }


    /* =====================================================
       VALIDAR PERÍODO
    ===================================================== */

    if (
        campoInicio.value >
        campoFim.value
    ) {

        alert(
            "A data inicial não pode ser maior que a data final."
        );


        campoInicio.focus();


        return;

    }


    /* =====================================================
       ATIVIDADES SELECIONADAS
    ===================================================== */

    const idsSelecionados =
        Array.from(
            atividadesSelecionadas
        );


    if (
        idsSelecionados.length === 0
    ) {

        alert(
            "Selecione pelo menos uma atividade."
        );


        return;

    }


    /* =====================================================
       DADOS DOS FILTROS
    ===================================================== */

    const professor =
        Number(
            campoProfessor.value
        );


    const turma =
        Number(
            campoTurma.value
        );


    const curso =
        campoCurso.value;


    const inicio =
        campoInicio.value;


    const fim =
        campoFim.value;


    /* =====================================================
       PERÍODO
    ===================================================== */

    const periodoInicio =
        `${inicio}T00:00:00`;


    const periodoFim =
        `${fim}T23:59:59`;


    /* =====================================================
       DADOS PARA API
    ===================================================== */

    const dados = {

        titulo: titulo,

        professor: professor,

        turma: turma,

        curso: curso,

        periodoInicio:
            periodoInicio,

        periodoFim:
            periodoFim,

        atividades:
            idsSelecionados

    };


    console.log(
        "=========================================="
    );

    console.log(
        "GERANDO RELATÓRIO..."
    );

    console.log(
        "DADOS ENVIADOS PARA A API:",
        dados
    );


    /* =====================================================
       BOTÃO
    ===================================================== */

    const botao =
        document.getElementById(
            "btnGerar"
        );


    const textoOriginal =
        botao
            ? botao.innerHTML
            : "";


    if (botao) {

        botao.disabled =
            true;


        botao.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Gerando relatório...
        `;

    }


    gerandoRelatorio =
        true;


    /* =====================================================
       ENVIAR PARA API
    ===================================================== */

    try {

        const resposta =
            await fetch(
                `${API_BASE}/api/Relatorio/gerar`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials:
                        "include",

                    body:
                        JSON.stringify(
                            dados
                        )
                }
            );


        console.log(
            "STATUS HTTP:",
            resposta.status
        );


        const textoResposta =
            await resposta.text();


        console.log(
            "RESPOSTA DA API:",
            textoResposta
        );


        let resultado =
            null;


        try {

            resultado =
                textoResposta
                    ? JSON.parse(
                        textoResposta
                    )
                    : null;

        } catch (erroJSON) {

            console.error(
                "Erro ao interpretar JSON:",
                erroJSON
            );


            throw new Error(
                "A API retornou uma resposta inválida."
            );

        }


        /* =================================================
           VERIFICAR ERRO
        ================================================= */

        if (!resposta.ok) {

            const mensagem =
                resultado?.mensagem ||
                resultado?.title ||
                "Não foi possível gerar o relatório.";


            throw new Error(
                mensagem
            );

        }


        /* =================================================
           SUCESSO
        ================================================= */

        console.log(
            "RELATÓRIO GERADO COM SUCESSO!"
        );


        console.log(
            "RESULTADO:",
            resultado
        );


        mostrarMensagemSucesso();


    } catch (erro) {

        console.error(
            "ERRO AO GERAR RELATÓRIO:",
            erro
        );


        alert(
            erro.message ||
            "Ocorreu um erro ao gerar o relatório."
        );


    } finally {

        gerandoRelatorio =
            false;


        if (botao) {

            botao.disabled =
                false;


            botao.innerHTML =
                textoOriginal ||
                `
                    <i class="fa-solid fa-file-pdf"></i>
                    Gerar relatório
                `;

        }

    }

}


/* =========================================================
   MENSAGEM DE SUCESSO
========================================================= */

function mostrarMensagemSucesso() {

    alert(
        "Relatório gerado com sucesso!\n\n" +
        "Vá para Relatórios Gerados."
    );


    window.location.href =
        "../html/relatoriosGerados.html";

}


/* =========================================================
   PRIMEIRA LINHA DA DESCRIÇÃO
========================================================= */

function primeiraLinha(texto) {

    if (!texto) {
        return "";
    }


    return String(texto)
        .split(/\r?\n/)[0]
        .trim();

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escaparHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


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