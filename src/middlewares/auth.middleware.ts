import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'



const SECRET = process.env.JWT_SECRET || 'chave-secreta-padrao'

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(401).json({ error: 'Token não fornecido' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' })
    return
  }
}
