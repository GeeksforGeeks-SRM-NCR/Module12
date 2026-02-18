#!/bin/bash

# Build script for Rural DTN Module (Delay-Tolerant Networking)
# Compiles Rust code to WebAssembly for browser use

set -e

echo "📡 Building Rural DTN Module (Rust → WASM)"
echo "=========================================="

# Check if wasm-pack is installed
if ! command -v wasm-pack &> /dev/null; then
    echo "❌ wasm-pack is not installed!"
    echo "📦 Install with: cargo install wasm-pack"
    echo "   Or: curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh"
    exit 1
fi

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust is not installed!"
    echo "   Install from: https://rustup.rs/"
    exit 1
fi

echo "✅ Dependencies found"
echo ""

# Build for web target
echo "🔨 Building for web target..."
wasm-pack build --target web --out-dir pkg

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📦 Output directory: pkg/"
    echo ""
    echo "To run the demo:"
    echo "  npm run serve"
    echo "  Then open http://localhost:3000/demo.html"
    echo ""
    echo "To use in a web app:"
    echo "  import init, { DtnBundle } from './pkg/rural_dtn_module.js';"
else
    echo "❌ Build failed!"
    exit 1
fi

# Run tests
echo ""
echo "🧪 Running tests..."
cargo test

echo ""
echo "✨ All done!"
