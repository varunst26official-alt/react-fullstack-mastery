import { useState } from 'react';
import './App.css';

export default function App() {
  // 1. In-memory State (Mendix NPE: AccountBalance)
  const [balance, setBalance] = useState<number>(25000);

  // 2. Nanoflow 1: Deposit Action
  const handleDeposit = () => {
    setBalance(prev => prev + 5000);
  };

  // 3. Nanoflow 2: Withdraw Action
  const handleWithdraw = () => {
    if (balance >= 2000) {
      setBalance(prev => prev - 2000);
    } else {
      alert("Insufficient balance!");
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '400px', margin: 'auto' }}>
      <h2>Personal Ledger</h2>
      
      {/* Display Card */}
      <div style={{
        background: '#f8fafc',
        border: '2px solid #e2e8f0',
        borderRadius: '900px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <p style={{ margin: 0, color: '#64748b' }}>Available Balance</p>
        <h1 style={{ margin: '8px 0', color: balance >= 10000 ? '#16a34a' : '#dc2626' }}>
          ₹{balance.toLocaleString('en-IN')}
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
          Status: {balance >= 10000 ? '✅ Healthy' : '⚠️ Low Funds'}
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '100px' }}>
        <button 
          onClick={handleDeposit}
          style={{ flex: 1, padding: '10px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          + Deposit ₹5,000
        </button>

        <button 
          onClick={handleWithdraw}
          style={{ flex: 1, padding: '10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          - Spend ₹2,000
        </button>
      </div>
    </div>
  );
}