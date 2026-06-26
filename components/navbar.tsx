'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth-context';
import { Bell, ChevronDown, Settings, LogOut, Menu } from 'lucide-react';
import { toast } from 'sonner';

interface NavbarProps {
  title?: string;
}

interface NotificationItem {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  unread: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ title = 'Workspace' }) => {
  const { user, logout } = useAuth();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      actor: 'System Update',
      action: 'completed exam schedule sync.',
      timestamp: 'Just now',
      unread: true,
    },
    {
      id: 'notif-2',
      actor: 'Admin',
      action: 'updated class policies for summer courses.',
      timestamp: '2h ago',
      unread: true,
    },
    {
      id: 'notif-3',
      actor: 'ApexFlow Support',
      action: 'added new templates to your document hub.',
      timestamp: 'Yesterday',
      unread: false,
    }
  ]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMobileMenuToggle = () => {
    // Fire event to open sidebar mobile drawer
    window.dispatchEvent(new CustomEvent('sidebar:toggle'));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <header className="relative mb-4 px-6 pt-3 select-none">
      <div className="bg-[#E6E9EC] rounded-[16px] px-4 md:px-6 h-16 flex items-center justify-between">

        {/* Left Side: Mobile Menu Toggler + Welcome Text */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            aria-label="Open sidebar"
            onClick={handleMobileMenuToggle}
            className="md:hidden border border-slate-300 bg-white hover:bg-slate-50 transition-colors w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 cursor-pointer"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0 flex flex-col justify-center">
            <h1 className="font-bold text-[#1a202c] font-sans text-[15px] sm:text-[16px] leading-tight flex items-center gap-1 truncate">
              Welcome Back, {user?.name || 'User'}{' '}
              <span className="inline-block origin-[70%_70%] animate-[wave_5s_ease-in-out_infinite]">
                👋
              </span>
            </h1>
            <span className="text-[#718096] text-[11px] font-semibold font-sans mt-0.5 leading-none truncate">
              Workspace : ApexFlow Task Management
            </span>
          </div>
        </div>

        {/* Right Side: Profile dropdown */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 md:gap-3 p-1 rounded-xl hover:bg-black/5 transition-colors cursor-pointer outline-none"
            >
              <img
                src="/assets/images/profile.png"
                alt="Profile Avatar"
                className="w-10 h-10 rounded-[10px] object-cover shrink-0"
              />

              <div className="hidden sm:flex flex-col text-left min-w-0">
                <span className="font-bold text-[13px] text-[#1a202c] leading-tight font-sans truncate max-w-[120px]">
                  {user?.name || 'Admin User'}
                </span>
                <span className="text-[#718096] text-[11px] font-medium leading-none font-sans mt-0.5 capitalize">
                  {user?.role === 'Admin' ? 'Branch Admin' : 'Regular User'}
                </span>
              </div>

              <ChevronDown size={16} className="text-[#718096]" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-[#f1f5f9] rounded-[12px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-[#f1f5f9] flex flex-col text-left">
                  <span className="font-bold text-[14px] text-[#0f172a] font-sans truncate">
                    {user?.name || 'Admin User'}
                  </span>
                  <span className="text-[12px] text-[#94a3b8] font-sans mt-0.5 capitalize">
                    {user?.role === 'Admin' ? 'Branch Admin' : 'Regular User'}
                  </span>
                </div>

                <div className="p-1">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      toast.info('Settings Page is not implemented yet.');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-[#334155] hover:bg-slate-50 transition-colors font-sans text-left cursor-pointer"
                  >
                    <Settings size={18} className="text-[#64748b]" />
                    Settings
                  </button>

                  <div className="h-px bg-[#f1f5f9] my-1" />

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-semibold text-[#ef4444] hover:bg-rose-50 transition-colors font-sans text-left cursor-pointer"
                  >
                    <LogOut size={18} className="text-[#ef4444]" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Styled Animations for navbar */}
      <style jsx global>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          10%, 30% { transform: rotate(14deg); }
          20%, 40% { transform: rotate(-8deg); }
          50%, 60% { transform: rotate(14deg); }
          70% { transform: rotate(-4deg); }
          80% { transform: rotate(10deg); }
        }
        @keyframes ring {
          0%, 100% { transform: rotate(0deg); }
          5% { transform: rotate(15deg); }
          10% { transform: rotate(-15deg); }
          15% { transform: rotate(10deg); }
          20% { transform: rotate(-10deg); }
          25% { transform: rotate(5deg); }
          30% { transform: rotate(-5deg); }
          35% { transform: rotate(0deg); }
        }
      `}</style>
    </header>
  );
};
