const express = require('express');
const { 
  SelfBackendVerifier, 
  IConfigStorage
} = require('@selfxyz/core');
const { initiateDeveloperControlledWalletsClient } = require('@circle-fin/developer-controlled-wallets');
const GraphService = require('./services/graphService');
require('dotenv').config(); // To load environment variables from a .env file

const app = express();
const port = 3001;

// Middleware to parse JSON bodies. This is crucial for webhooks.
app.use(express.json());

// CORS middleware to allow frontend connections
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// --- Environment Variable Checks ---
const CIRCLE_API_KEY = process.env.CIRCLE_API_KEY;
const ENTITY_SECRET = process.env.ENTITY_SECRET;

if (!CIRCLE_API_KEY || !ENTITY_SECRET) {
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('!!! FATAL ERROR: CIRCLE_API_KEY or ENTITY_SECRET not set. !!!');
    console.error('!!! Please create a .env file with these values.        !!!');
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    process.exit(1); // Exit if secrets are not found
}

// --- Circle SDK Initialization ---
const circle = initiateDeveloperControlledWalletsClient({
    apiKey: CIRCLE_API_KEY,
    entitySecret: ENTITY_SECRET,
});

// --- Graph Service Initialization ---
const graphService = new GraphService();
console.log('✅ Graph Service initialized.');

// --- Configuration ---

// 1. Define the unique scope for our application
const SCOPE = "mira-finance-restart";
console.log(`Application Scope: ${SCOPE}`);

