

const recuperacaoForm =
    document.getElementById("recuperacaoForm");


if (recuperacaoForm) {

    recuperacaoForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const email =
            document.getElementById("email").value.trim();


  

        if (email === "") {

            alert("Digite seu e-mail.");

            document.getElementById("email").focus();

            return;
        }




        const emailValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailValido.test(email)) {

            alert("Digite um e-mail válido.");

            document.getElementById("email").focus();

            return;
        }


    

        const recuperacao = {

            email: email

        };


        console.log("Solicitação de recuperação:");

        console.log(recuperacao);


      

        alert(
            "Se o e-mail estiver cadastrado, " +
            "você receberá as instruções para " +
            "recuperar sua senha."
        );



        window.location.href = "login.html";

    });
}