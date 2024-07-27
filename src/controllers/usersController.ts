import { Request, Response } from "express";
import { AddressSchema, ChangeUserRoleSchema, UpdateUserSchema } from "../schema/usersSchema";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { Address } from "@prisma/client";
import { BadRequestException } from "../exceptions/badRequest";
import { error } from "console";

export const addAddress = async (req: Request, res: Response) => {
    AddressSchema.parse(req.body)
    
    const address = await prismaClient.address.create({
        data: {
            ...req.body,
            userId: req.user.id
        }
    })

    res.json(address)
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        await prismaClient.address.delete({
            where: {
                id: +req.params.id
            }
        })

        res.json({success: true})
    } catch (error) {
        throw new NotFoundException("Address Not Found!", ErrorCode.ADDRESS_NOT_FOUND)
    }
}

export const listAddress = async (req: Request, res: Response) => {
    const addresses = await prismaClient.address.findMany({
        where: {
            userId: req.user.id
        }
    })

    res.json(addresses)
}

export const updateUser = async (req: Request, res: Response) => {
    const validatedData = UpdateUserSchema.parse(req.body)
    let shippingAddress: Address
    let billingAddress: Address

    if (validatedData.defaultShippingAddress) {
        try {
            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultShippingAddress as any
                }
            })

        } catch (error) {
            throw new NotFoundException("Address Not Found!", ErrorCode.ADDRESS_NOT_FOUND)
        }

        if (shippingAddress.userId != req.user.id) {
                throw new BadRequestException("Address Does Not Belong To User!", error, ErrorCode.ADDRESS_DOES_NOT_BELONG)
        }
    }

    if (validatedData.defaultBillingAddress) {
        try {
            billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultShippingAddress as any
                }
            })

        } catch (error) {
            throw new NotFoundException("Address Not Found!", ErrorCode.ADDRESS_NOT_FOUND)
        }

        if (billingAddress.userId != req.user.id) {
                throw new BadRequestException("Address Does Not Belong To User!", error, ErrorCode.ADDRESS_DOES_NOT_BELONG)
        }
    }

    const updateUser = await prismaClient.user.update({
        where: {
            id: req.user.id
        },
        data: validatedData as any
    })

    res.json(updateUser)
}

export const listUsers = async (req: Request, res: Response) => {
    const users = await prismaClient.user.findMany({
        skip: +req.query.skip! || 0,
        take: 5
    })

    res.json(users)
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await prismaClient.user.findFirstOrThrow({
            where: {
                id: +req.params.id
            }, include: {
                addresses: true
            }
        })

        res.json(user)
    } catch (error) {
        throw new NotFoundException("User Not Found!", ErrorCode.USER_NOT_FOUND)
    }
}

export const changeUserRole = async (req: Request, res: Response) => {
    try {
        const validatedData = ChangeUserRoleSchema.parse(req.body);

        const user = await prismaClient.user.update({
            where: {
                id: +req.params.id
            },
            data: {
                role: validatedData.role
            }
        });

        res.json(user);
    } catch (error) {
        throw new NotFoundException("User Not Found!", ErrorCode.USER_NOT_FOUND);
    }
}