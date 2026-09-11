/* =====================================================
   MENU MOBILE
===================================================== */

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");

if (mobileMenuBtn && mobileNav) {

    mobileMenuBtn.addEventListener("click", () => {

        mobileNav.classList.toggle("show");

        const icon = mobileMenuBtn.querySelector("i");

        if (mobileNav.classList.contains("show")) {

            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

    });

}


/* =====================================================
   DADOS FICTÍCIOS
   Depois serão substituídos pelos dados da API/SQL
===================================================== */

const registros = [

    {
        id: 1,

        titulo: "Introdução ao desenvolvimento web",

        descricao:
            "Apresentação dos conceitos básicos de desenvolvimento web, estrutura de páginas HTML e organização de um projeto.",

        observacao:
            "Os alunos participaram da atividade prática e desenvolveram uma pequena página utilizando HTML.",

        turma: "Informática 2026",

        turmaId: "info2026",

        data: "2026-09-08",

        fotos: [
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900",
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900",
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900"
        ]

    },

    {
        id: 2,

        titulo: "Atividade prática de programação",

        descricao:
            "Desenvolvimento de exercícios práticos envolvendo lógica de programação, variáveis e estruturas condicionais.",

        observacao:
            "A turma realizou os exercícios individualmente e posteriormente foram discutidas as soluções.",

        turma: "Informática 2026",

        turmaId: "info2026",

        data: "2026-09-05",

        fotos: [
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900",
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=900"
        ]

    },

    {
        id: 3,

        titulo: "Segurança no ambiente profissional",

        descricao:
            "Discussão sobre segurança, prevenção de acidentes e boas práticas no ambiente profissional.",

        observacao:
            "Foi realizada uma dinâmica com os alunos para identificação de situações de risco.",

        turma: "Administração 2026",

        turmaId: "adm2026",

        data: "2026-08-28",

        fotos: [
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900",
            "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900"
        ]

    },

    {
        id: 4,

        titulo: "Trabalho em equipe",

        descricao:
            "Atividade voltada ao desenvolvimento da comunicação, colaboração e trabalho em equipe entre os participantes.",

        observacao:
            "Os alunos foram divididos em grupos para realizar a atividade proposta.",

        turma: "Administração 2026",

        turmaId: "adm2026",

        data: "2026-08-21",

        fotos: [
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900"
        ]

    },

    {
        id: 5,

        titulo: "Introdução aos processos industriais",

        descricao:
            "Apresentação dos principais conceitos relacionados aos processos industriais e sua aplicação no ambiente profissional.",

        observacao:
            "Foi utilizado material visual para complementar a explicação.",

        turma: "Mecânica 2026",

        turmaId: "mec2026",

        data: "2026-07-24",

        fotos: [
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900",
            "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=900",
            "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900"
        ]

    },

    {
        id: 6,

        titulo: "Avaliação prática",

        descricao:
            "Realização de atividade prática para verificar a compreensão dos conteúdos trabalhados durante as aulas anteriores.",

        observacao:
            "A atividade foi realizada individualmente.",

        turma: "Mecânica 2026",

        turmaId: "mec2026",

        data: "2026-07-17",

        fotos: [
            "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900"
        ]

    }

];


/* =====================================================
   ELEMENTOS
===================================================== */

const recordsList = document.getElementById("recordsList");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");
const turmaFilter = document.getElementById("turmaFilter");
const periodoFilter = document.getElementById("periodoFilter");

const resultsCount = document.getElementById("resultsCount");

const sortSelect = document.getElementById("sortSelect");

const clearFilters = document.getElementById("clearFilters");
const emptyClearBtn = document.getElementById("emptyClearBtn");


/* =====================================================
   FORMATAÇÃO DE DATA
===================================================== */

function formatarData(data) {

    const partes = data.split("-");

    const ano = partes[0];
    const mes = partes[1];
    const dia = partes[2];

    return `${dia}/${mes}/${ano}`;
}


function obterMes(data) {

    const meses = [
        "JAN",
        "FEV",
        "MAR",
        "ABR",
        "MAI",
        "JUN",
        "JUL",
        "AGO",
        "SET",
        "OUT",
        "NOV",
        "DEZ"
    ];

    const mes = Number(data.split("-")[1]);

    return meses[mes - 1];
}


/* =====================================================
   RENDERIZAR REGISTROS
===================================================== */

function renderizarRegistros(lista) {

    recordsList.innerHTML = "";

    if (lista.length === 0) {

        recordsList.style.display = "none";
        emptyState.style.display = "block";

        resultsCount.textContent = "0 registros encontrados";

        return;
    }

    recordsList.style.display = "flex";
    emptyState.style.display = "none";

    resultsCount.textContent =
        `${lista.length} ${lista.length === 1 ? "registro encontrado" : "registros encontrados"}`;


    lista.forEach(registro => {

        const card = document.createElement("article");

        card.className = "record-card";


        const [ano, mes, dia] = registro.data.split("-");


        card.innerHTML = `

            <div class="record-date">

                <span class="day">
                    ${dia}
                </span>

                <span class="month">
                    ${obterMes(registro.data)}
                </span>

            </div>


            <div class="record-main">

                <h2>
                    ${registro.titulo}
                </h2>

                <p class="record-description">
                    ${registro.descricao}
                </p>

                <div class="record-meta">

                    <span>
                        <i class="fa-solid fa-users"></i>
                        ${registro.turma}
                    </span>

                    <span>
                        <i class="fa-regular fa-calendar"></i>
                        ${formatarData(registro.data)}
                    </span>

                </div>

            </div>


            <div class="record-photos">

                <span class="photo-count">

                    <i class="fa-regular fa-images"></i>

                    ${registro.fotos.length}
                    ${registro.fotos.length === 1 ? "foto" : "fotos"}

                </span>


                <button
                    type="button"
                    class="details-btn"
                    data-id="${registro.id}">

                    Ver detalhes

                    <i class="fa-solid fa-arrow-right"></i>

                </button>

            </div>

        `;


        recordsList.appendChild(card);

    });


    adicionarEventosDetalhes();
}


/* =====================================================
   DETALHES
===================================================== */

function adicionarEventosDetalhes() {

    const botoes =
        document.querySelectorAll(".details-btn");


    botoes.forEach(botao => {

        botao.addEventListener("click", () => {

            const id = Number(botao.dataset.id);

            abrirDetalhes(id);

        });

    });

}


/* =====================================================
   MODAL
===================================================== */

const detailsModal =
    document.getElementById("detailsModal");

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

const modalDescription =
    document.getElementById("modalDescription");

const modalObservation =
    document.getElementById("modalObservation");

const modalPhotoCount =
    document.getElementById("modalPhotoCount");

const modalGallery =
    document.getElementById("modalGallery");

const observationSection =
    document.getElementById("observationSection");


function abrirDetalhes(id) {

    const registro =
        registros.find(item => item.id === id);


    if (!registro) {
        return;
    }


    modalTitle.textContent =
        registro.titulo;

    modalDate.textContent =
        formatarData(registro.data);

    modalTurma.textContent =
        registro.turma;

    modalDescription.textContent =
        registro.descricao;


    if (registro.observacao &&
        registro.observacao.trim() !== "") {

        modalObservation.textContent =
            registro.observacao;

        observationSection.style.display =
            "block";

    } else {

        observationSection.style.display =
            "none";

    }


    modalPhotoCount.textContent =
        `${registro.fotos.length} ${
            registro.fotos.length === 1
                ? "foto"
                : "fotos"
        }`;


    modalGallery.innerHTML = "";


    registro.fotos.forEach((foto, index) => {

        const imagem =
            document.createElement("img");

        imagem.src = foto;

        imagem.alt =
            `Evidência pedagógica ${index + 1}`;

        imagem.loading = "lazy";

        modalGallery.appendChild(imagem);

    });


    detailsModal.classList.add("show");

    document.body.style.overflow = "hidden";

}


/* =====================================================
   FECHAR MODAL
===================================================== */

function fecharModal() {

    detailsModal.classList.remove("show");

    document.body.style.overflow = "";

}


modalClose.addEventListener(
    "click",
    fecharModal
);

modalCloseBottom.addEventListener(
    "click",
    fecharModal
);


detailsModal.addEventListener(
    "click",
    event => {

        if (event.target === detailsModal) {

            fecharModal();

        }

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            fecharModal();

        }

    }
);


