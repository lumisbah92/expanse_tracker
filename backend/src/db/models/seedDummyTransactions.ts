import Transaction from "./TransactionModel";
import User from "./UserModel";
import bcrypt from 'bcrypt';

export const seedDummyTransactions = async (): Promise<void> => {
  try {
    const userCount = await User.count({
      where: {
        email: 'dummy@example.com'
      }
    });

    if (userCount > 0) return;

    const hashedPassword = await bcrypt.hash("dummyPassword", 10);
    const user = await User.create({
        name: 'Dummy User',
        email: 'dummy@example.com',
        password: hashedPassword
    });

    // Prepare 40 dummy transactions.
    const dummyTransactions = [];
    for (let i = 0; i < 40; i++) {
      dummyTransactions.push({
        amount: parseFloat((Math.random() * 1000).toFixed(2)),
        date: new Date(),
        category: i % 2 === 0 ? 'Food' : 'Transport',
        description: `Dummy transaction ${i + 1}`,
        paymentMethod: i % 2 === 0 ? 'Credit Card' : 'Cash',
        type: i % 2 === 0 ? 'expense' : 'income',
        userId: user.id
      });
    }

    await Transaction.bulkCreate(dummyTransactions);
    console.log('Seeded 40 dummy transactions.');
  } catch (error: any) {
    console.error('Error seeding dummy transactions:', error.message);
  }
};
