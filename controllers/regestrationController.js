import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export class regestrationController{
    regUser = async(req, res) => {
        try{
            const {login,password,online} = req.body
            const hashedPassword = await bcrypt.hash(password, 7)
            const user = await prisma.user.create({
            data: {
                login,
                password: hashedPassword,
                online: false
            }
            })
            console.log(user)
            res.json({
                status:true,
                message:"Пользователь зарегистрирован"
            })
        } catch (e){
            console.log(`Ошибка во время регистрации ${e}`)
            res.json({
                status:false,
                messgae:"Ошибка во время регистрации"
            })
        }
    }
}