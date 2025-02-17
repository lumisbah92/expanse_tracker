import Transactions from "../Transactions";

const Dashboard = () => {
  return (
    <>
     <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-100 rounded shadow">Total Income: $0</div>
        <div className="p-4 bg-red-100 rounded shadow">Total Expense: $0</div>
        <div className="p-4 bg-blue-100 rounded shadow">Current Balance: $0</div>
      </div>
    </div>
     <Transactions/>
    </>
  );
}

export default Dashboard;