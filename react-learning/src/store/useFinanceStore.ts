import { create } from 'zustand';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
}

interface FinanceState {
  // 1. Core State Properties
  transactions: Transaction[];
  usdRate: number;
  isLiveStreaming: boolean;
  priceDirection: 'UP' | 'DOWN';
  viewCurrency: 'INR' | 'USD';

  // 2. State Mutation Actions (Dispatched by Components)
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateUsdRate: (delta: number) => void;
  toggleLiveStreaming: () => void;
  setViewCurrency: (currency: 'INR' | 'USD') => void;
}

/**
 * 🏛️ ENTERPRISE STORE ARCHITECTURE (Zustand)
 * Equivalent to Mendix Session Entity / Global Domain Store.
 * Lives outside the React tree in JavaScript heap memory.
 * Components subscribe surgically to specific selectors with zero prop drilling.
 */
export const useFinanceStore = create<FinanceState>((set) => ({
  transactions: [
    { id: '1', title: 'Salary Credit', amount: 45000, type: 'INCOME' },
    { id: '2', title: 'Grocery Mart', amount: 3200, type: 'EXPENSE' },
  ],
  usdRate: 86.50,
  isLiveStreaming: true,
  priceDirection: 'UP',
  viewCurrency: 'INR',

  // Immutable Add: Prepends new entry with a unique timestamp ID
  addTransaction: (newTx) =>
    set((state) => ({
      transactions: [
        { ...newTx, id: Date.now().toString() },
        ...state.transactions,
      ],
    })),

  // Immutable Delete: Filters out target item without mutating array
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  // Market Ticker Action: Evaluates delta and assigns UP/DOWN direction
  updateUsdRate: (delta) =>
    set((state) => {
      const nextRate = Number((state.usdRate + delta).toFixed(2));
      return {
        usdRate: nextRate,
        priceDirection: delta >= 0 ? 'UP' : 'DOWN',
      };
    }),

  // Toggle Live Streaming: Pauses or resumes background intervals
  toggleLiveStreaming: () =>
    set((state) => ({ isLiveStreaming: !state.isLiveStreaming })),

  // Switch View Currency: Toggle INR vs USD calculations
  setViewCurrency: (currency) =>
    set({ viewCurrency: currency }),
}));
