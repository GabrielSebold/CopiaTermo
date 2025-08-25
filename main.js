let linhaAtual = 0;
let palavraAtual = [];
document.addEventListener("keydown", handler);

let palavraSecreta = "";

function buscarPalavraSecreta() {
    fetch("http://localhost:3000/sortear")
        .then(res => res.json())
        .then(data => {
            palavraSecreta = data.palavra;
            console.log("Palavra sorteada:", palavraSecreta);
        })
        .catch(err => {
            console.error("Erro ao buscar palavra secreta:", err);
            mostrarMensagem("Erro ao iniciar o jogo.");
        });
}



function fixarLinha(linha, palavra) {
    const celulas = document.getElementsByClassName("linha")[linha].getElementsByClassName("celula");
    for (let i = 0; i < 5; i++) {
        celulas[i].textContent = palavra[i] || "";
    }
}

function atualizarLinha() {
    const linha = document.getElementsByClassName("linha")[linhaAtual];
    const celulas = linha.getElementsByClassName("celula");

    for (let i = 0; i < 5; i++) {
        celulas[i].textContent = palavraAtual[i] || "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    criarGrid();
    linhaAtual = 0;
    palavraAtual = [];
    mostrarMensagem("");
    buscarPalavraSecreta();
});

//====================================================

//====================================================

function mostrarMensagem(texto, tipo = "info") {
    const msg = document.getElementById("mensagem");
    msg.textContent = texto;
    msg.className = tipo;
    if (tipo !== "erro") {
        setTimeout(() => {
            msg.textContent = "";
            msg.className = "";
        }, 3000);
    }
}

function handler(event) {
    const letra = event.key.toUpperCase();

    if (/^[A-Z]$/.test(letra)) {
        if (palavraAtual.length >= 5) {
            return;
        }
        console.log("Letra pressionada: ", letra);
        palavraAtual.push(letra);
        atualizarLinha();

    } else if (letra === "ENTER") {
        
        if (palavraAtual.length < 5) {
            console.log("Palavra incompleta");
            return;
        }

        console.log("Enviou a palavra!");
        const palavraFixada = [...palavraAtual];
        fixarLinha(linhaAtual, palavraAtual); 

        const palavraTentada = palavraFixada.join("").toUpperCase();

        fetch('http://localhost:3000/validar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ palavra: palavraTentada })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.valida) {
                mostrarMensagem("Palavra inválida!");
                return;
            }

            const resultado = validarPalpite(palavraFixada, palavraSecreta);
            aplicarCoresNaLinha(linhaAtual, resultado);

            if (resultado.every(item => item === "certa")) {
                mostrarMensagem("Parabéns! Você acertou!");
                document.removeEventListener("keydown", handler);
            }

            linhaAtual++;
            if (linhaAtual >= 6 && resultado.every(item => item !== "certa")) {
                mostrarMensagem(`Fim de jogo! A palavra era ${palavraSecreta}`);
                document.removeEventListener("keydown", handler);
            }

            palavraAtual.length = 0;
        })
        .catch(err => {
            console.error("Erro ao validar palavra:", err);
            mostrarMensagem("Erro ao verificar a palavra.");
        });

    } else if (letra === "BACKSPACE") {
        
        console.log("Removeu uma letra.")
        palavraAtual.pop();
        atualizarLinha();

    }
};

//====================================================

//====================================================

function criarGrid() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        const linha = document.createElement("div");
        linha.className = "linha";

        for (let j = 0; j < 5; j++) {
            const celula = document.createElement("div");
            celula.className = "celula";
            linha.appendChild(celula);
        }

        grid.appendChild(linha);
    }
}