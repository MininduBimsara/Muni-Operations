'use client';

import React, { useState } from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  BellRing, 
  RotateCcw, 
  Database,
  Sparkles
} from 'lucide-react';

export default function SettingsPage() {
  const [slaAlertLimit, setSlaAlertLimit] = useState(15);
  const [wasteAlertLimit, setWasteAlertLimit] = useState(75);
  const [autoRebalance, setAutoRebalance] = useState(true);
  const [notifyOnCritical, setNotifyOnCritical] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSaveParameters = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Municipal parameters successfully synchronized with central database.');
  };

  const handleResetDefaults = () => {
    setSlaAlertLimit(15);
    setWasteAlertLimit(75);
    setAutoRebalance(true);
    setNotifyOnCritical(true);
    showToast('Command parameters flushed. Central defaults restored.');
  };

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 w-full max-w-[1200px] mx-auto z-10">
      
      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 px-4 py-3 rounded-xl border border-emerald-200 bg-white text-emerald-850 text-emerald-800 text-xs font-sans font-bold shadow-xl flex items-center gap-3 z-50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 font-bold"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          {toastMessage}
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-emerald-700 uppercase font-bold">
            <span>ADMINISTRATION PANEL</span>
            <span>•</span>
            <span>METROPOLITAN SYSTEM VALUES</span>
          </div>
          <h1 className="font-sans font-black text-2xl md:text-3xl text-slate-900 tracking-tight">
            System Parameters & Settings
          </h1>
          <p className="font-sans text-xs text-slate-500 max-w-xl">
            Configure automated alarm thresholds, solid waste dispatch boundaries, photometrics timings, and database sync frequencies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Core parameters form */}
        <div className="lg:col-span-8 bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-xs" id="settings-form-panel">
          <form onSubmit={handleSaveParameters} className="space-y-8">
            
            {/* Alarms & SLA Alert section */}
            <div className="space-y-4">
              <h3 className="font-sans font-black text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <BellRing className="w-4 h-4 text-emerald-650 text-emerald-640 text-emerald-600" />
                Alarm & SLA Escalation Gates
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* SLA Redline */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-slate-500 uppercase font-bold">SLA Breach Redline (Mins)</label>
                  <p className="font-sans text-[11px] text-slate-400 font-semibold leading-normal">Defines when outstanding streetlight failures escalate to critical SLA status.</p>
                  <div className="flex items-center gap-3">
                    <input 
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={slaAlertLimit}
                      onChange={(e) => setSlaAlertLimit(parseInt(e.target.value))}
                      className="flex-1 accent-emerald-600 bg-slate-100 h-2 rounded-lg cursor-pointer"
                    />
                    <span className="font-mono text-sm text-slate-800 font-extrabold w-12 text-right">{slaAlertLimit}m</span>
                  </div>
                </div>

                {/* Waste alert */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-slate-500 uppercase font-bold">Waste Overflow Alert Threshold (%)</label>
                  <p className="font-sans text-[11px] text-slate-400 font-semibold leading-normal">Capacity fill-level percentage triggering dispatch alerts for field crews.</p>
                  <div className="flex items-center gap-3">
                    <input 
                      type="range"
                      min="50"
                      max="95"
                      step="5"
                      value={wasteAlertLimit}
                      onChange={(e) => setWasteAlertLimit(parseInt(e.target.value))}
                      className="flex-1 accent-emerald-600 bg-slate-100 h-2 rounded-lg cursor-pointer"
                    />
                    <span className="font-mono text-sm text-slate-800 font-extrabold w-12 text-right">{wasteAlertLimit}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Lighting Parameters */}
            <div className="space-y-4">
              <h3 className="font-sans font-black text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sliders className="w-4 h-4 text-emerald-650 text-emerald-600" />
                Dynamic Photometric Controlling
              </h3>

              <div className="space-y-4">
                
                {/* Auto-Dim Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="space-y-0.5">
                    <h4 className="font-sans text-xs font-black text-slate-800">Force Auto-Dim Night Shift Mode</h4>
                    <p className="font-sans text-[11px] text-slate-500 font-semibold col-span-2">Automatically dim Zone Streetlights to 50% power during clear nights to preserve MWh consumption.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setAutoRebalance(!autoRebalance)}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                      autoRebalance ? 'bg-emerald-650 bg-emerald-600' : 'bg-slate-200'
                    }`}
                  >
                    <span 
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoRebalance ? 'translate-x-6' : 'translate-x-1'
                      }`} 
                    />
                  </button>
                </div>

                {/* Emergency Warnings toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="space-y-0.5">
                    <h4 className="font-sans text-xs font-black text-slate-800">Real-time Emergency Dispatch Warnings</h4>
                    <p className="font-sans text-[11px] text-slate-500 font-semibold col-span-2">Trigger system notifications instantly during sub-station telemetry breakdowns or critical drops.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setNotifyOnCritical(!notifyOnCritical)}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                      notifyOnCritical ? 'bg-emerald-650 bg-emerald-600' : 'bg-slate-200'
                    }`}
                  >
                    <span 
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifyOnCritical ? 'translate-x-6' : 'translate-x-1'
                      }`} 
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Form actions and controls */}
            <div className="flex items-center gap-3 pt-4 justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-55 hover:bg-slate-50 text-xs font-mono text-slate-500 hover:text-slate-800 uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Flush Central Defaults
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-550 text-white font-sans font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-emerald-550/10 flex items-center gap-2.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                APPLY COMMAND CONFIGURATIONS
              </button>
            </div>

          </form>
        </div>

        {/* Informational sidebar info card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-xs">
            <h3 className="font-sans font-black text-sm text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-650 text-emerald-600" />
              Administrative Security Info
            </h3>
            
            <p className="font-sans text-xs text-slate-505 text-slate-500 font-semibold leading-normal">
              You are signed in under the <strong className="text-slate-800 font-extrabold font-black">Super Administrator profile</strong>. Critical modifications can propagate to physical photocells and solid waste route controllers.
            </p>

            <div className="p-4 rounded-xl bg-slate-55 bg-slate-50 border border-slate-150 border-slate-100 space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 uppercase font-bold">
                <Database className="w-3.5 h-3.5 text-slate-400" /> API Synchronizer Engine
              </div>
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-slate-500 font-semibold">Sync Pipeline status:</span>
                <span className="text-emerald-700 font-extrabold font-mono">NOMINAL</span>
              </div>
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-slate-500 font-semibold">Total IoT Sub-stations:</span>
                <span className="text-slate-700 font-extrabold font-mono">1,452 nodes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
