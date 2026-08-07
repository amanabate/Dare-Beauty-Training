'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  User,
  BookOpen,
  CalendarCheck,
  Award,
  CreditCard,
  Bell,
  HelpCircle,
  X,
  Plus,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  QrCode,
  Upload,
  Phone,
  Mail,
  MapPin,
  FileText,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Sun,
  Moon,
  Globe,
  Edit,
  Lock,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Check,
  Star,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Language, ThemeMode, UserAccount } from '../../types';
import { AttendanceHeatmap } from './AttendanceHeatmap';
import { DashboardLangDropdown } from './DashboardLangDropdown';
import { INITIAL_ASSESSMENTS, PracticalAssessment, scoreToCompetency, avgScore } from './InstructorDashboard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';

interface StudentDashboardProps {
  currentLang: Language;
  onChangeLang: (lang: Language) => void;
  themeMode: ThemeMode;
  onChangeTheme: (mode: ThemeMode) => void;
  currentUser?: UserAccount | null;
}

type StudentTab =
  | 'overview'
  | 'profile'
  | 'program'
  | 'attendance'
  | 'grades'
  | 'transcript'
  | 'certificate'
  | 'payments'
  | 'announcements'
  | 'support';

// Mock Student Profile
const STUDENT_DATA = {
  id: 'REG-2026-005',
  fullName: 'Bethlehem Worku',
  amharicName: 'ቤተልሔም ወርቁ',
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  program: 'Professional Hair Dressing & Advanced Styling',
  amharicProgram: 'ሙያዊ የፀጉር አሰራር እና ዘመናዊ ስታይሊንግ',
  duration: '6 Months (Advanced Diploma)',
  status: 'Active Enrolled',
  regDate: 'January 10, 2026',
  shift: 'Morning Shift (8:30 AM - 12:30 PM)',
  instructor: 'Selamawit Abera (Senior Hair Artistry Master)',
  instructorPhone: '+251 91 123 4567',
  phone: '+251 91 567 8901',
  email: 'bethlehem.worku@gmail.com',
  address: 'Bole Sub-city, Woreda 03, Addis Ababa',
  emergencyContact: 'Worku Tadesse (Father) - +251 91 100 2233',
  overallAttendance: 96,
  totalUnitsCompleted: 10,
  totalUnitsCount: 12,
  gpa: '3.9 / 4.0',
  competencyStatus: 'Highly Competent',
  balance: '0 ETB',
  paidTotal: '12,000 ETB'
};

const WEEKLY_SCHEDULE = [
  { day: 'Monday', time: '8:30 AM - 10:30 AM', module: 'Hair Chemical Processing & Color Theory', room: 'Lab Studio A' },
  { day: 'Tuesday', time: '8:30 AM - 12:30 PM', module: 'Practical Hair Cutting & Salon Models Practice', room: 'Practice Salon B' },
  { day: 'Wednesday', time: '8:30 AM - 10:30 AM', module: 'Sanitation, Hygiene & Client Consultation', room: 'Theory Hall 1' },
  { day: 'Thursday', time: '8:30 AM - 12:30 PM', module: 'Advanced Weaving & Braiding Techniques', room: 'Lab Studio A' },
  { day: 'Friday', time: '9:00 AM - 12:00 PM', module: 'Live Client Assessment & COC Mock Prep', room: 'Main Studio Floor' }
];

const MODULES_LIST = [
  { id: 'MOD-101', name: 'Workplace Safety, Hygiene & Sanitation', hours: '40 Hours', status: 'Completed', score: '98%', grade: 'Highly Competent' },
  { id: 'MOD-102', name: 'Hair Science, Scalp Health & Diagnosis', hours: '30 Hours', status: 'Completed', score: '95%', grade: 'Highly Competent' },
  { id: 'MOD-103', name: 'Precision Hair Cutting & Layering', hours: '60 Hours', status: 'Completed', score: '92%', grade: 'Competent' },
  { id: 'MOD-104', name: 'Chemical Processing, Bleaching & Dyeing', hours: '70 Hours', status: 'Completed', score: '96%', grade: 'Highly Competent' },
  { id: 'MOD-105', name: 'Ethiopian Traditional & Modern Braiding', hours: '50 Hours', status: 'Completed', score: '100%', grade: 'Highly Competent' },
  { id: 'MOD-106', name: 'Bridal Hair Styling & Updos', hours: '45 Hours', status: 'In Progress', score: '90%', grade: 'Competent' },
  { id: 'MOD-107', name: 'Salon Management & Client Ethics', hours: '25 Hours', status: 'Upcoming', score: 'Pending', grade: 'Scheduled' }
];

const ATTENDANCE_HISTORY = [
  { month: 'Jan', rate: 98, practical: 100, theory: 96 },
  { month: 'Feb', rate: 95, practical: 96, theory: 94 },
  { month: 'Mar', rate: 94, practical: 95, theory: 93 },
  { month: 'Apr', rate: 97, practical: 98, theory: 96 },
  { month: 'May', rate: 96, practical: 97, theory: 95 },
  { month: 'Jun', rate: 98, practical: 100, theory: 96 },
  { month: 'Jul', rate: 95, practical: 96, theory: 94 }
];

