const API_BASE = "https://localhost:7082";


// ======================================================
// INICIALIZAÇÃO
// ======================================================

document.addEventListener("DOMContentLoaded", async () => {

    configurarMenu();

    configurarFiltros();

    configurarModal();

    configurarSair();

    await carregarFiltros();

    await pesquisarRegistros();

});


// ======================================================
// MENU MOBILE
// ======================================================

function configurarMenu() {

    const menuMobile =
        document.getElementById("menuMobile");

    const mainNav =
        document.getElementById("mainNav");

    if (!menuMobile || !mainNav) {
        return;
    }

    menuMobile.addEventListener("click", () => {

        mainNav.classList.toggle("menu-aberto");

    });

}


// ======================================================
// CONFIGURAR FILTROS
// ======================================================

function configurarFiltros() {

    const formulario =
        document.getElementById("formPesquisa");

    const btnLimpar =
        document.getElementById("btnLimpar");


    if (formulario) {

        formulario.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                await pesquisarRegistros();

            }
        );

    }


    if (btnLimpar) {

        btnLimpar.addEventListener(
            "click",
            async () => {

                document.getElementById("professor").value = "";
                document.getElementById("turma").value = "";
                document.getElementById("curso").value = "";
                document.getElementById("dataInicial").value = "";
                document.getElementById("dataFinal").value = "";

                await pesquisarRegistros();

            }
        );

    }

}


// ======================================================
// CARREGAR FILTROS
// ======================================================

async function carregarFiltros() {

    try {

        await Promise.all([
            carregarProfessores(),
            carregarTurmas(),
            carregarCursos()
        ]);

    } catch (erro) {

        console.error(
            "Erro ao carregar filtros:",
            erro
        );

    }

}


// ======================================================
// PROFESSORES
// ======================================================

async function carregarProfessores() {

    const select =
        document.getElementById("professor");

    if (!select) {
        return;
    }

    const resposta = await fetch(
        `${API_BASE}/api/Supervisao/professores`,
        {
            credentials: "include"
        }
    );

    if (!resposta.ok) {

        throw new Error(
            "Não foi possível carregar os professores."
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

        option.value = professor.id;

        option.textContent =
            professor.nome;

        select.appendChild(option);

    });

}


// ======================================================
// TURMAS
// ======================================================

async function carregarTurmas() {

    const select =
        document.getElementById("turma");

    if (!select) {
        return;
    }

    const resposta = await fetch(
        `${API_BASE}/api/Supervisao/turmas`,
        {
            credentials: "include"
        }
    );

    if (!resposta.ok) {

        throw new Error(
            "Não foi possível carregar as turmas."
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

        option.value = turma.id;

        option.textContent =
            turma.nome;

        select.appendChild(option);

    });

}


// ======================================================
// CURSOS
// ======================================================

async function carregarCursos() {

    const select =
        document.getElementById("curso");

    if (!select) {
        return;
    }

    const resposta = await fetch(
        `${API_BASE}/api/Supervisao/cursos`,
        {
            credentials: "include"
        }
    );

    if (!resposta.ok) {

        throw new Error(
            "Não foi possível carregar os cursos."
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

        option.value = curso;

        option.textContent = curso;

        select.appendChild(option);

    });

}


// ======================================================
// PESQUISAR REGISTROS
// ======================================================

async function pesquisarRegistros() {

    try {

        const professor =
            document.getElementById("professor")?.value || "";

        const turma =
            document.getElementById("turma")?.value || "";

        const curso =
            document.getElementById("curso")?.value || "";

        const dataInicial =
            document.getElementById("dataInicial")?.value || "";

        const dataFinal =
            document.getElementById("dataFinal")?.value || "";


        const parametros =
            new URLSearchParams();


        if (professor) {

            parametros.append(
                "professor",
                professor
            );

        }


        if (turma) {

            parametros.append(
                "turma",
                turma
            );

        }


        if (curso) {

            parametros.append(
                "curso",
                curso
            );

        }


        if (dataInicial) {

            parametros.append(
                "dataInicial",
                dataInicial
            );

        }


        if (dataFinal) {

            parametros.append(
                "dataFinal",
                dataFinal
            );

        }


        const url =
            `${API_BASE}/api/Supervisao/registros` +
            (parametros.toString()
                ? `?${parametros.toString()}`
                : "");


        console.log(
            "Buscando registros:",
            url
        );


        const resposta =
            await fetch(url, {
                credentials: "include"
            });


        if (resposta.status === 401) {

            alert(
                "Sua sessão expirou. Faça login novamente."
            );

            window.location.href = "login.html";

            return;

        }


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível pesquisar os registros."
            );

        }


        const registros =
            await resposta.json();


        console.log(
            "REGISTROS ENCONTRADOS:",
            registros
        );


        renderizarRegistros(registros);


    } catch (erro) {

        console.error(
            "Erro ao pesquisar registros:",
            erro
        );

        renderizarRegistros([]);

        alert(
            "Não foi possível carregar os registros."
        );

    }

}


