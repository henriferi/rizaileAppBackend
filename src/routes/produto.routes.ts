import { Router } from 'express'
import { listarProdutos, criarProduto, atualizarProduto, deletarProduto, detalhesProduto } from '../controllers/produto.controller'
import upload from '../middlewares/upload'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

//Buscar um produto pelo id
router.get('/id/:id', detalhesProduto)
// Buscar produtos
router.get('/', listarProdutos)



// APENAS ADMIN COM TOKEN:
// Criar produtos
router.post('/', authMiddleware, upload.single('imagem'), criarProduto)
// Editar produtos
router.put('/:id', authMiddleware, atualizarProduto)
// Deletar Produto
router.delete('/:id', authMiddleware, deletarProduto)



export default router
