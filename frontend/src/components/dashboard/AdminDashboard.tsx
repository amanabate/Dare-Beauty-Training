'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  UserCheck,
  CalendarCheck,
  Award,
  CreditCard,
  BarChart3,
  Globe,
  UserCog,
  Settings,
  Bell,
  Lock,
  Search,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Printer,
  Download,
  Sparkles,
  RefreshCw,
  Upload,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  FileSpreadsheet,
  Activity,
  Layers,
  AlertTriangle,
  TrendingUp,
  LogOut,
  Sun,
  Moon,
  Maximize2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  Clock,
  CheckSquare,
  DollarSign
} from 'lucide-react';
import { Language, ThemeMode, UserAccount } from '../../types';
import { exportToCSV, generatePDFReport } from '../../utils/exportUtils';
import {
  FinanceDashboard,
  InstructorPaymentArrangement,
  InstructorPaymentRecord,
  InstructorPaymentSchedule,
  StudentMonthlyPayment,
  IncomeEntry,
  ExpenseEntry,
  addMonths,
  calcFirstPaymentDue,
  monthLabel,
} from './FinanceDashboard';
import { AttendanceHeatmap } from './AttendanceHeatmap';
import { NotificationCenter } from './NotificationCenter';
import { DashboardLangDropdown } from './DashboardLangDropdown';
import { AnalyticsSection } from '../landing/AnalyticsSection';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface AdminDashboardProps {
  currentLang: Language;
  onChangeLang: (lang: Language) => void;
  themeMode: ThemeMode;
  onChangeTheme: (mode: ThemeMode) => void;
  currentUser: UserAccount | null;
  onLogout?: () => void;
  onOpenSignIn?: () => void;
  onOpenInstructorDashboard?: () => void;
  onOpenStudentDashboard?: () => void;
}

// Operational Types
type AdminTab =
  | 'overview'
  | 'students'
  | 'admissions'
  | 'programs'
  | 'instructors'
  | 'attendance'
  | 'grades'
  | 'certificates'
  | 'fees'
  | 'analytics'
  | 'settings'
  | 'notifications'
  | 'finance'
  | 'trash';

// Comprehensive Initial State Datasets
const INITIAL_STUDENTS = [
  { id: 'REG-2026-001', name: 'Abebe Kebede', gender: 'Male', course: 'Hair Dressing & Styling', duration: '3 Months', status: 'Active', phone: '+251 91 123 4567', email: 'abebe@gmail.com', attendance: 88, feeStatus: 'Pending', balance: '2,500 ETB', competency: 'Competent', regDate: '2026-05-10' },
  { id: 'REG-2026-002', name: 'Tigist Haile', gender: 'Female', course: 'Makeup Artistry', duration: '3 Months', status: 'Active', phone: '+251 92 234 5678', email: 'tigist@gmail.com', attendance: 94, feeStatus: 'Pending', balance: '1,800 ETB', competency: 'Highly Competent', regDate: '2026-05-12' },
  { id: 'REG-2026-003', name: 'Chala Bekele', gender: 'Male', course: 'Barbering & Grooming', duration: '3 Months', status: 'Active', phone: '+251 93 345 6789', email: 'chala@gmail.com', attendance: 68, feeStatus: 'Pending', balance: '3,000 ETB', competency: 'Developing Competence', regDate: '2026-05-15' },
  { id: 'REG-2026-004', name: 'Selam Alemu', gender: 'Female', course: 'Nail Care Technology', duration: '3 Months', status: 'Active', phone: '+251 94 456 7890', email: 'selam@gmail.com', attendance: 91, feeStatus: 'Pending', balance: '1,200 ETB', competency: 'Competent', regDate: '2026-05-18' },
  { id: 'REG-2026-005', name: 'Bethlehem Worku', gender: 'Female', course: 'Hair Dressing & Styling', duration: '6 Months', status: 'Graduated', phone: '+251 91 567 8901', email: 'bethlehem@gmail.com', attendance: 98, feeStatus: 'Paid', balance: '0 ETB', competency: 'Highly Competent', regDate: '2026-01-10' },
  { id: 'REG-2026-006', name: 'Kaleb Desta', gender: 'Male', course: 'Barbering & Grooming', duration: '3 Months', status: 'Graduated', phone: '+251 92 678 9012', email: 'kaleb@gmail.com', attendance: 96, feeStatus: 'Paid', balance: '0 ETB', competency: 'Highly Competent', regDate: '2026-02-01' },
  { id: 'REG-2026-007', name: 'Hiwot Tsegaye', gender: 'Female', course: 'Makeup Artistry', duration: '6 Months', status: 'Graduated', phone: '+251 93 789 0123', email: 'hiwot@gmail.com', attendance: 95, feeStatus: 'Paid', balance: '0 ETB', competency: 'Highly Competent', regDate: '2026-01-15' },
  { id: 'REG-2026-008', name: 'Dawit Tadesse', gender: 'Male', course: 'Barbering & Grooming', duration: '3 Months', status: 'At Risk', phone: '+251 94 890 1234', email: 'dawit@gmail.com', attendance: 64, feeStatus: 'Paid', balance: '0 ETB', competency: 'Developing Competence', regDate: '2026-05-20' }
];

