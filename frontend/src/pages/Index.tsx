
import React, { useState } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { SetupScreen } from '@/components/SetupScreen';
import { WalletScreen } from '@/components/WalletScreen';
import { ProgressScreen } from '@/components/ProgressScreen';
import { EmergencyScreen } from '@/components/EmergencyScreen';
import { ChatScreen } from '@/components/ChatScreen';
import { ReputationScreen } from '@/components/ReputationScreen';

type Screen = 'welcome' | 'wallet' | 'progress' | 'emergency' | 'chat' | 'reputation' | 'setup';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  console.log('Current screen:', currentScreen);

  const handleSetupComplete = () => {
    setIsSetupComplete(true);
    setCurrentScreen('setup');
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onSetupComplete={handleSetupComplete} />;
      case 'setup':
        return <SetupScreen onNavigate={handleNavigate} />;
      case 'wallet':
        return <WalletScreen onNavigate={handleNavigate} />;
      case 'progress':
        return <ProgressScreen onNavigate={handleNavigate} />;
      case 'emergency':
        return <EmergencyScreen onNavigate={handleNavigate} />;
      case 'chat':
        return <ChatScreen onNavigate={handleNavigate} />;
      case 'reputation':
        return <ReputationScreen onNavigate={handleNavigate} />;
      default:
        return <WelcomeScreen onSetupComplete={handleSetupComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-amber-50 relative overflow-hidden">
      {/* Subtle background elements - restored original style */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200/20 rounded-full blur-xl animate-gentle-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-rose-200/20 rounded-full blur-xl animate-gentle-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-200/20 rounded-full blur-xl animate-gentle-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        {renderScreen()}
      </div>
    </div>
  );
};

export default Index;
