'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, AlertCircle, CheckCircle2,
  Clock, AlertTriangle, Plus, X, Download, Printer, Search, Filter,
  CreditCard, Users, BookOpen, Calendar, FileText, ChevronDown,
  RefreshCw, ArrowUpRight, ArrowDownRight, Eye, Edit3,
} from 'lucide-react';
import { exportToCSV, generatePDFReport } from '../../utils/exportUtils';
import { Language } from '../../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InstructorPaymentArrangement {
  instructorId: string;
  instructorName: string;
  paymentAmount: number;       // ETB
  paymentFrequency: 'Monthly'; // only monthly for now
  paymentStartDate: string;    // YYYY-MM-DD
  firstPaymentDueDate: string; // YYYY-MM-DD (auto-calc: startDate + 1 month)
}

export interface InstructorPaymentRecord {
  id: string;
  instructorId: string;
  instructorName: string;
  amount: number;
  paymentDate: string;         // YYYY-MM-DD when paid
  periodLabel: string;         // e.g. "October 2026"
  method: string;              // 'Cash' | 'Telebirr' | 'Bank Transfer' | 'CBE Birr'
  reference: string;
  notes: string;
  paidAt: string;              // ISO timestamp
}

export interface InstructorPaymentSchedule {
  instructorId: string;
  instructorName: string;
  arrangement: InstructorPaymentArrangement;
  nextDueDate: string;         // YYYY-MM-DD
  lastPaidDate: string | null;
  lastPaidAmount: number | null;
  status: 'Upcoming' | 'Due Today' | 'Overdue' | 'Paid';
  daysRemaining: number;       // negative = overdue
  history: InstructorPaymentRecord[];
}

export interface StudentMonthlyPayment {
  id: string;
  studentId: string;
  studentName: string;
  program: string;
  monthlyAmount: number;
  paymentMonth: string;        // "YYYY-MM"
  paymentDate: string | null;  // YYYY-MM-DD when paid
  status: 'Pending' | 'Paid' | 'Overdue';
  method: string;
  reference: string;
  notes: string;
}

export interface IncomeEntry {
  id: string;
  type: 'Student Payment' | 'Registration Fee' | 'Other Income';
  description: string;
  amount: number;
  date: string;                // YYYY-MM-DD
  method: string;
  reference: string;
  relatedPerson: string;
  notes: string;
}

