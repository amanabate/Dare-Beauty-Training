'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Calendar, ChevronLeft, ChevronRight, Download, Printer, Search,
  CheckCircle2, XCircle, Clock, Sparkles, Award, Filter, Flame,
  Building, CalendarCheck, FileSpreadsheet, RefreshCw, X,
  ChevronDown, UserCheck, Users, Edit3
} from 'lucide-react';
import { Language, ThemeMode } from '../../types';
import { AttendanceSuccessModal } from '../modals/AttendanceSuccessModal';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AttendanceRecord {
  date: string;        // YYYY-MM-DD
  dayName: string;
  status: 'present' | 'excellent' | 'late' | 'absent' | 'excused' | 'holiday' | 'no_class';
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
  program: string;
  shift: string;
  avatar: string;
  attendanceRate?: number;
  records: Record<string, AttendanceRecord>;
}

interface AttendanceHeatmapProps {
  currentLang?: Language;
  themeMode?: ThemeMode;
  /** If set, hides the student roster and shows only this student (student role). */
  selectedStudentId?: string;
  /** Called when admin/instructor clicks a different student in the roster. */
  onSelectStudent?: (studentId: string) => void;
  isEmbedded?: boolean;
  /** 'student' = read-only, no roster. 'instructor'|'admin' = full edit + roster. */
  role?: 'student' | 'instructor' | 'admin';
}

// ─── Translations ─────────────────────────────────────────────────────────────

const T = {
  en: {
    title: 'Attendance Heatmap',
    subtitle: 'GitHub-style daily attendance matrix — hover a cell for details',
    totalClasses: 'Class Days', presentDays: 'Present', absentDays: 'Absent',
    lateDays: 'Late', excusedDays: 'Excused', attendanceRate: 'Rate',
    currentStreak: 'Streak', days: 'days',
    searchPlaceholder: 'Search student…', allPrograms: 'All Programs',
    exportReport: 'Export CSV', printReport: 'Print',
    viewGrid: 'Heatmap', viewTable: 'Log Table',
    legendTitle: 'Legend', noClass: 'No class', absent: 'Absent',
    late: 'Late', present: 'Present', excellent: 'Excellent', holiday: 'Holiday',
    excused: 'Excused', checkIn: 'Check-In', checkOut: 'Check-Out',
    instructorLabel: 'Instructor', topicLabel: 'Topic', notesLabel: 'Notes',
    prevMonth: 'Prev', nextMonth: 'Next', detailedLogs: 'Daily Log',
    status: 'Status', date: 'Date', markToday: "Mark Today's Attendance",
    submitRoll: 'Submit Roll Call', roster: 'Student Roster',
    editStatus: 'Change status', saveEdit: 'Save', cancelEdit: 'Cancel',
  },
  am: {
    title: 'የክትትል ሙቀት ካርታ', subtitle: 'ዕለታዊ የክትትል ሰሌዳ',
    totalClasses: 'ክፍሎች', presentDays: 'ተሰለፈ', absentDays: 'ቀረ',
    lateDays: 'ዘገየ', excusedDays: 'ፈቃድ', attendanceRate: 'መጠን',
    currentStreak: 'ተከታታይ', days: 'ቀናት',
    searchPlaceholder: 'ተማሪ ፈልግ…', allPrograms: 'ሁሉም',
    exportReport: 'CSV ላክ', printReport: 'አትም',
    viewGrid: 'ካርታ', viewTable: 'ሰንጠረዥ',
    legendTitle: 'ምልክቶች', noClass: 'ክፍል የለም', absent: 'ቀረ',
    late: 'ዘገየ', present: 'ተሰለፈ', excellent: 'ልዩ', holiday: 'በዓል',
    excused: 'ፈቃድ', checkIn: 'ገባ', checkOut: 'ወጣ',
    instructorLabel: 'አስተማሪ', topicLabel: 'ርዕስ', notesLabel: 'ማስታወሻ',
    prevMonth: 'ቀዳሚ', nextMonth: 'ቀጣይ', detailedLogs: 'ዝርዝር',
    status: 'ሁኔታ', date: 'ቀን', markToday: 'ዛሬ አስመዝግብ',
    submitRoll: 'ሪፖርት ላክ', roster: 'የተማሪዎች ዝርዝር',
    editStatus: 'ሁኔታ ቀይር', saveEdit: 'አስቀምጥ', cancelEdit: 'ሰርዝ',
  },
  om: {
    title: 'Kaartaa Argama', subtitle: 'Kaartaa guyyaa guyyaa',
    totalClasses: 'Kutaawwan', presentDays: 'Argame', absentDays: 'Dhabe',
    lateDays: 'Garagale', excusedDays: 'Hayyama', attendanceRate: 'Hir\'ata',
    currentStreak: 'Tartiiba', days: 'guyyoota',
    searchPlaceholder: 'Barataa barbaadi…', allPrograms: 'Hundinuu',
    exportReport: 'CSV Ergii', printReport: 'Maxxansi',
    viewGrid: 'Kaartaa', viewTable: 'Gabatee',
    legendTitle: 'Ibsa', noClass: 'Kutaa hin jiru', absent: 'Dhabe',
    late: 'Garagale', present: 'Argame', excellent: 'Addaa', holiday: 'Ayyaana',
    excused: 'Hayyama', checkIn: 'Seene', checkOut: 'Bahe',
    instructorLabel: 'Barsiisaa', topicLabel: 'Mata-duree', notesLabel: 'Yaadannoo',
    prevMonth: 'Dura', nextMonth: 'Itti aanee', detailedLogs: 'Gabaasa',
    status: 'Haala', date: 'Guyyaa', markToday: 'Har\'a galmeessi',
    submitRoll: 'Ergii', roster: 'Tarreeffama',
    editStatus: 'Haala jijjiiri', saveEdit: 'Kuusi', cancelEdit: 'Dhiisi',
  },
};

