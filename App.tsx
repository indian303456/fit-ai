
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import OnboardingPage from './components/OnboardingPage';
import { UserBiometrics } from './types';
import { database } from './services/databaseService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [biometrics, setBiometrics] = useState<UserBiometrics | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Sync with persistent database on mount
    const authStatus = database.isLoggedIn();
    const savedBiometrics = database.getBiometrics();
    
    setIsLoggedIn(authStatus);
    setBiometrics(savedBiometrics);
    setIsInitializing(false);
  }, []);

  const handleLogin = () => {
    database.login();
    setIsLoggedIn(true);
  };

  const handleOnboarding = (data: UserBiometrics) => {
    database.saveBiometrics(data);
    setBiometrics(data);
  };

  const handleLogout = () => {
    database.logout();
    setIsLoggedIn(false);
    setBiometrics(null);
    setActiveTab('home');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#A1F6E2]/20 border-t-[#A1F6E2] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (!biometrics) {
    return <OnboardingPage onComplete={handleOnboarding} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      <Dashboard activeTab={activeTab} userBiometrics={biometrics} />
    </Layout>
  );
};

export default App;
