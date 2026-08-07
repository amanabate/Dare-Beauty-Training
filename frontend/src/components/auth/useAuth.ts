'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Language, UserAccount } from '@/types';

export const PROGRAMS = [
  'Hair Dressing & Styling',
  'Barbering & Grooming',
  'Makeup Artistry',
  'Nail Care Technology',
  'Beauty Therapy & Spa',
] as const;

export type Program = typeof PROGRAMS[number];

export const DEMO_USERS: Record<'Admin' | 'Instructor' | 'Student', UserAccount> = {
  Admin: {
    id: 'admin-001',
    fullName: 'Director Selamawit Abera',
    email: 'admin@darebeauty.edu.et',
    role: 'Admin',
    phone: '+251 911 223344',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    joinedDate: '2024-01-15',
  },
  Instructor: {
    id: 'inst-002',
    fullName: 'Master Instructor Tigist Haile',
    email: 'tigist.haile@darebeauty.edu.et',
    role: 'Instructor',
    phone: '+251 922 334455',
    programEnrolled: 'Advanced Hair Dressing',
    joinedDate: '2024-03-01',
  },
  Student: {
    id: 'stud-003',
    fullName: 'Bethlehem Worku',
    email: 'bethlehem.worku@student.dare.et',
    role: 'Student',
    phone: '+251 933 445566',
    programEnrolled: 'Professional Hair Dressing',
    joinedDate: '2026-02-10',
  },
};

