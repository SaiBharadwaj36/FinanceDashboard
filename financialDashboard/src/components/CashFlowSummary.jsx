const CashFlowSummary = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Cash Flow Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">$5,400</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">$2,300</p>
        </div>
      </div>
    </div>
  );
};

export default CashFlowSummary;