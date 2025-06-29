import { Router } from 'express'
import { registrarAdmin, loginAdmin } from '../controllers/admin.controller'

const router = Router()

router.post('/register', registrarAdmin)
router.post('/login', loginAdmin)

export default router
