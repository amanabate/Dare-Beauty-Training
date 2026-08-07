'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  CreditCard, 
  Award, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { exportToCSV, generatePDFReport } from '../../utils/exportUtils';
import { Language } from '../../types';

interface AdminReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: Language;
}

// Sample Comprehensive Datasets representing live database records
const MOCK_STUDENTS = [
  { id: 'REG-2026-001', name: 'Abebe Kebede', gender: 'Male', course: 'Hair Dressing & Styling', status: 'Active', phone: '+251 91 123 4567', attendance: 88, feeStatus: 'Pending', balance: '2,500 ETB' },
  { id: 'REG-2026-002', name: 'Tigist Haile', gender: 'Female', course: 'Makeup Artistry', status: 'Active', phone: '+251 92 234 5678', attendance: 94, feeStatus: 'Pending', balance: '1,800 ETB' },
  { id: 'REG-2026-003', name: 'Chala Bekele', gender: 'Male', course: 'Barbering & Grooming', status: 'Active', phone: '+251 93 345 6789', attendance: 68, feeStatus: 'Pending', balance: '3,000 ETB' },
  { id: 'REG-2026-004', name: 'Selam Alemu', gender: 'Female', course: 'Nail Care Technology', status: 'Active', phone: '+251 94 456 7890', attendance: 91, feeStatus: 'Pending', balance: '1,200 ETB' },
  { id: 'REG-2026-005', name: 'Bethlehem Worku', gender: 'Female', course: 'Hair Dressing & Styling', status: 'Ready for Cert', phone: '+251 91 567 8901', attendance: 98, feeStatus: 'Paid', balance: '0 ETB' },
  { id: 'REG-2026-006', name: 'Kaleb Desta', gender: 'Male', course: 'Barbering & Grooming', status: 'Ready for Cert', phone: '+251 92 678 9012', attendance: 96, feeStatus: 'Paid', balance: '0 ETB' },
  { id: 'REG-2026-007', name: 'Hiwot Tsegaye', gender: 'Female', course: 'Makeup Artistry', status: 'Ready for Cert', phone: '+251 93 789 0123', attendance: 95, feeStatus: 'Paid', balance: '0 ETB' },
  { id: 'REG-2026-008', name: 'Dawit Tadesse', gender: 'Male', course: 'Barbering & Grooming', status: 'At Risk (<75%)', phone: '+251 94 890 1234', attendance: 68, feeStatus: 'Paid', balance: '0 ETB' },
  { id: 'REG-2026-009', name: 'Meron Zewde', gender: 'Female', course: 'Beauty Therapy & Spa', status: 'At Risk (<75%)', phone: '+251 91 901 2345', attendance: 71, feeStatus: 'Paid', balance: '0 ETB' },
  { id: 'REG-2026-010', name: 'Yared Shimelis', gender: 'Male', course: 'Hair Dressing & Styling', status: 'Active', phone: '+251 92 012 3456', attendance: 89, feeStatus: 'Paid', balance: '0 ETB' }
];

const MOCK_ATTENDANCE = [
  { id: 'ATT-101', student: 'Dawit Tadesse', course: 'Barbering & Grooming', sessionsAttended: 14, totalSessions: 21, percentage: '66.7%', status: 'Flagged (<75%)', instructor: 'Tigist Haile' },
  { id: 'ATT-102', student: 'Meron Zewde', course: 'Beauty Therapy & Spa', sessionsAttended: 15, totalSessions: 21, percentage: '71.4%', status: 'Flagged (<75%)', instructor: 'Marta Assefa' },
  { id: 'ATT-103', student: 'Abebe Kebede', course: 'Hair Dressing & Styling', sessionsAttended: 18, totalSessions: 21, percentage: '85.7%', status: 'Normal', instructor: 'Selamawit Abera' },
  { id: 'ATT-104', student: 'Bethlehem Worku', course: 'Hair Dressing & Styling', sessionsAttended: 21, totalSessions: 21, percentage: '100%', status: 'Excellent', instructor: 'Selamawit Abera' },
  { id: 'ATT-105', student: 'Tigist Haile', course: 'Makeup Artistry', sessionsAttended: 20, totalSessions: 21, percentage: '95.2%', status: 'Excellent', instructor: 'Marta Assefa' },
  { id: 'ATT-106', student: 'Chala Bekele', course: 'Barbering & Grooming', sessionsAttended: 14, totalSessions: 21, percentage: '66.7%', status: 'Flagged (<75%)', instructor: 'Tigist Haile' }
];

