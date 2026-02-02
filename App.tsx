
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import OTPVerification from './pages/OTPVerification';
import Dashboard from './pages/Dashboard';
import { AuthState, UserData } from './types';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    step: 'none'
  });

  const handleAuthUpdate = (update: Partial<AuthState>) => {
    setAuthState(prev => ({ ...prev, ...update }));
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, step: 'none' });
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <header className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/40">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">SECURE<span className="text-blue-500">FACE</span></span>
          </div>
          {authState.isAuthenticated && (
            <button 
              onClick={logout}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          )}
        </header>

        <main className="w-full max-w-4xl pt-20">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/login" 
              element={
                authState.step === 'otp' ? <Navigate to="/otp" /> :
                authState.isAuthenticated ? <Navigate to="/dashboard" /> :
                <Login onFaceVerified={(user) => handleAuthUpdate({ step: 'otp', tempUser: user })} />
              } 
            />
            <Route 
              path="/otp" 
              element={
                authState.step === 'otp' ? (
                  <OTPVerification 
                    user={authState.tempUser!} 
                    onVerified={(user) => handleAuthUpdate({ isAuthenticated: true, step: 'complete', currentUser: user, tempUser: undefined })} 
                  />
                ) : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                authState.isAuthenticated ? <Dashboard user={authState.currentUser!} /> : <Navigate to="/login" />
              } 
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </main>

        <footer className="fixed bottom-6 text-slate-500 text-xs text-center w-full">
          &copy; 2024 SecureFace Authentication System.
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
