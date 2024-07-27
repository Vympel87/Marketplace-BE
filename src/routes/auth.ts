import { Router } from 'express'
import { information, logIn, signUp } from '../controllers/authController'
import { errorHandler } from '../errorHandler'
import authMiddleware from '../middlewares/auth'

const authRoutes:Router = Router()

authRoutes.post('/signup', errorHandler(signUp))
authRoutes.post('/login', errorHandler(logIn))
authRoutes.get('/information', [authMiddleware], errorHandler(information))

export default authRoutes