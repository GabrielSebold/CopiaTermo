let linhaAtual = 0;
let palavraAtual = [];
document.addEventListener("keydown", handler);

let palavraSecreta = "";
let colunaAtiva = 0;
let celulaAtiva = null;

//====================================================

//====================================================

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

//====================================================

//====================================================

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
    criarTeclado();
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
        }, 7000);
    }
}

function selecionarCelula(linha, coluna) {
    if (linha !== linhaAtual) return;
    if (celulaAtiva) {
        celulaAtiva.classList.remove("ativo");
    }
    const celula = document.getElementsByClassName("linha")[linha].getElementsByClassName("celula")[coluna];
    celula.classList.add("ativo");
    celulaAtiva = celula;
    colunaAtiva = coluna;
}

function handler(event) {
    const letra = event.key.toUpperCase();

    if (event.key === "ArrowRight") {
        if (colunaAtiva < 4) {
            selecionarCelula(linhaAtual, colunaAtiva + 1);
        }
        return;
    }
    if (event.key === "ArrowLeft") {
        if (colunaAtiva > 0) {
            selecionarCelula(linhaAtual, colunaAtiva - 1);
        }
        return;
    }

    if (/^[A-Z]$/.test(letra)) {
        if (colunaAtiva < 5) {
            palavraAtual[colunaAtiva] = letra;
            atualizarLinha();
            if (colunaAtiva < 4) {
                selecionarCelula(linhaAtual, colunaAtiva + 1);
            }
        }
    }


    else if (event.key === "Backspace") {
        apagarLetra();
    }

    else if (event.key === "Enter") {
        enviarPalavra();
    }
}

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
            celula.addEventListener("click", () => selecionarCelula(i, j));
            linha.appendChild(celula);
        }

        grid.appendChild(linha);
    }
}

//====================================================

//====================================================

function criarTeclado() {
    const linhas = [
        "QWERTYUIOP",
        "ASDFGHJKL",
        "ZXCVBNM"
    ];
    const teclado = document.getElementById("teclado");
    teclado.innerHTML = "";

    linhas.forEach((linhaLetras, index) => {
        const linhaDiv = document.createElement("div");
        linhaDiv.className = "linha-teclado";

        linhaLetras.split("").forEach(letra => {
            const tecla = document.createElement("div");
            tecla.textContent = letra;
            tecla.id = `tecla-${letra}`;
            tecla.className = "tecla";
            tecla.addEventListener("click", () => inserirLetra(letra));
            linhaDiv.appendChild(tecla);
        });

        if(index === linhas.length - 1){
            const back = document.createElement("div");
            back.textContent = "⌫";
            back.className = "tecla tecla-grande";
            back.addEventListener("click", apagarLetra);
            linhaDiv.appendChild(back);

            const enter = document.createElement("div");
            enter.textContent = "ENTER";
            enter.className = "tecla tecla-grande";
            enter.addEventListener("click", enviarPalavra);
            linhaDiv.appendChild(enter);
        }

        teclado.appendChild(linhaDiv);
    });
}

function inserirLetra(letra) {
    if (colunaAtiva < 5) {
        palavraAtual[colunaAtiva] = letra;
        atualizarLinha();
        colunaAtiva++;
        selecionarCelula(linhaAtual, colunaAtiva);
    }
}


function apagarLetra() {
    if (colunaAtiva >= 0) {
        if (palavraAtual[colunaAtiva] === "") {
            if (colunaAtiva > 0) {
                colunaAtiva--;
                palavraAtual[colunaAtiva] = "";
                atualizarLinha();
                selecionarCelula(linhaAtual, colunaAtiva);
            }
        } else {
            palavraAtual[colunaAtiva] = "";
            atualizarLinha();
            selecionarCelula(linhaAtual, colunaAtiva);
        }
    }
}


function enviarPalavra() {
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
            aplicarCoresNaLinha(linhaAtual, resultado, palavraFixada);
            if (celulaAtiva) {
                celulaAtiva.classList.remove("ativo");
                celulaAtiva = null;
            }
            colunaAtiva = 0;

            if (resultado.every(item => item === "certa")) {
                mostrarMensagem("Parabéns! Você acertou!");
                document.removeEventListener("keydown", handler);
            }

            linhaAtual++;
            if (linhaAtual >= 6 && resultado.some(item => item !== "certa")) {
                mostrarMensagem(`Fim de jogo! A palavra era ${palavraSecreta}`);
                document.removeEventListener("keydown", handler);
            }

            palavraAtual.length = 0;
        })
        .catch(err => {
            console.error("Erro ao validar palavra:", err);
            mostrarMensagem("Erro ao verificar a palavra.");
        });

    if(celulaAtiva) {
        celulaAtiva.classList.remove("ativo");
        celulaAtiva = null;
    }

}

//====================================================

//====================================================