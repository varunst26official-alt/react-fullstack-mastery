import { useEffect } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';

export function MarketTicker() {
  // 🎯 SURGICAL SUBSCRIPTION: Only re-renders when ticker properties change!
  const usdRate = useFinanceStore((state) => state.usdRate);
  const priceDirection = useFinanceStore((state) => state.priceDirection);
  const isLiveStreaming = useFinanceStore((state) => state.isLiveStreaming);
  const updateUsdRate = useFinanceStore((state) => state.updateUsdRate);
  const toggleLiveStreaming = useFinanceStore((state) => state.toggleLiveStreaming);

  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      const delta = Math.random() * 0.3 - 0.15;
      updateUsdRate(delta);
    }, 2500);

    return () => clearInterval(interval);
  }, [isLiveStreaming, updateUsdRate]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#0f172a',
        color: '#f8fafc',
        padding: '10px 14px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '13px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isLiveStreaming ? '#22c55e' : '#94a3b8',
          }}
        />
        <span>USD/INR Feed:</span>
        <strong
          style={{
            fontFamily: 'monospace',
            color: priceDirection === 'UP' ? '#4ade80' : '#f87171',
          }}
        >
          ₹{usdRate.toFixed(2)} {priceDirection === 'UP' ? '▲' : '▼'}
        </strong>
      </div>

      <button
        type="button"
        onClick={toggleLiveStreaming}
        style={{
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#cbd5e1',
          padding: '4px 10px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '11px',
        }}
      >
        {isLiveStreaming ? 'Pause Feed' : 'Resume Feed'}
      </button>
    </div>
  );
}
