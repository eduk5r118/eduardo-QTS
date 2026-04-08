const express = require('express')
const mongoose = require('mongoose')

const app = express()

// middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// conexão com MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/apinode')

const db = mongoose.connection

db.on('error', console.error.bind(console, 'erro na conexão'))
db.once('open', () => {
  console.log('Conectado ao MongoDB')
})

// model
const Produto = require('./models/Produto')

// rota teste
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando 🚀' })
})

/* ================= CRUD ================= */

// CREATE
app.post('/produtos', async (req, res) => {
  const { nome, preco } = req.body

  if (!nome || !preco) {
    return res.status(422).json({ erro: 'Dados obrigatórios!' })
  }

  const produto = { nome, preco }

  try {
    await Produto.create(produto)
    res.status(201).json({ message: 'Produto criado!' })
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// READ (todos)
app.get('/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find()
    res.status(200).json(produtos)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// READ (por id)
app.get('/produtos/:id', async (req, res) => {
  const id = req.params.id

  try {
    const produto = await Produto.findById(id)

    if (!produto) {
      return res.status(422).json({ erro: 'Produto não encontrado' })
    }

    res.status(200).json(produto)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// UPDATE
app.patch('/produtos/:id', async (req, res) => {
  const id = req.params.id
  const { nome, preco } = req.body

  const produto = { nome, preco }

  try {
    const updated = await Produto.updateOne({ _id: id }, produto)

    if (updated.matchedCount === 0) {
      return res.status(422).json({ erro: 'Produto não encontrado' })
    }

    res.status(200).json(produto)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// DELETE
app.delete('/produtos/:id', async (req, res) => {
  const id = req.params.id

  try {
    const produto = await Produto.findById(id)

    if (!produto) {
      return res.status(422).json({ erro: 'Produto não encontrado' })
    }

    await Produto.deleteOne({ _id: id })

    res.status(200).json({ message: 'Produto removido!' })
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// porta
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})