// ─── Mock data helpers ────────────────────────────────────────────────────────

const TOPICS = [
  'Chemical Relaxer & Neutralizer Science',
  'Balayage Color Melting & Foil Highlights',
  'Practical Salon Model Styling Assessment',
  'Sanitation, Autoclave & Hygiene Ethics',
  'Scalp Treatment & Keratin Infusion',
  'Advanced Braid Artistry & Extensions',
  'Facial Steaming & Ultrasound Extraction',
  'Acrylic Nail Sculpting & UV Curing',
];

const INSTRUCTORS = [
  'Selamawit Abera (Senior Hair Artistry Master)',
  'Master Tigist Assefa (Cosmetology Lead)',
  'Instructor Dawit Getachew (Barbering Director)',
  'Mimi Tadesse (Skincare & Aesthetics Specialist)',
];

function generateMockRecords(
  studentId: string,
  attendanceRatio: number,
  year = 2026,
): Record<string, AttendanceRecord> {
  const records: Record<string, AttendanceRecord> = {};
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dow = dateObj.getDay();
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      if (dow === 0) {
        records[dateStr] = { date: dateStr, dayName, status: 'no_class', program: 'N/A', instructor: 'Institute Closed' };
        continue;
      }
      if ((month === 0 && day === 7) || (month === 0 && day === 19) || (month === 8 && day === 11) || (month === 4 && day === 5)) {
        records[dateStr] = { date: dateStr, dayName, status: 'holiday', program: 'National Holiday', instructor: 'Institute Closed', notes: 'Official Ethiopian Holiday' };
        continue;
      }
      const hash = (day * 31 + month * 17 + year * 7 + studentId.charCodeAt(studentId.length - 1)) % 100;
      let status: AttendanceRecord['status'] = 'present';
      let checkIn = '08:24 AM', checkOut = '04:30 PM';
      let notes = 'Standard biometric check-in recorded.';
      if (hash > Math.floor(attendanceRatio * 100)) {
        if (hash % 3 === 0) { status = 'late'; checkIn = '09:15 AM'; notes = 'Late arrival verified by instructor.'; }
        else if (hash % 3 === 1) { status = 'absent'; checkIn = 'N/A'; checkOut = 'N/A'; notes = 'Unexcused absence.'; }
        else { status = 'excused'; checkIn = 'N/A'; checkOut = 'N/A'; notes = 'Medical certificate submitted.'; }
      } else if (hash < 20) {
        status = 'excellent'; checkIn = '08:05 AM'; checkOut = '05:00 PM'; notes = 'Perfect + 30 min bonus lab.';
      }
      records[dateStr] = {
        date: dateStr, dayName, status, checkIn, checkOut,
        program: 'Professional Hair Dressing & Advanced Styling',
        instructor: INSTRUCTORS[day % INSTRUCTORS.length],
        topic: TOPICS[day % TOPICS.length],
        durationHours: status === 'absent' || status === 'excused' ? 0 : status === 'excellent' ? 8.5 : 7.5,
        notes,
      };
    }
  }
  return records;
}

// Pre-generate records for multiple years so navigation never hits empty months.
// Keyed by year — merged at runtime when the viewed year changes.
function buildMultiYearRecords(
  studentId: string,
  attendanceRatio: number,
  years = [2025, 2026, 2027],
): Record<string, AttendanceRecord> {
  return years.reduce((acc, y) => ({ ...acc, ...generateMockRecords(studentId, attendanceRatio, y) }), {});
}

export const MOCK_STUDENTS: StudentAttendanceProfile[] = [
  {
    studentId: 'ST-2026-005',
    studentName: 'Bethlehem Worku', amharicName: 'ቤቴልሄም ወርቁ',
    program: 'Professional Hair Dressing & Advanced Styling',
    shift: 'Morning Shift (8:30 AM – 12:30 PM)', attendanceRate: 93,
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    records: buildMultiYearRecords('ST-2026-005', 0.93),
  },
  {
    studentId: 'ST-2026-012',
    studentName: 'Helen Tesfaye', amharicName: 'ሄለን ተስፋዬ',
    program: 'Esthetics, Skincare & Medical Spa Treatments',
    shift: 'Afternoon Shift (1:30 PM – 5:30 PM)', attendanceRate: 98,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    records: buildMultiYearRecords('ST-2026-012', 0.98),
  },
  {
    studentId: 'ST-2026-034',
    studentName: 'Eyerusalem Tadesse', amharicName: 'እየሩሳሌም ታደሰ',
    program: 'Nail Artistry, Extensions & Pedicure Spa',
    shift: 'Morning Shift (8:30 AM – 12:30 PM)', attendanceRate: 88,
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    records: buildMultiYearRecords('ST-2026-034', 0.88),
  },
  {
    studentId: 'ST-2026-089',
    studentName: 'Dawit Mekonnen', amharicName: 'ዳዊት መኮንን',
    program: 'Barbering Artistry, Fadings & Beard Sculpture',
    shift: 'Evening Shift (5:30 PM – 8:30 PM)', attendanceRate: 91,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    records: buildMultiYearRecords('ST-2026-089', 0.91),
  },
];

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

