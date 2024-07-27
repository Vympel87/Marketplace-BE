import { Router, Request, Response } from 'express';
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });
const csrfRoutes: Router = Router();

csrfRoutes.get('/csrf-token', csrfProtection, (req: Request, res: Response) => {
  res.json({ csrfToken: req.csrfToken() });
});

export default csrfRoutes;
