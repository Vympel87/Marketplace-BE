import express, { Express } from 'express'
import { PORT } from './internal'
import rootRouter from './routes'
import csrf from './routes/csrf';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/errors';
import path from 'path';
import csrfToken from 'csurf';
import cookieParser from 'cookie-parser';

const app: Express = express();

const csrfProtection = csrfToken({ cookie: true });

app.use(express.json())
app.use(cookieParser());
app.use('/storage/images', express.static(path.join(__dirname, 'storage/images')));
app.use('/api', rootRouter);
app.use('/api', csrf);
app.use('/api', csrfProtection);

export const prismaClient = new PrismaClient({
    log:['query']
}).$extends({
    result: {
        address: {
            formatedAddress: {
                needs: {
                    lineOne: true,
                    lineTwo: true,
                    city: true,
                    country: true,
                    pincode: true
                },
                compute: (address) => {
                    return `${address.lineOne}, ${address.lineTwo}, ${address.city}, ${address.country}, ${address.pincode}`
                }
            }
        }
    }
})

app.use(errorMiddleware)

app.listen(PORT, () => { console.log("App is working") });