import React, { useState, useEffect } from 'react';
import { Flower2, Shield, Heart, Wallet, MapPin, Lock, CheckCircle, ArrowRight, MessageCircle, Trophy, Clock, TrendingUp, Lightbulb, BookOpen, Plus, RefreshCw, Copy, ExternalLink, Award, Star } from 'lucide-react';

interface WalletScreenProps {
  onNavigate: (screen: string) => void;
}

interface WalletData {
  id: string;
  address: string;
  blockchain: string;
  balance: string;
  balanceUSD: string;
}

interface Transaction {
  id: string;
  type: 'received' | 'sent';
  amount: string;
  token: string;
  timestamp: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

const pathOptions = [
  {
    id: 'therapy',
    title: 'Emotional Healing',
    description: 'Connect with therapists and support groups',
    icon: Heart,
    color: 'text-rose-500',
    gradient: 'from-rose-400 to-rose-600',
    cta: 'Start healing'
  },
  {
    id: 'learning',
    title: 'Skills & Education',
    description: 'Access courses and workshops to build new skills',
    icon: BookOpen,
    color: 'text-blue-500',
    gradient: 'from-blue-400 to-blue-600',
    cta: 'Begin learning'
  },
  {
    id: 'shelter',
    title: 'Safe Housing',
    description: 'Find temporary or permanent housing options',
    icon: MapPin,
    color: 'text-green-500',
    gradient: 'from-green-400 to-green-600',
    cta: 'Find shelter'
  }
];

const transactionHistory = {
  received: [
    {
      title: 'Emergency Grant',
      description: 'Received from MIRA Fund',
      amount: '+ $100.00',
      date: 'July 8, 2024',
      icon: Heart,
      color: 'bg-rose-100'
    },
    {
      title: 'Skills Workshop',
      description: 'Payment from Learn & Earn',
      amount: '+ $50.00',
      date: 'July 5, 2024',
      icon: BookOpen,
      color: 'bg-blue-100'
    }
  ],
  spent: [
    {
      title: 'Grocery Purchase',
      description: 'Spent at Safeway',
      amount: '- $32.50',
      date: 'July 7, 2024',
      icon: Wallet,
      color: 'bg-purple-100'
    },
    {
      title: 'Therapy Session',
      description: 'Paid to Dr. Emily Carter',
      amount: '- $60.00',
      date: 'July 3, 2024',
      icon: Heart,
      color: 'bg-rose-100'
    }
  ],
  protected: [
    {
      title: 'Account Protection',
      description: 'Emergency fund locked',
      amount: '+ $247.50',
      date: 'July 1, 2024',
      icon: Shield,
      color: 'bg-green-100'
    }
  ]
};

const suggestedActions = [
  {
    text: 'Complete your SafeID verification to unlock additional benefits'
  },
  {
    text: 'Explore available therapy sessions in your area'
  },
  {
    text: 'Enroll in a budgeting workshop to manage your funds effectively'
  }
];

interface ChatScreenProps {
  onNavigate: (screen: string) => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'mira';
  timestamp: Date;
  mode?: string;
}

interface ChatMode {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  placeholder: string;
}

export const WalletScreen = ({ onNavigate }: WalletScreenProps) => {
  const [activePathIndex, setActivePathIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('received');
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [reputationData, setReputationData] = useState<any>(null);

  // Create new Circle wallet
  const createWallet = async () => {
    setIsCreatingWallet(true);
    setError('');
    
    try {
      const response = await fetch('https://mira-eth-global-cannes-4pe7.vercel.app/api/wallet/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIdentifier: `mira_user_${Date.now()}`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create wallet');
      }

      const data = await response.json();
      setWalletData({
        id: data.wallet.id,
        address: data.wallet.address,
        blockchain: data.wallet.blockchain,
        balance: '0',
        balanceUSD: '0.00'
      });
      
      console.log('✅ Wallet created successfully:', data);
      // Fetch balance after creation
      await fetchWalletBalance(data.wallet.id);
      
    } catch (err) {
      console.error('❌ Wallet creation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to create wallet');
    } finally {
      setIsCreatingWallet(false);
    }
  };

  // Fetch wallet balance from Circle API
  const fetchWalletBalance = async (walletId: string) => {
    try {
      const response = await fetch(`https://mira-eth-global-cannes-4pe7.vercel.app/api/wallet/${walletId}/balance`);
      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }
      
      const data = await response.json();
      setWalletData(prev => prev ? {
        ...prev,
        balance: data.balance || '0',
        balanceUSD: data.balanceUSD || '0.00'
      } : null);
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('❌ Balance fetch failed:', err);
    }
  };

