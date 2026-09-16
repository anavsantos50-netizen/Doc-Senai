document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // CONFIGURAÇÃO
    // =========================================================

    const API_URL = "https://localhost:7082";

    // =========================================================
    // ELEMENTOS
    // =========================================================

    const nomeProfessor = document.getElementById("nomeProfessor");
    const dataAtual = document.getElementById("dataAtual");

    const totalAtividades = document.getElementById("totalAtividades");
    const totalEvidencias = document.getElementById("totalEvidencias");
    const totalTurmas = document.getElementById("totalTurmas");

    const atividadesRecentes = document.getElementById("atividadesRecentes");

    const btnSair = document.getElementById("btnSair");
    const menuMobile = document.getElementById("menuMobile");
    const mainNav = document.getElementById("mainNav");

    // =========================================================
    // DATA ATUAL
    // =========================================================

    function mostrarDataAtual() {

        const agora = new Date();

        const dataFormatada = agora.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        if (dataAtual) {
            dataAtual.textContent = dataFormatada;
        }
    }

    // =========================================================
    // FORMATAR DATA DA ATIVIDADE
    // =========================================================

    function formatarData(data) {

        if (!data) {
            return "";
        }

        const dataObj = new Date(data);

        return dataObj.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    // =========================================================
    // ESCAPAR HTML
    // =========================================================

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

    // =========================================================
    // CARREGAR DADOS DA HOME
    // =========================================================

    async function carregarHome() {

        try {

            const resposta = await fetch(
                `${API_URL}/api/ProfessorInicio`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (resposta.status === 401) {

                alert("Sua sessão expirou. Faça login novamente.");

                window.location.href = "Login.html";

                return;
            }

            if (!resposta.ok) {

                throw new Error(
                    `Erro ao carregar os dados. Status: ${resposta.status}`
                );
            }

            const dados = await resposta.json();

            console.log("Dados da Home:", dados);

            preencherProfessor(dados);

            preencherResumo(dados);

            preencherAtividadesRecentes(
                dados.atividades_recentes
            );

        } catch (erro) {

            console.error("Erro:", erro);

            if (atividadesRecentes) {

                atividadesRecentes.innerHTML = `
                    <div class="activity-empty">
                        <p>
                            Não foi possível carregar as atividades.
                        </p>
                    </div>
                `;
            }
        }
    }

    // =========================================================
    // PREENCHER PROFESSOR
    // =========================================================

  function preencherProfessor(dados) {

    if (dados.nome) {

        const nome =
            escaparHTML(dados.nome);

        const nomeProfessor =
            document.getElementById("nomeProfessor");

        const nomeProfessorTopo =
            document.getElementById("nomeProfessorTopo");


        if (nomeProfessor) {
            nomeProfessor.textContent = nome;
        }


        if (nomeProfessorTopo) {
            nomeProfessorTopo.textContent = nome;
        }
    }
}

    // =========================================================
    // PREENCHER RESUMO
    // =========================================================

    function preencherResumo(dados) {

        if (totalAtividades) {

            totalAtividades.textContent =
                dados.total_atividades_mes ?? 0;
        }

        if (totalEvidencias) {

            totalEvidencias.textContent =
                dados.total_evidencias_mes ?? 0;
        }

        if (totalTurmas) {

            totalTurmas.textContent =
                dados.total_turmas ?? 0;
        }
    }

    // =========================================================
    // PREENCHER ATIVIDADES RECENTES
    // =========================================================

    function preencherAtividadesRecentes(atividades) {

        if (!atividadesRecentes) {
            return;
        }

        if (!Array.isArray(atividades) ||
            atividades.length === 0) {

            atividadesRecentes.innerHTML = `
                <div class="activity-empty">
                    <p>
                        Você ainda não possui atividades registradas.
                    </p>

                    <a
                        href="registrarAtividade.html"
                        class="register-empty-button"
                    >
                        Registrar atividade
                    </a>
                </div>
            `;

            return;
        }

        atividadesRecentes.innerHTML = "";

        atividades.forEach(atividade => {

            const item = document.createElement("article");

            item.className = "activity-item";

            const descricao =
                escaparHTML(atividade.descricao);

            const observacao =
                escaparHTML(atividade.observacao);

            const turma =
                escaparHTML(atividade.turma || "Turma não informada");

            const curso =
                escaparHTML(atividade.curso || "");

            const quantidadeFotos =
                atividade.quantidade_fotos ?? 0;

            const data =
                formatarData(atividade.data);

            item.innerHTML = `
                
                <div class="activity-date">
                    ${data}
                </div>

                <div class="activity-type">
                    <i class="fa-solid fa-book-open"></i>
                </div>

                <div class="activity-info">

                    <h3>
                        ${descricao || "Atividade registrada"}
                    </h3>

                    ${
                        observacao
                            ? `<p>${observacao}</p>`
                            : ""
                    }

                    <div class="activity-class">

                        <span>
                            <i class="fa-solid fa-users"></i>

                            ${turma}
                        </span>

                        ${
                            curso
                                ? `
                                    <span>
                                        <i class="fa-solid fa-graduation-cap"></i>
                                        ${curso}
                                    </span>
                                `
                                : ""
                        }

                        <span class="activity-photos">

                            <i class="fa-solid fa-camera"></i>

                            ${quantidadeFotos}
                            ${
                                quantidadeFotos === 1
                                    ? "evidência"
                                    : "evidências"
                            }

                        </span>

                    </div>

                </div>

                <button
                    type="button"
                    class="view-button"
                    data-id="${atividade.id_atividade}"
                >
                    Ver atividade
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            `;

            atividadesRecentes.appendChild(item);
        });

        configurarBotoesAtividades();
    }

    // =========================================================
    // BOTÕES "VER ATIVIDADE"
    // =========================================================

    function configurarBotoesAtividades() {

        const botoes =
            document.querySelectorAll(".view-button");

        botoes.forEach(botao => {

            botao.addEventListener("click", () => {

                const id =
                    botao.dataset.id;

                if (!id) {
                    return;
                }

                window.location.href =
                    `visualizarAtividade.html?id=${id}`;
            });
        });
    }

    // =========================================================
    // MENU MOBILE
    // =========================================================

    if (menuMobile && mainNav) {

        menuMobile.addEventListener("click", () => {

            const aberto =
                mainNav.classList.toggle("show");

            menuMobile.setAttribute(
                "aria-expanded",
                aberto ? "true" : "false"
            );
        });

        const links =
            mainNav.querySelectorAll(".nav-link");

        links.forEach(link => {

            link.addEventListener("click", () => {

                mainNav.classList.remove("show");

                menuMobile.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });
        });
    }

    // =========================================================
    // LOGOUT
    // =========================================================

    if (btnSair) {

        btnSair.addEventListener("click", async () => {

            const confirmar =
                confirm("Deseja realmente sair?");

            if (!confirmar) {
                return;
            }

            try {

                /*
                 * Por enquanto apenas voltamos para o login.
                 * Depois podemos criar o endpoint de logout
                 * para destruir a sessão no backend.
                 */

                window.location.href = "Login.html";

            } catch (erro) {

                console.error(
                    "Erro ao sair:",
                    erro
                );

                window.location.href =
                    "Login.html";
            }
        });
    }

    // =========================================================
    // INICIALIZAÇÃO
    // =========================================================

    mostrarDataAtual();

    carregarHome();

});