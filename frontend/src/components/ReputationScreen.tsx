import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Trophy, TrendingUp, Gift, Clock, Users, DollarSign } from 'lucide-react';

interface ReputationData {
  address: string;
  reputationScore: number;
  level: string;
  totalReceived: string;
  totalTransactions: number;
  firstTransactionAt: number;
  lastTransactionAt: number;
  isVerified: boolean;
  achievements: string[];
  reputationHistory: Array<{
    date: number;
    score: number;
  }>;
}

interface AidDisbursement {
  id: string;
  amount: string;
  purpose: string;
  timestamp: number;
  sender: string;
  reputationImpact: number;
  transactionHash: string;
}

interface GlobalStats {
  totalUsers: number;
  totalTransactions: number;
  totalValueTransferred: string;
  totalAidDisbursed: string;
  averageReputationScore: number;
  activeUsersLast30Days: number;
  topDonorCountries: string[];
  lastUpdated: number;
}

interface LeaderboardEntry {
  rank: number;
  address: string;
  reputationScore: number;
  level: string;
  totalReceived: string;
  totalTransactions: number;
  country: string;
}

interface ReputationScreenProps {
  walletAddress?: string;
  onNavigate: (screen: string) => void;
}

export const ReputationScreen: React.FC<ReputationScreenProps> = ({ walletAddress, onNavigate }) => {
  const [reputationData, setReputationData] = useState<ReputationData | null>(null);
  const [aidDisbursements, setAidDisbursements] = useState<AidDisbursement[]>([]);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock wallet address for demo
  const mockWalletAddress = walletAddress || "0x742d35Cc6634C0532925a3b8D2A6F2C0c3D3F3B4";

  useEffect(() => {
    fetchReputationData();
  }, []);

  const fetchReputationData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [reputationRes, disbursementsRes, statsRes, leaderboardRes] = await Promise.all([
        fetch(`https://mira-eth-global-cannes-4pe7.vercel.app/api/graph/reputation/${mockWalletAddress}`),
        fetch(`https://mira-eth-global-cannes-4pe7.vercel.app/api/graph/aid-disbursements/${mockWalletAddress}`),
        fetch(`https://mira-eth-global-cannes-4pe7.vercel.app/api/graph/stats`),
        fetch(`https://mira-eth-global-cannes-4pe7.vercel.app/api/graph/leaderboard?limit=10`)
      ]);

      if (!reputationRes.ok || !disbursementsRes.ok || !statsRes.ok || !leaderboardRes.ok) {
        throw new Error('Failed to fetch reputation data');
      }

      const [reputation, disbursements, stats, leaderboardData] = await Promise.all([
        reputationRes.json(),
        disbursementsRes.json(),
        statsRes.json(),
        leaderboardRes.json()
      ]);

      setReputationData(reputation.data);
      setAidDisbursements(disbursements.data);
      setGlobalStats(stats.data);
      setLeaderboard(leaderboardData.data);
    } catch (err) {
      console.error('Error fetching reputation data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reputation data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatAmount = (amount: string) => {
    return parseFloat(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'platinum': return 'bg-purple-100 text-purple-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getProgressPercentage = (score: number) => {
    const maxScore = 1000;
    return Math.min((score / maxScore) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reputation data...</p>
          <p className="text-sm text-gray-500 mt-2">Powered by The Graph</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-amber-50 flex items-center justify-center">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading reputation data: {error}</p>
          <button 
            onClick={fetchReputationData}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mr-4"
          >
            Retry
          </button>
          <button 
            onClick={() => onNavigate('wallet')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Wallet
          </button>
        </div>
      </div>
    );
  }

  if (!reputationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-amber-50 flex items-center justify-center">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No reputation data available</p>
          <button 
            onClick={() => onNavigate('wallet')}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Back to Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-amber-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onNavigate('wallet')}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                ← Back to Wallet
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reputation Dashboard</h1>
                <p className="text-gray-600">Track your progress and impact</p>
              </div>
            </div>
            <p className="text-sm text-purple-600">Powered by The Graph</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Main Reputation Card */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Avatar className="h-16 w-16 bg-purple-600">
                <AvatarFallback className="text-white text-xl">
                  {reputationData.address.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">Your Reputation Score</CardTitle>
            <CardDescription>
              Wallet: {reputationData.address.slice(0, 6)}...{reputationData.address.slice(-4)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {reputationData.reputationScore}
              </div>
              <Badge className={`text-lg px-4 py-2 ${getLevelColor(reputationData.level)}`}>
                {reputationData.level}
              </Badge>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress to next level</span>
                <span>{getProgressPercentage(reputationData.reputationScore).toFixed(1)}%</span>
              </div>
              <Progress value={getProgressPercentage(reputationData.reputationScore)} className="h-3" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatAmount(reputationData.totalReceived)}
                </div>
                <div className="text-sm text-gray-600">Total Received</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {reputationData.totalTransactions}
                </div>
                <div className="text-sm text-gray-600">Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {reputationData.achievements.length}
                </div>
                <div className="text-sm text-gray-600">Achievements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.floor((Date.now() - reputationData.firstTransactionAt) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-600">Days Active</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for detailed information */}
        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="aid-history">Aid History</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="stats">Global Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Your Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reputationData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">{achievement}</div>
                        <div className="text-sm text-gray-600">Earned recently</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aid-history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-green-500" />
                  Aid Disbursement History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aidDisbursements.map((disbursement) => (
                    <div key={disbursement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                          <Gift className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold">{disbursement.purpose}</div>
                          <div className="text-sm text-gray-600">
                            {formatDate(disbursement.timestamp)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          {formatAmount(disbursement.amount)}
                        </div>
                        <div className="text-sm text-gray-600">
                          +{disbursement.reputationImpact} reputation
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((entry) => (
                    <div key={entry.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {entry.rank}
                        </div>
                        <div>
                          <div className="font-semibold">
                            {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                          </div>
                          <div className="text-sm text-gray-600">{entry.country}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{entry.reputationScore}</div>
                        <Badge className={`text-xs ${getLevelColor(entry.level)}`}>
                          {entry.level}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{globalStats?.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Verified women in crisis</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Aid Disbursed</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${parseFloat(globalStats?.totalAidDisbursed || '0').toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">In USDC distributed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users (30d)</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{globalStats?.activeUsersLast30Days.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Recently active</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Donor Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {globalStats?.topDonorCountries.map((country, index) => (
                    <Badge key={index} variant="secondary">
                      {country}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}; 