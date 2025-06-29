import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import cloudinary from '../config/cloudinary'

const prisma = new PrismaClient()

// Lista os produtos existentes
export const listarProdutos = async (req: Request, res: Response): Promise<void> => {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: {
        criadoEm: 'desc'
      }
    })
    res.json(produtos)
  } catch (error) {
    console.error('Erro ao listar produtos:', error)
    res.status(500).json({ error: 'Erro ao buscar produtos' })
  }
}

//Busca um único produto pelo ID
export const detalhesProduto = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  const idConvertido = Number(id)

  if (isNaN(idConvertido)) {
    res.status(400).json({ error: 'ID inválido' })
    return
  }

  try {
    const produto = await prisma.produto.findUnique({
      where: { id: idConvertido },
    })

    if (!produto) {
      res.status(404).json({ error: 'Produto não encontrado' })
      return
    }

    res.status(200).json(produto)
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
}


// Cria um novo produto
export const criarProduto = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Imagem é obrigatória' })
      return
    }

    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'catalogo_roupas' },
        (error, result) => {
          if (error || !result) {
            console.error('Erro no upload para o Cloudinary:', error)
            return reject(new Error('Falha no upload da imagem'))
          }
          resolve(result as { secure_url: string })
        }
      ).end(req.file!.buffer)
    })

    const { nome, preco, categoria, descricao, popular } = req.body

    const produto = await prisma.produto.create({
      data: {
        nome,
        preco: parseFloat(preco),
        categoria,
        descricao,
        popular: popular === 'true' || popular === true,
        imagem: uploadResult.secure_url
      }
    })

    res.status(201).json(produto)
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    res.status(500).json({ error: 'Erro ao criar produto' })
  }
}


export const atualizarProduto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { nome, preco, categoria, descricao, popular, imagem } = req.body

    const produto = await prisma.produto.update({
      where: { id: Number(id) },
      data: {
        nome,
        preco: parseFloat(preco),
        categoria,
        descricao,
        popular: popular === 'true' || popular === true,
        imagem
      }
    })

    res.json(produto)
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    res.status(500).json({ error: 'Erro ao atualizar produto' })
  }
}


export const deletarProduto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    await prisma.produto.delete({
      where: { id: Number(id) }
    })

    res.status(204).send()
  } catch (error) {
    console.error("Erro ao apagar produto", error)
    res.status(500).json({ error: "Erro ao deletar produto" })
  }
}