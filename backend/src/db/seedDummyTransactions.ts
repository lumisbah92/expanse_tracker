import Transaction from "./models/TransactionModel";
import User from "./models/UserModel";
import bcrypt from 'bcrypt';

export const seedDummyTransactions = async (): Promise<void> => {
  try {
    const userCount = await User.count({
      where: { email: 'dummy@example.com' }
    });

    if (userCount > 0) return;

    const hashedPassword = await bcrypt.hash("dummyPassword", 10);
    const user = await User.create({
      name: 'Dummy User',
      email: 'dummy@example.com',
      password: hashedPassword
    });

    // Create dummy transactions for the past 14 days
    const categories = ['Food', 'Transport', 'Utilities'];
    const types = ['income', 'expense'];
    const dummyTransactions = [];

    // For each of the past 14 days, create 3 transactions
    for (let day = 0; day < 14; day++) {
      const transactionDate = new Date();
      transactionDate.setDate(transactionDate.getDate() - day);

      const transactionCount = Math.floor(Math.random() * 8 + 3);
      for (let i = 0; i < transactionCount; i++) {
        dummyTransactions.push({
          amount: parseFloat((Math.random() * 1000).toFixed(2)),
          date: transactionDate,
          category: categories[Math.floor(Math.random() * categories.length)],
          description: `Dummy transaction for ${transactionDate.toDateString()} #${i + 1}`,
          paymentMethod: Math.random() > 0.5 ? 'Credit Card' : 'Cash',
          type: (i%2==0) ? "income" : "expense",
          userId: user.id
        });
      }
    }

    await Transaction.bulkCreate(dummyTransactions);
    console.log('Seeded dummy transactions for the past 14 days.');
  } catch (error: any) {
    console.error('Error seeding dummy transactions:', error.message);
  }
};
