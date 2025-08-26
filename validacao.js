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

//===================================================================

function aplicarCoresNaLinha(linha, resultado, palavra) {
    const celulas = document.getElementsByClassName("linha")[linha].getElementsByClassName("celula");

    for (let i = 0; i < 5; i++) {
        celulas[i].classList.add(resultado[i]);

        const letra = palavra[i];
        const tecla = document.getElementById(`tecla-${letra}`);
        
        if (tecla) {
            if (resultado[i] === "certa") {
                tecla.className = "tecla certa";
            } else if (resultado[i] === "quase" && !tecla.classList.contains("certa")) {
                tecla.className = "tecla quase";
            } else if (resultado[i] === "errada" &&
                       !tecla.classList.contains("certa") &&
                       !tecla.classList.contains("quase")) {
                tecla.className = "tecla errada";
            }
        }
    }
}

