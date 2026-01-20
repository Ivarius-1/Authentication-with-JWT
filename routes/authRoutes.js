import express from 'express'
import { regestrationController } from '../controllers/regestrationController.js'
import { authenticationController } from '../controllers/authenticationController.js'
import { authMiddleware } from '../middleware/index.js'

const regController = new regestrationController()
const authController = new authenticationController()

export const route = express.Router()

route.post('/regUser', regController.regUser)

route.post('/authUser', authController.authUser)
route.post('/logoutUser', authMiddleware, authController.logoutUser)

route.get('/allUsers', authController.allUsers)