export function useAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);

  // Hydrate lang from localStorage on mount
  useEffect(() => {
    try {
      const lang = localStorage.getItem('hc-lang') as Language | null;
      if (lang) setCurrentLang(lang);
    } catch { /* ignore */ }
  }, []);

  const saveUserAndRedirect = (user: UserAccount, token?: string) => {
    try {
      localStorage.setItem('dare_user_account', JSON.stringify(user));
      if (token) localStorage.setItem('dare_auth_token', token);
    } catch { /* ignore */ }
    const dest =
      searchParams.get('redirect') ||
      (user.role === 'Admin'
        ? '/dashboard/admin'
        : user.role === 'Instructor'
        ? '/dashboard/instructor'
        : user.role === 'Student'
        ? '/dashboard/student'
        : '/');
    router.push(dest);
  };

  /**
   * Sign in — tries real backend first, falls back to mock if backend is
   * unreachable (development convenience).
   */
  const apiSignIn = async (
    email: string,
    password: string,
    onError: (msg: string) => void,
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data: { token: string; user: UserAccount } = await res.json();
        setIsLoading(false);
        saveUserAndRedirect(data.user, data.token);
        return;
      }

      // Backend returned an error
      const data = await res.json();
      setIsLoading(false);
      onError(data.error || 'Sign in failed.');
    } catch {
      // Backend unreachable — match exact demo credentials first
      const demoMatch = Object.values(DEMO_USERS).find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (demoMatch) {
        setIsLoading(false);
        saveUserAndRedirect(demoMatch);
        return;
      }
      // Fall back to a generic mock for any other email
      const role =
        email.toLowerCase().includes('admin') ? 'Admin'
        : email.toLowerCase().includes('instructor') ? 'Instructor'
        : 'Student';
      const mockUser: UserAccount = {
        id: `usr-${Date.now()}`,
        fullName: email.split('@')[0].replace(/[._]/g, ' '),
        email,
        role: role as UserAccount['role'],
        phone: '+251 91 000 0000',
        joinedDate: new Date().toLocaleDateString(),
      };
      setIsLoading(false);
      saveUserAndRedirect(mockUser);
    }
  };

  /**
   * Sign up — tries real backend first, falls back to mock.
   */
  const apiSignUp = async (
    payload: {
      fullName: string;
      email: string;
      phone: string;
      password: string;
      role: 'Student' | 'Applicant' | 'Instructor';
      programEnrolled?: string;
    },
    onError: (msg: string) => void,
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data: { token: string; user: UserAccount } = await res.json();
        setIsLoading(false);
        saveUserAndRedirect(data.user, data.token);
        return;
      }

      const data = await res.json();
      setIsLoading(false);
      onError(data.error || 'Registration failed.');
    } catch {
      // Backend unreachable — fall back to mock
      const mockUser: UserAccount = {
        id: `usr-${Date.now()}`,
        fullName: payload.fullName,
        email: payload.email,
        role: payload.role,
        phone: payload.phone || '+251 91 000 0000',
        programEnrolled: payload.programEnrolled,
        joinedDate: new Date().toLocaleDateString(),
      };
      setIsLoading(false);
      saveUserAndRedirect(mockUser);
    }
  };

  const handleDemo = (role: 'Admin' | 'Instructor' | 'Student') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      saveUserAndRedirect(DEMO_USERS[role]);
    }, 300);
  };

  // Translation table
  const t = {
    email:      currentLang === 'en' ? 'Email Address'    : currentLang === 'am' ? 'ኢሜይል አድራሻ'       : 'Teessoo Imeelii',
    phone:      currentLang === 'en' ? 'Phone Number'     : currentLang === 'am' ? 'ስልክ ቁጥር'          : 'Lakkoofsa Bilbilaa',
    password:   currentLang === 'en' ? 'Password'         : currentLang === 'am' ? 'የይለፍ ቃል'          : 'Jecha Darbiinsaa',
    confirm:    currentLang === 'en' ? 'Confirm Password' : currentLang === 'am' ? 'የይለፍ ቃል ያረጋግጡ'  : 'Mirkaneessaa',
    fullName:   currentLang === 'en' ? 'Full Name'        : currentLang === 'am' ? 'ሙሉ ስም'            : 'Maqaa Guutuu',
    role:       currentLang === 'en' ? 'Account Role'     : currentLang === 'am' ? 'የአካውንት አይነት'     : 'Gosa Akkaawuntii',
    program:    currentLang === 'en' ? 'Enrolled Program' : currentLang === 'am' ? 'የተመዘገቡበት ኮርስ'   : "Prograammi Galmaa'an",
    signInBtn:  currentLang === 'en' ? 'Sign In'          : currentLang === 'am' ? 'ወደ አካውንት ይግቡ'    : 'Seenaa',
    signUpBtn:  currentLang === 'en' ? 'Create Account'   : currentLang === 'am' ? 'ምዝገባውን ያጠናቅቁ'   : 'Galmee Xumuraa',
    noAcct:     currentLang === 'en' ? "Don't have an account?" : currentLang === 'am' ? 'አካውንት የለዎትም?' : "Akkaawuntii hin qabdan?",
    haveAcct:   currentLang === 'en' ? 'Already have an account?' : currentLang === 'am' ? 'አካውንት አለዎት?' : 'Akkaawuntii qabduu?',
    goSignUp:   currentLang === 'en' ? 'Create Account'   : currentLang === 'am' ? 'ተመዝገብ'            : "Galmaa'aa",
    goSignIn:   currentLang === 'en' ? 'Sign In'          : currentLang === 'am' ? 'ይግቡ'               : 'Seenaa',
    fillAll:    currentLang === 'en' ? 'Please fill in all required fields.' : currentLang === 'am' ? 'እባክዎን ሁሉንም መስኮች ይሙሉ' : 'Dirreewwan hunda guutaa.',
    pwMismatch: currentLang === 'en' ? 'Passwords do not match.' : currentLang === 'am' ? 'የይለፍ ቃሎች አይመሳሰሉም' : 'Jechoonni wal hin simanu.',
    created:    currentLang === 'en' ? 'Account created! Redirecting…' : currentLang === 'am' ? 'አካውንትዎ ተፈጥሯል!' : 'Akkaawuntiin uumame!',
    forgot:     currentLang === 'en' ? 'Forgot Password?' : currentLang === 'am' ? 'የይለፍ ቃልዎን ረሱ?'  : 'Jecha Darbiinsaa Irranfatte?',
    remember:   currentLang === 'en' ? 'Remember me'      : currentLang === 'am' ? 'አስታውሰኝ'           : 'Na yaadadhu',
    backHome:   currentLang === 'en' ? 'Back to Home'     : currentLang === 'am' ? 'ወደ ዋና ገፅ'         : "Fuula Duraatti Deebi'aa",
    demo:       currentLang === 'en' ? 'Quick demo login' : currentLang === 'am' ? 'የማሳያ መግቢያ'       : 'Seensa Demo',
  };

  return { currentLang, isLoading, setIsLoading, t, saveUserAndRedirect, handleDemo, apiSignIn, apiSignUp };
}
