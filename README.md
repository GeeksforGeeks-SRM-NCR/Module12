# Rural DTN Module (Delay-Tolerant Networking)

A **Delay-Tolerant Networking (DTN)** module designed for **rural region connectivity**. It implements **store-and-forward** messaging so that data can be delivered even when network links are intermittent, delayed, or absent.

## Why DTN for Rural Regions?

Rural areas often face:

- **Intermittent connectivity** — Power cuts, weak signal, limited infrastructure
- **Long propagation delays** — Satellite or high-latency backhauls
- **Opportunistic links** — Bus with WiFi, mobile data collector, drone relay
- **No end-to-end path** — Source and destination never online at the same time

**Traditional TCP/IP** requires a continuous connection. If the link drops, the message is lost.  
**DTN** stores messages locally when links are down and forwards them when connectivity becomes available. No data loss; delivery is eventual.

## Technologies Used

| Category | Technology |
|----------|------------|
| **Core** | Rust (edition 2021), WebAssembly |
| **Build** | wasm-pack, Cargo, npm |
| **Frontend** | HTML5, CSS3, JavaScript, React (optional) |
| **Serialization** | Serde, serde_json |
| **Identifiers** | UUID v4 |

See [DOCUMENTATION.md](DOCUMENTATION.md) for full documentation.

---

## Project Structure

| File | Description |
|------|-------------|
| `src/lib.rs` | Rust/WASM core — DTN bundles, link status simulation, node logic |
| `demo.html` | Interactive web demo — store-and-forward simulation |
| `integration-example.jsx` | React components for integrating DTN into apps |

## Rust/WASM API

### Bundle Creation

```rust
// Create a new DTN bundle (message)
let bundle = DtnBundle::new("village_a", "village_b", "Market price: rice 45/kg");

// Deterministic bundle (for testing)
let bundle = DtnBundle::new_with_seed("village_a", "health_center", "Lab result ready", 12345);
```

### Rural Link Simulation

```rust
// Simulate connectivity: 0=down, 1=intermittent, 2=up
let status = simulate_rural_link_status(time_ms, seed);
```

### Bundle Format

- `id` — Unique bundle identifier
- `source` / `destination` — Endpoint IDs (e.g., village names)
- `payload` — Message content
- `created_at` — Timestamp (ms)
- `hop_count` — Number of relays traversed

## Web Demo

1. Build: `npm run build` (requires `wasm-pack` and Rust)
2. Serve: `npx serve -p 3000` or open `demo.html` directly in a browser
3. Use the demo:
   - **Send Message** — Store a message at Village A
   - **Simulate Time Step** — Change link connectivity (DOWN/INTERMITTENT/UP)
   - **Forward Stored Bundles** — Move messages when links are up

The demo runs entirely in the browser (no WASM required for the HTML demo; JS simulates DTN behavior).

## Use Cases in Rural Regions

| Domain | Example |
|--------|---------|
| **Healthcare** | Patient records, lab results, telemedicine requests |
| **Agriculture** | Market prices, weather alerts, advisory messages |
| **Education** | Offline learning content synced when relay visits |
| **Emergency** | Alerts propagated through intermittent links |

## Integration Example (React)

```jsx
import { DtnMessageComposer, DtnBundleCard } from './integration-example';

function App() {
  const [bundles, setBundles] = useState([]);
  return (
    <>
      <DtnMessageComposer onSend={(b) => setBundles(prev => [...prev, b])} />
      {bundles.map(b => <DtnBundleCard key={b.id} bundle={b} />)}
    </>
  );
}
```

## Building the WASM Module

```bash
# Install Rust: https://rustup.rs
# Install wasm-pack: cargo install wasm-pack

npm run build
# Output: pkg/rural_dtn_module.js, rural_dtn_module_bg.wasm
```

## Documentation

Full project documentation (architecture, API reference, usage guide): **[DOCUMENTATION.md](DOCUMENTATION.md)**

## License

MIT
