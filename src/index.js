import express from 'express';
import cors from "cors";
import { router as orderRouter } from './routes/order.route.js';
import { router as productRouter } from './routes/product.route.js';
import { router as userRouter } from './routes/user.route.js';
import { runDb } from './db.js'; // Ваша функция для подключения к БД
import { authMiddleware } from './middlewares/authMiddleware.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

const app = express();
// PORT здесь не нужен для Vercel Serverless Functions
// const PORT = 3005;

// Middleware
app.use(express.json());
app.use(cors());
app.use(errorMiddleware); // Убедитесь, что errorMiddleware корректно обрабатывает ошибки в Serverless-среде

// Подключение к базе данных при каждом запросе
// В Serverless Functions, подключение к БД нужно устанавливать при каждом "холодном старте" функции.
// Это означает, что runDb() должна быть вызвана внутри обработчика запроса или при инициализации app.
// Лучше всего, чтобы runDb() возвращала промис и устанавливала соединение,
// а также была "умной" и не пыталась переподключиться, если соединение уже есть.

// Пример: Подключение к БД при инициализации приложения
// Можно вынести эту логику в отдельный файл/функцию,
// чтобы она выполнялась только один раз при "холодном старте"
// и использовала существующее соединение для последующих запросов.
let isDbConnected = false;
async function connectToDbOnce() {
  if (!isDbConnected) {
    await runDb();
    isDbConnected = true;
    console.log('Database connected successfully on Vercel.');
  }
}

// Добавляем middleware для подключения к БД перед обработкой маршрутов
// Это гарантирует, что подключение будет установлено до выполнения запроса
// и будет использоваться для всех последующих запросов до "холодного старта" следующего инстанса.
app.use(async (req, res, next) => {
  await connectToDbOnce();
  next();
});

// Маршруты
app.get('/', (req, res) => {
  res.send('Hello world!!! This is Vercel Express App.');
});

app.use('/orders', authMiddleware, orderRouter);
app.use('/products', authMiddleware, productRouter);
app.use('/users', userRouter);

// **ОЧЕНЬ ВАЖНО:** Экспортируйте ваш Express-апп
export default app; // Используйте ES Module export, так как вы используете import/from

// Удалите startApp() и app.listen()
// const startApp = async () => {
//   await runDb(); // Это не будет работать так, как ожидается на Vercel
//   app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:3005`);
//   });
// }
// startApp();
