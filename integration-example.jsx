// integration-example.jsx
// DTN (Delay-Tolerant Networking) for Rural Connectivity
// Example React components for integrating with the rural-dtn-module WASM package.

import React, { useState, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════
// DTN Bundle Display Component
// Shows a single store-and-forward bundle (message) in the network.
// ═══════════════════════════════════════════════════════════════════

export function DtnBundleCard({ bundle }) {
  return (
    <div
      style={{
        padding: '12px 16px',
        background: '#252b3b',
        borderRadius: 8,
        marginBottom: 8,
        borderLeft: '4px solid #22c55e',
        fontFamily: 'monospace',
        fontSize: 14,
      }}
    >
      <div><strong>{bundle.source}</strong> → <strong>{bundle.destination}</strong></div>
      <div style={{ color: '#94a3b8', marginTop: 4 }}>{bundle.payload}</div>
      <div style={{ fontSize: 12, marginTop: 4 }}>
        hops: {bundle.hop_count ?? 0} | id: {bundle.id?.slice(0, 8)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Rural DTN Message Composer
// Create and send bundles (for demo; real app would use WASM module).
// ═══════════════════════════════════════════════════════════════════

export function DtnMessageComposer({ onSend, villages = ['village_a', 'village_b', 'health_center'] }) {
  const [from, setFrom] = useState(villages[0]);
  const [to, setTo] = useState(villages[1]);
  const [payload, setPayload] = useState('');

  const handleSend = useCallback(() => {
    if (!payload.trim()) return;
    const bundle = {
      id: `bundle-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      source: from,
      destination: to,
      payload: payload.trim(),
      created_at: Date.now(),
      hop_count: 0,
    };
    onSend?.(bundle);
    setPayload('');
  }, [from, to, payload, onSend]);

  return (
    <div style={{ padding: 16, background: '#1a1f2e', borderRadius: 8 }}>
      <h4 style={{ margin: '0 0 12px', color: '#22c55e' }}>Create DTN Message</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div>
          <label>From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} style={{ marginLeft: 8 }}>
            {villages.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label>To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} style={{ marginLeft: 8 }}>
            {villages.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Message</label>
          <input
            type="text"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder="e.g., Market price: rice 45/kg"
            style={{ marginLeft: 8, padding: 8, width: 280 }}
          />
        </div>
        <button onClick={handleSend} style={{ alignSelf: 'flex-start' }}>
          Send (Store for Forward)
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Link Status Indicator
// Shows connectivity between nodes (DOWN / INTERMITTENT / UP).
// ═══════════════════════════════════════════════════════════════════

export function LinkStatusBadge({ status, label }) {
  const config = {
    0: { bg: '#ef4444', text: 'DOWN' },
    1: { bg: '#f59e0b', text: 'INTERMITTENT' },
    2: { bg: '#22c55e', text: 'UP' },
  };
  const c = config[status] ?? config[0];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: 6,
        background: c.bg,
        color: status === 2 ? '#1a1f2e' : 'white',
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {label}: {c.text}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Rural DTN Dashboard
// Full demo page combining composer, queue, and status.
// ═══════════════════════════════════════════════════════════════════

export default function RuralDtnDashboard() {
  const [bundles, setBundles] = useState([]);
  const [linkStatus, setLinkStatus] = useState({ a: 0, b: 0 });

  const handleSend = useCallback((bundle) => {
    setBundles((prev) => [...prev, bundle]);
  }, []);

  const simulateConnectivity = useCallback(() => {
    setLinkStatus((prev) => ({
      a: (prev.a + 1) % 3,
      b: (prev.b + 2) % 3,
    }));
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#22c55e' }}>Rural DTN Dashboard</h1>
      <p style={{ color: '#94a3b8' }}>
        Delay-Tolerant Networking for intermittent rural connectivity. Messages are stored locally
        and forwarded when links become available.
      </p>

      <div style={{ marginBottom: 24 }}>
        <DtnMessageComposer onSend={handleSend} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8 }}>Link Status</h3>
        <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
          <LinkStatusBadge status={linkStatus.a} label="Village A ↔ Relay" />
          <LinkStatusBadge status={linkStatus.b} label="Relay ↔ Village B" />
        </div>
        <button onClick={simulateConnectivity} style={{ background: '#252b3b', color: '#e2e8f0', border: '2px solid #475569' }}>
          Simulate Time Step (Change Connectivity)
        </button>
      </div>

      <div>
        <h3 style={{ marginBottom: 8 }}>Message Queue ({bundles.length})</h3>
        {bundles.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No messages. Create one above.</p>
        ) : (
          bundles.map((b) => <DtnBundleCard key={b.id} bundle={b} />)
        )}
      </div>

      <div style={{ marginTop: 32, padding: 16, background: '#0f1219', borderRadius: 8 }}>
        <h4>Use Cases in Rural Regions</h4>
        <ul>
          <li>Healthcare: Patient records, lab results</li>
          <li>Agriculture: Market prices, weather alerts</li>
          <li>Education: Offline content sync</li>
          <li>Emergency: Alerts via intermittent links</li>
        </ul>
      </div>
    </div>
  );
}
