import { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';

export function TransactionForm() {
  // 🎯 ZERO PROP DRILLING: Only picks the add action from the store
  const addTransaction = useFinanceStore((state) => state.addTransaction);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) return;

    addTransaction({
      title: title.trim(),
      amount: Number(amount),
      type,
    });

    setTitle('');
    setAmount('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '20px',
      }}
    >
      <h4 style={{ margin: '0 0 12px 0' }}>Add Transaction</h4>

      <input
        type="text"
        placeholder="Title (e.g. Electricity, Freelance)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '8px',
          boxSizing: 'border-box',
          borderRadius: '6px',
          border: '1px solid #cbd5e1',
        }}
      />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          type="number"
          placeholder="Amount in INR"
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
        style={{
          width: '100%',
          padding: '10px',
          background: '#0f172a',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        + Record Entry
      </button>
    </form>
  );
}
