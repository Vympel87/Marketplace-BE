import { Router } from "express";
import { errorHandler } from "../errorHandler";
import { createProduct, deleteProduct, getProduct, listProduct, searchProducts, updateProduct } from "../controllers/productsController";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { upload } from "../middlewares/upload";

const productsRoutes: Router = Router()

productsRoutes.post('/', [authMiddleware, adminMiddleware, upload.single('image')], errorHandler(createProduct));
productsRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(listProduct));
productsRoutes.get('/search', [authMiddleware, adminMiddleware], errorHandler(searchProducts));
productsRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getProduct));
productsRoutes.put('/:id', [authMiddleware, adminMiddleware, upload.single('image')], errorHandler(updateProduct));
productsRoutes.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct));

export default productsRoutes