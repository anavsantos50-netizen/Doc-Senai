const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (email === "" || senha === "") {
        alert("Preencha todos os campos.");
        return;
    }

    console.log("E-mail:", email);
    console.log("Senha:", senha);

    alert("Login realizado com sucesso!");

});
const btnCadastro = document.getElementById("btnCadastro");

if (btnCadastro) {
    btnCadastro.addEventListener("click", function () {
        window.location.href = "cadastro.html";
    });
}


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
