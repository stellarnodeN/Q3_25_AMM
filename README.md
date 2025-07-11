# 🍕🍔 Automated Market Maker (AMM)

A decentralized exchange built on Solana that allows users to trade tokens automatically using smart contracts. This AMM implements the constant product formula (`x × y = k`) to provide automated liquidity and enable permissionless token trading without traditional order books.

## What is an AMM?

Think of an AMM like a **vending machine for tokens**! Instead of needing someone else to trade with you, the machine automatically sets prices and handles trades. The AMM uses mathematical formulas to determine prices based on the available liquidity in the pool.

### 🍕🍔 Real-World Example: Burger & Pizza Exchange

Imagine you're running a food exchange where people can trade burgers for pizzas:

```
🍔 Burger Pool: 100 burgers
🍕 Pizza Pool: 50 pizzas
```

**The Rule:** `Burgers × Pizzas = Constant` (e.g., 100 × 50 = 5,000)

- If someone wants to trade 10 burgers for pizzas:
  - New burger pool: 110 burgers
  - New pizza pool: 45.45 pizzas (5,000 ÷ 110)
  - They receive: 4.55 pizzas

**Why this works:** The more burgers in the pool, the less each burger is worth in pizza terms!

## 🏗️ How It Works

### 1. **Initialize Pool** 
Create a new trading pair (e.g., USDC ↔ SOL)

```rust
// Create pool with 1000 USDC and 10 SOL
initialize(seed, fee, authority)
```

**Visual Flow:**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   🚀 Create     │ -> │   🏗️ Setup      │ -> │   ✅ Pool       │
│   New Pool      │    │   Accounts      │    │   Ready         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
   ┌─────────┐           ┌─────────┐           ┌─────────┐
   │ Config  │           │ Vaults  │           │ LP Mint │
   │ Account │           │ Created │           │ Created │
   └─────────┘           └─────────┘           └─────────┘
```

### 2. **Add Liquidity**
Users deposit both tokens to earn trading fees

```rust
// Alice deposits 100 USDC + 1 SOL
deposit(amount, max_x, max_y)
```

**Visual Flow:**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   💰 User       │ -> │   🔄 Transfer   │ -> │   🎫 Receive    │
│   Deposits      │    │   Tokens to     │    │   LP Tokens     │
│   Both Tokens   │    │   Pool Vaults   │    │   (Shares)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
   ┌─────────┐           ┌─────────┐           ┌─────────┐
   │ USDC    │           │ Vault X │           │ LP      │
   │ + SOL   │           │ + Vault │           │ Tokens  │
   │ Balance  │           │ Y Filled│           │ Minted  │
   └─────────┘           └─────────┘           └─────────┘
```

### 3. **Swap Tokens**
Trade one token for another automatically

```rust
// Bob swaps 50 USDC for SOL
swap(is_x, amount_in, min_amount_out)
```

**Visual Flow:**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   🔄 User       │ -> │   🧮 Calculate  │ -> │   💸 Execute    │
│   Wants to      │    │   Output Amount │    │   Token Swap    │
│   Swap Tokens   │    │   (with fees)   │    │   & Pay Fees    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
   ┌─────────┐           ┌─────────┐           ┌─────────┐
   │ Input   │           │ Price   │           │ Output  │
   │ Token   │           │ Impact  │           │ Token   │
   │ Amount  │           │ + Fees  │           │ Received│
   └─────────┘           └─────────┘           └─────────┘
```

### 4. **Remove Liquidity**
Withdraw your tokens and earned fees

```rust
// Alice removes her liquidity
withdraw(amount, min_x, min_y)
```

**Visual Flow:**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   🔥 Burn       │ -> │   💰 Calculate  │ -> │   📤 Transfer   │
│   LP Tokens     │    │   Token Amounts │    │   Tokens Back   │
│   (Shares)      │    │   + Earned Fees │    │   to User       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
   ┌─────────┐           ┌─────────┐           ┌─────────┐
   │ LP      │           │ Original│           │ USDC    │
   │ Tokens  │           │ Tokens  │           │ + SOL   │
   │ Burned  │           │ + Fees  │           │ + Fees  │
   └─────────┘           └─────────┘           └─────────┘
```

## 📊 Visual Explanation

```
Initial Pool State:
┌─────────────────┐
│   🍔 100 USDC   │
│   🍕 10 SOL     │
│   💰 0.3% Fee   │
└─────────────────┘

After Alice Adds Liquidity:
┌─────────────────┐
│   🍔 1100 USDC  │
│   🍕 11 SOL     │
│   🎫 LP Tokens  │
└─────────────────┘

After Bob Swaps:
┌─────────────────┐
│   🍔 1150 USDC  │
│   🍕 9.57 SOL   │
│   💰 +0.3% Fee  │
└─────────────────┘
```

## 🔄 Complete Trading Cycle

```
┌─────────────────────────────────────────────────────────────┐
│                    AMM Trading Cycle                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🚀 Initialize Pool                                        │
│       │                                                    │
│       ▼                                                    │
│  💰 Add Liquidity (Alice)                                  │
│       │                                                    │
│       ▼                                                    │
│  🔄 Swap Tokens (Bob)                                      │
│       │                                                    │
│       ▼                                                    │
│  🔄 Swap Tokens (Charlie)                                  │
│       │                                                    │
│       ▼                                                    │
│  💰 Add Liquidity (David)                                  │
│       │                                                    │
│       ▼                                                    │
│  🔥 Remove Liquidity (Alice)                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Rust](https://rustup.rs/)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor](https://book.anchor-lang.com/getting_started/installation.html)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Q3_25_amm

# Install dependencies
cd amm
yarn install

# Build the program
anchor build

# Run tests
anchor test
```

### Start Local Validator

```bash
# Start Solana test validator
solana-test-validator

# In another terminal, run tests
anchor test
```

## 📁 Project Structure

```
amm/
├── programs/amm/src/
│   ├── lib.rs              # Main program entry point
│   ├── state/
│   │   └── config.rs       # Pool configuration
│   └── instructions/
│       ├── initialize.rs    # Create new pool
│       ├── deposit.rs       # Add liquidity
│       ├── swap.rs          # Trade tokens
│       └── withdraw.rs      # Remove liquidity
├── tests/
│   └── amm.ts              # Test suite
└── target/                 # Generated files
```

## 🔧 Key Features

- **Constant Product Formula**: `x × y = k` pricing model
- **Automated Pricing**: No order books needed
- **Liquidity Mining**: Earn fees by providing liquidity
- **Slippage Protection**: Set minimum output amounts
- **Pool Locking**: Emergency stop functionality

## 🧪 Testing

```bash
# Run all tests
anchor test

# Run specific test
anchor test -- --grep "initialize"
```

## 📚 Core Concepts

### Constant Product Formula
```
x × y = k
```
Where:
- `x` = Amount of token X
- `y` = Amount of token Y  
- `k` = Constant (changes only with fees)

### Slippage
The price impact of your trade. Larger trades = higher slippage.

### Impermanent Loss
When the price ratio of your tokens changes after providing liquidity.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Anchor](https://book.anchor-lang.com/)
- Inspired by [Uniswap](https://uniswap.org/)
- Constant product curve implementation from [constant-product-curve](https://crates.io/crates/constant-product-curve)

---

