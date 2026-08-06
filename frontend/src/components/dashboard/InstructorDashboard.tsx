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
  
  // Grading Modal / State
  const [selectedStudentForGrading, setSelectedStudentForGrading] = useState<typeof INITIAL_ASSIGNED_STUDENTS[0] | null>(null);
  const [gradeScoreInput, setGradeScoreInput] = useState('');
  const [gradeCompetencyInput, setGradeCompetencyInput] = useState<'Highly Competent' | 'Competent' | 'Developing Competence'>('Highly Competent');
  
  // Post Notice state
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeBody, setNewNoticeBody] = useState('');
  const [postedNotices, setPostedNotices] = useState<{ id: string; title: string; body: string; date: string }[]>([]);

  // Recommendation state
  const [recommendedStudents, setRecommendedStudents] = useState<string[]>(['REG-2026-005', 'REG-2026-002']);

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
    if (!selectedStudentForGrading) return;
    const numericScore = parseInt(gradeScoreInput) || 90;
    setStudentsList(prev => prev.map(s => s.id === selectedStudentForGrading.id ? {
      ...s,
      lastGrade: numericScore,
      competency: gradeCompetencyInput
    } : s));
    setSelectedStudentForGrading(null);
    setGradeScoreInput('');
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
    <div className="fixed inset-0 z-50 bg-[#111111]/90 backdrop-blur-md flex flex-col font-sans text-white overflow-hidden">
      {/* Top Bar Header */}
      <header className="bg-[#161619] border-b border-[#E9C349]/30 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D468] text-black flex items-center justify-center font-bold font-serif text-xl shadow-lg">
            D
          </div>
          <div>
            <h1 className="text-base font-serif font-bold text-white tracking-wide flex items-center gap-2">
              Dare Beauty Institute
              <span className="px-2 py-0.5 rounded-full bg-[#E9C349]/20 text-[#E9C349] font-mono text-[10px] font-bold uppercase border border-[#E9C349]/30">
                Instructor Portal
              </span>
            </h1>
            <p className="text-[11px] text-gray-400">
              ደሬ የሴቶች እና የወንዶች የውበት ሙያ ማሰልጠኛ ተቋም
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center space-x-3 text-xs">
          <DashboardLangDropdown currentLang={currentLang} onChangeLang={onChangeLang} />

          <button
            onClick={() => onChangeTheme(themeMode === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-all border border-white/10"
            title="Toggle Light/Dark Theme"
          >
            {themeMode === 'light' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#E9C349]" />}
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-[#111113] border-r border-white/10 flex flex-col justify-between shrink-0 overflow-y-auto p-3">
          <div className="space-y-1">
            {/* Instructor Mini Card */}
            <div className="p-3 mb-3 rounded-2xl bg-[#161619] border border-[#E9C349]/30 flex items-center space-x-3">
              <img
                src={INSTRUCTOR_DATA.photo}
                alt={INSTRUCTOR_DATA.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#E9C349]"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{INSTRUCTOR_DATA.name}</div>
                <div className="text-[10px] text-[#E9C349] font-mono truncate">{INSTRUCTOR_DATA.id}</div>
              </div>
            </div>

            <div className="px-3 py-1 text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
              Faculty Management
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
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
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
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
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
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
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
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
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
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
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
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
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>COC Cert Recommendations</span>
            </button>

            <div className="pt-3 px-3 py-1 text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
              Communication & Tools
            </div>

            <button
              onClick={() => setActiveTab('announcements')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'announcements'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
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
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
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
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Admin Contact & Support</span>
            </button>
          </div>

          <div className="pt-3 border-t border-white/10 mt-4 text-[10px] text-gray-500 font-mono text-center">
            Dare Faculty System v2.6
          </div>
        </aside>

        {/* Right Main Content Panel */}
        <main className="flex-1 bg-[#1A1A1E] text-gray-100 overflow-y-auto p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#111111] via-[#1F1F24] to-[#111111] border border-[#E9C349]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-5">
                  <img src={INSTRUCTOR_DATA.photo} alt={INSTRUCTOR_DATA.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E9C349] shrink-0" />
                  <div>
                    <div className="inline-flex items-center space-x-2 text-[#E9C349] text-xs font-mono font-bold uppercase mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Welcome back, {INSTRUCTOR_DATA.name}</span>
                    </div>
                    <h2 className="text-xl font-serif font-bold text-white">{INSTRUCTOR_DATA.title}</h2>
                    <p className="text-xs text-gray-400 mt-1">{INSTRUCTOR_DATA.officeRoom} • {INSTRUCTOR_DATA.assignedCourses.join(' & ')}</p>
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
                <div className="p-4 rounded-2xl bg-[#161619] border border-white/10">
                  <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Assigned Students</span>
                  <div className="text-2xl font-mono font-bold text-white mt-1">{INSTRUCTOR_DATA.totalStudents}</div>
                  <span className="text-[10px] text-emerald-400 font-bold">Across 2 Tracks</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#161619] border border-white/10">
                  <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Today's Classes</span>
                  <div className="text-2xl font-mono font-bold text-[#E9C349] mt-1">{TODAY_CLASSES.length} Sessions</div>
                  <span className="text-[10px] text-gray-400">1 Completed • 2 Pending</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#161619] border border-white/10">
                  <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Pending Attendance</span>
                  <div className="text-2xl font-mono font-bold text-amber-400 mt-1">{INSTRUCTOR_DATA.pendingAttendance} Session</div>
                  <span className="text-[10px] text-amber-400 font-bold">Needs Submission</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#161619] border border-white/10">
                  <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Pending Grade Reviews</span>
                  <div className="text-2xl font-mono font-bold text-white mt-1">{INSTRUCTOR_DATA.pendingGrades} Submissions</div>
                  <span className="text-[10px] text-gray-400">Practical Evaluations</span>
                </div>
              </div>

              {/* Today's Schedule List */}
              <div className="p-6 rounded-3xl bg-[#161619] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Today's Live Teaching Schedule</span>
                  <span className="text-xs font-mono text-[#E9C349]">August 05, 2026</span>
                </h3>

                <div className="space-y-3">
                  {TODAY_CLASSES.map((cls, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-[#E9C349] font-mono">{cls.time} • {cls.room}</div>
                        <h4 className="text-sm font-semibold text-white mt-0.5">{cls.program}</h4>
                        <p className="text-[11px] text-gray-400 font-mono mt-0.5">{cls.shift} Shift • {cls.studentCount} Students Enrolled</p>
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
              <div className="p-6 rounded-3xl bg-[#161619] border border-white/10 space-y-4">
                <h2 className="text-xl font-bold font-serif text-white">Weekly Faculty Timetable & Studio Allocations</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-black/50 text-[#E9C349] font-mono text-[10px] uppercase border-b border-white/10">
                        <th className="p-3">Day</th>
                        <th className="p-3">Morning Shift (8:30 - 12:30)</th>
                        <th className="p-3">Afternoon Shift (2:00 - 5:00)</th>
                        <th className="p-3">Evening / Support</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {WEEKLY_TIMETABLE.map((row, i) => (
                        <tr key={i} className="hover:bg-white/5">
                          <td className="p-3 font-bold text-[#E9C349] font-serif">{row.day}</td>
                          <td className="p-3 text-white font-semibold">{row.morning}</td>
                          <td className="p-3 text-gray-300">{row.afternoon}</td>
                          <td className="p-3 text-gray-400 font-mono">{row.evening}</td>
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
                  <h2 className="text-xl font-bold font-serif text-white">Assigned Student Roster</h2>
                  <p className="text-xs text-gray-400">View progress and evaluate student competency for your active cohorts.</p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Search student by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-black/50 text-xs px-3 py-2 rounded-xl border border-white/10 text-white placeholder-gray-400 outline-none focus:border-[#E9C349]"
                  />
                  <button
                    onClick={() => exportToCSV('Assigned_Students_List', ['ID', 'Name', 'Course', 'Shift', 'Attendance', 'Competency'], filteredStudents.map(s => [s.id, s.name, s.course, s.shift, `${s.attendanceRate}%`, s.competency]))}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#161619] rounded-3xl border border-white/10 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-black/50 text-[#E9C349] font-mono text-[10px] uppercase border-b border-white/10">
                      <th className="p-3">ID</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Course Program</th>
                      <th className="p-3">Shift</th>
                      <th className="p-3">Attendance</th>
                      <th className="p-3">Competency Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredStudents.map(s => (
                      <tr key={s.id} className="hover:bg-white/5">
                        <td className="p-3 font-mono text-[#E9C349] font-bold">{s.id}</td>
                        <td className="p-3 font-semibold text-white">{s.name}</td>
                        <td className="p-3 text-gray-300">{s.course}</td>
                        <td className="p-3 text-gray-400 font-mono">{s.shift}</td>
                        <td className="p-3 font-mono">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${s.attendanceRate < 75 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {s.attendanceRate}%
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold">
                            {s.competency}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedStudentForGrading(s);
                              setGradeScoreInput(s.lastGrade.toString());
                            }}
                            className="px-3 py-1 rounded-lg bg-[#E9C349] text-black font-bold text-xs hover:brightness-110"
                          >
                            Grade Practical
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
              />

              <div className="p-6 rounded-3xl bg-[#161619] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-xl font-bold font-serif text-white">Daily Practical Lab Attendance Entry</h2>
                    <p className="text-xs text-gray-400">Mark student attendance for Morning Lab Session • August 05, 2026.</p>
                  </div>
                  <button onClick={() => alert('Attendance saved and synced to Registrar database!')} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500">
                    Submit Final Roll Call
                  </button>
                </div>

                <div className="divide-y divide-white/5">
                  {studentsList.map(s => (
                    <div key={s.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{s.name} <span className="font-mono text-[#E9C349] text-[10px]">({s.id})</span></div>
                        <div className="text-[10px] text-gray-400">{s.course} • {s.shift} Shift</div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleMarkAttendance(s.id, 'Present')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all ${s.todayAttendance === 'Present' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-400'}`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(s.id, 'Late')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all ${s.todayAttendance === 'Late' ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-400'}`}
                        >
                          Late
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(s.id, 'Absent')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all ${s.todayAttendance === 'Absent' ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-400'}`}
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
              <div className="p-6 rounded-3xl bg-[#161619] border border-white/10 space-y-4">
                <h2 className="text-xl font-bold font-serif text-white">Record Practical Assessment Scores</h2>
                <p className="text-xs text-gray-400">Evaluate practical hair cutting, dyeing, and styling model demonstrations.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {studentsList.map(s => (
                    <div key={s.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                      <div>
                        <div className="font-bold text-white text-sm">{s.name}</div>
                        <div className="text-[10px] text-[#E9C349] font-mono">{s.id} • {s.course}</div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-400">Last Score:</span>
                        <span className="font-bold text-emerald-400">{s.lastGrade}%</span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-400">Status:</span>
                        <span className="font-bold text-white text-[10px]">{s.competency}</span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedStudentForGrading(s);
                          setGradeScoreInput(s.lastGrade.toString());
                        }}
                        className="w-full py-1.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:brightness-110"
                      >
                        Update Practical Grade
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CERTIFICATION RECOMMENDATION */}
          {activeTab === 'certification' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#161619] border border-white/10 space-y-4">
                <h2 className="text-xl font-bold font-serif text-white">TVET COC Certification Endorsement</h2>
                <p className="text-xs text-gray-400">Select eligible candidate students for official Government COC Practical Assessment recommendation.</p>

                <div className="divide-y divide-white/5">
                  {studentsList.map(s => (
                    <div key={s.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{s.name} <span className="font-mono text-[#E9C349] text-[10px]">({s.id})</span></div>
                        <div className="text-[10px] text-gray-400">Attendance: {s.attendanceRate}% • Grade: {s.lastGrade}%</div>
                      </div>

                      <button
                        onClick={() => toggleRecommendation(s.id)}
                        className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-1 ${
                          recommendedStudents.includes(s.id)
                            ? 'bg-emerald-500 text-black'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
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
              <form onSubmit={handlePostNotice} className="p-6 rounded-3xl bg-[#161619] border border-white/10 space-y-4">
                <h2 className="text-lg font-bold font-serif text-white">Broadcast Class Notice to Students</h2>
                <div>
                  <label className="text-[10px] text-gray-400 font-mono uppercase">Notice Title</label>
                  <input
                    type="text"
                    required
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    placeholder="e.g. Bring Salon Hair dye model on Friday"
                    className="w-full mt-1 p-3 rounded-xl bg-black/50 border border-white/10 text-white text-xs outline-none focus:border-[#E9C349]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-mono uppercase">Notice Instructions</label>
                  <textarea
                    required
                    rows={3}
                    value={newNoticeBody}
                    onChange={(e) => setNewNoticeBody(e.target.value)}
                    placeholder="Write detailed class instructions..."
                    className="w-full mt-1 p-3 rounded-xl bg-black/50 border border-white/10 text-white text-xs outline-none focus:border-[#E9C349]"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:brightness-110 flex items-center justify-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Broadcast Notice</span>
                </button>
              </form>

              {postedNotices.length > 0 && (
                <div className="p-6 rounded-3xl bg-[#161619] border border-white/10 space-y-3">
                  <h3 className="text-sm font-bold text-white">Broadcast History</h3>
                  {postedNotices.map(n => (
                    <div key={n.id} className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <div className="flex justify-between text-[10px] text-[#E9C349] font-mono">
                        <span>{n.title}</span>
                        <span>{n.date}</span>
                      </div>
                      <p className="text-xs text-gray-300">{n.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-6 rounded-3xl bg-[#161619] border border-white/10 space-y-6">
                <h2 className="text-xl font-bold font-serif text-white">Instructor Faculty Profile</h2>
                <div className="flex items-center space-x-4">
                  <img src={INSTRUCTOR_DATA.photo} alt={INSTRUCTOR_DATA.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E9C349]" />
                  <div>
                    <div className="text-base font-bold text-white">{INSTRUCTOR_DATA.name}</div>
                    <div className="text-xs text-[#E9C349] font-mono">{INSTRUCTOR_DATA.id} • {INSTRUCTOR_DATA.title}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-gray-400 font-mono text-[10px]">Full Name</label>
                    <input type="text" readOnly value={INSTRUCTOR_DATA.name} className="w-full mt-1 p-3 rounded-xl bg-black/50 border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="text-gray-400 font-mono text-[10px]">Amharic Name</label>
                    <input type="text" readOnly value={INSTRUCTOR_DATA.amharicName} className="w-full mt-1 p-3 rounded-xl bg-black/50 border border-white/10 text-white font-serif" />
                  </div>
                  <div>
                    <label className="text-gray-400 font-mono text-[10px]">Phone Number</label>
                    <input type="text" readOnly value={INSTRUCTOR_DATA.phone} className="w-full mt-1 p-3 rounded-xl bg-black/50 border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="text-gray-400 font-mono text-[10px]">Email Address</label>
                    <input type="text" readOnly value={INSTRUCTOR_DATA.email} className="w-full mt-1 p-3 rounded-xl bg-black/50 border border-white/10 text-white" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-gray-400 font-mono text-[10px]">Office & Studio</label>
                    <input type="text" readOnly value={INSTRUCTOR_DATA.officeRoom} className="w-full mt-1 p-3 rounded-xl bg-black/50 border border-white/10 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: PROGRAMS */}
          {activeTab === 'programs' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#161619] border border-white/10 space-y-4">
                <h2 className="text-xl font-bold font-serif text-white">Assigned Vocational Training Tracks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {INSTRUCTOR_DATA.assignedCourses.map((c, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-black/40 border border-[#E9C349]/30 space-y-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#E9C349]/20 text-[#E9C349] font-mono text-[10px] font-bold">
                        Active Track
                      </span>
                      <h3 className="text-base font-bold text-white">{c}</h3>
                      <p className="text-xs text-gray-400">Curriculum includes theoretical chemistry, sanitation ethics, and 120 hours of live practical model styling.</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#161619] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-serif text-white">Faculty Analytics & Performance Summary</h2>
                  <button
                    onClick={() => exportToCSV('Faculty_Performance_Report', ['Metric', 'Value'], [['Total Students', '120'], ['Average Attendance', '91%'], ['Competency Pass Rate', '95%']])}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Report</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                    <div className="text-[10px] font-mono text-gray-400 uppercase">Average Cohort Grade</div>
                    <div className="text-2xl font-mono font-bold text-[#E9C349] mt-1">91.4%</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                    <div className="text-[10px] font-mono text-gray-400 uppercase">COC Qualification Rate</div>
                    <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">95%</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                    <div className="text-[10px] font-mono text-gray-400 uppercase">Total Lab Hours Completed</div>
                    <div className="text-2xl font-mono font-bold text-white mt-1">340 Hrs</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: SUPPORT */}
          {activeTab === 'support' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-6 rounded-3xl bg-[#161619] border border-white/10 space-y-4">
                <h2 className="text-xl font-bold font-serif text-white">Faculty Support & Admin Desk</h2>
                <p className="text-xs text-gray-400">Need studio supplies, model booking assistance, or schedule adjustments?</p>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Academic Registrar Office</div>
                      <div className="text-gray-400 font-mono text-[11px]">registrar@darebeauty.edu.et • Ext. 201</div>
                    </div>
                    <button onClick={() => alert('Calling Registrar Desk...')} className="px-3 py-1.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs">
                      Call Desk
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Salon Equipment & Products Store</div>
                      <div className="text-gray-400 font-mono text-[11px]">store@darebeauty.edu.et • Ext. 104</div>
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

      {/* Modal for Grading */}
      <AnimatePresence>
        {selectedStudentForGrading && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#161619] border border-[#E9C349] p-6 rounded-3xl max-w-md w-full text-white space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold font-serif text-[#E9C349]">
                  Grade Student: {selectedStudentForGrading.name}
                </h3>
                <button onClick={() => setSelectedStudentForGrading(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="text-xs text-gray-400 font-mono">Practical Assessment Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeScoreInput}
                  onChange={(e) => setGradeScoreInput(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-base outline-none focus:border-[#E9C349]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-mono">Assign TVET Competency Level</label>
                <select
                  value={gradeCompetencyInput}
                  onChange={(e) => setGradeCompetencyInput(e.target.value as any)}
                  className="w-full mt-1 p-3 rounded-xl bg-black/50 border border-white/10 text-white text-xs outline-none focus:border-[#E9C349]"
                >
                  <option value="Highly Competent">🥇 Highly Competent (90% - 100%)</option>
                  <option value="Competent">🥈 Competent (75% - 89%)</option>
                  <option value="Developing Competence">🥉 Developing Competence (Below 75%)</option>
                </select>
              </div>

              <button
                onClick={handleSaveGrade}
                className="w-full py-3 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:brightness-110"
              >
                Save Grade Record
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
