// ======================================================
// TELA INICIAL - SUPERVISÃO
// ======================================================

const API_BASE = "https://localhost:7082";


// ======================================================
// CARREGAR DASHBOARD
// ======================================================

async function carregarDashboard() {

    try {

        const resposta =
            await fetch(
                `${API_BASE}/api/Supervisao/dashboard`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        // --------------------------------------------------
        // USUÁRIO NÃO AUTENTICADO
        // --------------------------------------------------

        if (resposta.status === 401) {

            window.location.href =
                "login.html";

            return;
        }


        // --------------------------------------------------
        // ACESSO NEGADO
        // --------------------------------------------------

        if (resposta.status === 403) {

            alert(
                "Você não possui permissão para acessar esta área."
            );

            window.location.href =
                "login.html";

            return;
        }


        if (!resposta.ok) {

            throw new Error(
                "Erro ao carregar o dashboard."
            );
        }


        const dados =
            await resposta.json();


        console.log(
            "DADOS DO DASHBOARD:",
            dados
        );


        // ==================================================
        // NOME DA SUPERVISÃO
        // ==================================================

        const nomeSupervisor =
            document.getElementById(
                "nomeSupervisor"
            );


        if (nomeSupervisor) {

            nomeSupervisor.textContent =
                dados.nome || "Supervisor";
        }


        // --------------------------------------------------
        // NOME NO TOPO
        // --------------------------------------------------

        const nomeSupervisorTopo =
            document.getElementById(
                "nomeSupervisorTopo"
            );


        if (nomeSupervisorTopo) {

            nomeSupervisorTopo.textContent =
                dados.nome || "Supervisão";
        }


        // ==================================================
        // TOTAL DE ATIVIDADES
        // ==================================================

        const totalAtividades =
            document.getElementById(
                "totalAtividades"
            );


        if (totalAtividades) {

            totalAtividades.textContent =
                dados.totalAtividades ?? 0;
        }


        // ==================================================
        // TOTAL DE TURMAS
        // ==================================================

        const totalTurmas =
            document.getElementById(
                "totalTurmas"
            );


        if (totalTurmas) {

            totalTurmas.textContent =
                dados.totalTurmas ?? 0;
        }


        // ==================================================
        // TOTAL DE PROFESSORES
        // ==================================================

        const totalProfessores =
            document.getElementById(
                "totalProfessores"
            );


        if (totalProfessores) {

            totalProfessores.textContent =
                dados.totalProfessores ?? 0;
        }


        // ==================================================
        // TOTAL DE RELATÓRIOS
        // ==================================================

        const totalRelatorios =
            document.getElementById(
                "totalRelatorios"
            );


        if (totalRelatorios) {

            totalRelatorios.textContent =
                dados.totalRelatorios ?? 0;
        }


        // ==================================================
        // GRÁFICO
        // ==================================================

        montarGrafico(
            dados.grafico || []
        );


        // ==================================================
        // ATIVIDADES RECENTES
        // ==================================================

        montarAtividadesRecentes(
            dados.atividadesRecentes || []
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

        alert(
            "Não foi possível carregar os dados da Supervisão."
        );
    }
}



// ======================================================
// MONTAR GRÁFICO SEMANAL
// ======================================================

function montarGrafico(dados) {

    const svg =
        document.querySelector(
            ".line-chart"
        );


    if (!svg) {
        return;
    }


    // --------------------------------------------------
    // LIMPAR GRÁFICO
    // --------------------------------------------------

    svg.innerHTML = "";


    if (
        !dados ||
        dados.length === 0
    ) {

        return;
    }


    // --------------------------------------------------
    // DIMENSÕES DO SVG
    // --------------------------------------------------

    const largura = 700;

    const altura = 260;

    const margemEsquerda = 20;

    const margemDireita = 20;

    const margemSuperior = 20;

    const margemInferior = 20;


    const larguraUtil =
        largura -
        margemEsquerda -
        margemDireita;


    const alturaUtil =
        altura -
        margemSuperior -
        margemInferior;


    // --------------------------------------------------
    // MAIOR QUANTIDADE
    // --------------------------------------------------

    const maiorValor =
        Math.max(
            ...dados.map(item =>
                Number(item.quantidade) || 0
            )
        );


    // --------------------------------------------------
    // ESCALA DO GRÁFICO
    // --------------------------------------------------

    let maximo;


    if (maiorValor <= 5) {

        maximo = 5;

    } else if (maiorValor <= 10) {

        maximo = 10;

    } else if (maiorValor <= 20) {

        maximo = 20;

    } else if (maiorValor <= 30) {

        maximo = 30;

    } else {

        maximo =
            Math.ceil(
                maiorValor / 10
            ) * 10;
    }


    // --------------------------------------------------
    // CALCULAR PONTOS
    // --------------------------------------------------

    const pontos = [];


    dados.forEach(
        (item, index) => {

            const quantidade =
                Number(item.quantidade) || 0;


            let x;


            // Distribuir igualmente os pontos
            if (dados.length === 1) {

                x =
                    margemEsquerda +
                    larguraUtil / 2;

            } else {

                x =
                    margemEsquerda +
                    (
                        index /
                        (dados.length - 1)
                    ) *
                    larguraUtil;
            }


            const y =
                margemSuperior +
                alturaUtil -
                (
                    quantidade /
                    maximo
                ) *
                alturaUtil;


            pontos.push({

                x: x,

                y: y,

                quantidade: quantidade,

                periodo:
                    item.periodo || ""

            });

        }
    );


    // ==================================================
    // LINHA
    // ==================================================

    const polyline =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "polyline"
        );


    polyline.setAttribute(
        "points",
        pontos
            .map(p =>
                `${p.x},${p.y}`
            )
            .join(" ")
    );


    polyline.setAttribute(
        "fill",
        "none"
    );


    polyline.setAttribute(
        "stroke",
        "#7182F5"
    );


    polyline.setAttribute(
        "stroke-width",
        "4"
    );


    polyline.setAttribute(
        "stroke-linecap",
        "round"
    );


    polyline.setAttribute(
        "stroke-linejoin",
        "round"
    );


    svg.appendChild(
        polyline
    );


    // ==================================================
    // PONTOS
    // ==================================================

    pontos.forEach(
        ponto => {

            const circle =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "circle"
                );


            circle.setAttribute(
                "cx",
                ponto.x
            );


            circle.setAttribute(
                "cy",
                ponto.y
            );


            circle.setAttribute(
                "r",
                "5"
            );


            circle.setAttribute(
                "fill",
                "#7182F5"
            );


            svg.appendChild(
                circle
            );

        }
    );


    // ==================================================
    // EIXO Y
    // ==================================================

    const eixoY =
        document.querySelector(
            ".chart-y"
        );


    if (eixoY) {

        eixoY.innerHTML = "";


        const valoresY = [
            maximo,
            Math.round(
                maximo * 0.75
            ),
            Math.round(
                maximo * 0.5
            ),
            Math.round(
                maximo * 0.25
            ),
            0
        ];


        valoresY.forEach(
            valor => {

                const span =
                    document.createElement(
                        "span"
                    );


                span.textContent =
                    valor;


                eixoY.appendChild(
                    span
                );

            }
        );

    }


    // ==================================================
    // EIXO X
    // ==================================================

    const eixoX =
        document.querySelector(
            ".chart-x"
        );


    if (eixoX) {

        eixoX.innerHTML = "";


        dados.forEach(
            item => {

                const span =
                    document.createElement(
                        "span"
                    );


                span.textContent =
                    item.periodo || "";


                eixoX.appendChild(
                    span
                );

            }
        );

    }

}



