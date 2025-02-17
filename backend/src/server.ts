import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from './config/config';
import authRouter from './routes/authRoutes';
import transactionRouter from './routes/transactionRoutes';
import sequelize from './db/dbConfig';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRouter);
app.use('/transactions', transactionRouter);

// Function to sync the database with models
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Error syncing the database:', error);
    process.exit(1);
  }
};

// Start the server
const PORT = config.port || 5000;
app.listen(PORT, async () => {
  await syncDatabase();
  console.log(`Server is running on port ${PORT}`);
});

