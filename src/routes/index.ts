import express from 'express';
import users from './api/user';
import products from './api/product';



const routes: express.Router = express.Router();

routes.use('/api/v1/users',users);
routes.use('/api/v1/products',products);


routes.get('/', (_req: express.Request, res: express.Response) => {
  res.status(200);
  res.send('this main page of routes');
});

export default routes;