const INITIAL_APPLICATIONS = [
  { id: 'APP-8801', name: 'Hawi Girma', phone: '+251 95 111 2233', email: 'hawi@gmail.com', program: 'Hair Dressing & Styling', duration: '3 Months', shift: 'Morning', status: 'Pending Approval', paymentReceipt: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80', date: '2026-08-04' },
  { id: 'APP-8802', name: 'Birtukan Mamo', phone: '+251 96 222 3344', email: 'birtukan@gmail.com', program: 'Makeup Artistry', duration: '6 Months', shift: 'Afternoon', status: 'Pending Approval', paymentReceipt: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80', date: '2026-08-03' },
  { id: 'APP-8803', name: 'Sileshi Bekele', phone: '+251 97 333 4455', email: 'sileshi@gmail.com', program: 'Barbering & Grooming', duration: '3 Months', shift: 'Weekend', status: 'Approved', paymentReceipt: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80', date: '2026-08-01' }
];

const INITIAL_PROGRAMS = [
  { id: 'prog-1', name: 'Hair Dressing & Styling', amharicName: 'የፀጉር አሰራር እና ስታይሊንግ', duration: '3 or 6 Months', units: 12, fee: '8,500 ETB', instructor: 'Selamawit Abera', status: 'Active' },
  { id: 'prog-2', name: 'Barbering & Men\'s Grooming', amharicName: 'የወንዶች ፀጉር ቁረጣ እና ውበት', duration: '3 Months', units: 8, fee: '7,500 ETB', instructor: 'Tigist Haile', status: 'Active' },
  { id: 'prog-3', name: 'Makeup Artistry & Cosmetics', amharicName: 'የሜካፕ ጥበብ እና ውበት', duration: '3 Months', units: 10, fee: '9,000 ETB', instructor: 'Marta Assefa', status: 'Active' },
  { id: 'prog-4', name: 'Nail Care & Art Technology', amharicName: 'የጥፍር እንክብካቤ እና ዲዛይን', duration: '3 Months', units: 6, fee: '6,000 ETB', instructor: 'Frehiwot Zewde', status: 'Active' },
  { id: 'prog-5', name: 'Beauty Therapy & Spa Spa', amharicName: 'የስፓ እና የውበት ህክምና', duration: '6 Months', units: 14, fee: '12,000 ETB', instructor: 'Marta Assefa', status: 'Active' }
];

const INITIAL_INSTRUCTORS = [
  { id: 'INS-101', name: 'Selamawit Abera', course: 'Hair Dressing & Styling', subjects: ['Hair Dressing'], phone: '+251 91 777 8899', experience: '8 Years', rating: 4.9, activeStudents: 120, status: 'Active' },
  { id: 'INS-102', name: 'Tigist Haile', course: 'Barbering & Grooming', subjects: ['Barbering'], phone: '+251 92 888 9900', experience: '6 Years', rating: 4.8, activeStudents: 95, status: 'Active' },
  { id: 'INS-103', name: 'Marta Assefa', course: 'Makeup Artistry', subjects: ['Makeup Artistry', 'Beauty Therapy'], phone: '+251 93 999 0011', experience: '10 Years', rating: 5.0, activeStudents: 85, status: 'Active' },
  { id: 'INS-104', name: 'Frehiwot Zewde', course: 'Nail Care Technology', subjects: ['Nail Technology', 'Eyelash Training'], phone: '+251 94 000 1122', experience: '5 Years', rating: 4.7, activeStudents: 60, status: 'Active' }
];

const INITIAL_CERTIFICATES = [
  { certNo: 'DARE-2026-CERT-001', studentName: 'Bethlehem Worku', program: 'Hair Dressing & Styling', issueDate: '2026-07-30', grade: 'Pass with Distinction', status: 'Issued', verificationUrl: 'https://darebeauty.edu.et/verify/DARE-2026-CERT-001' },
  { certNo: 'DARE-2026-CERT-002', studentName: 'Kaleb Desta', program: 'Barbering & Grooming', issueDate: '2026-07-30', grade: 'Pass with Merit', status: 'Issued', verificationUrl: 'https://darebeauty.edu.et/verify/DARE-2026-CERT-002' },
  { certNo: 'DARE-2026-CERT-003', studentName: 'Hiwot Tsegaye', program: 'Makeup Artistry', issueDate: '2026-07-31', grade: 'Pass with Distinction', status: 'Issued', verificationUrl: 'https://darebeauty.edu.et/verify/DARE-2026-CERT-003' }
];

const INITIAL_FAQS = [
  { id: 'faq-1', question: 'What are the admission entry requirements?', answer: 'Minimum grade 8 or 10 completion certificate, national ID card copy, and 2 passport size photos.' },
  { id: 'faq-2', question: 'Do you offer government COC certification prep?', answer: 'Yes! All courses include intensive COC practical exam preparation and official accreditation guidelines.' }
];

const INITIAL_LOGS = [
  { id: 'log-1', action: 'Approved Application', user: 'Admin User', timestamp: '10 mins ago', ip: '197.156.65.12' },
  { id: 'log-2', action: 'Recorded Tuition Payment (REC-88401)', user: 'Registrar', timestamp: '1 hour ago', ip: '197.156.65.12' },
  { id: 'log-3', action: 'Generated Certificate DARE-2026-CERT-003', user: 'Admin User', timestamp: '3 hours ago', ip: '197.156.65.12' }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentLang,
  onChangeLang,
  themeMode,
  onChangeTheme,
  currentUser,
  onLogout,
  onOpenSignIn,
  onOpenInstructorDashboard,
  onOpenStudentDashboard
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');

  // Role Protection Definitions
  const ADMIN_ONLY_TABS: AdminTab[] = ['overview', 'admissions', 'fees'];
  const isInstructor = currentUser?.role === 'Instructor';
  const isAdmin = currentUser?.role === 'Admin';
  const isUnauthenticated = !currentUser;
  const isStudentOrApplicant = currentUser?.role === 'Student' || currentUser?.role === 'Applicant';

  // Datasets State
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [programs, setPrograms] = useState(INITIAL_PROGRAMS);
  const [instructors, setInstructors] = useState(INITIAL_INSTRUCTORS);
  const [certificates, setCertificates] = useState(INITIAL_CERTIFICATES);
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [logs] = useState(INITIAL_LOGS);

  // Modal / Action states
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [addInstructorModalOpen, setAddInstructorModalOpen] = useState(false);
  const [selectedTranscriptStudent, setSelectedTranscriptStudent] = useState<typeof INITIAL_STUDENTS[0] | null>(null);
  const [selectedCertPrint, setSelectedCertPrint] = useState<typeof INITIAL_CERTIFICATES[0] | null>(null);

  // ── Trash bin ────────────────────────────────────────────────────────────
  type TrashItem = {
    id: string;
    type: 'instructor' | 'student';
    label: string;        // display name
    meta: string;         // e.g. course / subjects
    deletedAt: string;    // ISO timestamp
    payload: unknown;     // full original object for restore
  };
  const [trashedItems, setTrashedItems] = useState<TrashItem[]>([]);

  // ── Confirm-delete modal ─────────────────────────────────────────────────
  type ConfirmTarget = { id: string; label: string; type: 'instructor' | 'student' };
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget | null>(null);

  // ── Edit instructor modal ────────────────────────────────────────────────
  type InstructorRecord = typeof INITIAL_INSTRUCTORS[0];
  const [editInstructor, setEditInstructor] = useState<InstructorRecord | null>(null);
  const [editForm, setEditForm] = useState({
    name: '', phone: '', experience: '', subjects: [] as string[], status: 'Active',
  });

  // New Instructor Form State
  const PROGRAM_OPTIONS = [
    'Hair Dressing', 'Makeup Artistry', 'Nail Technology',
    'Beauty Therapy', 'Barbering', 'Eyelash Training', 'Hair Wax Training',
  ];
  const [newInstructor, setNewInstructor] = useState({
    name: '',
    phone: '',
    experience: '',
    subjects: [] as string[],
    status: 'Active',
    // Payment arrangement fields
    paymentAmount: '',
    paymentFrequency: 'Monthly' as 'Monthly',
    paymentStartDate: new Date().toISOString().slice(0, 10),
    firstPaymentDueDate: addMonths(new Date().toISOString().slice(0, 10), 1),
  });

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    name: '',
    gender: 'Female',
    course: 'Hair Dressing & Styling',
    duration: '3 Months',
    phone: '',
    email: '',
    balance: '2,500 ETB'
  });

  // ── Finance Module State ──────────────────────────────────────────────────
  const [instructorArrangements, setInstructorArrangements] = useState<InstructorPaymentArrangement[]>([]);
  // All instructor payment records (Pending + Confirmed + Cancelled)
  const [instructorPaymentRecords, setInstructorPaymentRecords] = useState<InstructorPaymentRecord[]>([]);
  const [studentMonthlyPayments, setStudentMonthlyPayments] = useState<StudentMonthlyPayment[]>([]);
  // Income and expense ledgers — ONLY hold Confirmed entries
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>([]);

  // Derive instructor payment schedules from arrangements + confirmed history
  const instructorPaymentSchedules: InstructorPaymentSchedule[] = instructorArrangements.map(arr => {
    const confirmedHistory = instructorPaymentRecords.filter(
      r => r.instructorId === arr.instructorId && r.status === 'Confirmed'
    );
    const lastPaid = confirmedHistory.length > 0 ? confirmedHistory[confirmedHistory.length - 1] : null;
    // Next due advances by 1 month from the last confirmed payment date
    const nextDueDate = lastPaid
      ? addMonths(lastPaid.paymentDate, 1)
      : arr.firstPaymentDueDate;
    const todayMs = new Date().setHours(0, 0, 0, 0);
    const dueMs   = new Date(nextDueDate).setHours(0, 0, 0, 0);
    const daysRemaining = Math.round((dueMs - todayMs) / 86_400_000);
    let status: InstructorPaymentSchedule['status'] = 'Upcoming';
    if (daysRemaining < 0)       status = 'Overdue';
    else if (daysRemaining === 0) status = 'Due Today';
    else if (daysRemaining <= 7)  status = 'Due Soon';
    else                          status = 'Upcoming';
    return {
      instructorId:    arr.instructorId,
      instructorName:  arr.instructorName,
      arrangement:     arr,
      nextDueDate,
      lastPaidDate:    lastPaid?.paymentDate ?? null,
      lastPaidAmount:  lastPaid?.amount ?? null,
      status,
      daysRemaining,
      history: instructorPaymentRecords.filter(r => r.instructorId === arr.instructorId),
    };
  });

  // ── Finance Handlers ──────────────────────────────────────────────────────

  const handleArrangementCreated = (arr: InstructorPaymentArrangement) => {
    setInstructorArrangements(prev => {
      const idx = prev.findIndex(a => a.instructorId === arr.instructorId);
      if (idx >= 0) { const u = [...prev]; u[idx] = arr; return u; }
      return [...prev, arr];
    });
  };

  /** Step 1: Admin records the payment (status = Pending, NOT yet in expenses) */
  const handleCreateInstructorPayment = (record: InstructorPaymentRecord) => {
    setInstructorPaymentRecords(prev => [...prev, record]);
  };

  /** Step 2: Admin confirms the transfer — marks Confirmed and logs to expenses */
  const handleConfirmInstructorPayment = (recordId: string, confirmedBy: string) => {
    const confirmedAt = new Date().toISOString();
    setInstructorPaymentRecords(prev =>
      prev.map(r => r.id === recordId ? { ...r, status: 'Confirmed' as const, confirmedAt, confirmedBy } : r)
    );
    // Log to confirmed expense ledger only now
    const record = instructorPaymentRecords.find(r => r.id === recordId);
    if (record) {
      setExpenseEntries(prev => [...prev, {
        id: `EXP-${Date.now()}`,
        type: 'Instructor Payment' as const,
        description: `Salary — ${record.instructorName} (${record.periodLabel})`,
        amount: record.amount,
        date: record.paymentDate,
        method: record.method,
        recipient: record.instructorName,
        reference: record.reference,
        relatedInstructorId: record.instructorId,
        notes: record.notes,
        status: 'Confirmed' as const,
        confirmedAt,
        confirmedBy,
        sourceId: record.id,
      }]);
    }
  };

  const handleCancelInstructorPayment = (recordId: string) => {
    setInstructorPaymentRecords(prev =>
      prev.map(r => r.id === recordId ? { ...r, status: 'Cancelled' as const } : r)
    );
  };

  const handleCreateStudentPayment = (p: StudentMonthlyPayment) => {
    setStudentMonthlyPayments(prev => [...prev, p]);
  };

  /** Admin approves student payment — marks Confirmed and logs to income */
  const handleApproveStudentPayment = (
    id: string, confirmedBy: string,
    paymentDate: string, method: string, reference: string, notes: string,
  ) => {
    const confirmedAt = new Date().toISOString();
    setStudentMonthlyPayments(prev => prev.map(p =>
      p.id === id ? { ...p, status: 'Confirmed' as const, paymentDate, method, reference, notes, confirmedAt, confirmedBy } : p
    ));
    const pmt = studentMonthlyPayments.find(p => p.id === id);
    if (pmt) {
      setIncomeEntries(prev => [...prev, {
        id: `INC-${Date.now()}`,
        type: 'Student Monthly Payment' as const,
        description: `Monthly fee — ${pmt.studentName} (${pmt.paymentMonth})`,
        amount: pmt.monthlyAmount,
        date: paymentDate,
        method,
        reference,
        relatedPersonId: pmt.studentId,
        relatedPersonName: pmt.studentName,
        notes,
        status: 'Confirmed' as const,
        confirmedAt,
        confirmedBy,
        sourceId: id,
      }]);
    }
  };

  /** Admin rejects student payment — does NOT touch income ledger */
  const handleRejectStudentPayment = (id: string, reason: string, confirmedBy: string) => {
    setStudentMonthlyPayments(prev => prev.map(p =>
      p.id === id ? { ...p, status: 'Rejected' as const, rejectionReason: reason, confirmedBy } : p
    ));
  };

  const handleAddIncome = (e: IncomeEntry) => {
    setIncomeEntries(prev => [...prev, e]);
  };

  const handleAddExpense = (e: ExpenseEntry) => {
    setExpenseEntries(prev => [...prev, e]);
  };

  /**
   * Called from Admissions tab when Admin approves an application.
   * Logs the registration fee as confirmed income.
   */
  const logRegistrationFeeAsIncome = (
    studentName: string, studentId: string,
    programName: string, feeAmount: number,
    approvedBy: string,
  ) => {
    if (feeAmount <= 0) return;
    const now = new Date().toISOString();
    setIncomeEntries(prev => [...prev, {
      id: `INC-REG-${Date.now()}`,
      type: 'Registration Fee' as const,
      description: `Registration fee — ${studentName} (${programName})`,
      amount: feeAmount,
      date: now.slice(0, 10),
      method: 'Telebirr',      // receipt was uploaded at application time
      reference: studentId,
      relatedPersonId: studentId,
      relatedPersonName: studentName,
      notes: 'Auto-logged on application approval',
      status: 'Confirmed' as const,
      confirmedAt: now,
      confirmedBy: approvedBy,
      sourceId: studentId,
    }]);
  };

  // Search Filtered Lists
  const filteredStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCourse = selectedCourseFilter === 'All' || s.course.includes(selectedCourseFilter);
    return matchSearch && matchCourse;
  });

  // Handlers
  const handleApproveApplication = (id: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
    const app = applications.find(a => a.id === id);
    if (app) {
      const newRegId = `REG-2026-0${students.length + 1}`;
      setStudents(prev => [
        ...prev,
        {
          id: newRegId,
          name: app.name,
          gender: 'Female',
          course: app.program,
          duration: app.duration,
          status: 'Active',
          phone: app.phone,
          email: app.email,
          attendance: 100,
          feeStatus: 'Pending',
          balance: '2,500 ETB',
          competency: 'Competent',
          regDate: new Date().toISOString().slice(0, 10)
        }
      ]);
      // Log registration fee as confirmed income in Finance
      const matchedProgram = programs.find(p => p.name === app.program);
      const feeStr = matchedProgram?.fee ?? '0 ETB';
      const feeAmount = parseInt(feeStr.replace(/[^0-9]/g, ''), 10) || 0;
      logRegistrationFeeAsIncome(
        app.name, newRegId, app.program, feeAmount,
        currentUser?.fullName || 'Admin',
      );
      alert(`Application approved! Student registered with ID: ${newRegId}`);
    }
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.phone) return;
    const newId = `REG-2026-0${students.length + 1}`;
    setStudents(prev => [
      ...prev,
      {
        id: newId,
        name: newStudent.name,
        gender: newStudent.gender as 'Male' | 'Female',
        course: newStudent.course,
        duration: newStudent.duration,
        status: 'Active',
        phone: newStudent.phone,
        email: newStudent.email || `${newStudent.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        attendance: 100,
        feeStatus: 'Pending',
        balance: newStudent.balance,
        competency: 'Competent',
        regDate: new Date().toISOString().slice(0, 10)
      }
    ]);
    setAddStudentModalOpen(false);
    setNewStudent({ name: '', gender: 'Female', course: 'Hair Dressing & Styling', duration: '3 Months', phone: '', email: '', balance: '2,500 ETB' });
  };

  const handleDeleteStudent = (id: string) => {
    const s = students.find(st => st.id === id);
    if (!s) return;
    setConfirmTarget({ id, type: 'student', label: s.name });
  };

  // Called when admin clicks "Yes, Delete" in the confirm modal
  const handleConfirmDelete = () => {
    if (!confirmTarget) return;
    const { id, type } = confirmTarget;

    // Special case: empty entire trash
    if (id === '__all__') {
      setTrashedItems([]);
      setConfirmTarget(null);
      return;
    }

    if (type === 'student') {
      const s = students.find(st => st.id === id);
      if (s) {
        setTrashedItems(prev => [{
          id: `trash-${Date.now()}`,
          type: 'student',
          label: s.name,
          meta: `${s.course} · ${s.duration}`,
          deletedAt: new Date().toISOString(),
          payload: s,
        }, ...prev]);
        setStudents(prev => prev.filter(st => st.id !== id));
      }
    }

    if (type === 'instructor') {
      const ins = instructors.find(i => i.id === id);
      if (ins) {
        setTrashedItems(prev => [{
          id: `trash-${Date.now()}`,
          type: 'instructor',
          label: ins.name,
          meta: (ins.subjects ?? [ins.course]).join(', '),
          deletedAt: new Date().toISOString(),
          payload: ins,
        }, ...prev]);
        setInstructors(prev => prev.filter(i => i.id !== id));
      }
    }

    setConfirmTarget(null);
  };

  const handleEditInstructorSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editInstructor) return;
    if (!editForm.name.trim() || !editForm.phone.trim()) return;
    if (editForm.subjects.length === 0) {
      alert('Please select at least one subject.');
      return;
    }
    setInstructors(prev => prev.map(i =>
      i.id === editInstructor.id
        ? { ...i, ...editForm, course: editForm.subjects[0] }
        : i
    ));
    setEditInstructor(null);
  };

  const handleAddInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstructor.name.trim() || !newInstructor.phone.trim()) return;
    if (newInstructor.subjects.length === 0) {
      alert('Please select at least one subject the instructor teaches.');
      return;
    }
    const newId = `INS-${100 + instructors.length + 1}`;
    setInstructors(prev => [
      ...prev,
      {
        id: newId,
        name: newInstructor.name.trim(),
        course: newInstructor.subjects[0],           // primary course (legacy field)
        subjects: newInstructor.subjects,
        phone: newInstructor.phone.trim(),
        experience: newInstructor.experience.trim() || '1 Year',
        rating: 4.5,
        activeStudents: 0,
        status: newInstructor.status,
      },
    ]);
    // Create payment arrangement if amount is provided
    if (newInstructor.paymentAmount && parseFloat(newInstructor.paymentAmount) > 0) {
      const startDate = newInstructor.paymentStartDate || new Date().toISOString().slice(0, 10);
      const arr: InstructorPaymentArrangement = {
        instructorId: newId,
        instructorName: newInstructor.name.trim(),
        paymentAmount: parseFloat(newInstructor.paymentAmount),
        paymentFrequency: 'Monthly',
        paymentStartDate: startDate,
        firstPaymentDueDate: newInstructor.firstPaymentDueDate || calcFirstPaymentDue(startDate),
      };
      handleArrangementCreated(arr);
    }
    setAddInstructorModalOpen(false);
    setNewInstructor({
      name: '', phone: '', experience: '', subjects: [], status: 'Active',
      paymentAmount: '', paymentFrequency: 'Monthly',
      paymentStartDate: new Date().toISOString().slice(0, 10),
      firstPaymentDueDate: addMonths(new Date().toISOString().slice(0, 10), 1),
    });
  };

  const handleGenerateCertificate = (student: typeof INITIAL_STUDENTS[0]) => {
    const certNum = `DARE-2026-CERT-00${certificates.length + 1}`;
    const newCert = {
      certNo: certNum,
      studentName: student.name,
      program: student.course,
      issueDate: new Date().toISOString().slice(0, 10),
      grade: student.attendance > 90 ? 'Pass with Distinction' : 'Pass with Merit',
      status: 'Issued',
      verificationUrl: `https://darebeauty.edu.et/verify/${certNum}`
    };
    setCertificates(prev => [newCert, ...prev]);
    setSelectedCertPrint(newCert);
  };

  // Transcript modal — opens in-dashboard (same pattern as Certificate modal)
  const openTranscript = (student: typeof INITIAL_STUDENTS[0]) => {
    setSelectedTranscriptStudent(student);
  };

  // Print helper used inside the transcript modal
  const printTranscriptModal = (student: typeof INITIAL_STUDENTS[0]) => {
    const win = window.open('', '_blank');
    if (!win) return;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Academic Transcript - ${student.name}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #111; }
            .header { border-bottom: 2px solid #D4AF37; padding-bottom: 20px; text-align: center; }
            .title { font-size: 22px; font-weight: bold; font-family: serif; color: #111; }
            .sub { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
            .meta { margin: 25px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #111; color: #D4AF37; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; }
            td { padding: 10px; border-bottom: 1px solid #eee; font-size: 12px; }
            .stamp { margin-top: 50px; text-align: right; font-weight: bold; color: #D4AF37; border-top: 1px solid #ddd; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">DARE WOMEN'S & MEN'S BEAUTY INSTITUTE</div>
            <div class="sub">Official Academic Transcript & Practical Assessment Report</div>
          </div>
          <div class="meta">
            <div><strong>Student ID:</strong> ${student.id}</div>
            <div><strong>Full Name:</strong> ${student.name}</div>
            <div><strong>Program:</strong> ${student.course}</div>
            <div><strong>Duration:</strong> ${student.duration}</div>
            <div><strong>Overall Attendance:</strong> ${student.attendance}%</div>
            <div><strong>Competency Status:</strong> ${student.competency}</div>
          </div>
          <table>
            <thead>
              <tr><th>Training Unit Module</th><th>Hours</th><th>Practical Score</th><th>Grade Result</th></tr>
            </thead>
            <tbody>
              <tr><td>Safety, Sanitation & Hygiene Protocols</td><td>40 Hours</td><td>98%</td><td>Highly Competent</td></tr>
              <tr><td>Professional Hair Cutting & Blowdry Techniques</td><td>80 Hours</td><td>92%</td><td>Competent</td></tr>
              <tr><td>Chemical Processing, Dyeing & Weaving</td><td>70 Hours</td><td>95%</td><td>Highly Competent</td></tr>
              <tr><td>Client Care & Beauty Salon Ethics</td><td>30 Hours</td><td>96%</td><td>Highly Competent</td></tr>
            </tbody>
          </table>
          <div class="stamp">
            <div>Authorized Registrar Signature & Seal</div>
            <div>Dare Beauty Institute • Tsara Tsion, Burayu, Sheger City</div>
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
      {/* Top Navigation Bar */}
      <header className="bg-[var(--bg-panel)] border-b border-[#E9C349]/30 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <img
              src="/images/dareLogo.jpeg"
              alt="Dare Institute Logo"
              className="w-10 h-10 rounded-full object-cover border border-[#E9C349]/40 shadow-lg shrink-0"
            />
          <div>
            <h1 className="text-base font-serif font-bold text-[var(--text-primary)] tracking-wide flex items-center gap-2">
              Dare Beauty Institute
              <span className="px-2 py-0.5 rounded-full bg-[#E9C349]/20 text-[#E9C349] font-mono text-[10px] font-bold uppercase border border-[#E9C349]/30">
                Enterprise Admin Portal
              </span>
            </h1>
            <p className="text-[11px] text-[var(--text-secondary)]">
              ደሬ የሴቶች እና የወንዶች የውበት ሙያ ማሰልጠኛ ተቋም
            </p>
          </div>
        </div>

        {/* Top Controls & Profile Info */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Active Role Status Badge */}
          {currentUser && (
            <div className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center space-x-1 border ${
              isAdmin
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : isInstructor
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{currentUser.role} Role</span>
            </div>
          )}

          {/* Global Search Bar */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search records, students, certs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/50 text-xs pl-8 pr-4 py-1.5 rounded-xl border border-[var(--border-default)] text-[var(--text-primary)] placeholder-gray-400 outline-none focus:border-[#E9C349] w-64"
            />
          </div>

          {/* Language Dropdown */}
          <DashboardLangDropdown currentLang={currentLang} onChangeLang={onChangeLang} />

          {/* Theme Switcher */}
          <button
            onClick={() => onChangeTheme(themeMode === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] transition-all border border-[var(--border-default)]"
            title="Toggle Light/Dark Theme"
          >
            {themeMode === 'light' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#E9C349]" />}
          </button>

          {/* Notifications Bell — lives in dashboard, not landing page */}
          <NotificationCenter
            currentLang={currentLang}
            onOpenApply={() => {}}
          />

          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container Layout (Sidebar + Main Workspace Pane) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border-default)] flex flex-col justify-between shrink-0 overflow-y-auto p-3">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest font-bold flex items-center justify-between">
              <span>Core Modules</span>
              {isInstructor && <span className="text-amber-400 font-bold text-[9px]">Restricted</span>}
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </div>
              {isInstructor && <Lock className="w-3.5 h-3.5 text-amber-400" aria-label="Admin Only Page" />}
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
              <span>Student Management</span>
              <span className="ml-auto font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{students.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('admissions')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                activeTab === 'admissions'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4" />
                <span>Admissions & Verification</span>
              </div>
              {isInstructor ? (
                <Lock className="w-3.5 h-3.5 text-amber-400" aria-label="Admin Only Page" />
              ) : (
                applications.filter(a => a.status === 'Pending Approval').length > 0 && (
                  <span className="font-mono text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-bold">
                    {applications.filter(a => a.status === 'Pending Approval').length}
                  </span>
                )
              )}
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
              <span>Training Programs (3/6 Mo)</span>
            </button>

            <button
              onClick={() => setActiveTab('instructors')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'instructors'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Instructor Roster</span>
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
              <span>Daily Attendance Logs</span>
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
              onClick={() => setActiveTab('certificates')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'certificates'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Certificates Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('fees')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                activeTab === 'fees'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <CreditCard className="w-4 h-4" />
                <span>Fee & Receipts Manager</span>
              </div>
              {isInstructor && <Lock className="w-3.5 h-3.5 text-amber-400" aria-label="Admin Only Page" />}
            </button>

            <div className="pt-3 px-3 py-2 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest font-bold">
              System
            </div>

            <button
              onClick={() => setActiveTab('finance')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                activeTab === 'finance'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <DollarSign className="w-4 h-4" />
                <span>Finance</span>
              </div>
              {instructorPaymentSchedules.some(s => s.status === 'Overdue' || s.status === 'Due Today') && (
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#E9C349] text-black shadow-md font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Institute Analytics</span>
            </button>





            {/* ── Trash ── */}
            <button
              onClick={() => setActiveTab('trash')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                activeTab === 'trash'
                  ? 'bg-red-500/20 text-red-400 shadow-md font-bold border border-red-500/30'
                  : 'text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Trash2 className="w-4 h-4" />
                <span>Trash / Deleted Items</span>
              </div>
              {trashedItems.length > 0 && (
                <span className="font-mono text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                  {trashedItems.length}
                </span>
              )}
            </button>
          </div>

          {/* User Footer info inside Sidebar */}
          <div className="pt-3 border-t border-[var(--border-default)] mt-4 space-y-2">
            <div className="p-3 rounded-2xl bg-white/5 border border-[var(--border-default)] flex items-center space-x-3">
              <img
                src="/images/dareLogo.jpeg"
                alt="Dare"
                className="w-8 h-8 rounded-full object-cover border border-[#E9C349]/40 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-[var(--text-primary)] truncate">{currentUser?.fullName || 'Super Administrator'}</div>
                <div className="text-[10px] text-[var(--text-secondary)] font-mono">Role: {currentUser?.role || 'System Admin'}</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Workspace Panel */}
        <main className="flex-1 bg-[var(--bg-card)] text-[var(--text-primary)] overflow-y-auto p-6">
          {/* GUARD 1: Unauthenticated or Non-Staff Role Guard */}
          {(isUnauthenticated || isStudentOrApplicant) ? (
            <div className="max-w-2xl mx-auto py-16 px-6">
              <div className="p-8 rounded-3xl bg-[var(--bg-panel)] border border-[#E9C349]/40 shadow-2xl space-y-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#E9C349]/20 text-[#E9C349] border border-[#E9C349]/30 flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-[#E9C349]/20 text-[#E9C349] font-mono text-xs font-bold uppercase tracking-wider border border-[#E9C349]/30">
                    Route Protection Policy Active
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-[var(--text-primary)] pt-1">
                    Admin Portal Authentication Required
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                    The Enterprise Admin Dashboard is restricted to authorized <strong className="text-[#E9C349]">Admin</strong> accounts. {isStudentOrApplicant ? `Your account role is currently set to '${currentUser?.role}'.` : 'Please sign in with Admin credentials.'}
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  {onOpenSignIn && (
                    <button
                      onClick={onOpenSignIn}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:bg-[#F5D468] shadow-lg flex items-center justify-center space-x-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Sign In as Admin</span>
                    </button>
                  )}
                  <button
                    onClick={() => router.push('/')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 text-[var(--text-primary)] font-semibold text-xs hover:bg-white/20 border border-[var(--border-default)]"
                  >
                    Exit Portal
                  </button>
                </div>
              </div>
            </div>
          ) : isInstructor && ADMIN_ONLY_TABS.includes(activeTab) ? (
            /* GUARD 2: Instructor Restricted Management Tab Guard */
            <div className="max-w-3xl mx-auto py-12 px-6">
              <div className="p-8 rounded-3xl bg-[var(--bg-panel)] border border-amber-500/40 shadow-2xl space-y-6 text-center relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner">
                  <ShieldAlert className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                    Route Protection Policy Active
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-[var(--text-primary)] pt-1">
                    Admin Management Access Restricted
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
                    Access to institute management pages (<span className="text-[#E9C349] font-mono font-bold uppercase">{activeTab}</span>) is restricted to <strong className="text-[var(--text-primary)]">Admin</strong> role privileges. Your role is <strong className="text-[#E9C349]">Instructor</strong>, which is restricted to class-related activities.
                  </p>
                </div>

                {/* Authorized Class Activities Quick Links */}
                <div className="p-4 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-subtle)] text-left space-y-3">
                  <div className="text-[11px] font-mono text-[var(--text-secondary)] uppercase font-bold flex items-center space-x-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Your Authorized Class-Related Activities:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <button
                      onClick={() => setActiveTab('students')}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-[#E9C349] hover:text-black border border-[var(--border-default)] text-gray-200 transition-all font-semibold flex items-center space-x-2"
                    >
                      <Users className="w-4 h-4 text-[#E9C349]" />
                      <span>Student Roster</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('attendance')}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-[#E9C349] hover:text-black border border-[var(--border-default)] text-gray-200 transition-all font-semibold flex items-center space-x-2"
                    >
                      <CalendarCheck className="w-4 h-4 text-[#E9C349]" />
                      <span>Attendance Logs</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('grades')}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-[#E9C349] hover:text-black border border-[var(--border-default)] text-gray-200 transition-all font-semibold flex items-center space-x-2"
                    >
                      <Award className="w-4 h-4 text-[#E9C349]" />
                      <span>Grades & Competency</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('programs')}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-[#E9C349] hover:text-black border border-[var(--border-default)] text-gray-200 transition-all font-semibold flex items-center space-x-2"
                    >
                      <BookOpen className="w-4 h-4 text-[#E9C349]" />
                      <span>Syllabus Tracks</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('certificates')}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-[#E9C349] hover:text-black border border-[var(--border-default)] text-gray-200 transition-all font-semibold flex items-center space-x-2"
                    >
                      <Award className="w-4 h-4 text-[#E9C349]" />
                      <span>Certificates View</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-[#E9C349] hover:text-black border border-[var(--border-default)] text-gray-200 transition-all font-semibold flex items-center space-x-2"
                    >
                      <BarChart3 className="w-4 h-4 text-[#E9C349]" />
                      <span>Cohort Analytics</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveTab('students')}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E9C349] text-black font-bold text-xs hover:brightness-110 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <span>Go to Class Activities (Student Roster)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  {onOpenInstructorDashboard && (
                    <button
                      onClick={() => {
                        onOpenInstructorDashboard();
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text-primary)] font-bold text-xs flex items-center justify-center space-x-2 border border-[var(--border-default)]"
                    >
                      <UserCheck className="w-4 h-4 text-[#E9C349]" />
                      <span>Open Dedicated Instructor Portal</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Instructor Restricted Mode Informational Banner */}
              {isInstructor && (
                <div className="p-3 mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>Instructor Restricted Mode:</strong> You are accessing class-related activities. Institute management pages are locked.
                    </span>
                  </div>
                  {onOpenInstructorDashboard && (
                    <button
                      onClick={() => {
                        onOpenInstructorDashboard();
                      }}
                      className="px-3 py-1 rounded-xl bg-[#E9C349] text-black font-bold text-[11px] hover:bg-[#F5D468] shrink-0 ml-2 shadow-sm"
                    >
                      Open Instructor Portal
                    </button>
                  )}
                </div>
              )}

              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Dashboard Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[var(--bg-base)] via-[var(--bg-panel)] to-[var(--bg-base)] border border-[#E9C349]/40 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center space-x-2 text-[#E9C349] text-xs font-mono font-bold uppercase tracking-widest mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Live Operational Command Center</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
                    Welcome back, {currentUser?.fullName || 'Institute Director'}
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">
                    Monitoring 1,455 active students across 5 accredited vocational beauty programs in Addis Ababa, Ethiopia.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setAddStudentModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E9C349] text-black font-bold text-xs shadow-lg hover:brightness-110 transition-all flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Register New Student</span>
                  </button>
                </div>
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] hover:border-[#E9C349]/40 transition-all">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-bold">Total Students</span>
                  <div className="text-2xl font-mono font-bold text-[var(--text-primary)] mt-1">1,455</div>
                  <span className="text-[10px] text-emerald-400 font-bold">+18.4% this term</span>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] hover:border-[#E9C349]/40 transition-all">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-bold">Active Programs</span>
                  <div className="text-2xl font-mono font-bold text-[#E9C349] mt-1">5 Tracks</div>
                  <span className="text-[10px] text-[var(--text-secondary)]">3 & 6 Months Duration</span>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] hover:border-[#E9C349]/40 transition-all">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-bold">Instructors</span>
                  <div className="text-2xl font-mono font-bold text-[var(--text-primary)] mt-1">14 Staff</div>
                  <span className="text-[10px] text-emerald-400 font-bold">100% Certified</span>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] hover:border-[#E9C349]/40 transition-all">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-bold">Pending Admissions</span>
                  <div className="text-2xl font-mono font-bold text-amber-400 mt-1">
                    {applications.filter(a => a.status === 'Pending Approval').length}
                  </div>
                  <span className="text-[10px] text-amber-400 font-bold">Needs Review</span>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] hover:border-[#E9C349]/40 transition-all">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-bold">Certificates Issued</span>
                  <div className="text-2xl font-mono font-bold text-[var(--text-primary)] mt-1">480+</div>
                  <span className="text-[10px] text-[var(--text-secondary)]">COC Verified</span>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] hover:border-[#E9C349]/40 transition-all">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-bold">Monthly Revenue</span>
                  <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">420K ETB</div>
                  <span className="text-[10px] text-emerald-400 font-bold">+12% vs July</span>
                </div>
              </div>

              {/* Recent Activity Logs Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)]">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center justify-between">
                    <span>Recent Student Registrations</span>
                    <button onClick={() => setActiveTab('students')} className="text-xs text-[#E9C349] hover:underline">View All</button>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--border-default)] text-[var(--text-secondary)] uppercase font-mono text-[10px]">
                          <th className="py-2">ID</th>
                          <th className="py-2">Student Name</th>
                          <th className="py-2">Course Track</th>
                          <th className="py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-subtle)]">
                        {students.slice(0, 5).map(s => (
                          <tr key={s.id} className="hover:bg-white/5">
                            <td className="py-2 font-mono text-[#E9C349] font-bold">{s.id}</td>
                            <td className="py-2 font-semibold text-[var(--text-primary)]">{s.name}</td>
                            <td className="py-2 text-[var(--text-secondary)]">{s.course}</td>
                            <td className="py-2">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)]">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center justify-between">
                    <span>Audit Trail Log</span>
                    <Activity className="w-4 h-4 text-[#E9C349]" />
                  </h3>
                  <div className="space-y-3">
                    {logs.map(log => (
                      <div key={log.id} className="p-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-subtle)] text-xs">
                        <div className="font-bold text-[var(--text-primary)]">{log.action}</div>
                        <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] mt-1">
                          <span>By: {log.user}</span>
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDENTS */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Student Management Directory</h2>
                  <p className="text-xs text-[var(--text-secondary)]">View, register, edit, or check official academic status for enrolled students.</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => exportToCSV('Students_Registry', ['ID', 'Name', 'Gender', 'Course', 'Status', 'Phone', 'Attendance'], filteredStudents.map(s => [s.id, s.name, s.gender, s.course, s.status, s.phone, `${s.attendance}%`]))}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-[var(--text-primary)] font-bold text-xs flex items-center space-x-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => setAddStudentModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#E9C349] text-black font-bold text-xs flex items-center space-x-1.5 hover:bg-[#F5D468]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Student</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-[var(--bg-panel)] rounded-3xl border border-[var(--border-default)] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-black/50 text-[#E9C349] font-mono text-[10px] uppercase border-b border-[var(--border-default)]">
                      <th className="p-3.5">Student ID</th>
                      <th className="p-3.5">Full Name</th>
                      <th className="p-3.5">Course Program</th>
                      <th className="p-3.5">Duration</th>
                      <th className="p-3.5">Attendance</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {filteredStudents.map(s => (
                      <tr key={s.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5 font-mono text-[#E9C349] font-bold">{s.id}</td>
                        <td className="p-3.5 font-semibold text-[var(--text-primary)]">{s.name}</td>
                        <td className="p-3.5 text-[var(--text-secondary)]">{s.course}</td>
                        <td className="p-3.5 text-[var(--text-secondary)] font-mono">{s.duration}</td>
                        <td className="p-3.5 font-mono">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${s.attendance < 75 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {s.attendance}%
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[var(--text-primary)] text-[10px] font-bold">
                            {s.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => openTranscript(s)}
                            className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-semibold hover:bg-white/20 text-[#E9C349]"
                            title="Generate Academic Transcript"
                          >
                            Transcript
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(s.id)}
                            className="p-1 rounded-lg hover:bg-red-500/20 text-red-400"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ADMISSIONS */}
          {activeTab === 'admissions' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Online Application & Payment Verification</h2>
                <p className="text-xs text-[var(--text-secondary)]">Review pending admissions, verify uploaded receipt screenshots, and assign registration numbers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((app) => (
                  <div key={app.id} className="p-5 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] text-[#E9C349] font-bold">{app.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[var(--text-primary)]">{app.name}</h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{app.phone} • {app.email}</p>

                      <div className="mt-3 p-3 rounded-2xl bg-black/40 text-xs space-y-1 font-mono">
                        <div><span className="text-[var(--text-muted)]">Program:</span> {app.program}</div>
                        <div><span className="text-[var(--text-muted)]">Shift:</span> {app.shift} ({app.duration})</div>
                        <div><span className="text-[var(--text-muted)]">Applied:</span> {app.date}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedReceiptUrl(app.paymentReceipt)}
                        className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#E9C349] font-semibold flex items-center justify-center space-x-1 border border-[var(--border-default)]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Payment Screenshot</span>
                      </button>

                      {app.status !== 'Approved' && (
                        <button
                          onClick={() => handleApproveApplication(app.id)}
                          className="w-full py-2 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:bg-[#F5D468] transition-all"
                        >
                          Approve & Assign ID
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROGRAMS */}
          {activeTab === 'programs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Training Programs Curriculum</h2>
                  <p className="text-xs text-[var(--text-secondary)]">Manage 3-month and 6-month vocational qualification tracks & syllabus units.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {programs.map(p => (
                  <div key={p.id} className="p-6 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-[#E9C349]/10 text-[#E9C349] font-mono text-[10px] font-bold uppercase">
                        {p.duration}
                      </span>
                      <span className="text-sm font-mono font-bold text-emerald-400">{p.fee}</span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">{p.name}</h3>
                      <p className="text-xs text-[var(--text-secondary)] font-serif italic mt-0.5">{p.amharicName}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/40 text-xs space-y-1 font-mono text-[var(--text-secondary)]">
                      <div><span className="text-[var(--text-muted)]">Units Included:</span> {p.units} Practical Modules</div>
                      <div><span className="text-[var(--text-muted)]">Lead Instructor:</span> {p.instructor}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: INSTRUCTORS */}
          {activeTab === 'instructors' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Instructor Faculty Roster</h2>
                  <p className="text-xs text-[var(--text-secondary)]">Assigned beauty professionals and master trainers.</p>
                </div>
                <button
                  onClick={() => setAddInstructorModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#E9C349] text-black font-bold text-xs flex items-center space-x-1.5 hover:bg-[#F5D468] transition-all shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Instructor</span>
                </button>
              </div>

              {/* Stats bar */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] text-center">
                  <div className="text-2xl font-bold text-[#E9C349] font-mono">{instructors.length}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] uppercase font-mono mt-0.5">Total Instructors</div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] text-center">
                  <div className="text-2xl font-bold text-emerald-400 font-mono">{instructors.filter(i => i.status === 'Active').length}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] uppercase font-mono mt-0.5">Active</div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] text-center">
                  <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">
                    {instructors.reduce((s, i) => s + i.activeStudents, 0)}
                  </div>
                  <div className="text-[10px] text-[var(--text-secondary)] uppercase font-mono mt-0.5">Total Students Taught</div>
                </div>
              </div>

              {/* Instructor cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {instructors.map(ins => (
                  <motion.div
                    key={ins.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] hover:border-[#E9C349]/40 transition-all space-y-4"
                  >
                    {/* Avatar + status */}
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#E9C349] text-black font-bold flex items-center justify-center text-lg font-serif shadow">
                        {ins.name.charAt(0)}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        ins.status === 'Active'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}>
                        {ins.status}
                      </span>
                    </div>

                    {/* Name + ID */}
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)] leading-tight">{ins.name}</h3>
                      <p className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">{ins.id}</p>
                    </div>

                    {/* Subjects taught */}
                    <div>
                      <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-1.5">Teaches</p>
                      <div className="flex flex-wrap gap-1">
                        {(ins.subjects ?? [ins.course]).map((subj: string, si: number) => (
                          <span key={si} className="px-2 py-0.5 rounded-full bg-[#E9C349]/15 text-[#D4AF37] text-[10px] font-bold border border-[#E9C349]/25">
                            {subj}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[var(--text-secondary)]">
                      <div className="p-2 rounded-xl bg-black/20 text-center">
                        <div className="font-bold text-[var(--text-primary)]">{ins.experience}</div>
                        <div className="text-[9px] uppercase">Experience</div>
                      </div>
                      <div className="p-2 rounded-xl bg-black/20 text-center">
                        <div className="font-bold text-[var(--text-primary)]">{ins.activeStudents}</div>
                        <div className="text-[9px] uppercase">Students</div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
                      <Phone className="w-3 h-3 text-[#E9C349]" />
                      <span className="font-mono">{ins.phone}</span>
                    </div>

                    {/* Edit + Delete buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditInstructor(ins);
                          setEditForm({
                            name: ins.name,
                            phone: ins.phone,
                            experience: ins.experience,
                            subjects: ins.subjects ?? [ins.course],
                            status: ins.status,
                          });
                        }}
                        className="flex-1 py-1.5 rounded-xl bg-[#E9C349]/10 hover:bg-[#E9C349]/20 text-[#D4AF37] text-[11px] font-bold flex items-center justify-center gap-1 transition-all border border-[#E9C349]/20"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => setConfirmTarget({ id: ins.id, type: 'instructor', label: ins.name })}
                        className="flex-1 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              {/* GitHub-Style Attendance Heatmap Component */}
              <AttendanceHeatmap
                currentLang={currentLang}
                themeMode={themeMode}
                isEmbedded={true}
                role="admin"
              />
            </div>
          )}

          {/* TAB 7: GRADES */}
          {activeTab === 'grades' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Practical Competency & Transcript Center</h2>
                <p className="text-xs text-[var(--text-secondary)]">Grade practical assessments and generate transcripts.</p>
              </div>

              <div className="bg-[var(--bg-panel)] rounded-3xl border border-[var(--border-default)] p-6">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[#E9C349] font-mono text-[10px] uppercase border-b border-[var(--border-default)]">
                      <th className="py-3">Student ID</th>
                      <th className="py-3">Full Name</th>
                      <th className="py-3">Competency Badge</th>
                      <th className="py-3 text-right">Transcript</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {students.map(s => (
                      <tr key={s.id}>
                        <td className="py-3 font-mono text-[#E9C349]">{s.id}</td>
                        <td className="py-3 font-semibold text-[var(--text-primary)]">{s.name}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#E9C349]/20 text-[#E9C349] text-[10px] font-bold">
                            {s.competency}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => openTranscript(s)}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-[var(--text-primary)]"
                          >
                            Print Transcript
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Official Certificate Generator & Verification</h2>
                  <p className="text-xs text-[var(--text-secondary)]">Issue accredited certificates for completed training programs.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map(c => (
                  <div key={c.certNo} className="p-5 rounded-3xl bg-[var(--bg-panel)] border border-[#E9C349]/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#E9C349] font-bold">{c.certNo}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">{c.status}</span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[var(--text-primary)]">{c.studentName}</h3>
                      <p className="text-xs text-[var(--text-secondary)]">{c.program}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 text-[11px] font-mono text-[var(--text-secondary)]">
                      <div>Issued Date: {c.issueDate}</div>
                      <div>Grade: {c.grade}</div>
                    </div>

                    <button
                      onClick={() => setSelectedCertPrint(c)}
                      className="w-full py-2 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:bg-[#F5D468]"
                    >
                      View & Print Certificate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: FEES */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Tuition & Financial Receipts Log</h2>
                <p className="text-xs text-[var(--text-secondary)]">Track paid installments, outstanding balances, and financial summaries.</p>
              </div>

              <div className="bg-[var(--bg-panel)] rounded-3xl border border-[var(--border-default)] p-6">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[#E9C349] font-mono text-[10px] uppercase border-b border-[var(--border-default)]">
                      <th className="py-3">Student</th>
                      <th className="py-3">Course</th>
                      <th className="py-3">Outstanding Balance</th>
                      <th className="py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {students.map(s => (
                      <tr key={s.id}>
                        <td className="py-3 font-semibold text-[var(--text-primary)]">{s.name}</td>
                        <td className="py-3 text-[var(--text-secondary)]">{s.course}</td>
                        <td className="py-3 font-mono font-bold text-amber-400">{s.balance}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.feeStatus === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {s.feeStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: FINANCE */}
          {activeTab === 'finance' && (
            <FinanceDashboard
              currentLang={currentLang}
              currentUserName={currentUser?.fullName || 'Admin'}
              instructors={instructors}
              students={students}
              instructorArrangements={instructorArrangements}
              instructorPaymentSchedules={instructorPaymentSchedules}
              instructorPaymentRecords={instructorPaymentRecords}
              onCreateInstructorPayment={handleCreateInstructorPayment}
              onConfirmInstructorPayment={handleConfirmInstructorPayment}
              onCancelInstructorPayment={handleCancelInstructorPayment}
              studentMonthlyPayments={studentMonthlyPayments}
              onCreateStudentPayment={handleCreateStudentPayment}
              onApproveStudentPayment={handleApproveStudentPayment}
              onRejectStudentPayment={handleRejectStudentPayment}
              incomeEntries={incomeEntries}
              onAddIncome={handleAddIncome}
              expenseEntries={expenseEntries}
              onAddExpense={handleAddExpense}
            />
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1 pb-2">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Institute Analytics & Data Insights</h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Real-time enrollment, attendance trends, and course popularity metrics.</p>
                </div>
              </div>
              {/* Reuse the full AnalyticsSection component — it handles its own charts and state */}
              <div className="-mx-6">
                <AnalyticsSection currentLang={currentLang} />
              </div>

              {/* ── Export Tools ── */}
              <div className="pt-4 border-t border-[var(--border-default)]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-bold font-serif text-[var(--text-primary)]">Export & PDF Reports</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E9C349]/15 text-[#E9C349] text-[10px] font-mono font-bold border border-[#E9C349]/30">Data Tools</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-3">
                    <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      <span>CSV Data Exporter</span>
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">Export active student lists with UTF-8 BOM encoding for Excel.</p>
                    <button
                      onClick={() => exportToCSV('Dare_Institute_Full_Registry', ['Student ID', 'Name', 'Course', 'Status', 'Attendance', 'Balance'], students.map(s => [s.id, s.name, s.course, s.status, `${s.attendance}%`, s.balance]))}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Full Student CSV
                    </button>
                  </div>
                  <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-3">
                    <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <Printer className="w-4 h-4 text-[#E9C349]" />
                      <span>PDF Statement Generator</span>
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">Generate formatted official printable PDF administrative report.</p>
                    <button
                      onClick={() => generatePDFReport('Dare Institute Executive Summary', 'Official Student & Academic Standing Log', ['Student ID', 'Name', 'Course', 'Status', 'Attendance'], students.map(s => [s.id, s.name, s.course, s.status, `${s.attendance}%`]))}
                      className="px-4 py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:bg-[#F5D468] flex items-center gap-2 transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Generate PDF Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* TAB: TRASH / DELETED ITEMS */}
          {activeTab === 'trash' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[var(--text-primary)] flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-red-400" />
                    Trash
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Deleted items are kept here. Restore them or permanently remove them.
                  </p>
                </div>
                {trashedItems.length > 0 && (
                  <button
                    onClick={() => {
                      setConfirmTarget({ id: '__all__', type: 'student', label: 'ALL items in Trash' });
                    }}
                    className="px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Empty Trash ({trashedItems.length})
                  </button>
                )}
              </div>

              {/* Empty state */}
              {trashedItems.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-24 gap-4 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-[var(--border-default)] flex items-center justify-center">
                    <Trash2 className="w-7 h-7 text-[var(--text-muted)]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">Trash is empty</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Deleted instructors and students will appear here.</p>
                  </div>
                </motion.div>
              )}

              {/* Trash items list */}
              {trashedItems.length > 0 && (
                <div className="space-y-3">
                  {trashedItems.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] hover:border-red-500/20 transition-all"
                    >
                      {/* Type badge + avatar */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm font-serif ${
                        item.type === 'instructor'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                          : 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
                      }`}>
                        {item.label.charAt(0)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-[var(--text-primary)] truncate">{item.label}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                            item.type === 'instructor'
                              ? 'bg-amber-500/15 text-amber-400'
                              : 'bg-blue-500/15 text-blue-400'
                          }`}>
                            {item.type === 'instructor' ? 'Instructor' : 'Student'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 truncate">{item.meta}</p>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
                          Deleted: {new Date(item.deletedAt).toLocaleString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Restore */}
                        <button
                          onClick={() => {
                            if (item.type === 'instructor') {
                              setInstructors(prev => [...prev, item.payload as typeof INITIAL_INSTRUCTORS[0]]);
                            } else {
                              setStudents(prev => [...prev, item.payload as typeof INITIAL_STUDENTS[0]]);
                            }
                            setTrashedItems(prev => prev.filter(t => t.id !== item.id));
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/25 text-[11px] font-bold transition-all"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Restore
                        </button>

                        {/* Permanent delete */}
                        <button
                          onClick={() => setTrashedItems(prev => prev.filter(t => t.id !== item.id))}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[11px] font-bold transition-all"
                          title="Permanently delete — cannot be undone"
                        >
                          <X className="w-3 h-3" />
                          Delete Forever
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
            </>
          )}
        </main>
      </div>

      {/* MODAL 1: Payment Receipt Screenshot Viewer */}
      {selectedReceiptUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--bg-panel)] border border-[#E9C349]/40 rounded-3xl p-6 max-w-lg w-full text-center space-y-4">
            <div className="flex items-center justify-between text-[var(--text-primary)] border-b border-[var(--border-default)] pb-3">
              <h3 className="text-sm font-bold">Payment Telebirr/Bank Receipt</h3>
              <button onClick={() => setSelectedReceiptUrl(null)} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={selectedReceiptUrl} alt="Receipt Screenshot" className="max-h-80 mx-auto rounded-2xl border border-[var(--border-default)] object-cover" />
            <button
              onClick={() => setSelectedReceiptUrl(null)}
              className="px-6 py-2 rounded-xl bg-[#E9C349] text-black font-bold text-xs"
            >
              Close Viewer
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: Add New Student Modal */}
      {addStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--bg-panel)] border border-[#E9C349]/40 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between text-[var(--text-primary)] border-b border-[var(--border-default)] pb-3">
              <h3 className="text-base font-bold font-serif">Register New Student</h3>
              <button onClick={() => setAddStudentModalOpen(false)} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="e.g. Abebe Kebede"
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] font-bold mb-1">Gender</label>
                <select
                  value={newStudent.gender}
                  onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349]"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] font-bold mb-1">Course Program</label>
                <select
                  value={newStudent.course}
                  onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349]"
                >
                  <option value="Hair Dressing & Styling">Hair Dressing & Styling</option>
                  <option value="Barbering & Grooming">Barbering & Grooming</option>
                  <option value="Makeup Artistry">Makeup Artistry</option>
                  <option value="Nail Care Technology">Nail Care Technology</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] font-bold mb-1">Duration</label>
                <select
                  value={newStudent.duration}
                  onChange={(e) => setNewStudent({ ...newStudent, duration: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349]"
                >
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] font-bold mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                  placeholder="+251 91 123 4567"
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349]"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:bg-[#F5D468]"
                >
                  Confirm Registration
                </button>
                <button
                  type="button"
                  onClick={() => setAddStudentModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-white/10 text-[var(--text-primary)] font-semibold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CONFIRM DELETE MODAL ── */}
      <AnimatePresence>
        {confirmTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 16, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 340 }}
              className="bg-[var(--bg-panel)] border border-red-500/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-5"
            >
              {/* Icon + title */}
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-red-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] font-serif">Are you sure?</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                    You are about to remove{' '}
                    <span className="font-bold text-[var(--text-primary)]">{confirmTarget.label}</span>{' '}
                    from the {confirmTarget.type === 'instructor' ? 'instructor roster' : 'student list'}.
                  </p>
                  <p className="text-[10px] text-emerald-400 mt-2 flex items-center justify-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    This item will be moved to Trash and can be restored.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-all shadow"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setConfirmTarget(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text-primary)] font-semibold text-xs transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Add New Instructor */}
      {addInstructorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[var(--bg-panel)] border border-[#E9C349]/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E9C349] text-black flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Add New Instructor</h3>
                  <p className="text-[10px] text-[var(--text-muted)]">Fill in the details and select what they teach</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAddInstructorModalOpen(false);
                  setNewInstructor({ name: '', phone: '', experience: '', subjects: [], status: 'Active', paymentAmount: '', paymentFrequency: 'Monthly', paymentStartDate: new Date().toISOString().slice(0, 10), firstPaymentDueDate: addMonths(new Date().toISOString().slice(0, 10), 1) });
                }}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddInstructorSubmit} className="space-y-4 text-xs">

              {/* Full Name */}
              <div>
                <label className="block text-[var(--text-secondary)] font-bold mb-1 uppercase tracking-wide text-[10px]">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newInstructor.name}
                  onChange={e => setNewInstructor({ ...newInstructor, name: e.target.value })}
                  placeholder="e.g. Selamawit Abera"
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349] transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[var(--text-secondary)] font-bold mb-1 uppercase tracking-wide text-[10px]">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newInstructor.phone}
                  onChange={e => setNewInstructor({ ...newInstructor, phone: e.target.value })}
                  placeholder="+251 91 234 5678"
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349] transition-all"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-[var(--text-secondary)] font-bold mb-1 uppercase tracking-wide text-[10px]">
                  Years of Experience
                </label>
                <input
                  type="text"
                  value={newInstructor.experience}
                  onChange={e => setNewInstructor({ ...newInstructor, experience: e.target.value })}
                  placeholder="e.g. 5 Years"
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349] transition-all"
                />
              </div>

              {/* Subjects — checkbox grid */}
              <div>
                <label className="block text-[var(--text-secondary)] font-bold mb-2 uppercase tracking-wide text-[10px]">
                  Subjects / Programs They Teach <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PROGRAM_OPTIONS.map(prog => {
                    const checked = newInstructor.subjects.includes(prog);
                    return (
                      <label
                        key={prog}
                        className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all select-none ${
                          checked
                            ? 'border-[#E9C349] bg-[#E9C349]/10 text-[#D4AF37] font-bold'
                            : 'border-[var(--border-default)] bg-[var(--bg-input)] text-[var(--text-secondary)] hover:border-[#E9C349]/40'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={checked}
                          onChange={() => {
                            setNewInstructor(prev => ({
                              ...prev,
                              subjects: checked
                                ? prev.subjects.filter(s => s !== prog)
                                : [...prev.subjects, prog],
                            }));
                          }}
                        />
                        <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                          checked ? 'bg-[#E9C349] border-[#E9C349]' : 'border-[var(--border-default)]'
                        }`}>
                          {checked && <Check className="w-2.5 h-2.5 text-black" />}
                        </span>
                        <span className="text-[11px] leading-tight">{prog}</span>
                      </label>
                    );
                  })}
                </div>
                {newInstructor.subjects.length === 0 && (
                  <p className="text-[10px] text-amber-400 mt-1.5">Select at least one program.</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-[var(--text-secondary)] font-bold mb-1 uppercase tracking-wide text-[10px]">
                  Status
                </label>
                <select
                  value={newInstructor.status}
                  onChange={e => setNewInstructor({ ...newInstructor, status: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349] transition-all"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* ── Payment Arrangement ── */}
              <div className="pt-2 border-t border-[var(--border-default)] space-y-3">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E9C349]">
                  Payment Arrangement
                </div>

                {/* Payment Amount */}
                <div>
                  <label className="block text-[var(--text-secondary)] font-bold mb-1 uppercase tracking-wide text-[10px]">
                    Payment Amount (ETB) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newInstructor.paymentAmount}
                    onChange={e => setNewInstructor({ ...newInstructor, paymentAmount: e.target.value })}
                    placeholder="e.g. 8000"
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349] transition-all"
                  />
                </div>

                {/* Payment Frequency */}
                <div>
                  <label className="block text-[var(--text-secondary)] font-bold mb-1 uppercase tracking-wide text-[10px]">
                    Payment Frequency
                  </label>
                  <select
                    value={newInstructor.paymentFrequency}
                    disabled
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none opacity-70 cursor-not-allowed"
                  >
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>

                {/* Payment Start Date */}
                <div>
                  <label className="block text-[var(--text-secondary)] font-bold mb-1 uppercase tracking-wide text-[10px]">
                    Payment Start Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={newInstructor.paymentStartDate}
                    onChange={e => {
                      const start = e.target.value;
                      setNewInstructor({
                        ...newInstructor,
                        paymentStartDate: start,
                        firstPaymentDueDate: addMonths(start, 1),
                      });
                    }}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349] transition-all"
                  />
                </div>

                {/* First Payment Due Date (auto-calculated, editable) */}
                <div>
                  <label className="block text-[var(--text-secondary)] font-bold mb-1 uppercase tracking-wide text-[10px]">
                    First Payment Due Date
                    <span className="ml-1 text-[var(--text-muted)] normal-case">(auto-calculated)</span>
                  </label>
                  <input
                    type="date"
                    value={newInstructor.firstPaymentDueDate}
                    onChange={e => setNewInstructor({ ...newInstructor, firstPaymentDueDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349] transition-all"
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">
                    Start date + 1 month. Each instructor gets their own independent cycle.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:bg-[#F5D468] transition-all"
                >
                  Add to Roster
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddInstructorModalOpen(false);
                    setNewInstructor({ name: '', phone: '', experience: '', subjects: [], status: 'Active', paymentAmount: '', paymentFrequency: 'Monthly', paymentStartDate: new Date().toISOString().slice(0, 10), firstPaymentDueDate: addMonths(new Date().toISOString().slice(0, 10), 1) });
                  }}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text-primary)] font-semibold text-xs transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL: Edit Instructor */}
      <AnimatePresence>
        {editInstructor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 16, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 340 }}
              className="bg-[var(--bg-panel)] border border-[#E9C349]/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E9C349]/20 border border-[#E9C349]/30 text-[#E9C349] flex items-center justify-center">
                    <Edit className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Edit Instructor</h3>
                    <p className="text-[10px] text-[var(--text-muted)] font-mono">{editInstructor.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditInstructor(null)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleEditInstructorSave} className="space-y-4 text-xs">
                {/* Name */}
                <div>
                  <label className="block text-[var(--text-secondary)] font-bold mb-1 uppercase tracking-wide text-[10px]">Full Name <span className="text-red-400">*</span></label>
                  <input
                    type="text" required
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349] transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[var(--text-secondary)] font-bold mb-1 uppercase tracking-wide text-[10px]">Phone <span className="text-red-400">*</span></label>
                  <input
                    type="text" required
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349] transition-all"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-[var(--text-secondary)] font-bold mb-1 uppercase tracking-wide text-[10px]">Years of Experience</label>
                  <input
                    type="text"
                    value={editForm.experience}
                    onChange={e => setEditForm({ ...editForm, experience: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349] transition-all"
                  />
                </div>

                {/* Subjects */}
                <div>
                  <label className="block text-[var(--text-secondary)] font-bold mb-2 uppercase tracking-wide text-[10px]">
                    Subjects / Programs <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PROGRAM_OPTIONS.map(prog => {
                      const checked = editForm.subjects.includes(prog);
                      return (
                        <label
                          key={prog}
                          className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all select-none ${
                            checked
                              ? 'border-[#E9C349] bg-[#E9C349]/10 text-[#D4AF37] font-bold'
                              : 'border-[var(--border-default)] bg-[var(--bg-input)] text-[var(--text-secondary)] hover:border-[#E9C349]/40'
                          }`}
                        >
                          <input type="checkbox" className="hidden" checked={checked}
                            onChange={() => setEditForm(prev => ({
                              ...prev,
                              subjects: checked
                                ? prev.subjects.filter(s => s !== prog)
                                : [...prev.subjects, prog],
                            }))}
                          />
                          <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${checked ? 'bg-[#E9C349] border-[#E9C349]' : 'border-[var(--border-default)]'}`}>
                            {checked && <Check className="w-2.5 h-2.5 text-black" />}
                          </span>
                          <span className="text-[11px] leading-tight">{prog}</span>
                        </label>
                      );
                    })}
                  </div>
                  {editForm.subjects.length === 0 && (
                    <p className="text-[10px] text-amber-400 mt-1.5">Select at least one program.</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[var(--text-secondary)] font-bold mb-1 uppercase tracking-wide text-[10px]">Status</label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] outline-none focus:border-[#E9C349] transition-all"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:bg-[#F5D468] transition-all"
                  >
                    Save Changes
                  </button>
                  <button type="button" onClick={() => setEditInstructor(null)}
                    className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text-primary)] font-semibold text-xs transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Transcript Viewer */}
      {selectedTranscriptStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] text-black border-4 border-[#D4AF37] rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative font-serif overflow-y-auto max-h-[90vh]">

            {/* Close */}
            <button
              onClick={() => setSelectedTranscriptStudent(null)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center border-b-2 border-[#D4AF37] pb-5 mb-6">
              <div className="text-xs font-sans font-bold text-[#D4AF37] tracking-widest uppercase mb-1">
                Official Document
              </div>
              <h2 className="text-2xl font-bold text-black">
                DARE WOMEN'S & MEN'S BEAUTY INSTITUTE
              </h2>
              <p className="text-xs text-gray-500 font-sans mt-1">
                Tsara Tsion, Burayu, Sheger City, Oromia, Ethiopia
              </p>
              <p className="text-sm font-bold text-[#997510] tracking-widest uppercase mt-2">
                Academic Transcript & Practical Assessment Report
              </p>
            </div>

            {/* Student Meta */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm font-sans mb-6 bg-[#FFF8EE] border border-[#D4AF37]/30 rounded-2xl p-4">
              <div><span className="text-gray-500 text-xs uppercase font-bold">Student ID:</span><br /><span className="font-mono font-bold text-black">{selectedTranscriptStudent.id}</span></div>
              <div><span className="text-gray-500 text-xs uppercase font-bold">Full Name:</span><br /><span className="font-bold text-black">{selectedTranscriptStudent.name}</span></div>
              <div><span className="text-gray-500 text-xs uppercase font-bold">Program:</span><br /><span className="font-bold text-black">{selectedTranscriptStudent.course}</span></div>
              <div><span className="text-gray-500 text-xs uppercase font-bold">Duration:</span><br /><span className="font-bold text-black">{selectedTranscriptStudent.duration}</span></div>
              <div>
                <span className="text-gray-500 text-xs uppercase font-bold">Overall Attendance:</span><br />
                <span className={`font-bold ${selectedTranscriptStudent.attendance >= 75 ? 'text-emerald-700' : 'text-red-600'}`}>
                  {selectedTranscriptStudent.attendance}%
                </span>
              </div>
              <div>
                <span className="text-gray-500 text-xs uppercase font-bold">Competency Status:</span><br />
                <span className="font-bold text-[#997510]">{selectedTranscriptStudent.competency}</span>
              </div>
            </div>

            {/* Modules Table */}
            <table className="w-full border-collapse font-sans text-sm mb-6">
              <thead>
                <tr className="bg-[#111]">
                  <th className="p-2.5 text-left text-[#D4AF37] text-xs uppercase font-bold">Training Unit Module</th>
                  <th className="p-2.5 text-left text-[#D4AF37] text-xs uppercase font-bold">Hours</th>
                  <th className="p-2.5 text-left text-[#D4AF37] text-xs uppercase font-bold">Practical Score</th>
                  <th className="p-2.5 text-left text-[#D4AF37] text-xs uppercase font-bold">Grade</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { module: 'Safety, Sanitation & Hygiene Protocols',           hours: '40 Hours', score: '98%', grade: 'Highly Competent' },
                  { module: 'Professional Hair Cutting & Blowdry Techniques',   hours: '80 Hours', score: '92%', grade: 'Competent' },
                  { module: 'Chemical Processing, Dyeing & Weaving',            hours: '70 Hours', score: '95%', grade: 'Highly Competent' },
                  { module: 'Client Care & Beauty Salon Ethics',                hours: '30 Hours', score: '96%', grade: 'Highly Competent' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FDF8F0]'}>
                    <td className="p-2.5 border-b border-gray-100 text-xs">{row.module}</td>
                    <td className="p-2.5 border-b border-gray-100 text-xs font-mono">{row.hours}</td>
                    <td className="p-2.5 border-b border-gray-100 text-xs font-mono font-bold text-emerald-700">{row.score}</td>
                    <td className="p-2.5 border-b border-gray-100 text-xs font-bold text-[#997510]">{row.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signature stamp */}
            <div className="text-right text-xs font-sans text-gray-500 border-t border-[#D4AF37]/30 pt-4 mb-6">
              <p className="font-bold text-[#D4AF37]">Authorized Registrar Signature & Seal</p>
              <p>Dare Beauty Institute • Tsara Tsion, Burayu, Sheger City</p>
              <p className="font-mono text-gray-400 mt-1">Generated: {new Date().toLocaleDateString()}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 font-sans">
              <button
                onClick={() => printTranscriptModal(selectedTranscriptStudent)}
                className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs hover:bg-[#E9C349] flex items-center gap-2 transition-colors shadow"
              >
                <Printer className="w-4 h-4" />
                Print Transcript
              </button>
              <button
                onClick={() => setSelectedTranscriptStudent(null)}
                className="px-6 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-black font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Print Certificate Modal */}
      {selectedCertPrint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] text-black border-4 border-[#D4AF37] rounded-3xl p-8 max-w-xl w-full text-center space-y-4 shadow-2xl relative font-serif">
            <button
              onClick={() => setSelectedCertPrint(null)}
              className="absolute top-4 right-4 p-1 text-[var(--text-muted)] hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-sm font-bold text-[#D4AF37] tracking-widest uppercase">Official Qualification Award</div>
            <h2 className="text-2xl font-bold">DARE BEAUTY & HAIR DRESSING INSTITUTE</h2>
            <p className="text-xs text-gray-600 font-sans">Addis Ababa, Federal Democratic Republic of Ethiopia</p>

            <div className="my-6 border-t border-b border-[#D4AF37]/40 py-4">
              <div className="text-xs font-sans text-[var(--text-muted)]">This is to certify that</div>
              <div className="text-2xl font-bold text-black my-1">{selectedCertPrint.studentName}</div>
              <div className="text-xs font-sans text-[var(--text-muted)]">has successfully completed the accredited program in</div>
              <div className="text-lg font-bold text-[#997510] mt-1">{selectedCertPrint.program}</div>
            </div>

            <div className="flex items-center justify-between text-xs font-sans text-gray-600">
              <div>Serial: <strong className="font-mono text-black">{selectedCertPrint.certNo}</strong></div>
              <div>Grade: <strong className="text-emerald-700">{selectedCertPrint.grade}</strong></div>
            </div>

            <div className="pt-4 flex items-center justify-center space-x-3 font-sans">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs hover:bg-[#E9C349] flex items-center space-x-1"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
