import { ErrorCode, HttpException } from "./root";

export class BadRequestException extends HttpException {
    constructor(message: string, errors: any, errorCode: ErrorCode) {
        super(message, errorCode, 400, errors);
    }
}