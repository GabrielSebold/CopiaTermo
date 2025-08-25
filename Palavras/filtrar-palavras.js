const fs = require("fs");
const readline = require("readline");

const arquivoEntrada = "lexico.txt";
const arquivoSaida = "palavras_5_letras.txt";

const rl = readline.createInterface({
  input: fs.createReadStream(arquivoEntrada),
  output: process.stdout,
  terminal: false,
});

const palavrasFiltradas = [];

rl.on("line", (linha) => {
  const partes = linha.trim().split(/\s+/);
  const palavra = partes[0];

  if (palavra && palavra.length === 5 && /^[a-zA-ZÀ-ÿ]+$/.test(palavra)) {
    palavrasFiltradas.push(palavra.toUpperCase());
  }
});

rl.on("close", () => {
  fs.writeFileSync(arquivoSaida, palavrasFiltradas.join("\n"), "utf8");
  console.log(`${palavrasFiltradas.length} palavras salvas em '${arquivoSaida}'`);
});