// ======================================================
// RENDERIZAR REGISTROS
// ======================================================

function renderizarRegistros(registros) {

    const secao =
        document.querySelector(".resultados-section");

    if (!secao) {
        return;
    }


    const quantidade =
        secao.querySelector(".quantidade-registros");


    if (quantidade) {

        quantidade.textContent =
            `${registros.length} ${
                registros.length === 1
                    ? "registro"
                    : "registros"
            }`;

    }


    const cardsExistentes =
        secao.querySelectorAll(".atividade-card");


    cardsExistentes.forEach(card => {

        card.remove();

    });


    if (registros.length === 0) {

        const vazio =
            document.createElement("div");

        vazio.className =
            "atividade-card";

        vazio.innerHTML = `
            <div class="atividade-info">
                <h3>Nenhum registro encontrado</h3>

                <p>
                    Não existem atividades para os filtros selecionados.
                </p>
            </div>
        `;

        secao.appendChild(vazio);

        return;

    }


    registros.forEach(registro => {

        const card =
            criarCardAtividade(registro);

        secao.appendChild(card);

    });

}


// ======================================================
// CRIAR CARD
// ======================================================

function criarCardAtividade(registro) {

    const card =
        document.createElement("article");

    card.className =
        "atividade-card";


    const partesData =
        registro.data
            ? registro.data.split("/")
            : ["-", "-", "-"];


    const dia =
        partesData[0] || "-";


    const mes =
        obterMesAbreviado(
            partesData[1]
        );


    const quantidadeFotos =
        Array.isArray(registro.fotos)
            ? registro.fotos.length
            : 0;


    const professor =
        registro.professor?.nome ||
        "-";


    const turma =
        registro.turma?.nome ||
        "-";


    const curso =
        registro.turma?.curso ||
        "-";


    const descricao =
        registro.descricao ||
        "-";


    card.innerHTML = `

        <div class="atividade-data">

            <span class="dia">
                ${dia}
            </span>

            <span class="mes">
                ${mes}
            </span>

        </div>


        <div class="atividade-info">

            <div class="atividade-topo">

                <span class="atividade-professor">

                    <i class="fa-regular fa-user"></i>

                    ${escaparHTML(professor)}

                </span>


                <span class="atividade-fotos">

                    <i class="fa-regular fa-image"></i>

                    ${quantidadeFotos}
                    ${
                        quantidadeFotos === 1
                            ? "foto"
                            : "fotos"
                    }

                </span>

            </div>


            <h3>
                ${escaparHTML(
                    primeiraLinha(descricao)
                )}
            </h3>


            <p>
                ${escaparHTML(
                    limitarTexto(descricao, 180)
                )}
            </p>


            <div class="atividade-meta">

                <span>

                    <i class="fa-solid fa-users"></i>

                    ${escaparHTML(turma)}

                </span>


                <span>

                    <i class="fa-solid fa-book"></i>

                    ${escaparHTML(curso)}

                </span>

            </div>

        </div>


        <button
            class="btn-detalhes"
            type="button"
        >

            Ver detalhes

            <i class="fa-solid fa-arrow-right"></i>

        </button>

    `;


    const botao =
        card.querySelector(".btn-detalhes");


    if (botao) {

        botao.addEventListener(
            "click",
            () => {

                abrirDetalhes(registro);

            }
        );

    }


    return card;

}


// ======================================================
// ABRIR DETALHES
// ======================================================

