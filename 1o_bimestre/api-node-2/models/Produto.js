const mongoose = require('mongoose')

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório']
  },
  preco: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço deve ser positivo']
  }
}, { timestamps: true })

module.exports = mongoose.model('Produto', produtoSchema)
