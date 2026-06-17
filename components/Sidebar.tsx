'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Trash2, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  CircleDot,
  QrCode
} from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Street Lights', path: '/street-lights', icon: Lightbulb },
    { name: 'Waste Management', path: '/waste-management', icon: Trash2 },
    { name: 'Citizen Report', path: '/citizen-report', icon: QrCode },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <motion.div
      id="sidebar-container"
      initial={false}
      animate={{ width: isCollapsed ? '76px' : '260px' }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="relative flex flex-col h-screen select-none bg-white border-r border-slate-200 text-slate-700 z-30 flex-shrink-0 shadow-xs"
    >
      {/* Brand Logo Section */}
      <div id="sidebar-header" className="flex items-center h-20 px-5 border-b border-slate-100 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-650">
            <Building2 className="w-5 h-5 animate-pulse" id="brand-icon" style={{ animationDuration: '4s' }} />
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col whitespace-nowrap"
              >
                <span className="font-sans font-black text-sm tracking-wide text-dense-slate text-slate-900 uppercase">
                  Colombo MC
                </span>
                <span className="font-mono text-[9px] tracking-wider text-slate-450 uppercase font-bold">
                  CMC SUPER ADMIN
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Items */}
      <nav id="sidebar-nav" className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className="block relative"
              id={`nav-link-${item.name.toLowerCase().replace(' ', '-')}`}
            >
              <div
                className={`flex items-center h-11 px-3 rounded-lg transition-all relative group duration-200 ${
                  isActive 
                    ? 'text-emerald-700 font-bold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {/* Visual Active Indicator (Background Pill) */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute inset-0 bg-emerald-50 border border-emerald-100/80 rounded-lg -z-10 shadow-xs"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Hover Indicator */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-lg bg-slate-50/80 border border-transparent group-hover:border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-200 -z-10" />
                )}

                <div className="flex items-center gap-3 w-full">
                  <div className={`p-1 rounded-md transition-colors ${isActive ? 'text-emerald-650' : 'text-slate-405 text-slate-400 group-hover:text-slate-700'}`}>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                  </div>
                  
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="font-sans text-sm tracking-wide whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </div>

                {/* Micro tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-16 px-2.5 py-1.5 rounded-md bg-slate-900 text-white text-xs font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 shadow-md">
                    {item.name}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* System Status & User Profile Avatar Panel */}
      <div id="sidebar-footer" className="p-4 border-t border-slate-100 overflow-hidden flex flex-col gap-4">
        {/* User Profile Avatar Section */}
        <div className="flex items-center gap-3">
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80" 
            alt="Operations Director" 
            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 shrink-0" 
            referrerPolicy="no-referrer"
          />
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col min-w-0"
            >
              <span className="font-sans font-bold text-xs text-slate-800 truncate">Sanduni Senanayake</span>
              <span className="font-mono text-[9px] text-slate-400 uppercase truncate">Operations Director</span>
            </motion.div>
          )}
        </div>

        <div className="flex items-center justify-between min-h-[36px]">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2.5 whitespace-nowrap"
                id="status-container"
              >
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    SLA Status
                  </span>
                  <span className="font-sans text-[11px] font-extrabold text-emerald-600">
                    99.8% Nominal
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="flex justify-center w-full">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-650"></span>
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* Toggle Button */}
          {!isCollapsed && (
            <button
              id="sidebar-toggle-btn"
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Floating external expander when collapsed */}
      {isCollapsed && (
        <button
          id="sidebar-expand-btn"
          onClick={() => setIsCollapsed(false)}
          className="absolute -right-3 top-24 p-1 rounded-full bg-emerald-650 hover:bg-emerald-500 text-white border border-emerald-505 border-emerald-500 shadow-md cursor-pointer transition-all z-50 hover:scale-105"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </motion.div>
  );
}
