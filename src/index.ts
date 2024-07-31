import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import mongoose from 'mongoose';
import cors from 'cors';


const app: express.Application = express();
const port = process.env.PORT || 4000;

dotenv.config();
// const corsOptions = {
//   origin: 'http://localhost:4000', // Replace with your frontend URL
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
// };

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);

app.listen(port, async (): Promise<void> => {
  const url = `http://localhost:${port}`;
  console.log(`Open ${url} to review the project..`);
});



try{
    mongoose.connect(process.env.CONNECTION_URL||'mongodb://0.0.0.0:27017/newcart')
}catch(e){
  //@ts-ignore
    console.log(e.message)
}

export default app;