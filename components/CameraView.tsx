import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraViewProps {
  onCapture: (blob: string) => void;
  isScanning?: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, isScanning }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isInitializing = useRef(false);
  
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
  }, []);

  const startCamera = async () => {
    if (isInitializing.current) return;
    isInitializing.current = true;

    setError(null);
    setCameraReady(false);
    stopCamera();

    // Hardware reset delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const constraintsList: MediaStreamConstraints[] = [
      { video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } },
      { video: { facingMode: 'user' } },
      { video: true }
    ];

    let lastError: any = null;

    for (const constraint of constraintsList) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraint);
        
        if (!isInitializing.current) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
          isInitializing.current = false;
          return; 
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    isInitializing.current = false;
    const errorName = lastError?.name || "";
    const errorMsg = lastError?.message || "";

    if (errorName === 'NotReadableError' || errorName === 'TrackStartError' || errorMsg.includes("video source")) {
      setError("Camera is currently locked by another application. Please close other camera tabs and retry.");
    } else if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
      setError("Camera access was denied. Please check your site permissions.");
    } else {
      setError("Could not connect to camera hardware. Please refresh the page.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      isInitializing.current = false;
      stopCamera();
    };
  }, [stopCamera]);

  const captureFrame = useCallback(() => {
    if (videoRef.current && canvasRef.current && videoRef.current.readyState === 4) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = 640;
      canvas.height = (640 / video.videoWidth) * video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85); 
        setFlash(true);
        setTimeout(() => setFlash(false), 100);
        onCapture(dataUrl);
      }
    }
  }, [onCapture]);

  useEffect(() => {
    if (isScanning && cameraReady) {
      const interval = setInterval(captureFrame, 8000); 
      return () => clearInterval(interval);
    }
  }, [isScanning, cameraReady, captureFrame]);

  return (
    <div className="relative w-full aspect-square md:aspect-video rounded-[2.5rem] overflow-hidden border-2 border-slate-800 shadow-2xl bg-black">
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/98 p-12 text-center z-30">
          <div className="w-16 h-16 mb-4 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-white mb-2">Hardware Conflict</p>
          <p className="text-[11px] text-slate-400 mb-6">{error}</p>
          <button onClick={() => startCamera()} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Reconnect Hardware</button>
        </div>
      ) : (
        <>
          <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-700 ${cameraReady ? 'opacity-100' : 'opacity-0'}`} />
          {!cameraReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950">
              <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Initializing Neural Lens...</p>
            </div>
          )}
          {flash && <div className="absolute inset-0 bg-white z-50 opacity-90" />}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`w-48 h-48 md:w-64 md:h-64 border-2 rounded-full transition-all duration-1000 ${isScanning ? 'border-blue-500 scale-105 shadow-[0_0_50px_rgba(59,130,246,0.2)]' : 'border-white/5'}`}>
               {isScanning && <div className="absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent animate-spin opacity-40" />}
            </div>
          </div>
          <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-4 z-10">
            {!isScanning && cameraReady && (
              <button onClick={(e) => { e.preventDefault(); captureFrame(); }} className="bg-white text-slate-950 px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">Capture Identity</button>
            )}
            {isScanning && (
              <div className="px-8 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full animate-pulse shadow-xl">Processing Biometrics...</div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
    </div>
  );
};

export default CameraView;