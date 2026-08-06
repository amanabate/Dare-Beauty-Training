'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, Users, CalendarCheck, Award, Filter, Sparkles, ArrowUpRight, BarChart3, PieChart as PieChartIcon, Activity 
} from 'lucide-react';
import { Language } from '../../types';

interface AnalyticsSectionProps {
  currentLang: Language;
}

// Data Sets matching Institute performance
const MONTHLY_ENROLLMENT_DATA = [
  { month: 'Jan', HairDressing: 120, Barbering: 85, Makeup: 60, BeautyTherapy: 40, NailTech: 30, total: 335 },
  { month: 'Feb', HairDressing: 135, Barbering: 90, Makeup: 65, BeautyTherapy: 45, NailTech: 35, total: 370 },
  { month: 'Mar', HairDressing: 150, Barbering: 110, Makeup: 80, BeautyTherapy: 50, NailTech: 40, total: 430 },
  { month: 'Apr', HairDressing: 170, Barbering: 125, Makeup: 95, BeautyTherapy: 60, NailTech: 45, total: 495 },
  { month: 'May', HairDressing: 190, Barbering: 140, Makeup: 110, BeautyTherapy: 70, NailTech: 50, total: 560 },
  { month: 'Jun', HairDressing: 220, Barbering: 160, Makeup: 130, BeautyTherapy: 85, NailTech: 60, total: 655 },
  { month: 'Jul', HairDressing: 250, Barbering: 180, Makeup: 150, BeautyTherapy: 95, NailTech: 70, total: 745 },
  { month: 'Aug', HairDressing: 280, Barbering: 210, Makeup: 175, BeautyTherapy: 110, NailTech: 80, total: 855 }
];

const ATTENDANCE_TREND_DATA = [
  { week: 'Wk 1', Theory: 95, Practical: 92, InstituteAvg: 93.5 },
  { week: 'Wk 2', Theory: 92, Practical: 90, InstituteAvg: 91.0 },
  { week: 'Wk 3', Theory: 88, Practical: 94, InstituteAvg: 91.0 },
  { week: 'Wk 4', Theory: 91, Practical: 96, InstituteAvg: 93.5 },
  { week: 'Wk 5', Theory: 86, Practical: 91, InstituteAvg: 88.5 },
  { week: 'Wk 6', Theory: 94, Practical: 95, InstituteAvg: 94.5 },
  { week: 'Wk 7', Theory: 90, Practical: 93, InstituteAvg: 91.5 },
  { week: 'Wk 8', Theory: 96, Practical: 98, InstituteAvg: 97.0 }
];

const COURSE_POPULARITY_DATA = [
  { name: 'Hair Dressing', students: 510, percentage: 35, color: '#E9C349' },
  { name: 'Barbering', students: 365, percentage: 25, color: '#D4AF37' },
  { name: 'Makeup Artistry', students: 290, percentage: 20, color: '#F5D468' },
  { name: 'Beauty Therapy', students: 175, percentage: 12, color: '#A88B2A' },
  { name: 'Nail Technology', students: 115, percentage: 8, color: '#7A641A' }
];

