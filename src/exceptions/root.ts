export class HttpException extends Error {
    message: string;
    errorCode: any;
    statusCode: number;
    errors: ErrorCode;

    constructor(message: string, errorCode: ErrorCode, statusCode: number, errors: any) {
        super(message)
        this.message = message
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.errors = errors
    }
}

export enum ErrorCode {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXIST = 1002,
    INCORRECT_PASSWORD = 1003,
    ADDRESS_NOT_FOUND = 1004,
    ADDRESS_DOES_NOT_BELONG = 1005,

    UNPROCESSABLE_ENTITY = 2001,

    INTERNAL_EXCEPTION = 3001,

    UNAUTHORIZED = 4001,

    PRODUCT_NOT_FOUND = 5001,
    CANNOT_CREATE_PRODUCT = 5002,

    CART_ITEM_NOT_FOUND = 6001,
    
    ORDER_NOT_FOUND = 7001
}