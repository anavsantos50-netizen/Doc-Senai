/* =========================================================
   MENU MOBILE
========================================================= */

const menuMobile = document.getElementById("menuMobile");
const mainNav = document.getElementById("mainNav");

if (menuMobile && mainNav) {

    menuMobile.addEventListener("click", function () {

        mainNav.classList.toggle("open");

        const icon = menuMobile.querySelector("i");

        if (mainNav.classList.contains("open")) {

            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");

            menuMobile.setAttribute(
                "aria-label",
                "Fechar menu"
            );

        } else {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

            menuMobile.setAttribute(
                "aria-label",
                "Abrir menu"
            );
        }

    });

}


/* =========================================================
   DATA ATUAL
========================================================= */

const campoData = document.getElementById("data");

if (campoData) {

    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = String(
        hoje.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        hoje.getDate()
    ).padStart(2, "0");

    campoData.value = `${ano}-${mes}-${dia}`;

}


/* =========================================================
   CONTADORES
========================================================= */

const descricao = document.getElementById("descricao");
const observacao = document.getElementById("observacao");

const contadorDescricao =
    document.getElementById("contadorDescricao");

const contadorObservacao =
    document.getElementById("contadorObservacao");


function atualizarContador(campo, contador) {

    if (!campo || !contador) {
        return;
    }

    contador.textContent =
        `${campo.value.length} / ${campo.maxLength}`;

}


if (descricao) {

    descricao.addEventListener(
        "input",
        function () {

            atualizarContador(
                descricao,
                contadorDescricao
            );

        }
    );

}


if (observacao) {

    observacao.addEventListener(
        "input",
        function () {

            atualizarContador(
                observacao,
                contadorObservacao
            );

        }
    );

}


/* =========================================================
   UPLOAD DE FOTOS
========================================================= */

const fotosInput = document.getElementById("fotos");

const btnFotos = document.getElementById("btnFotos");

const uploadArea = document.getElementById("uploadArea");

const previewSection =
    document.getElementById("previewSection");

const previewGrid =
    document.getElementById("previewGrid");

const contadorFotos =
    document.getElementById("contadorFotos");

const adicionarMaisFotos =
    document.getElementById("adicionarMaisFotos");


let arquivosSelecionados = [];


/* =========================================================
   ABRIR SELEÇÃO DE ARQUIVOS
========================================================= */

if (btnFotos) {

    btnFotos.addEventListener(
        "click",
        function () {

            fotosInput.click();

        }
    );

}


if (adicionarMaisFotos) {

    adicionarMaisFotos.addEventListener(
        "click",
        function () {

            fotosInput.click();

        }
    );

}


/* =========================================================
   SELEÇÃO DE ARQUIVOS
========================================================= */

if (fotosInput) {

    fotosInput.addEventListener(
        "change",
        function (event) {

            adicionarArquivos(
                event.target.files
            );

            fotosInput.value = "";

        }
    );

}


/* =========================================================
   ADICIONAR ARQUIVOS
========================================================= */

function adicionarArquivos(arquivos) {

    const limiteTamanho =
        10 * 1024 * 1024;

    const formatosPermitidos = [
        "image/jpeg",
        "image/jpg",
        "image/png"
    ];


    Array.from(arquivos).forEach(
        function (arquivo) {

            /* Verifica formato */

            if (
                !formatosPermitidos.includes(
                    arquivo.type
                )
            ) {

                alert(
                    `O arquivo "${arquivo.name}" não possui um formato permitido.`
                );

                return;
            }


            /* Verifica tamanho */

            if (arquivo.size > limiteTamanho) {

                alert(
                    `A imagem "${arquivo.name}" ultrapassa o limite de 10 MB.`
                );

                return;
            }


            /* Evita duplicados */

            const arquivoJaExiste =
                arquivosSelecionados.some(
                    function (item) {

                        return (
                            item.name === arquivo.name &&
                            item.size === arquivo.size
                        );

                    }
                );


            if (arquivoJaExiste) {
                return;
            }


            arquivosSelecionados.push(arquivo);

        }
    );


    atualizarPreview();

}


/* =========================================================
   ATUALIZAR PREVIEW
========================================================= */

