import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Transaction from '../db/models/TransactionModel';

export const addTransaction = async (req: Request, res: Response) => {
  const { amount, date, category, description, paymentMethod, type } = req.body;

  try {
    await Transaction.create({
      userId: req.userId!,
      amount,
      date: new Date(date),
      category,
      description,
      paymentMethod,
      type
    });
    res.status(201).json({ message: 'Transaction added' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const listTransactions = async (req: Request, res: Response) => {
  const { page = 1, pageSize = 10, search = '', category = '' } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);

  try {
    const transactions = await Transaction.findAll({
      where: {
        userId: req.userId!,
        [Op.or]: [
          { description: { [Op.iLike]: `%${search}%` } },
          { category: { [Op.iLike]: `%${search}%` } }
        ],
        category: category ? String(category) : undefined
      },
      order: [['date', 'DESC']],
      limit: Number(pageSize),
      offset
    });
    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const editTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount, date, category, description, paymentMethod, type } = req.body;

  try {
    await Transaction.update(
      { amount, date: new Date(date), category, description, paymentMethod, type },
      { where: { id: Number(id) } }
    );
    res.json({ message: 'Transaction updated' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const removeTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Transaction.destroy({ where: { id: Number(id) } });
    res.json({ message: 'Transaction deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionSummary = async (req: Request, res: Response) => {
  try {
    const income = await Transaction.sum('amount', {
      where: { userId: req.userId!, type: 'income' }
    });
    const expense = await Transaction.sum('amount', {
      where: { userId: req.userId!, type: 'expense' }
    });

    const totalIncome = income || 0;
    const totalExpense = expense || 0;
    const balance = totalIncome - totalExpense;

    res.json({ totalIncome, totalExpense, balance });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

