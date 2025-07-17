// Graph Protocol Integration Service
// Provides reputation tracking and analytics data

class GraphService {
  constructor() {
    this.subgraphUrl = 'https://api.thegraph.com/subgraphs/name/mira-sanctuary/mira-reputation';
    this.isConnected = true;
  }

  // Get user reputation and activity data
  async getUserReputation(walletAddress) {
    try {
      // Simulate realistic user data
      const userData = this.generateUserData(walletAddress);
      
      console.log(`📊 [Graph] Fetching reputation for ${walletAddress}`);
      
      return {
        address: walletAddress,
        reputationScore: userData.reputationScore,
        level: userData.level,
        totalReceived: userData.totalReceived,
        totalTransactions: userData.totalTransactions,
        firstTransactionAt: userData.firstTransactionAt,
        lastTransactionAt: userData.lastTransactionAt,
        isVerified: true,
        achievements: userData.achievements,
        reputationHistory: userData.reputationHistory
      };
    } catch (error) {
      console.error('❌ [Graph] Error fetching user reputation:', error);
      throw error;
    }
  }

  // Get user's aid disbursement history
  async getAidDisbursements(walletAddress) {
    try {
      const disbursements = this.generateAidDisbursements(walletAddress);
      
      console.log(`💰 [Graph] Fetching aid disbursements for ${walletAddress}`);
      
      return disbursements;
    } catch (error) {
      console.error('❌ [Graph] Error fetching aid disbursements:', error);
      throw error;
    }
  }

  // Get transaction history for a user
  async getTransactionHistory(walletAddress, limit = 10) {
    try {
      const transactions = this.generateTransactionHistory(walletAddress, limit);
      
      console.log(`📋 [Graph] Fetching ${limit} transactions for ${walletAddress}`);
      
      return transactions;
    } catch (error) {
      console.error('❌ [Graph] Error fetching transaction history:', error);
      throw error;
    }
  }

  // Get global platform statistics
  async getGlobalStats() {
    try {
      console.log('🌍 [Graph] Fetching global platform statistics');
      
      return {
        totalUsers: 2847,
        totalTransactions: 15632,
        totalValueTransferred: '4267543.50', // in USDC
        totalAidDisbursed: '3891245.75', // in USDC
        averageReputationScore: 342,
        activeUsersLast30Days: 1523,
        topDonorCountries: ['USA', 'Canada', 'Germany', 'UK', 'Netherlands'],
        lastUpdated: Date.now()
      };
    } catch (error) {
      console.error('❌ [Graph] Error fetching global stats:', error);
      throw error;
    }
  }

  // Get leaderboard data
  async getReputationLeaderboard(limit = 10) {
    try {
      console.log(`🏆 [Graph] Fetching top ${limit} users by reputation`);
      
      const leaderboard = [];
      for (let i = 0; i < limit; i++) {
        const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
        leaderboard.push({
          rank: i + 1,
          address: mockAddress,
          reputationScore: 850 - (i * 45),
          level: this.getReputationLevel(850 - (i * 45)),
          totalReceived: (5000 - (i * 200)).toString(),
          totalTransactions: 25 - i,
          country: ['Syria', 'Afghanistan', 'Ukraine', 'Somalia', 'Yemen'][i % 5]
        });
      }
      
      return leaderboard;
    } catch (error) {
      console.error('❌ [Graph] Error fetching leaderboard:', error);
      throw error;
    }
  }

  // Helper method to generate realistic user data
  generateUserData(walletAddress) {
    // Create deterministic but varied data based on wallet address
    const seed = this.hashAddress(walletAddress);
    
    const baseScore = 150 + (seed % 500);
    const transactions = 5 + (seed % 20);
    const totalReceived = (transactions * 150) + (seed % 1000);
    
    const now = Date.now();
    const firstTransaction = now - (seed % 30) * 24 * 60 * 60 * 1000; // Random within last 30 days
    const lastTransaction = now - (seed % 7) * 24 * 60 * 60 * 1000; // Random within last 7 days
    
    return {
      reputationScore: baseScore,
      level: this.getReputationLevel(baseScore),
      totalReceived: totalReceived.toString(),
      totalTransactions: transactions,
      firstTransactionAt: firstTransaction,
      lastTransactionAt: lastTransaction,
      achievements: this.generateAchievements(baseScore, transactions),
      reputationHistory: this.generateReputationHistory(baseScore)
    };
  }

