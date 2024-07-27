import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";

export const createOrder = async (req: Request, res: Response) => {
    return await prismaClient.$transaction(async (tx) => {
        const cartItems = await tx.cartItem.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                product: true
            }
        })

        if (cartItems.length == 0) {
            return res.json({message: "Cart is empty"})
        }

        const price = cartItems.reduce((prev, current) => {
            return prev + (current.quantity * +current.product.price)
        }, 0)
        const address = await tx.address.findFirst({
            where: {
                id: req.user.defaultShippingAddress as any
            }
        })
        const orders = await tx.order.create({
            data: {
                userId: req.user.id,
                netAmount: price,
                address: address?.formatedAddress as any,
                products: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        }
                    })
                }
            }
        })

        await tx.orderEvent.create({
            data: {
                orderId: orders.id
            }
        })

        await tx.cartItem.deleteMany({
            where: {
                userId: req.user.id
            }
        })

        return res.json(orders)
    })
}

export const cancelOrder = async (req: Request, res: Response) => {
    try {
        const order = await prismaClient.$transaction(async (tx) => {
            const order = await tx.order.findFirstOrThrow({
                where: {
                    id: +req.params.id,
                    userId: req.user.id
                }
            });

            const updatedOrder = await tx.order.update({
                where: {
                    id: order.id
                },
                data: {
                    status: 'CANCELLED'
                }
            });

            await tx.orderEvent.create({
                data: {
                    orderId: updatedOrder.id,
                    status: "CANCELLED"
                }
            });

            return updatedOrder;
        });

        res.json(order);
    } catch (error) {
        throw new NotFoundException("Order Not Found", ErrorCode.ORDER_NOT_FOUND);
    }
};

export const listOrder = async (req: Request, res: Response) => {
    const orders = await prismaClient.order.findMany({
        where: {
            userId: req.user.id
        }
    })

    res.json(orders)
}

export const getOrder = async (req: Request, res: Response) => {
    try {
        const order = await prismaClient.order.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                products: true,
                events:true
            }
        })

        res.json(order)
    } catch (error) {
        throw new NotFoundException("Order Not Found", ErrorCode.ORDER_NOT_FOUND)
    }
}

export const listAllOrders = async (req: Request, res: Response) => {
    let whereClause = {}

    const status = req.query.status

    if (status) {
        whereClause = {
            status
        }
    }

    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: +req.query.skip! || 0,
        take: 5
    })

    res.json(orders)
}

export const changeStatusOrder = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;

        const order = await prismaClient.$transaction(async (tx) => {
            const updatedOrder = await tx.order.update({
                where: {
                    id: +req.params.id
                },
                data: {
                    status: status
                }
            });

            await tx.orderEvent.create({
                data: {
                    orderId: updatedOrder.id,
                    status: status
                }
            });

            return updatedOrder;
        });

        res.json(order);
    } catch (error) {
        throw new NotFoundException("Order Not Found", ErrorCode.ORDER_NOT_FOUND);
    }
}

export const listUserOrder = async (req: Request, res: Response) => {
    let whereClause: any = {
        userId: +req.params.id
    }

    const status = req.params.status

    if (status) {
        whereClause = {
            ...whereClause,
            status
        }
    }

    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: +req.query.skip! || 0,
        take: 5
    })

    res.json(orders)
}