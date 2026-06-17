require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const Produto = require('./models/Produto')

const app = express()

// Security & Rate Limiting
app.use(helmet())
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Conectado ao MongoDB')
  } catch (error) {
    console.error('Erro na conexão MongoDB:', error)
    process.exit(1)
  }
}
connectDB()

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'API funcionando 🚀', 
    version: '2.0',
    endpoints: ['GET /produtos', 'POST /produtos', 'GET /produtos/:id', 'PATCH /produtos/:id', 'DELETE /produtos/:id']
  })
})

/* ================= CRUD ================= */

// Helper: Validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

// Helper: Sanitized error response
const sendError = (res, status, message, error = null) => {
  if (error) console.error(message, error)
  res.status(status).json({ erro: message })
}

// CREATE
app.post('/produtos', async (req, res) => {
  const { nome, preco } = req.body

  if (!nome || !preco || preco < 0) {
    return sendError(res, 422, 'Nome e preço positivo são obrigatórios!')
  }

  const produto = { nome, preco: Number(preco) }

  try {
    const novoProduto = await Produto.create(produto)
    res.status(201).json({ message: 'Produto criado!', produto: novoProduto })
  } catch (error) {
    sendError(res, 500, 'Erro ao criar produto', error)
  }
})

// READ all
app.get('/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find().sort({ createdAt: -1 })
    res.status(200).json(produtos)
  } catch (error) {
    sendError(res, 500, 'Erro ao listar produtos', error)
  }
})

// READ by ID
app.get('/produtos/:id', async (req, res) => {
  const id = req.params.id

  if (!isValidId(id)) {
    return sendError(res, 422, 'ID inválido')
  }

  try {
    const produto = await Produto.findById(id)
    if (!produto) {
      return sendError(res, 404, 'Produto não encontrado')
    }
    res.status(200).json(produto)
  } catch (error) {
    sendError(res, 500, 'Erro ao buscar produto', error)
  }
})

// UPDATE
app.patch('/produtos/:id', async (req, res) => {
  const id = req.params.id
  const { nome, preco } = req.body

  if (!isValidId(id)) {
    return sendError(res, 422, 'ID inválido')
  }

  if (nome === undefined && preco === undefined) {
    return sendError(res, 422, 'Pelo menos um campo (nome ou preco) deve ser enviado')
  }

  const updateData = { ...(nome && { nome }), ...(preco !== undefined && { preco: Number(preco) }) }

  try {
    const produto = await Produto.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
    if (!produto) {
      return sendError(res, 404, 'Produto não encontrado')
    }
    res.status(200).json(produto)
  } catch (error) {
    sendError(res, 500, 'Erro ao atualizar produto', error)
  }
})

// DELETE
app.delete('/produtos/:id', async (req, res) => {
  const id = req.params.id

  if (!isValidId(id)) {
    return sendError(res, 422, 'ID inválido')
  }

  try {
    const produto = await Produto.findByIdAndDelete(id)
    if (!produto) {
      return sendError(res, 404, 'Produto não encontrado')
    }
    res.status(200).json({ message: 'Produto removido!' })
  } catch (error) {
    sendError(res, 500, 'Erro ao remover produto', error)
  }
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM recebido, fechando graciosamente...')
  await mongoose.connection.close()
  process.exit(0)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
