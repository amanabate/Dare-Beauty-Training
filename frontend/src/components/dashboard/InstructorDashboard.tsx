'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserCheck,
  User,
  BookOpen,
  CalendarCheck,
  Award,
  Bell,
  HelpCircle,
  X,
  Plus,
  CheckCircle2,
  Clock,
  Download,
  Printer,
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
  Search,
  CheckSquare,
  XSquare,
  Send,
  BarChart3,
  Calendar,
  Users
} from 'lucide-react';
import { Language, ThemeMode, UserAccount } from '../../types';
import { exportToCSV } from '../../utils/exportUtils';
import { AttendanceHeatmap } from './AttendanceHeatmap';
import { DashboardLangDropdown } from './DashboardLangDropdown';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface InstructorDashboardProps {
  currentLang: Language;
  onChangeLang: (lang: Language) => void;
  themeMode: ThemeMode;
  onChangeTheme: (mode: ThemeMode) => void;
  currentUser?: UserAccount | null;
}

type InstructorTab =
  | 'overview'
  | 'profile'
  | 'schedule'
  | 'students'
  | 'attendance'
  | 'grades'
  | 'programs'
  | 'certification'
  | 'announcements'
  | 'reports'
  | 'support';

// Initial Mock Datasets for Instructor
const INSTRUCTOR_DATA = {
  id: 'INS-101',
  name: 'Selamawit Abera',
  amharicName: 'ሰላማዊት አበራ',
  title: 'Senior Hair Artistry Master Trainer & TVET Assessor',
  photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
  assignedCourses: ['Hair Dressing & Styling (3 Months)', 'Advanced Hair Artistry & Color (6 Months)'],
  totalStudents: 120,
  pendingAttendance: 1, // Today morning session
  pendingGrades: 4, // Modules waiting for practical score
  experience: '8 Years Practical Salon & Training Experience',
  phone: '+251 91 777 8899',
  email: 'selamawit.abera@darebeauty.edu.et',
  officeRoom: 'Faculty Hub A - Studio 3'
};

// ─── Practical Assessment Types ───────────────────────────────────────────────

export interface PracticalAssessment {
  id: string;
  studentId: string;
  unit: string;          // e.g. "Hair Cutting & Blowdry"
  date: string;          // YYYY-MM-DD
  score: number;         // 0–100
  maxScore: number;      // default 100
  notes: string;
  gradedBy: string;      // instructor name
}

const ASSESSMENT_UNITS = [
  'Safety, Sanitation & Hygiene Protocols',
  'Professional Hair Cutting & Blowdry Techniques',
  'Chemical Processing, Dyeing & Weaving',
  'Client Care & Beauty Salon Ethics',
  'Scalp Treatment & Keratin Infusion',
  'Advanced Braid Artistry & Extensions',
  'Bridal & Special Occasion Styling',
  'Mock COC Practical Examination',
];

type CompetencyLevel = 'Highly Competent' | 'Competent' | 'Developing Competence';

export function scoreToCompetency(score: number): CompetencyLevel {
  if (score >= 90) return 'Highly Competent';
  if (score >= 75) return 'Competent';
  return 'Developing Competence';
}

export function avgScore(assessments: PracticalAssessment[]): number {
  if (!assessments.length) return 0;
  return Math.round(assessments.reduce((s, a) => s + a.score, 0) / assessments.length);
}

// Seed: 2–3 pre-existing assessments per student
export const INITIAL_ASSESSMENTS: PracticalAssessment[] = [
  // REG-2026-001 Abebe
  { id: 'asmnt-001-1', studentId: 'REG-2026-001', unit: 'Safety, Sanitation & Hygiene Protocols',           date: '2026-07-10', score: 88, maxScore: 100, notes: 'Good hygiene awareness, minor lapses on autoclave protocol.', gradedBy: 'Selamawit Abera' },
  { id: 'asmnt-001-2', studentId: 'REG-2026-001', unit: 'Professional Hair Cutting & Blowdry Techniques',   date: '2026-07-24', score: 92, maxScore: 100, notes: 'Excellent blowdry finish. Scissor angle needs consistency.', gradedBy: 'Selamawit Abera' },
  // REG-2026-002 Tigist
  { id: 'asmnt-002-1', studentId: 'REG-2026-002', unit: 'Client Care & Beauty Salon Ethics',                date: '2026-07-12', score: 96, maxScore: 100, notes: 'Outstanding client consultation and professional manner.', gradedBy: 'Selamawit Abera' },
  { id: 'asmnt-002-2', studentId: 'REG-2026-002', unit: 'Advanced Braid Artistry & Extensions',            date: '2026-07-28', score: 97, maxScore: 100, notes: 'Exceptional extension work. Highly recommended for COC.', gradedBy: 'Selamawit Abera' },
  // REG-2026-003 Chala
  { id: 'asmnt-003-1', studentId: 'REG-2026-003', unit: 'Safety, Sanitation & Hygiene Protocols',           date: '2026-07-11', score: 68, maxScore: 100, notes: 'Needs improvement in tool sterilisation procedures.', gradedBy: 'Selamawit Abera' },
  { id: 'asmnt-003-2', studentId: 'REG-2026-003', unit: 'Chemical Processing, Dyeing & Weaving',           date: '2026-07-25', score: 72, maxScore: 100, notes: 'Timing errors in relaxer neutralisation. Retake recommended.', gradedBy: 'Selamawit Abera' },
  // REG-2026-004 Selam
  { id: 'asmnt-004-1', studentId: 'REG-2026-004', unit: 'Professional Hair Cutting & Blowdry Techniques',   date: '2026-07-15', score: 89, maxScore: 100, notes: 'Clean layered cut. Blowdry tension slightly uneven.', gradedBy: 'Selamawit Abera' },
  { id: 'asmnt-004-2', studentId: 'REG-2026-004', unit: 'Scalp Treatment & Keratin Infusion',              date: '2026-07-30', score: 91, maxScore: 100, notes: 'Very thorough scalp analysis. Product application well-timed.', gradedBy: 'Selamawit Abera' },
  // REG-2026-005 Bethlehem
  { id: 'asmnt-005-1', studentId: 'REG-2026-005', unit: 'Bridal & Special Occasion Styling',               date: '2026-07-18', score: 99, maxScore: 100, notes: 'Near-perfect bridal updo. Model feedback was outstanding.', gradedBy: 'Selamawit Abera' },
  { id: 'asmnt-005-2', studentId: 'REG-2026-005', unit: 'Mock COC Practical Examination',                  date: '2026-08-01', score: 97, maxScore: 100, notes: 'Passed COC mock with distinction. Highest in cohort.', gradedBy: 'Selamawit Abera' },
  // REG-2026-008 Dawit
  { id: 'asmnt-008-1', studentId: 'REG-2026-008', unit: 'Safety, Sanitation & Hygiene Protocols',           date: '2026-07-10', score: 65, maxScore: 100, notes: 'Missed disinfection steps. Needs supervised repeat.', gradedBy: 'Selamawit Abera' },
  { id: 'asmnt-008-2', studentId: 'REG-2026-008', unit: 'Chemical Processing, Dyeing & Weaving',           date: '2026-07-26', score: 70, maxScore: 100, notes: 'Product mixing ratio off. Additional lab session assigned.', gradedBy: 'Selamawit Abera' },
];

