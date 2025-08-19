let linhaAtual = 0;
let palavraAtual = [];
const palavraSecreta = "CANTO";
document.addEventListener("keydown", handler);

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

document.getElementById("iniciar").addEventListener("click", () => {
  criarGrid();
  palavraAtual.length = 0;
  event.target.blur();
});
//====================================================

//====================================================

function handler(event) {
    const letra = event.key.toUpperCase();

    if (/^[A-Z]$/.test(letra)) {
        
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

        const resultado = validarPalpite(palavraFixada, palavraSecreta);
        aplicarCoresNaLinha(linhaAtual, resultado);
        
        if (resultado.every(item => item === "certa")) {
            document.removeEventListener("keydown", handler)
        }

        linhaAtual++;
        palavraAtual.length = 0;

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