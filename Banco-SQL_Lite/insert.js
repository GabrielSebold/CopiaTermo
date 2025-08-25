const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const readline = require('readline');

const db = new sqlite3.Database('./palavras.db');

async function inserirPalavras() {
  const fileStream = fs.createReadStream('../Palavras/palavras_5_letras.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    const stmt = db.prepare("INSERT INTO palavras (palavra) VALUES (?)");

    rl.on('line', (line) => {
      const palavra = line.trim();
      if(palavra.length === 5) {
        stmt.run(palavra);
      }
    });

    rl.on('close', () => {
      stmt.finalize();
      db.run("COMMIT");
      db.close();
      console.log('Inserção concluída!');
    });
  });
}

inserirPalavras();