import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CameraView from '../components/CameraView';
import { registerUser, findUserByEmail } from '../services/authService';
import { verifyFaceIdentity } from '../services/geminiService';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const existing = await findUserByEmail(formData.email);
      if (existing) {
        setError("This identity already exists in our neural registry.");
        return;
      }
      setStep(2);
      setError(null);
    } catch (err) {
      setError("Registry connection issue. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleFaceCapture = async (blob: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    
    try {
      const result = await verifyFaceIdentity(blob, undefined);
      
      if (result.isRateLimited) {
        setError("Neural services are under high load. Please wait 20 seconds.");
        setLoading(false);
        return;
      }

      if (result.success && result.livenessScore >= 0.5) {
        const userData = {
          ...formData,
          faceDescriptor: blob,
          registrationDate: new Date().toISOString()
        };
        
        await registerUser(userData);
        navigate('/login');
      } else {
        setError(result.explanation || "Registration failed. Ensure you are well-lit and not using a photo.");
      }
    } catch (err: any) {
      console.error("Technical Error during capture:", err);
      if (err.message?.includes("SECURE_AUTH_ERROR")) {
        setError("Configuration Error: The API Key is missing. Please ensure process.env.API_KEY is configured.");
      } else {
        setError("AI initialization failed. Check your browser console for more details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto glass p-10 rounded-[3rem] shadow-2xl relative">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-white tracking-tight">Identity Enrolment</h1>
        <p className="text-slate-400 mt-2 text-xs font-bold uppercase tracking-widest">Provisioning Neural Map</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-xs flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="leading-relaxed font-medium">{error}</span>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleNext} className="space-y-4">
          <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all" placeholder="Full Name" />
          <input required name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all" placeholder="Email" />
          <input required name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all" placeholder="Phone" />
          <input required name="password" type="password" value={formData.password} onChange={handleInputChange} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all" placeholder="Security PIN" />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] mt-4"
          >
            {loading ? "Processing..." : "Next: Biometric Capture"}
          </button>
        </form>
      ) : (
        <div className="space-y-8 text-center animate-in fade-in zoom-in-95 duration-500">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Look directly into the camera</p>
          <CameraView onCapture={handleFaceCapture} isScanning={step === 2 && !loading} />
          <button onClick={() => setStep(1)} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white">Back to Details</button>
        </div>
      )}

      <div className="mt-10 pt-8 border-t border-slate-800/50 text-center">
        <p className="text-slate-500 text-[11px] font-medium">
          Already Enrolled? <Link to="/login" className="text-blue-500 font-bold ml-1">Identity Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;