function abrirDetalhes(registro) {

    const modal =
        document.getElementById("modalDetalhes");

    if (!modal) {
        return;
    }


    const detalheData =
        document.getElementById("detalheData");

    const detalheProfessor =
        document.getElementById("detalheProfessor");

    const detalheTurma =
        document.getElementById("detalheTurma");

    const detalheCurso =
        document.getElementById("detalheCurso");

    const detalheDescricao =
        document.getElementById("detalheDescricao");

    const detalheObservacao =
        document.getElementById("detalheObservacao");

    const detalheFotos =
        document.getElementById("detalheFotos");


    if (detalheData) {

        detalheData.textContent =
            registro.data || "-";

    }


    if (detalheProfessor) {

        detalheProfessor.textContent =
            registro.professor?.nome || "-";

    }


    if (detalheTurma) {

        detalheTurma.textContent =
            registro.turma?.nome || "-";

    }


    if (detalheCurso) {

        detalheCurso.textContent =
            registro.turma?.curso || "-";

    }


    if (detalheDescricao) {

        detalheDescricao.textContent =
            registro.descricao || "-";

    }


    if (detalheObservacao) {

        detalheObservacao.textContent =
            registro.observacao || "-";

    }


    // ==================================================
    // FOTOS
    // ==================================================

    if (detalheFotos) {

        detalheFotos.innerHTML = "";


        const fotos =
            Array.isArray(registro.fotos)
                ? registro.fotos
                : [];


        if (fotos.length === 0) {

            detalheFotos.innerHTML = `
                <div class="foto-placeholder">

                    <i class="fa-regular fa-image"></i>

                    <span>
                        Nenhuma foto registrada
                    </span>

                </div>
            `;

        } else {

            fotos.forEach(foto => {

                const imagem =
                    document.createElement("img");

                imagem.src =
                    `${API_BASE}${foto.url}`;

                imagem.alt =
                    "Foto da atividade";

                imagem.className =
                    "foto-detalhe";


                imagem.addEventListener(
                    "error",
                    () => {

                        imagem.style.display =
                            "none";

                    }
                );


                detalheFotos.appendChild(
                    imagem
                );

            });

        }

    }


    modal.classList.add("ativo");

    document.body.style.overflow =
        "hidden";

}


// ======================================================
// CONFIGURAR MODAL
// ======================================================

function configurarModal() {

    const modal =
        document.getElementById("modalDetalhes");

    const btnFechar =
        document.getElementById("btnFecharModal");


    if (btnFechar) {

        btnFechar.addEventListener(
            "click",
            fecharModal
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (event.target === modal) {

                    fecharModal();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal?.classList.contains("ativo")
            ) {

                fecharModal();

            }

        }
    );

}


// ======================================================
// FECHAR MODAL
// ======================================================

function fecharModal() {

    const modal =
        document.getElementById("modalDetalhes");

    if (!modal) {
        return;
    }

    modal.classList.remove("ativo");

    document.body.style.overflow = "";

}


// ======================================================
// BOTÃO SAIR
// ======================================================

function configurarSair() {

    const btnSair =
        document.getElementById("btnSair");

    if (!btnSair) {
        return;
    }


    btnSair.addEventListener(
        "click",
        async () => {

            const confirmar =
                confirm(
                    "Tem certeza que deseja sair do sistema?"
                );


            if (!confirmar) {
                return;
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
                    "Erro ao sair:",
                    erro
                );

            }


            window.location.href =
                "login.html";

        }
    );

}


// ======================================================
// OBTER MÊS
// ======================================================

function obterMesAbreviado(numeroMes) {

    const meses = {

        "01": "JAN",
        "02": "FEV",
        "03": "MAR",
        "04": "ABR",
        "05": "MAI",
        "06": "JUN",
        "07": "JUL",
        "08": "AGO",
        "09": "SET",
        "10": "OUT",
        "11": "NOV",
        "12": "DEZ"

    };


    return meses[numeroMes] || "-";

}


// ======================================================
// PRIMEIRA LINHA
// ======================================================

function primeiraLinha(texto) {

    if (!texto) {
        return "Atividade registrada";
    }


    const textoLimpo =
        String(texto).trim();


    if (textoLimpo.length <= 55) {

        return textoLimpo;

    }


    return textoLimpo.substring(0, 55) + "...";

}


// ======================================================
// LIMITAR TEXTO
// ======================================================

function limitarTexto(texto, limite) {

    if (!texto) {
        return "-";
    }


    texto =
        String(texto);


    if (texto.length <= limite) {

        return texto;

    }


    return texto.substring(0, limite) + "...";

}


// ======================================================
// ESCAPAR HTML
// ======================================================

function escaparHTML(texto) {

    if (texto === null ||
        texto === undefined) {

        return "";

    }


    const div =
        document.createElement("div");

    div.textContent =
        String(texto);

    return div.innerHTML;

}