import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { route } from './routes/authRoutes.js'

dotenv.config()

export const app = express()
app.use(express.json())
const port = process.env.PORT

app.use(cors())
app.use('/app', route)

app.listen(port, () => {
    console.log(`Сервер работает на порту ${port}`)
})