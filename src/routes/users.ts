import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../errorHandler";
import { addAddress, changeUserRole, deleteAddress, getUser, listAddress, listUsers, updateUser } from "../controllers/usersController";
import adminMiddleware from "../middlewares/admin";

const userRoutes: Router = Router()

userRoutes.post('/address', [authMiddleware], errorHandler(addAddress))
userRoutes.delete('/address?:id', [authMiddleware], errorHandler(deleteAddress))
userRoutes.get('/address', [authMiddleware], errorHandler(listAddress))
userRoutes.put('/', [authMiddleware], errorHandler(updateUser))
userRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(listUsers))
userRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getUser))
userRoutes.put('/:id/role', [authMiddleware, adminMiddleware], errorHandler(changeUserRole))

export default userRoutes