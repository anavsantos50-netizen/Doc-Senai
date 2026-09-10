
const senha = document.getElementById("senha");
const toggleSenha = document.getElementById("toggleSenha");

toggleSenha.addEventListener("click", function () {

    if (senha.type === "password") {

        senha.type = "text";

        toggleSenha.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

        toggleSenha.setAttribute(
            "aria-label",
            "Ocultar senha"
        );

    } else {

        senha.type = "password";

        toggleSenha.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

        toggleSenha.setAttribute(
            "aria-label",
            "Mostrar senha"
        );
    }
});

const cadastroForm = document.getElementById("cadastroForm");

cadastroForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const nome =
        document.getElementById("nome").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const senhaValue =
        document.getElementById("senha").value;

    const cargo =
        document.getElementById("cargo").value;


    if (nome === "") {

        alert("Digite seu nome.");

        return;
    }


    if (email === "") {

        alert("Digite seu e-mail.");

        return;
    }


    if (senhaValue === "") {

        alert("Digite sua senha.");

        return;
    }


    if (senhaValue.length < 6) {

        alert("A senha deve possuir pelo menos 6 caracteres.");

        return;
    }


    if (cargo === "") {

        alert("Selecione seu cargo.");

        return;
    }


  
    const usuario = {

        nome: nome,

        email: email,

        senha: senhaValue,

        cargo: cargo
    };


    console.log("Dados do cadastro:");

    console.log(usuario);


  
    alert("Cadastro realizado com sucesso!");


  


});