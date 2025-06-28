import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import produtoRoutes from './routes/produto.route'

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

// Rotas
app.use('/produtos', produtoRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