const PAYMENT_HISTORY = [
  { id: 'REC-901', date: '2026-01-08', amount: '6,000 ETB', method: 'Telebirr', status: 'Verified & Paid', receiptUrl: '#' },
  { id: 'REC-902', date: '2026-04-05', amount: '6,000 ETB', method: 'CBO Mobile Banking', status: 'Verified & Paid', receiptUrl: '#' }
];

const ANNOUNCEMENTS = [
  { id: 'ann-1', title: 'National COC Practical Exam Registration Open', date: 'August 02, 2026', body: 'All 6-month diploma candidates eligible for government COC assessment must register at the administration desk before August 15.', category: 'Important' },
  { id: 'ann-2', title: 'Special Masterclass: Bridal Makeup Trends 2026', date: 'August 10, 2026', body: 'Guest trainer Senior Artist Tsion Abera will conduct a live demonstration in Main Hall B starting 10:00 AM.', category: 'Event' },
  { id: 'ann-3', title: 'Salon Equipment Model Day', date: 'July 28, 2026', body: 'Students can invite family models for live hair coloring and haircut practical evaluations every Friday afternoon.', category: 'Notice' }
];

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentLang,
  onChangeLang,
  themeMode,
  onChangeTheme,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<StudentTab>('overview');
  const [profilePhoto, setProfilePhoto] = useState<string>(STUDENT_DATA.photo);
  const [editPhone, setEditPhone] = useState(STUDENT_DATA.phone);
  const [editEmail, setEditEmail] = useState(STUDENT_DATA.email);
  const [uploadedReceipt, setUploadedReceipt] = useState<File | null>(null);
  const [receiptUploadSuccess, setReceiptUploadSuccess] = useState(false);
  const [inquiryText, setInquiryText] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  // Language Dictionary
  const t = {
    title: currentLang === 'en' ? 'Student Portal' : currentLang === 'am' ? 'የተማሪ ፖርታል' : 'Portal Barattootaa',
    welcome: currentLang === 'en' ? 'Welcome back' : currentLang === 'am' ? 'እንኳን ደህና መጡ' : 'Baga nagaan dhufte',
    regNo: currentLang === 'en' ? 'Reg No:' : currentLang === 'am' ? 'መለያ ቁጥር:' : 'Lakkoofsa Galmee:',
    attendanceRate: currentLang === 'en' ? 'Attendance Rate' : currentLang === 'am' ? 'የትምህርት መገኘት' : 'Hirmaannaa',
    status: currentLang === 'en' ? 'Status' : currentLang === 'am' ? 'ሁኔታ' : 'Haala',
    program: currentLang === 'en' ? 'Training Program' : currentLang === 'am' ? 'የስልጠና ፕሮግራም' : 'Sagantaa Leenjii'
  };

  // Print Transcript Handler
  const handlePrintTranscript = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Official Transcript - ${STUDENT_DATA.fullName}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; color: #111; line-height: 1.5; }
            .header { text-align: center; border-bottom: 3px double #D4AF37; padding-bottom: 15px; margin-bottom: 25px; }
            .institute { font-size: 22px; font-bold: bold; text-transform: uppercase; color: #111; letter-spacing: 1px; }
            .sub { font-size: 13px; font-family: sans-serif; color: #666; text-transform: uppercase; margin-top: 5px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-family: sans-serif; font-size: 12px; margin-bottom: 25px; border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-family: sans-serif; }
            th { background: #111; color: #D4AF37; padding: 10px; font-size: 11px; text-transform: uppercase; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #eee; font-size: 12px; }
            .footer { margin-top: 50px; display: flex; justify-content: space-between; font-family: sans-serif; font-size: 11px; }
            .seal { border-top: 1px solid #D4AF37; pt: 10px; text-align: center; color: #D4AF37; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="institute">Dare Women's & Men's Beauty Training Institute</div>
            <div class="sub">ደሬ የሴቶች እና የወንዶች የውበት ሙያ ማሰልጠኛ ተቋም</div>
            <div style="font-size: 16px; font-weight: bold; margin-top: 10px; color: #D4AF37;">OFFICIAL ACADEMIC TRANSCRIPT & PERFORMANCE REPORT</div>
          </div>

          <div class="grid">
            <div><strong>Student Name:</strong> ${STUDENT_DATA.fullName}</div>
            <div><strong>Registration ID:</strong> ${STUDENT_DATA.id}</div>
            <div><strong>Program:</strong> ${STUDENT_DATA.program}</div>
            <div><strong>Duration:</strong> ${STUDENT_DATA.duration}</div>
            <div><strong>Overall Attendance:</strong> ${STUDENT_DATA.overallAttendance}% (COC Compliant)</div>
            <div><strong>Competency Status:</strong> ${STUDENT_DATA.competencyStatus}</div>
          </div>

          <table>
            <thead>
              <tr><th>Module Code</th><th>Training Unit Module</th><th>Hours</th><th>Practical Score</th><th>Result</th></tr>
            </thead>
            <tbody>
              ${MODULES_LIST.map(m => `
                <tr>
                  <td>${m.id}</td>
                  <td><strong>${m.name}</strong></td>
                  <td>${m.hours}</td>
                  <td>${m.score}</td>
                  <td><strong>${m.grade}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer" style="margin-top: 60px;">
            <div>
              <p>___________________________</p>
              <p>Registrar Head Signature</p>
            </div>
            <div class="seal">
              <p>OFFICIAL SEAL OF DARE INSTITUTE</p>
              <p>Addis Ababa, Ethiopia</p>
            </div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;
    win.document.write(html);
    win.document.close();
  };

  // Certificate Print Handler
  const handlePrintCertificate = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${STUDENT_DATA.fullName}</title>
          <style>
            @page { size: landscape; margin: 0; }
            body { font-family: 'Georgia', serif; background: #fff; margin: 0; padding: 40px; color: #111; text-align: center; }
            .cert-box { border: 12px double #D4AF37; padding: 50px; position: relative; background: radial-gradient(circle, #ffffff 60%, #fffdf0 100%); min-height: 520px; }
            .header { font-size: 32px; font-bold: bold; text-transform: uppercase; letter-spacing: 2px; color: #111; }
            .amharic { font-size: 18px; color: #666; margin-top: 5px; }
            .award { font-size: 16px; text-transform: uppercase; letter-spacing: 3px; margin-top: 30px; color: #D4AF37; font-weight: bold; }
            .name { font-size: 38px; font-family: 'Times New Roman', serif; font-weight: bold; color: #111; margin: 20px 0; border-bottom: 2px solid #D4AF37; display: inline-block; padding: 0 30px; }
            .desc { font-size: 16px; max-width: 700px; margin: 0 auto; line-height: 1.6; color: #333; }
            .footer { margin-top: 50px; display: flex; justify-content: space-around; align-items: flex-end; }
            .sig { border-top: 1px solid #111; width: 200px; padding-top: 5px; font-size: 12px; text-transform: uppercase; font-family: sans-serif; }
            .qr { font-family: sans-serif; font-size: 10px; color: #777; border: 1px font-mono solid #ccc; padding: 8px; border-radius: 6px; }
          </style>
        </head>
        <body>
          <div class="cert-box">
            <div class="header">Dare Women's & Men's Beauty Training Institute</div>
            <div class="amharic">ደሬ የሴቶች እና የወንዶች የውበት ሙያ ማሰልጠኛ ተቋም</div>
            <div class="award">Official Vocational Qualification Certificate</div>
            
            <p style="margin-top: 25px; font-size: 14px; text-transform: uppercase; color: #555;">This is to certify that</p>
            <div class="name">${STUDENT_DATA.fullName}</div>
            
            <div class="desc">
              has successfully fulfilled all academic, practical lab requirements, and government COC competency standards in
              <br/><strong>${STUDENT_DATA.program}</strong>
              <br/>with a final grade evaluation of <strong>Pass with Distinction (${STUDENT_DATA.competencyStatus})</strong>.
            </div>

            <div class="footer">
              <div class="sig">Institute Director</div>
              <div class="qr">
                <div>VERIFICATION CODE: DARE-2026-CERT-005</div>
                <div>https://darebeauty.edu.et/verify/REG-2026-005</div>
              </div>
              <div class="sig">Lead Academic Trainer</div>
            </div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;
    win.document.write(html);
    win.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-base)]/95 backdrop-blur-md flex flex-col font-sans text-[var(--text-primary)] overflow-hidden">
      {/* Top Header Bar */}
      <header className="bg-[var(--bg-panel)] border-b border-[#E9C349]/30 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D468] text-black flex items-center justify-center font-bold font-serif text-xl shadow-lg">
            D
          </div>
          <div>
            <h1 className="text-base font-serif font-bold text-[var(--text-primary)] tracking-wide flex items-center gap-2">
              Dare Beauty Institute
              <span className="px-2 py-0.5 rounded-full bg-[#E9C349]/20 text-[#E9C349] font-mono text-[10px] font-bold uppercase border border-[#E9C349]/30">
                {t.title}
              </span>
            </h1>
            <p className="text-[11px] text-[var(--text-secondary)]">
              ደሬ የሴቶች እና የወንዶች የውበት ሙያ ማሰልጠኛ ተቋም
            </p>
          </div>
        </div>

        {/* Top Controls & Theme Switcher */}
        <div className="flex items-center space-x-3 text-xs">
          <DashboardLangDropdown currentLang={currentLang} onChangeLang={onChangeLang} />

          <button
            onClick={() => onChangeTheme(themeMode === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] transition-all border border-[var(--border-default)]"
            title="Toggle Light/Dark Theme"
          >
            {themeMode === 'light' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#E9C349]" />}
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside className="w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border-default)] flex flex-col justify-between shrink-0 overflow-y-auto p-3">
          <div className="space-y-1">
            {/* Student Mini Avatar Card */}
            <div className="p-3 mb-3 rounded-2xl bg-[var(--bg-panel)] border border-[#E9C349]/30 flex items-center space-x-3">
              <img
                src={profilePhoto}
                alt={STUDENT_DATA.fullName}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#E9C349]"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-[var(--text-primary)] truncate">{STUDENT_DATA.fullName}</div>
                <div className="text-[10px] text-[#E9C349] font-mono font-bold truncate">{STUDENT_DATA.id}</div>
              </div>
            </div>

            <div className="px-3 py-1 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest font-bold">
              Student Workspace
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Student Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('program')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'program'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>My Program & Schedule</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'attendance'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Attendance History</span>
              <span className="ml-auto font-mono text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">
                {STUDENT_DATA.overallAttendance}%
              </span>
            </button>

            <button
              onClick={() => setActiveTab('grades')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'grades'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Grades & Competency</span>
            </button>

            <button
              onClick={() => setActiveTab('transcript')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'transcript'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Official Transcript</span>
            </button>

            <button
              onClick={() => setActiveTab('certificate')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'certificate'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Digital Certificate</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'payments'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Tuition & Receipts</span>
            </button>

            <div className="pt-3 px-3 py-1 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest font-bold">
              Communication
            </div>

            <button
              onClick={() => setActiveTab('announcements')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'announcements'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Announcements</span>
              <span className="ml-auto font-mono text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-bold">
                {ANNOUNCEMENTS.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'support'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help & Support FAQ</span>
            </button>
          </div>

          <div className="pt-3 border-t border-[var(--border-default)] mt-4 text-[10px] text-[var(--text-muted)] font-mono text-center">
            Dare Institute Student Portal v2.6
          </div>
        </aside>

        {/* Right Main Content Pane */}
        <main className="flex-1 bg-[var(--bg-card)] text-[var(--text-primary)] overflow-y-auto p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[var(--bg-base)] via-[var(--bg-panel)] to-[var(--bg-base)] border border-[#E9C349]/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-5">
                  <img
                    src={profilePhoto}
                    alt={STUDENT_DATA.fullName}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#E9C349] shadow-xl shrink-0"
                  />
                  <div>
                    <div className="inline-flex items-center space-x-2 text-[#E9C349] text-xs font-mono font-bold uppercase tracking-widest mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t.welcome}, {STUDENT_DATA.fullName}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--text-primary)]">
                      {STUDENT_DATA.program}
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-2">
                      <span>{t.regNo} <strong className="text-[var(--text-primary)] font-mono">{STUDENT_DATA.id}</strong></span>
                      <span>•</span>
                      <span>{STUDENT_DATA.duration}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        {STUDENT_DATA.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Course Completion Progress Bar */}
                <div className="w-full md:w-64 bg-black/50 p-4 rounded-2xl border border-[var(--border-default)] shrink-0">
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-[var(--text-secondary)]">Syllabus Completion</span>
                    <span className="text-[#E9C349] font-bold">83%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#D4AF37] to-[#E9C349] h-full w-[83%]" />
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-2 text-right">
                    10 of 12 Practical Modules Finished
                  </p>
                </div>
              </div>

              {/* Core Metric Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)]">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-bold">Overall Attendance</span>
                  <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">{STUDENT_DATA.overallAttendance}%</div>
                  <span className="text-[10px] text-emerald-400 font-bold">✔ Exceeds 75% COC Minimum</span>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)]">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-bold">Competency Badge</span>
                  <div className="text-lg font-bold text-[#E9C349] mt-1 flex items-center space-x-1">
                    <span>🥇 Highly Competent</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-secondary)]">Average Grade: 96%</span>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)]">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-bold">Tuition Fee Status</span>
                  <div className="text-xl font-mono font-bold text-emerald-400 mt-1">FULLY PAID</div>
                  <span className="text-[10px] text-[var(--text-secondary)]">12,000 ETB Settled</span>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)]">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-bold">Lead Instructor</span>
                  <div className="text-sm font-bold text-[var(--text-primary)] mt-1 truncate">{STUDENT_DATA.instructor}</div>
                  <span className="text-[10px] text-[#E9C349]">{STUDENT_DATA.instructorPhone}</span>
                </div>
              </div>

              {/* Schedule & Announcements Dual Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Weekly Schedule */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center justify-between">
                    <span>Weekly Class & Lab Schedule</span>
                    <button onClick={() => setActiveTab('program')} className="text-xs text-[#E9C349] hover:underline">View Full Details</button>
                  </h3>

                  <div className="space-y-2.5">
                    {WEEKLY_SCHEDULE.map((item, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="text-xs font-bold text-[#E9C349]">{item.day} • {item.time}</div>
                          <div className="text-xs font-semibold text-[var(--text-primary)] mt-0.5">{item.module}</div>
                        </div>
                        <span className="px-2.5 py-1 rounded-xl bg-white/5 text-[var(--text-secondary)] font-mono text-[10px] shrink-0">
                          {item.room}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Announcements Widget */}
                <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center justify-between">
                    <span>Institute Notices</span>
                    <Bell className="w-4 h-4 text-[#E9C349]" />
                  </h3>

                  <div className="space-y-3">
                    {ANNOUNCEMENTS.map(a => (
                      <div key={a.id} className="p-3.5 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-subtle)] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-[#E9C349]/20 text-[#E9C349] text-[9px] font-mono font-bold">
                            {a.category}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-muted)]">{a.date}</span>
                        </div>
                        <h4 className="text-xs font-bold text-[var(--text-primary)]">{a.title}</h4>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-snug line-clamp-2">{a.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-6">
                <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Student Profile Settings</h2>

                {/* Avatar change */}
                <div className="flex items-center space-x-5">
                  <img src={profilePhoto} alt="Student Avatar" className="w-20 h-20 rounded-2xl object-cover border-2 border-[#E9C349]" />
                  <div className="space-y-2">
                    <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#E9C349] text-black font-bold text-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setProfilePhoto(URL.createObjectURL(e.target.files[0]));
                          }
                        }}
                      />
                    </label>
                    <p className="text-[10px] text-[var(--text-secondary)]">Allowed formats: JPG, PNG. Max 2MB.</p>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[var(--text-secondary)] font-mono text-[10px] uppercase">Full Name (English)</label>
                    <input type="text" readOnly value={STUDENT_DATA.fullName} className="w-full mt-1 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)]" />
                  </div>
                  <div>
                    <label className="text-[var(--text-secondary)] font-mono text-[10px] uppercase">Full Name (Amharic)</label>
                    <input type="text" readOnly value={STUDENT_DATA.amharicName} className="w-full mt-1 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] font-serif" />
                  </div>
                  <div>
                    <label className="text-[var(--text-secondary)] font-mono text-[10px] uppercase">Phone Number</label>
                    <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349]" />
                  </div>
                  <div>
                    <label className="text-[var(--text-secondary)] font-mono text-[10px] uppercase">Email Address</label>
                    <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349]" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[var(--text-secondary)] font-mono text-[10px] uppercase">Residential Address</label>
                    <input type="text" readOnly value={STUDENT_DATA.address} className="w-full mt-1 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)]" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[var(--text-secondary)] font-mono text-[10px] uppercase">Emergency Contact Person</label>
                    <input type="text" readOnly value={STUDENT_DATA.emergencyContact} className="w-full mt-1 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)]" />
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-default)] flex justify-end">
                  <button onClick={() => alert('Profile contact info saved!')} className="px-5 py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:brightness-110">
                    Save Profile Updates
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROGRAM */}
          {activeTab === 'program' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-default)] pb-4">
                  <div>
                    <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">{STUDENT_DATA.program}</h2>
                    <p className="text-xs text-[var(--text-secondary)]">{STUDENT_DATA.duration} • Enrolled on {STUDENT_DATA.regDate}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#E9C349]/20 text-[#E9C349] font-mono text-xs font-bold">
                    Shift: {STUDENT_DATA.shift}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[var(--text-primary)] pt-2">Syllabus Training Units / Practical Modules</h3>
                <div className="divide-y divide-[var(--border-subtle)]">
                  {MODULES_LIST.map((m) => (
                    <div key={m.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className={`w-4 h-4 ${m.status === 'Completed' ? 'text-emerald-400' : 'text-[var(--text-muted)]'}`} />
                        <div>
                          <div className="font-bold text-[var(--text-primary)]">{m.name}</div>
                          <div className="text-[10px] text-[var(--text-secondary)] font-mono">{m.id} • {m.hours}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-[#E9C349]">{m.score}</span>
                        <div className="text-[10px] text-[var(--text-secondary)]">{m.grade}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              {/* GitHub-Style Attendance Heatmap Component */}
              <AttendanceHeatmap
                currentLang={currentLang}
                themeMode={themeMode}
                selectedStudentId={currentUser?.fullName?.includes('Helen') ? 'ST-2026-012' : currentUser?.fullName?.includes('Eyerus') ? 'ST-2026-034' : currentUser?.fullName?.includes('Dawit') ? 'ST-2026-089' : 'ST-2026-005'}
                isEmbedded={true}
                role="student"
              />

              <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Monthly Comparison & COC Eligibility</h2>
                    <p className="text-xs text-[var(--text-secondary)]">Ethiopian TVET minimum threshold requires 75% practical lab attendance.</p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-2xl font-bold text-emerald-400">{STUDENT_DATA.overallAttendance}%</span>
                    <div className="text-[10px] text-[var(--text-secondary)]">Cumulative Rate</div>
                  </div>
                </div>

                {/* Recharts Attendance Bar Chart */}
                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ATTENDANCE_HISTORY}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="month" stroke="#888" fontSize={11} />
                      <YAxis domain={[60, 100]} stroke="#888" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#E9C349', borderRadius: '12px' }} />
                      <Bar dataKey="practical" name="Practical Lab Attendance" fill="#E9C349" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="theory" name="Theory Class Attendance" fill="#D4AF37" opacity={0.6} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GRADES */}
          {activeTab === 'grades' && (() => {
            // Find this student's assessments from the instructor's records
            const myAssessments = INITIAL_ASSESSMENTS
              .filter(a => a.studentId === STUDENT_DATA.id)
              .sort((a, b) => b.date.localeCompare(a.date));
            const avg = myAssessments.length ? avgScore(myAssessments) : 0;
            const comp = scoreToCompetency(avg);

            return (
              <div className="space-y-6">

                {/* ── Overall summary cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {([
                    { emoji: '🥇', label: 'Highly Competent', range: '90% – 100%', active: comp === 'Highly Competent' },
                    { emoji: '🥈', label: 'Competent',        range: '75% – 89%',  active: comp === 'Competent' },
                    { emoji: '🥉', label: 'Developing',       range: 'Below 75%',  active: comp === 'Developing Competence' },
                  ] as const).map(c => (
                    <div key={c.label} className={`p-4 rounded-2xl border text-center transition-all ${
                      c.active
                        ? 'border-[#E9C349]/50 bg-[#E9C349]/10'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-glass)] opacity-50'
                    }`}>
                      <div className="text-2xl mb-1">{c.emoji}</div>
                      <div className={`text-xs font-bold ${c.active ? 'text-[#E9C349]' : 'text-[var(--text-secondary)]'}`}>{c.label}</div>
                      <p className="text-[10px] text-[var(--text-muted)] mt-1">{c.range}</p>
                    </div>
                  ))}
                </div>

                {/* ── Instructor-graded practical assessments ── */}
                <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Practical Assessment Results</h2>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        Scores recorded by your instructor — read only.
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-2xl font-mono font-bold ${avg >= 90 ? 'text-emerald-400' : avg >= 75 ? 'text-[#E9C349]' : 'text-red-400'}`}>
                        {myAssessments.length ? avg : '—'}%
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono">avg · {myAssessments.length} assessments</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {myAssessments.length > 0 && (
                    <div className="space-y-1">
                      <div className="w-full h-2 rounded-full bg-[var(--bg-glass)] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${avg >= 90 ? 'bg-emerald-400' : avg >= 75 ? 'bg-[#E9C349]' : 'bg-red-400'}`}
                          style={{ width: `${avg}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
                        <span>0%</span>
                        <span className="text-amber-400">75% COC minimum</span>
                        <span>100%</span>
                      </div>
                    </div>
                  )}

                  {myAssessments.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="text-3xl mb-2">📋</div>
                      <p className="text-sm text-[var(--text-muted)]">No assessments recorded yet.</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Your instructor will add scores after each practical session.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-[var(--border-default)] text-[var(--text-muted)] font-mono text-[10px] uppercase">
                            <th className="py-2.5 px-3">Unit / Module</th>
                            <th className="py-2.5 px-3">Date</th>
                            <th className="py-2.5 px-3 text-center">Score</th>
                            <th className="py-2.5 px-3 text-center">Result</th>
                            <th className="py-2.5 px-3 hidden md:table-cell">Instructor Notes</th>
                            <th className="py-2.5 px-3 hidden sm:table-cell">Graded By</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-subtle)]">
                          {myAssessments.map(a => {
                            const pct = Math.round((a.score / a.maxScore) * 100);
                            const badgeClass =
                              pct >= 90 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                              pct >= 75 ? 'bg-[#E9C349]/10 text-[#E9C349] border-[#E9C349]/30' :
                                          'bg-red-500/10 text-red-400 border-red-500/30';
                            const barColor = pct >= 90 ? 'bg-emerald-400' : pct >= 75 ? 'bg-[#E9C349]' : 'bg-red-400';
                            const textColor = pct >= 90 ? 'text-emerald-400' : pct >= 75 ? 'text-[#E9C349]' : 'text-red-400';
                            return (
                              <tr key={a.id} className="hover:bg-[var(--bg-glass)] transition-colors">
                                <td className="py-3 px-3 font-semibold text-[var(--text-primary)] max-w-[200px]">
                                  <div className="truncate">{a.unit}</div>
                                </td>
                                <td className="py-3 px-3 font-mono text-[var(--text-secondary)] whitespace-nowrap">{a.date}</td>
                                <td className="py-3 px-3 text-center">
                                  <div className="flex flex-col items-center gap-1">
                                    <span className={`font-mono font-bold text-sm ${textColor}`}>
                                      {a.score}<span className="text-[10px] text-[var(--text-muted)]">/{a.maxScore}</span>
                                    </span>
                                    <div className="w-14 h-1.5 rounded-full bg-[var(--bg-glass)] overflow-hidden">
                                      <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${badgeClass}`}>
                                    {scoreToCompetency(pct)}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-[var(--text-muted)] hidden md:table-cell max-w-[220px]">
                                  <span className="italic text-[11px] line-clamp-2">{a.notes || '—'}</span>
                                </td>
                                <td className="py-3 px-3 text-[var(--text-secondary)] hidden sm:table-cell text-[11px] whitespace-nowrap">
                                  {a.gradedBy}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* ── Programme module grades (existing static data) ── */}
                <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4">
                  <h3 className="text-base font-bold font-serif text-[var(--text-primary)]">Programme Module Scores</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Academic scores across all syllabus training units.</p>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[var(--border-default)] text-[#E9C349] font-mono text-[10px] uppercase">
                        <th className="py-2">Module Code</th>
                        <th className="py-2">Module Name</th>
                        <th className="py-2">Practical Score</th>
                        <th className="py-2">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)]">
                      {MODULES_LIST.map(m => (
                        <tr key={m.id}>
                          <td className="py-3 font-mono text-[#E9C349] font-bold">{m.id}</td>
                          <td className="py-3 font-semibold text-[var(--text-primary)]">{m.name}</td>
                          <td className="py-3 font-mono font-bold text-[var(--text-primary)]">{m.score}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              m.grade === 'Highly Competent' ? 'bg-emerald-500/20 text-emerald-400' :
                              m.grade === 'Competent'        ? 'bg-[#E9C349]/20 text-[#E9C349]' :
                              m.grade === 'Scheduled'        ? 'bg-[var(--bg-glass)] text-[var(--text-muted)]' :
                                                              'bg-red-500/20 text-red-400'
                            }`}>
                              {m.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            );
          })()}

          {/* TAB 6: TRANSCRIPT */}
          {activeTab === 'transcript' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Official Academic Transcript</h2>
                    <p className="text-xs text-[var(--text-secondary)]">Generated transcript for TVET government accreditation and COC verification.</p>
                  </div>

                  <button
                    onClick={handlePrintTranscript}
                    className="px-4 py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs flex items-center space-x-2 hover:brightness-110"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Transcript</span>
                  </button>
                </div>

                {/* Printable Transcript Frame */}
                <div className="p-8 rounded-2xl bg-white text-black font-sans shadow-2xl border-4 border-[#D4AF37]/40 space-y-6">
                  <div className="text-center border-b-2 border-[#D4AF37] pb-4">
                    <h3 className="text-xl font-serif font-bold uppercase tracking-wider text-black">
                      Dare Women's & Men's Beauty Training Institute
                    </h3>
                    <p className="text-xs text-gray-600 font-serif italic">ደሬ የሴቶች እና የወንዶች የውበት ሙያ ማሰልጠኛ ተቋም</p>
                    <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mt-2">
                      Academic Performance Transcript
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div><strong>Student Name:</strong> {STUDENT_DATA.fullName}</div>
                    <div><strong>Registration ID:</strong> {STUDENT_DATA.id}</div>
                    <div><strong>Program:</strong> {STUDENT_DATA.program}</div>
                    <div><strong>Overall Attendance:</strong> {STUDENT_DATA.overallAttendance}%</div>
                  </div>

                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-black text-[#D4AF37]">
                        <th className="p-2">Code</th>
                        <th className="p-2">Module Title</th>
                        <th className="p-2">Hours</th>
                        <th className="p-2">Score</th>
                        <th className="p-2">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MODULES_LIST.map(m => (
                        <tr key={m.id} className="border-b border-gray-200">
                          <td className="p-2 font-mono font-bold">{m.id}</td>
                          <td className="p-2">{m.name}</td>
                          <td className="p-2">{m.hours}</td>
                          <td className="p-2 font-bold">{m.score}</td>
                          <td className="p-2 font-bold">{m.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="pt-8 flex justify-between items-end text-xs text-gray-600">
                    <div>
                      <p className="border-t border-black pt-1 w-48 font-bold">Registrar General</p>
                    </div>
                    <div className="text-center text-[10px] text-[#D4AF37] font-bold border border-[#D4AF37] p-2 rounded">
                      OFFICIAL SEAL OF DARE INSTITUTE
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: CERTIFICATE */}
          {activeTab === 'certificate' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Digital Vocational Qualification Certificate</h2>
                    <p className="text-xs text-[var(--text-secondary)]">Official diploma issued upon completion of 6-month advanced training track.</p>
                  </div>

                  <button
                    onClick={handlePrintCertificate}
                    className="px-4 py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs flex items-center space-x-2 hover:brightness-110"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Certificate</span>
                  </button>
                </div>

                {/* Digital Certificate Preview Card */}
                <div className="p-10 rounded-3xl bg-gradient-to-b from-[var(--bg-base)] to-[var(--bg-card)] border-8 border-double border-[#D4AF37] text-center space-y-6 relative overflow-hidden shadow-2xl">
                  <div className="text-[#E9C349] font-mono text-xs uppercase tracking-widest font-bold">
                    Vocational Diploma Certification
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] tracking-wide">
                    Dare Women's & Men's Beauty Institute
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">This is to certify that</p>

                  <div className="text-2xl sm:text-4xl font-serif font-bold text-[#E9C349] border-b-2 border-[#E9C349] inline-block px-8 py-2">
                    {STUDENT_DATA.fullName}
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
                    has successfully fulfilled all course requirements, practical studio lab evaluations, and COC competency standards in
                    <br/><strong className="text-[var(--text-primary)] text-sm">{STUDENT_DATA.program}</strong>
                  </p>

                  {/* Verification QR section */}
                  <div className="pt-6 border-t border-[var(--border-default)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
                    <div className="flex items-center space-x-3 text-left">
                      <div className="p-2 rounded-xl bg-white text-black">
                        <QrCode className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="font-mono text-[#E9C349] font-bold text-[10px]">VERIFICATION CODE</div>
                        <div className="font-mono text-[var(--text-primary)] text-xs">DARE-2026-CERT-005</div>
                      </div>
                    </div>

                    <div className="font-serif text-[#D4AF37] font-bold italic">
                      Verified & Accredited by Ethiopian TVET Authority
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Tuition & Payment Receipts</h2>
                    <p className="text-xs text-[var(--text-secondary)]">Track tuition installments and upload transfer payment receipts.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-[var(--text-secondary)] uppercase">Outstanding Balance:</span>
                    <div className="text-xl font-mono font-bold text-emerald-400">{STUDENT_DATA.balance}</div>
                  </div>
                </div>

                {/* Upload Receipt Modal Box */}
                <div className="p-5 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-subtle)] space-y-3">
                  <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-[#E9C349]" />
                    <span>Submit Payment Receipt Screenshot</span>
                  </h3>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="cursor-pointer flex-1 w-full p-3 rounded-xl bg-white/5 border border-dashed border-[#E9C349]/50 text-center text-xs text-[var(--text-secondary)] hover:bg-white/10">
                      <Upload className="w-4 h-4 mx-auto mb-1 text-[#E9C349]" />
                      <span>{uploadedReceipt ? uploadedReceipt.name : 'Click to upload screenshot (Telebirr, CBE Birr, Bank Transfer)'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setUploadedReceipt(e.target.files[0]);
                          }
                        }}
                      />
                    </label>

                    <button
                      onClick={() => {
                        if (uploadedReceipt) {
                          setReceiptUploadSuccess(true);
                          setTimeout(() => setReceiptUploadSuccess(false), 5000);
                        }
                      }}
                      className="px-5 py-3 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:brightness-110 shrink-0 w-full sm:w-auto"
                    >
                      Submit Receipt
                    </button>
                  </div>

                  {receiptUploadSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Receipt submitted successfully! Finance department will review within 24 hours.</span>
                    </div>
                  )}
                </div>

                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border-default)] text-[#E9C349] font-mono text-[10px] uppercase">
                      <th className="py-2">Receipt No</th>
                      <th className="py-2">Date</th>
                      <th className="py-2">Amount Paid</th>
                      <th className="py-2">Payment Method</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {PAYMENT_HISTORY.map(p => (
                      <tr key={p.id}>
                        <td className="py-3 font-mono font-bold text-[#E9C349]">{p.id}</td>
                        <td className="py-3 text-[var(--text-secondary)] font-mono">{p.date}</td>
                        <td className="py-3 font-mono font-bold text-[var(--text-primary)]">{p.amount}</td>
                        <td className="py-3 text-[var(--text-secondary)]">{p.method}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4">
                <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Institute Announcements & Notices</h2>

                <div className="space-y-4">
                  {ANNOUNCEMENTS.map(a => (
                    <div key={a.id} className="p-5 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-subtle)] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full bg-[#E9C349]/20 text-[#E9C349] font-mono text-xs font-bold">
                          {a.category}
                        </span>
                        <span className="text-xs font-mono text-[var(--text-secondary)]">{a.date}</span>
                      </div>
                      <h3 className="text-base font-bold text-[var(--text-primary)]">{a.title}</h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{a.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: HELP & SUPPORT */}
          {activeTab === 'support' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-6">
                <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Student Support & Inquiry Desk</h2>

                <div className="space-y-3 text-xs">
                  <label className="text-[var(--text-secondary)] font-mono uppercase text-[10px]">Submit an Inquiry to Registrar</label>
                  <textarea
                    rows={4}
                    placeholder="Type your question regarding schedules, transcripts, or COC exams..."
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349]"
                  />
                  <button
                    onClick={() => {
                      if (inquiryText) {
                        setInquirySent(true);
                        setInquiryText('');
                        setTimeout(() => setInquirySent(false), 4000);
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:brightness-110"
                  >
                    Send Inquiry
                  </button>

                  {inquirySent && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                      Your inquiry has been submitted! Registrar staff will reply shortly.
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-[var(--border-default)] space-y-3">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">Frequently Asked Questions</h3>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-black/40">
                      <div className="font-bold text-[#E9C349]">How do I register for the government COC exam?</div>
                      <p className="text-[var(--text-secondary)] mt-1">Registrations open 3 weeks prior to course end date. Bring your national ID and 2 photos to the administration desk.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40">
                      <div className="font-bold text-[#E9C349]">What happens if my attendance drops below 75%?</div>
                      <p className="text-[var(--text-secondary)] mt-1">Students falling below 75% lab attendance must complete makeup practical lab sessions before certificate issuance.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
