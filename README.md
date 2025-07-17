# MIRA: Financial Rebirth for Women in Crisis

[![MIRA Banner](https://i.imgur.com/your-banner-image.png)](https://mira-finance.xyz)

**MIRA** is a Web3 platform designed to provide a "financial rebirth" for women in crisis, such as refugees, by giving them private, secure, and direct access to financial aid and growth opportunities. It leverages cutting-edge blockchain technology to build a new foundation of trust and reputation, empowering users to regain control over their financial lives without compromising their privacy.

This project was built for the hackathon.

---

## 💡 The Vision: Privacy, Dignity, and Opportunity

Women in crisis situations often lose everything: their homes, their documentation, and their financial identities. Traditional aid systems can be slow, bureaucratic, and often fail to preserve the dignity and privacy of recipients.

MIRA was born from a simple yet powerful idea: **What if we could use the core principles of Web3—privacy, self-sovereignty, and transparency—to build a better system?**

Our goal is to create a sanctuary where a woman can:
- **Prove her identity without revealing it.**
- **Receive funds directly and instantly, without intermediaries.**
- **Build a new, verifiable reputation based on her actions, not her past.**
- **Access opportunities for growth, from therapy to skills training.**

MIRA is not just a wallet; it's a platform for a new beginning.

---

## ✨ Core Features

- **Private & Secure Identity Verification:** Users verify their identity (e.g., age > 18, non-sanctioned region) using zero-knowledge proofs, ensuring personal data never leaves their device.
- **Instant Gasless Wallets:** A secure, MPC-powered smart contract wallet is automatically created for every verified user, ready to receive USDC with no crypto complexity or gas fees.
- **Verifiable On-Chain Reputation:** Every positive financial action, like receiving aid or completing a program, builds a public, on-chain reputation score, unlocking new opportunities.
- **Direct Aid & Growth Programs:** NGOs, DAOs, and individuals can send funds directly to user wallets. Users can access a curated ecosystem of support programs for healing, learning, and finding safety.

---

## 🛠️ Technology Deep-Dive: The "How"

MIRA is built on a powerful, privacy-preserving Web3 stack. Each technology was chosen specifically to solve a core challenge in creating a system that is both user-friendly and philosophically aligned with our mission.

### 1. **Self.xyz: For Self-Sovereign Identity (SSI)**

**Why Self.xyz?**
Identity is the first hurdle. Traditional systems require uploading sensitive documents to a central database, creating a honeypot for data breaches. We needed a way for users to prove facts about themselves (like being over 18) without handing over their passport data.

**How it's integrated:**
MIRA uses Self.xyz's SDK to implement a **Zero-Knowledge Proof (ZKP)** based verification flow.
1.  **QR Code Generation:** The frontend generates a unique QR code for a "scope-based authentication" request, asking for proof of age and region.
2.  **Mobile Verification:** The user scans the QR code with the Self mobile app. The app communicates directly with the document chip in their passport to verify the claims *on-device*.
3.  **ZK Proof Submission:** The Self app generates a cryptographic proof (a "black box" that confirms the facts are true without revealing the underlying data) and sends it to our backend.
4.  **Backend Verification:** Our Node.js backend uses the `SelfBackendVerifier` to validate the proof. It confirms the user is over 18 and not from a sanctioned country, all without ever seeing the user's name, date of birth, or passport number.

This flow ensures MIRA remains a privacy-preserving sanctuary, building trust from the very first interaction.

### 2. **Circle: For Developer-Controlled Wallets (DCW)**

**Why Circle?**
The goal is to provide financial access, not a crypto lesson. Users in crisis cannot be expected to manage seed phrases, pay for gas, or understand blockchain explorers. We needed to abstract away all the complexity of crypto.

**How it's integrated:**
MIRA leverages Circle's Developer-Controlled Wallets SDK to create and manage wallets on behalf of our users.
1.  **Automated Wallet Creation:** Upon successful identity verification, our backend makes an API call to Circle to instantly provision a new **Multi-Party Computation (MPC)** wallet for the user. MPC technology eliminates the single point of failure of a private key, providing institutional-grade security.
2.  **Gasless Transactions:** The wallets are smart contract accounts on the **Polygon Amoy** testnet. This, combined with Circle's infrastructure, allows us to sponsor all transaction fees. Users can send and receive USDC without needing MATIC or any other native token.
3.  **USDC Stablecoin:** We chose USDC as the primary currency for its stability, trust, and 1:1 backing with the US Dollar, ensuring the value of aid received is predictable and reliable.

This makes the user experience feel like a simple, modern fintech app, while still being powered by the security and transparency of the blockchain.

### 3. **The Graph: For On-Chain Reputation**

**Why The Graph?**
How does a user build a new reputation from scratch? Through their actions. We needed a way to efficiently track and interpret on-chain activity to create a meaningful reputation score. Making direct calls to the blockchain for this data is slow, expensive, and complex.

**How it's integrated:**
MIRA uses The Graph to index and serve all reputation-related data.
1.  **Subgraph Definition:** We created a "subgraph" that watches the USDC token contract on the Polygon Amoy network.
2.  **Indexing Transfers:** The subgraph listens for `Transfer` events specifically directed to MIRA user wallets.
3.  **Data Transformation:** When a transfer is indexed, our mapping logic (written in AssemblyScript) transforms this raw data into a structured schema. It creates `User`, `Transaction`, and `AidDisbursement` entities.
4.  **Reputation Logic:** The mapping calculates a `reputationScore` based on factors like the frequency and size of incoming transfers (aid).
5.  **GraphQL API:** The Graph serves this structured data through a simple GraphQL API. Our backend and frontend can then query for a user's reputation, transaction history, and aid history with a single, fast API call.

This creates a transparent, verifiable, and decentralized reputation system. A user can prove her reliability and engagement to future partners or aid organizations, unlocking a new world of opportunity.

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph User Device
        A[Frontend - React] --> B{Self.xyz QR Code};
    end

    subgraph MIRA Backend (Node.js/Express)
        C[API Server]
        D[SelfBackendVerifier]
        E[Circle SDK]
        F[The Graph Service]
    end

    subgraph External Services
        G[Self.xyz Relay]
        H[Circle API]
        I[The Graph - Subgraph API]
    end

    A -- Scans QR with --> J[Self Mobile App];
    J -- Sends ZK Proof --> G;
    G -- Forwards Proof --> C;
    C -- Verifies with --> D;
    D -- Confirms --> C;
    C -- Creates Wallet via --> E;
    E -- Calls --> H;
    A -- Fetches Wallet/Reputation Data --> C;
    C -- Queries --> F;
    F -- Gets Data from --> I;
```

---

## 🚀 Getting Started (Developer Setup)

Follow these instructions to set up and run the MIRA platform locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- `npm` (comes with Node.js)
- `git`

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Mira-ETHGlobalCannes.git
cd Mira-ETHGlobalCannes
```

### 2. Set Up the Backend

The backend handles identity verification and wallet creation.

```bash
cd backend
npm install
```

**Create an environment file:**

Create a `.env` file in the `backend` directory and add your secrets.

```env
# Your API Key from the Circle Developer Console
CIRCLE_API_KEY="YOUR_CIRCLE_API_KEY"

# Your 32-byte hex-encoded entity secret (use generate-entity-secret.js if needed)
ENTITY_SECRET="YOUR_ENTITY_SECRET"
```

**Register your Entity Secret:**

You must run this script once to register your secret with Circle's servers.

```bash
node register-entity-secret.mjs
```

### 3. Set Up the Frontend

The frontend is a React application that provides the user interface.

```bash
cd ../frontend
npm install
```

### 4. Run the Application

You will need two separate terminal windows.

**In Terminal 1 (from the `backend` directory):**

```bash
npm start
```

**In Terminal 2 (from the `frontend` directory):**

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

> **Note:** The Self.xyz verification requires a public-facing URL for the backend. We use `ngrok` during development to expose our local server. The URL is hard-coded in `backend/index.js` for the hackathon prototype.

---

## 🌟 Future Vision

MIRA is just beginning its journey. Our roadmap includes:
- **Expanding the Partner Ecosystem:** Onboarding more NGOs and DAOs to provide a wider range of aid and programs.
- **Enhanced Reputation System:** Incorporating more off-chain and on-chain data points into the reputation score.
- **Decentralized Governance:** Allowing the MIRA community to have a say in the platform's future.
- **Cross-Chain Support:** Expanding to other low-cost blockchains to increase accessibility.

We believe MIRA can set a new standard for how technology can be used to serve humanity's most vulnerable, with dignity and privacy at its core.    