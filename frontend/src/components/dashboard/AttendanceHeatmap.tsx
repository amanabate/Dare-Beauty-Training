'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Award,
  Filter,
  Flame,
  UserCheck,
  Building,
  Info,
  CalendarCheck,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';
import { Language, ThemeMode } from '../../types';

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  dayName: string;
  status: 'present' | 'excellent' | 'late' | 'absent' | 'holiday' | 'no_class';
  checkIn?: string;
  checkOut?: string;
  program: string;
  instructor: string;
  topic?: string;
  durationHours?: number;
  notes?: string;
}

export interface StudentAttendanceProfile {
  studentId: string;
  studentName: string;
  amharicName?: string;
  oromoName?: string;
  program: string;
  shift: string;
  avatar: string;
  records: Record<string, AttendanceRecord>; // Keyed by YYYY-MM-DD
}

interface AttendanceHeatmapProps {
  currentLang?: Language;
  themeMode?: ThemeMode;
  selectedStudentId?: string;
  onSelectStudent?: (studentId: string) => void;
  isEmbedded?: boolean;
}

// Translations Object
const TRANSLATIONS = {
  en: {
    title: 'Dare Beauty Institute Attendance Analytics',
    subtitle: 'GitHub-Style Real-time Biometric & Practical Studio Attendance Heatmap',
    summaryTitle: 'Academic Attendance Metrics',
    totalClasses: 'Total Classes',
    presentDays: 'Present Days',
    absentDays: 'Absent Days',
    lateDays: 'Late Arrivals',
    attendanceRate: 'Attendance Rate',
    currentStreak: 'Current Streak',
    days: 'Days',
    filterMonth: 'Month',
    filterYear: 'Year',
    filterProgram: 'Training Track',
    filterStudent: 'Select Student',
    filterInstructor: 'Instructor',
    searchPlaceholder: 'Search student name or ID...',
    allPrograms: 'All Training Tracks',
    allInstructors: 'All Instructors',
    allStudents: 'Cohort Overview (All Students)',
    exportReport: 'Export Report',
    exportExcel: 'Export Excel/CSV',
    exportPDF: 'Export PDF',
    printReport: 'Print Attendance',
    viewGrid: 'GitHub Heatmap',
    viewCalendar: 'Monthly Calendar',
    viewTable: 'Attendance Log Table',
    legendTitle: 'Attendance Status Legend',
    noClass: 'No Class Scheduled',
    absent: 'Absent',
    late: 'Late Arrival',
    present: 'Present',
    excellent: 'Excellent (100% Studio Lab)',
    holiday: 'Institute Holiday / Closed',
    checkIn: 'Check-In',
    checkOut: 'Check-Out',
    instructorLabel: 'Instructor',
    topicLabel: 'Module / Practical Topic',
    notesLabel: 'Remarks',
    prevMonth: 'Previous Month',
    nextMonth: 'Next Month',
    today: 'Today',
    detailedLogs: 'Detailed Daily Check-In History',
    status: 'Status',
    date: 'Date',
    student: 'Student',
    actions: 'Actions',
    biometricVerified: 'Biometric Verified',
    studioLocation: 'Bole Studio Floor A'
  },
  am: {
    title: 'ዳሬ የውበት አካዳሚ የክትትል ትንተና',
    subtitle: 'የጊትሀብ አይነት የቀጥታ ስቱዲዮ እና የክፍል መገኘት ሂትማፕ',
    summaryTitle: 'የአካዳሚክ መገኘት መለኪያዎች',
    totalClasses: 'ጠቅላላ ክፍለ ጊዜዎች',
    presentDays: 'የተገኙባቸው ቀናት',
    absentDays: 'የቀሩባቸው ቀናት',
    lateDays: 'ዘግይተው የመጡ',
    attendanceRate: 'የመገኘት መቶኛ',
    currentStreak: 'ተከታታይ የመገኘት ቀናት',
    days: 'ቀናት',
    filterMonth: 'ወር',
    filterYear: 'ዓመተ ምህረት',
    filterProgram: 'የስልጠና ዘርፍ',
    filterStudent: 'ተማሪ ይምረጡ',
    filterInstructor: 'አሰልጣኝ',
    searchPlaceholder: 'የተማሪ ስም ወይም መታወቂያ ይፈልጉ...',
    allPrograms: 'ሁሉም የስልጠና ዘርፎች',
    allInstructors: 'ሁሉም አሰልጣኞች',
    allStudents: 'የክፍሉ አጠቃላይ እይታ',
    exportReport: 'ሪፖርት አውርድ',
    exportExcel: 'ኤክሴል/ሲኤስቪ አውርድ',
    exportPDF: 'ፒዲኤፍ አውርድ',
    printReport: 'ሪፖርት አትም',
    viewGrid: 'የጊትሀብ ሂትማፕ',
    viewCalendar: 'ወርሃዊ ካላንደር',
    viewTable: 'የመገኘት ዝርዝር ሰንጠረዥ',
    legendTitle: 'የቀለም መግለጫ',
    noClass: 'ትምህርት የለም',
    absent: 'ቀርት',
    late: 'ዘግይቶ መግባት',
    present: 'ተገኝቷል',
    excellent: 'በጣም उत्कृष्ट (100% ተግባር)',
    holiday: 'በዓል / ተቋም ዝግ',
    checkIn: 'የመግቢያ ሰዓት',
    checkOut: 'የመውጫ ሰዓት',
    instructorLabel: 'አሰልጣኝ',
    topicLabel: 'የልምምድ ርዕስ',
    notesLabel: 'ማስታወሻ',
    prevMonth: 'ያለፈው ወር',
    nextMonth: 'ቀጣይ ወር',
    today: 'ዛሬ',
    detailedLogs: 'ዕለታዊ የመገኘት መዝገብ ዝርዝር',
    status: 'ሁኔታ',
    date: 'ቀን',
    student: 'ተማሪ',
    actions: 'ተግባራት',
    biometricVerified: 'ባዮሜትሪክ ተረጋግጧል',
    studioLocation: 'ቦሌ ስቱዲዮ ወለል A'
  },
  om: {
    title: 'Analytiiksii Hirmaannaa Barnoota Dhaabbata Midaagina Dare',
    subtitle: 'Kaarta Oowwa Hirmaannaa Kutaa fi Labii Akka GitHub',
    summaryTitle: 'Safartuu Hirmaannaa Barnootaa',
    totalClasses: 'Waliigala Kutaalee',
    presentDays: 'Guyyoota Argaman',
    absentDays: 'Guyyoota Hafan',
    lateDays: 'Guyyoota Barfatan',
    attendanceRate: 'Hamma Hirmaannaa',
    currentStreak: 'Walitti Aansudhaan Argamuu',
    days: 'Guyyoota',
    filterMonth: "Ji'a",
    filterYear: 'Bara',
    filterProgram: 'Koorseewwan Barnootaa',
    filterStudent: 'Barataa Filadhu',
    filterInstructor: 'Leenqisaa',
    searchPlaceholder: 'Maqaa ykn ID Barataa barbaadi...',
    allPrograms: 'Koorseewwan Hundumaa',
    allInstructors: 'Leenqistoota Hundumaa',
    allStudents: 'Waliigala Barattootaa',
    exportReport: 'Gabaasa Baasi',
    exportExcel: 'Excel/CSV Baasi',
    exportPDF: 'PDF Baasi',
    printReport: 'Gabaasa Maxxansi',
    viewGrid: 'GitHub Heatmap',
    viewCalendar: "Dhaha Ji'aa",
    viewTable: 'Tarree Hirmaannaa Detail',
    legendTitle: 'Hiika Halluuwwanii',
    noClass: 'Kutaan Hin Jiru',
    absent: 'Hafaniiru',
    late: 'Barfataniiru',
    present: 'Argamaniiru',
    excellent: 'Garmaamuu (100% Lab)',
    holiday: 'Ayyaana / Dhaabbata Cufaa',
    checkIn: 'Yeroo Galmaa',
    checkOut: "Yeroo Ba'aa",
    instructorLabel: 'Leenqisaa',
    topicLabel: 'Mata Duree Gilgaalaa',
    notesLabel: 'Yaada',
    prevMonth: "Ji'a Darbe",
    nextMonth: "Ji'a Itti Aanu",
    today: "Har'a",
    detailedLogs: 'Seenaa Hirmaannaa Guyyaa Guyyaa',
    status: 'Haala',
    date: 'Guyyaa',
    student: 'Barataa',
    actions: 'Gochawwan',
    biometricVerified: "Biometric Mirkanaa'eera",
    studioLocation: 'Boolee Studio Floor A'
  }
};

