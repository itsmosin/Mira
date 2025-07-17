
import { useState } from 'react';
import { ArrowLeft, Shield, Key, Eye, EyeOff, AlertTriangle, Heart } from 'lucide-react';

interface EmergencyScreenProps {
  onNavigate: (screen: 'wallet' | 'progress' | 'emergency' | 'setup') => void;
}

export const EmergencyScreen = ({ onNavigate }: EmergencyScreenProps) => {
  const [safeAddress, setSafeAddress] = useState('');
  const [showAddress, setShowAddress] = useState(false);
  const [isWalletFrozen, setIsWalletFrozen] = useState(false);

  console.log('Emergency screen - wallet frozen:', isWalletFrozen);

  const handleFreezeWallet = () => {
    setIsWalletFrozen(true);
    console.log('Wallet frozen for safety');
  };

  const handleUnfreezeWallet = () => {
    setIsWalletFrozen(false);
    console.log('Wallet unfrozen');
  };

  return (
    <div className="min-h-screen p-6">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('setup')}
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg border border-purple-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Setup</span>
          </button>
          <button
            onClick={() => onNavigate('wallet')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <Shield className="w-4 h-4" />
            <span className="text-sm">Safe Space</span>
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
            <Shield className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-light text-gray-800 mb-2">Emergency Settings</h1>
          <p className="text-gray-600">Keep yourself and your funds safe</p>
        </div>

        {/* Wallet Status */}
        <div className={`mira-card p-6 mb-6 ${isWalletFrozen ? 'bg-amber-50 border-amber-200' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${isWalletFrozen ? 'bg-amber-100' : 'bg-green-100'}`}>
                <Shield className={`w-5 h-5 ${isWalletFrozen ? 'text-amber-600' : 'text-green-600'}`} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">Wallet Status</h3>
                <p className="text-xs text-gray-600">
                  {isWalletFrozen ? 'Frozen for your safety' : 'Active and protected'}
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isWalletFrozen 
                ? 'bg-amber-100 text-amber-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {isWalletFrozen ? 'FROZEN' : 'ACTIVE'}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            {isWalletFrozen 
              ? 'Your wallet is temporarily frozen. No transactions can be made until you unfreeze it.'
              : 'If you feel unsafe, you can freeze your wallet to prevent any transactions.'
            }
          </p>

          {isWalletFrozen ? (
            <button
              onClick={handleUnfreezeWallet}
              className="w-full py-3 px-4 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
            >
              Unfreeze My Wallet
            </button>
          ) : (
            <button
              onClick={handleFreezeWallet}
              className="w-full py-3 px-4 rounded-full bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors"
            >
              Freeze My Wallet
            </button>
          )}
        </div>

        {/* Safe Address Setup */}
        <div className="mira-card p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-full bg-blue-100">
              <Key className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-800">Emergency Contact</h3>
              <p className="text-xs text-gray-600">Trusted person who can help if needed</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type={showAddress ? 'text' : 'password'}
                value={safeAddress}
                onChange={(e) => setSafeAddress(e.target.value)}
                placeholder="Enter trusted person's wallet address"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={() => setShowAddress(!showAddress)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showAddress ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">Important:</p>
                  <p>Only add someone you completely trust. They won't have access to your funds, but can help verify your identity if you lose access.</p>
                </div>
              </div>
            </div>

            <button
              disabled={!safeAddress.trim()}
              className="w-full py-3 px-4 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Emergency Contact
            </button>
          </div>
        </div>

        {/* Support Resources */}
        <div className="mira-card p-6">
          <h3 className="text-sm font-medium text-gray-800 mb-4">Need Help Right Now?</h3>
          
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
              <div className="text-sm font-medium text-purple-800">24/7 Crisis Support</div>
              <div className="text-xs text-purple-600">Connect with trained counselors</div>
            </button>
            
            <button className="w-full text-left p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
              <div className="text-sm font-medium text-green-800">Safety Planning</div>
              <div className="text-xs text-green-600">Create a personalized safety plan</div>
            </button>
            
            <button className="w-full text-left p-3 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors">
              <div className="text-sm font-medium text-rose-800">Local Resources</div>
              <div className="text-xs text-rose-600">Find help in your area</div>
            </button>
          </div>
        </div>

        {/* Reassurance */}
        <div className="mt-8 text-center">
          <Heart className="w-5 h-5 text-rose-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            You are not alone. Your safety matters.
          </p>
        </div>
      </div>
    </div>
  );
};