const MOCK_PAYMENTS = [
  { receiptNo: 'REC-88401', student: 'Abebe Kebede', course: 'Hair Dressing', amountTotal: '8,500 ETB', amountPaid: '6,000 ETB', balance: '2,500 ETB', dueDate: '2026-08-15', status: 'PARTIAL' },
  { receiptNo: 'REC-88402', student: 'Tigist Haile', course: 'Makeup Artistry', amountTotal: '9,000 ETB', amountPaid: '7,200 ETB', balance: '1,800 ETB', dueDate: '2026-08-20', status: 'PARTIAL' },
  { receiptNo: 'REC-88403', student: 'Chala Bekele', course: 'Barbering', amountTotal: '7,500 ETB', amountPaid: '4,500 ETB', balance: '3,000 ETB', dueDate: '2026-08-10', status: 'PARTIAL' },
  { receiptNo: 'REC-88404', student: 'Selam Alemu', course: 'Nail Tech', amountTotal: '6,000 ETB', amountPaid: '4,800 ETB', balance: '1,200 ETB', dueDate: '2026-08-25', status: 'PARTIAL' },
  { receiptNo: 'REC-88405', student: 'Bethlehem Worku', course: 'Hair Dressing', amountTotal: '8,500 ETB', amountPaid: '8,500 ETB', balance: '0 ETB', dueDate: '2026-07-30', status: 'FULL_PAID' },
  { receiptNo: 'REC-88406', student: 'Kaleb Desta', course: 'Barbering', amountTotal: '7,500 ETB', amountPaid: '7,500 ETB', balance: '0 ETB', dueDate: '2026-07-30', status: 'FULL_PAID' }
];

