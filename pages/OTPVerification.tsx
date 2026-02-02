
import React, { useState, useEffect, useRef } from 'react';
import { verifyOTP, initiateOTP } from '../services/authService';
import { UserData } from '../types';

interface OTPProps {
  user: UserData;
  onVerified: (user: UserData) => void;
}

const OTPVerification: React.FC<OTPProps> = ({ user, onVerified }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(120);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const isValid = await verifyOTP(user.email, code);
      if (isValid) {
        onVerified(user);
      } else {
        setError("Invalid code. Please check your email again.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    try {
      await initiateOTP(user.email);
      setTimeLeft(120);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || "Failed to resend email.");
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const maskedEmail = user.email.replace(/(.{3})(.*)(?=@)/, (gp1, gp2, gp3) => gp2 + "*".repeat(gp3.length));

  return (
    <div className="max-w-md mx-auto glass p-10 rounded-[2.5rem] shadow-2xl relative">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 relative">
          <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-4 ring-slate-900">2</div>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Final Step</h1>
        <p className="text-slate-400 mt-3 text-sm leading-relaxed">
          Code sent to <span className="text-blue-400 font-mono font-bold">{maskedEmail}</span>
        </p>
        <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-bold">Check your Inbox & Spam folder</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-xs flex items-center gap-3">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-between gap-2 mb-10">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={el => { inputRefs.current[idx] = el; }}
            type="text"
            inputMode="numeric"
            autoFocus={idx === 0}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-full aspect-square bg-slate-950/80 border border-slate-800 focus:border-blue-500/50 rounded-2xl text-center text-2xl font-bold text-white outline-none transition-all focus:ring-4 focus:ring-blue-500/10"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] mb-8 flex items-center justify-center gap-2"
      >
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Confirm Identity'}
      </button>

      <div className="text-center space-y-4 pt-4 border-t border-slate-800/50">
        <div className="flex items-center justify-center gap-4">
          <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${timeLeft > 0 ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}>
            {timeLeft > 0 ? `Time Left: ${formatTime(timeLeft)}` : 'Code Expired'}
          </div>
          <button 
            onClick={handleResend}
            disabled={resending || (timeLeft > 30 && !error)}
            className={`text-[10px] font-bold uppercase tracking-widest transition-all ${resending || (timeLeft > 30 && !error) ? 'text-slate-700 cursor-not-allowed' : 'text-blue-500 hover:text-blue-400'}`}
          >
            {resending ? 'Sending...' : 'Resend Email'}
          </button>
        </div>
        
        {/* Debug Tip */}
        <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
          <p className="text-[9px] text-slate-500 uppercase tracking-tighter font-medium">
            Developer Tip: If the email doesn't arrive, check the <span className="text-blue-400 font-bold">Browser Console (F12)</span> for the code.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
