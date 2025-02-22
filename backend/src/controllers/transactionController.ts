import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Transaction from '../db/models/TransactionModel';
import sequelize from '../db/dbConfig';

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
  const { page = 1, perPage = 10, search = '', category = '', type = '' } = req.query;
  const offset = (Number(page) - 1) * Number(perPage);

  // Build the where clause dynamically
  const whereClause: any = {
    userId: req.userId!,
    [Op.or]: [
      { description: { [Op.iLike]: `%${search}%` } },
      { category: { [Op.iLike]: `%${search}%` } },
    ]
  };

  if (category) whereClause.category = String(category);
  if (type) whereClause.type = String(type);

  try {
    const transactions = await Transaction.findAll({
      where: whereClause,
      order: [['date', 'DESC']],
      limit: Number(perPage),
      offset
    });
    const totalTransaction = await Transaction.count({ where:whereClause });
    res.json({transactions, totalTransaction});
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
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - 7);

    const previousWeekStart = new Date(now);
    previousWeekStart.setDate(now.getDate() - 14);

    // Sum income for current and previous weeks
    const currentIncome = (await Transaction.sum('amount', {
      where: {
        userId: req.userId!,
        type: 'income',
        date: { [Op.gte]: currentWeekStart, [Op.lt]: now },
      },
    })) || 0;

    const previousIncome = (await Transaction.sum('amount', {
      where: {
        userId: req.userId!,
        type: 'income',
        date: { [Op.gte]: previousWeekStart, [Op.lt]: currentWeekStart },
      },
    })) || 0;

    // Sum expense for current and previous weeks
    const currentExpense = (await Transaction.sum('amount', {
      where: {
        userId: req.userId!,
        type: 'expense',
        date: { [Op.gte]: currentWeekStart, [Op.lt]: now },
      },
    })) || 0;

    const previousExpense = (await Transaction.sum('amount', {
      where: {
        userId: req.userId!,
        type: 'expense',
        date: { [Op.gte]: previousWeekStart, [Op.lt]: currentWeekStart },
      },
    })) || 0;

    const currentBalance = currentIncome - currentExpense;
    const previousBalance = previousIncome - previousExpense;

    const calculatePercentage = (current: number, previous: number): number => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }
      return ((current - previous) / previous) * 100;
    };

    const incomePercentage = calculatePercentage(currentIncome, previousIncome);
    const expensePercentage = calculatePercentage(currentExpense, previousExpense);
    const balancePercentage = calculatePercentage(currentBalance, previousBalance);

    const summaryItems = [
      { title: 'Total Income', count: Math.round((currentIncome / 100) * 10) / 10, percentage: incomePercentage },
      { title: 'Total Expense', count: Math.round((currentExpense / 100) * 10) / 10, percentage: expensePercentage },
      { title: 'Balance', count: Math.round((currentBalance / 100) * 10) / 10, percentage: balancePercentage },
    ];

    res.json(summaryItems);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    // JavaScript's getDay(): Sunday = 0, Monday = 1, ..., Saturday = 6. To get Monday as the start:
    const dayOfWeek = today.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const transactions = await Transaction.findAll({
      where: {
        userId: req.userId!,
        date: {
          [Op.gte]: startOfWeek,
          [Op.lt]: endOfWeek,
        },
      },
    });

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    const transactionAmounts: { [day: string]: { income: number; expense: number } } = {};
    const transactionCounts: { [day: string]: number } = {};
    days.forEach((day) => {
      transactionAmounts[day] = { income: 0, expense: 0 };
      transactionCounts[day] = 0;
    });

    transactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      const dayIndex = (txDate.getDay() + 6) % 7;
      const dayName = days[dayIndex];

      if (tx.type === 'income') {
        transactionAmounts[dayName].income += Number(tx.amount);
      } else if (tx.type === 'expense') {
        transactionAmounts[dayName].expense += Number(tx.amount);
      }
      transactionCounts[dayName] += 1;
    });

    res.json({
      transaction_amounts: transactionAmounts,
      transaction_counts: transactionCounts,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
