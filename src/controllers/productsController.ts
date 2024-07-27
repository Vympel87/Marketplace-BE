import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { createProductSchema, updateProductSchema } from "../schema/productsSchema";
import path from "path";
import fs from 'fs';

export const createProduct = async (req: Request, res: Response) => {
    try {
        const validatedProduct = createProductSchema.parse(req.body);

        const product = await prismaClient.product.create({
            data: {
                name: validatedProduct.name,
                price: validatedProduct.price,
                description: validatedProduct.description,
                tags: validatedProduct.tags?.join(','),
                image: req.file ? `/storage/images/${req.file.filename}` : validatedProduct.image,
            }
        });

        res.json(product);
    } catch (error) {
        throw new NotFoundException("Product Not Found", ErrorCode.CANNOT_CREATE_PRODUCT);
    }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const validatedProduct = updateProductSchema.parse(req.body);

    const existingProduct = await prismaClient.product.findUnique({ where: { id: +req.params.id } });
    if (!existingProduct) throw new NotFoundException("Product Not Found", ErrorCode.PRODUCT_NOT_FOUND);

    if (existingProduct.image && req.file) {
      fs.unlinkSync(path.join(__dirname, '..', existingProduct.image));
    }

    const updatedProduct = await prismaClient.product.update({
      where: { id: +req.params.id },
      data: {
        name: validatedProduct.name,
        price: validatedProduct.price,
        description: validatedProduct.description,
        tags: validatedProduct.tags?.join(','),
        image: req.file ? `/storage/images/${req.file.filename}` : validatedProduct.image,
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    throw new NotFoundException("Product Not Found", ErrorCode.PRODUCT_NOT_FOUND);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await prismaClient.product.findUnique({ where: { id: +req.params.id } });
    if (!product) throw new NotFoundException("Product Not Found", ErrorCode.PRODUCT_NOT_FOUND);

    if (product.image) {
      fs.unlinkSync(path.join(__dirname, '..', product.image));
    }

    const deletedProduct = await prismaClient.product.delete({
      where: { id: +req.params.id },
    });

    res.status(200).json(deletedProduct);
  } catch (error) {
    throw new NotFoundException("Product Not Found", ErrorCode.PRODUCT_NOT_FOUND);
  }
};

export const listProduct = async (req: Request, res: Response) => {
    try {
        const count = await prismaClient.product.count();
        const products = await prismaClient.product.findMany({
            skip: +req.query.skip! || 0,
            take: 5
        });

        res.json({
            count, data: products
        });
    } catch (error) {
        throw new NotFoundException("Product Not Found", ErrorCode.PRODUCT_NOT_FOUND);
    }
}

export const getProduct = async (req: Request, res: Response) => {
    try {
        const product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        });

        res.json(product);
    } catch (error) {
            throw new NotFoundException("Product Not Found", ErrorCode.PRODUCT_NOT_FOUND);
    }
}

export const searchProducts = async (req: Request, res: Response) => {
    const products = await prismaClient.product.findMany({
        skip: +req.query.skip! || 0,
        take: 5,
        where: {
            OR: [
                { name: { contains: req.query.q?.toString(), mode: 'insensitive' } },
                { description: { contains: req.query.q?.toString(), mode: 'insensitive' } },
                { tags: { contains: req.query.q?.toString(), mode: 'insensitive' } }
            ]
        }
    });

    res.json(products);
}
