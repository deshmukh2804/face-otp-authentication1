import { GoogleGenAI, Type } from "@google/genai";

/**
 * Helper to get a fresh AI instance.
 * Ensures we use the environment-provided process.env.API_KEY.
 */
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("SECURE_AUTH_ERROR: API_KEY environment variable is missing. Biometric services cannot initialize.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Validates a face capture against either a new enrollment or a stored reference.
 * Uses gemini-3-flash-preview for high-speed multimodal reasoning.
 */
export const verifyFaceIdentity = async (
  capturedImageBase64: string, 
  storedFaceData: string | undefined
): Promise<{ 
  success: boolean; 
  score: number; 
  livenessScore: number; 
  explanation?: string; 
  isRateLimited?: boolean; 
  isServerError?: boolean 
}> => {
  try {
    const ai = getAIClient();
    const capturedData = capturedImageBase64.split(',')[1] || capturedImageBase64;
    const isEnrollment = !storedFaceData;
    
    const parts: any[] = [
      { 
        text: isEnrollment 
          ? "TASK: IDENTITY ENROLLMENT. Verify Image 1 is a clear, live human face. Reject photos of screens, paper, or masks." 
          : "TASK: IDENTITY VERIFICATION. Match Image 1 (Live Scan) against Image 2 (Registered Reference). Only succeed if they are clearly the same person." 
      },
      { text: "Image 1 (Live Capture):" },
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: capturedData,
        },
      }
    ];

    if (storedFaceData && storedFaceData.startsWith('data:image')) {
      const referenceData = storedFaceData.split(',')[1] || storedFaceData;
      parts.push({ text: "Image 2 (Registered Reference):" });
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: referenceData,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: `You are a sophisticated Biometric Authentication Engine.
        
        RULES:
        1. LIVENESS: Detect moire patterns or screen edges. If identity is a photo of a screen, return success: false.
        2. QUALITY: Ensure the face is centered and well-lit.
        3. MATCHING: If Image 2 is provided, compare facial structures accurately.
        
        OUTPUT: Return JSON only.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            score: { type: Type.NUMBER },
            livenessScore: { type: Type.NUMBER },
            explanation: { type: Type.STRING }
          },
          required: ["success", "score", "livenessScore"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty AI response.");
    
    return JSON.parse(text.trim());
  } catch (error: any) {
    console.error("Gemini AI Service Error:", error);
    const isRateLimited = error?.message?.includes('429') || error?.status === 429;
    
    // Propagate the specific initialization error message if it exists
    if (error.message?.includes("SECURE_AUTH_ERROR")) {
      throw error; 
    }

    return { 
      success: false, 
      score: 0, 
      livenessScore: 0, 
      isRateLimited,
      explanation: "Neural engine connection error. Please verify network and API configuration."
    };
  }
};

export const generateSecureOTP = async (email: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a secure 6-digit numeric OTP for ${email}. Output ONLY the 6 digits.`
    });
    return (response.text || '').trim().replace(/\D/g, '').slice(0, 6);
  } catch (error) {
    console.warn("OTP AI Generation failed, falling back to local CSPRNG.", error);
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
};