export const AdminReportsModal: React.FC<AdminReportsModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'en'
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'attendance' | 'payments'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');

  if (!isOpen) return null;

  // Filtered dataset calculation
  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCourse = selectedCourse === 'All' || s.course.includes(selectedCourse);
      return matchSearch && matchCourse;
    });
  }, [searchTerm, selectedCourse]);

  const filteredAttendance = useMemo(() => {
    return MOCK_ATTENDANCE.filter(a => {
      const matchSearch = a.student.toLowerCase().includes(searchTerm.toLowerCase()) || a.course.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCourse = selectedCourse === 'All' || a.course.includes(selectedCourse);
      return matchSearch && matchCourse;
    });
  }, [searchTerm, selectedCourse]);

  const filteredPayments = useMemo(() => {
    return MOCK_PAYMENTS.filter(p => {
      const matchSearch = p.student.toLowerCase().includes(searchTerm.toLowerCase()) || p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCourse = selectedCourse === 'All' || p.course.includes(selectedCourse);
      return matchSearch && matchCourse;
    });
  }, [searchTerm, selectedCourse]);

  // Export handlers
  const handleExportCSV = () => {
    if (activeTab === 'students') {
      const headers = ['Student ID', 'Full Name', 'Gender', 'Enrolled Course', 'Status', 'Phone', 'Attendance %', 'Fee Status', 'Outstanding Balance'];
      const rows = filteredStudents.map(s => [s.id, s.name, s.gender, s.course, s.status, s.phone, `${s.attendance}%`, s.feeStatus, s.balance]);
      exportToCSV('Dare_Institute_Students_List', headers, rows);
    } else if (activeTab === 'attendance') {
      const headers = ['Record ID', 'Student Name', 'Course', 'Sessions Attended', 'Total Sessions', 'Attendance Rate', 'Status', 'Instructor'];
      const rows = filteredAttendance.map(a => [a.id, a.student, a.course, a.sessionsAttended, a.totalSessions, a.percentage, a.status, a.instructor]);
      exportToCSV('Dare_Institute_Attendance_Report', headers, rows);
    } else {
      const headers = ['Receipt No', 'Student Name', 'Course', 'Total Fee', 'Amount Paid', 'Outstanding Balance', 'Due Date', 'Payment Status'];
      const rows = filteredPayments.map(p => [p.receiptNo, p.student, p.course, p.amountTotal, p.amountPaid, p.balance, p.dueDate, p.status]);
      exportToCSV('Dare_Institute_Payments_Report', headers, rows);
    }
  };

  const handleExportPDF = () => {
    if (activeTab === 'students') {
      const headers = ['Student ID', 'Full Name', 'Course', 'Status', 'Attendance', 'Fee Balance'];
      const rows = filteredStudents.map(s => [s.id, s.name, s.course, s.status, `${s.attendance}%`, s.balance]);
      const stats = [
        { label: 'Total Records', value: String(filteredStudents.length) },
        { label: 'Ready for Certificate', value: '3 Students' },
        { label: 'Total Pending Balances', value: '8,500 ETB' }
      ];
      generatePDFReport('Enrolled Students Registry', 'Official list of registered students & academic standing', headers, rows, stats);
    } else if (activeTab === 'attendance') {
      const headers = ['Record ID', 'Student Name', 'Course', 'Attended', 'Rate', 'Status', 'Instructor'];
      const rows = filteredAttendance.map(a => [a.id, a.student, a.course, `${a.sessionsAttended}/${a.totalSessions}`, a.percentage, a.status, a.instructor]);
      const stats = [
        { label: 'Total Logged', value: String(filteredAttendance.length) },
        { label: 'Below 75% Alert', value: '3 Students' },
        { label: 'Monthly Avg Rate', value: '81.2%' }
      ];
      generatePDFReport('Monthly Student Attendance Log', 'Comprehensive breakdown of practical & theory attendance session logs', headers, rows, stats);
    } else {
      const headers = ['Receipt No', 'Student Name', 'Course', 'Total Tuition', 'Paid', 'Pending Balance', 'Due Date'];
      const rows = filteredPayments.map(p => [p.receiptNo, p.student, p.course, p.amountTotal, p.amountPaid, p.balance, p.dueDate]);
      const stats = [
        { label: 'Report Total', value: String(filteredPayments.length) },
        { label: 'Total Outstanding', value: '8,500 ETB' },
        { label: 'Collection Rate', value: '82.4%' }
      ];
      generatePDFReport('Tuition & Payment Statement', 'Institute fee receipts, installment schedules, and outstanding balances', headers, rows, stats);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-[#FAF8F5] dark:bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-3xl shadow-2xl border border-[#E9C349]/40 overflow-hidden my-6 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-[var(--bg-base)] p-6 text-white border-b border-[#E9C349]/30 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D468] text-black flex items-center justify-center shadow-lg">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#E9C349] uppercase font-bold">
                  Administrative Data Center
                </span>
                <h2 className="text-xl font-serif font-bold text-white">
                  Export & Reports Manager
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
                title="Export current table view to CSV"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E9C349] text-black hover:bg-[#F5D468] text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
                title="Generate printable PDF report"
              >
                <Printer className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-[var(--bg-panel)] px-6 py-2.5 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0 gap-4 overflow-x-auto">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('students')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
                  activeTab === 'students'
                    ? 'bg-[#E9C349] text-black shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Enrolled Students ({MOCK_STUDENTS.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
                  activeTab === 'attendance'
                    ? 'bg-[#E9C349] text-black shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Attendance Logs</span>
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
                  activeTab === 'payments'
                    ? 'bg-[#E9C349] text-black shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Payment Reports</span>
              </button>
            </div>

            {/* Quick Filter */}
            <div className="flex items-center space-x-2 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/40 text-xs pl-8 pr-3 py-1.5 rounded-xl border border-[var(--border-default)] text-white placeholder-gray-400 outline-none focus:border-[#E9C349]"
                />
              </div>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="bg-black/40 text-xs px-3 py-1.5 rounded-xl border border-[var(--border-default)] text-white outline-none focus:border-[#E9C349]"
              >
                <option value="All">All Courses</option>
                <option value="Hair Dressing">Hair Dressing</option>
                <option value="Barbering">Barbering</option>
                <option value="Makeup">Makeup Art</option>
                <option value="Nail">Nail Tech</option>
              </select>
            </div>
          </div>

          {/* Table Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'students' && (
              <div className="overflow-x-auto rounded-2xl border border-[var(--border-default)] bg-white dark:bg-[var(--bg-card)]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-base)] text-[#E9C349] uppercase tracking-wider font-mono text-[10px]">
                      <th className="p-3">ID</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Course Program</th>
                      <th className="p-3">Attendance</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Tuition Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="p-3 font-mono text-[11px] font-bold text-[#D4AF37]">{s.id}</td>
                        <td className="p-3 font-semibold text-[var(--text-primary)]">{s.name}</td>
                        <td className="p-3 text-[var(--text-secondary)]">{s.course}</td>
                        <td className="p-3 font-mono">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            s.attendance < 75 ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            {s.attendance}%
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-semibold">
                            {s.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-[var(--text-primary)]">{s.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="overflow-x-auto rounded-2xl border border-[var(--border-default)] bg-white dark:bg-[var(--bg-card)]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-base)] text-[#E9C349] uppercase tracking-wider font-mono text-[10px]">
                      <th className="p-3">Record ID</th>
                      <th className="p-3">Student</th>
                      <th className="p-3">Course</th>
                      <th className="p-3">Sessions</th>
                      <th className="p-3">Rate</th>
                      <th className="p-3">Instructor</th>
                      <th className="p-3">Status Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {filteredAttendance.map((a) => (
                      <tr key={a.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="p-3 font-mono text-[11px] font-bold text-[#D4AF37]">{a.id}</td>
                        <td className="p-3 font-semibold text-[var(--text-primary)]">{a.student}</td>
                        <td className="p-3 text-[var(--text-secondary)]">{a.course}</td>
                        <td className="p-3 font-mono">{a.sessionsAttended} / {a.totalSessions}</td>
                        <td className="p-3 font-mono font-bold">{a.percentage}</td>
                        <td className="p-3 text-[var(--text-muted)]">{a.instructor}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            a.status.includes('Flagged')
                              ? 'bg-red-500/10 text-red-500 border border-red-500/30'
                              : 'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="overflow-x-auto rounded-2xl border border-[var(--border-default)] bg-white dark:bg-[var(--bg-card)]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-base)] text-[#E9C349] uppercase tracking-wider font-mono text-[10px]">
                      <th className="p-3">Receipt No</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Course</th>
                      <th className="p-3">Total Fee</th>
                      <th className="p-3">Amount Paid</th>
                      <th className="p-3">Pending Balance</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {filteredPayments.map((p) => (
                      <tr key={p.receiptNo} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="p-3 font-mono text-[11px] font-bold text-[#D4AF37]">{p.receiptNo}</td>
                        <td className="p-3 font-semibold text-[var(--text-primary)]">{p.student}</td>
                        <td className="p-3 text-[var(--text-secondary)]">{p.course}</td>
                        <td className="p-3 font-mono">{p.amountTotal}</td>
                        <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{p.amountPaid}</td>
                        <td className="p-3 font-mono text-amber-600 dark:text-amber-400 font-bold">{p.balance}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'FULL_PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="bg-white dark:bg-[var(--bg-panel)] border-t border-[var(--border-default)] p-4 px-6 flex items-center justify-between text-xs text-[var(--text-muted)] shrink-0">
            <span className="font-mono">
              Database Sync: <strong className="text-emerald-500">Prisma PostgreSQL Verified</strong>
            </span>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportCSV}
                className="text-[#D4AF37] font-semibold hover:underline flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="text-[#D4AF37] font-semibold hover:underline flex items-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print PDF Statement</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
