'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-context';
import { toast } from 'sonner';

interface SidebarProps {
  onExpandChange?: (expanded: boolean) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  activeIcon: string;
  path: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onExpandChange }) => {
  const { logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive logic
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (onExpandChange) {
      onExpandChange(isExpanded);
    }
  }, [isExpanded, onExpandChange]);

  // Sidebar toggle listener from Navbar (mobile burger)
  useEffect(() => {
    const handleToggle = () => {
      if (isMobile) {
        setIsMobileOpen(prev => !prev);
      } else {
        setIsExpanded(prev => !prev);
      }
    };
    window.addEventListener('sidebar:toggle', handleToggle);
    return () => window.removeEventListener('sidebar:toggle', handleToggle);
  }, [isMobile]);

  // Synchronize active menu item with current URL path
  useEffect(() => {
    if (pathname === '/dashboard') {
      setActiveItem('dashboard');
    } else if (pathname === '/tasks' || pathname.startsWith('/tasks')) {
      setActiveItem('taskManagement');
    }
  }, [pathname]);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '/assets/images/SVG/Dashbordnewicon.svg',
      activeIcon: '/assets/images/SVG/Dashbordnewiconactive.svg',
      path: '/dashboard',
    },
    {
      id: 'taskManagement',
      label: 'Task Management',
      icon: '/assets/images/SVG/exam-manager.svg',
      activeIcon: '/assets/images/SVG/exam-manager-active.svg',
      path: '/tasks',
    }
  ];

  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item.id);
    if (item.id === 'dashboard') {
      router.push('/dashboard');
    } else if (item.id === 'taskManagement') {
      router.push('/tasks');
    } else {
      toast.info(`${item.label} is currently locked. Role permissions required.`);
    }
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const renderSidebarContent = () => {
    return (
      <div className="flex flex-col h-full bg-[#E4E4E4] text-[#4a5568] border-r-[0.1px] border-[#e2e8f0] transition-all duration-300 relative select-none">
        
        {/* Header: Brand and Collapse button */}
        <div className={`flex items-center min-h-[80px] border-b-[1.7px] border-white ${
          isExpanded ? 'justify-between pl-5 pr-2' : 'justify-center p-4'
        }`}>
          {isExpanded && (
            <div
              className="flex items-center gap-2 cursor-pointer overflow-hidden shrink-0"
              onClick={() => router.push('/dashboard')}
            >
              <img
                src="/assets/images/SVG/Black.svg"
                alt="ApexFlow logo"
                className="h-5 w-auto"
              />
            </div>
          )}
          
          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            className="w-10 h-10 rounded-xl hover:bg-black/5 flex items-center justify-center cursor-pointer shrink-0 transition-transform active:scale-95"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <img
              src={isExpanded ? '/assets/images/sidebarclosepanicon.png' : '/assets/images/sidebarexpan icon.png'}
              alt="Toggle"
              className="w-5 h-5 object-contain"
            />
          </button>
        </div>

        {/* Sidebar Nav Content */}
        <div className="flex-1 py-4 overflow-y-auto px-4 space-y-1">
          <nav className="flex flex-col gap-1">
            {menuItems.map(item => {
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center gap-3 rounded-xl transition-all duration-200 outline-none cursor-pointer text-[15px] font-medium font-sans text-left ${
                    isExpanded
                      ? isActive
                        ? 'bg-[#FFFAF1] text-brand py-2.5 px-4 shadow-sm border border-[#FFE8DF]/30'
                        : 'text-[#4a5568] hover:text-[#2d3748] hover:bg-black/5 py-2.5 px-4'
                      : 'justify-center p-2'
                  }`}
                >
                  <span className={`flex items-center justify-center shrink-0 transition-all duration-200 ${
                    !isExpanded
                      ? isActive
                        ? 'bg-[#FFFAF1] border border-[#E2E8F0] w-[46px] h-[46px] rounded-xl'
                        : 'hover:bg-black/5 w-10 h-10 rounded-xl'
                      : 'w-6 h-6'
                  }`}>
                    <img
                      src={isActive ? item.activeIcon : item.icon}
                      alt={item.label}
                      className="w-5 h-5 object-contain"
                    />
                  </span>
                  
                  {isExpanded && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings and Logout bottom footer */}
        <div className="p-4 border-t border-[#e2e8f0] space-y-1 bg-black/20">
          {/* Settings */}
          <button
            onClick={() => {
              setActiveItem('settings');
              toast.info('Settings Page is not implemented yet.');
            }}
            className={`w-full flex items-center gap-3 rounded-xl transition-all duration-200 outline-none cursor-pointer text-[15px] font-medium font-sans text-left ${
              isExpanded
                ? activeItem === 'settings'
                  ? 'bg-[#FFFAF1] text-brand py-2.5 px-4 shadow-sm'
                  : 'text-[#4a5568] hover:text-[#2d3748] hover:bg-black/5 py-2.5 px-4'
                : 'justify-center p-2'
            }`}
          >
            <span className={`flex items-center justify-center shrink-0 transition-all duration-200 ${
              !isExpanded
                ? activeItem === 'settings'
                  ? 'bg-[#FFFAF1] border border-[#E2E8F0] w-[46px] h-[46px] rounded-xl'
                  : 'hover:bg-black/5 w-10 h-10 rounded-xl'
                : 'w-6 h-6'
            }`}>
              <img
                src="/assets/images/SVG/Settings.svg"
                alt="Settings"
                className="w-5 h-5 object-contain"
              />
            </span>
            {isExpanded && <span>Settings</span>}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 rounded-xl transition-all duration-200 outline-none cursor-pointer text-[15px] font-semibold font-sans text-left text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 ${
              isExpanded ? 'py-2.5 px-4' : 'justify-center p-2 h-10'
            }`}
          >
            <span className="flex items-center justify-center shrink-0 w-6 h-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            {isExpanded && <span>Logout</span>}
          </button>
        </div>

      </div>
    );
  };

  return (
    <>
      {/* Mobile Drawer backdrop overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile ? (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {renderSidebarContent()}
        </div>
      ) : (
        /* Desktop Floating Rounded Sidebar */
        <aside className={`fixed left-2.5 top-2.5 z-35 bg-[#E4E4E4] border border-[#cbd5e1] shadow-[0_0_20px_rgba(0,0,0,0.05)] rounded-[15px] overflow-hidden transition-all duration-300 h-[calc(100vh-20px)] ${
          isExpanded ? 'w-[280px]' : 'w-[70px]'
        }`}>
          {renderSidebarContent()}
        </aside>
      )}
    </>
  );
};
