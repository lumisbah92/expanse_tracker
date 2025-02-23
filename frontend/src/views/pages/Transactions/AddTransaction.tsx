import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define a Zod schema for a transaction.
const TransactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    required_error: 'Transaction type is required',
  }),
  // Category is an array but must have exactly one element.
  category: z
    .array(z.enum(['Food', 'Transport', 'Utilities']))
    .min(1, { message: 'Select a category' })
    .max(1, { message: 'Select only one category' }),
  amount: z.number({ required_error: 'Amount is required' }),
  date: z.preprocess(
    (val: any) => {
      if (val instanceof Date) return val;
      if (typeof val === 'string' && val.trim() !== '') return new Date(val);
      return undefined;
    },
    z.date({ required_error: 'Date is required' }).refine(
      (date) => !isNaN(date.getTime()),
      { message: 'Invalid date' }
    )
  ),
  description: z.string().optional(),
  paymentMethod: z.string().optional(),
});

type TransactionFormData = z.infer<typeof TransactionSchema>;

const AddTransaction: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      type: undefined,
      category: [],
      amount: undefined,
      date: new Date(),
      description: '',
      paymentMethod: '',
    },
  });

  const [transactionSent, setTransactionSent] = useState(false);
  const [isCategoryEmpty, setIsCategoryEmpty] = useState(false);

  const onSubmit = async (data: TransactionFormData) => {
    // Ensure one category is selected.
    if (!data.category || data.category.length === 0) {
      setIsCategoryEmpty(true);
      setTimeout(() => setIsCategoryEmpty(false), 2000);
      return;
    }

    const payload = {
      type: data.type,
      category: data.category[0], // Only one category is allowed.
      amount: data.amount,
      date: data.date,
      description: data.description,
      paymentMethod: data.paymentMethod,
    };

    console.log('Submitting payload:', payload);
    try {
      const url = `${import.meta.env.VITE_API_URL}/transactions`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('Error submitting transaction:', response.statusText);
      } else {
        const result = await response.json();
        console.log('Transaction submitted successfully:', result);
        setTransactionSent(true);
        setTimeout(() => setTransactionSent(false), 2000);
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };

  useEffect(() => {
    if (transactionSent) {
      reset();
    }
  }, [transactionSent, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-3xl w-full mx-auto p-4 bg-white rounded-[10px] shadow">
      <div className="border-b border-gray-300 pb-2">
        <h2 className="text-xl font-semibold">Add Transaction</h2>
        <p className="text-sm text-gray-500">Enter transaction details below</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900">Transaction Type</label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="income"
                  checked={field.value === 'income'}
                  onChange={field.onChange}
                  className="form-radio text-green-600"
                />
                <span>Income</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="expense"
                  checked={field.value === 'expense'}
                  onChange={field.onChange}
                  className="form-radio text-green-600"
                />
                <span>Expense</span>
              </label>
            </div>
          )}
        />
        {errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900">Category</label>
        <div className="flex space-x-4 mt-2">
          {['Food', 'Transport', 'Utilities'].map((option) => (
            <Controller
              key={option}
              name="category"
              control={control}
              render={({ field }) => (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={field.value.includes(option as any)}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...field.value, option]
                        : field.value.filter((val: string) => val !== option);
                      // Force only one selection
                      if (newValue.length > 1) {
                        newValue.splice(0, newValue.length - 1);
                      }
                      field.onChange(newValue);
                    }}
                    className="form-checkbox text-green-600"
                  />
                  <span>{option}</span>
                </label>
              )}
            />
          ))}
        </div>
        {(errors.category || isCategoryEmpty) && (
          <p className="text-red-600 text-sm">
            {errors.category ? errors.category.message : 'Select a category'}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900">Amount</label>
        <input
          type="number"
          placeholder="$ Amount"
          {...register('amount', { valueAsNumber: true })}
          className="w-full border rounded-[8px] p-2 mt-2"
        />
        {errors.amount && <p className="text-red-600 text-sm">{errors.amount.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900">Date</label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => {
            const dateStr = field.value instanceof Date ? field.value.toISOString().slice(0, 10) : '';
            return (
              <input
                type="date"
                value={dateStr}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  field.onChange(newDate);
                }}
                className="w-full border rounded-[8px] p-2 mt-2"
              />
            );
          }}
        />
        {errors.date && <p className="text-red-600 text-sm">{errors.date.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900">Description</label>
        <input
          type="text"
          placeholder="Description (optional)"
          {...register('description')}
          className="w-full border rounded-[8px] p-2 mt-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900">Payment Method</label>
        <input
          type="text"
          placeholder="Payment Method (optional)"
          {...register('paymentMethod')}
          className="w-full border rounded-[8px] p-2 mt-2"
        />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="w-36 h-12 bg-gray-900 text-white rounded-[8px] transition duration-300 ease-in-out hover:scale-105">
          {transactionSent ? 'Transaction Sent' : 'Add Transaction'}
        </button>
      </div>

      {transactionSent && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded">
          Transaction added successfully
        </div>
      )}
    </form>
  );
};

export default AddTransaction;
