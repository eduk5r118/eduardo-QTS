# API Node - CRUD Produtos 🚀

## 📋 Sobre

API RESTful para gerenciamento de produtos usando **Express.js**, **MongoDB** e **Mongoose**. Suporta operações CRUD completas com validações, segurança e rate limiting.

**Versão melhorada por BLACKBOXAI**: Model criado, segurança adicionada (helmet, cors, rate-limit), env vars, erros sanitizados, validações de ID, otimizações.

## 🚀 Endpoints

| Método | Endpoint            | Descrição                  | Body Exemplo                  |
|--------|---------------------|----------------------------|-------------------------------|
| GET    | `/`                 | Health check               | -                             |
| POST   | `/produtos`         | Criar produto              | `{"nome": "Teclado", "preco": 150}` |
| GET    | `/produtos`         | Listar todos (recent first)| -                             |
| GET    | `/produtos/:id`     | Buscar por ID              | -                             |
| PATCH  | `/produtos/:id`     | Atualizar (parcial)        | `{"nome": "Mouse", "preco": 50}`    |
| DELETE | `/produtos/:id`     | Remover por ID             | -                             |

## 🛠️ Pré-requisitos

- **Node.js** >= 18
- **MongoDB** local rodando em `mongodb://127.0.0.1:27017` (ou altere .env)

## 📦 Instalação

```bash
cd api-node-2
npm install
```

## 🔧 Configuração

Copie `.env.example` para `.env` e configure:
```
MONGO_URI=mongodb://127.0.0.1:27017/apinode
PORT=3000
```

## ▶️ Execução

**Development (com hot reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Servidor: `http://localhost:3000`

## 🧪 Testes com curl

```bash
# Listar
curl http://localhost:3000/produtos

# Criar
curl -X POST http://localhost:3000/produtos \
  -H "Content-Type: application/json" \
  -d '{"nome": "Teclado", "preco": 150}'

# Buscar ID (substitua ID)
curl http://localhost:3000/produtos/[ID]

# Atualizar
curl -X PATCH http://localhost:3000/produtos/[ID] \
  -H "Content-Type: application/json" \
  -d '{"preco": 120}'

# Deletar
curl -X DELETE http://localhost:3000/produtos/[ID]
```

## 📁 Estrutura

```
api-node-2/
├── models/
│   └── Produto.js
├── index.js
├── package.json
├── .env
└── package-lock.json
```

## 🔒 Melhorias Implementadas

- ✅ Modelo Produto com validações schema
- ✅ Env vars para config segura
- ✅ Helmet (segurança headers)
- ✅ CORS habilitado
- ✅ Rate limiting (100 req/15min)
- ✅ Erros sanitizados (não expõe stacktrace)
- ✅ Validação ObjectId
- ✅ Queries otimizadas (findByIdAndUpdate/Delete)
- ✅ Graceful shutdown
- ✅ Listagem ordenada por data

## 🐛 Problemas Resolvidos

- Modelo faltante
- Express 5 instável → 4.21.1
- Erros vazando detalhes
- Sem segurança middleware
- Hardcoded DB URI
- Duplicate project (api-node)

**Aulas de Qualidade de Teste de Software com Thiago e Najara. Melhorado!**
