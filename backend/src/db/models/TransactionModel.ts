import { DataTypes, Model } from 'sequelize';
import sequelize from '../dbConfig'; // Your sequelize instance
import User from './UserModel';

class Transaction extends Model {
  public id!: number;
  public amount!: number;
  public date!: Date;
  public category!: string;
  public description!: string;
  public paymentMethod!: string;
  public type!: string;
  public userId!: number; // Foreign key to User model
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // Reference the User model
        key: 'id',
      },
    },
  },
  {
    sequelize, // passing the `sequelize` instance
    tableName: 'transactions', // define the table name
  }
);

// Relationship: A User can have many Transactions
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

export default Transaction;
