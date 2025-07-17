
import { useState } from 'react';
import { Flower2, Shield, Heart, Wallet, MapPin, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { SelfVerification } from './SelfVerification';

interface WelcomeScreenProps {
  onSetupComplete: () => void;
}

export const WelcomeScreen = ({ onSetupComplete }: WelcomeScreenProps) => {
  const [isVerified, setIsVerified] = useState(false);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [userName, setUserName] = useState('');

  const handleVerificationSuccess = (userData: any) => {
    console.log('Self.xyz verification completed:', userData);
    setVerificationData(userData);
    setIsVerified(true);
    // Extract name from verification if available
    if (userData.disclosedData?.name) {
      setUserName(userData.disclosedData.name[0] || 'User');
    } else {
      setUserName('User');
    }
  };

  const handleSetupChoice = (choice: string) => {
    console.log('User chose:', choice);
    onSetupComplete();
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-amber-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-rose-400 mb-6 shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-rose-500 bg-clip-text text-transparent mb-4">
              Welcome to Your Sanctuary, {userName}
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              You now have a private financial identity. This is your space — safe, silent, yours alone.
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

          {/* Trust Indicators */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 text-purple-500 mr-2" />
              Your Data is Protected
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-gray-600">End-to-end encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-gray-600">Zero-knowledge verification</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-gray-600">Self-custody wallet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-amber-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-rose-400 mb-6 shadow-lg">
            <Flower2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-rose-500 bg-clip-text text-transparent mb-4">
            Welcome to MIRA
          </h1>
          <p className="text-lg text-gray-600">
            Create your secure digital identity to access financial support and rebuild your future.
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-purple-200/50 p-8 mb-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600 font-medium">Secure Identity Verification</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              SafeID Creation
            </h2>
            <p className="text-gray-600 text-sm">
              We'll verify your information securely. Your privacy is our priority.
            </p>
          </div>

          <SelfVerification onVerificationSuccess={handleVerificationSuccess} />
        </div>

        {/* Security Features */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Why MIRA is Different</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Privacy First</div>
                <div className="text-xs text-gray-600">Your information stays completely private</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Self-Custody</div>
                <div className="text-xs text-gray-600">You maintain full control of your funds</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Progress Tracking</div>
                <div className="text-xs text-gray-600">Build verifiable credentials at your own pace</div>
              </div>
            </div>
          </div>
        </div>

        {/* Encouragement */}
        <div className="mt-8 text-center">
          <Heart className="w-4 h-4 text-rose-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500">
            Every journey begins with a single step
          </p>
        </div>
      </div>
    </div>
  );
};