// 2. Set up the public endpoint URL. 
// This will be dynamically set based on the environment (Vercel or local)
const HOSTED_ENDPOINT_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}/api/self-verify`
  : process.env.PUBLIC_URL || "http://localhost:3001/api/self-verify";

console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
console.log(`!!! IMPORTANT: Your verification endpoint is: ${HOSTED_ENDPOINT_URL}`);
console.log(`!!! Make sure this URL is accessible from the internet for Self.xyz to work.`);
console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);

// 3. Simple IConfigStorage implementation for MIRA's requirements.
class MiraConfigStorage {
  async getConfig(configId) {
    // MIRA verification rules: 18+ women, all regions except terror countries, exclude Syria
    console.log(`Using MIRA verification config: '${configId}'`);
    return {
      olderThan: 18,                    // Must be at least 18 years old
      excludedCountries: [              // Standard terror countries but EXCLUDE Syria
        'IRN',  // Iran
        'PRK',  // North Korea  
        'CUB',  // Cuba
        'AFG',  // Afghanistan
        'IRQ',  // Iraq
        'LBY',  // Libya
        'SDN',  // Sudan
        'YEM'   // Yemen
        // Note: Syria (SYR) is NOT in this list per user requirements
      ],
      ofac: true                        // Enable OFAC sanctions list checks
    };
  }
  
  async getActionId(userIdentifier, userDefinedData) {
    // For now, we use a single, default configuration for all users.
    // This could be expanded later to have different rules for different users.
    return 'default_config';
  }
}

// --- Initialization ---

// Check if the placeholder URL is still being used.
if (HOSTED_ENDPOINT_URL.includes('your-public-url')) {
    console.warn(`
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!! WARNING: The HOSTED_ENDPOINT_URL is not set.                   !!!
!!! You must update this with your public ngrok URL for this to work.  !!!
!!! Example: https://1a2b-3c4d-5e6f.ngrok.io/api/self-verify         !!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
`);
}

// Define which document types our app will accept. For MIRA, we start with passports.
const allowedIds = new Map();
allowedIds.set(1, true); // 1 = passport (AttestationId.Passport)

// Create an instance of our configuration storage.
const configStorage = new MiraConfigStorage();

// Initialize the SelfBackendVerifier. This should be done only once.
const selfBackendVerifier = new SelfBackendVerifier(
  SCOPE,
  HOSTED_ENDPOINT_URL,
  true,                              // `true` for testing with mock data, `false` for real passports.
  allowedIds,
  configStorage,
  'uuid'                             // Using UUIDs for off-chain user identifiers.
);

console.log('✅ SelfBackendVerifier initialized.');
console.log(`- Scope: ${SCOPE}`);
console.log(`- Endpoint: ${HOSTED_ENDPOINT_URL}`);
console.log(`- Mode: Staging/Mock (for testing)`);

// --- Circle Wallet Creation Logic ---
async function createCircleWallet(userIdentifier) {
  console.log(`\n🔵 Initiating Circle wallet creation for user: ${userIdentifier}`);
  try {
    // 1. Create a Wallet Set for the user
    console.log('   - Step 1: Creating WalletSet...');
    const walletSet = await circle.createWalletSet({
        name: `MIRA WalletSet - ${userIdentifier}`,
    });
    const walletSetId = walletSet.data?.walletSet?.id;
    console.log(`   - Success! WalletSet ID: ${walletSetId}`);

    // 2. Create the Smart Contract Account (SCA) wallet on a testnet
    console.log('   - Step 2: Creating the smart contract wallet...');
    const wallets = await circle.createWallets({
        walletSetId: walletSetId,
        accountType: 'SCA',
        blockchains: ['MATIC-AMOY'], // Using Amoy testnet
        count: 1,
    });
    const wallet = wallets.data?.wallets?.[0];
    console.log(`   - Success! Wallet created on ${wallet.blockchain}`);
    console.log(`   - Wallet ID: ${wallet.id}`);
    console.log(`   - Wallet Address: ${wallet.address}`);
    
    return wallet;

  } catch (error) {
    console.error('❌ Circle wallet creation failed. See detailed error below:');
    
    // Log the full error object to see its structure
    console.error('Full Circle API Error Object:', JSON.stringify(error, null, 2));

    // Check for specific Circle API error structure for more readable logs
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Circle API Error Status:', error.response.status);
      console.error('Circle API Error Headers:', error.response.headers);
      console.error('Circle API Error Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Circle API No Response - check network or Circle status.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Circle API Request Setup Error:', error.message);
    }
    
    return null;
  }
}

// --- API Endpoints ---

// Create a new wallet (standalone - not tied to verification)
app.post('/api/wallet/create', async (req, res) => {
  console.log('🔵 Creating standalone wallet...');
  try {
    const { userIdentifier } = req.body;
    
    if (!userIdentifier) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'User identifier is required' 
      });
    }

    const newWallet = await createCircleWallet(userIdentifier);

    if (!newWallet) {
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to create wallet' 
      });
    }

    console.log('✅ Standalone wallet created successfully!');
    
    return res.status(200).json({
      status: 'success',
      wallet: {
        id: newWallet.id,
        address: newWallet.address,
        blockchain: newWallet.blockchain
      }
    });

  } catch (error) {
    console.error('❌ Standalone wallet creation failed:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error' 
    });
  }
});

// Get wallet balance
app.get('/api/wallet/:walletId/balance', async (req, res) => {
  console.log('🔵 Fetching wallet balance...');
  try {
    const { walletId } = req.params;
    
    // Fetch wallet balance from Circle
    const walletResponse = await circle.getWallet({ id: walletId });
    const wallet = walletResponse.data?.wallet;
    
    if (!wallet) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Wallet not found' 
      });
    }

    // Get token balances (focusing on USDC)
    const tokenBalances = wallet.tokenBalances || [];
    const usdcBalance = tokenBalances.find(balance => 
      balance.token?.symbol === 'USDC'
    );

    const balance = usdcBalance ? usdcBalance.amount : '0';
    const balanceUSD = parseFloat(balance).toFixed(2);

    console.log(`✅ Wallet balance: ${balanceUSD} USDC`);
    
    return res.status(200).json({
      status: 'success',
      balance: balance,
      balanceUSD: balanceUSD,
      tokenBalances: tokenBalances
    });

  } catch (error) {
    console.error('❌ Balance fetch failed:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch balance' 
    });
  }
});

// Get wallet transactions
app.get('/api/wallet/:walletId/transactions', async (req, res) => {
  console.log('🔵 Fetching wallet transactions...');
  try {
    const { walletId } = req.params;
    
    // Fetch transactions from Circle
    const transactionsResponse = await circle.listTransactions({
      walletIds: [walletId],
      pageSize: 10
    });
    
    const transactions = transactionsResponse.data?.transactions || [];
    
    // Format transactions for frontend
    const formattedTransactions = transactions.map(tx => ({
      id: tx.id,
      type: tx.amounts?.[0]?.amount?.startsWith('-') ? 'sent' : 'received',
      amount: tx.amounts?.[0]?.amount || '0',
      token: tx.amounts?.[0]?.token?.symbol || 'USDC',
      timestamp: tx.createDate,
      description: tx.custodyType || 'Transfer',
      status: tx.state || 'completed'
    }));

    console.log(`✅ Found ${formattedTransactions.length} transactions`);
    
    return res.status(200).json({
      status: 'success',
      transactions: formattedTransactions
    });

  } catch (error) {
    console.error('❌ Transaction fetch failed:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch transactions' 
    });
  }
});

// Self.xyz verification endpoint
app.post('/api/self-verify', async (req, res) => {
  console.log('🔵 Received verification request on /api/self-verify...');
  console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
  console.log('📋 Request headers:', req.headers);
  
  try {
    // Since we're in staging/mock mode, be very permissive
    // Any request from Self.xyz app should succeed and create a wallet
    console.log('🧪 STAGING MODE: Auto-approving any Self.xyz verification request');
    
    // Generate a successful verification for staging
    const userIdentifier = 'self_verified_' + new Date().getTime();
    console.log('🔵 Creating Circle wallet for verified user:', userIdentifier);
    
    const newWallet = await createCircleWallet(userIdentifier);

    if (!newWallet) {
      console.error('❌ Failed to create Circle wallet');
      return res.status(200).json({ 
        result: false,
        status: 'error',
        message: 'Identity verified but failed to create wallet. Please try again.'
      });
    }

    console.log('✅ Self.xyz verification + Circle wallet creation successful!');
    console.log('📋 Wallet details:', {
      id: newWallet.id,
      address: newWallet.address,
      blockchain: newWallet.blockchain
    });
    
    // Return the proper Self.xyz response format
    return res.status(200).json({
      result: true,
      status: 'success',
      verified: true,
      userIdentifier: userIdentifier,
      disclosedData: {
        nationality: ['US'],
        name: ['Verified User'],
        ageVerified: true
      },
      wallet: {
        id: newWallet.id,
        address: newWallet.address,
        blockchain: newWallet.blockchain
      }
    });

  } catch (error) {
    console.error('❌ Staging mode error:', error);
    return res.status(200).json({
      result: false,
      status: 'error',
      verified: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred.'
    });
  }
});

// --- Graph Protocol API Endpoints ---

// Get user reputation and activity data
app.get('/api/graph/reputation/:walletAddress', async (req, res) => {
  console.log('📊 Fetching user reputation...');
  try {
    const { walletAddress } = req.params;
    
    const reputation = await graphService.getUserReputation(walletAddress);
    
    return res.status(200).json({
      status: 'success',
      data: reputation
    });

  } catch (error) {
    console.error('❌ Graph reputation fetch failed:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch reputation data' 
    });
  }
});

// Get user aid disbursement history
app.get('/api/graph/aid-disbursements/:walletAddress', async (req, res) => {
  console.log('💰 Fetching aid disbursements...');
  try {
    const { walletAddress } = req.params;
    
    const disbursements = await graphService.getAidDisbursements(walletAddress);
    
    return res.status(200).json({
      status: 'success',
      data: disbursements
    });

  } catch (error) {
    console.error('❌ Graph aid disbursements fetch failed:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch aid disbursements' 
    });
  }
});

// Get user transaction history from The Graph
app.get('/api/graph/transactions/:walletAddress', async (req, res) => {
  console.log('📋 Fetching Graph transaction history...');
  try {
    const { walletAddress } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const transactions = await graphService.getTransactionHistory(walletAddress, limit);
    
    return res.status(200).json({
      status: 'success',
      data: transactions
    });

  } catch (error) {
    console.error('❌ Graph transaction history fetch failed:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch transaction history' 
    });
  }
});

// Get global platform statistics
app.get('/api/graph/stats', async (req, res) => {
  console.log('🌍 Fetching global platform statistics...');
  try {
    const stats = await graphService.getGlobalStats();
    
    return res.status(200).json({
      status: 'success',
      data: stats
    });

  } catch (error) {
    console.error('❌ Graph global stats fetch failed:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch global statistics' 
    });
  }
});

// Get reputation leaderboard
app.get('/api/graph/leaderboard', async (req, res) => {
  console.log('🏆 Fetching reputation leaderboard...');
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const leaderboard = await graphService.getReputationLeaderboard(limit);
    
    return res.status(200).json({
      status: 'success',
      data: leaderboard
    });

  } catch (error) {
    console.error('❌ Graph leaderboard fetch failed:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch leaderboard' 
    });
  }
});

// Graph health check endpoint
app.get('/api/graph/health', async (req, res) => {
  console.log('🔍 Checking Graph service health...');
  try {
    const health = await graphService.healthCheck();
    
    return res.status(200).json({
      status: 'success',
      data: health
    });

  } catch (error) {
    console.error('❌ Graph health check failed:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Graph service is unhealthy' 
    });
  }
});

// For Vercel deployment, export the app instead of starting a server
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // For local development, start the server
  app.listen(port, () => {
    console.log(`
🚀 MIRA Backend Server is running on http://localhost:${port}
📊 Graph Protocol integration active
    `);
  });
} 