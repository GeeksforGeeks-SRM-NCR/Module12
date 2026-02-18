# Rural DTN Module — Project Documentation

## Technologies Used

| Category | Technology | Purpose |
|----------|------------|---------|
| **Language** | Rust | Core logic, performance, WebAssembly compilation |
| **WebAssembly** | wasm-pack, WASM | Compile Rust to WASM for browser execution |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | Interactive demo (no framework required) |
| **React** | JSX, React Hooks | Optional integration components |
| **Build** | npm, Cargo | Package and build management |
| **Serialization** | Serde, serde_json | JSON serialization for bundles |
| **Identifiers** | UUID v4 | Unique bundle IDs |
| **Browser APIs** | Web Console, DOM | Logging and UI updates |

### Technology Details

- **Rust (edition 2021)** — Systems language for the DTN core; provides memory safety and cross-compilation to WASM.
- **wasm-bindgen** — Bindings between Rust and JavaScript for WASM modules.
- **js-sys / web-sys** — Rust bindings to JavaScript and browser APIs (used in WASM build).
- **Serde** — Serialization framework for `DtnBundle` and JSON export.
- **wasm-pack** — Build tool for compiling Rust to WebAssembly and generating JS bindings.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / Web App                         │
├─────────────────────────────────────────────────────────────────┤
│  demo.html (Vanilla JS)     │  integration-example.jsx (React)   │
│  - Store-and-forward UI     │  - DtnMessageComposer              │
│  - Link status simulation   │  - DtnBundleCard, LinkStatusBadge  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    pkg/rural_dtn_module.js (WASM)                │
│  - DtnBundle::new()         - simulate_rural_link_status()       │
│  - DtnBundle::new_with_seed - create_rural_message()             │
│  - bundle_to_json()         - LinkStatus enum                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      src/lib.rs (Rust)                           │
│  - DtnBundle struct         - DtnNode (store/forward)            │
│  - LinkStatus enum          - Deterministic PRNG for simulation  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

| Path | Description |
|------|-------------|
| `src/lib.rs` | Rust library: `DtnBundle`, `DtnNode`, `LinkStatus`, link simulation, JSON helpers |
| `Cargo.toml` | Rust package metadata and dependencies |
| `demo.html` | Standalone web demo (runs without WASM build) |
| `integration-example.jsx` | React components for DTN integration |
| `package.json` | npm scripts and metadata |
| `build.sh` | Shell script for WASM build |
| `README.md` | Quick start and overview |
| `DOCUMENTATION.md` | Full project documentation (this file) |

---

## API Reference

### DtnBundle

Represents a single message (bundle) in the DTN network.

| Method | Signature | Description |
|--------|-----------|-------------|
| `new` | `(source, destination, payload)` | Create bundle with unique ID and timestamp |
| `new_with_seed` | `(source, destination, payload, seed)` | Create deterministic bundle for testing |
| `id` | getter | Unique bundle identifier |
| `source` | getter | Source endpoint ID |
| `destination` | getter | Destination endpoint ID |
| `payload` | getter | Message content |
| `created_at` | getter | Creation timestamp (ms) |
| `hop_count` | getter | Number of relays traversed |
| `to_display_string` | `()` | Human-readable string for logging |

### Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `simulate_rural_link_status` | `(time_ms: i64, seed: u32) -> u8` | Returns 0 (down), 1 (intermittent), or 2 (up) |
| `create_rural_message` | `(from, to, type, content) -> String` | Creates bundle and returns JSON |
| `bundle_to_json` | `(bundle) -> String` | Serialize bundle to JSON |

### LinkStatus (enum)

| Variant | Value | Description |
|---------|-------|-------------|
| `Down` | 0 | No connectivity |
| `Intermittent` | 1 | Opportunistic link available |
| `Up` | 2 | Stable connection |

---

## Data Model

### Bundle (JSON)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "source": "village_a",
  "destination": "village_b",
  "payload": "Market price: rice 45/kg",
  "created_at": 1708167440000,
  "hop_count": 0
}
```

### Link Status Simulation

The `simulate_rural_link_status(time_ms, seed)` function models rural connectivity:
- **Down (65%)** — No path
- **Intermittent (25%)** — Short opportunistic window
- **Up (10%)** — Stable link (e.g., relay in range)

---

## Usage Guide

### 1. Run the Demo (No Build)

```bash
# Option A: Open directly in browser
# Open demo.html

# Option B: Serve locally
npx serve -p 3000
# Visit http://localhost:3000/demo.html
```

### 2. Build the WASM Module

```bash
# Prerequisites: Rust (rustup.rs), wasm-pack (cargo install wasm-pack)
npm run build
```

Output: `pkg/rural_dtn_module.js`, `pkg/rural_dtn_module_bg.wasm`

### 3. Use in a Web Page

```html
<script type="module">
  import init, { DtnBundle, simulate_rural_link_status } from './pkg/rural_dtn_module.js';
  await init();
  const bundle = new DtnBundle('village_a', 'village_b', 'Hello');
  console.log(bundle.to_display_string());
</script>
```

### 4. Use React Components

```jsx
import { DtnMessageComposer, DtnBundleCard, RuralDtnDashboard } from './integration-example';

// Full dashboard
<RuralDtnDashboard />

// Or individual components
<DtnMessageComposer onSend={(b) => console.log(b)} />
```

---

## Use Cases in Rural Regions

| Domain | Scenario | DTN Role |
|--------|----------|----------|
| **Healthcare** | Lab results from district hospital to village clinic | Store at relay; forward when bus/health worker visits |
| **Agriculture** | Market prices to remote farmers | Collect at market; relay via data mule to villages |
| **Education** | Offline content sync to school tablets | Sync when WiFi hotspot or USB relay arrives |
| **Emergency** | Disaster alerts to disconnected areas | Propagate through intermittent links |

---

## License

MIT
