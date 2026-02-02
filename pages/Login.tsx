import { UserData } from '../types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CameraView from '../components/CameraView';
import { findUserByEmail, initiateOTP } from '../services/authService';
import { verifyFaceIdentity } from '../services/geminiService';

interface LoginProps {
  onFaceVerified: (user: UserData) => void;
}

const Login: React.FC<LoginProps> = ({ onFaceVerified }) => {
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState<'email' | 'scan'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await findUserByEmail(email);
      if (!user) {
        setError("Identity not found. Please register first.");
        return;
      }
      setPhase('scan');
    } catch (err) {
      setError("Database connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleFaceScan = async (blob: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const user = await findUserByEmail(email);
      if (!user) {
        setError("Session expired.");
        setPhase('email');
        return;
      }

      const result = await verifyFaceIdentity(blob, user.faceDescriptor);
      
      if (result.isRateLimited) {
        setError("High traffic. Try again in a few moments.");
        setLoading(false);
        return;
      }

      if (result.success && result.score >= 0.7 && result.livenessScore >= 0.5) {
        try {
          await initiateOTP(user.email);
          onFaceVerified(user);
        } catch (otpErr: any) {
          setError("Face verified. OTP dispatch failed.");
        }
      } else {
        setError(result.explanation || "Biometric mismatch. Please ensure good lighting.");
      }
    } catch (err: any) {
      console.error("Technical Error during login scan:", err);
      if (err.message?.includes("SECURE_AUTH_ERROR")) {
        setError("Neural System Locked: API Key is missing. Please configure process.env.API_KEY.");
      } else {
        setError("Neural analysis failed. Please check console for technical logs.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto glass p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full"></div>
      
      <div className="text-center mb-10 relative z-10">
        <h1 className="text-3xl font-black text-white tracking-tight">Identity Access</h1>
        <p className="text-slate-400 mt-2 text-sm font-medium uppercase tracking-widest">Neural Authentication</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-xs flex items-start gap-3 animate-in fade-in">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {phase === 'email' ? (
        <form onSubmit={handleNext} className="space-y-6 relative z-10">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500/50 outline-none transition-all"
            placeholder="Enter registered email"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Initialize FaceID'}
          </button>
        </form>
      ) : (
        <div className="space-y-8 text-center relative z-10 animate-in fade-in slide-in-from-bottom-4">
          <div className="relative group">
            <CameraView onCapture={handleFaceScan} isScanning={phase === 'scan' && !loading} />
          </div>
          <button onClick={() => setPhase('email')} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-all">Change Identity</button>
        </div>
      )}

      <div className="mt-10 pt-8 border-t border-slate-800/50 text-center relative z-10">
        <p className="text-slate-500 text-[11px] font-medium">
          New to SecureFace? <Link to="/signup" className="text-blue-500 font-bold hover:text-blue-400 ml-1">Enroll Now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;