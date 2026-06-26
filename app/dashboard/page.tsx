'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-context';
import { Sidebar } from '@/components/sidebar';
import { Navbar } from '@/components/navbar';
import { Banner } from '@/components/banner';
import { Breadcrumb } from '@/components/breadcrumb';
import { api, Task } from '@/lib/api';
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

// Pure React custom confirmation dialog
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs select-none">
      <div className="bg-white rounded-[24px] border border-[#e2e8f0] shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl flex items-center justify-center shrink-0 bg-[#FFEBEA] text-brand">
            <AlertCircle size={24} className="stroke-[2.5]" />
          </div>
          <h3 className="font-bold text-[18px] text-[#1e293b] font-sans">{title}</h3>
        </div>
        <p className="text-[13.5px] text-[#64748b] font-sans leading-relaxed">{description}</p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs font-sans cursor-pointer transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-white font-bold rounded-xl text-xs font-sans cursor-pointer transition-transform hover:-translate-y-px active:translate-y-0 bg-brand shadow-[0_4px_12px_rgba(255,80,45,0.25)] hover:bg-[#e04324]"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Concentric Rings SVG Graphic
const ConcentricRings: React.FC<{ total: number; done: number; active: number }> = ({ total, done, active }) => {
  return (
    <div className="flex items-center justify-center shrink-0">
      <div className="w-[115px] h-[115px] sm:w-[125px] sm:h-[125px] md:w-[130px] md:h-[130px] lg:w-[120px] lg:h-[120px] xl:w-[135px] xl:h-[135px] shrink-0">
        <svg width="100%" height="100%" viewBox="-12 -12 245 239" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision">
          <foreignObject x="80" y="77" width="60" height="60">
            <img
              src="/assets/images/16104409.gif"
              alt="Center animation"
              className="w-[60px] h-[60px] rounded-full object-cover"
            />
          </foreignObject>

          <g>
            <animateTransform attributeName="transform" type="rotate" from="0 110.484 107.5" to="360 110.484 107.5" dur="5s" repeatCount="indefinite" />
            <path d="M110.483 53.5C141.196 53.5 166.024 77.7151 166.024 107.5C166.024 137.285 141.196 161.5 110.483 161.5C79.7705 161.5 54.9434 137.285 54.9434 107.5C54.9434 77.7152 79.7705 53.5002 110.483 53.5Z" stroke="url(#paint_ring_1)" strokeWidth="3" />
            <ellipse cx="163.413" cy="90" rx="6.16652" ry="6" fill="#6956E5" />
          </g>

          <g>
            <animateTransform attributeName="transform" type="rotate" from="0 110.484 107.5" to="-360 110.484 107.5" dur="8s" repeatCount="indefinite" />
            <path d="M192.282 101.354C195.926 145.356 162.213 183.97 116.889 187.523C71.566 191.076 31.9337 158.211 28.2903 114.209C24.6469 70.2067 58.3607 31.5925 103.684 28.0397C149.007 24.4871 188.639 57.3517 192.282 101.354Z" stroke="url(#paint_ring_2)" strokeWidth="3" />
            <ellipse cx="95.5811" cy="186" rx="6.16652" ry="6" fill="#FB896B" />
          </g>

          <g>
            <animateTransform attributeName="transform" type="rotate" from="0 110.484 107.5" to="360 110.484 107.5" dur="13s" repeatCount="indefinite" />
            <path d="M110.483 1.5C170.712 1.5 219.467 48.9963 219.467 107.5C219.467 166.004 170.712 213.5 110.483 213.5C50.2545 213.5 1.5 166.004 1.5 107.5C1.5 48.9963 50.2545 1.50007 110.483 1.5Z" stroke="url(#paint_ring_3)" strokeWidth="3" />
            <ellipse cx="9.24953" cy="68" rx="6.16652" ry="6" fill="#F8C07F" />
          </g>

          <defs>
            <linearGradient id="paint0_linear_logo" x1="8.40009" y1="51.5999" x2="51.5999" y2="8.40009" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF8A70" />
              <stop offset="0.5" stopColor="#FF6B4A" />
              <stop offset="1" stopColor="#FF502D" />
            </linearGradient>
            <linearGradient id="paint_ring_1" x1="98.1506" y1="107" x2="87.9116" y2="56.3883" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6956E5" stopOpacity="0" /><stop offset="0.976403" stopColor="#6956E5" />
            </linearGradient>
            <linearGradient id="paint_ring_2" x1="68.1482" y1="86.7816" x2="184.121" y2="67.8498" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FB896B" stopOpacity="0" /><stop offset="1" stopColor="#FB896B" />
            </linearGradient>
            <linearGradient id="paint_ring_3" x1="42.1379" y1="47" x2="57.2272" y2="203.081" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F8C07F" stopOpacity="0" /><stop offset="1" stopColor="#F8C07F" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

// Gauge Chart SVG Graphic
const GaugeChart: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const center = 100;
  const radius = 68;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const fillPercentage = value / 100;
  const strokeDashoffset = circumference * (1 - fillPercentage);

  return (
    <svg width="170" height="170" viewBox="0 0 200 200" className="block mx-auto">
      <defs>
        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>
      </defs>
      <circle cx={center} cy={center} r={radius} fill="none" stroke="#F3F4F6" strokeWidth={strokeWidth} />
      <circle cx={center} cy={center} r={radius} fill="none" stroke="url(#gaugeGradient)" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" transform="rotate(-90 100 100)" />
      <text x={center} y={center + 5} textAnchor="middle" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '24px', fill: '#1e293b' }}>
        {`${Math.round(value)}%`}
      </text>
      <text x={center} y={center + 24} textAnchor="middle" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '11.5px', fill: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </text>
    </svg>
  );
};