// ======================================================
// ATIVIDADES RECENTES
// ======================================================

function montarAtividadesRecentes(atividades) {

    const lista =
        document.querySelector(
            ".recent-list"
        );


    if (!lista) {
        return;
    }


    // --------------------------------------------------
    // LIMPAR DADOS ANTIGOS
    // --------------------------------------------------

    lista.innerHTML = "";


    // --------------------------------------------------
    // NENHUMA ATIVIDADE
    // --------------------------------------------------

    if (
        !atividades ||
        atividades.length === 0
    ) {

        const mensagem =
            document.createElement(
                "div"
            );


        mensagem.className =
            "recent-empty";


        mensagem.textContent =
            "Nenhuma atividade registrada ainda.";


        lista.appendChild(
            mensagem
        );


        return;
    }


    // --------------------------------------------------
    // CRIAR ATIVIDADES
    // --------------------------------------------------

    atividades.forEach(
        atividade => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "recent-item";


            // ==========================================
            // DATA
            // ==========================================

            const data =
                document.createElement(
                    "div"
                );


            data.className =
                "recent-date";


            const dia =
                document.createElement(
                    "strong"
                );


            dia.textContent =
                atividade.dia;


            const mes =
                document.createElement(
                    "span"
                );


            mes.textContent =
                atividade.mes;


            data.appendChild(
                dia
            );


            data.appendChild(
                mes
            );


            // ==========================================
            // INFORMAÇÕES
            // ==========================================

            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "recent-info";


            const professor =
                document.createElement(
                    "strong"
                );


            professor.textContent =
                atividade.professor ||
                "Professor não informado";


            const turma =
                document.createElement(
                    "span"
                );


            turma.textContent =
                atividade.turma ||
                "Turma não informada";


            info.appendChild(
                professor
            );


            info.appendChild(
                turma
            );


            // ==========================================
            // MONTAR ITEM
            // ==========================================

            item.appendChild(
                data
            );


            item.appendChild(
                info
            );


            lista.appendChild(
                item
            );

        }
    );

}



