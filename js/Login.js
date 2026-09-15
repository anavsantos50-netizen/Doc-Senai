// =========================================================
// LOGIN
// =========================================================

function login(event) {
    event.preventDefault();

    console.log("A função login foi chamada!");

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (senha.length > 8) {
    alert("A senha deve ter no máximo 8 caracteres.");
    return;
}
    fetch("https://localhost:7082/Usuario/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",

        body: JSON.stringify({
            email: email,
            senha: senha,
            nome: "",
            cargo: ""
        })
    })
    .then(response => {
        console.log("Status:", response.status);

        if (!response.ok) {
            throw new Error("Email ou senha incorretos!");
        }

        return response.text();
    })
    .then(cargo => {
        console.log("Cargo recebido:", cargo);

        if (cargo === "Professor") {
            window.location.href = "telaInicialProfessor.html";

        } else if (cargo === "Supervisão") {
            window.location.href = "telaInicialSupervisor.html";

        } else {
            alert("Cargo não reconhecido: " + cargo);
        }
    })
    .catch(error => {
        console.error(error);
        alert(error.message);
    });
}




const toggleSenha = document.getElementById("toggleSenha");
const senhaInput = document.getElementById("senha");

if (toggleSenha && senhaInput) {

    toggleSenha.addEventListener("click", function () {

        if (senhaInput.type === "password") {

            senhaInput.type = "text";

            toggleSenha.classList.remove("fa-eye");
            toggleSenha.classList.add("fa-eye-slash");

            toggleSenha.parentElement.setAttribute(
                "aria-label",
                "Ocultar senha"
            );

        } else {

            senhaInput.type = "password";

            toggleSenha.classList.remove("fa-eye-slash");
            toggleSenha.classList.add("fa-eye");

            toggleSenha.parentElement.setAttribute(
                "aria-label",
                "Mostrar senha"
            );
        }

    });

}



const btnCadastro = document.getElementById("btnCadastro");

if (btnCadastro) {

    btnCadastro.addEventListener("click", function () {

        window.location.href = "cadastro.html";

    });

}