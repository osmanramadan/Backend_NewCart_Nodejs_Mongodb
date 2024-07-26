import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import mongoose from 'mongoose';


const app: express.Application = express();
const port = process.env.PORT || 4000;

dotenv.config();


// app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);

app.listen(port, async (): Promise<void> => {
  const url = `http://localhost:${port}`;
  console.log(`Open ${url} to review the project..`);
});




try{
    mongoose.connect(process.env.CONNECTION_URL||'mongodb://localhost:27017/newcart')
}catch(e){
    console.log(e)
}

export default app;