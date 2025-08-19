function validarPalpite(palavra, respostaSecreta) {
    const resultado = Array(5).fill("errada");
    const resposta = respostaSecreta.split("");
    const letrasUsadas = [...resposta];

    for (let i = 0; i < 5; i++) {
        if (palavra[i] === resposta[i]) {
            resultado[i] = "certa";
            letrasUsadas[i] = null;
        }
    }

    for (let i = 0; i < 5; i++) {
        if (resultado[i] === "errada") {
            const idx = letrasUsadas.indexOf(palavra[i]);
            if (idx !== -1) {
                resultado[i] = "quase";
                letrasUsadas[idx] = null;
            }
        }
    }

    return resultado;
}

function aplicarCoresNaLinha(linha, resultado) {
    const celulas = document.getElementsByClassName("linha")[linha].getElementsByClassName("celula");

    for (let i = 0; i < 5; i++) {
        celulas[i].classList.add(resultado[i]);
    }
}

