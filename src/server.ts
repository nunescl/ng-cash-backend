import express from 'express';
import { Response } from 'express';
import cors from 'cors';
import { AppDataSource } from './data/config/data-source';
import UserRoutes from './infra/user-routes';

const PORT = 3333;

const app = express();
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (res: Response) => {
  res.json({ status: 'sucess', version: '1.0.0' }).status(200);
});

app.use('/user', UserRoutes);

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
  })
  .catch((error) => console.log(error));
