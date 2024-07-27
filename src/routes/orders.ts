import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../errorHandler";
import { cancelOrder, changeStatusOrder, createOrder, getOrder, listAllOrders, listOrder, listUserOrder } from "../controllers/ordersController";
import adminMiddleware from "../middlewares/admin";

const orderRoutes: Router = Router()

orderRoutes.post('/', [authMiddleware], errorHandler(createOrder))
orderRoutes.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder))
orderRoutes.get('/', [authMiddleware], errorHandler(listOrder))
orderRoutes.get('/index', [authMiddleware, adminMiddleware], errorHandler(listAllOrders))
orderRoutes.put('/:id/status', [authMiddleware, adminMiddleware], errorHandler(changeStatusOrder))
orderRoutes.get('/users/:id', [authMiddleware, adminMiddleware], errorHandler(listUserOrder))
orderRoutes.get('/:id', [authMiddleware], errorHandler(getOrder))

export default orderRoutes