interface MonthlyVelocityData {
  month: string;
  count: number;
}

const WaveChart: React.FC<{ data: MonthlyVelocityData[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[180px] flex items-center justify-center text-xs text-[#94a3b8] font-sans">
        No completed tasks velocity data
      </div>
    );
  }

  // Sizing and alignment parameters:
  const startX = 50;
  const endX = 600;
  const activeWidth = endX - startX;

  // Find max value in data to scale properly:
  const maxCount = Math.max(...data.map(d => d.count), 1);

  // Generate points
  const points = data.map((d, index) => {
    const x = startX + (index / (data.length - 1)) * activeWidth;
    const y = 175 - (d.count / maxCount) * 135; // range 40px to 175px
    return { x, y, month: d.month };
  });

  // Generate smooth curve path with Bezier curves
  let pathData = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const currPoint = points[i];
    const nextPoint = points[i + 1];

    // Calculate control points for smooth curve
    const controlX1 = prevPoint.x + (currPoint.x - prevPoint.x) / 2;
    const controlY1 = prevPoint.y;

    const controlX2 = currPoint.x - (nextPoint ? (nextPoint.x - currPoint.x) / 2 : 0);
    const controlY2 = currPoint.y;

    // Use quadratic curve
    pathData += ` Q ${controlX1} ${controlY1} ${currPoint.x} ${currPoint.y}`;
  }

  const fillPath = `${pathData} L ${points[points.length - 1].x} 200 L ${points[0].x} 200 Z`;

  return (
    <svg width="100%" height="220" viewBox="0 0 640 220" preserveAspectRatio="none" className="block">
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF502D" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#FF502D" stopOpacity="0.00" />
        </linearGradient>
      </defs>
      <line x1="50" y1="20" x2="600" y2="20" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="3 3" />
      <line x1="50" y1="65" x2="600" y2="65" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="3 3" />
      <line x1="50" y1="110" x2="600" y2="110" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="3 3" />
      <line x1="50" y1="155" x2="600" y2="155" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="3 3" />
      <line x1="50" y1="200" x2="600" y2="200" stroke="#E2E8F0" strokeWidth="1" />

      <path d={fillPath} fill="url(#waveGradient)" />
      <path d={pathData} fill="none" stroke="#FF502D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {points.map((p, idx) => (
        <g key={idx}>
          <circle cx={p.x} cy={p.y} r="4" fill="#FF502D" stroke="white" strokeWidth="1.5" />
          <text x={p.x} y="218" textAnchor="middle" style={{ fontFamily: 'Poppins', fontSize: 11, fill: '#94a3b8' }}>
            {p.month}
          </text>
        </g>
      ))}
    </svg>
  );
};

