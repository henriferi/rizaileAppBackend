// src/controllers/admin.controller.ts
import { Request, Response, RequestHandler } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const SECRET = process.env.JWT_SECRET as string

/* export const registrarAdmin = async (req: Request, res: Response): Promise<void> => {
  const { email, senha } = req.body

  try {
    const existe = await prisma.admin.findUnique({ where: { email } })
    if (existe) res.status(400).json({ error: 'Admin já existe' })

    const senhaHash = await bcrypt.hash(senha, 10)

    const novoAdmin = await prisma.admin.create({
      data: { email, senha: senhaHash }
    })

    res.status(201).json({ message: 'Admin criado', admin: { email: novoAdmin.email } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao criar admin' })
  }
} */

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  const { email, senha } = req.body

  try {
    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin) res.status(401).json({ error: 'Credenciais inválidas' })

    const senhaCorreta = await bcrypt.compare(senha, admin!.senha)
    if (!senhaCorreta) res.status(401).json({ error: 'Credenciais inválidas' })

    const token = jwt.sign({ id: admin!.id, email: admin!.email }, SECRET, { expiresIn: '1d' })

    res.json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao logar' })
  }
}
