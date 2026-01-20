import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

const prisma = new PrismaClient()

export class authenticationController{
    authUser = async(req,res) => {
        try {
            const {login, password, online} = req.body
            
            const validUser = await prisma.user.findUnique({
                where:{login}
            })
            if(!validUser){
                return res.status(400).json({
                    message:`Пользователь с именем ${login} не найден`
                })
            }
            const validPassword = await bcrypt.compareSync(password, validUser.password)
            if(!validPassword){
                res.status(400).json({
                    message:"Пользователь ввёл неверный пароль"
                })
            }

            const token = jwt.sign(
                {login},
                process.env.JWT_SECRET,
                {expiresIn: process.env.JWT_EXPIRES}
            )

            await prisma.user.update({
                where: { login },
                data: { online: true }
            })

            console.log(validUser, validPassword)

            return res.json({
                token,
                status: true,
                message: "Успешный вход",
                user: {
                    login: validUser.login,
                    online: true
                }
            })
        } catch (e) {
            console.log(`Ошибка авторизации ${e}`)
            res.json({
                message:"Ошибка авторизации"
            })
        }
    }
    logoutUser = async(req,res) => {
        try {
            const {login, online} = req.body
            const user = await prisma.user.update({
                where:{login},
                data: {
                    online: false
                }
            })
            res.json({
                user:{
                    login:user.login,
                    online: false
                }
            })
        } catch (e) {
            console.log(`Ошибка при выходе ${e}`)
            res.json({
                message:"Ошибка при выходе пользователя"
            })
        }
    }
    allUsers = async(req,res) => {
        try {
            const users = await prisma.user.findMany()
            res.json(users)
        } catch (e) {
            console.log(e)
        }
    }
}