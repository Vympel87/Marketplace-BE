import { NextFunction, Request, Response } from "express"
import { ErrorCode, HttpException } from "./exceptions/root"
import { InternalException } from "./exceptions/internalException"
import { ZodError } from "zod"
import { BadRequestException } from "./exceptions/badRequest"

export const errorHandler = (method: Function) => {
    return async (req : Request, res: Response, next: NextFunction) => {
        try {
           await method(req, res, next)
        } catch (error: any) {
            let exception: HttpException;
            if (error instanceof HttpException) {
                exception = error;
            } else {
                if (error instanceof ZodError) {
                    exception = new BadRequestException('Unprocessable Entity', error, ErrorCode.UNPROCESSABLE_ENTITY)
                } else {
                    exception = new InternalException("Something Went Wrong!", error, ErrorCode.INTERNAL_EXCEPTION)
                }
            }
            next(exception)
        }
    }
}