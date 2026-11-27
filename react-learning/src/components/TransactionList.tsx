import { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { useDebounce } from '../useDebounce';

export function TransactionList() {
  const transactions = useFinanceStore((state) => state.transactions);
  const usdRate = useFinanceStore((state) => state.usdRate);
  const viewCurrency = useFinanceStore((state) => state.viewCurrency);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 350);

  const filteredTransactions = transactions.filter((t) =>
    t.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ margin: 0 }}>Transaction History ({filteredTransactions.length})</h4>
        {searchTerm && (
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            Filtering by: <strong>"{debouncedSearch}"</strong>
          </span>
        )}
      </div>

      {/* Debounced Search Input */}
      <div style={{ marginBottom: '14px' }}>
        <input
          type="text"
          placeholder="🔍 Search entries by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '9px 12px',
            boxSizing: 'border-box',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '13px',
            outline: 'none',
          }}
        />
        {searchTerm !== debouncedSearch && (
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#38bdf8', fontWeight: 600 }}>
            ⏳ Waiting for you to pause typing (350ms debounce)...
          </p>
        )}
      </div>

      {filteredTransactions.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: '13px' }}>
          {searchTerm ? `No transactions matching "${debouncedSearch}"` : 'No transactions recorded yet.'}
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filteredTransactions.map((tx) => {
            const displayAmount =
              viewCurrency === 'INR'
                ? `₹${tx.amount.toLocaleString('en-IN')}`
                : `$${(tx.amount / usdRate).toFixed(2)}`;

            return (
              <li
                key={tx.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  marginBottom: '8px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{tx.title}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>ID: {tx.id}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: tx.type === 'INCOME' ? '#16a34a' : '#dc2626',
                    }}
                  >
                    {tx.type === 'INCOME' ? '+' : '-'}
                    {displayAmount}
                  </span>

                  <button
                    type="button"
                    onClick={() => deleteTransaction(tx.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '14px',
                      padding: '2px 6px',
                    }}
                    title="Delete Transaction"
                  >
                    ✕
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
