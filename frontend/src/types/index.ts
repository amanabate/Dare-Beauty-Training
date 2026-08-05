export type Language = 'en' | 'am' | 'om';
export type ThemeMode = 'dark' | 'navy' | 'forest' | 'light';

export interface TrainingProgram {
  id: string;
  name: string;
  amharicName: string;
  oromoName?: string;
  category: 'hair' | 'barber' | 'makeup' | 'nails' | 'therapy' | 'lashes' | 'waxing';
  duration: string;
  durationOptions: string[];
  description: string;
  amharicDescription: string;
  oromoDescription?: string;
  image: string;
  skills: string[];
  amharicSkills: string[];
  oromoSkills?: string[];
  trainingUnits: string[];
  certification: string;
  popular?: boolean;
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  amharicTitle: string;
  oromoTitle?: string;
  description: string;
  amharicDescription: string;
  oromoDescription?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  amharicTitle: string;
  oromoTitle?: string;
  category: 'all' | 'hair' | 'barber' | 'makeup' | 'nails' | 'classroom';
  image: string;
  description: string;
  oromoDescription?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  program: string;
  photo: string;
  quote: string;
  amharicQuote: string;
  oromoQuote?: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  amharicQuestion: string;
  oromoQuestion?: string;
  answer: string;
  amharicAnswer: string;
  oromoAnswer?: string;
}

export interface AdmissionStep {
  step: number;
  title: string;
  amharicTitle: string;
  oromoTitle?: string;
  desc: string;
  amharicDesc: string;
  oromoDesc?: string;
}

export interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  programId: string;
  duration: string;
  gender: 'female' | 'male' | 'other';
  preferredShift: 'morning' | 'afternoon' | 'weekend';
  educationLevel: string;
  message?: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  role: 'Student' | 'Applicant' | 'Instructor' | 'Admin';
  phone?: string;
  avatarUrl?: string;
  programEnrolled?: string;
  joinedDate: string;
}

export type NotificationType = 'application' | 'inquiry' | 'system' | 'payment';
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

