import { useState } from 'react';
import './App.css';

// 1. DOMAIN MODEL (Mendix: Transaction Entity with attributes)
interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
}

export default function App() {
  // 2. LIST STATE (Mendix: List of Transaction Entities in memory)
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', title: 'Salary Credit', amount: 45000, type: 'INCOME' },
    { id: '2', title: 'Grocery Mart', amount: 3200, type: 'EXPENSE' },
  ]);

  // 3. FORM INPUT STATE (Mendix: Helper Form NPE attributes)
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');

  // 4. DERIVED STATE (Mendix: Calculated Virtual Attributes)
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // 5. NANOFLOW: Add Transaction (Mendix: Create Object & Commit)
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents browser from refreshing the page
    if (!title || !amount) return;

    const newTx: Transaction = {
      id: Date.now().toString(), // Unique GUID
      title,
      amount: Number(amount),
      type,
    };

    // Immutable update: Add newTx to the top of the list
    setTransactions(prev => [newTx, ...prev]);

    // Reset form inputs (Mendix: Reset input fields)
    setTitle('');
    setAmount('');
  };

  // 6. NANOFLOW: Delete Transaction (Mendix: Delete Object)
  const handleDelete = (idToDelete: string) => {
    setTransactions(prev => prev.filter(t => t.id !== idToDelete));
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '450px', margin: 'auto' }}>
      <h2>Personal Cash Ledger</h2>

      {/* SUMMARY CARD (Derived State) */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Current Net Balance</p>
        <h1 style={{ margin: '6px 0', color: balance >= 0 ? '#16a34a' : '#dc2626' }}>
          ₹{balance.toLocaleString('en-IN')}
        </h1>
        <div style={{ display: 'flex', gap: '20px', marginTop: '8px', fontSize: '13px' }}>
          <span style={{ color: '#16a34a', fontWeight: 'bold' }}>+₹{totalIncome.toLocaleString('en-IN')} Income</span>
          <span style={{ color: '#dc2626', fontWeight: 'bold' }}>-₹{totalExpense.toLocaleString('en-IN')} Expense</span>
        </div>
      </div>

      {/* INPUT FORM (Mendix: Data View with Text Boxes) */}
      <form onSubmit={handleAddTransaction} style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 12px 0' }}>Add Transaction</h4>
        
        <input
          type="text"
          placeholder="Title (e.g. Electricity, Petrol)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '8px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        />

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'INCOME' | 'EXPENSE')}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
          >
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>

        <button
          type="submit"
          style={{ width: '100%', padding: '10px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Record Entry
        </button>
      </form>

      {/* TRANSACTION LIST (Mendix: List View Widget) */}
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>Transaction History ({transactions.length})</h4>
        
        {transactions.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '13px' }}>No transactions recorded yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {/* JavaScript .map() looping through list items */}
            {transactions.map((tx) => (
              <li
                key={tx.id} // Mendix Object GUID
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{tx.title}</p>
                  <span style={{ fontSize: '11px', color: tx.type === 'INCOME' ? '#16a34a' : '#dc2626' }}>
                    {tx.type}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 'bold', color: tx.type === 'INCOME' ? '#16a34a' : '#dc2626' }}>
                    {tx.type === 'INCOME' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}