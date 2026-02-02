
import React from 'react';
import { UserData } from '../types';

interface DashboardProps {
  user: UserData;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-3xl mx-auto">
      {/* Premium Identity Card */}
      <div className="glass p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col items-center gap-8 text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full"></div>
        
        <div className="relative">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl rotate-3 border-4 border-white/10">
            {user.name.charAt(0)}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-2xl border-4 border-slate-900 shadow-xl">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Welcome, {user.name}</h1>
            <p className="text-slate-500 font-mono text-sm mt-2">ACCOUNT IDENTIFIER: {user.email.toUpperCase()}</p>
          </div>
          
          <div className="max-w-md mx-auto py-6 px-8 bg-slate-950/40 rounded-3xl border border-white/5 space-y-4">
            <p className="text-slate-400 font-medium text-sm">
              Your biometric identity was successfully validated. Your secure session is now active and protected by multi-factor authentication.
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center">
               <div className="px-5 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  FaceID Verified
               </div>
               <div className="px-5 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  2FA Secure
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-white/5">
          <div className="text-center p-4">
             <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Last Login</div>
             <div className="text-xs text-white font-mono">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
          </div>
          <div className="text-center p-4">
             <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Security Level</div>
             <div className="text-xs text-emerald-400 font-bold uppercase">Enhanced</div>
          </div>
        </div>
      </div>

      <div className="text-center p-8 bg-white/5 rounded-[2rem] border border-white/5">
        <p className="text-slate-500 text-xs font-medium italic">
          "The most secure connection is the one that recognizes you."
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
