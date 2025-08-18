let palavraAtual = [];

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
});
//====================================================

//====================================================

document.addEventListener("keydown", (event) => {
    const letra = event.key.toUpperCase();

    if (/^[A-Z]$/.test(letra)) {
        console.log("Letra pressionada: ", letra);
        palavraAtual.push(letra);
        atualizarLinha();
    } else if (letra === "ENTER") {
        console.log("Enviou a palavra!");
    } else if (letra === "BACKSPACE") {
        console.log("Removeu uma letra.")
        palavraAtual.pop();
        atualizarLinha();
    }
});
//====================================================

//====================================================
linhaAtual = 0;

mensagemElement.textContent = "";
mensagemElement.className = "";

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