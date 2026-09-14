function cadastrar() {

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const cargo = document.getElementById("cargo").value;

    fetch("https://localhost:7082/Usuario", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

         credentials: "include",
         
        body: JSON.stringify({
            nome: nome,
            email: email,
            senha: senha,
            cargo: cargo
        })
    })
    .then(response => {

        if (!response.ok) {
            throw new Error("Não foi possível realizar o cadastro.");
        }

        return response.json();
    })
    .then(usuario => {

        alert("Usuário cadastrado com sucesso!");

        console.log(usuario);

    })
    .catch(error => {

        alert(error.message);

    });
}