// ======================================================
// MENU MOBILE
// ======================================================

function configurarMenuMobile() {

    const menuMobile =
        document.getElementById(
            "menuMobile"
        );

    const mobileNav =
        document.getElementById(
            "mobileNav"
        );


    if (
        !menuMobile ||
        !mobileNav
    ) {
        return;
    }


    menuMobile.addEventListener(
        "click",
        () => {

            const aberto =
                mobileNav.classList.toggle(
                    "ativo"
                );


            menuMobile.setAttribute(
                "aria-expanded",
                aberto ? "true" : "false"
            );

        }
    );


    // Fecha o menu quando clicar em algum link

    const links =
        mobileNav.querySelectorAll(
            ".mobile-nav-link"
        );


    links.forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    mobileNav.classList.remove(
                        "ativo"
                    );


                    menuMobile.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );

}

// ======================================================
// DATA ATUAL
// ======================================================

const dataAtual =
    document.getElementById(
        "dataAtual"
    );


if (dataAtual) {

    const hoje =
        new Date();


    const opcoes = {

        weekday: "long",

        day: "2-digit",

        month: "long",

        year: "numeric"

    };


    let dataFormatada =
        hoje.toLocaleDateString(
            "pt-BR",
            opcoes
        );


    dataFormatada =
        dataFormatada.charAt(0).toUpperCase() +
        dataFormatada.slice(1);


    dataAtual.textContent =
        dataFormatada;

}



// ======================================================
// BOTÃO SAIR
// ======================================================

const btnSair =
    document.getElementById(
        "btnSair"
    );


if (btnSair) {

    btnSair.addEventListener(
        "click",
        () => {

            const confirmar =
                confirm(
                    "Deseja realmente sair?"
                );


            // --------------------------------------------------
            // CANCELAR
            // --------------------------------------------------

            if (!confirmar) {

                return;

            }


            // --------------------------------------------------
            // CONFIRMAR SAÍDA
            // --------------------------------------------------

            window.location.href =
                "login.html";

        }
    );

}


// ======================================================
// INICIAR DASHBOARD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        configurarMenuMobile();

        carregarDashboard();

    }
);