import React from 'react';
import { Wallet, MapPin, Lock, ArrowRight, Flower2 } from 'lucide-react';

interface SetupScreenProps {
  onNavigate: (screen: string) => void;
  userName?: string;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onNavigate, userName = 'User' }) => {
  const handleSetupChoice = (choice: string) => {
    console.log('User chose:', choice);
    // Navigate to the appropriate screen based on choice
    switch (choice) {
      case 'wallet':
        onNavigate('wallet');
        break;
      case 'recovery':
        onNavigate('progress');
        break;
      case 'safety':
        onNavigate('emergency');
        break;
      default:
        onNavigate('wallet');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-amber-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-rose-400 mb-6 shadow-lg">
            <Flower2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-rose-500 bg-clip-text text-transparent mb-4">
            Welcome to Your Sanctuary, {userName}
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Choose how you'd like to get started. You can always come back to explore other options.
          </p>
        </div>

        {/* Setup Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => handleSetupChoice('wallet')}
            className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-200/50 hover:border-purple-400 hover:shadow-xl transition-all duration-200 text-left group"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Up My Wallet</h3>
            <p className="text-sm text-gray-600 mb-4">Initialize gasless USDC wallet for receiving funds</p>
            <div className="flex items-center text-purple-600 group-hover:text-purple-700">
              <span className="text-sm font-medium">Get started</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>

          <button
            onClick={() => handleSetupChoice('recovery')}
            className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-rose-200/50 hover:border-rose-400 hover:shadow-xl transition-all duration-200 text-left group"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-rose-400 to-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose My Recovery Path</h3>
            <p className="text-sm text-gray-600 mb-4">Therapy, learning, shelter, micro-jobs aligned with your goals</p>
            <div className="flex items-center text-rose-600 group-hover:text-rose-700">
              <span className="text-sm font-medium">Explore options</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>

          <button
            onClick={() => handleSetupChoice('safety')}
            className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-amber-200/50 hover:border-amber-400 hover:shadow-xl transition-all duration-200 text-left group"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Learn How to Keep Safe</h3>
            <p className="text-sm text-gray-600 mb-4">Configure panic button, trusted contacts & account protection</p>
            <div className="flex items-center text-amber-600 group-hover:text-amber-700">
              <span className="text-sm font-medium">Setup protection</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        </div>

        {/* Navigation hint */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            You can always return to this screen to explore other options
          </p>
        </div>
      </div>
    </div>
  );
}; 