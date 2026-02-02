import { UserData, OTPData } from '../types';
import { generateSecureOTP } from './geminiService';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_xtmjw9w';
const EMAILJS_TEMPLATE_ID = 'template_pn25yms';
const EMAILJS_PUBLIC_KEY = 'cZPE21jHr_UkFWwoo';

const DB_KEY = 'secureface_db';
const OTP_KEY = 'secureface_pending_otp';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getDB = (): UserData[] => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
};

export const registerUser = async (user: UserData): Promise<void> => {
  await delay(600);
  const db = getDB();
  db.push(user);
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const findUserByEmail = async (email: string): Promise<UserData | undefined> => {
  await delay(300);
  if (!email) return undefined;
  return getDB().find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const initiateOTP = async (email: string): Promise<OTPData> => {
  const code = await generateSecureOTP(email);
  const expiresAt = Date.now() + 120000;
  const otpData = { code, expiresAt };
  
  localStorage.setItem(`${OTP_KEY}_${email}`, JSON.stringify(otpData));
  
  try {
    const user = await findUserByEmail(email);
    emailjs.init(EMAILJS_PUBLIC_KEY);
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: email.trim(),
      otp_code: code,
      user_name: user?.name || 'User',
      message: `Your SecureFace code: ${code}`
    }, EMAILJS_PUBLIC_KEY);
  } catch (error) {
    console.log(`%c[DEBUG] Your code is: ${code}`, 'color: #fbbf24; font-weight: bold; font-size: 14px;');
  }
  
  return otpData;
};

export const verifyOTP = async (email: string, code: string): Promise<boolean> => {
  await delay(600);
  const stored = localStorage.getItem(`${OTP_KEY}_${email}`);
  if (!stored) return false;
  const otpData: OTPData = JSON.parse(stored);
  if (Date.now() > otpData.expiresAt) return false;
  const isValid = otpData.code === code;
  if (isValid) localStorage.removeItem(`${OTP_KEY}_${email}`);
  return isValid;
};