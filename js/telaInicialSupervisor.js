// ======================================================
// TELA INICIAL - SUPERVISÃO
// ======================================================


// ======================================================
// MENU MOBILE
// ======================================================

const menuMobile = document.getElementById("menuMobile");
const mainNav = document.querySelector(".main-nav");

if (menuMobile && mainNav) {

    menuMobile.addEventListener("click", () => {

        mainNav.classList.toggle("menu-aberto");

    });

}


// ======================================================
// DATA ATUAL
// ======================================================

const dataAtual = document.getElementById("dataAtual");

if (dataAtual) {

    const hoje = new Date();

    const opcoes = {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    };

    let dataFormatada = hoje.toLocaleDateString(
        "pt-BR",
        opcoes
    );

    // Deixa a primeira letra maiúscula
    dataFormatada =
        dataFormatada.charAt(0).toUpperCase() +
        dataFormatada.slice(1);

    dataAtual.textContent = dataFormatada;

}


// ======================================================
// BOTÃO SAIR
// ======================================================

const btnSair = document.getElementById("btnSair");

if (btnSair) {

    btnSair.addEventListener("click", () => {

        const confirmar = confirm(
            "Tem certeza que deseja sair do sistema?"
        );

        if (confirmar) {

            // Futuramente vamos limpar o login/token aqui.

            window.location.href = "login.html";

        }

    });

}


// ======================================================
// ACESSOS RÁPIDOS
// ======================================================

const btnPesquisar =
    document.getElementById("btnPesquisar");

if (btnPesquisar) {

    btnPesquisar.addEventListener("click", () => {

        window.location.href =
            "atividadesSupervisao.html";

    });

}


const btnRelatorios =
    document.getElementById("btnRelatorios");

if (btnRelatorios) {

    btnRelatorios.addEventListener("click", () => {

        window.location.href =
            "relatoriosSupervisao.html";

    });

}


const btnProfessores =
    document.getElementById("btnProfessores");

if (btnProfessores) {

    btnProfessores.addEventListener("click", () => {

        window.location.href =
            "professoresSupervisao.html";

    });

}


// ======================================================
// GRÁFICO DE ATIVIDADES
// ======================================================

const grafico = document.getElementById("graficoAtividades");

if (grafico) {

    const ctx = grafico.getContext("2d");

    const dados = [8, 12, 10, 15, 18, 14, 20];

    const labels = [
        "09/09",
        "10/09",
        "11/09",
        "12/09",
        "13/09",
        "14/09",
        "15/09"
    ];


    // ----------------------------------------------
    // TAMANHO DO GRÁFICO
    // ----------------------------------------------

    function ajustarGrafico() {

        const largura =
            grafico.parentElement.clientWidth;

        grafico.width = largura;
        grafico.height = 280;

        desenharGrafico();

    }


    // ----------------------------------------------
    // DESENHAR GRÁFICO
    // ----------------------------------------------

    function desenharGrafico() {

        ctx.clearRect(
            0,
            0,
            grafico.width,
            grafico.height
        );


        const largura = grafico.width;
        const altura = grafico.height;


        const margemEsquerda = 45;
        const margemDireita = 20;
        const margemTopo = 25;
        const margemInferior = 45;


        const larguraGrafico =
            largura -
            margemEsquerda -
            margemDireita;


        const alturaGrafico =
            altura -
            margemTopo -
            margemInferior;


        const maiorValor =
            Math.max(...dados);


        // ------------------------------------------
        // LINHAS HORIZONTAIS
        // ------------------------------------------

        ctx.font = "11px Poppins, sans-serif";
        ctx.textAlign = "right";

        for (let i = 0; i <= 4; i++) {

            const valor =
                Math.round(
                    maiorValor -
                    (maiorValor / 4) * i
                );

            const y =
                margemTopo +
                (alturaGrafico / 4) * i;


            ctx.strokeStyle = "#E8EAF0";
            ctx.lineWidth = 1;

            ctx.beginPath();

            ctx.moveTo(
                margemEsquerda,
                y
            );

            ctx.lineTo(
                largura - margemDireita,
                y
            );

            ctx.stroke();


            ctx.fillStyle = "#8A90A2";

            ctx.fillText(
                valor,
                margemEsquerda - 10,
                y + 4
            );

        }


        // ------------------------------------------
        // PONTOS
        // ------------------------------------------

        const pontos = [];


        dados.forEach((valor, index) => {

            const x =
                margemEsquerda +
                (larguraGrafico /
                    (dados.length - 1)) *
                index;


            const y =
                margemTopo +
                alturaGrafico -
                (valor / maiorValor) *
                alturaGrafico;


            pontos.push({
                x: x,
                y: y
            });

        });


        // ------------------------------------------
        // LINHA DO GRÁFICO
        // ------------------------------------------

        ctx.strokeStyle = "#192E75";
        ctx.lineWidth = 3;

        ctx.beginPath();

        pontos.forEach((ponto, index) => {

            if (index === 0) {

                ctx.moveTo(
                    ponto.x,
                    ponto.y
                );

            } else {

                ctx.lineTo(
                    ponto.x,
                    ponto.y
                );

            }

        });

        ctx.stroke();


        // ------------------------------------------
        // PONTOS
        // ------------------------------------------

        pontos.forEach((ponto) => {

            ctx.fillStyle = "#FFFFFF";

            ctx.beginPath();

            ctx.arc(
                ponto.x,
                ponto.y,
                5,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.strokeStyle = "#192E75";
            ctx.lineWidth = 3;

            ctx.stroke();

        });


        // ------------------------------------------
        // DATAS
        // ------------------------------------------

        ctx.font = "10px Poppins, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#8A90A2";


        labels.forEach((label, index) => {

            const x =
                margemEsquerda +
                (larguraGrafico /
                    (labels.length - 1)) *
                index;


            ctx.fillText(
                label,
                x,
                altura - 15
            );

        });

    }


    // ----------------------------------------------
    // INICIAR
    // ----------------------------------------------

    ajustarGrafico();


    // ----------------------------------------------
    // RESPONSIVIDADE
    // ----------------------------------------------

    window.addEventListener(
        "resize",
        ajustarGrafico
    );

}


// ======================================================
// ANIMAÇÃO DOS NÚMEROS DOS CARDS
// ======================================================

const numeros =
    document.querySelectorAll(".numero-card");


numeros.forEach((elemento) => {

    const valorFinal =
        parseInt(elemento.textContent);


    if (isNaN(valorFinal)) {
        return;
    }


    let valorAtual = 0;

    const duracao = 800;

    const intervalo =
        Math.max(
            20,
            duracao / valorFinal
        );


    elemento.textContent = "0";


    const contador =
        setInterval(() => {

            valorAtual++;

            elemento.textContent =
                valorAtual;


            if (valorAtual >= valorFinal) {

                clearInterval(contador);

                elemento.textContent =
                    valorFinal;

            }

        }, intervalo);

});