// KPI Card Component
interface KpiCardProps {
  title: string;
  value: string | number;
  footerText: string;
  borderColor: string;
  bgGradient: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, footerText, borderColor, bgGradient }) => {
  return (
    <div style={{ borderColor }} className="p-[6px] border-[1.5px] rounded-[20px] bg-white flex flex-col h-full box-border transition-all duration-200 hover:translate-y-[-3px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.04)]">
      <div style={{ background: bgGradient }} className="rounded-[12px] p-3.5 sm:p-4 flex flex-col justify-between grow h-full box-border">
        <div>
          <span className="text-[#64748b] text-[13px] font-bold font-sans leading-tight">{title}</span>
          <h3 className="text-[24px] font-bold text-[#1e293b] mt-0.5 leading-none font-sans">{value}</h3>
        </div>
        <div className="flex items-end justify-between mt-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
            <span className="text-[#64748b] text-[11.5px] font-bold font-sans truncate leading-none">{footerText}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.02)] shrink-0 transition-colors hover:bg-slate-50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    testing: 0,
    active: 0,
    done: 0,
    high: 0,
    medium: 0,
    low: 0
  });
  const [previewTasks, setPreviewTasks] = useState<Task[]>([]);
  const [analytics, setAnalytics] = useState<{
    deliveryRate: number;
    monthlyVelocity: MonthlyVelocityData[];
  }>({
    deliveryRate: 0,
    monthlyVelocity: []
  });
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  // Fetch metrics and preview tasks from a single backend endpoint
  const fetchDashboardData = async () => {
    setLoadingTasks(true);
    try {
      const response = await api.get<{
        success: boolean;
        data: {
          stats: {
            total: number;
            open: number;
            inProgress: number;
            testing: number;
            active: number;
            done: number;
            high: number;
            medium: number;
            low: number;
          };
          recentTasks: Task[];
        }
      }>('/tasks/stats');
      if (response.success) {
        setStats(response.data.stats);
        setPreviewTasks(response.data.recentTasks);
      }
    } catch (err: any) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get<{
        success: boolean;
        data: {
          deliveryRate: number;
          monthlyVelocity: MonthlyVelocityData[];
        }
      }>('/tasks/analytics');
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (err: any) {
      console.error('Failed to load analytics data:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchAnalytics();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7F9]">
        <Loader2 className="animate-spin text-brand" size={36} />
      </div>
    );
  }

  const completionRate = stats.total > 0 ? (stats.done / stats.total) * 100 : 0;

  const breadcrumbs = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Dashboard' }
  ];

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#F5F7F9] font-sans text-slate-700 select-none">

      <Sidebar onExpandChange={setSidebarExpanded} />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isMobile ? 'ml-0' : sidebarExpanded ? 'ml-[290px]' : 'ml-[80px]'
        }`}>

        <Navbar title="Workspace" />

        <main className="flex-1 px-6 py-4 md:px-8 md:py-4.5 space-y-5 overflow-y-auto max-w-full">

          <Breadcrumb items={breadcrumbs} />

          <Banner
            backgroundImage="/assets/images/dashboard.jpg"
            title="Workspace Admin Dashboard"
            description="Manage tasks, priorities, and collaborator assignments under a unified dashboard."
            actionButton={{
              text: 'Log Out',
              onClick: () => setIsLogoutConfirmOpen(true),
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch lg:h-[280px]">
            <div className="grid grid-cols-2 gap-4 h-[260px] sm:h-[280px] lg:h-full">
              <KpiCard title="Total Tasks" value={stats.total} footerText="Assigned in scope" borderColor="#A78BFA" bgGradient="linear-gradient(180deg, rgba(150, 100, 255, 0.15) 0%, rgba(255, 255, 255, 0.15) 93.95%)" />
              <KpiCard title="Open Tasks" value={stats.open} footerText="Awaiting start" borderColor="#4EB860" bgGradient="linear-gradient(180deg, rgba(152, 255, 100, 0.15) 0%, rgba(255, 255, 255, 0.15) 93.95%)" />
              <KpiCard title="Active Tasks" value={stats.active} footerText="In dev / test" borderColor="#FF9F59" bgGradient="linear-gradient(180deg, rgba(255, 161, 117, 0.15) 0%, rgba(255, 255, 255, 0.15) 93.95%)" />
              <KpiCard title="Done Tasks" value={stats.done} footerText="Completed" borderColor="#5B92FF" bgGradient="linear-gradient(180deg, rgba(100, 139, 255, 0.15) 0%, rgba(255, 255, 255, 0.15) 93.95%)" />
            </div>

            <div className="p-4 sm:p-5 border-[1.5px] border-[#e2e8f0] bg-white rounded-[24px] h-[280px] lg:h-full flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] box-border">
              <span className="font-bold text-[15px] text-[#1e293b] font-sans">Task Priority Distribution</span>
              <div className="flex items-center justify-between gap-4 flex-1">
                <div className="space-y-2.5 font-sans">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#64748b] font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F8C07F]" />
                      Low Priority
                    </div>
                    <span className="text-[18px] font-extrabold text-[#1e293b] pl-4 mt-0.5 leading-none block">{stats.low}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#64748b] font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FB896B]" />
                      Medium
                    </div>
                    <span className="text-[18px] font-extrabold text-[#1e293b] pl-4 mt-0.5 leading-none block">{stats.medium}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#64748b] font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#6956E5]" />
                      High Priority
                    </div>
                    <span className="text-[18px] font-extrabold text-[#1e293b] pl-4 mt-0.5 leading-none block">{stats.high}</span>
                  </div>
                </div>
                <ConcentricRings total={stats.total} done={stats.done} active={stats.active} />
              </div>
            </div>

            <div className="flex flex-col gap-3 justify-between h-[280px] lg:h-full">
              <div className="bg-[#FFF7ED] rounded-[16px] p-2.5 sm:p-3 flex-1 flex flex-col justify-center items-center transition-transform hover:translate-y-[-2px]">
                <span className="text-[17px] font-bold text-[#1e293b] font-sans leading-none">{stats.open} Tasks</span>
                <span className="text-[10px] text-[#334155] font-bold font-sans mt-1 uppercase tracking-wide">Open Status</span>
              </div>
              <div className="bg-[#F5F3FF] rounded-[16px] p-2.5 sm:p-3 flex-1 flex flex-col justify-center items-center transition-transform hover:translate-y-[-2px]">
                <span className="text-[17px] font-bold text-[#1e293b] font-sans leading-none">{stats.active} Tasks</span>
                <span className="text-[10px] text-[#334155] font-bold font-sans mt-1 uppercase tracking-wide">In Progress / Test</span>
              </div>
              <div className="bg-[#F0F9FF] rounded-[16px] p-2.5 sm:p-3 flex-1 flex flex-col justify-center items-center transition-transform hover:translate-y-[-2px]">
                <span className="text-[17px] font-bold text-[#1e293b] font-sans leading-none">{stats.done} Tasks</span>
                <span className="text-[10px] text-[#334155] font-bold font-sans mt-1 uppercase tracking-wide">Done / Delivered</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="p-6 border border-[#EEEEEE] bg-white rounded-[24px] h-[370px] flex flex-col justify-between shadow-[4px_4px_18px_-5px_#DADDE8CC] box-border">
              <div>
                <span className="font-bold text-[18px] text-[#5e5e5e] font-sans">Task Delivery Rate</span>
                <p className="text-[#979797] text-[12px] font-sans mt-0.5">Ratio of completed tasks</p>
              </div>
              <div className="py-1">
                <GaugeChart value={analytics.deliveryRate} label="Rate" />
              </div>
              <div className="border-t border-[#f1f5f9] pt-3 text-center font-sans">
                <div className="flex items-center gap-1.5 justify-center">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-[#64748b] text-[12px] font-bold">Done Milestone Ratio</span>
                </div>
                <span className="text-[#1e293b] text-[14px] font-bold mt-1 block">
                  {stats.done} / {stats.total} Tasks
                </span>
              </div>
            </div>

            <div className="lg:col-span-2 p-6 border border-[#EEEEEE] bg-white rounded-[24px] h-[370px] flex flex-col justify-between shadow-[4px_4px_18px_-5px_#DADDE8CC] box-border">
              <div>
                <span className="font-bold text-[18px] text-[#343c6a] font-sans">Monthly Velocity</span>
                <p className="text-[#787486] text-[12px] font-sans mt-0.5">Historical task completion index</p>
              </div>
              <div className="flex-1 flex items-center mt-2 w-full">
                <WaveChart data={analytics.monthlyVelocity} />
              </div>
            </div>
          </div>

          {/* Row 4: Recent Tasks Checklist Table (Read-only Preview) */}
          <div className="p-6 border-[1.5px] border-[#e2e8f0] bg-white rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col font-sans">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-3">
              <div>
                <span className="font-bold text-[16px] text-[#1e293b]">Recent Workspace Tasks</span>
                <p className="text-[#94a3b8] text-[11px] mt-0.5">Previewing latest task flow updates</p>
              </div>
              <button
                onClick={() => router.push('/tasks')}
                className="text-xs font-bold text-brand hover:text-[#e04324] border border-[#ffaa95] hover:bg-[#ff502d]/5 rounded-xl flex items-center gap-1.5 py-2 px-4 transition-all cursor-pointer"
              >
                Go to Task Board
                <ArrowRight size={14} />
              </button>
            </div>

            {loadingTasks ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-brand" size={28} />
              </div>
            ) : previewTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border border-dashed border-[#e2e8f0] rounded-[16px]">
                <AlertCircle size={28} className="text-[#94a3b8] mb-2" />
                <span className="font-bold text-[14px] text-[#1e293b]">No Active Tasks</span>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#f1f5f9]">
                      <th className="text-[#94a3b8] font-bold text-[11.5px] py-3 pl-2">Task Title & ID</th>
                      <th className="text-[#94a3b8] font-bold text-[11.5px] py-3 px-4">Priority</th>
                      <th className="text-[#94a3b8] font-bold text-[11.5px] py-3 px-4">Status</th>
                      <th className="text-[#94a3b8] font-bold text-[11.5px] py-3 px-4">Assignee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eaeef3]">
                    {previewTasks.map(task => {
                      const formattedDate = task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'No due date';

                      return (
                        <tr key={task._id} className="hover:bg-slate-50/70 transition-colors duration-150">
                          <td className="py-3 pl-2">
                            <span className="font-bold text-[12.5px] text-[#1e293b] block truncate max-w-[200px]">
                              {task.title}
                            </span>
                            <span className="text-[#94a3b8] text-[10px] mt-0.5 block font-medium">
                              ID: {task._id.substring(18).toUpperCase()} | Due: {formattedDate}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-[6px] ${task.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-sky-50 text-sky-600 border border-sky-100'
                              }`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${task.status === 'Done' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : task.status === 'Testing' ? 'bg-yellow-50 text-yellow-750 border border-yellow-100' : task.status === 'In Progress' ? 'bg-sky-50 text-sky-700 border border-sky-100' : 'bg-slate-100 text-slate-650'
                              }`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-[12.5px] text-[#1e293b] block truncate">
                              {task.assignedTo?.name || 'Unassigned'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>

      <ConfirmationDialog
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={() => {
          setIsLogoutConfirmOpen(false);
          logout();
        }}
        title="Confirm Logout"
        description="Are you sure you want to log out of your workspace session? You will need to sign in again to access your tasks dashboard."
        confirmText="Logout"
        cancelText="Cancel"
      />

    </div>
  );
}