/* =====================================================
   FILTROS
===================================================== */

function aplicarFiltros() {

    const busca =
        searchInput.value
            .trim()
            .toLowerCase();

    const turma =
        turmaFilter.value;

    const periodo =
        periodoFilter.value;


    let resultado =
        registros.filter(registro => {

            const correspondeBusca =
                registro.titulo
                    .toLowerCase()
                    .includes(busca)

                ||

                registro.descricao
                    .toLowerCase()
                    .includes(busca);


            const correspondeTurma =
                turma === "todas"
                ||
                registro.turmaId === turma;


            const correspondePeriodo =
                periodo === "todos"
                ||
                registro.data.startsWith(periodo);


            return (
                correspondeBusca
                &&
                correspondeTurma
                &&
                correspondePeriodo
            );

        });


    /* ORDENAR */

    if (sortSelect.value === "recent") {

        resultado.sort(
            (a, b) =>
                new Date(b.data) -
                new Date(a.data)
        );

    } else {

        resultado.sort(
            (a, b) =>
                new Date(a.data) -
                new Date(b.data)
        );

    }


    renderizarRegistros(resultado);

}


/* =====================================================
   EVENTOS DOS FILTROS
===================================================== */

searchInput.addEventListener(
    "input",
    aplicarFiltros
);

turmaFilter.addEventListener(
    "change",
    aplicarFiltros
);

periodoFilter.addEventListener(
    "change",
    aplicarFiltros
);

sortSelect.addEventListener(
    "change",
    aplicarFiltros
);


/* =====================================================
   LIMPAR FILTROS
===================================================== */

function limparFiltros() {

    searchInput.value = "";

    turmaFilter.value = "todas";

    periodoFilter.value = "todos";

    sortSelect.value = "recent";

    aplicarFiltros();

}


clearFilters.addEventListener(
    "click",
    limparFiltros
);

emptyClearBtn.addEventListener(
    "click",
    limparFiltros
);


/* =====================================================
   LOGOUT
===================================================== */

const btnLogout =
    document.getElementById("btnLogout");

if (btnLogout) {

    btnLogout.addEventListener(
        "click",
        () => {

            const confirmar =
                confirm(
                    "Deseja realmente sair da sua conta?"
                );

            if (confirmar) {

                window.location.href =
                    "login.html";

            }

        }
    );

}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        aplicarFiltros();

    }
);