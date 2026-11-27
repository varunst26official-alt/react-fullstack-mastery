import { MarketTicker } from './components/MarketTicker';
import { BalanceCard } from './components/BalanceCard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import './App.css';

/**
 * 🏛️ REFACTORED ENTERPRISE ARCHITECTURE (Week 5: Zustand Store)
 * Notice how App.tsx contains ZERO useState hooks and ZERO prop drilling!
 * Every child component connects directly to the global store via surgical selectors.
 */
export default function App() {
  return (
    <div
      style={{
        maxWidth: '520px',
        margin: '30px auto',
        padding: '24px',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        color: '#1e293b',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: 800 }}>Personal Cash Ledger</h2>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
          Phase 2 • Decoupled Zustand Store Architecture
        </p>
      </div>

      {/* 1. Real-Time Exchange Rate Bar (Subscribes to usdRate & stream status) */}
      <MarketTicker />

      {/* 2. Balance & Financial Health Card (Subscribes to transactions & currency) */}
      <BalanceCard />

      {/* 3. New Entry Form (Subscribes to addTransaction action) */}
      <TransactionForm />

      {/* 4. Filterable Ledger History (Subscribes to transactions & delete action) */}
      <TransactionList />
    </div>
  );
}
