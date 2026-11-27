import { useFinanceStore } from '../store/useFinanceStore';

export function BalanceCard() {
  // 🎯 SURGICAL SUBSCRIPTION: Only re-renders when transactions, currency or rate change!
  const transactions = useFinanceStore((state) => state.transactions);
  const usdRate = useFinanceStore((state) => state.usdRate);
  const viewCurrency = useFinanceStore((state) => state.viewCurrency);
  const setViewCurrency = useFinanceStore((state) => state.setViewCurrency);

  // Derived state calculated on-the-fly
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const balanceINR = totalIncome - totalExpense;
  const balanceUSD = Number((balanceINR / usdRate).toFixed(2));

  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Current Net Balance</span>
        <button
          type="button"
          onClick={() => setViewCurrency(viewCurrency === 'INR' ? 'USD' : 'INR')}
          style={{
            background: '#e2e8f0',
            border: 'none',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '11px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {viewCurrency === 'INR' ? 'Switch to USD ($)' : 'Switch to INR (₹)'}
        </button>
      </div>

      <h1 style={{ margin: '8px 0', color: balanceINR >= 0 ? '#16a34a' : '#dc2626' }}>
        {viewCurrency === 'INR' ? `₹${balanceINR.toLocaleString('en-IN')}` : `$${balanceUSD}`}
      </h1>

      <div style={{ display: 'flex', gap: '20px', marginTop: '8px', fontSize: '13px' }}>
        <span style={{ color: '#16a34a', fontWeight: 'bold' }}>+₹{totalIncome.toLocaleString('en-IN')} Income</span>
        <span style={{ color: '#dc2626', fontWeight: 'bold' }}>-₹{totalExpense.toLocaleString('en-IN')} Expense</span>
      </div>
    </div>
  );
}
