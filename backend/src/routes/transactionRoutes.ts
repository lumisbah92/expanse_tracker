import express from 'express';
import {
  addTransaction,
  listTransactions,
  editTransaction,
  removeTransaction,
  getTransactionSummary
} from '../controllers/transactionController';
import { authenticate } from '../middleware/authMiddleware';
const transactionRouter = express.Router();

transactionRouter.post('/', authenticate, addTransaction);
transactionRouter.get('/', authenticate, listTransactions);
transactionRouter.put('/:id', authenticate, editTransaction);
transactionRouter.delete('/:id', authenticate, removeTransaction);
transactionRouter.get('/summary', authenticate, getTransactionSummary);

export default transactionRouter;