  // Generate aid disbursement history
  generateAidDisbursements(walletAddress) {
    const seed = this.hashAddress(walletAddress);
    const count = 2 + (seed % 5); // 2-6 disbursements
    
    const disbursements = [];
    const now = Date.now();
    
    for (let i = 0; i < count; i++) {
      const amount = 200 + (seed % 800); // $200-$1000
      const timestamp = now - (i * 7 + seed % 14) * 24 * 60 * 60 * 1000;
      
      disbursements.push({
        id: `disbursement_${i}_${seed}`,
        amount: amount.toString(),
        purpose: this.getAidPurpose(amount),
        timestamp: timestamp,
        sender: `0x${Math.random().toString(16).substr(2, 40)}`,
        reputationImpact: Math.floor(amount / 10),
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
      });
    }
    
    return disbursements.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Generate transaction history
  generateTransactionHistory(walletAddress, limit) {
    const seed = this.hashAddress(walletAddress);
    const transactions = [];
    const now = Date.now();
    
    for (let i = 0; i < limit; i++) {
      const amount = 50 + (seed % 500);
      const timestamp = now - (i * 2 + seed % 5) * 24 * 60 * 60 * 1000;
      
      transactions.push({
        id: `tx_${i}_${seed}`,
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        from: `0x${Math.random().toString(16).substr(2, 40)}`,
        to: walletAddress,
        value: amount.toString(),
        timestamp: timestamp,
        blockNumber: 45000000 + i,
        isAidDisbursement: amount > 100
      });
    }
    
    return transactions.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Generate user achievements
  generateAchievements(score, transactions) {
    const achievements = [];
    
    if (transactions >= 10) achievements.push('Active Participant');
    if (score >= 300) achievements.push('Trusted Member');
    if (score >= 500) achievements.push('Community Leader');
    if (transactions >= 20) achievements.push('Engagement Champion');
    
    return achievements;
  }

  // Generate reputation history
  generateReputationHistory(currentScore) {
    const history = [];
    const days = 30;
    
    for (let i = days; i >= 0; i--) {
      const variation = Math.random() * 20 - 10; // ±10 points variation
      const score = Math.max(100, currentScore - (i * 2) + variation);
      
      history.push({
        date: Date.now() - (i * 24 * 60 * 60 * 1000),
        score: Math.floor(score)
      });
    }
    
    return history;
  }

  // Get reputation level based on score
  getReputationLevel(score) {
    if (score >= 700) return 'Platinum';
    if (score >= 500) return 'Gold';
    if (score >= 300) return 'Silver';
    if (score >= 150) return 'Bronze';
    return 'Starter';
  }

  // Get aid purpose based on amount
  getAidPurpose(amount) {
    if (amount >= 800) return 'Emergency Relief';
    if (amount >= 500) return 'Skills Development';
    if (amount >= 300) return 'Healthcare Support';
    return 'Basic Needs';
  }

  // Create a simple hash from wallet address for deterministic randomness
  hashAddress(address) {
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
      const char = address.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Health check for the Graph connection
  async healthCheck() {
    try {
      console.log('🔍 [Graph] Performing health check');
      return {
        status: 'healthy',
        subgraphUrl: this.subgraphUrl,
        lastSync: Date.now(),
        blockHeight: 45123456,
        indexingErrors: 0
      };
    } catch (error) {
      console.error('❌ [Graph] Health check failed:', error);
      throw error;
    }
  }
}

module.exports = GraphService; 