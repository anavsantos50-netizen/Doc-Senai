const API_BASE = "https://localhost:7082";

let modoEdicao = false;
let idAtividade = null;

let fotosSelecionadas = [];
let fotosExistentes = [];

let successOverlay;
let successButton;


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    configurarElementos();
    configurarEventos();
    configurarContadores();
    configurarModo();

    carregarTurmas();

    if (modoEdicao) {
        carregarAtividade();
    }
});


/* =========================================================
   ELEMENTOS
========================================================= */

function configurarElementos() {

    successOverlay =
        document.getElementById("successOverlay");

    successButton =
        document.getElementById("successButton");
}


/* =========================================================
   EVENTOS
========================================================= */

function configurarEventos() {

    const form =
        document.getElementById("atividadeForm");

    const btnFotos =
        document.getElementById("btnFotos");

    const adicionarMaisFotos =
        document.getElementById("adicionarMaisFotos");

    const inputFotos =
        document.getElementById("fotos");

    const uploadArea =
        document.getElementById("uploadArea");

    const menuMobile =
        document.getElementById("menuMobile");

    const mainNav =
        document.getElementById("mainNav");

    const btnLogout =
        document.getElementById("btnLogout");


    /* -----------------------------------------------------
       FORMULÁRIO
    ----------------------------------------------------- */

    if (form) {

        form.addEventListener(
            "submit",
            enviarFormulario
        );
    }


    /* -----------------------------------------------------
       BOTÃO FOTOS
    ----------------------------------------------------- */

    if (btnFotos && inputFotos) {

        btnFotos.addEventListener(
            "click",
            () => {
                inputFotos.click();
            }
        );
    }


    if (
        adicionarMaisFotos &&
        inputFotos
    ) {

        adicionarMaisFotos.addEventListener(
            "click",
            () => {
                inputFotos.click();
            }
        );
    }


    /* -----------------------------------------------------
       INPUT DE FOTOS
    ----------------------------------------------------- */

    if (inputFotos) {

        inputFotos.addEventListener(
            "change",
            (event) => {

                adicionarFotos(
                    event.target.files
                );

                inputFotos.value = "";
            }
        );
    }


    /* -----------------------------------------------------
       DRAG AND DROP
    ----------------------------------------------------- */

    if (uploadArea) {

        uploadArea.addEventListener(
            "dragover",
            (event) => {

                event.preventDefault();

                uploadArea.classList.add(
                    "dragover"
                );
            }
        );


        uploadArea.addEventListener(
            "dragleave",
            () => {

                uploadArea.classList.remove(
                    "dragover"
                );
            }
        );


        uploadArea.addEventListener(
            "drop",
            (event) => {

                event.preventDefault();

                uploadArea.classList.remove(
                    "dragover"
                );

                adicionarFotos(
                    event.dataTransfer.files
                );
            }
        );
    }


    /* -----------------------------------------------------
       MENU MOBILE
    ----------------------------------------------------- */

    if (
        menuMobile &&
        mainNav
    ) {

        menuMobile.addEventListener(
            "click",
            () => {

                mainNav.classList.toggle(
                    "open"
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
            fazerLogout
        );
    }


    /* -----------------------------------------------------
       BOTÃO DE SUCESSO
    ----------------------------------------------------- */

    if (successButton) {

        successButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "minhasAtividades.html";
            }
        );
    }
}


/* =========================================================
   CONTADORES
========================================================= */

function configurarContadores() {

    const descricao =
        document.getElementById("descricao");

    const observacao =
        document.getElementById("observacao");

    const contadorDescricao =
        document.getElementById(
            "contadorDescricao"
        );

    const contadorObservacao =
        document.getElementById(
            "contadorObservacao"
        );


    if (
        descricao &&
        contadorDescricao
    ) {

        const atualizarDescricao = () => {

            contadorDescricao.textContent =
                `${descricao.value.length} / 1000`;
        };

        descricao.addEventListener(
            "input",
            atualizarDescricao
        );

        atualizarDescricao();
    }


    if (
        observacao &&
        contadorObservacao
    ) {

        const atualizarObservacao = () => {

            contadorObservacao.textContent =
                `${observacao.value.length} / 500`;
        };

        observacao.addEventListener(
            "input",
            atualizarObservacao
        );

        atualizarObservacao();
    }
}


/* =========================================================
   MODO
========================================================= */