// Mock Students Dataset
export const MOCK_STUDENTS: StudentAttendanceProfile[] = [
  {
    studentId: 'ST-2026-005',
    studentName: 'Bethlehem Worku',
    amharicName: 'ቤተልሔም ወርቁ',
    program: 'Advanced Hair Styling & Chemical Processing',
    shift: 'Morning Shift (8:30 AM - 12:30 PM)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    records: generateMockRecordsForStudent('ST-2026-005', 0.94)
  },
  {
    studentId: 'ST-2026-012',
    studentName: 'Helen Tesfaye',
    amharicName: 'ሄለን ተስፋዬ',
    program: 'Esthetics, Skincare & Medical Spa Treatments',
    shift: 'Afternoon Shift (1:30 PM - 5:30 PM)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    records: generateMockRecordsForStudent('ST-2026-012', 0.98)
  },
  {
    studentId: 'ST-2026-034',
    studentName: 'Eyerusalem Tadesse',
    amharicName: 'እየሩሳሌም ታደሰ',
    program: 'Nail Artistry, Extensions & Pedicure Spa',
    shift: 'Morning Shift (8:30 AM - 12:30 PM)',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    records: generateMockRecordsForStudent('ST-2026-034', 0.88)
  },
  {
    studentId: 'ST-2026-089',
    studentName: 'Dawit Mekonnen',
    amharicName: 'ዳዊት መኮንን',
    program: 'Barbering Artistry, Fadings & Beard Sculpture',
    shift: 'Evening Shift (5:30 PM - 8:30 PM)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    records: generateMockRecordsForStudent('ST-2026-089', 0.91)
  }
];

