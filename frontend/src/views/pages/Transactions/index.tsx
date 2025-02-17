import React from 'react';

const Transactions = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Date</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Payment Method</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">2025-02-17</td>
            <td className="border p-2">Food</td>
            <td className="border p-2">Lunch</td>
            <td className="border p-2">$15</td>
            <td className="border p-2">Credit Card</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;