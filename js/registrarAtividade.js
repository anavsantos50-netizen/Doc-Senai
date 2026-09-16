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

    campoData.value =
        `${ano}-${mes}-${dia}`;

}


/* =========================================================
   CONTADORES
========================================================= */

const descricao =
    document.getElementById("descricao");

const observacao =
    document.getElementById("observacao");

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

    atualizarContador(
        descricao,
        contadorDescricao
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

    atualizarContador(
        observacao,
        contadorObservacao
    );

}


/* =========================================================
   ELEMENTOS DAS FOTOS
========================================================= */

const fotosInput =
    document.getElementById("fotos");

const btnFotos =
    document.getElementById("btnFotos");

const uploadArea =
    document.getElementById("uploadArea");

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
   ABRIR SELEÇÃO DE FOTOS
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


            if (arquivo.size > limiteTamanho) {

                alert(
                    `A imagem "${arquivo.name}" ultrapassa o limite de 10 MB.`
                );

                return;
            }


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


            arquivosSelecionados.push(
                arquivo
            );

        }
    );


    atualizarPreview();

}


/* =========================================================
   ATUALIZAR PREVIEW
========================================================= */

function atualizarPreview() {

    if (!previewGrid) {
        return;
    }

    previewGrid.innerHTML = "";


    if (arquivosSelecionados.length === 0) {

        if (previewSection) {
            previewSection.style.display = "none";
        }

        if (contadorFotos) {
            contadorFotos.textContent = "0 fotos";
        }

        return;
    }


    if (previewSection) {
        previewSection.style.display = "block";
    }


    const quantidade =
        arquivosSelecionados.length;


    if (contadorFotos) {

        contadorFotos.textContent =
            quantidade === 1
                ? "1 foto selecionada"
                : `${quantidade} fotos selecionadas`;

    }


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

            uploadArea.classList.add(
                "dragover"
            );

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
   CARREGAR TURMAS DO PROFESSOR
========================================================= */

const campoTurma =
    document.getElementById("turma");


async function carregarTurmas() {

    if (!campoTurma) {
        return;
    }


    try {

        const resposta =
            await fetch(
                "https://localhost:7082/api/Atividade/turmas",
                {
                    method: "GET",
                    credentials: "include"
                }
            );


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
                "Não foi possível carregar as turmas."
            );

        }


        const turmas =
            await resposta.json();


        campoTurma.innerHTML =
            '<option value="">Selecione a turma</option>';


        turmas.forEach(
            function (turma) {

                const option =
                    document.createElement("option");

                option.value =
                    turma.id_turma;

                option.textContent =
                    `${turma.nome_turma} - ${turma.curso}`;

                campoTurma.appendChild(
                    option
                );

            }
        );


        if (turmas.length === 0) {

            campoTurma.innerHTML =
                '<option value="">Nenhuma turma vinculada</option>';

        }

    }
    catch (erro) {

        console.error(
            "Erro ao carregar turmas:",
            erro
        );

        alert(
            "Não foi possível carregar as turmas do professor."
        );

    }

}


carregarTurmas();


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
        async function (event) {

            event.preventDefault();


            /* ==========================
               CAMPOS
            ========================== */

            const turma =
                document.getElementById(
                    "turma"
                ).value;

            const data =
                document.getElementById(
                    "data"
                ).value;

            const descricaoValue =
                document
                    .getElementById("descricao")
                    .value
                    .trim();

            const observacaoValue =
                document
                    .getElementById("observacao")
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


            try {

                /* ==========================
                   FORMDATA
                ========================== */

                const formData =
                    new FormData();


                formData.append(
                    "Fk_Turma_Id_Turma",
                    turma
                );


                formData.append(
                    "Data_Atividade",
                    data
                );


                formData.append(
                    "Descricao_Atividade",
                    descricaoValue
                );


                formData.append(
                    "Observacao",
                    observacaoValue
                );


                /* ==========================
                   ADICIONA FOTOS
                ========================== */

                arquivosSelecionados.forEach(
                    function (arquivo) {

                        formData.append(
                            "Fotos",
                            arquivo
                        );

                    }
                );


                /* ==========================
                   ENVIA PARA API
                ========================== */

                const resposta =
                    await fetch(
                        "https://localhost:7082/api/Atividade/registrar",
                        {
                            method: "POST",
                            credentials: "include",
                            body: formData
                        }
                    );


                /* ==========================
                   LÊ RESPOSTA
                ========================== */

                const resultado =
                    await resposta.json();


                if (!resposta.ok) {

                    throw new Error(
                        resultado.mensagem ||
                        "Não foi possível registrar a atividade."
                    );

                }


                /* ==========================
                   SUCESSO
                ========================== */

                console.log(
                    "Atividade registrada:",
                    resultado
                );


                submitButton.disabled =
                    false;

                submitButton.innerHTML =
                    '<i class="fa-solid fa-check"></i> Registrar atividade';


                /* ==========================
                   ABRE MODAL
                ========================== */

                if (successOverlay) {

                    successOverlay.classList.add(
                        "show"
                    );

                }

            }
            catch (erro) {

                console.error(
                    "Erro ao registrar atividade:",
                    erro
                );


                submitButton.disabled =
                    false;

                submitButton.innerHTML =
                    '<i class="fa-solid fa-check"></i> Registrar atividade';


                alert(
                    erro.message ||
                    "Ocorreu um erro ao registrar a atividade."
                );

            }

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