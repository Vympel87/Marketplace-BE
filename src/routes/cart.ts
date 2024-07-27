import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../errorHandler";
import { addItemToCart, changeQuantityItem, deleteItemFromCart, getCart } from "../controllers/cartsController";

const cartRoutes: Router = Router()

cartRoutes.post('/', [authMiddleware], errorHandler(addItemToCart))
cartRoutes.delete('/:id', [authMiddleware], errorHandler(deleteItemFromCart))
cartRoutes.put('/:id', [authMiddleware], errorHandler(changeQuantityItem))
cartRoutes.get('/', [authMiddleware], errorHandler(getCart))

export default cartRoutes