const INITIAL_ASSIGNED_STUDENTS = [
  { id: 'REG-2026-001', name: 'Abebe Kebede', course: 'Hair Dressing & Styling', shift: 'Morning', attendanceRate: 88, competency: 'Competent', todayAttendance: 'Present', lastGrade: 92 },
  { id: 'REG-2026-002', name: 'Tigist Haile', course: 'Makeup Artistry', shift: 'Morning', attendanceRate: 94, competency: 'Highly Competent', todayAttendance: 'Present', lastGrade: 96 },
  { id: 'REG-2026-003', name: 'Chala Bekele', course: 'Barbering & Grooming', shift: 'Afternoon', attendanceRate: 68, competency: 'Developing Competence', todayAttendance: 'Absent', lastGrade: 70 },
  { id: 'REG-2026-004', name: 'Selam Alemu', course: 'Nail Care Technology', shift: 'Morning', attendanceRate: 91, competency: 'Competent', todayAttendance: 'Present', lastGrade: 89 },
  { id: 'REG-2026-005', name: 'Bethlehem Worku', course: 'Hair Dressing & Styling', shift: 'Morning', attendanceRate: 98, competency: 'Highly Competent', todayAttendance: 'Present', lastGrade: 98 },
  { id: 'REG-2026-008', name: 'Dawit Tadesse', course: 'Barbering & Grooming', shift: 'Weekend', attendanceRate: 64, competency: 'Developing Competence', todayAttendance: 'Late', lastGrade: 68 }
];

const TODAY_CLASSES = [
  { time: '08:30 AM - 10:30 AM', program: 'Hair Chemical Processing & Color Theory', room: 'Lab Studio A', shift: 'Morning', studentCount: 28, attendanceTaken: true },
  { time: '11:00 AM - 01:00 PM', program: 'Precision Cutting & Styling Practical Lab', room: 'Practice Salon B', shift: 'Morning', studentCount: 32, attendanceTaken: false },
  { time: '02:00 PM - 04:30 PM', program: 'Advanced Weaving & Model Evaluations', room: 'Main Studio Floor', shift: 'Afternoon', studentCount: 25, attendanceTaken: false }
];

const WEEKLY_TIMETABLE = [
  { day: 'Monday', morning: 'Hair Chemical Theory (Lab A)', afternoon: 'Salon Safety & Hygiene (Hall 1)', evening: 'Free / Consultations' },
  { day: 'Tuesday', morning: 'Precision Hair Cutting Lab B', afternoon: 'Bridal Updo Styling (Studio A)', evening: 'Retake Assessments' },
  { day: 'Wednesday', morning: 'Traditional Ethiopian Braiding', afternoon: 'Client Diagnosis & Scalp Care', evening: 'Staff Academic Sync' },
  { day: 'Thursday', morning: 'Chemical Color Processing', afternoon: 'Live Model Evaluation Floor', evening: 'Lab Prep' },
  { day: 'Friday', morning: 'Mock COC Practical Exam Prep', afternoon: 'Faculty Grading Session', evening: 'Weekend Class Prep' }
];