export interface ExpenseEntry {
  id: string;
  type: 'Instructor Payment' | 'Supplies' | 'Utilities' | 'Rent' | 'Marketing' | 'Other';
  description: string;
  amount: number;
  date: string;                // YYYY-MM-DD
  method: string;
  recipient: string;
  reference: string;
  relatedInstructorId: string;
  notes: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export function calcFirstPaymentDue(startDate: string): string {
  return addMonths(startDate, 1);
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getPaymentStatus(nextDueDate: string, lastPaidDate: string | null): InstructorPaymentSchedule['status'] {
  const days = daysUntil(nextDueDate);
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Due Today';
  return 'Upcoming';
}

function monthLabel(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function fmt(n: number): string {
  return n.toLocaleString('en-US') + ' ETB';
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    'Upcoming':   'bg-blue-500/15 text-blue-300 border border-blue-500/25',
    'Due Today':  'bg-amber-500/15 text-amber-300 border border-amber-500/25',
    'Overdue':    'bg-red-500/15 text-red-300 border border-red-500/25',
    'Paid':       'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
    'Pending':    'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  };
  return map[status] ?? 'bg-white/10 text-white/60';
}

const PAYMENT_METHODS = ['Cash', 'Telebirr', 'Bank Transfer', 'CBE Birr', 'Awash Bank', 'Dashen Bank'];

// ─── Props ────────────────────────────────────────────────────────────────────

interface FinanceDashboardProps {
  currentLang?: Language;
  instructors: Array<{ id: string; name: string; subjects: string[]; status: string }>;
  students: Array<{ id: string; name: string; course: string; duration: string; status: string; regDate: string }>;
  instructorArrangements: InstructorPaymentArrangement[];
  onArrangementCreated: (arr: InstructorPaymentArrangement) => void;
  instructorPaymentSchedules: InstructorPaymentSchedule[];
  onPayInstructor: (instructorId: string, record: InstructorPaymentRecord) => void;
  studentMonthlyPayments: StudentMonthlyPayment[];
  onAddStudentPayment: (p: StudentMonthlyPayment) => void;
  onUpdateStudentPayment: (id: string, updates: Partial<StudentMonthlyPayment>) => void;
  incomeEntries: IncomeEntry[];
  onAddIncome: (e: IncomeEntry) => void;
  expenseEntries: ExpenseEntry[];
  onAddExpense: (e: ExpenseEntry) => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────

type FinanceTab = 'overview' | 'instructor-payments' | 'student-payments' | 'income' | 'expenses' | 'reports';

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({
  currentLang = 'en',
  instructors,
  students,
  instructorArrangements,
  onArrangementCreated,
  instructorPaymentSchedules,
  onPayInstructor,
  studentMonthlyPayments,
  onAddStudentPayment,
  onUpdateStudentPayment,
  incomeEntries,
  onAddIncome,
  expenseEntries,
  onAddExpense,
}) => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('overview');

  // ── Pay Instructor Modal State ─────────────────────────────────────────────
  const [payModalInstructorId, setPayModalInstructorId] = useState<string | null>(null);
  const [payForm, setPayForm] = useState({
    amount: '',
    paymentDate: new Date().toISOString().slice(0, 10),
    method: 'Cash',
    reference: '',
    notes: '',
  });

  // ── Student Payment Modal State ────────────────────────────────────────────
  const [studentPayModal, setStudentPayModal] = useState<StudentMonthlyPayment | null>(null);
  const [studentPayForm, setStudentPayForm] = useState({
    paymentDate: new Date().toISOString().slice(0, 10),
    method: 'Cash',
    reference: '',
    notes: '',
  });

  // ── Add Income Modal State ─────────────────────────────────────────────────
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [incomeForm, setIncomeForm] = useState({
    type: 'Student Payment' as IncomeEntry['type'],
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    method: 'Cash',
    reference: '',
    relatedPerson: '',
    notes: '',
  });

  // ── Add Expense Modal State ────────────────────────────────────────────────
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    type: 'Supplies' as ExpenseEntry['type'],
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    method: 'Cash',
    recipient: '',
    reference: '',
    relatedInstructorId: '',
    notes: '',
  });

  // ── Reports filters ────────────────────────────────────────────────────────
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [reportMonth, setReportMonth] = useState<number | 'all'>('all');
  const [reportStudentFilter, setReportStudentFilter] = useState('');
  const [reportInstructorFilter, setReportInstructorFilter] = useState('');
  const [reportTypeFilter, setReportTypeFilter] = useState<'all' | 'income' | 'expense'>('all');

  // ── Instructor payment detail panel ───────────────────────────────────────
  const [viewHistoryId, setViewHistoryId] = useState<string | null>(null);

  // ── Student payments filters ───────────────────────────────────────────────
  const [studentPaySearch, setStudentPaySearch] = useState('');
  const [studentPayStatus, setStudentPayStatus] = useState<'all' | 'Pending' | 'Paid' | 'Overdue'>('all');

  // ─── Computed Finance Totals ─────────────────────────────────────────────

  const today = new Date().toISOString().slice(0, 10);
  const thisMonth = today.slice(0, 7); // "YYYY-MM"
  const thisYear = today.slice(0, 4);  // "YYYY"

  const totals = useMemo(() => {
    const incomeThisMonth = incomeEntries
      .filter(e => e.date.startsWith(thisMonth))
      .reduce((s, e) => s + e.amount, 0);

    const incomeThisYear = incomeEntries
      .filter(e => e.date.startsWith(thisYear))
      .reduce((s, e) => s + e.amount, 0);

    const studentPayThisMonth = incomeEntries
      .filter(e => e.date.startsWith(thisMonth) && e.type === 'Student Payment')
      .reduce((s, e) => s + e.amount, 0);

    const otherIncomeThisMonth = incomeEntries
      .filter(e => e.date.startsWith(thisMonth) && e.type !== 'Student Payment')
      .reduce((s, e) => s + e.amount, 0);

    const instructorPayoutsThisMonth = expenseEntries
      .filter(e => e.date.startsWith(thisMonth) && e.type === 'Instructor Payment')
      .reduce((s, e) => s + e.amount, 0);

    const otherExpensesThisMonth = expenseEntries
      .filter(e => e.date.startsWith(thisMonth) && e.type !== 'Instructor Payment')
      .reduce((s, e) => s + e.amount, 0);

    const totalExpensesThisMonth = expenseEntries
      .filter(e => e.date.startsWith(thisMonth))
      .reduce((s, e) => s + e.amount, 0);

    const totalIncome = incomeEntries.reduce((s, e) => s + e.amount, 0);
    const totalExpenses = expenseEntries.reduce((s, e) => s + e.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    const pendingStudentPayments = studentMonthlyPayments.filter(p => p.status === 'Pending').length;
    const overdueStudentPayments = studentMonthlyPayments.filter(p => p.status === 'Overdue').length;

    const upcomingInstructorPayments = instructorPaymentSchedules.filter(s => s.status === 'Upcoming').length;
    const dueInstructorPayments = instructorPaymentSchedules.filter(s => s.status === 'Due Today').length;
    const overdueInstructorPayments = instructorPaymentSchedules.filter(s => s.status === 'Overdue').length;

    return {
      incomeThisMonth, incomeThisYear, studentPayThisMonth, otherIncomeThisMonth,
      instructorPayoutsThisMonth, otherExpensesThisMonth, totalExpensesThisMonth,
      totalIncome, totalExpenses, netBalance,
      pendingStudentPayments, overdueStudentPayments,
      upcomingInstructorPayments, dueInstructorPayments, overdueInstructorPayments,
    };
  }, [incomeEntries, expenseEntries, studentMonthlyPayments, instructorPaymentSchedules, thisMonth, thisYear]);

  // ─── Payment Alert banners ────────────────────────────────────────────────

  const alerts = useMemo(() => {
    const list: { id: string; type: 'error' | 'warn' | 'info'; msg: string }[] = [];
    instructorPaymentSchedules.forEach(s => {
      if (s.status === 'Overdue') {
        list.push({ id: s.instructorId + '-overdue', type: 'error', msg: `Payment for ${s.instructorName} is OVERDUE (${fmt(s.arrangement.paymentAmount)})` });
      } else if (s.status === 'Due Today') {
        list.push({ id: s.instructorId + '-today', type: 'warn', msg: `Payment for ${s.instructorName} is DUE TODAY (${fmt(s.arrangement.paymentAmount)})` });
      } else if (s.daysRemaining <= 7) {
        list.push({ id: s.instructorId + '-soon', type: 'info', msg: `Payment for ${s.instructorName} due in ${s.daysRemaining} day${s.daysRemaining === 1 ? '' : 's'} (${fmt(s.arrangement.paymentAmount)})` });
      }
    });
    return list;
  }, [instructorPaymentSchedules]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handlePayInstructorSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!payModalInstructorId) return;
    const schedule = instructorPaymentSchedules.find(s => s.instructorId === payModalInstructorId);
    if (!schedule) return;
    const amount = parseFloat(payForm.amount) || schedule.arrangement.paymentAmount;
    const record: InstructorPaymentRecord = {
      id: `IPAY-${Date.now()}`,
      instructorId: payModalInstructorId,
      instructorName: schedule.instructorName,
      amount,
      paymentDate: payForm.paymentDate,
      periodLabel: monthLabel(schedule.nextDueDate),
      method: payForm.method,
      reference: payForm.reference,
      notes: payForm.notes,
      paidAt: new Date().toISOString(),
    };
    onPayInstructor(payModalInstructorId, record);
    // Also log as an expense
    onAddExpense({
      id: `EXP-${Date.now()}`,
      type: 'Instructor Payment',
      description: `Salary payment — ${schedule.instructorName} (${monthLabel(schedule.nextDueDate)})`,
      amount,
      date: payForm.paymentDate,
      method: payForm.method,
      recipient: schedule.instructorName,
      reference: payForm.reference,
      relatedInstructorId: payModalInstructorId,
      notes: payForm.notes,
    });
    setPayModalInstructorId(null);
    setPayForm({ amount: '', paymentDate: new Date().toISOString().slice(0, 10), method: 'Cash', reference: '', notes: '' });
  }, [payModalInstructorId, payForm, instructorPaymentSchedules, onPayInstructor, onAddExpense]);