// Week-row labels (Mon first, like GitHub)
const DOW_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_CELL_CLASS: Record<AttendanceRecord['status'], string> = {
  excellent: 'bg-emerald-400 ring-2 ring-[#E9C349] shadow-[0_0_8px_rgba(233,195,73,0.55)]',
  present:   'bg-emerald-600 hover:bg-emerald-500',
  late:      'bg-amber-400 hover:bg-amber-300',
  absent:    'bg-red-500 hover:bg-red-400',
  excused:   'bg-blue-400 hover:bg-blue-300',
  holiday:   'bg-sky-500 hover:bg-sky-400',
  no_class:  'bg-[var(--bg-glass)] border border-[var(--border-subtle)] hover:border-[var(--border-default)]',
};

const STATUS_BADGE: Record<AttendanceRecord['status'], string> = {
  excellent: 'bg-emerald-500/20 text-emerald-300 border border-[#E9C349]',
  present:   'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  late:      'bg-amber-500/20  text-amber-300  border border-amber-500/30',
  absent:    'bg-red-500/20    text-red-400    border border-red-500/30',
  excused:   'bg-blue-500/20   text-blue-300   border border-blue-500/30',
  holiday:   'bg-sky-500/20    text-sky-300    border border-sky-500/30',
  no_class:  'bg-[var(--bg-glass)] text-[var(--text-muted)] border border-[var(--border-subtle)]',
};

const STATUS_EMOJI: Record<AttendanceRecord['status'], string> = {
  excellent: '🟢🟢', present: '🟢', late: '🟠', absent: '🔴',
  excused: '🔵', holiday: '🔵', no_class: '⚪',
};