const ANNOUNCEMENTS_LIST = [
  { id: 'ann-1', title: 'COC Assessment Practical Checklist Submission', date: 'August 04, 2026', body: 'All instructors must upload practical competency scores for 6-month candidates before Friday 5:00 PM.' },
  { id: 'ann-2', title: 'Faculty Development Workshop', date: 'August 01, 2026', body: 'Quarterly training on modern organic dye formulations and salon sanitation guidelines in Conference Room B.' }
];

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  currentLang,
  onChangeLang,
  themeMode,
  onChangeTheme,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<InstructorTab>('overview');
  const [studentsList, setStudentsList] = useState(INITIAL_ASSIGNED_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState('All');
  
  // ── Grade management state ────────────────────────────────────────────────────
  const [assessments, setAssessments] = useState<PracticalAssessment[]>(INITIAL_ASSESSMENTS);
  const [gradeTab, setGradeTab] = useState<'roster' | 'detail'>('roster');
  const [gradingStudentId, setGradingStudentId] = useState<string | null>(null);
  const [gradeSearchTerm, setGradeSearchTerm] = useState('');

  // Add / Edit modal
  type AssessmentFormState = {
    id: string | null;        // null = new
    unit: string;
    date: string;
    score: string;
    maxScore: string;
    notes: string;
  };
  const EMPTY_FORM: AssessmentFormState = {
    id: null,
    unit: ASSESSMENT_UNITS[0],
    date: new Date().toISOString().slice(0, 10),
    score: '',
    maxScore: '100',
    notes: '',
  };
  const [assessmentModal, setAssessmentModal] = useState<{ open: boolean; form: AssessmentFormState }>({
    open: false,
    form: EMPTY_FORM,
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Grading Modal / State (legacy — kept for backward compat with other tabs)
  const [selectedStudentForGrading, setSelectedStudentForGrading] = useState<typeof INITIAL_ASSIGNED_STUDENTS[0] | null>(null);
  const [gradeScoreInput, setGradeScoreInput] = useState('');
  const [gradeCompetencyInput, setGradeCompetencyInput] = useState<CompetencyLevel>('Highly Competent');
  
  // Post Notice state
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeBody, setNewNoticeBody] = useState('');
  const [postedNotices, setPostedNotices] = useState<{ id: string; title: string; body: string; date: string }[]>([]);

  // Recommendation state
  const [recommendedStudents, setRecommendedStudents] = useState<string[]>(['REG-2026-005', 'REG-2026-002']);

  // ── Assessment handlers ───────────────────────────────────────────────────────

  // Sync studentsList grades whenever assessments change
  const syncStudentGrades = (updated: PracticalAssessment[]) => {
    setStudentsList(prev => prev.map(s => {
      const mine = updated.filter(a => a.studentId === s.id);
      if (!mine.length) return s;
      const avg = avgScore(mine);
      return { ...s, lastGrade: avg, competency: scoreToCompetency(avg) };
    }));
  };

  const handleOpenAddAssessment = (studentId: string) => {
    setAssessmentModal({
      open: true,
      form: { ...EMPTY_FORM, id: null },
    });
    setGradingStudentId(studentId);
  };

  const handleOpenEditAssessment = (a: PracticalAssessment) => {
    setAssessmentModal({
      open: true,
      form: {
        id: a.id,
        unit: a.unit,
        date: a.date,
        score: String(a.score),
        maxScore: String(a.maxScore),
        notes: a.notes,
      },
    });
    setGradingStudentId(a.studentId);
  };

  const handleSaveAssessment = () => {
    const { id, unit, date, score, maxScore, notes } = assessmentModal.form;
    const numScore = Math.min(100, Math.max(0, Number(score)));
    const numMax   = Math.max(1, Number(maxScore) || 100);
    if (!unit || !date || score === '') return;

    let updated: PracticalAssessment[];
    if (id) {
      // Edit existing
      updated = assessments.map(a =>
        a.id === id
          ? { ...a, unit, date, score: numScore, maxScore: numMax, notes }
          : a
      );
    } else {
      // Add new
      const newAssessment: PracticalAssessment = {
        id: `asmnt-${Date.now()}`,
        studentId: gradingStudentId!,
        unit,
        date,
        score: numScore,
        maxScore: numMax,
        notes,
        gradedBy: INSTRUCTOR_DATA.name,
      };
      updated = [...assessments, newAssessment];
    }

    setAssessments(updated);
    syncStudentGrades(updated);
    setAssessmentModal({ open: false, form: EMPTY_FORM });
  };

  const handleDeleteAssessment = (id: string) => {
    const updated = assessments.filter(a => a.id !== id);
    setAssessments(updated);
    syncStudentGrades(updated);
    setDeleteConfirmId(null);
  };

  const handleFormChange = (field: keyof typeof EMPTY_FORM, value: string) => {
    setAssessmentModal(prev => ({ ...prev, form: { ...prev.form, [field]: value } }));
  };

  // Search filtered list
  const filteredStudents = studentsList.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchShift = selectedShiftFilter === 'All' || s.shift === selectedShiftFilter;
    return matchSearch && matchShift;
  });

  // Action handlers
  const handleMarkAttendance = (id: string, status: 'Present' | 'Absent' | 'Late') => {
    setStudentsList(prev => prev.map(s => s.id === id ? { ...s, todayAttendance: status } : s));
  };

  const handleSaveGrade = () => {
    // Legacy handler kept for any remaining references — new grade system uses handleSaveAssessment
    setSelectedStudentForGrading(null);
  };

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeBody) return;
    setPostedNotices(prev => [{
      id: `notice-${Date.now()}`,
      title: newNoticeTitle,
      body: newNoticeBody,
      date: 'Just now'
    }, ...prev]);
    setNewNoticeTitle('');
    setNewNoticeBody('');
    alert('Notice broadcasted to all assigned students!');
  };

  const toggleRecommendation = (id: string) => {
    if (recommendedStudents.includes(id)) {
      setRecommendedStudents(prev => prev.filter(item => item !== id));
    } else {
      setRecommendedStudents(prev => [...prev, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-base)]/95 backdrop-blur-md flex flex-col font-sans text-[var(--text-primary)] overflow-hidden">
      {/* Top Bar Header */}
      <header className="bg-[var(--bg-panel)] border-b border-[#E9C349]/30 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D468] text-black flex items-center justify-center font-bold font-serif text-xl shadow-lg">
            D
          </div>
          <div>
            <h1 className="text-base font-serif font-bold text-[var(--text-primary)] tracking-wide flex items-center gap-2">
              Dare Beauty Institute
              <span className="px-2 py-0.5 rounded-full bg-[#E9C349]/20 text-[#E9C349] font-mono text-[10px] font-bold uppercase border border-[#E9C349]/30">
                Instructor Portal
              </span>
            </h1>
            <p className="text-[11px] text-[var(--text-secondary)]">
              ደሬ የሴቶች እና የወንዶች የውበት ሙያ ማሰልጠኛ ተቋም
            </p>
          </div>
        </div>

        {/* Top Actions */}
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

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border-default)] flex flex-col justify-between shrink-0 overflow-y-auto p-3">
          <div className="space-y-1">
            {/* Instructor Mini Card */}
            <div className="p-3 mb-3 rounded-2xl bg-[var(--bg-panel)] border border-[#E9C349]/30 flex items-center space-x-3">
              <img
                src={INSTRUCTOR_DATA.photo}
                alt={INSTRUCTOR_DATA.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#E9C349]"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-[var(--text-primary)] truncate">{INSTRUCTOR_DATA.name}</div>
                <div className="text-[10px] text-[#E9C349] font-mono truncate">{INSTRUCTOR_DATA.id}</div>
              </div>
            </div>

            <div className="px-3 py-1 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest font-bold">
              Faculty Management
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Instructor Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'schedule'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Class Timetable</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'students'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Assigned Students</span>
              <span className="ml-auto font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{INSTRUCTOR_DATA.totalStudents}</span>
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
              <span>Take Daily Attendance</span>
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
              <span>Record Practical Grades</span>
            </button>

            <button
              onClick={() => setActiveTab('programs')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'programs'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Assigned Programs</span>
            </button>

            <button
              onClick={() => setActiveTab('certification')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'certification'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>COC Cert Recommendations</span>
            </button>

            <div className="pt-3 px-3 py-1 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest font-bold">
              Communication & Tools
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
              <span>Post Class Notices</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'reports'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Performance Reports</span>
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
              <span>Admin Contact & Support</span>
            </button>
          </div>

          <div className="pt-3 border-t border-[var(--border-default)] mt-4 text-[10px] text-[var(--text-muted)] font-mono text-center">
            Dare Faculty System v2.6
          </div>
        </aside>

        {/* Right Main Content Panel */}
        <main className="flex-1 bg-[var(--bg-card)] text-[var(--text-primary)] overflow-y-auto p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[var(--bg-base)] via-[var(--bg-panel)] to-[var(--bg-base)] border border-[#E9C349]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-5">
                  <img src={INSTRUCTOR_DATA.photo} alt={INSTRUCTOR_DATA.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E9C349] shrink-0" />
                  <div>
                    <div className="inline-flex items-center space-x-2 text-[#E9C349] text-xs font-mono font-bold uppercase mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Welcome back, {INSTRUCTOR_DATA.name}</span>
                    </div>
                    <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">{INSTRUCTOR_DATA.title}</h2>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">{INSTRUCTOR_DATA.officeRoom} • {INSTRUCTOR_DATA.assignedCourses.join(' & ')}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="px-4 py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs shadow-lg hover:brightness-110 flex items-center space-x-2"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>Take Today's Attendance</span>
                  </button>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)]">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-bold">Assigned Students</span>
                  <div className="text-2xl font-mono font-bold text-[var(--text-primary)] mt-1">{INSTRUCTOR_DATA.totalStudents}</div>
                  <span className="text-[10px] text-emerald-400 font-bold">Across 2 Tracks</span>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)]">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-bold">Today's Classes</span>
                  <div className="text-2xl font-mono font-bold text-[#E9C349] mt-1">{TODAY_CLASSES.length} Sessions</div>
                  <span className="text-[10px] text-[var(--text-secondary)]">1 Completed • 2 Pending</span>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)]">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-bold">Pending Attendance</span>
                  <div className="text-2xl font-mono font-bold text-amber-400 mt-1">{INSTRUCTOR_DATA.pendingAttendance} Session</div>
                  <span className="text-[10px] text-amber-400 font-bold">Needs Submission</span>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)]">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-bold">Pending Grade Reviews</span>
                  <div className="text-2xl font-mono font-bold text-[var(--text-primary)] mt-1">{INSTRUCTOR_DATA.pendingGrades} Submissions</div>
                  <span className="text-[10px] text-[var(--text-secondary)]">Practical Evaluations</span>
                </div>
              </div>

              {/* Today's Schedule List */}
              <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4">
                <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center justify-between">
                  <span>Today's Live Teaching Schedule</span>
                  <span className="text-xs font-mono text-[#E9C349]">August 05, 2026</span>
                </h3>

                <div className="space-y-3">
                  {TODAY_CLASSES.map((cls, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-[#E9C349] font-mono">{cls.time} • {cls.room}</div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">{cls.program}</h4>
                        <p className="text-[11px] text-[var(--text-secondary)] font-mono mt-0.5">{cls.shift} Shift • {cls.studentCount} Students Enrolled</p>
                      </div>

                      <div>
                        {cls.attendanceTaken ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold inline-flex items-center space-x-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Attendance Submitted</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setActiveTab('attendance')}
                            className="px-3.5 py-1.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:brightness-110"
                          >
                            Mark Attendance
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4">
                <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Weekly Faculty Timetable & Studio Allocations</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-black/50 text-[#E9C349] font-mono text-[10px] uppercase border-b border-[var(--border-default)]">
                        <th className="p-3">Day</th>
                        <th className="p-3">Morning Shift (8:30 - 12:30)</th>
                        <th className="p-3">Afternoon Shift (2:00 - 5:00)</th>
                        <th className="p-3">Evening / Support</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)]">
                      {WEEKLY_TIMETABLE.map((row, i) => (
                        <tr key={i} className="hover:bg-white/5">
                          <td className="p-3 font-bold text-[#E9C349] font-serif">{row.day}</td>
                          <td className="p-3 text-[var(--text-primary)] font-semibold">{row.morning}</td>
                          <td className="p-3 text-[var(--text-secondary)]">{row.afternoon}</td>
                          <td className="p-3 text-[var(--text-secondary)] font-mono">{row.evening}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STUDENTS */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Assigned Student Roster</h2>
                  <p className="text-xs text-[var(--text-secondary)]">View progress and evaluate student competency for your active cohorts.</p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Search student by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-black/50 text-xs px-3 py-2 rounded-xl border border-[var(--border-default)] text-[var(--text-primary)] placeholder-gray-400 outline-none focus:border-[#E9C349]"
                  />
                  <button
                    onClick={() => exportToCSV('Assigned_Students_List', ['ID', 'Name', 'Course', 'Shift', 'Attendance', 'Competency'], filteredStudents.map(s => [s.id, s.name, s.course, s.shift, `${s.attendanceRate}%`, s.competency]))}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-[var(--text-primary)] font-bold text-xs flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              <div className="bg-[var(--bg-panel)] rounded-3xl border border-[var(--border-default)] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-black/50 text-[#E9C349] font-mono text-[10px] uppercase border-b border-[var(--border-default)]">
                      <th className="p-3">ID</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Course Program</th>
                      <th className="p-3">Shift</th>
                      <th className="p-3">Attendance</th>
                      <th className="p-3">Competency Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {filteredStudents.map(s => (
                      <tr key={s.id} className="hover:bg-white/5">
                        <td className="p-3 font-mono text-[#E9C349] font-bold">{s.id}</td>
                        <td className="p-3 font-semibold text-[var(--text-primary)]">{s.name}</td>
                        <td className="p-3 text-[var(--text-secondary)]">{s.course}</td>
                        <td className="p-3 text-[var(--text-secondary)] font-mono">{s.shift}</td>
                        <td className="p-3 font-mono">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${s.attendanceRate < 75 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {s.attendanceRate}%
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[var(--text-primary)] text-[10px] font-bold">
                            {s.competency}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setGradingStudentId(s.id);
                              setGradeTab('detail');
                              setActiveTab('grades');
                            }}
                            className="px-3 py-1 rounded-lg bg-[#E9C349] text-black font-bold text-xs hover:brightness-110"
                          >
                            View Grades
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                isEmbedded={true}
                role="instructor"
              />

              <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-4">
                  <div>
                    <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Daily Practical Lab Attendance Entry</h2>
                    <p className="text-xs text-[var(--text-secondary)]">Mark student attendance for Morning Lab Session • August 05, 2026.</p>
                  </div>
                  <button onClick={() => alert('Attendance saved and synced to Registrar database!')} className="px-4 py-2 rounded-xl bg-emerald-600 text-[var(--text-primary)] font-bold text-xs hover:bg-emerald-500">
                    Submit Final Roll Call
                  </button>
                </div>

                <div className="divide-y divide-[var(--border-subtle)]">
                  {studentsList.map(s => (
                    <div key={s.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-[var(--text-primary)]">{s.name} <span className="font-mono text-[#E9C349] text-[10px]">({s.id})</span></div>
                        <div className="text-[10px] text-[var(--text-secondary)]">{s.course} • {s.shift} Shift</div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleMarkAttendance(s.id, 'Present')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all ${s.todayAttendance === 'Present' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-[var(--text-secondary)]'}`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(s.id, 'Late')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all ${s.todayAttendance === 'Late' ? 'bg-amber-500 text-black' : 'bg-white/5 text-[var(--text-secondary)]'}`}
                        >
                          Late
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(s.id, 'Absent')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all ${s.todayAttendance === 'Absent' ? 'bg-red-500 text-[var(--text-primary)]' : 'bg-white/5 text-[var(--text-secondary)]'}`}
                        >
                          Absent
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GRADES */}
          {activeTab === 'grades' && (
            <div className="space-y-6">

              {/* ── Header row ── */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Practical Assessment Scores</h2>
                  <p className="text-xs text-[var(--text-secondary)]">Add, edit, or delete assessment records for each student you teach.</p>
                </div>
                <button
                  onClick={() => exportToCSV(
                    'Practical_Assessments',
                    ['Student ID', 'Student Name', 'Unit', 'Date', 'Score', 'Max', 'Notes', 'Graded By'],
                    assessments.map(a => {
                      const s = studentsList.find(st => st.id === a.studentId);
                      return [a.studentId, s?.name ?? '', a.unit, a.date, String(a.score), String(a.maxScore), a.notes, a.gradedBy];
                    })
                  )}
                  className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" /> Export All CSV
                </button>
              </div>

              {/* ── Roster view: one card per student ── */}
              {gradeTab === 'roster' && (
                <>
                  {/* Search */}
                  <div className="relative max-w-xs">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      value={gradeSearchTerm}
                      onChange={e => setGradeSearchTerm(e.target.value)}
                      placeholder="Search student name or ID…"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none focus:border-[#E9C349]"
                    />
                  </div>

                  {/* Student cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {studentsList
                      .filter(s =>
                        s.name.toLowerCase().includes(gradeSearchTerm.toLowerCase()) ||
                        s.id.toLowerCase().includes(gradeSearchTerm.toLowerCase())
                      )
                      .map(s => {
                        const mine = assessments.filter(a => a.studentId === s.id);
                        const avg  = mine.length ? avgScore(mine) : s.lastGrade;
                        const comp = scoreToCompetency(avg);
                        const compColor =
                          comp === 'Highly Competent'      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                          comp === 'Competent'             ? 'text-[#E9C349]   bg-[#E9C349]/10   border-[#E9C349]/30'   :
                                                            'text-red-400      bg-red-500/10      border-red-500/30';
                        return (
                          <div key={s.id} className="p-5 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4 flex flex-col">
                            {/* Student header */}
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="font-bold text-[var(--text-primary)] text-sm leading-tight">{s.name}</div>
                                <div className="text-[10px] font-mono text-[#E9C349] mt-0.5">{s.id}</div>
                                <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">{s.course} · {s.shift} Shift</div>
                              </div>
                              <span className={`shrink-0 px-2 py-0.5 rounded-full border text-[10px] font-bold font-mono ${compColor}`}>
                                {comp === 'Highly Competent' ? '🥇' : comp === 'Competent' ? '🥈' : '🥉'} {comp}
                              </span>
                            </div>

                            {/* Score summary */}
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="p-2 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-subtle)]">
                                <div className="text-lg font-mono font-bold text-[#E9C349]">{avg}%</div>
                                <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">Avg Score</div>
                              </div>
                              <div className="p-2 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-subtle)]">
                                <div className="text-lg font-mono font-bold text-[var(--text-primary)]">{mine.length}</div>
                                <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">Assessments</div>
                              </div>
                              <div className="p-2 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-subtle)]">
                                <div className={`text-lg font-mono font-bold ${s.attendanceRate >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>{s.attendanceRate}%</div>
                                <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide">Attendance</div>
                              </div>
                            </div>

                            {/* Latest assessment preview */}
                            {mine.length > 0 && (() => {
                              const latest = [...mine].sort((a, b) => b.date.localeCompare(a.date))[0];
                              return (
                                <div className="p-2.5 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-subtle)] text-[11px] space-y-0.5">
                                  <div className="font-semibold text-[var(--text-primary)] truncate">{latest.unit}</div>
                                  <div className="flex items-center justify-between text-[var(--text-muted)] font-mono">
                                    <span>{latest.date}</span>
                                    <span className="font-bold text-emerald-400">{latest.score}/{latest.maxScore}</span>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Actions */}
                            <div className="flex gap-2 mt-auto pt-1">
                              <button
                                onClick={() => { setGradingStudentId(s.id); setGradeTab('detail'); }}
                                className="flex-1 py-2 rounded-xl border border-[var(--border-default)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#E9C349]/50 transition-all flex items-center justify-center gap-1.5"
                              >
                                <TrendingUp className="w-3.5 h-3.5" /> View All ({mine.length})
                              </button>
                              <button
                                onClick={() => handleOpenAddAssessment(s.id)}
                                className="flex-1 py-2 rounded-xl bg-[#E9C349] text-black text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add Score
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </>
              )}

              {/* ── Detail view: all assessments for one student ── */}
              {gradeTab === 'detail' && (() => {
                const s = studentsList.find(st => st.id === gradingStudentId);
                if (!s) return null;
                const mine = assessments
                  .filter(a => a.studentId === s.id)
                  .sort((a, b) => b.date.localeCompare(a.date));
                const avg  = mine.length ? avgScore(mine) : s.lastGrade;
                const comp = scoreToCompetency(avg);

                return (
                  <div className="space-y-5">
                    {/* Back + student header */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setGradeTab('roster')}
                        className="p-2 rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#E9C349]/50 transition-all"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </button>
                      <div>
                        <h3 className="font-bold text-[var(--text-primary)] text-base">{s.name}</h3>
                        <p className="text-[10px] font-mono text-[#E9C349]">{s.id} · {s.course}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#E9C349] bg-[#E9C349]/10 border border-[#E9C349]/30 px-2.5 py-1 rounded-full">
                          Avg: {avg}%
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border
                          text-emerald-400 bg-emerald-500/10 border-emerald-500/30">
                          {comp}
                        </span>
                      </div>
                    </div>

                    {/* Score progress bar */}
                    <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-2">
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-[var(--text-secondary)]">Overall Progress</span>
                        <span className="font-bold text-[#E9C349]">{avg}% / 100%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-[var(--bg-glass)] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${avg >= 90 ? 'bg-emerald-400' : avg >= 75 ? 'bg-[#E9C349]' : 'bg-red-400'}`}
                          style={{ width: `${avg}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
                        <span>0%</span>
                        <span className="text-amber-400">75% COC min</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Add button + table */}
                    <div className="p-5 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-[var(--text-primary)] text-sm">
                          Assessment Records <span className="text-[var(--text-muted)] font-mono font-normal text-xs">({mine.length})</span>
                        </h4>
                        <button
                          onClick={() => handleOpenAddAssessment(s.id)}
                          className="px-3.5 py-2 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:brightness-110 flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Assessment
                        </button>
                      </div>

                      {mine.length === 0 ? (
                        <div className="py-10 text-center text-[var(--text-muted)] text-sm">
                          No assessments recorded yet. Click <strong className="text-[#E9C349]">Add Assessment</strong> to start.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-[var(--border-default)] text-[var(--text-muted)] font-mono text-[10px] uppercase">
                                <th className="py-2.5 px-3">Unit / Module</th>
                                <th className="py-2.5 px-3">Date</th>
                                <th className="py-2.5 px-3 text-center">Score</th>
                                <th className="py-2.5 px-3 text-center">Grade</th>
                                <th className="py-2.5 px-3 hidden md:table-cell">Notes</th>
                                <th className="py-2.5 px-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-subtle)]">
                              {mine.map(a => {
                                const pct = Math.round((a.score / a.maxScore) * 100);
                                const barColor = pct >= 90 ? 'bg-emerald-400' : pct >= 75 ? 'bg-[#E9C349]' : 'bg-red-400';
                                const textColor = pct >= 90 ? 'text-emerald-400' : pct >= 75 ? 'text-[#E9C349]' : 'text-red-400';
                                return (
                                  <tr key={a.id} className="hover:bg-[var(--bg-glass)] transition-colors group">
                                    <td className="py-3 px-3 font-semibold text-[var(--text-primary)] max-w-[200px]">
                                      <div className="truncate">{a.unit}</div>
                                      <div className="text-[10px] text-[var(--text-muted)] font-mono">by {a.gradedBy}</div>
                                    </td>
                                    <td className="py-3 px-3 font-mono text-[var(--text-secondary)] whitespace-nowrap">{a.date}</td>
                                    <td className="py-3 px-3 text-center">
                                      <div className="flex flex-col items-center gap-1">
                                        <span className={`font-mono font-bold text-sm ${textColor}`}>{a.score}<span className="text-[10px] text-[var(--text-muted)]">/{a.maxScore}</span></span>
                                        <div className="w-16 h-1.5 rounded-full bg-[var(--bg-glass)] overflow-hidden">
                                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                                        pct >= 90 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                                        pct >= 75 ? 'bg-[#E9C349]/10 text-[#E9C349] border-[#E9C349]/30' :
                                                    'bg-red-500/10 text-red-400 border-red-500/30'
                                      }`}>
                                        {scoreToCompetency(pct)}
                                      </span>
                                    </td>
                                    <td className="py-3 px-3 text-[var(--text-muted)] hidden md:table-cell max-w-[220px]">
                                      <span className="line-clamp-2 italic text-[11px]">{a.notes || '—'}</span>
                                    </td>
                                    <td className="py-3 px-3 text-right">
                                      <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={() => handleOpenEditAssessment(a)}
                                          className="p-1.5 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[#E9C349] hover:border-[#E9C349]/50 transition-all"
                                          title="Edit"
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => setDeleteConfirmId(a.id)}
                                          className="p-1.5 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-red-400 hover:border-red-500/40 transition-all"
                                          title="Delete"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 6: CERTIFICATION RECOMMENDATION */}
          {activeTab === 'certification' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4">
                <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">TVET COC Certification Endorsement</h2>
                <p className="text-xs text-[var(--text-secondary)]">Select eligible candidate students for official Government COC Practical Assessment recommendation.</p>

                <div className="divide-y divide-[var(--border-subtle)]">
                  {studentsList.map(s => (
                    <div key={s.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-[var(--text-primary)]">{s.name} <span className="font-mono text-[#E9C349] text-[10px]">({s.id})</span></div>
                        <div className="text-[10px] text-[var(--text-secondary)]">Attendance: {s.attendanceRate}% • Grade: {s.lastGrade}%</div>
                      </div>

                      <button
                        onClick={() => toggleRecommendation(s.id)}
                        className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-1 ${
                          recommendedStudents.includes(s.id)
                            ? 'bg-emerald-500 text-black'
                            : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10 border border-[var(--border-default)]'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{recommendedStudents.includes(s.id) ? 'Endorsed for COC' : 'Endorse Candidate'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <form onSubmit={handlePostNotice} className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4">
                <h2 className="text-lg font-bold font-serif text-[var(--text-primary)]">Broadcast Class Notice to Students</h2>
                <div>
                  <label className="text-[10px] text-[var(--text-secondary)] font-mono uppercase">Notice Title</label>
                  <input
                    type="text"
                    required
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    placeholder="e.g. Bring Salon Hair dye model on Friday"
                    className="w-full mt-1 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] text-xs outline-none focus:border-[#E9C349]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--text-secondary)] font-mono uppercase">Notice Instructions</label>
                  <textarea
                    required
                    rows={3}
                    value={newNoticeBody}
                    onChange={(e) => setNewNoticeBody(e.target.value)}
                    placeholder="Write detailed class instructions..."
                    className="w-full mt-1 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] text-xs outline-none focus:border-[#E9C349]"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:brightness-110 flex items-center justify-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Broadcast Notice</span>
                </button>
              </form>

              {postedNotices.length > 0 && (
                <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-3">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">Broadcast History</h3>
                  {postedNotices.map(n => (
                    <div key={n.id} className="p-3.5 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-subtle)] space-y-1">
                      <div className="flex justify-between text-[10px] text-[#E9C349] font-mono">
                        <span>{n.title}</span>
                        <span>{n.date}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">{n.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-6">
                <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Instructor Faculty Profile</h2>
                <div className="flex items-center space-x-4">
                  <img src={INSTRUCTOR_DATA.photo} alt={INSTRUCTOR_DATA.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E9C349]" />
                  <div>
                    <div className="text-base font-bold text-[var(--text-primary)]">{INSTRUCTOR_DATA.name}</div>
                    <div className="text-xs text-[#E9C349] font-mono">{INSTRUCTOR_DATA.id} • {INSTRUCTOR_DATA.title}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[var(--text-secondary)] font-mono text-[10px]">Full Name</label>
                    <input type="text" readOnly value={INSTRUCTOR_DATA.name} className="w-full mt-1 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)]" />
                  </div>
                  <div>
                    <label className="text-[var(--text-secondary)] font-mono text-[10px]">Amharic Name</label>
                    <input type="text" readOnly value={INSTRUCTOR_DATA.amharicName} className="w-full mt-1 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] font-serif" />
                  </div>
                  <div>
                    <label className="text-[var(--text-secondary)] font-mono text-[10px]">Phone Number</label>
                    <input type="text" readOnly value={INSTRUCTOR_DATA.phone} className="w-full mt-1 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)]" />
                  </div>
                  <div>
                    <label className="text-[var(--text-secondary)] font-mono text-[10px]">Email Address</label>
                    <input type="text" readOnly value={INSTRUCTOR_DATA.email} className="w-full mt-1 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)]" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[var(--text-secondary)] font-mono text-[10px]">Office & Studio</label>
                    <input type="text" readOnly value={INSTRUCTOR_DATA.officeRoom} className="w-full mt-1 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: PROGRAMS */}
          {activeTab === 'programs' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4">
                <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Assigned Vocational Training Tracks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {INSTRUCTOR_DATA.assignedCourses.map((c, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-black/40 border border-[#E9C349]/30 space-y-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#E9C349]/20 text-[#E9C349] font-mono text-[10px] font-bold">
                        Active Track
                      </span>
                      <h3 className="text-base font-bold text-[var(--text-primary)]">{c}</h3>
                      <p className="text-xs text-[var(--text-secondary)]">Curriculum includes theoretical chemistry, sanitation ethics, and 120 hours of live practical model styling.</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Faculty Analytics & Performance Summary</h2>
                  <button
                    onClick={() => exportToCSV('Faculty_Performance_Report', ['Metric', 'Value'], [['Total Students', '120'], ['Average Attendance', '91%'], ['Competency Pass Rate', '95%']])}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-[var(--text-primary)] font-bold text-xs flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Report</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-subtle)]">
                    <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Average Cohort Grade</div>
                    <div className="text-2xl font-mono font-bold text-[#E9C349] mt-1">91.4%</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-subtle)]">
                    <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">COC Qualification Rate</div>
                    <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">95%</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-subtle)]">
                    <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Total Lab Hours Completed</div>
                    <div className="text-2xl font-mono font-bold text-[var(--text-primary)] mt-1">340 Hrs</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: SUPPORT */}
          {activeTab === 'support' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4">
                <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Faculty Support & Admin Desk</h2>
                <p className="text-xs text-[var(--text-secondary)]">Need studio supplies, model booking assistance, or schedule adjustments?</p>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-subtle)] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[var(--text-primary)]">Academic Registrar Office</div>
                      <div className="text-[var(--text-secondary)] font-mono text-[11px]">registrar@darebeauty.edu.et • Ext. 201</div>
                    </div>
                    <button onClick={() => alert('Calling Registrar Desk...')} className="px-3 py-1.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs">
                      Call Desk
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-subtle)] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[var(--text-primary)]">Salon Equipment & Products Store</div>
                      <div className="text-[var(--text-secondary)] font-mono text-[11px]">store@darebeauty.edu.et • Ext. 104</div>
                    </div>
                    <button onClick={() => alert('Requesting salon supplies...')} className="px-3 py-1.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs">
                      Request Supplies
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Add / Edit Assessment Modal ── */}
      <AnimatePresence>
        {assessmentModal.open && gradingStudentId && (() => {
          const s = studentsList.find(st => st.id === gradingStudentId);
          const isEdit = !!assessmentModal.form.id;
          const f = assessmentModal.form;
          const scoreNum = Number(f.score);
          const isValid = f.unit && f.date && f.score !== '' && scoreNum >= 0 && scoreNum <= Number(f.maxScore);
          return (
            <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1,    opacity: 1, y: 0  }}
                exit={{   scale: 0.95, opacity: 0, y: 10  }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-[var(--bg-surface)] border border-[#E9C349]/50 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
              >
                {/* Header */}
                <div className="bg-[var(--bg-panel)] px-6 py-4 border-b border-[var(--border-default)] flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif font-bold text-[var(--text-primary)] text-base leading-tight">
                      {isEdit ? 'Edit Assessment' : 'New Practical Assessment'}
                    </h3>
                    <p className="text-[11px] text-[#E9C349] font-mono mt-0.5">
                      {s?.name} · {s?.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setAssessmentModal({ open: false, form: EMPTY_FORM })}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)] transition-all shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">

                  {/* Unit */}
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1.5">
                      Practical Unit / Module *
                    </label>
                    <select
                      value={f.unit}
                      onChange={e => handleFormChange('unit', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] focus:border-[#E9C349] text-xs text-[var(--text-primary)] outline-none"
                    >
                      {ASSESSMENT_UNITS.map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date + Max Score row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1.5">
                        Assessment Date *
                      </label>
                      <input
                        type="date"
                        value={f.date}
                        onChange={e => handleFormChange('date', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] focus:border-[#E9C349] text-xs text-[var(--text-primary)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1.5">
                        Max Score
                      </label>
                      <input
                        type="number"
                        min="1" max="200"
                        value={f.maxScore}
                        onChange={e => handleFormChange('maxScore', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] focus:border-[#E9C349] text-xs text-[var(--text-primary)] outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Score with live badge */}
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1.5">
                      Score Achieved *
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        max={f.maxScore}
                        value={f.score}
                        onChange={e => handleFormChange('score', e.target.value)}
                        placeholder="0 – 100"
                        className="flex-1 px-3 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] focus:border-[#E9C349] text-sm text-[var(--text-primary)] font-mono outline-none"
                      />
                      {f.score !== '' && (
                        <span className={`shrink-0 px-3 py-1.5 rounded-xl border text-xs font-bold font-mono ${
                          scoreNum >= 90 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          scoreNum >= 75 ? 'bg-[#E9C349]/10 text-[#E9C349] border-[#E9C349]/30' :
                                          'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}>
                          {scoreNum >= 90 ? '🥇 Highly Competent' : scoreNum >= 75 ? '🥈 Competent' : '🥉 Developing'}
                        </span>
                      )}
                    </div>
                    {/* Mini progress bar */}
                    {f.score !== '' && (
                      <div className="mt-2 w-full h-1.5 rounded-full bg-[var(--bg-glass)] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${scoreNum >= 90 ? 'bg-emerald-400' : scoreNum >= 75 ? 'bg-[#E9C349]' : 'bg-red-400'}`}
                          style={{ width: `${Math.min(100, (scoreNum / Number(f.maxScore)) * 100)}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1.5">
                      Instructor Notes / Remarks
                    </label>
                    <textarea
                      rows={3}
                      value={f.notes}
                      onChange={e => handleFormChange('notes', e.target.value)}
                      placeholder="e.g. Student showed excellent technique but needs to work on timing…"
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] focus:border-[#E9C349] text-xs text-[var(--text-primary)] outline-none resize-none placeholder-[var(--text-faint)]"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">
                  <button
                    onClick={() => setAssessmentModal({ open: false, form: EMPTY_FORM })}
                    className="flex-1 py-2.5 rounded-xl border border-[var(--border-default)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAssessment}
                    disabled={!isValid}
                    className="flex-1 py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5" />
                    {isEdit ? 'Save Changes' : 'Save Assessment'}
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* ── Delete Confirm Dialog ── */}
      <AnimatePresence>
        {deleteConfirmId && (() => {
          const target = assessments.find(a => a.id === deleteConfirmId);
          const student = studentsList.find(s => s.id === target?.studentId);
          return (
            <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1,    opacity: 1 }}
                exit={{   scale: 0.92, opacity: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                className="bg-[var(--bg-surface)] border border-red-500/40 rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] text-sm">Delete Assessment?</h3>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">This cannot be undone.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-subtle)] text-xs space-y-1">
                  <div className="font-bold text-[var(--text-primary)] truncate">{target?.unit}</div>
                  <div className="text-[var(--text-muted)] font-mono">
                    {student?.name} · {target?.date} · Score: {target?.score}/{target?.maxScore}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 py-2.5 rounded-xl border border-[var(--border-default)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteAssessment(deleteConfirmId)}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs transition-all"
                  >
                    Yes, Delete
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
