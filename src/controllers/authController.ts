import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../internal";
import { BadRequestException } from "../exceptions/badRequest";
import { ErrorCode } from "../exceptions/root";
import { SignUpSchema } from "../schema/usersSchema";
import { NotFoundException } from "../exceptions/notFound";
import { error } from "console";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    SignUpSchema.parse(req.body)
    const { email, password, name } = req.body
    
    let user = await prismaClient.user.findFirst({ where: { email: email } })
    if (user) {
        throw new BadRequestException("User Already Exist!", error, ErrorCode.USER_ALREADY_EXIST)
    }

    user = await prismaClient.user.create({
        data: {
            name,
            email,
            password: hashSync(password, 10)
        }
    })

    res.json(user)
}

export const logIn = async (req: Request, res: Response) => {
    const { email, password } = req.body
    
    let user = await prismaClient.user.findFirst({ where: { email: email } })
    if (!user) {
        throw new NotFoundException("User Not Found!", ErrorCode.USER_NOT_FOUND)
    }
    
    if (!compareSync(password, user.password)) {
        throw new BadRequestException("Incorrect Password!", error, ErrorCode.INCORRECT_PASSWORD)
    }

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)

    res.json({ user, token });
}

export const information = async (req: Request, res: Response) => {
    if (!req.user) {
        throw new NotFoundException("User Not Found!", ErrorCode.USER_NOT_FOUND)
    }
    res.json(req.user);
}