// Helper to generate a full month/year mock dataset
function generateMockRecordsForStudent(studentId: string, attendanceRatio: number): Record<string, AttendanceRecord> {
  const records: Record<string, AttendanceRecord> = {};
  const year = 2026;
  
  // Programs and Topics pools
  const topics = [
    'Chemical Relaxer & Neutralizer Science',
    'Balayage Color Melting & Foil Highlights',
    'Practical Salon Model Styling Assessment',
    'Sanitation, Autoclave & Hygiene Ethics',
    'Scalp Treatment & Keratin Infusion',
    'Advanced Braid Artistry & Extensions',
    'Facial Steaming & Ultrasound Extraction',
    'Acrylic Nail Sculpting & UV Curing'
  ];

  const instructors = [
    'Selamawit Abera (Senior Hair Artistry Master)',
    'Master Tigist Assefa (Cosmetology Lead)',
    'Instructor Dawit Getachew (Barbering Director)',
    'Mimi Tadesse (Skincare & Aesthetics Specialist)'
  ];

  // Loop through days in 2026 up to current month (e.g. June/July/August)
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dayOfWeek = dateObj.getDay(); // 0 = Sun, 6 = Sat
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

      // Sundays are no class
      if (dayOfWeek === 0) {
        records[dateStr] = {
          date: dateStr,
          dayName,
          status: 'no_class',
          program: 'N/A',
          instructor: 'Institute Closed'
        };
        continue;
      }

      // Special holidays
      if ((month === 0 && day === 7) || (month === 0 && day === 19) || (month === 8 && day === 11) || (month === 4 && day === 5)) {
        records[dateStr] = {
          date: dateStr,
          dayName,
          status: 'holiday',
          program: 'National / Ethiopian Holiday',
          instructor: 'Institute Closed',
          notes: 'Official National Holiday Observance'
        };
        continue;
      }

      // Pseudo-random deterministic status generator based on date and student
      const hash = (day * 31 + month * 17 + studentId.charCodeAt(studentId.length - 1)) % 100;
      let status: AttendanceRecord['status'] = 'present';
      let checkIn = '08:24 AM';
      let checkOut = '04:30 PM';
      let notes = 'Standard biometric check-in recorded.';

      if (hash > Math.floor(attendanceRatio * 100)) {
        if (hash % 2 === 0) {
          status = 'late';
          checkIn = '09:15 AM';
          notes = 'Late arrival due to traffic. Verified by instructor.';
        } else {
          status = 'absent';
          checkIn = 'N/A';
          checkOut = 'N/A';
          notes = 'Unexcused absence recorded.';
        }
      } else if (hash < 25) {
        status = 'excellent';
        checkIn = '08:10 AM';
        checkOut = '05:00 PM';
        notes = 'Perfect attendance + 30 mins bonus practical lab practice.';
      }

      records[dateStr] = {
        date: dateStr,
        dayName,
        status,
        checkIn,
        checkOut,
        program: 'Professional Hair Dressing & Advanced Styling',
        instructor: instructors[day % instructors.length],
        topic: topics[day % topics.length],
        durationHours: status === 'absent' ? 0 : status === 'excellent' ? 8.5 : 7.5,
        notes
      };
    }
  }

  return records;
}

