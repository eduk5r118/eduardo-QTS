const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crud_funcionarios'
};

const db = mysql.createPool(dbConfig);



// =========================
// FUNCIONÁRIOS
// =========================

// GET
app.get('/api/funcionarios', async (req, res) => {

  try {

    const [rows] = await db.execute(
      'SELECT * FROM funcionarios ORDER BY id DESC'
    );

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
});



// POST
app.post('/api/funcionarios', async (req, res) => {

  try {

    const { nome, funcao, salario } = req.body;

    if (!nome || !funcao || !salario) {

      return res.status(400).json({
        error: 'Campos obrigatórios'
      });
    }

    const [result] = await db.execute(
      'INSERT INTO funcionarios (nome, funcao, salario) VALUES (?, ?, ?)',
      [nome, funcao, parseFloat(salario)]
    );

    res.json({
      success: true,
      id: result.insertId
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
});



// PUT
app.put('/api/funcionarios/:id', async (req, res) => {

  try {

    const { nome, funcao, salario } = req.body;

    const id = req.params.id;

    await db.execute(
      'UPDATE funcionarios SET nome = ?, funcao = ?, salario = ? WHERE id = ?',
      [nome, funcao, parseFloat(salario), id]
    );

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
});



// DELETE
app.delete('/api/funcionarios/:id', async (req, res) => {

  try {

    const id = req.params.id;

    await db.execute(
      'DELETE FROM funcionarios WHERE id = ?',
      [id]
    );

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
});



// =========================
// CADASTRO
// =========================

app.post('/cadastro', async (req, res) => {

  try {

    const { email, senha } = req.body;

    if (!email || !senha) {

      return res.status(400).json({
        error: 'Campos obrigatórios'
      });
    }

    await db.execute(
      'INSERT INTO usuarios (email, senha) VALUES (?, ?)',
      [email, senha]
    );

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
});



// =========================
// LOGIN
// =========================

app.post('/login', async (req, res) => {

  try {

    const { email, senha } = req.body;

    const [rows] = await db.execute(
      'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
      [email, senha]
    );

    if (rows.length > 0) {

      res.json({
        success: true
      });

    } else {

      res.json({
        success: false,
        error: 'Usuário inválido'
      });
    }

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
});



// =========================
// SERVIDOR
// =========================

const PORT = 3000;

app.listen(PORT, () => {

  console.log(`Servidor rodando em http://localhost:${PORT}`);

});