const CUSTOM_TOOLTIP_STYLE = {
  backgroundColor: '#161619',
  borderColor: '#E9C349',
  borderRadius: '12px',
  color: '#FFFFFF',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
  padding: '12px 16px',
  fontSize: '12px'
};

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ currentLang }) => {
  const [activeTab, setActiveTab] = useState<'enrollment' | 'attendance' | 'courses'>('enrollment');
  const [timeRange, setTimeRange] = useState<'6m' | '1y' | 'all'>('1y');

  // Translations
  const title = currentLang === 'en' 
    ? 'Institute Analytics & Data Insights' 
    : currentLang === 'am' 
    ? 'የተቋሙ ትንታኔ እና መረጃዎች' 
    : 'Xiinxala Yuunivaarsiitii fi Deetaa';

  const subtitle = currentLang === 'en'
    ? 'Real-time performance metrics tracking student growth, course demand, and attendance excellence'
    : currentLang === 'am'
    ? 'የተማሪዎችን እድገት፣ የኮርስ ፍላጎት እና የትምህርት መገኘትን የሚያሳዩ የእውነተኛ ጊዜ መረጃዎች'
    : 'Oduu eeruu qabatamaa guddina barattootaa fi hirmaannaa barnoota agarsiisu';

  return (
    <section className="py-24 bg-[var(--bg-base)] text-[var(--text-primary)] relative border-t border-[var(--border-subtle)] transition-colors duration-300 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-[#E9C349]/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[350px] bg-[#D4AF37]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E9C349]/10 border border-[#E9C349]/30 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-widest mb-4">
            <Activity className="w-3.5 h-3.5" />
            <span>Harmonized Analytics Dashboard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Top KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] shadow-sm hover:border-[#E9C349]/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">Total Active Enrolled</span>
              <div className="p-2 rounded-xl bg-[#E9C349]/10 text-[#D4AF37] group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">1,455</div>
              <span className="text-xs font-bold text-emerald-500 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">Across all 5 beauty tracks</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] shadow-sm hover:border-[#E9C349]/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">Avg Attendance Rate</span>
              <div className="p-2 rounded-xl bg-[#E9C349]/10 text-[#D4AF37] group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">93.8%</div>
              <span className="text-xs font-bold text-emerald-500 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +2.1%
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">Exceeds 75% minimum threshold</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] shadow-sm hover:border-[#E9C349]/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">Graduation Rate</span>
              <div className="p-2 rounded-xl bg-[#E9C349]/10 text-[#D4AF37] group-hover:scale-110 transition-transform">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">96.8%</div>
              <span className="text-xs font-bold text-emerald-500 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +1.2%
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">COC Certification qualified</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-default)] shadow-sm hover:border-[#E9C349]/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">Top Program</span>
              <div className="p-2 rounded-xl bg-[#E9C349]/10 text-[#D4AF37] group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-lg font-bold text-[var(--text-primary)] truncate">Hair Dressing</div>
              <span className="text-xs font-mono font-bold text-[#D4AF37]">35% Share</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">510 enrolled candidates</p>
          </motion.div>
        </div>

        {/* Analytics Card Frame */}
        <div className="bg-[var(--bg-panel)] rounded-3xl border border-[var(--border-default)] shadow-xl overflow-hidden p-6 lg:p-8">
          {/* Controls & Tab Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)] mb-8">
            <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('enrollment')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
                  activeTab === 'enrollment'
                    ? 'bg-[#E9C349] text-black shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Monthly Enrollment</span>
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
                  activeTab === 'attendance'
                    ? 'bg-[#E9C349] text-black shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Attendance Trends</span>
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
                  activeTab === 'courses'
                    ? 'bg-[#E9C349] text-black shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <PieChartIcon className="w-4 h-4" />
                <span>Course Popularity</span>
              </button>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[var(--text-muted)] font-mono uppercase text-[10px]">Timeframe:</span>
              <div className="bg-black/10 dark:bg-white/5 p-1 rounded-xl border border-[var(--border-subtle)] flex items-center space-x-1">
                {(['6m', '1y', 'all'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase transition-all ${
                      timeRange === range
                        ? 'bg-[#E9C349] text-black font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {range === '6m' ? '6 Months' : range === '1y' ? '1 Year' : 'All Time'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Display Area */}
          <div className="w-full h-[380px] sm:h-[420px]">
            {/* Chart 1: Enrollment Growth Area Chart */}
            {activeTab === 'enrollment' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_ENROLLMENT_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E9C349" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#E9C349" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorHair" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(233,195,73,0.15)" vertical={false} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="total" name="Total Student Intake" stroke="#E9C349" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                  <Area type="monotone" dataKey="HairDressing" name="Hair Dressing" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorHair)" />
                  <Line type="monotone" dataKey="Barbering" name="Barbering" stroke="#F5D468" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Makeup" name="Makeup Art" stroke="#A88B2A" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {/* Chart 2: Student Attendance Bar Chart */}
            {activeTab === 'attendance' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ATTENDANCE_TREND_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(233,195,73,0.15)" vertical={false} />
                  <XAxis dataKey="week" stroke="#888888" fontSize={11} tickLine={false} />
                  <YAxis domain={[60, 100]} stroke="#888888" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(value: any) => [`${value}%`, 'Attendance']} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <ReferenceLine y={75} label={{ value: '75% Pass Threshold', fill: '#ef4444', fontSize: 10, position: 'insideBottomRight' }} stroke="#ef4444" strokeDasharray="4 4" />
                  <Bar dataKey="Practical" name="Practical Lab Attendance" fill="#E9C349" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Theory" name="Theory Class Attendance" fill="#A88B2A" radius={[6, 6, 0, 0]} />
                  <Line type="monotone" dataKey="InstituteAvg" name="Institute Average" stroke="#ffffff" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* Chart 3: Course Popularity Donut Chart */}
            {activeTab === 'courses' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={COURSE_POPULARITY_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      paddingAngle={4}
                      dataKey="students"
                    >
                      {COURSE_POPULARITY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.2)" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(value: any) => [`${value} Students`, 'Enrolled']} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider mb-2">Enrolled Student Distribution</h4>
                  {COURSE_POPULARITY_DATA.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)]">
                      <div className="flex items-center space-x-3">
                        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-bold text-[var(--text-primary)]">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-[#E9C349]">{item.students} students</span>
                        <span className="text-[10px] text-[var(--text-muted)] ml-2">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer insights note */}
          <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)] gap-2">
            <span className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#E9C349]" />
              <span>Data synchronized from Dare Institute Student Management System</span>
            </span>
            <span className="font-mono text-[10px] uppercase text-[#D4AF37]">Updated 2026 Academic Term</span>
          </div>
        </div>
      </div>
    </section>
  );
};
