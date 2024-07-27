import { Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cartsSchema";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { Product } from "@prisma/client";
import { prismaClient } from "..";

export const addItemToCart = async (req: Request, res: Response) => {
    const validatedData = CreateCartSchema.parse(req.body);
    let product: Product;

    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        });
    } catch (error) {
        throw new NotFoundException("Product Not Found", ErrorCode.PRODUCT_NOT_FOUND);
    }

    const existingCartItem = await prismaClient.cartItem.findFirst({
        where: {
            userId: req.user.id,
            productId: product.id
        }
    });

    if (existingCartItem) {
        const updatedCartItem = await prismaClient.cartItem.update({
            where: {
                id: existingCartItem.id
            },
            data: {
                quantity: existingCartItem.quantity + validatedData.quantity
            }
        });

        res.json(updatedCartItem);
    } else {
        const cart = await prismaClient.cartItem.create({
            data: {
                userId: req.user.id,
                productId: product.id,
                quantity: validatedData.quantity
            }
        });

        res.json(cart);
    }
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
    try {
        const cartItem = await prismaClient.cartItem.findFirstOrThrow({
            where: {
                id: +req.params.id,
                userId: req.user.id
            }
        });

        await prismaClient.cartItem.delete({
            where: {
                id: cartItem.id
            }
        });

        res.json({ success: true });
    } catch (error) {
        throw new NotFoundException("Cart Item Not Found", ErrorCode.CART_ITEM_NOT_FOUND);
    }
};

export const changeQuantityItem = async (req: Request, res: Response) => {
    try {
        const validatedData = ChangeQuantitySchema.parse(req.body);

        const cartItem = await prismaClient.cartItem.findFirstOrThrow({
            where: {
                id: +req.params.id,
                userId: req.user.id
            }
        });

        const updatedCartItem = await prismaClient.cartItem.update({
            where: {
                id: cartItem.id
            },
            data: {
                quantity: validatedData.quantity
            }
        });

        res.json(updatedCartItem);
    } catch (error) {
            throw new NotFoundException("Cart Item Not Found", ErrorCode.CART_ITEM_NOT_FOUND);

    }
};

export const getCart = async (req: Request, res: Response) => {
    try {
        const cart = await prismaClient.cartItem.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                product: true
            }
        });

        res.json(cart);
    } catch (error) {
        throw new NotFoundException("Cart Item Not Found", ErrorCode.CART_ITEM_NOT_FOUND);
    }
};
