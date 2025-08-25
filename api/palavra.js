const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('C:/Users/Gabri/OneDrive/Área de Trabalho/CopiaTermo/Banco-SQL_Lite/palavras.db');

app.use(cors());
app.use(express.json());

app.post('/validar', (req, res) => {
  const palavra = req.body.palavra?.toUpperCase();

  if (!palavra || palavra.length !== 5) {
    return res.status(400).json({ valida: false, erro: 'Palavra inválida' });
  }

  console.log("Palavra recebida para validação:", palavra);

  db.get("SELECT palavra FROM palavras WHERE palavra = ?", [palavra], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ valida: false });
    }

    if (row) {
      res.json({ valida: true });
    } else {
      res.json({ valida: false });
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});



app.get('/sortear', (req, res) => {
  db.get("SELECT palavra FROM palavras ORDER BY RANDOM() LIMIT 1", (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao sortear palavra" });
    }
    res.json({ palavra: row.palavra.toUpperCase() });
  });
});
