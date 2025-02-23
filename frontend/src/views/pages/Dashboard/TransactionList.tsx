import React, { useEffect, useState } from 'react';
import svgIcons from '../../../services/svgService';

interface Transaction {
  id: number;
  amount: number;
  date: string; // ISO date string
  category: string;
  description: string;
  paymentMethod: string;
  type: string; // e.g., 'income' or 'expense'
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface TransactionData {
  transactions: Transaction[];
  totalTransaction: number;
}

const TransactionListTable: React.FC = () => {
  const [tabValue, setTabValue] = useState(0); // 0 = All, 1 = Expense, 2 = Income
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const url = new URL(`${import.meta.env.VITE_API_URL}/transactions`);
        url.searchParams.append('page', (page + 1).toString());
        url.searchParams.append('perPage', rowsPerPage.toString());
        if (searchQuery) url.searchParams.append('search', searchQuery);
        if (selectedCategory) url.searchParams.append('category', selectedCategory);
        if (tabValue === 1) url.searchParams.append('type', 'expense');
        if (tabValue === 2) url.searchParams.append('type', 'income');

        const response = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message);
          return;
        }

        const data: TransactionData = await response.json();
        setTransactions(data.transactions);
        setTotalTransactions(data.totalTransaction);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page, rowsPerPage, tabValue, searchQuery, selectedCategory]);

  const rowsPerPageOptions = [5, 10, 25, 50, 100];
  const totalPages = Math.ceil(totalTransactions / rowsPerPage);

  // Handle form input changes for edit modal
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (editingTransaction) {
      const { name, value } = e.target;
      setEditingTransaction({
        ...editingTransaction,
        [name]: name === 'amount' ? Number(value) : value,
      });
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTransaction) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/transactions/${editingTransaction.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            amount: Number(editingTransaction.amount),
            date: editingTransaction.date,
            category: editingTransaction.category,
            description: editingTransaction.description,
            paymentMethod: editingTransaction.paymentMethod,
            type: editingTransaction.type,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to update transaction'}`);
        return;
      }
      // Update local transactions list
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === editingTransaction.id ? { ...editingTransaction } : tx
        )
      );
      setEditingTransaction(null);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  // Handle delete confirmation
  const handleDeleteSubmit = async () => {
    if (!deletingTransaction) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/transactions/${deletingTransaction.id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to delete transaction'}`);
        return;
      }
      // Remove transaction from the local state
      setTransactions((prev) =>
        prev.filter((tx) => tx.id !== deletingTransaction.id)
      );
      setDeletingTransaction(null);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="w-full rounded border border-gray-200">
      {/* Header */}
      <div className="px-2 lg:px-3 border-b border-gray-300">
        <h2 className="text-lg font-semibold text-gray-900">Transaction List</h2>
      </div>

      <div className="p-0">
        {/* Tabs */}
        <div className="px-1 lg:px-3 border-b border-gray-300">
          <div className="flex space-x-4">
            <button
              onClick={() => setTabValue(0)}
              className={`py-2 text-sm ${
                tabValue === 0 ? 'border-b-2 border-gray-900 font-semibold' : 'text-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTabValue(1)}
              className={`py-2 text-sm ${
                tabValue === 1 ? 'border-b-2 border-gray-900 font-semibold' : 'text-gray-600'
              }`}
            >
              Expense
            </button>
            <button
              onClick={() => setTabValue(2)}
              className={`py-2 text-sm ${
                tabValue === 2 ? 'border-b-2 border-gray-900 font-semibold' : 'text-gray-600'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-wrap items-center gap-2 px-1 lg:px-3 py-2">
          <div className="relative w-full lg:w-[505px]">
            <div
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              dangerouslySetInnerHTML={{ __html: svgIcons.search_icon }}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-2 w-full border rounded"
            />
          </div>
          <div className="w-full lg:w-[200px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border rounded p-2 text-sm"
            >
              <option value="">All</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Utilities">Utilities</option>
            </select>
          </div>
        </div>

        {/* Loading, Error, or Table */}
        {loading ? (
          <div className="flex justify-center items-center h-[200px]">Loading...</div>
        ) : error ? (
          <p className="text-red-600 text-center py-4">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-max">
                <thead>
                  <tr>
                    <th className="px-2 lg:px-4 py-2 text-left">Date</th>
                    <th className="px-2 lg:px-4 py-2 text-left">Category</th>
                    <th className="px-2 lg:px-4 py-2 text-left">Description</th>
                    <th className="hidden lg:table-cell px-2 lg:px-4 py-2 text-left">
                      Payment Method
                    </th>
                    <th className="px-2 lg:px-4 py-2 text-left">Amount</th>
                    <th className="px-2 lg:px-4 py-2 text-left">Type</th>
                    <th className="px-2 lg:px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t border-gray-200">
                      <td className="px-2 lg:px-4 py-2">
                        <span className="text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-2 lg:px-4 py-2">
                        <span className="text-sm text-gray-900">{transaction.category}</span>
                      </td>
                      <td className="px-2 lg:px-4 py-2">
                        <span className="text-sm text-gray-900">{transaction.description}</span>
                      </td>
                      <td className="hidden lg:table-cell px-2 lg:px-4 py-2">
                        <span className="text-sm text-gray-900">{transaction.paymentMethod}</span>
                      </td>
                      <td className="px-2 lg:px-4 py-2">
                        <span className="text-sm text-gray-900">
                          ${transaction.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-2 lg:px-4 py-2">
                        <span className="text-sm text-gray-900 capitalize">
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-2 lg:px-4 py-2 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            className="p-1 hover:bg-gray-200 rounded"
                            onClick={() => setEditingTransaction(transaction)}
                          >
                            <div
                              dangerouslySetInnerHTML={{ __html: svgIcons.edit_icon }}
                            />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-200 rounded"
                            onClick={() => setDeletingTransaction(transaction)}
                          >
                            <div
                              dangerouslySetInnerHTML={{ __html: svgIcons.more_icon }}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-4">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-end items-center mr-4 mt-4 space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  className="border rounded p-1 text-sm"
                >
                  {rowsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                  className="p-2 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-700">
                  {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                  disabled={page >= totalPages - 1}
                  className="p-2 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Transaction</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={editingTransaction.amount}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                  step="0.01"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={editingTransaction.date.substring(0, 10)}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={editingTransaction.category}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={editingTransaction.description}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <input
                  type="text"
                  name="paymentMethod"
                  value={editingTransaction.paymentMethod}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="type"
                  value={editingTransaction.type}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingTransaction(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete this transaction?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setDeletingTransaction(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionListTable;