export const AttendanceHeatmap: React.FC<AttendanceHeatmapProps> = ({
  currentLang = 'en',
  themeMode = 'dark',
  selectedStudentId,
  onSelectStudent,
  isEmbedded = false
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Filter States
  const [activeYear, setActiveYear] = useState<number>(2026);
  const [activeMonth, setActiveMonth] = useState<number>(7); // 0-indexed, 7 = August
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedInstructor, setSelectedInstructor] = useState<string>('all');
  const [activeStudentId, setActiveStudentId] = useState<string>(selectedStudentId || 'ST-2026-005');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredRecord, setHoveredRecord] = useState<AttendanceRecord | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'heatmap' | 'calendar' | 'table'>('heatmap');

  // Sync selected student if passed from parent
  React.useEffect(() => {
    if (selectedStudentId) {
      setActiveStudentId(selectedStudentId);
    }
  }, [selectedStudentId]);

  // Active student profile
  const currentStudent = useMemo(() => {
    return MOCK_STUDENTS.find(s => s.studentId === activeStudentId) || MOCK_STUDENTS[0];
  }, [activeStudentId]);

  // Month Names
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Days in selected Month
  const monthDates = useMemo(() => {
    const dates: string[] = [];
    const daysInMonth = new Date(activeYear, activeMonth + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const formatted = `${activeYear}-${String(activeMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      dates.push(formatted);
    }
    return dates;
  }, [activeYear, activeMonth]);

  // Calculate Metrics
  const metrics = useMemo(() => {
    let totalClasses = 0;
    let present = 0;
    let excellent = 0;
    let late = 0;
    let absent = 0;
    let streak = 0;
    let maxStreak = 0;

    monthDates.forEach(dateStr => {
      const rec = currentStudent.records[dateStr];
      if (!rec || rec.status === 'no_class' || rec.status === 'holiday') return;

      totalClasses++;
      if (rec.status === 'present') {
        present++;
        streak++;
      } else if (rec.status === 'excellent') {
        excellent++;
        present++;
        streak++;
      } else if (rec.status === 'late') {
        late++;
        streak++; // counts towards streak
      } else if (rec.status === 'absent') {
        absent++;
        streak = 0;
      }
      if (streak > maxStreak) maxStreak = streak;
    });

    const attendedCount = present + late;
    const attendancePercentage = totalClasses > 0 ? ((attendedCount / totalClasses) * 100).toFixed(1) : '100.0';

    return {
      totalClasses,
      present,
      excellent,
      late,
      absent,
      attendancePercentage,
      streak: maxStreak > 0 ? maxStreak : 14
    };
  }, [monthDates, currentStudent]);

  // Handle Month Navigation
  const handlePrevMonth = () => {
    if (activeMonth === 0) {
      setActiveMonth(11);
      setActiveYear(prev => prev - 1);
    } else {
      setActiveMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (activeMonth === 11) {
      setActiveMonth(0);
      setActiveYear(prev => prev + 1);
    } else {
      setActiveMonth(prev => prev + 1);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Date', 'Day', 'Status', 'CheckIn', 'CheckOut', 'Program', 'Instructor', 'Notes'];
    const rows = monthDates.map(dateStr => {
      const rec = currentStudent.records[dateStr] || {
        date: dateStr,
        dayName: '',
        status: 'no_class',
        checkIn: 'N/A',
        checkOut: 'N/A',
        program: currentStudent.program,
        instructor: 'N/A',
        notes: ''
      };
      return [
        rec.date,
        rec.dayName,
        rec.status.toUpperCase(),
        rec.checkIn || 'N/A',
        rec.checkOut || 'N/A',
        `"${rec.program}"`,
        `"${rec.instructor}"`,
        `"${rec.notes || ''}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dare_Institute_Attendance_${currentStudent.studentName}_${MONTH_NAMES[activeMonth]}_${activeYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Function
  const handlePrint = () => {
    window.print();
  };

  // Status Styling Mapper
  const getStatusStyle = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'excellent':
        return 'bg-emerald-400 border-2 border-[#E9C349] text-black font-bold shadow-[0_0_12px_rgba(233,195,73,0.6)] animate-pulse';
      case 'present':
        return 'bg-emerald-500 border border-emerald-400/50 text-white';
      case 'late':
        return 'bg-amber-400 border border-amber-300/50 text-black font-bold';
      case 'absent':
        return 'bg-red-500 border border-red-400/50 text-white font-bold';
      case 'holiday':
        return 'bg-sky-500 border border-sky-400/50 text-white';
      case 'no_class':
      default:
        return 'bg-white/5 border border-white/10 text-gray-600 hover:border-white/20';
    }
  };

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'excellent':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-[#E9C349] text-[10px] font-bold font-mono">🟢🟢 Excellent (100%)</span>;
      case 'present':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold font-mono">🟢 Present</span>;
      case 'late':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold font-mono">🟡 Late Arrival</span>;
      case 'absent':
        return <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold font-mono">🔴 Absent</span>;
      case 'holiday':
        return <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold font-mono">🔵 Holiday / Closed</span>;
      case 'no_class':
      default:
        return <span className="px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30 text-[10px] font-mono">⚪ No Class</span>;
    }
  };

  return (
    <div className={`w-full ${isEmbedded ? '' : 'p-4 sm:p-6 lg:p-8 bg-[#111113] text-white min-h-screen font-sans'} transition-all`}>
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-[#E9C349]/20 text-[#E9C349] font-mono text-[10px] font-bold tracking-wider uppercase border border-[#E9C349]/30 flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Biometric Heatmap Engine v3.2</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Live Synced</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight pt-1">
            {t.title}
          </h1>
          <p className="text-xs text-gray-400 max-w-2xl">
            {t.subtitle}
          </p>
        </div>

        {/* Top Control Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switches */}
          <div className="p-1 rounded-xl bg-black/50 border border-white/10 flex items-center space-x-1">
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'heatmap' ? 'bg-[#E9C349] text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.viewGrid}</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'calendar' ? 'bg-[#E9C349] text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.viewCalendar}</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'table' ? 'bg-[#E9C349] text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.viewTable}</span>
            </button>
          </div>

          {/* Export CSV / Print Buttons */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow flex items-center space-x-1.5"
            title={t.exportExcel}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportReport}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition-all flex items-center space-x-1.5"
            title={t.printReport}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.printReport}</span>
          </button>
        </div>
      </div>

      {/* Selected Student Banner Info */}
      <div className="mt-6 p-4 rounded-2xl bg-[#161619] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <img
            src={currentStudent.avatar}
            alt={currentStudent.studentName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E9C349] shadow-md"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">{currentStudent.studentName}</h2>
              {currentStudent.amharicName && (
                <span className="text-xs text-[#E9C349] font-serif font-bold">({currentStudent.amharicName})</span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-black/60 border border-white/10 font-mono text-[10px] text-gray-300">
                {currentStudent.studentId}
              </span>
            </div>
            <p className="text-xs text-gray-400 pt-0.5">{currentStudent.program}</p>
            <p className="text-[11px] text-[#E9C349] font-mono">{currentStudent.shift}</p>
          </div>
        </div>

        {/* Student Selector Dropdown & Search */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E9C349]"
            />
          </div>

          <select
            value={activeStudentId}
            onChange={(e) => {
              setActiveStudentId(e.target.value);
              if (onSelectStudent) onSelectStudent(e.target.value);
            }}
            className="px-3 py-2 rounded-xl bg-black/60 border border-[#E9C349]/40 text-xs text-white focus:outline-none font-semibold cursor-pointer"
          >
            {MOCK_STUDENTS.map(s => (
              <option key={s.studentId} value={s.studentId} className="bg-black text-white">
                {s.studentName} ({s.studentId})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ATTENDANCE SUMMARY METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-6">
        {/* Total Classes */}
        <div className="p-4 rounded-2xl bg-[#161619] border border-white/10 space-y-1 relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">{t.totalClasses}</span>
            <Building className="w-4 h-4 text-gray-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-white pt-1">{metrics.totalClasses}</div>
          <p className="text-[10px] text-gray-500">{MONTH_NAMES[activeMonth]} {activeYear}</p>
        </div>

        {/* Present Days */}
        <div className="p-4 rounded-2xl bg-[#161619] border border-emerald-500/30 space-y-1 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">{t.presentDays}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400 pt-1">
            {metrics.present} <span className="text-xs text-emerald-300 font-normal">({metrics.excellent} Excellent)</span>
          </div>
          <p className="text-[10px] text-emerald-400/80">Biometric Studio Checked</p>
        </div>

        {/* Late Days */}
        <div className="p-4 rounded-2xl bg-[#161619] border border-amber-500/30 space-y-1 relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">{t.lateDays}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-400 pt-1">{metrics.late}</div>
          <p className="text-[10px] text-amber-400/80">&lt; 30 Mins Grace Period</p>
        </div>

        {/* Absent Days */}
        <div className="p-4 rounded-2xl bg-[#161619] border border-red-500/30 space-y-1 relative overflow-hidden group hover:border-red-500/50 transition-all">
          <div className="flex items-center justify-between text-red-400">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">{t.absentDays}</span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-red-400 pt-1">{metrics.absent}</div>
          <p className="text-[10px] text-red-400/80">Unexcused Missed Labs</p>
        </div>

        {/* Attendance Percentage */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#161619] to-black border border-[#E9C349]/40 space-y-1 relative overflow-hidden group hover:border-[#E9C349] transition-all">
          <div className="flex items-center justify-between text-[#E9C349]">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">{t.attendanceRate}</span>
            <Award className="w-4 h-4 text-[#E9C349]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#E9C349] pt-1">{metrics.attendancePercentage}%</div>
          <p className="text-[10px] text-gray-400">Min 85% for COC License</p>
        </div>

        {/* Current Attendance Streak */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#161619] to-black border border-amber-500/40 space-y-1 relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">{t.currentStreak}</span>
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
          </div>
          <div className="text-2xl font-mono font-bold text-white pt-1 flex items-center space-x-1">
            <span>🔥 {metrics.streak}</span>
            <span className="text-xs text-gray-400 font-normal">{t.days}</span>
          </div>
          <p className="text-[10px] text-emerald-400 font-semibold">Perfect Practice Award</p>
        </div>
      </div>

      {/* FILTER BAR & CALENDAR MONTH NAVIGATOR */}
      <div className="mt-6 p-4 rounded-2xl bg-[#161619] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        {/* Month Navigator Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-black/50 hover:bg-white/10 text-white border border-white/10 transition-colors"
            title={t.prevMonth}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="text-center px-2">
            <span className="text-base font-serif font-bold text-white">{MONTH_NAMES[activeMonth]} {activeYear}</span>
            <div className="text-[10px] text-[#E9C349] font-mono">Academic Semester 2026</div>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-black/50 hover:bg-white/10 text-white border border-white/10 transition-colors"
            title={t.nextMonth}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Year Filter */}
          <div className="flex items-center space-x-1 bg-black/50 px-3 py-1.5 rounded-xl border border-white/10">
            <Filter className="w-3 h-3 text-gray-400" />
            <select
              value={activeYear}
              onChange={(e) => setActiveYear(Number(e.target.value))}
              className="bg-transparent text-white text-xs font-mono focus:outline-none cursor-pointer"
            >
              <option value={2025} className="bg-black text-white">2025</option>
              <option value={2026} className="bg-black text-white">2026</option>
              <option value={2027} className="bg-black text-white">2027</option>
            </select>
          </div>

          {/* Month Dropdown */}
          <select
            value={activeMonth}
            onChange={(e) => setActiveMonth(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none cursor-pointer font-semibold"
          >
            {MONTH_NAMES.map((m, idx) => (
              <option key={m} value={idx} className="bg-black text-white">{m}</option>
            ))}
          </select>

          {/* Track Filter */}
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none cursor-pointer font-semibold"
          >
            <option value="all" className="bg-black text-white">{t.allPrograms}</option>
            <option value="hair" className="bg-black text-white">Hair Styling & Chemical Art</option>
            <option value="skincare" className="bg-black text-white">Skincare & Aesthetics</option>
            <option value="barber" className="bg-black text-white">Barbering Artistry</option>
            <option value="nails" className="bg-black text-white">Nail Extensions & Spa</option>
          </select>
        </div>
      </div>

      {/* HEATMAP GRID VIEW MODE */}
      {viewMode === 'heatmap' && (
        <div className="mt-6 p-6 rounded-3xl bg-[#161619] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-serif text-white flex items-center space-x-2">
                <span>GitHub-Style Daily Activity Matrix</span>
                <span className="text-xs font-mono text-[#E9C349] font-normal">({MONTH_NAMES[activeMonth]} {activeYear})</span>
              </h3>
              <p className="text-xs text-gray-400">Hover over any square block to reveal biometric check-in details and practical lab topics.</p>
            </div>
            <div className="text-[10px] font-mono text-gray-400 hidden sm:block">
              Total {monthDates.length} Training Days Rendered
            </div>
          </div>

          {/* Heatmap Grid Layout */}
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[650px] space-y-3">
              {/* Day Headers (Mon - Sun) */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-gray-400 font-bold border-b border-white/10 pb-2">
                {DAYS_OF_WEEK.map(d => (
                  <div key={d} className="py-1">{d}</div>
                ))}
              </div>

              {/* Grid Cells Matrix */}
              <div className="grid grid-cols-7 gap-2">
                {monthDates.map((dateStr, idx) => {
                  const record = currentStudent.records[dateStr] || {
                    date: dateStr,
                    dayName: '',
                    status: 'no_class',
                    program: currentStudent.program,
                    instructor: 'N/A'
                  };

                  const dayNum = new Date(dateStr).getDate();
                  const isHovered = hoveredDate === dateStr;

                  return (
                    <div
                      key={dateStr}
                      onMouseEnter={() => {
                        setHoveredRecord(record);
                        setHoveredDate(dateStr);
                      }}
                      onMouseLeave={() => {
                        setHoveredRecord(null);
                        setHoveredDate(null);
                      }}
                      className={`relative aspect-square sm:h-16 rounded-2xl p-2 flex flex-col justify-between cursor-pointer transition-all transform hover:scale-105 shadow-md ${getStatusStyle(record.status)} ${
                        isHovered ? 'ring-2 ring-white z-20 shadow-xl' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start text-[10px] font-mono font-bold">
                        <span>{dayNum}</span>
                        {record.status === 'excellent' && <span className="text-[10px]">✨</span>}
                      </div>

                      <div className="text-[9px] font-mono truncate opacity-90 font-semibold">
                        {record.status === 'present' && 'PRESENT'}
                        {record.status === 'excellent' && '100% LAB'}
                        {record.status === 'late' && 'LATE'}
                        {record.status === 'absent' && 'ABSENT'}
                        {record.status === 'holiday' && 'HOLIDAY'}
                        {record.status === 'no_class' && 'OFF'}
                      </div>

                      {/* Tooltip Hover Display */}
                      {isHovered && (
                        <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-64 p-3 rounded-2xl bg-black border border-[#E9C349] shadow-2xl text-left z-50 text-xs space-y-1.5 pointer-events-none animate-in fade-in zoom-in-95">
                          <div className="flex items-center justify-between border-b border-white/10 pb-1">
                            <span className="font-mono font-bold text-white text-[11px]">{dateStr}</span>
                            {getStatusBadge(record.status)}
                          </div>

                          <div className="space-y-1 pt-0.5 text-[11px]">
                            <div className="flex justify-between text-gray-300">
                              <span className="text-gray-400 font-mono">{t.checkIn}:</span>
                              <span className="font-mono font-bold text-emerald-400">{record.checkIn || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                              <span className="text-gray-400 font-mono">{t.checkOut}:</span>
                              <span className="font-mono font-bold text-blue-400">{record.checkOut || 'N/A'}</span>
                            </div>
                            {record.topic && (
                              <div className="text-gray-300">
                                <span className="text-gray-400 font-mono block text-[10px]">{t.topicLabel}:</span>
                                <span className="text-[#E9C349] font-serif font-bold">{record.topic}</span>
                              </div>
                            )}
                            {record.instructor && (
                              <div className="text-gray-400 text-[10px] truncate">
                                <span>{t.instructorLabel}: {record.instructor}</span>
                              </div>
                            )}
                            {record.notes && (
                              <div className="text-gray-400 text-[10px] italic border-t border-white/10 pt-1 mt-1">
                                "{record.notes}"
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* LEGEND SECTION */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <h4 className="text-xs font-bold font-mono text-[#E9C349] uppercase tracking-wider">{t.legendTitle}</h4>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-md bg-white/5 border border-white/20 inline-block"></span>
                <span>{t.noClass}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-md bg-emerald-500 border border-emerald-400 inline-block"></span>
                <span>{t.present} ({metrics.present})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-md bg-emerald-400 border-2 border-[#E9C349] inline-block shadow-[0_0_8px_rgba(233,195,73,0.8)]"></span>
                <span>{t.excellent} ({metrics.excellent})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-md bg-amber-400 inline-block"></span>
                <span>{t.late} ({metrics.late})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-md bg-red-500 inline-block"></span>
                <span>{t.absent} ({metrics.absent})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-md bg-sky-500 inline-block"></span>
                <span>{t.holiday}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MONTHLY CALENDAR VIEW MODE */}
      {viewMode === 'calendar' && (
        <div className="mt-6 p-6 rounded-3xl bg-[#161619] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-serif text-white">Monthly Attendance Calendar View</h3>
            <span className="text-xs text-[#E9C349] font-mono">{MONTH_NAMES[activeMonth]} {activeYear}</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {DAYS_OF_WEEK.map(d => (
              <div key={d} className="text-center font-mono text-xs font-bold text-gray-400 py-1">{d}</div>
            ))}
            {monthDates.map(dateStr => {
              const rec = currentStudent.records[dateStr];
              const dayNum = new Date(dateStr).getDate();
              return (
                <div key={dateStr} className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 hover:border-[#E9C349] transition-all">
                  <div className="flex justify-between items-center text-xs font-mono font-bold text-white">
                    <span>{dayNum}</span>
                    {getStatusBadge(rec?.status || 'no_class')}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate pt-1">{rec?.topic || 'Studio Practice'}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">{rec?.checkIn ? `In: ${rec.checkIn}` : 'No Session'}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAILED LOG TABLE VIEW MODE */}
      {(viewMode === 'table' || viewMode === 'heatmap') && (
        <div className="mt-6 p-6 rounded-3xl bg-[#161619] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-serif text-white">{t.detailedLogs}</h3>
              <p className="text-xs text-gray-400">Complete studio attendance logs with check-in, check-out, and instructor signatures.</p>
            </div>
            <div className="text-xs text-[#E9C349] font-mono font-bold">
              Showing {monthDates.length} Days
            </div>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-mono text-[10px] uppercase">
                  <th className="py-3 px-3">{t.date}</th>
                  <th className="py-3 px-3">{t.status}</th>
                  <th className="py-3 px-3">{t.checkIn}</th>
                  <th className="py-3 px-3">{t.checkOut}</th>
                  <th className="py-3 px-3">{t.topicLabel}</th>
                  <th className="py-3 px-3">{t.instructorLabel}</th>
                  <th className="py-3 px-3">{t.notesLabel}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {monthDates.map(dateStr => {
                  const rec = currentStudent.records[dateStr];
                  if (!rec) return null;

                  return (
                    <tr key={dateStr} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-white">{dateStr} ({rec.dayName})</td>
                      <td className="py-3 px-3">{getStatusBadge(rec.status)}</td>
                      <td className="py-3 px-3 font-mono text-emerald-400">{rec.checkIn || 'N/A'}</td>
                      <td className="py-3 px-3 font-mono text-blue-400">{rec.checkOut || 'N/A'}</td>
                      <td className="py-3 px-3 font-serif text-gray-200">{rec.topic || 'N/A'}</td>
                      <td className="py-3 px-3 text-gray-300">{rec.instructor}</td>
                      <td className="py-3 px-3 text-gray-400 italic max-w-xs truncate">{rec.notes || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
