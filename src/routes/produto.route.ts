import { Router } from 'express'
import { listarProdutos, criarProduto, atualizarProduto, deletarProduto } from '../controllers/produto.controller'
import upload from '../middlewares/upload'

const router = Router()

// Buscar produtos
router.get('/', listarProdutos)
// Criar produtos
router.post('/', upload.single('imagem'), criarProduto)
// Editar produtos
router.put('/:id', atualizarProduto)
// Deletar Produto
router.delete('/:id', deletarProduto)


export default router