  // Fetch transaction history
  const fetchTransactions = async (walletId: string) => {
    try {
      const response = await fetch(`https://mira-eth-global-cannes-4pe7.vercel.app/api/wallet/${walletId}/transactions`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error('❌ Transaction fetch failed:', err);
    }
  };

  // Refresh wallet data
  const refreshWallet = async () => {
    if (!walletData) return;
    
    setIsLoading(true);
    await Promise.all([
      fetchWalletBalance(walletData.id),
      fetchTransactions(walletData.id)
    ]);
    setIsLoading(false);
  };

  // Copy wallet address to clipboard
  const copyAddress = async () => {
    if (!walletData?.address) return;
    
    try {
      await navigator.clipboard.writeText(walletData.address);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  // Fetch reputation data from The Graph
  const fetchReputationData = async (walletAddress: string) => {
    try {
      const response = await fetch(`https://mira-eth-global-cannes-4pe7.vercel.app/api/graph/reputation/${walletAddress}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reputation data');
      }
      
      const data = await response.json();
      setReputationData(data.data);
    } catch (err) {
      console.error('Failed to fetch reputation data:', err);
    }
  };

  // Load wallet data on component mount
  useEffect(() => {
    // Check if user already has a wallet (you might store this in localStorage or user context)
    const savedWallet = localStorage.getItem('mira_wallet');
    if (savedWallet) {
      const wallet = JSON.parse(savedWallet);
      setWalletData(wallet);
      fetchWalletBalance(wallet.id);
      fetchTransactions(wallet.id);
      fetchReputationData(wallet.address);
    }
  }, []);

  // Save wallet data to localStorage whenever it changes
  useEffect(() => {
    if (walletData) {
      localStorage.setItem('mira_wallet', JSON.stringify(walletData));
    }
  }, [walletData]);

  const handlePathClick = (index: number) => {
    setActivePathIndex(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-amber-50">
      {/* Enhanced Header with Your Path */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-rose-400 flex items-center justify-center shadow-lg">
                  <Flower2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-rose-500 bg-clip-text text-transparent">
                    MIRA
                  </h1>
                  <p className="text-sm text-purple-600">Your Sanctuary</p>
                </div>
              </div>
            </div>

            {/* Your Path Progress */}
            <div className="hidden md:flex items-center space-x-6 bg-gradient-to-r from-purple-100 to-rose-100 px-6 py-3 rounded-full">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-purple-700">Your Path:</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="w-8 h-0.5 bg-purple-200"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="w-8 h-0.5 bg-gray-200"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center space-x-1 bg-purple-200 px-3 py-1 rounded-full">
                <Trophy className="w-3 h-3 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">3 Milestones</span>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onNavigate('setup')}
                className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm text-purple-600 px-4 py-2 rounded-full hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg border border-purple-200"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span className="text-sm font-medium">Back to Setup</span>
              </button>
              <button
                onClick={() => onNavigate('chat')}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-rose-500 text-white px-4 py-2 rounded-full hover:from-purple-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Chat with MIRA</span>
              </button>
              <button
                onClick={() => onNavigate('emergency')}
                className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Shield className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Balance & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card - Real wallet data */}
            {walletData ? (
              <div className="bg-gradient-to-r from-purple-500 to-rose-500 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Your Safe Balance</p>
                    <h2 className="text-4xl font-bold">${walletData.balanceUSD}</h2>
                    <p className="text-purple-100 text-sm mt-1">USDC • No gas fees needed</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <Wallet className="w-8 h-8 text-white mb-2" />
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                {/* Wallet Address */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                  <p className="text-purple-100 text-xs mb-2">Wallet Address</p>
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm font-mono">
                      {walletData.address.slice(0, 6)}...{walletData.address.slice(-4)}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={copyAddress}
                        className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      >
                        <Copy className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => window.open(`https://amoy.polygonscan.com/address/${walletData.address}`, '_blank')}
                        className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-purple-100 text-xs">Blockchain</p>
                    <p className="text-white text-sm font-medium">{walletData.blockchain}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-xs">Last Updated</p>
                      <p className="text-white text-sm font-medium">
                        {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
                      </p>
                    </div>
                    <button
                      onClick={refreshWallet}
                      disabled={isLoading}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 text-white ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* No Wallet - Creation Card */
              <div className="bg-gradient-to-r from-purple-500 to-rose-500 rounded-2xl p-8 text-white shadow-xl">
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 w-20 h-20 mx-auto mb-6">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Create Your MIRA Wallet</h2>
                  <p className="text-purple-100 mb-6">
                    Get started with your secure, gasless USDC wallet powered by Circle
                  </p>
                  
                  {error && (
                    <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-4">
                      <p className="text-red-100 text-sm">{error}</p>
                    </div>
                  )}
                  
                  <button
                    onClick={createWallet}
                    disabled={isCreatingWallet}
                    className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                  >
                    {isCreatingWallet ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Creating Wallet...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Create Wallet
                      </>
                    )}
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-purple-100 text-xs">Powered by</p>
                      <p className="text-white text-sm font-medium">Circle</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-purple-100 text-xs">Network</p>
                      <p className="text-white text-sm font-medium">Polygon</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recovery Path - Enhanced */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Heart className="w-5 h-5 text-rose-500 mr-2" />
                Your Recovery Path
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pathOptions.map((option, index) => {
                  const Icon = option.icon;
                  const isActive = activePathIndex === index;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handlePathClick(index)}
                      className={`p-6 rounded-xl text-left transition-all duration-200 border-2 ${
                        isActive
                          ? `bg-gradient-to-r ${option.gradient} text-white border-transparent shadow-lg`
                          : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <Icon className={`w-6 h-6 ${isActive ? 'text-white' : option.color}`} />
                        <h4 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                          {option.title}
                        </h4>
                      </div>
                      <p className={`text-sm mb-4 ${isActive ? 'text-white/90' : 'text-gray-600'}`}>
                        {option.description}
                      </p>
                      <div className={`flex items-center text-sm font-medium ${
                        isActive ? 'text-white' : option.color
                      }`}>
                        <span>{option.cta}</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Transaction History - Enhanced */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 text-purple-500 mr-2" />
                  Recent Activity
                </h3>
                <div className="flex bg-purple-100 rounded-lg p-1">
                  {['Received', 'Spent', 'Protected'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.toLowerCase()
                          ? 'bg-white text-purple-700 shadow-sm'
                          : 'text-purple-600 hover:text-purple-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {transactionHistory[activeTab as keyof typeof transactionHistory].map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.color}`}>
                        <transaction.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.title}</p>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'}`}>
                        {transaction.amount}
                      </p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reputation Card - Powered by The Graph */}
            {reputationData && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 text-purple-500 mr-2" />
                  Reputation Score
                </h3>
                
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {reputationData.reputationScore}
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    reputationData.level === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                    reputationData.level === 'Silver' ? 'bg-gray-100 text-gray-800' :
                    reputationData.level === 'Bronze' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    <Star className="w-4 h-4 mr-1" />
                    {reputationData.level}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Received</span>
                    <span className="text-sm font-semibold text-green-600">
                      ${parseFloat(reputationData.totalReceived).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Transactions</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {reputationData.totalTransactions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Achievements</span>
                    <span className="text-sm font-semibold text-purple-600">
                      {reputationData.achievements.length}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => onNavigate('reputation')}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium mb-2"
                  >
                    View Full Dashboard
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    Powered by The Graph
                  </p>
                </div>
              </div>
            )}

            {/* Progress Tracking - Enhanced */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                Your Progress
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Healing Credits</span>
                    <span className="text-lg font-bold text-rose-500">28</span>
                  </div>
                  <div className="w-full bg-rose-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-rose-400 to-rose-600 h-2 rounded-full" style={{width: '70%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Total Aid Received</span>
                    <span className="text-lg font-bold text-green-500">
                      ${walletData ? walletData.balanceUSD : '0.00'}
                    </span>
                  </div>
                  <div className="w-full bg-green-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{width: walletData ? Math.min(parseFloat(walletData.balanceUSD) / 500 * 100, 100) + '%' : '0%'}}></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-100 to-rose-100 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Trophy className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">Milestones</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">3 Completed</p>
                  <p className="text-xs text-purple-600 mt-1">
                    Share progress privately with sponsors or job platforms
                  </p>
                </div>
              </div>
            </div>

            {/* Suggested Actions - Enhanced */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 text-amber-500 mr-2" />
                Gentle Nudges
              </h3>
              
              <div className="space-y-4">
                {suggestedActions.map((action, index) => (
                  <div key={index} className="bg-white/50 rounded-lg p-4 border-l-4 border-purple-300">
                    <p className="text-sm text-gray-700 mb-3">{action.text}</p>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full hover:bg-purple-200 transition-colors">
                        Okay, I'll do it
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors">
                        Not now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Access */}
            <div className="bg-gradient-to-r from-purple-100 to-rose-100 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">24/7 Support</h3>
              <p className="text-sm text-purple-700 mb-4">MIRA is always here when you need guidance</p>
              <button
                onClick={() => onNavigate('chat')}
                className="w-full bg-gradient-to-r from-purple-500 to-rose-500 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Conversation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