function atualizarPreview() {

    previewGrid.innerHTML = "";


    if (arquivosSelecionados.length === 0) {

        previewSection.style.display = "none";

        contadorFotos.textContent = "0 fotos";

        return;
    }


    previewSection.style.display = "block";


    const quantidade =
        arquivosSelecionados.length;


    contadorFotos.textContent =
        quantidade === 1
            ? "1 foto selecionada"
            : `${quantidade} fotos selecionadas`;


    arquivosSelecionados.forEach(
        function (arquivo, index) {

            const container =
                document.createElement("div");

            container.className =
                "photo-preview";


            const imagem =
                document.createElement("img");

            const url =
                URL.createObjectURL(arquivo);

            imagem.src = url;

            imagem.alt =
                `Foto ${index + 1}`;


            imagem.onload = function () {

                URL.revokeObjectURL(url);

            };


            const remover =
                document.createElement("button");

            remover.type = "button";

            remover.className =
                "remove-photo";

            remover.innerHTML =
                '<i class="fa-solid fa-xmark"></i>';

            remover.title =
                "Remover foto";


            remover.addEventListener(
                "click",
                function () {

                    removerArquivo(index);

                }
            );


            container.appendChild(imagem);

            container.appendChild(remover);

            previewGrid.appendChild(container);

        }
    );

}


/* =========================================================
   REMOVER ARQUIVO
========================================================= */

function removerArquivo(index) {

    arquivosSelecionados.splice(
        index,
        1
    );

    atualizarPreview();

}


/* =========================================================
   DRAG AND DROP
========================================================= */

if (uploadArea) {

    uploadArea.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();

            uploadArea.classList.add("dragover");

        }
    );


    uploadArea.addEventListener(
        "dragleave",
        function () {

            uploadArea.classList.remove(
                "dragover"
            );

        }
    );


    uploadArea.addEventListener(
        "drop",
        function (event) {

            event.preventDefault();

            uploadArea.classList.remove(
                "dragover"
            );

            adicionarArquivos(
                event.dataTransfer.files
            );

        }
    );

}


/* =========================================================
   FORMULÁRIO
========================================================= */

const atividadeForm =
    document.getElementById("atividadeForm");

const submitButton =
    document.getElementById("submitButton");

const successOverlay =
    document.getElementById("successOverlay");

const successButton =
    document.getElementById("successButton");


if (atividadeForm) {

    atividadeForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* ==========================
               CAMPOS
            ========================== */

            const turma =
                document.getElementById("turma").value;

            const data =
                document.getElementById("data").value;

            const descricaoValue =
                document
                    .getElementById("descricao")
                    .value
                    .trim();


            /* ==========================
               VALIDA TURMA
            ========================== */

            if (!turma) {

                alert(
                    "Selecione a turma da atividade."
                );

                document
                    .getElementById("turma")
                    .focus();

                return;
            }


            /* ==========================
               VALIDA DATA
            ========================== */

            if (!data) {

                alert(
                    "Informe a data da atividade."
                );

                document
                    .getElementById("data")
                    .focus();

                return;
            }


            /* ==========================
               VALIDA DESCRIÇÃO
            ========================== */

            if (!descricaoValue) {

                alert(
                    "Digite a descrição da atividade."
                );

                document
                    .getElementById("descricao")
                    .focus();

                return;
            }


            if (descricaoValue.length < 10) {

                alert(
                    "A descrição deve possuir pelo menos 10 caracteres."
                );

                document
                    .getElementById("descricao")
                    .focus();

                return;
            }


            /* ==========================
               VALIDA FOTOS
            ========================== */

            if (
                arquivosSelecionados.length === 0
            ) {

                alert(
                    "Adicione pelo menos uma fotografia da atividade."
                );

                uploadArea.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                return;
            }


            /* ==========================
               DESABILITA BOTÃO
            ========================== */

            submitButton.disabled = true;

            submitButton.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Registrando...';


            /* ==========================
               SIMULA SALVAMENTO
               
               Depois será substituído
               pelo fetch da API.
            ========================== */

            setTimeout(
                function () {

                    submitButton.disabled = false;

                    submitButton.innerHTML =
                        '<i class="fa-solid fa-check"></i> Registrar atividade';


                    /* Abre modal */

                    successOverlay.classList.add(
                        "show"
                    );


                    /* Mostra no console */

                    console.log(
                        "Atividade registrada:"
                    );

                    console.log({
                        turma: turma,
                        data: data,
                        descricao: descricaoValue,
                        observacao:
                            observacao.value.trim(),
                        fotos:
                            arquivosSelecionados
                    });


                },
                900
            );

        }
    );

}


/* =========================================================
   BOTÃO DO MODAL
========================================================= */

if (successButton) {

    successButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "telaInicialProfessor.html";

        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

const btnLogout =
    document.getElementById("btnLogout");

if (btnLogout) {

    btnLogout.addEventListener(
        "click",
        function () {

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