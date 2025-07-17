import React, { useState, useEffect } from 'react';
import { SelfQRcodeWrapper, SelfAppBuilder } from '@selfxyz/qrcode';
import { v4 as uuidv4 } from 'uuid';
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface SelfVerificationProps {
  onVerificationSuccess: (userData: any) => void;
}

export const SelfVerification: React.FC<SelfVerificationProps> = ({ onVerificationSuccess }) => {
  const [selfApp, setSelfApp] = useState<any>(null);
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'ready' | 'verifying' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userId] = useState(() => uuidv4()); // Generate unique user ID

  useEffect(() => {
    try {
      console.log('Initializing Self.xyz verification...');
      
      // Create Self app configuration for MIRA
      const app = new SelfAppBuilder({
        version: 2,
        appName: "MIRA - Financial Rebirth",
        scope: "mira-finance-restart", // Same scope as backend
        endpoint: "https://mira-eth-global-cannes-4pe7.vercel.app/api/self-verify", // Our backend endpoint
        logoBase64: "", // Empty logo for now to avoid issues
        userId: userId,
        userIdType: "uuid",
        userDefinedData: "mira_financial_rebirth".padEnd(128, '0'),
        disclosures: {
          nationality: true,        // Show nationality for compliance
          name: true               // Show name for personalization
        }
      }).build();

      setSelfApp(app);
      setVerificationStatus('ready');
      console.log('Self.xyz app initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Self app:', error);
      setErrorMessage('Failed to initialize verification system');
      setVerificationStatus('error');
    }
  }, [userId]);

  const handleVerificationSuccess = async () => {
    console.log('Self.xyz verification completed successfully');
    setVerificationStatus('success');
    
    // The backend handles wallet creation, so we just need to pass success to parent
    // In a real app, you might want to make an additional API call to get user data
    onVerificationSuccess({
      userId: userId,
      verifiedAt: new Date().toISOString(),
      method: 'self_xyz'
    });
  };



  const handleVerificationError = (error: any) => {
    console.error('Self.xyz verification failed:', error);
    setErrorMessage('Verification failed. Please try again.');
    setVerificationStatus('error');
  };

  if (verificationStatus === 'loading') {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-600">Initializing secure verification...</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Verification Successful!</h3>
        <p className="text-gray-600">Creating your secure wallet...</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-6">
        <Shield className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Identity Verification</h3>
        <p className="text-gray-600 text-sm mb-4">
          Scan the QR code with the Self mobile app to verify your identity privately and securely.
        </p>
      </div>

      {selfApp && (
        <div className="mb-6">
          <SelfQRcodeWrapper
            selfApp={selfApp}
            onSuccess={handleVerificationSuccess}
            onError={handleVerificationError}
            size={256}
          />
        </div>
      )}



      <div className="bg-blue-50 rounded-lg p-4 text-left">
        <h4 className="font-medium text-blue-900 mb-2 text-sm">How it works:</h4>
        <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
          <li>Download the Self app on your phone</li>
          <li>Scan this QR code with the Self app</li>
          <li>Follow the app's instructions to verify your identity</li>
          <li>Your wallet will be created automatically</li>
        </ol>
      </div>

      <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span>Zero-knowledge proof</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span>Privacy preserved</span>
        </div>
      </div>
    </div>
  );
}; 