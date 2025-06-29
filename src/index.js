import express from 'express';
import cors from "cors";
import { router as orderRouter } from './routes/order.route.js';
import { router as productRouter } from './routes/product.route.js';
import { router as userRouter } from './routes/user.route.js';
import { runDb } from './db.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

const app = express();
const PORT = 3005;

app.use(express.json());
app.use(cors());
app.use(errorMiddleware);

app.get('/', async (req, res) => {
  res.send('Hello world!!!');
});

app.use('/orders', authMiddleware, orderRouter);
app.use('/products', authMiddleware, productRouter);
app.use('/users', userRouter);

const startApp = async () => {
  await runDb();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:3005`);
  });
}

startApp();