  const handleMarkStudentPaid = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!studentPayModal) return;
    onUpdateStudentPayment(studentPayModal.id, {
      status: 'Paid',
      paymentDate: studentPayForm.paymentDate,
      method: studentPayForm.method,
      reference: studentPayForm.reference,
      notes: studentPayForm.notes,
    });
    // Also log as income
    onAddIncome({
      id: `INC-${Date.now()}`,
      type: 'Student Payment',
      description: `Monthly fee — ${studentPayModal.studentName} (${studentPayModal.paymentMonth})`,
      amount: studentPayModal.monthlyAmount,
      date: studentPayForm.paymentDate,
      method: studentPayForm.method,
      reference: studentPayForm.reference,
      relatedPerson: studentPayModal.studentName,
      notes: studentPayForm.notes,
    });
    setStudentPayModal(null);
  }, [studentPayModal, studentPayForm, onUpdateStudentPayment, onAddIncome]);

  const handleAddIncomeSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onAddIncome({
      id: `INC-${Date.now()}`,
      type: incomeForm.type,
      description: incomeForm.description,
      amount: parseFloat(incomeForm.amount) || 0,
      date: incomeForm.date,
      method: incomeForm.method,
      reference: incomeForm.reference,
      relatedPerson: incomeForm.relatedPerson,
      notes: incomeForm.notes,
    });
    setIncomeModalOpen(false);
    setIncomeForm({ type: 'Student Payment', description: '', amount: '', date: new Date().toISOString().slice(0, 10), method: 'Cash', reference: '', relatedPerson: '', notes: '' });
  }, [incomeForm, onAddIncome]);

  const handleAddExpenseSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onAddExpense({
      id: `EXP-${Date.now()}`,
      type: expenseForm.type,
      description: expenseForm.description,
      amount: parseFloat(expenseForm.amount) || 0,
      date: expenseForm.date,
      method: expenseForm.method,
      recipient: expenseForm.recipient,
      reference: expenseForm.reference,
      relatedInstructorId: expenseForm.relatedInstructorId,
      notes: expenseForm.notes,
    });
    setExpenseModalOpen(false);
    setExpenseForm({ type: 'Supplies', description: '', amount: '', date: new Date().toISOString().slice(0, 10), method: 'Cash', recipient: '', reference: '', relatedInstructorId: '', notes: '' });
  }, [expenseForm, onAddExpense]);

  // ─── Shared field style ───────────────────────────────────────────────────

  const fieldCls = 'w-full p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] text-xs outline-none focus:border-[#E9C349] transition-all';
  const labelCls = 'block text-[var(--text-secondary)] font-bold mb-1 uppercase tracking-wide text-[10px]';

  // ─── Tab nav items ────────────────────────────────────────────────────────

  const tabs: { id: FinanceTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview',             label: 'Overview',            icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: 'instructor-payments',  label: 'Instructor Payments', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'student-payments',     label: 'Student Payments',    icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'income',               label: 'Income',              icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'expenses',             label: 'Expenses',            icon: <TrendingDown className="w-3.5 h-3.5" /> },
    { id: 'reports',              label: 'Reports',             icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="w-full space-y-5 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-default)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-1 rounded-full bg-[#E9C349]/20 text-[#E9C349] text-[10px] font-mono font-bold border border-[#E9C349]/30 flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Finance
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">Finance Management</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">Instructor payments, student fees, income, expenses, and financial reports.</p>
        </div>
      </div>

      {/* Alert banners */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map(a => (
            <div key={a.id} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border
              ${a.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-300' :
                a.type === 'warn' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
                'bg-blue-500/10 border-blue-500/30 text-blue-300'}`}>
              {a.type === 'error' ? <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> :
               a.type === 'warn' ? <AlertCircle className="w-3.5 h-3.5 shrink-0" /> :
               <Clock className="w-3.5 h-3.5 shrink-0" />}
              {a.msg}
            </div>
          ))}
        </div>
      )}

      {/* Sub-tab nav */}
      <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)]">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all
              ${activeTab === t.id
                ? 'bg-[#E9C349] text-black shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'}`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════ OVERVIEW ══════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">

          {/* Income cards */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-2">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" /> Income
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Income This Month',          value: fmt(totals.incomeThisMonth),          color: 'text-emerald-400', border: 'border-emerald-500/30' },
                { label: 'Income This Year',            value: fmt(totals.incomeThisYear),            color: 'text-emerald-300', border: 'border-emerald-500/20' },
                { label: 'Student Payments This Month', value: fmt(totals.studentPayThisMonth),       color: 'text-blue-400',    border: 'border-blue-500/30' },
                { label: 'Other Income',                value: fmt(totals.otherIncomeThisMonth),      color: 'text-[#E9C349]',   border: 'border-[#E9C349]/30' },
              ].map(c => (
                <div key={c.label} className={`p-4 rounded-2xl bg-[var(--bg-panel)] border ${c.border} space-y-1`}>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{c.label}</div>
                  <div className={`text-lg font-mono font-bold ${c.color}`}>{c.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Outgoing cards */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-2">
              <ArrowDownRight className="w-3.5 h-3.5 text-red-400" /> Outgoing
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: 'Instructor Payments This Month', value: fmt(totals.instructorPayoutsThisMonth), color: 'text-amber-400', border: 'border-amber-500/30' },
                { label: 'Other Expenses',                 value: fmt(totals.otherExpensesThisMonth),     color: 'text-red-400',   border: 'border-red-500/30' },
                { label: 'Total Payout This Month',        value: fmt(totals.totalExpensesThisMonth),     color: 'text-red-300',   border: 'border-red-500/20' },
              ].map(c => (
                <div key={c.label} className={`p-4 rounded-2xl bg-[var(--bg-panel)] border ${c.border} space-y-1`}>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{c.label}</div>
                  <div className={`text-lg font-mono font-bold ${c.color}`}>{c.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Balance cards */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-[#E9C349]" /> Balance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Total Income',   value: fmt(totals.totalIncome),   color: 'text-emerald-400', border: 'border-emerald-500/30' },
                { label: 'Total Expenses', value: fmt(totals.totalExpenses), color: 'text-red-400',     border: 'border-red-500/30' },
                { label: 'Net Balance',    value: fmt(totals.netBalance),    color: totals.netBalance >= 0 ? 'text-emerald-400' : 'text-red-400', border: totals.netBalance >= 0 ? 'border-emerald-500/30' : 'border-red-500/30' },
              ].map(c => (
                <div key={c.label} className={`p-4 rounded-2xl bg-[var(--bg-panel)] border ${c.border} space-y-1`}>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{c.label}</div>
                  <div className={`text-xl font-mono font-bold ${c.color}`}>{c.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Status summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: 'Pending Student Pmts',     value: totals.pendingStudentPayments,    color: 'text-amber-400' },
              { label: 'Overdue Student Pmts',     value: totals.overdueStudentPayments,    color: 'text-red-400' },
              { label: 'Upcoming Instructor Pmts', value: totals.upcomingInstructorPayments,color: 'text-blue-400' },
              { label: 'Due Today (Instructor)',   value: totals.dueInstructorPayments,     color: 'text-amber-400' },
              { label: 'Overdue Instructor Pmts',  value: totals.overdueInstructorPayments, color: 'text-red-400' },
            ].map(c => (
              <div key={c.label} className="p-3 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] space-y-0.5">
                <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{c.label}</div>
                <div className={`text-2xl font-mono font-bold ${c.color}`}>{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════ INSTRUCTOR PAYMENTS ══════════════════════ */}
      {activeTab === 'instructor-payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Instructor Payment Schedules</h3>
              <p className="text-xs text-[var(--text-secondary)]">Each instructor has an independent payment cycle based on their start date.</p>
            </div>
          </div>

          {instructorPaymentSchedules.length === 0 ? (
            <div className="py-16 text-center text-[var(--text-muted)] text-sm">
              No instructor payment arrangements set up yet.<br />
              <span className="text-xs">Add payment details when registering an instructor.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {instructorPaymentSchedules.map(sched => {
                const isViewing = viewHistoryId === sched.instructorId;
                const days = sched.daysRemaining;
                const daysLabel = days < 0
                  ? `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`
                  : days === 0 ? 'Due today'
                  : `${days} day${days === 1 ? '' : 's'} remaining`;

                return (
                  <div key={sched.instructorId} className="rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] overflow-hidden">
                    {/* Row */}
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#E9C349]/15 border border-[#E9C349]/25 flex items-center justify-center text-[#E9C349] font-bold text-sm font-serif shrink-0">
                          {sched.instructorName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[var(--text-primary)]">{sched.instructorName}</div>
                          <div className="text-[11px] text-[var(--text-secondary)] font-mono">{sched.instructorId}</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <div>
                          <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Amount</div>
                          <div className="font-mono font-bold text-[var(--text-primary)]">{fmt(sched.arrangement.paymentAmount)}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Period</div>
                          <div className="font-mono font-bold text-[var(--text-primary)]">{monthLabel(sched.nextDueDate)}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Last Paid</div>
                          <div className="font-mono text-[var(--text-secondary)]">{sched.lastPaidDate ?? '—'}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Next Due</div>
                          <div className="font-mono font-bold text-[var(--text-primary)]">{sched.nextDueDate}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Days</div>
                          <div className={`font-mono font-bold text-xs ${days < 0 ? 'text-red-400' : days === 0 ? 'text-amber-400' : days <= 7 ? 'text-amber-300' : 'text-emerald-400'}`}>
                            {daysLabel}
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${statusBadge(sched.status)}`}>
                          {sched.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setViewHistoryId(isViewing ? null : sched.instructorId)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          History
                        </button>
                        {sched.status !== 'Paid' && (
                          <button
                            onClick={() => {
                              setPayModalInstructorId(sched.instructorId);
                              setPayForm(f => ({ ...f, amount: String(sched.arrangement.paymentAmount) }));
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E9C349] text-black text-xs font-bold hover:brightness-110 transition-all"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Pay Instructor
                          </button>
                        )}
                      </div>
                    </div>

                    {/* History panel */}
                    {isViewing && (
                      <div className="border-t border-[var(--border-default)] p-4 bg-[var(--bg-glass)]">
                        <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Payment History</h4>
                        {sched.history.length === 0 ? (
                          <p className="text-xs text-[var(--text-muted)]">No payments recorded yet.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-[var(--text-muted)] text-[10px] font-mono uppercase border-b border-[var(--border-subtle)]">
                                  <th className="py-2 px-2 text-left">Date</th>
                                  <th className="py-2 px-2 text-left">Period</th>
                                  <th className="py-2 px-2 text-left">Amount</th>
                                  <th className="py-2 px-2 text-left">Method</th>
                                  <th className="py-2 px-2 text-left">Reference</th>
                                  <th className="py-2 px-2 text-left">Notes</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[var(--border-subtle)]">
                                {sched.history.map(h => (
                                  <tr key={h.id} className="hover:bg-[var(--bg-panel)] transition-colors">
                                    <td className="py-2 px-2 font-mono text-[var(--text-primary)]">{h.paymentDate}</td>
                                    <td className="py-2 px-2 text-[var(--text-secondary)]">{h.periodLabel}</td>
                                    <td className="py-2 px-2 font-mono font-bold text-emerald-400">{fmt(h.amount)}</td>
                                    <td className="py-2 px-2 text-[var(--text-secondary)]">{h.method}</td>
                                    <td className="py-2 px-2 font-mono text-[var(--text-muted)]">{h.reference || '—'}</td>
                                    <td className="py-2 px-2 text-[var(--text-muted)] max-w-[160px] truncate">{h.notes || '—'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════ STUDENT MONTHLY PAYMENTS ══════════════════════ */}
      {activeTab === 'student-payments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Monthly Student Payments</h3>
              <p className="text-xs text-[var(--text-secondary)]">Track and record monthly fee payments per student.</p>
            </div>
            <button
              onClick={() => {
                const firstStudent = students[0];
                if (!firstStudent) return;
                const newPay: StudentMonthlyPayment = {
                  id: `SPAY-${Date.now()}`,
                  studentId: firstStudent.id,
                  studentName: firstStudent.name,
                  program: firstStudent.course,
                  monthlyAmount: 2500,
                  paymentMonth: new Date().toISOString().slice(0, 7),
                  paymentDate: null,
                  status: 'Pending',
                  method: '',
                  reference: '',
                  notes: '',
                };
                onAddStudentPayment(newPay);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E9C349] text-black text-xs font-bold hover:brightness-110 transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Add Payment Record
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-40">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                value={studentPaySearch}
                onChange={e => setStudentPaySearch(e.target.value)}
                placeholder="Search student…"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none focus:border-[#E9C349]"
              />
            </div>
            <select
              value={studentPayStatus}
              onChange={e => setStudentPayStatus(e.target.value as typeof studentPayStatus)}
              className="px-3 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] outline-none focus:border-[#E9C349]"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-[var(--border-default)]">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[var(--bg-panel)] text-[var(--text-muted)] text-[10px] font-mono uppercase border-b border-[var(--border-default)]">
                  <th className="py-3 px-4 text-left">Student</th>
                  <th className="py-3 px-4 text-left">Student ID</th>
                  <th className="py-3 px-4 text-left">Program</th>
                  <th className="py-3 px-4 text-left">Monthly Amt</th>
                  <th className="py-3 px-4 text-left">Month</th>
                  <th className="py-3 px-4 text-left">Paid Date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Method</th>
                  <th className="py-3 px-4 text-left">Reference</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {studentMonthlyPayments
                  .filter(p => {
                    const matchSearch = !studentPaySearch ||
                      p.studentName.toLowerCase().includes(studentPaySearch.toLowerCase()) ||
                      p.studentId.toLowerCase().includes(studentPaySearch.toLowerCase());
                    const matchStatus = studentPayStatus === 'all' || p.status === studentPayStatus;
                    return matchSearch && matchStatus;
                  })
                  .map(p => (
                    <tr key={p.id} className="hover:bg-[var(--bg-glass)] transition-colors">
                      <td className="py-3 px-4 font-semibold text-[var(--text-primary)]">{p.studentName}</td>
                      <td className="py-3 px-4 font-mono text-[var(--text-muted)]">{p.studentId}</td>
                      <td className="py-3 px-4 text-[var(--text-secondary)] max-w-[140px] truncate">{p.program}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[var(--text-primary)]">{fmt(p.monthlyAmount)}</td>
                      <td className="py-3 px-4 font-mono text-[var(--text-secondary)]">{p.paymentMonth}</td>
                      <td className="py-3 px-4 font-mono text-[var(--text-secondary)]">{p.paymentDate ?? '—'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${statusBadge(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[var(--text-muted)]">{p.method || '—'}</td>
                      <td className="py-3 px-4 font-mono text-[var(--text-muted)]">{p.reference || '—'}</td>
                      <td className="py-3 px-4">
                        {p.status !== 'Paid' && (
                          <button
                            onClick={() => {
                              setStudentPayModal(p);
                              setStudentPayForm({ paymentDate: new Date().toISOString().slice(0, 10), method: 'Cash', reference: '', notes: '' });
                            }}
                            className="px-2.5 py-1 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold hover:bg-emerald-600/30 transition-all"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                {studentMonthlyPayments.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-[var(--text-muted)] text-xs">No student payment records yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════ INCOME ══════════════════════ */}
      {activeTab === 'income' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Income Ledger</h3>
              <p className="text-xs text-[var(--text-secondary)]">Track all incoming funds by type, date, and source.</p>
            </div>
            <button
              onClick={() => setIncomeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Add Income
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[var(--border-default)]">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[var(--bg-panel)] text-[var(--text-muted)] text-[10px] font-mono uppercase border-b border-[var(--border-default)]">
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Method</th>
                  <th className="py-3 px-4 text-left">Reference</th>
                  <th className="py-3 px-4 text-left">Person</th>
                  <th className="py-3 px-4 text-left">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {incomeEntries.length === 0 && (
                  <tr><td colSpan={8} className="py-12 text-center text-[var(--text-muted)] text-xs">No income entries yet. Click "Add Income" to start.</td></tr>
                )}
                {[...incomeEntries].sort((a, b) => b.date.localeCompare(a.date)).map(e => (
                  <tr key={e.id} className="hover:bg-[var(--bg-glass)] transition-colors">
                    <td className="py-3 px-4 font-mono text-[var(--text-primary)]">{e.date}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">{e.type}</span>
                    </td>
                    <td className="py-3 px-4 text-[var(--text-secondary)] max-w-[180px] truncate">{e.description}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">{fmt(e.amount)}</td>
                    <td className="py-3 px-4 text-[var(--text-muted)]">{e.method}</td>
                    <td className="py-3 px-4 font-mono text-[var(--text-muted)]">{e.reference || '—'}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{e.relatedPerson || '—'}</td>
                    <td className="py-3 px-4 text-[var(--text-muted)] max-w-[140px] truncate">{e.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
              {incomeEntries.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-[var(--border-default)] bg-[var(--bg-panel)]">
                    <td colSpan={3} className="py-3 px-4 font-bold text-[var(--text-muted)] text-[10px] font-mono uppercase">Total</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-sm">{fmt(incomeEntries.reduce((s, e) => s + e.amount, 0))}</td>
                    <td colSpan={4} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => exportToCSV('Dare_Income_Ledger', ['Date','Type','Description','Amount','Method','Reference','Person','Notes'], incomeEntries.map(e => [e.date, e.type, e.description, e.amount, e.method, e.reference, e.relatedPerson, e.notes]))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700/20 text-emerald-400 border border-emerald-500/25 text-xs font-bold hover:bg-emerald-700/30 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════ EXPENSES ══════════════════════ */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Expenses & Payouts</h3>
              <p className="text-xs text-[var(--text-secondary)]">Track all outgoing payments including instructor salaries and operational costs.</p>
            </div>
            <button
              onClick={() => setExpenseModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Add Expense
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[var(--border-default)]">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[var(--bg-panel)] text-[var(--text-muted)] text-[10px] font-mono uppercase border-b border-[var(--border-default)]">
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Method</th>
                  <th className="py-3 px-4 text-left">Recipient</th>
                  <th className="py-3 px-4 text-left">Reference</th>
                  <th className="py-3 px-4 text-left">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {expenseEntries.length === 0 && (
                  <tr><td colSpan={8} className="py-12 text-center text-[var(--text-muted)] text-xs">No expense entries yet. Instructor payments are added automatically when you pay an instructor.</td></tr>
                )}
                {[...expenseEntries].sort((a, b) => b.date.localeCompare(a.date)).map(e => (
                  <tr key={e.id} className="hover:bg-[var(--bg-glass)] transition-colors">
                    <td className="py-3 px-4 font-mono text-[var(--text-primary)]">{e.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${e.type === 'Instructor Payment' ? 'bg-amber-500/15 text-amber-300 border-amber-500/25' : 'bg-red-500/15 text-red-300 border-red-500/25'}`}>
                        {e.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[var(--text-secondary)] max-w-[180px] truncate">{e.description}</td>
                    <td className="py-3 px-4 font-mono font-bold text-red-400">{fmt(e.amount)}</td>
                    <td className="py-3 px-4 text-[var(--text-muted)]">{e.method}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{e.recipient || '—'}</td>
                    <td className="py-3 px-4 font-mono text-[var(--text-muted)]">{e.reference || '—'}</td>
                    <td className="py-3 px-4 text-[var(--text-muted)] max-w-[140px] truncate">{e.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
              {expenseEntries.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-[var(--border-default)] bg-[var(--bg-panel)]">
                    <td colSpan={3} className="py-3 px-4 font-bold text-[var(--text-muted)] text-[10px] font-mono uppercase">Total</td>
                    <td className="py-3 px-4 font-mono font-bold text-red-400 text-sm">{fmt(expenseEntries.reduce((s, e) => s + e.amount, 0))}</td>
                    <td colSpan={4} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => exportToCSV('Dare_Expenses_Ledger', ['Date','Type','Description','Amount','Method','Recipient','Reference','Notes'], expenseEntries.map(e => [e.date, e.type, e.description, e.amount, e.method, e.recipient, e.reference, e.notes]))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/25 text-xs font-bold hover:bg-red-500/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════ REPORTS & ANALYTICS ══════════════════════ */}
      {activeTab === 'reports' && (() => {
        const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const years = Array.from(new Set([
          ...incomeEntries.map(e => parseInt(e.date.slice(0,4))),
          ...expenseEntries.map(e => parseInt(e.date.slice(0,4))),
          new Date().getFullYear(),
        ])).sort((a,b) => b-a);

        const yearStr = String(reportYear);

        // Apply filters
        const filteredIncome = incomeEntries.filter(e => {
          const matchYear = e.date.startsWith(yearStr);
          const matchMonth = reportMonth === 'all' || e.date.startsWith(`${yearStr}-${String(reportMonth+1).padStart(2,'0')}`);
          const matchPerson = !reportStudentFilter || e.relatedPerson.toLowerCase().includes(reportStudentFilter.toLowerCase());
          const matchType = reportTypeFilter === 'all' || reportTypeFilter === 'income';
          return matchYear && matchMonth && matchPerson && matchType;
        });

        const filteredExpenses = expenseEntries.filter(e => {
          const matchYear = e.date.startsWith(yearStr);
          const matchMonth = reportMonth === 'all' || e.date.startsWith(`${yearStr}-${String(reportMonth+1).padStart(2,'0')}`);
          const matchInstructor = !reportInstructorFilter || e.recipient.toLowerCase().includes(reportInstructorFilter.toLowerCase());
          const matchType = reportTypeFilter === 'all' || reportTypeFilter === 'expense';
          return matchYear && matchMonth && matchInstructor && matchType;
        });

        const filteredStudentPay = studentMonthlyPayments.filter(p => p.paymentMonth.startsWith(yearStr));

        // Yearly summary
        const yearlyIncome = filteredIncome.reduce((s,e) => s+e.amount, 0);
        const yearlyStudentPay = filteredIncome.filter(e=>e.type==='Student Payment').reduce((s,e)=>s+e.amount,0);
        const yearlyInstructorPay = filteredExpenses.filter(e=>e.type==='Instructor Payment').reduce((s,e)=>s+e.amount,0);
        const yearlyOtherExpenses = filteredExpenses.filter(e=>e.type!=='Instructor Payment').reduce((s,e)=>s+e.amount,0);
        const yearlyPayout = filteredExpenses.reduce((s,e) => s+e.amount, 0);
        const yearlyNet = yearlyIncome - yearlyPayout;
        const outstandingStudent = filteredStudentPay.filter(p=>p.status!=='Paid').reduce((s,p)=>s+p.monthlyAmount, 0);
        const outstandingInstructor = instructorPaymentSchedules
          .filter(s => s.status === 'Overdue' || s.status === 'Due Today')
          .reduce((s, sch) => s + sch.arrangement.paymentAmount, 0);

        // Monthly breakdown table
        const monthlyRows = MONTHS.map((mName, mi) => {
          const mStr = `${yearStr}-${String(mi+1).padStart(2,'0')}`;
          const inc = incomeEntries.filter(e=>e.date.startsWith(mStr)).reduce((s,e)=>s+e.amount,0);
          const instrPay = expenseEntries.filter(e=>e.date.startsWith(mStr)&&e.type==='Instructor Payment').reduce((s,e)=>s+e.amount,0);
          const otherExp = expenseEntries.filter(e=>e.date.startsWith(mStr)&&e.type!=='Instructor Payment').reduce((s,e)=>s+e.amount,0);
          const totalOut = instrPay + otherExp;
          const net = inc - totalOut;
          return { month: mName, inc, instrPay, otherExp, totalOut, net };
        });

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-default)]">
              <div>
                <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Financial Reports & Analytics</h3>
                <p className="text-xs text-[var(--text-secondary)]">Yearly summaries, monthly breakdowns, and filtered transaction reports.</p>
              </div>
              <button
                onClick={() => generatePDFReport(
                  `Dare Institute — Financial Report ${reportYear}`,
                  `Annual financial summary for ${reportYear}`,
                  ['Month','Income','Instructor Payout','Other Expenses','Total Outgoing','Net Income'],
                  monthlyRows.map(r=>[r.month,fmt(r.inc),fmt(r.instrPay),fmt(r.otherExp),fmt(r.totalOut),fmt(r.net)]),
                  [
                    {label:'Total Income', value: fmt(yearlyIncome)},
                    {label:'Total Payout', value: fmt(yearlyPayout)},
                    {label:'Net Income',   value: fmt(yearlyNet)},
                  ]
                )}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-bold transition-all shrink-0"
              >
                <Printer className="w-3.5 h-3.5" /> Print Report
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)]">
              <select value={reportYear} onChange={e=>setReportYear(Number(e.target.value))}
                className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] outline-none">
                {years.map(y=><option key={y} value={y}>{y}</option>)}
              </select>
              <select value={reportMonth === 'all' ? 'all' : String(reportMonth)} onChange={e=>setReportMonth(e.target.value==='all'?'all':Number(e.target.value))}
                className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] outline-none">
                <option value="all">All Months</option>
                {MONTHS.map((m,i)=><option key={m} value={i}>{m}</option>)}
              </select>
              <select value={reportTypeFilter} onChange={e=>setReportTypeFilter(e.target.value as typeof reportTypeFilter)}
                className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] outline-none">
                <option value="all">Income + Expenses</option>
                <option value="income">Income Only</option>
                <option value="expense">Expenses Only</option>
              </select>
              <input value={reportStudentFilter} onChange={e=>setReportStudentFilter(e.target.value)}
                placeholder="Filter by student…"
                className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] outline-none focus:border-[#E9C349] min-w-36" />
              <input value={reportInstructorFilter} onChange={e=>setReportInstructorFilter(e.target.value)}
                placeholder="Filter by instructor…"
                className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] outline-none focus:border-[#E9C349] min-w-36" />
            </div>

            {/* Yearly summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {label:'Total Income',                value:fmt(yearlyIncome),        color:'text-emerald-400', border:'border-emerald-500/30'},
                {label:'Total Student Payments',      value:fmt(yearlyStudentPay),     color:'text-blue-400',    border:'border-blue-500/30'},
                {label:'Total Instructor Payments',   value:fmt(yearlyInstructorPay),  color:'text-amber-400',   border:'border-amber-500/30'},
                {label:'Other Expenses',              value:fmt(yearlyOtherExpenses),  color:'text-red-400',     border:'border-red-500/30'},
                {label:'Total Payout',                value:fmt(yearlyPayout),         color:'text-red-300',     border:'border-red-500/20'},
                {label:'Net Income',                  value:fmt(yearlyNet),            color:yearlyNet>=0?'text-emerald-400':'text-red-400', border:yearlyNet>=0?'border-emerald-500/30':'border-red-500/30'},
                {label:'Outstanding Student Pmts',    value:fmt(outstandingStudent),   color:'text-amber-400',   border:'border-amber-500/30'},
                {label:'Outstanding Instructor Pmts', value:fmt(outstandingInstructor),color:'text-red-400',     border:'border-red-500/30'},
              ].map(c=>(
                <div key={c.label} className={`p-3 rounded-2xl bg-[var(--bg-panel)] border ${c.border} space-y-1`}>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{c.label}</div>
                  <div className={`text-base font-mono font-bold ${c.color}`}>{c.value}</div>
                </div>
              ))}
            </div>

            {/* Monthly breakdown table */}
            <div>
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--text-muted)] mb-3">Monthly Breakdown — {reportYear}</h4>
              <div className="overflow-x-auto rounded-2xl border border-[var(--border-default)]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[var(--bg-panel)] text-[var(--text-muted)] text-[10px] font-mono uppercase border-b border-[var(--border-default)]">
                      <th className="py-3 px-4 text-left">Month</th>
                      <th className="py-3 px-4 text-right">Income</th>
                      <th className="py-3 px-4 text-right">Instructor Payout</th>
                      <th className="py-3 px-4 text-right">Other Expenses</th>
                      <th className="py-3 px-4 text-right">Total Outgoing</th>
                      <th className="py-3 px-4 text-right">Net Income</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {monthlyRows.map(r => (
                      <tr key={r.month} className="hover:bg-[var(--bg-glass)] transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">{r.month}</td>
                        <td className="py-2.5 px-4 text-right font-mono text-emerald-400">{r.inc > 0 ? fmt(r.inc) : '—'}</td>
                        <td className="py-2.5 px-4 text-right font-mono text-amber-400">{r.instrPay > 0 ? fmt(r.instrPay) : '—'}</td>
                        <td className="py-2.5 px-4 text-right font-mono text-red-400">{r.otherExp > 0 ? fmt(r.otherExp) : '—'}</td>
                        <td className="py-2.5 px-4 text-right font-mono text-red-300">{r.totalOut > 0 ? fmt(r.totalOut) : '—'}</td>
                        <td className={`py-2.5 px-4 text-right font-mono font-bold ${r.net >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {r.inc === 0 && r.totalOut === 0 ? '—' : fmt(r.net)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[var(--border-default)] bg-[var(--bg-panel)]">
                      <td className="py-3 px-4 font-bold text-[var(--text-muted)] text-[10px] font-mono uppercase">Total</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">{fmt(yearlyIncome)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">{fmt(yearlyInstructorPay)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-red-400">{fmt(yearlyOtherExpenses)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-red-300">{fmt(yearlyPayout)}</td>
                      <td className={`py-3 px-4 text-right font-mono font-bold text-sm ${yearlyNet>=0?'text-emerald-400':'text-red-400'}`}>{fmt(yearlyNet)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Export buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => exportToCSV(`Dare_Finance_Report_${reportYear}`,
                  ['Month','Income','Instructor Payout','Other Expenses','Total Outgoing','Net Income'],
                  monthlyRows.map(r=>[r.month,r.inc,r.instrPay,r.otherExp,r.totalOut,r.net])
                )}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E9C349]/15 text-[#E9C349] border border-[#E9C349]/30 text-xs font-bold hover:bg-[#E9C349]/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Export Monthly CSV
              </button>
              <button
                onClick={() => exportToCSV(`Dare_Transactions_${reportYear}`,
                  ['Date','Category','Type','Description','Amount','Method','Reference','Person/Recipient'],
                  [
                    ...filteredIncome.map(e=>  [e.date,'Income',  e.type, e.description, e.amount, e.method, e.reference, e.relatedPerson]),
                    ...filteredExpenses.map(e=>[e.date,'Expense', e.type, e.description, e.amount, e.method, e.reference, e.recipient]),
                  ].sort((a,b)=>String(b[0]).localeCompare(String(a[0])))
                )}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-500/25 text-xs font-bold hover:bg-blue-500/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Export All Transactions CSV
              </button>
            </div>
          </div>
        );
      })()}

      {/* ══════════ MODAL: Pay Instructor ══════════ */}
      {payModalInstructorId && (() => {
        const sched = instructorPaymentSchedules.find(s => s.instructorId === payModalInstructorId);
        if (!sched) return null;
        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[var(--bg-panel)] border border-[#E9C349]/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
                <div>
                  <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Pay Instructor</h3>
                  <p className="text-[10px] text-[var(--text-muted)]">{sched.instructorName} — {monthLabel(sched.nextDueDate)}</p>
                </div>
                <button onClick={() => setPayModalInstructorId(null)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handlePayInstructorSubmit} className="space-y-3 text-xs">
                <div>
                  <label className={labelCls}>Amount (ETB) <span className="text-red-400">*</span></label>
                  <input type="number" required min="1" value={payForm.amount}
                    onChange={e => setPayForm(f => ({...f, amount: e.target.value}))}
                    placeholder={String(sched.arrangement.paymentAmount)}
                    className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>Payment Date <span className="text-red-400">*</span></label>
                  <input type="date" required value={payForm.paymentDate}
                    onChange={e => setPayForm(f => ({...f, paymentDate: e.target.value}))}
                    className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>Payment Method <span className="text-red-400">*</span></label>
                  <select value={payForm.method} onChange={e => setPayForm(f => ({...f, method: e.target.value}))} className={fieldCls}>
                    {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Reference / Receipt No.</label>
                  <input type="text" value={payForm.reference}
                    onChange={e => setPayForm(f => ({...f, reference: e.target.value}))}
                    placeholder="e.g. TRX-2026-001"
                    className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>Notes</label>
                  <textarea rows={2} value={payForm.notes}
                    onChange={e => setPayForm(f => ({...f, notes: e.target.value}))}
                    className={fieldCls} />
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#E9C349] text-black font-bold text-xs hover:brightness-110 transition-all">
                    Confirm Payment
                  </button>
                  <button type="button" onClick={() => setPayModalInstructorId(null)}
                    className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text-primary)] font-semibold text-xs transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* ══════════ MODAL: Mark Student Payment Paid ══════════ */}
      {studentPayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--bg-panel)] border border-[#E9C349]/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
              <div>
                <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Mark Payment as Paid</h3>
                <p className="text-[10px] text-[var(--text-muted)]">{studentPayModal.studentName} — {studentPayModal.paymentMonth}</p>
              </div>
              <button onClick={() => setStudentPayModal(null)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleMarkStudentPaid} className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold">
                Amount: {fmt(studentPayModal.monthlyAmount)}
              </div>
              <div>
                <label className={labelCls}>Payment Date <span className="text-red-400">*</span></label>
                <input type="date" required value={studentPayForm.paymentDate}
                  onChange={e => setStudentPayForm(f=>({...f, paymentDate: e.target.value}))}
                  className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Payment Method <span className="text-red-400">*</span></label>
                <select value={studentPayForm.method} onChange={e => setStudentPayForm(f=>({...f, method: e.target.value}))} className={fieldCls}>
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Reference / Receipt No.</label>
                <input type="text" value={studentPayForm.reference}
                  onChange={e => setStudentPayForm(f=>({...f, reference: e.target.value}))}
                  className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Notes</label>
                <textarea rows={2} value={studentPayForm.notes}
                  onChange={e => setStudentPayForm(f=>({...f, notes: e.target.value}))}
                  className={fieldCls} />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all">
                  Confirm Paid
                </button>
                <button type="button" onClick={() => setStudentPayModal(null)}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text-primary)] font-semibold text-xs transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════ MODAL: Add Income ══════════ */}
      {incomeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--bg-panel)] border border-[#E9C349]/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
              <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Add Income Entry</h3>
              <button onClick={() => setIncomeModalOpen(false)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddIncomeSubmit} className="space-y-3 text-xs">
              <div>
                <label className={labelCls}>Income Type <span className="text-red-400">*</span></label>
                <select value={incomeForm.type} onChange={e=>setIncomeForm(f=>({...f, type: e.target.value as IncomeEntry['type']}))} className={fieldCls}>
                  <option value="Student Payment">Student Payment</option>
                  <option value="Registration Fee">Registration Fee</option>
                  <option value="Other Income">Other Income</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Description <span className="text-red-400">*</span></label>
                <input type="text" required value={incomeForm.description} onChange={e=>setIncomeForm(f=>({...f, description: e.target.value}))} className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Amount (ETB) <span className="text-red-400">*</span></label>
                <input type="number" required min="1" value={incomeForm.amount} onChange={e=>setIncomeForm(f=>({...f, amount: e.target.value}))} className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Date <span className="text-red-400">*</span></label>
                <input type="date" required value={incomeForm.date} onChange={e=>setIncomeForm(f=>({...f, date: e.target.value}))} className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Payment Method</label>
                <select value={incomeForm.method} onChange={e=>setIncomeForm(f=>({...f, method: e.target.value}))} className={fieldCls}>
                  {PAYMENT_METHODS.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Reference</label>
                <input type="text" value={incomeForm.reference} onChange={e=>setIncomeForm(f=>({...f, reference: e.target.value}))} className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Related Person</label>
                <input type="text" value={incomeForm.relatedPerson} onChange={e=>setIncomeForm(f=>({...f, relatedPerson: e.target.value}))} className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Notes</label>
                <textarea rows={2} value={incomeForm.notes} onChange={e=>setIncomeForm(f=>({...f, notes: e.target.value}))} className={fieldCls} />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all">Save Income</button>
                <button type="button" onClick={()=>setIncomeModalOpen(false)} className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text-primary)] font-semibold text-xs transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════ MODAL: Add Expense ══════════ */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--bg-panel)] border border-[#E9C349]/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
              <h3 className="text-sm font-bold font-serif text-[var(--text-primary)]">Add Expense Entry</h3>
              <button onClick={() => setExpenseModalOpen(false)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddExpenseSubmit} className="space-y-3 text-xs">
              <div>
                <label className={labelCls}>Expense Type <span className="text-red-400">*</span></label>
                <select value={expenseForm.type} onChange={e=>setExpenseForm(f=>({...f, type: e.target.value as ExpenseEntry['type']}))} className={fieldCls}>
                  <option value="Instructor Payment">Instructor Payment</option>
                  <option value="Supplies">Supplies</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Rent">Rent</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Description <span className="text-red-400">*</span></label>
                <input type="text" required value={expenseForm.description} onChange={e=>setExpenseForm(f=>({...f, description: e.target.value}))} className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Amount (ETB) <span className="text-red-400">*</span></label>
                <input type="number" required min="1" value={expenseForm.amount} onChange={e=>setExpenseForm(f=>({...f, amount: e.target.value}))} className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Date <span className="text-red-400">*</span></label>
                <input type="date" required value={expenseForm.date} onChange={e=>setExpenseForm(f=>({...f, date: e.target.value}))} className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Payment Method</label>
                <select value={expenseForm.method} onChange={e=>setExpenseForm(f=>({...f, method: e.target.value}))} className={fieldCls}>
                  {PAYMENT_METHODS.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Recipient</label>
                <input type="text" value={expenseForm.recipient} onChange={e=>setExpenseForm(f=>({...f, recipient: e.target.value}))} className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Reference</label>
                <input type="text" value={expenseForm.reference} onChange={e=>setExpenseForm(f=>({...f, reference: e.target.value}))} className={fieldCls} />
              </div>
              {expenseForm.type === 'Instructor Payment' && (
                <div>
                  <label className={labelCls}>Related Instructor</label>
                  <select value={expenseForm.relatedInstructorId} onChange={e=>setExpenseForm(f=>({...f, relatedInstructorId: e.target.value}))} className={fieldCls}>
                    <option value="">— Select instructor —</option>
                    {instructors.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className={labelCls}>Notes</label>
                <textarea rows={2} value={expenseForm.notes} onChange={e=>setExpenseForm(f=>({...f, notes: e.target.value}))} className={fieldCls} />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all">Save Expense</button>
                <button type="button" onClick={()=>setExpenseModalOpen(false)} className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text-primary)] font-semibold text-xs transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
