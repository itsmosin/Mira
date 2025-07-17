# MIRA Backend - Vercel Deployment

This backend integrates Circle Developer-Controlled Wallets, Self.xyz identity verification, and The Graph Protocol for the MIRA platform.

## Environment Variables

Set these environment variables in your Vercel dashboard:

```
CIRCLE_API_KEY=your_circle_api_key_here
ENTITY_SECRET=your_entity_secret_here
NODE_ENV=production
```

## Deployment Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from the backend directory
```bash
cd backend
vercel --prod
```

### 4. Set Environment Variables
In your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the required variables listed above

### 5. Update Frontend
After deployment, update your frontend to use the new Vercel URL instead of localhost.

## API Endpoints

- `POST /api/self-verify` - Self.xyz verification webhook
- `POST /api/wallet/create` - Create new Circle wallet
- `GET /api/wallet/balance/:walletId` - Get wallet balance
- `GET /api/wallet/transactions/:walletId` - Get transaction history
- `GET /api/graph/reputation/:walletAddress` - Get user reputation
- `GET /api/graph/aid-disbursements/:walletAddress` - Get aid history
- `GET /api/graph/transactions/:walletAddress` - Get Graph transactions
- `GET /api/graph/stats` - Get global platform stats
- `GET /api/graph/leaderboard` - Get reputation leaderboard
- `GET /api/graph/health` - Graph service health check

## Features

- **Circle Integration**: Gasless USDC transactions on Polygon Amoy
- **Self.xyz Verification**: Zero-knowledge identity proofs
- **Graph Protocol**: Decentralized reputation tracking
- **CORS Enabled**: Ready for frontend integration
- **Serverless**: Optimized for Vercel's serverless functions

## Local Development

```bash
npm install
npm run dev
```

The server will start on `http://localhost:3001`. 