function configurarModo() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    idAtividade =
        params.get("id");

    modoEdicao =
        !!idAtividade;

    const titulo =
        document.querySelector(
            ".page-header h1"
        );

    const label =
        document.querySelector(
            ".page-label"
        );

    const submitButton =
        document.getElementById(
            "submitButton"
        );


    if (modoEdicao) {

        if (titulo) {
            titulo.textContent =
                "Editar atividade";
        }

        if (label) {
            label.textContent =
                "EDITAR ATIVIDADE";
        }

        if (submitButton) {

            submitButton.innerHTML = `
                <i class="fa-solid fa-check"></i>
                Salvar alterações
            `;
        }
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
                `${API_BASE}/api/Atividade/turmas`,
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
            <option value="" disabled selected>
                Selecione a turma
            </option>
        `;


        turmas.forEach(turma => {

            const option =
                document.createElement("option");

            option.value =
                turma.id_turma ??
                turma.Id_Turma;

            option.textContent =
                turma.nome_turma ??
                turma.Nome_Turma ??
                turma.curso ??
                turma.Curso ??
                "Turma";

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
   CARREGAR ATIVIDADE
========================================================= */

async function carregarAtividade() {

    if (!idAtividade) {
        return;
    }

    try {

        const resposta =
            await fetch(
                `${API_BASE}/api/Atividade/${idAtividade}`,
                {
                    credentials: "include"
                }
            );

        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar a atividade."
            );
        }

        const atividade =
            await resposta.json();


        const descricao =
            document.getElementById("descricao");

        const observacao =
            document.getElementById("observacao");

        const data =
            document.getElementById("data");

        const turma =
            document.getElementById("turma");


        if (descricao) {

            descricao.value =
                atividade.descricao_atividade ??
                atividade.Descricao_Atividade ??
                "";
        }


        if (observacao) {

            observacao.value =
                atividade.observacao ??
                atividade.Observacao ??
                "";
        }


        if (data) {

            const dataAtividade =
                atividade.data_atividade ??
                atividade.Data_Atividade;

            if (dataAtividade) {

                data.value =
                    dataAtividade
                        .substring(0, 10);
            }
        }


        if (turma) {

            const idTurma =
                atividade.fk_turma_id_turma ??
                atividade.Fk_Turma_Id_Turma ??
                atividade.turma?.id_turma ??
                atividade.turma?.Id_Turma;

            if (idTurma) {

                turma.value =
                    String(idTurma);
            }
        }


        const fotos =
            atividade.fotos ??
            atividade.Fotos ??
            [];


        fotosExistentes =
            Array.isArray(fotos)
                ? fotos
                : [];


        renderizarFotos();

    } catch (erro) {

        console.error(
            "Erro ao carregar atividade:",
            erro
        );
    }
}


/* =========================================================
   FOTOS
========================================================= */

function adicionarFotos(lista) {

    if (!lista) {
        return;
    }

    const arquivos =
        Array.from(lista);


    arquivos.forEach(arquivo => {

        if (
            !arquivo.type.startsWith(
                "image/"
            )
        ) {
            return;
        }

        if (
            arquivo.size >
            10 * 1024 * 1024
        ) {

            alert(
                `A imagem "${arquivo.name}" ultrapassa 10 MB.`
            );

            return;
        }

        fotosSelecionadas.push(
            arquivo
        );
    });


    renderizarFotos();
}


/* =========================================================
   URL FOTO
========================================================= */

function obterUrlFoto(foto) {

    if (!foto) {
        return null;
    }


    if (typeof foto === "string") {
        return foto;
    }


    return (
        foto.url ??
        foto.Url ??
        foto.caminho ??
        foto.Caminho ??
        foto.nome_arquivo ??
        foto.Nome_Arquivo ??
        null
    );
}


/* =========================================================
   TRANSFORMAR CAMINHO
========================================================= */

function transformarCaminhoFoto(caminho) {

    if (!caminho) {
        return null;
    }


    if (
        caminho.startsWith("http://") ||
        caminho.startsWith("https://")
    ) {

        return caminho;
    }


    if (
        caminho.startsWith("/")
    ) {

        return `${API_BASE}${caminho}`;
    }


    return `${API_BASE}/uploads/${caminho}`;
}


/* =========================================================
   RENDERIZAR FOTOS
========================================================= */

function renderizarFotos() {

    const previewSection =
        document.getElementById(
            "previewSection"
        );

    const previewGrid =
        document.getElementById(
            "previewGrid"
        );

    const contadorFotos =
        document.getElementById(
            "contadorFotos"
        );


    if (!previewSection || !previewGrid) {
        return;
    }


    previewGrid.innerHTML = "";


    const total =
        fotosExistentes.length +
        fotosSelecionadas.length;


    if (total === 0) {

        previewSection.style.display =
            "none";

        if (contadorFotos) {

            contadorFotos.textContent =
                "0 fotos";
        }

        return;
    }


    previewSection.style.display =
        "block";


    if (contadorFotos) {

        contadorFotos.textContent =
            `${total} ${
                total === 1
                    ? "foto"
                    : "fotos"
            }`;
    }


    /* -----------------------------------------------------
       FOTOS EXISTENTES
    ----------------------------------------------------- */

    fotosExistentes.forEach(
        (foto, index) => {

            const url =
                transformarCaminhoFoto(
                    obterUrlFoto(foto)
                );


            if (!url) {
                return;
            }


            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "preview-item";


            const img =
                document.createElement(
                    "img"
                );

            img.src = url;

            img.alt =
                "Foto da atividade";


            img.onerror = () => {

                item.remove();
            };


            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "remove-photo";

            button.innerHTML =
                '<i class="fa-solid fa-xmark"></i>';


            button.addEventListener(
                "click",
                () => {

                    fotosExistentes.splice(
                        index,
                        1
                    );

                    renderizarFotos();
                }
            );


            item.appendChild(img);

            item.appendChild(button);

            previewGrid.appendChild(item);
        }
    );


    /* -----------------------------------------------------
       NOVAS FOTOS
    ----------------------------------------------------- */

    fotosSelecionadas.forEach(
        (arquivo, index) => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "preview-item";


            const img =
                document.createElement(
                    "img"
                );


            img.src =
                URL.createObjectURL(
                    arquivo
                );

            img.alt =
                arquivo.name;


            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "remove-photo";

            button.innerHTML =
                '<i class="fa-solid fa-xmark"></i>';


            button.addEventListener(
                "click",
                () => {

                    fotosSelecionadas.splice(
                        index,
                        1
                    );

                    renderizarFotos();
                }
            );


            item.appendChild(img);

            item.appendChild(button);

            previewGrid.appendChild(item);
        }
    );
}


/* =========================================================
   ENVIAR FORMULÁRIO
========================================================= */

async function enviarFormulario(event) {

    event.preventDefault();


    const turma =
        document.getElementById("turma");

    const data =
        document.getElementById("data");

    const descricao =
        document.getElementById("descricao");

    const observacao =
        document.getElementById("observacao");

    const submitButton =
        document.getElementById(
            "submitButton"
        );


    if (
        !turma ||
        !data ||
        !descricao
    ) {
        return;
    }


    if (!turma.value) {

        alert(
            "Selecione uma turma."
        );

        return;
    }


    if (!data.value) {

        alert(
            "Informe a data da atividade."
        );

        return;
    }


    if (!descricao.value.trim()) {

        alert(
            "Informe a descrição da atividade."
        );

        return;
    }


    if (
        !modoEdicao &&
        fotosSelecionadas.length === 0
    ) {

        alert(
            "Adicione pelo menos uma foto da atividade."
        );

        return;
    }


    const formData =
        new FormData();


    formData.append(
        "Fk_Turma_Id_Turma",
        turma.value
    );


    formData.append(
        "Data_Atividade",
        data.value
    );


    formData.append(
        "Descricao_Atividade",
        descricao.value.trim()
    );


    formData.append(
        "Observacao",
        observacao
            ? observacao.value.trim()
            : ""
    );


    fotosSelecionadas.forEach(
        foto => {

            formData.append(
                "Fotos",
                foto
            );
        }
    );


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Salvando...
        `;
    }


    try {

        const url =
            modoEdicao
                ? `${API_BASE}/api/Atividade/${idAtividade}`
                : `${API_BASE}/api/Atividade/registrar`;


        const metodo =
            modoEdicao
                ? "PUT"
                : "POST";


        const resposta =
            await fetch(
                url,
                {
                    method: metodo,
                    body: formData,
                    credentials: "include"
                }
            );


        const resultado =
            await resposta.json()
                .catch(() => ({}));


        if (!resposta.ok) {

            throw new Error(
                resultado.mensagem ??
                resultado.message ??
                "Não foi possível salvar a atividade."
            );
        }


        mostrarSucesso();


    } catch (erro) {

        console.error(
            "Erro ao salvar atividade:",
            erro
        );


        alert(
            erro.message ??
            "Ocorreu um erro ao salvar a atividade."
        );


        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.innerHTML = `
                <i class="fa-solid fa-check"></i>
                ${modoEdicao
                    ? "Salvar alterações"
                    : "Registrar atividade"}
            `;
        }
    }
}


/* =========================================================
   MODAL DE SUCESSO
========================================================= */

function mostrarSucesso() {

    if (!successOverlay) {

        console.error(
            "Elemento successOverlay não encontrado."
        );

        return;
    }


    /*
       Garante que o modal fique visível
       e não desapareça sozinho.
    */

    successOverlay.style.display =
        "flex";

    successOverlay.style.opacity =
        "1";

    successOverlay.style.visibility =
        "visible";


    successOverlay.classList.add(
        "show"
    );

    successOverlay.classList.add(
        "active"
    );


    successOverlay.setAttribute(
        "aria-hidden",
        "false"
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
    }


    window.location.href =
        "login.html";
}