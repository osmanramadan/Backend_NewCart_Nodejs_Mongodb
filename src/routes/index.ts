import express from 'express';
import users from './api/user';
import products from './api/product';
import shipping from './api/shipping';
import payments from './api/payment';
import orders from './api/order';



const routes: express.Router = express.Router();

routes.use('/api/v1/users',users);
routes.use('/api/v1/products',products);
routes.use('/api/v1/shipping',shipping);
routes.use('/api/v1/payment',payments);
routes.use('/api/v1/orders',orders);


routes.get('/', (_req: express.Request, res: express.Response) => {
  res.status(200);
  res.send('this main page of routes');
});

export default routes;