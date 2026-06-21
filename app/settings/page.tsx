'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sliders,
  ShieldCheck,
  BellRing,
  RotateCcw,
  Database,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function SettingsPage() {
  const { t } = useTranslation();

  const [alertDelay, setAlertDelay] = useState(15);
  const [binFullAlert, setBinFullAlert] = useState(75);
  const [nightDimming, setNightDimming] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(t('settings.toastSaved'));
  };

  const handleReset = () => {
    setAlertDelay(15);
    setBinFullAlert(75);
    setNightDimming(true);
    setEmergencyAlerts(true);
    showToast(t('settings.toastReset'));
  };

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 w-full max-w-[1200px] mx-auto z-10">

      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 right-6 px-4 py-3 rounded-xl border border-emerald-200 bg-white text-emerald-800 text-xs font-sans font-bold shadow-xl flex items-center gap-3 z-50">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" /></span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-sans font-black text-2xl md:text-3xl text-slate-900 tracking-tight">{t('settings.title')}</h1>
        <p className="font-sans text-xs text-slate-500 max-w-xl">{t('settings.desc')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Form */}
        <div className="lg:col-span-8 bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-xs">
          <form onSubmit={handleSave} className="space-y-8">

            {/* Alert settings */}
            <div className="space-y-4">
              <h3 className="font-sans font-black text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <BellRing className="w-4 h-4 text-emerald-600" />
                {t('settings.alertSettings')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-slate-500 uppercase font-bold">{t('settings.alertDelay')}</label>
                  <p className="font-sans text-[11px] text-slate-400 font-semibold leading-normal">{t('settings.alertDelayDesc')}</p>
                  <div className="flex items-center gap-3">
                    <input type="range" min="5" max="60" step="5" value={alertDelay} onChange={(e) => setAlertDelay(parseInt(e.target.value))}
                      className="flex-1 accent-emerald-600 bg-slate-100 h-2 rounded-lg cursor-pointer" />
                    <span className="font-mono text-sm text-slate-800 font-extrabold w-12 text-right">{alertDelay}m</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-slate-500 uppercase font-bold">{t('settings.binFull')}</label>
                  <p className="font-sans text-[11px] text-slate-400 font-semibold leading-normal">{t('settings.binFullDesc')}</p>
                  <div className="flex items-center gap-3">
                    <input type="range" min="50" max="95" step="5" value={binFullAlert} onChange={(e) => setBinFullAlert(parseInt(e.target.value))}
                      className="flex-1 accent-emerald-600 bg-slate-100 h-2 rounded-lg cursor-pointer" />
                    <span className="font-mono text-sm text-slate-800 font-extrabold w-12 text-right">{binFullAlert}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Street light settings */}
            <div className="space-y-4">
              <h3 className="font-sans font-black text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sliders className="w-4 h-4 text-emerald-600" />
                {t('settings.streetLightSettings')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="space-y-0.5 pr-4">
                    <h4 className="font-sans text-xs font-black text-slate-800">{t('settings.nightDimming')}</h4>
                    <p className="font-sans text-[11px] text-slate-500 font-semibold">{t('settings.nightDimmingDesc')}</p>
                  </div>
                  <button type="button" onClick={() => setNightDimming(!nightDimming)}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${nightDimming ? 'bg-emerald-600' : 'bg-slate-200'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${nightDimming ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="space-y-0.5 pr-4">
                    <h4 className="font-sans text-xs font-black text-slate-800">{t('settings.emergencyAlerts')}</h4>
                    <p className="font-sans text-[11px] text-slate-500 font-semibold">{t('settings.emergencyAlertsDesc')}</p>
                  </div>
                  <button type="button" onClick={() => setEmergencyAlerts(!emergencyAlerts)}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${emergencyAlerts ? 'bg-emerald-600' : 'bg-slate-200'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emergencyAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 justify-between border-t border-slate-100">
              <button type="button" onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-mono text-slate-500 hover:text-slate-800 uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 font-bold">
                <RotateCcw className="w-3.5 h-3.5" />
                {t('settings.resetBtn')}
              </button>
              <button type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-2.5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                {t('settings.saveBtn')}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-xs">
            <h3 className="font-sans font-black text-sm text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {t('settings.adminInfo')}
            </h3>
            <p className="font-sans text-xs text-slate-500 font-semibold leading-normal">{t('settings.adminDesc')}</p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 uppercase font-bold">
                <Database className="w-3.5 h-3.5 text-slate-400" /> {t('settings.systemStatus')}
              </div>
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-slate-500 font-semibold">{t('settings.statusOnline')}</span>
                <span className="text-emerald-700 font-extrabold font-mono">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />Online
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-slate-500 font-semibold">{t('settings.sensors')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
