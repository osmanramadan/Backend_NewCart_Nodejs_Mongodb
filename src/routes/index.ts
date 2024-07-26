import express from 'express';
import users from './api/user';


const routes: express.Router = express.Router();

routes.use('/api/v1/users',users);


routes.get('/', (_req: express.Request, res: express.Response) => {
  res.status(200);
  res.send('this main page of routes');
});

export default routes;