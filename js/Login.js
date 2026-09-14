function login(event){
    event.preventDefault();

    console.log("A função login foi chamada!");

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

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