function StatusBadge({ status }: { status: AttendanceRecord['status'] }) {
  const label =
    status === 'excellent' ? 'Excellent' :
    status === 'present'   ? 'Present'   :
    status === 'late'      ? 'Late'      :
    status === 'absent'    ? 'Absent'    :
    status === 'excused'   ? 'Excused'   :
    status === 'holiday'   ? 'Holiday'   : 'No Class';
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${STATUS_BADGE[status]}`}>
      {STATUS_EMOJI[status]} {label}
    </span>
  );
}

const ALL_EDITABLE_STATUSES: AttendanceRecord['status'][] = [
  'present', 'excellent', 'late', 'absent', 'excused',
];

// ─── GitHub/LeetCode heatmap grid builder ─────────────────────────────────────
// Builds a weeks-as-columns, days-as-rows (Mon-Sun) structure for the full year
// or a selected date range.

interface WeekCol { dates: (string | null)[] } // always 7 slots (Mon=0…Sun=6)

function buildWeekColumns(
  year: number,
  month: number, // 0-indexed; -1 = full year
): WeekCol[] {
  // Determine the date range
  const startDate = month === -1 ? new Date(year, 0, 1) : new Date(year, month, 1);
  const endDate   = month === -1
    ? new Date(year, 11, 31)
    : new Date(year, month + 1, 0);

  const cols: WeekCol[] = [];
  let cursor = new Date(startDate);

  // Pad the first week so it starts on Monday
  const firstDow = (cursor.getDay() + 6) % 7; // Mon=0
  const firstWeek: (string | null)[] = Array(firstDow).fill(null);

  while (cursor <= endDate) {
    const slot = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2,'0')}-${String(cursor.getDate()).padStart(2,'0')}`;
    firstWeek.push(slot);
    cursor.setDate(cursor.getDate() + 1);
    if (firstWeek.length === 7) break;
  }
  while (firstWeek.length < 7) firstWeek.push(null);
  cols.push({ dates: firstWeek });

  while (cursor <= endDate) {
    const week: (string | null)[] = [];
    for (let d = 0; d < 7; d++) {
      if (cursor <= endDate) {
        week.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2,'0')}-${String(cursor.getDate()).padStart(2,'0')}`);
        cursor.setDate(cursor.getDate() + 1);
      } else {
        week.push(null);
      }
    }
    cols.push({ dates: week });
  }
  return cols;
}

// ─── Cell Edit Popover ────────────────────────────────────────────────────────

interface CellPopoverProps {
  dateStr: string;
  record: AttendanceRecord;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onSave: (dateStr: string, newStatus: AttendanceRecord['status']) => void;
}

function CellEditPopover({ dateStr, record, anchorRef, onClose, onSave }: CellPopoverProps) {
  const [chosen, setChosen] = useState<AttendanceRecord['status']>(record.status);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        popRef.current && !popRef.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, anchorRef]);

  return (
    <div
      ref={popRef}
      className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-3 rounded-2xl
        bg-[var(--bg-surface)] border border-[#E9C349]/50 shadow-2xl text-xs space-y-2"
    >
      <div className="font-mono font-bold text-[var(--text-primary)] border-b border-[var(--border-default)] pb-1.5 text-[11px]">
        {dateStr}
      </div>
      <div className="space-y-1">
        {ALL_EDITABLE_STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setChosen(s)}
            className={`w-full px-2 py-1.5 rounded-xl text-left flex items-center space-x-2 transition-all text-[11px] font-semibold
              ${chosen === s ? 'bg-[#E9C349] text-black' : 'hover:bg-[var(--bg-panel)] text-[var(--text-primary)]'}`}
          >
            <span>{STATUS_EMOJI[s]}</span>
            <span className="capitalize">{s}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-2 pt-1 border-t border-[var(--border-default)]">
        <button
          onClick={() => { onSave(dateStr, chosen); onClose(); }}
          className="flex-1 py-1.5 rounded-xl bg-[#E9C349] text-black font-bold text-[10px] hover:brightness-110"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-1.5 rounded-xl bg-[var(--bg-panel)] text-[var(--text-secondary)] font-bold text-[10px] border border-[var(--border-default)]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Metrics calculator ───────────────────────────────────────────────────────

function calcMetrics(records: Record<string, AttendanceRecord>, dateKeys: string[]) {
  let totalClasses = 0, present = 0, excellent = 0, late = 0, absent = 0, excused = 0;
  let streak = 0, maxStreak = 0;
  for (const dk of dateKeys) {
    const r = records[dk];
    if (!r || r.status === 'no_class' || r.status === 'holiday') continue;
    totalClasses++;
    if (r.status === 'excellent') { excellent++; present++; streak++; }
    else if (r.status === 'present') { present++; streak++; }
    else if (r.status === 'late') { late++; streak++; }
    else if (r.status === 'excused') { excused++; streak = 0; }
    else if (r.status === 'absent') { absent++; streak = 0; }
    if (streak > maxStreak) maxStreak = streak;
  }
  const attended = present + late;
  const rate = totalClasses > 0 ? ((attended / totalClasses) * 100).toFixed(1) : '100.0';
  return { totalClasses, present, excellent, late, absent, excused, rate, streak: maxStreak || 0 };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const AttendanceHeatmap: React.FC<AttendanceHeatmapProps> = ({
  currentLang = 'en',
  themeMode = 'dark',
  selectedStudentId,
  onSelectStudent,
  isEmbedded = false,
  role = 'student',
}) => {
  const t = T[currentLang] || T.en;
  const canEdit = role === 'instructor' || role === 'admin';
  const showRoster = canEdit && !selectedStudentId;

  // ── State ────────────────────────────────────────────────────────────────────
  const [activeYear, setActiveYear]         = useState(2026);
  const [activeMonth, setActiveMonth]       = useState(7); // 0-indexed; -1 = full year
  const [activeStudentId, setActiveStudentId] =
    useState(selectedStudentId || (showRoster ? MOCK_STUDENTS[0].studentId : 'ST-2026-005'));
  const [searchQuery, setSearchQuery]       = useState('');
  const [viewMode, setViewMode]             = useState<'heatmap' | 'table'>('heatmap');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [rosterOpen, setRosterOpen]         = useState(showRoster);

  // Hover tooltip
  const [hoveredDate, setHoveredDate]       = useState<string | null>(null);
  // Cell edit popover (instructor/admin only)
  const [editDate, setEditDate]             = useState<string | null>(null);
  const editAnchorRef = useRef<HTMLDivElement | null>(null);

  // Local overrides for edited statuses (in-memory, mirrors what a real API would persist)
  const [overrides, setOverrides] =
    useState<Record<string, Record<string, AttendanceRecord['status']>>>({}); // { studentId: { dateStr: status } }

  // Attendance Submission Modal State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submittedStats, setSubmittedStats] = useState({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
    excused: 0,
  });

  const handleSubmitRollCall = () => {
    const today = new Date().toISOString().slice(0, 10);
    let present = 0;
    let late = 0;
    let absent = 0;
    let excused = 0;

    MOCK_STUDENTS.forEach(s => {
      const cur = overrides[s.studentId]?.[today] || s.records[today]?.status;
      if (cur === 'present' || cur === 'excellent') present++;
      else if (cur === 'late') late++;
      else if (cur === 'excused') excused++;
      else if (cur === 'absent') absent++;
      else present++;
    });

    setSubmittedStats({
      total: MOCK_STUDENTS.length,
      present,
      late,
      absent,
      excused,
    });
    setIsSuccessModalOpen(true);
  };

  // Sync external selectedStudentId
  useEffect(() => {
    if (selectedStudentId) setActiveStudentId(selectedStudentId);
  }, [selectedStudentId]);

  // ── Derived data ─────────────────────────────────────────────────────────────
  const filteredRoster = useMemo(() =>
    MOCK_STUDENTS.filter(s =>
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (selectedProgram === 'all' || s.program.toLowerCase().includes(selectedProgram.toLowerCase()))
    ),
  [searchQuery, selectedProgram]);

  const currentStudent = useMemo(() =>
    MOCK_STUDENTS.find(s => s.studentId === activeStudentId) || MOCK_STUDENTS[0],
  [activeStudentId]);

  // Auto-extend records if the user navigates to a year not yet generated.
  // This means navigating to 2028, 2029, etc. always produces data.
  const [extendedRecords, setExtendedRecords] = useState<Record<string, Record<string, AttendanceRecord>>>({});

  useEffect(() => {
    const yearStr = String(activeYear);
    // Check if any date from this year exists in base records
    const hasYear = Object.keys(currentStudent.records).some(dk => dk.startsWith(yearStr));
    const hasExtended = extendedRecords[activeStudentId] &&
      Object.keys(extendedRecords[activeStudentId]).some(dk => dk.startsWith(yearStr));
    if (!hasYear && !hasExtended) {
      const newYear = generateMockRecords(activeStudentId, (currentStudent.attendanceRate ?? 90) / 100, activeYear);
      setExtendedRecords(prev => ({
        ...prev,
        [activeStudentId]: { ...(prev[activeStudentId] || {}), ...newYear },
      }));
    }
  }, [activeYear, activeStudentId, currentStudent]);

  // Merge mock records + per-year extensions + user overrides
  const mergedRecords = useMemo((): Record<string, AttendanceRecord> => {
    const base = currentStudent.records;
    const ext  = extendedRecords[activeStudentId] || {};
    const ov   = overrides[activeStudentId] || {};
    const merged = { ...base, ...ext };
    for (const [dk, st] of Object.entries(ov)) {
      if (merged[dk]) merged[dk] = { ...merged[dk], status: st };
      else {
        // Override on a day not in base (e.g. today's roll call)
        const dateObj = new Date(dk);
        merged[dk] = {
          date: dk, dayName: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
          status: st, program: currentStudent.program, instructor: 'Manual Entry',
        };
      }
    }
    return merged;
  }, [currentStudent, activeStudentId, extendedRecords, overrides]);

  // Week columns for heatmap
  const weekCols = useMemo(() => buildWeekColumns(activeYear, activeMonth), [activeYear, activeMonth]);

  // Flat list of dates for the current view (for table + metrics)
  const viewDates = useMemo(() => {
    const dates: string[] = [];
    for (const wc of weekCols) {
      for (const d of wc.dates) { if (d) dates.push(d); }
    }
    return dates;
  }, [weekCols]);

  const metrics = useMemo(() => calcMetrics(mergedRecords, viewDates), [mergedRecords, viewDates]);

  // Month labels for multi-month (full-year) view
  const monthLabels = useMemo(() => {
    if (activeMonth !== -1) return [];
    const labels: { label: string; colIndex: number }[] = [];
    let prevMonth = -1;
    weekCols.forEach((wc, ci) => {
      const first = wc.dates.find(d => d !== null);
      if (!first) return;
      const m = new Date(first).getMonth();
      if (m !== prevMonth) { labels.push({ label: MONTH_NAMES[m].slice(0, 3), colIndex: ci }); prevMonth = m; }
    });
    return labels;
  }, [weekCols, activeMonth]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSelectStudent = useCallback((id: string) => {
    setActiveStudentId(id);
    if (onSelectStudent) onSelectStudent(id);
  }, [onSelectStudent]);

  const handleStatusOverride = useCallback((dateStr: string, newStatus: AttendanceRecord['status']) => {
    setOverrides(prev => ({
      ...prev,
      [activeStudentId]: { ...(prev[activeStudentId] || {}), [dateStr]: newStatus },
    }));
  }, [activeStudentId]);

  const handlePrevMonth = () => {
    if (activeMonth === 0) { setActiveMonth(11); setActiveYear(y => y - 1); }
    else if (activeMonth === -1) setActiveYear(y => y - 1);
    else setActiveMonth(m => m - 1);
  };
  const handleNextMonth = () => {
    if (activeMonth === 11) { setActiveMonth(0); setActiveYear(y => y + 1); }
    else if (activeMonth === -1) setActiveYear(y => y + 1);
    else setActiveMonth(m => m + 1);
  };

  const handleExportCSV = () => {
    const headers = ['Date','Day','Status','CheckIn','CheckOut','Topic','Instructor','Notes'];
    const rows = viewDates.map(dk => {
      const r = mergedRecords[dk];
      if (!r) return null;
      return [dk, r.dayName, r.status.toUpperCase(), r.checkIn || 'N/A', r.checkOut || 'N/A',
        `"${r.topic || ''}"`, `"${r.instructor}"`, `"${r.notes || ''}"`].join(',');
    }).filter(Boolean);
    const uri = 'data:text/csv;charset=utf-8,' + encodeURI([headers.join(','), ...rows].join('\n'));
    const a = document.createElement('a');
    a.href = uri;
    a.download = `Dare_Attendance_${currentStudent.studentName}_${MONTH_NAMES[activeMonth] || activeYear}.csv`;
    a.click();
  };

  // ── Metric cards data ─────────────────────────────────────────────────────────
  const metricCards = [
    { label: t.totalClasses, value: String(metrics.totalClasses), color: 'text-[var(--text-primary)]', border: 'border-[var(--border-default)]' },
    { label: t.presentDays,  value: String(metrics.present),      color: 'text-emerald-400',            border: 'border-emerald-500/30' },
    { label: t.lateDays,     value: String(metrics.late),         color: 'text-amber-400',              border: 'border-amber-500/30' },
    { label: t.absentDays,   value: String(metrics.absent),       color: 'text-red-400',                border: 'border-red-500/30' },
    { label: t.excusedDays,  value: String(metrics.excused),      color: 'text-blue-400',               border: 'border-blue-500/30' },
    { label: t.attendanceRate, value: `${metrics.rate}%`,         color: 'text-[#E9C349]',              border: 'border-[#E9C349]/40' },
    { label: t.currentStreak, value: `🔥 ${metrics.streak}`,      color: 'text-amber-400',              border: 'border-amber-500/30' },
  ];

  const viewLabel = activeMonth === -1
    ? `Full Year ${activeYear}`
    : `${MONTH_NAMES[activeMonth]} ${activeYear}`;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className={`w-full font-sans transition-colors ${isEmbedded ? '' : 'p-4 sm:p-6 lg:p-8 min-h-screen bg-[var(--bg-sidebar)] text-[var(--text-primary)]'}`}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[var(--border-default)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-1 rounded-full bg-[#E9C349]/20 text-[#E9C349] text-[10px] font-mono font-bold border border-[#E9C349]/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {t.title}
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">{t.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-xl overflow-hidden border border-[var(--border-default)] text-xs">
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-3 py-1.5 font-semibold transition-all ${viewMode === 'heatmap' ? 'bg-[#E9C349] text-black' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-panel)]'}`}
            >
              <CalendarCheck className="w-3.5 h-3.5 inline mr-1" />{t.viewGrid}
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 font-semibold transition-all ${viewMode === 'table' ? 'bg-[#E9C349] text-black' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-panel)]'}`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 inline mr-1" />{t.viewTable}
            </button>
          </div>

          <button onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1">
            <Download className="w-3.5 h-3.5" />{t.exportReport}
          </button>
          <button onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-bold flex items-center gap-1">
            <Printer className="w-3.5 h-3.5" />{t.printReport}
          </button>
        </div>
      </div>

      {/* ── Student info bar (roster toggle for instructor/admin) ── */}
      <div className="mt-5 p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src={currentStudent.avatar} alt={currentStudent.studentName}
            className="w-12 h-12 rounded-xl object-cover border-2 border-[#E9C349] shrink-0" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-[var(--text-primary)] text-sm">{currentStudent.studentName}</span>
              {currentStudent.amharicName && (
                <span className="text-xs text-[#E9C349] font-serif">({currentStudent.amharicName})</span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-[var(--bg-glass)] border border-[var(--border-default)] text-[10px] font-mono text-[var(--text-muted)]">
                {currentStudent.studentId}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{currentStudent.program}</p>
            <p className="text-[11px] text-[#E9C349] font-mono">{currentStudent.shift}</p>
          </div>
        </div>

        {/* Roster toggle (instructor/admin only) */}
        {canEdit && (
          <button
            onClick={() => setRosterOpen(v => !v)}
            className="px-3.5 py-2 rounded-xl border border-[var(--border-default)] text-xs font-semibold flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#E9C349]/50 transition-all"
          >
            <Users className="w-4 h-4" />
            {t.roster}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${rosterOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* ── Student Roster (instructor/admin) ── */}
      {canEdit && rosterOpen && (
        <div className="mt-3 p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-3">
          {/* Search + filter */}
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none focus:border-[#E9C349]"
              />
            </div>
            <select
              value={selectedProgram}
              onChange={e => setSelectedProgram(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] outline-none"
            >
              <option value="all">{t.allPrograms}</option>
              <option value="Hair">Hair Dressing</option>
              <option value="Skincare">Skincare & Spa</option>
              <option value="Barbering">Barbering</option>
              <option value="Nail">Nail Artistry</option>
            </select>
          </div>
          {/* Roster rows */}
          <div className="divide-y divide-[var(--border-subtle)]">
            {filteredRoster.map(s => {
              const isActive = s.studentId === activeStudentId;
              const sMetrics = calcMetrics(
                { ...(s.records), ...(Object.fromEntries(Object.entries(overrides[s.studentId] || {}).map(([dk, st]) => [dk, { ...(s.records[dk] || { date: dk, dayName: '', program: '', instructor: '' }), status: st }]))) },
                Object.keys(s.records),
              );
              return (
                <div key={s.studentId}
                  onClick={() => { handleSelectStudent(s.studentId); setRosterOpen(false); }}
                  className={`py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-[var(--bg-glass)] px-2 rounded-xl transition-all ${isActive ? 'bg-[#E9C349]/10 border-l-2 border-[#E9C349]' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <img src={s.avatar} alt={s.studentName} className="w-9 h-9 rounded-xl object-cover border border-[var(--border-default)]" />
                    <div>
                      <div className="text-xs font-bold text-[var(--text-primary)]">{s.studentName}</div>
                      <div className="text-[10px] text-[var(--text-secondary)] font-mono">{s.studentId}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-mono font-bold ${Number(sMetrics.rate) >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {sMetrics.rate}%
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      {Number(sMetrics.rate) >= 75 ? '✔ COC Eligible' : '⚠ Below 75%'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Metric cards ── */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
        {metricCards.map(mc => (
          <div key={mc.label} className={`p-3 rounded-2xl bg-[var(--bg-panel)] border ${mc.border} space-y-1`}>
            <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{mc.label}</div>
            <div className={`text-xl font-mono font-bold ${mc.color}`}>{mc.value}</div>
          </div>
        ))}
      </div>

      {/* ── Month navigator + filters ── */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)]">
        <div className="flex items-center gap-2">
          <button onClick={handlePrevMonth}
            className="p-1.5 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-serif font-bold text-[var(--text-primary)] text-sm px-1">{viewLabel}</span>
          <button onClick={handleNextMonth}
            className="p-1.5 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <select value={activeYear} onChange={e => setActiveYear(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] text-xs outline-none">
            {[2025,2026,2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={activeMonth} onChange={e => setActiveMonth(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] text-xs outline-none">
            <option value={-1}>Full Year</option>
            {MONTH_NAMES.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          HEATMAP VIEW — GitHub/LeetCode weeks-as-columns layout
          ══════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'heatmap' && (
        <div className="mt-5 p-5 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-serif font-bold text-[var(--text-primary)] text-sm">{viewLabel} · Activity Matrix</h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                {canEdit ? 'Click any class day to edit attendance status.' : 'Hover a cell for details.'}
              </p>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)] hidden sm:block shrink-0">
              {weekCols.length} weeks · {viewDates.length} days
            </span>
          </div>

          {/* Scrollable grid container */}
          <div className="overflow-x-auto pb-2 -mx-1 px-1">
            <div className="inline-block min-w-0">

              {/* Month labels (full-year mode only) */}
              {activeMonth === -1 && monthLabels.length > 0 && (
                <div className="flex mb-1" style={{ paddingLeft: '28px' }}>
                  {weekCols.map((_, ci) => {
                    const lbl = monthLabels.find(l => l.colIndex === ci);
                    return (
                      <div key={ci} style={{ width: '16px', marginRight: '3px', flexShrink: 0 }}
                        className="text-[9px] font-mono text-[var(--text-muted)] overflow-visible whitespace-nowrap">
                        {lbl ? lbl.label : ''}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Grid: row = day-of-week (Mon–Sun), col = week */}
              <div className="flex gap-0">
                {/* Day labels column */}
                <div className="flex flex-col gap-[3px] mr-1.5 shrink-0">
                  {/* Spacer to align with column month labels */}
                  {DOW_LABELS.map((d, di) => (
                    <div key={d}
                      className="text-[9px] font-mono text-[var(--text-muted)] flex items-center justify-end pr-1"
                      style={{ height: '16px' }}>
                      {di % 2 === 0 ? d : ''}
                    </div>
                  ))}
                </div>

                {/* Week columns */}
                <div className="flex gap-[3px]">
                  {weekCols.map((wc, ci) => (
                    <div key={ci} className="flex flex-col gap-[3px]">
                      {wc.dates.map((dateStr, di) => {
                        if (!dateStr) {
                          return <div key={di} style={{ width: '16px', height: '16px' }} />;
                        }
                        const rec = mergedRecords[dateStr] || {
                          date: dateStr, dayName: '', status: 'no_class' as const,
                          program: currentStudent.program, instructor: 'N/A',
                        };
                        const isHovered = hoveredDate === dateStr;
                        const isEditing = editDate === dateStr;
                        const cellRef = React.createRef<HTMLDivElement>();

                        return (
                          <div
                            key={dateStr}
                            ref={isEditing ? (el) => { if (el) (editAnchorRef as React.MutableRefObject<HTMLDivElement | null>).current = el; } : undefined}
                            className={`relative rounded-sm cursor-pointer transition-all
                              ${STATUS_CELL_CLASS[rec.status]}
                              ${isHovered ? 'ring-2 ring-white/80 z-10 scale-125' : 'hover:scale-110'}
                              ${isEditing ? 'ring-2 ring-[#E9C349] z-30 scale-125' : ''}
                            `}
                            style={{ width: '16px', height: '16px', flexShrink: 0 }}
                            onMouseEnter={() => setHoveredDate(dateStr)}
                            onMouseLeave={() => { if (!isEditing) setHoveredDate(null); }}
                            onClick={() => {
                              if (!canEdit) return;
                              if (rec.status === 'no_class' || rec.status === 'holiday') return;
                              setEditDate(prev => prev === dateStr ? null : dateStr);
                              setHoveredDate(null);
                            }}
                          >
                            {/* Hover tooltip */}
                            {isHovered && !isEditing && (
                              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 p-2.5 rounded-2xl
                                bg-[var(--bg-surface)] border border-[#E9C349]/50 shadow-2xl z-50 pointer-events-none text-[11px] space-y-1.5">
                                <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-1">
                                  <span className="font-mono font-bold text-[var(--text-primary)]">{dateStr}</span>
                                  <StatusBadge status={rec.status} />
                                </div>
                                {rec.status !== 'no_class' && rec.status !== 'holiday' && (
                                  <div className="space-y-1 text-[var(--text-secondary)]">
                                    <div className="flex justify-between">
                                      <span>{t.checkIn}:</span>
                                      <span className="font-mono text-emerald-400 font-bold">{rec.checkIn || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>{t.checkOut}:</span>
                                      <span className="font-mono text-blue-400 font-bold">{rec.checkOut || 'N/A'}</span>
                                    </div>
                                    {rec.topic && (
                                      <div className="text-[#E9C349] font-serif font-semibold text-[10px] pt-0.5 truncate">
                                        {rec.topic}
                                      </div>
                                    )}
                                  </div>
                                )}
                                {rec.notes && (
                                  <div className="text-[10px] italic text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-1">
                                    "{rec.notes}"
                                  </div>
                                )}
                                {canEdit && rec.status !== 'no_class' && rec.status !== 'holiday' && (
                                  <div className="text-[9px] text-[#E9C349] font-mono text-center pt-0.5">
                                    Click to edit status
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Edit popover */}
                            {isEditing && (
                              <CellEditPopover
                                dateStr={dateStr}
                                record={rec}
                                anchorRef={editAnchorRef as React.RefObject<HTMLDivElement>}
                                onClose={() => setEditDate(null)}
                                onSave={handleStatusOverride}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--text-secondary)]">
            <span className="font-mono font-bold text-[var(--text-muted)] text-[10px] uppercase tracking-wider">{t.legendTitle}:</span>
            {([
              ['no_class', t.noClass],
              ['present',  t.present],
              ['excellent', t.excellent],
              ['late',     t.late],
              ['absent',   t.absent],
              ['excused',  t.excused],
              ['holiday',  t.holiday],
            ] as [AttendanceRecord['status'], string][]).map(([s, lbl]) => (
              <div key={s} className="flex items-center gap-1.5">
                <span className={`w-3.5 h-3.5 rounded-sm inline-block shrink-0 ${STATUS_CELL_CLASS[s]}`} />
                <span>{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TABLE VIEW
          ══════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'table' && (
        <div className="mt-5 p-5 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-[var(--text-primary)] text-sm">{t.detailedLogs}</h3>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">{viewDates.length} days</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-default)] text-[var(--text-muted)] font-mono text-[10px] uppercase">
                  <th className="py-2.5 px-3">{t.date}</th>
                  <th className="py-2.5 px-3">{t.status}</th>
                  <th className="py-2.5 px-3">{t.checkIn}</th>
                  <th className="py-2.5 px-3">{t.checkOut}</th>
                  <th className="py-2.5 px-3 hidden md:table-cell">{t.topicLabel}</th>
                  <th className="py-2.5 px-3 hidden lg:table-cell">{t.instructorLabel}</th>
                  {canEdit && <th className="py-2.5 px-3 text-right">Edit</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {viewDates.map(dk => {
                  const r = mergedRecords[dk];
                  if (!r || r.status === 'no_class') return null;
                  const isEditing = editDate === dk;
                  return (
                    <tr key={dk} className="hover:bg-[var(--bg-glass)] transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[var(--text-primary)] font-bold whitespace-nowrap">{dk}</td>
                      <td className="py-2.5 px-3"><StatusBadge status={r.status} /></td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400">{r.checkIn || 'N/A'}</td>
                      <td className="py-2.5 px-3 font-mono text-blue-400">{r.checkOut || 'N/A'}</td>
                      <td className="py-2.5 px-3 text-[var(--text-secondary)] hidden md:table-cell max-w-[200px] truncate">{r.topic || '—'}</td>
                      <td className="py-2.5 px-3 text-[var(--text-muted)] hidden lg:table-cell max-w-[180px] truncate">{r.instructor}</td>
                      {canEdit && (
                        <td className="py-2.5 px-3 text-right relative">
                          <button
                            onClick={() => setEditDate(prev => prev === dk ? null : dk)}
                            className="p-1.5 rounded-lg border border-[var(--border-default)] hover:border-[#E9C349]/60 text-[var(--text-secondary)] hover:text-[#E9C349] transition-all"
                            title={t.editStatus}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {isEditing && (
                            <div className="relative">
                              <CellEditPopover
                                dateStr={dk}
                                record={r}
                                anchorRef={editAnchorRef as React.RefObject<HTMLDivElement>}
                                onClose={() => setEditDate(null)}
                                onSave={handleStatusOverride}
                              />
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Instructor bulk mark today ── */}
      {canEdit && (
        <div className="mt-5 p-5 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-serif font-bold text-[var(--text-primary)] text-sm">{t.markToday}</h3>
              <p className="text-xs text-[var(--text-secondary)]">{new Date().toDateString()}</p>
            </div>
            <button
              onClick={handleSubmitRollCall}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
            >
              <UserCheck className="w-4 h-4" /> {t.submitRoll}
            </button>
          </div>
          <div className="divide-y divide-[var(--border-subtle)]">
            {MOCK_STUDENTS.map(s => {
              const today = new Date().toISOString().slice(0,10);
              const cur = (overrides[s.studentId]?.[today]) || s.records[today]?.status || 'no_class';
              const statusToPick: AttendanceRecord['status'][] = ['present','late','absent','excused'];
              return (
                <div key={s.studentId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img src={s.avatar} alt={s.studentName} className="w-8 h-8 rounded-lg object-cover border border-[var(--border-default)]" />
                    <div>
                      <div className="text-xs font-bold text-[var(--text-primary)]">{s.studentName}</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono">{s.studentId}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {statusToPick.map(st => (
                      <button key={st}
                        onClick={() => handleStatusOverride(today, st)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all capitalize ${
                          cur === st
                            ? st === 'present' ? 'bg-emerald-500 text-black'
                              : st === 'late' ? 'bg-amber-400 text-black'
                              : st === 'excused' ? 'bg-blue-400 text-black'
                              : 'bg-red-500 text-white'
                            : 'bg-[var(--bg-glass)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Attendance Submission Success Modal */}
      <AttendanceSuccessModal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        dateStr={new Date().toDateString()}
        totalStudents={submittedStats.total}
        presentCount={submittedStats.present}
        lateCount={submittedStats.late}
        absentCount={submittedStats.absent}
        excusedCount={submittedStats.excused}
        sessionName={t.markToday}
        currentLang={currentLang}
      />
    </div>
  );
};
