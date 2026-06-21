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
  QrCode,
} from 'lucide-react';
import { useTranslation, type Lang } from '@/lib/i18n';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { t, lang, setLang } = useTranslation();

  const menuItems = [
    { key: 'sidebar.nav.dashboard', path: '/', icon: LayoutDashboard },
    { key: 'sidebar.nav.streetLights', path: '/street-lights', icon: Lightbulb },
    { key: 'sidebar.nav.waste', path: '/waste-management', icon: Trash2 },
    { key: 'sidebar.nav.citizenReport', path: '/citizen-report', icon: QrCode },
    { key: 'sidebar.nav.settings', path: '/settings', icon: Settings },
  ];

  const langs: Lang[] = ['en', 'si', 'ta'];

  return (
    <motion.div
      id="sidebar-container"
      initial={false}
      animate={{ width: isCollapsed ? '76px' : '260px' }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="relative flex flex-col h-screen select-none bg-white border-r border-slate-200 text-slate-700 z-30 flex-shrink-0 shadow-xs"
    >
      {/* Brand */}
      <div id="sidebar-header" className="flex items-center h-20 px-5 border-b border-slate-100 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-650">
            <Building2 className="w-5 h-5 animate-pulse" style={{ animationDuration: '4s' }} />
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
                <span className="font-sans font-black text-sm tracking-wide text-slate-900 uppercase">
                  {t('sidebar.brand')}
                </span>
                <span className="font-mono text-[9px] tracking-wider text-slate-400 uppercase font-bold">
                  {t('sidebar.role')}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <nav id="sidebar-nav" className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className="block relative"
            >
              <div
                className={`flex items-center h-11 px-3 rounded-lg transition-all relative group duration-200 ${
                  isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute inset-0 bg-emerald-50 border border-emerald-100/80 rounded-lg -z-10 shadow-xs"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 rounded-lg bg-slate-50/80 border border-transparent group-hover:border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-200 -z-10" />
                )}

                <div className="flex items-center gap-3 w-full">
                  <div className={`p-1 rounded-md transition-colors ${isActive ? 'text-emerald-650' : 'text-slate-400 group-hover:text-slate-700'}`}>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                  </div>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="font-sans text-sm tracking-wide whitespace-nowrap"
                    >
                      {t(item.key)}
                    </motion.span>
                  )}
                </div>

                {isCollapsed && (
                  <div className="absolute left-16 px-2.5 py-1.5 rounded-md bg-slate-900 text-white text-xs font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 shadow-md">
                    {t(item.key)}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div id="sidebar-footer" className="p-4 border-t border-slate-100 overflow-hidden flex flex-col gap-3">
        {/* User profile */}
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80"
            alt="Admin"
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
              <span className="font-mono text-[9px] text-slate-400 uppercase truncate">{t('sidebar.role')}</span>
            </motion.div>
          )}
        </div>

        {/* Language switcher */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-1 bg-slate-100 p-1 rounded-lg"
          >
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`flex-1 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer uppercase tracking-wider ${
                  lang === l
                    ? 'bg-white text-emerald-700 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </motion.div>
        )}

        {/* Status & toggle row */}
        <div className="flex items-center justify-between min-h-[28px]">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2.5 whitespace-nowrap"
              >
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    {t('sidebar.status.label')}
                  </span>
                  <span className="font-sans text-[11px] font-extrabold text-emerald-600">
                    {t('sidebar.status.value')}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="flex justify-center w-full">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
                </div>
              </div>
            )}
          </AnimatePresence>

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

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <button
          id="sidebar-expand-btn"
          onClick={() => setIsCollapsed(false)}
          className="absolute -right-3 top-24 p-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 shadow-md cursor-pointer transition-all z-50 hover:scale-105"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </motion.div>
  );
}
