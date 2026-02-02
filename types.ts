
export interface UserData {
  name: string;
  email: string;
  phone: string;
  faceDescriptor?: string; // Simulated face signature
  registrationDate: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  step: 'none' | 'face' | 'otp' | 'complete';
  currentUser?: UserData;
  tempUser?: UserData; // User being verified
}

export interface OTPData {
  code: string;
  expiresAt: number;
}
