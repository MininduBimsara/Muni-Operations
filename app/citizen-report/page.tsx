'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lightbulb,
  MapPin,
  CheckCircle2,
  QrCode,
  Sparkles,
  Clock,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  Info,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function CitizenQuickReport() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'lights' | 'waste'>('lights');
  const [issueType, setIssueType] = useState('light_out');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [complaintType, setComplaintType] = useState('bin_full');
  const [wasteType, setWasteType] = useState<'Solid Waste' | 'Organic Waste' | 'Recycling'>('Solid Waste');
  const [wasteAdditionalNotes, setWasteAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const mockLightId = 'LGT-CMC-9021';
  const mockCoordinates = '6.9271° N, 79.8612° E (Zone 4 - Marine Drive Coastal Promenade)';
  const mockBinId = 'BIN-CMC-0418';
  const mockWasteCoordinates = '6.9348° N, 79.8438° E (Zone 2 - Colombo Fort Market Road)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setIsSuccess(true); }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-slate-50 md:p-8">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30 pointer-events-none" />

      <div className="w-full max-w-[450px] flex flex-col space-y-5 z-10">

        {/* Top nav */}
        <div className="flex items-center justify-between px-2 text-slate-500">
          <Link href="/" className="flex items-center gap-1.5 text-xs hover:text-slate-800 font-mono tracking-tight transition-colors font-semibold">
            <ArrowLeft className="w-4 h-4" /> {t('citizen.back')}
          </Link>
          <div className="flex items-center gap-1 text-[10px] font-mono text-indigo-700 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse mr-1" />
            {t('citizen.portal')}
          </div>
        </div>

        {/* Tab switcher */}
        <div className="bg-slate-200/90 p-1 rounded-2xl border border-slate-300 flex gap-1 shadow-sm">
          <button onClick={() => { setActiveTab('lights'); setIsSuccess(false); }}
            className={`flex-1 py-3 rounded-xl text-xs font-sans font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${activeTab === 'lights' ? 'bg-white text-slate-900 border border-slate-200/50 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
            <Lightbulb className={`w-4 h-4 ${activeTab === 'lights' ? 'text-amber-500' : 'text-slate-400'}`} />
            {t('citizen.tabLights')}
          </button>
          <button onClick={() => { setActiveTab('waste'); setIsSuccess(false); }}
            className={`flex-1 py-3 rounded-xl text-xs font-sans font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${activeTab === 'waste' ? 'bg-white text-slate-800 border border-slate-200/50 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
            <Trash2 className={`w-4 h-4 ${activeTab === 'waste' ? 'text-indigo-600' : 'text-slate-400'}`} />
            {t('citizen.tabWaste')}
          </button>
        </div>

        {/* Main card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div key={activeTab === 'lights' ? 'lights-form' : 'waste-form'}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }} className="space-y-6">

                {/* Header badge */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs border ${activeTab === 'lights' ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                    {activeTab === 'lights' ? <QrCode className="w-6 h-6 animate-pulse" /> : <Trash2 className="w-5 h-5 animate-pulse" />}
                  </div>
                  <div>
                    <h1 className="font-sans font-black text-lg text-slate-900 tracking-tight leading-tight">
                      {activeTab === 'lights' ? t('citizen.lights.title') : t('citizen.waste.title')}
                    </h1>
                    <p className="font-sans text-[11px] text-slate-400 font-bold">
                      {activeTab === 'lights' ? t('citizen.lights.desc') : t('citizen.waste.desc')}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {activeTab === 'lights' ? (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider block">{t('citizen.lights.lightId')}</label>
                        <div className="relative">
                          <input type="text" readOnly value={mockLightId} className="w-full h-11 px-3.5 pl-10 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 font-bold focus:outline-none" />
                          <Lightbulb className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider block">{t('citizen.lights.location')}</label>
                        <div className="relative">
                          <input type="text" readOnly value={mockCoordinates} className="w-full h-11 px-3.5 pl-10 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans text-slate-600 focus:outline-none font-semibold" />
                          <MapPin className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider block">{t('citizen.lights.problem')}</label>
                        <div className="relative">
                          <select value={issueType} onChange={(e) => setIssueType(e.target.value)}
                            className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-xs font-sans text-slate-800 font-semibold focus:outline-none cursor-pointer appearance-none">
                            <option value="light_out">{t('citizen.lights.opt1')}</option>
                            <option value="physical_damage">{t('citizen.lights.opt2')}</option>
                            <option value="flickering">{t('citizen.lights.opt3')}</option>
                            <option value="always_on">{t('citizen.lights.opt4')}</option>
                            <option value="cable_exposed">{t('citizen.lights.opt5')}</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l border-slate-200 pl-2.5">
                            <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-mono text-slate-500 uppercase font-black block">{t('citizen.lights.details')}</label>
                          <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">{t('citizen.lights.detailsOptional')}</span>
                        </div>
                        <textarea placeholder={t('citizen.lights.detailsPlaceholder')} rows={3} value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)}
                          className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white resize-none transition-all" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider block">{t('citizen.waste.binId')}</label>
                        <div className="relative">
                          <input type="text" readOnly value={mockBinId} className="w-full h-11 px-3.5 pl-10 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 font-bold focus:outline-none" />
                          <Trash2 className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider block">{t('citizen.waste.location')}</label>
                        <div className="relative">
                          <input type="text" readOnly value={mockWasteCoordinates} className="w-full h-11 px-3.5 pl-10 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans text-slate-600 focus:outline-none font-semibold" />
                          <MapPin className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider block">{t('citizen.waste.problem')}</label>
                        <div className="relative">
                          <select value={complaintType} onChange={(e) => setComplaintType(e.target.value)}
                            className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-sans text-slate-800 font-semibold focus:outline-none cursor-pointer appearance-none">
                            <option value="bin_full">{t('citizen.waste.opt1')}</option>
                            <option value="missed">{t('citizen.waste.opt2')}</option>
                            <option value="illegal">{t('citizen.waste.opt3')}</option>
                            <option value="damaged">{t('citizen.waste.opt4')}</option>
                            <option value="pests">{t('citizen.waste.opt5')}</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l border-slate-200 pl-2.5">
                            <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase font-black block">{t('citizen.waste.binType')}</label>
                        <div className="grid grid-cols-3 gap-2">
                          {([
                            { val: 'Solid Waste', label: t('citizen.waste.solid') },
                            { val: 'Organic Waste', label: t('citizen.waste.organic') },
                            { val: 'Recycling', label: t('citizen.waste.recycling') },
                          ] as const).map(({ val, label }) => (
                            <button key={val} type="button" onClick={() => setWasteType(val)}
                              className={`py-2 px-1 rounded-xl text-[10px] font-mono border transition-all cursor-pointer font-bold ${wasteType === val ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-2 ring-indigo-100' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900'}`}>
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-mono text-slate-500 uppercase font-black block">{t('citizen.waste.details')}</label>
                          <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">{t('citizen.waste.detailsOptional')}</span>
                        </div>
                        <textarea placeholder={t('citizen.waste.detailsPlaceholder')} rows={3} value={wasteAdditionalNotes} onChange={(e) => setWasteAdditionalNotes(e.target.value)}
                          className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none transition-all" />
                      </div>
                    </>
                  )}

                  <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex gap-2 text-[10px] font-sans text-slate-500 leading-normal">
                    <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{activeTab === 'lights' ? t('citizen.lights.infoMsg') : t('citizen.waste.infoMsg')}</span>
                  </div>

                  <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className={`w-full h-12 rounded-xl text-white font-sans font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${activeTab === 'lights' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}>
                    {isSubmitting ? (
                      <>
                        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-white" /></span>
                        {activeTab === 'lights' ? t('citizen.lights.submitting') : t('citizen.waste.submitting')}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                        {activeTab === 'lights' ? t('citizen.lights.submit') : t('citizen.waste.submit')}
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div key={activeTab === 'lights' ? 'success-lights' : 'success-waste'}
                initial={{ opacity: 0, scale: 0.9, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                className="text-center py-6 space-y-6">

                <div className="flex justify-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ delay: 0.15, duration: 0.4 }}
                    className={`relative flex items-center justify-center w-20 h-20 rounded-full border shadow-sm ${activeTab === 'lights' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                    <CheckCircle2 className="w-10 h-10" />
                    <span className={`absolute -inset-2.5 rounded-full animate-ping opacity-60 pointer-events-none ${activeTab === 'lights' ? 'bg-emerald-500/10' : 'bg-indigo-500/10'}`} style={{ animationDuration: '3s' }} />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <h2 className="font-sans font-black text-xl text-slate-900 tracking-tight">
                    {activeTab === 'lights' ? t('citizen.lights.successTitle') : t('citizen.waste.successTitle')}
                  </h2>
                  <p className="font-sans text-xs text-slate-500 max-w-[300px] mx-auto leading-relaxed">
                    {activeTab === 'lights'
                      ? t('citizen.lights.successMsg', { sector: 'Kollupitiya LECO' })
                      : t('citizen.waste.successMsg', { sector: 'Colombo Fort' })
                    }
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 max-w-[325px] mx-auto">
                  <div className="flex items-center justify-between text-xs font-sans border-b border-slate-100 pb-2.5">
                    <span className="text-slate-500 flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold">
                      <Clock className="w-3.5 h-3.5 text-slate-400 animate-spin" style={{ animationDuration: '10s' }} />
                      {activeTab === 'lights' ? t('citizen.lights.expectedResponse') : t('citizen.waste.expectedResponse')}
                    </span>
                    <span className={`font-black font-mono ${activeTab === 'lights' ? 'text-emerald-700' : 'text-indigo-700'}`}>
                      {activeTab === 'lights' ? '12 Hours' : '4 Hours'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-slate-500 flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                      {activeTab === 'lights' ? t('citizen.lights.assignedTeam') : t('citizen.waste.assignedTeam')}
                    </span>
                    <span className="font-black text-slate-700">
                      {activeTab === 'lights' ? 'Lanka Electricity Company' : 'Abans Environmental Corp'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-4">
                  <button onClick={() => { setIsSuccess(false); setAdditionalNotes(''); setWasteAdditionalNotes(''); }}
                    className={`w-full py-2.5 rounded-xl border hover:bg-slate-50 text-xs font-mono tracking-wide font-black transition-all cursor-pointer uppercase ${activeTab === 'lights' ? 'border-amber-200 text-amber-700 hover:text-amber-800' : 'border-indigo-200 text-indigo-700 hover:text-indigo-800'}`}>
                    {activeTab === 'lights' ? t('citizen.lights.submitAnother') : t('citizen.waste.submitAnother')}
                  </button>
                  <Link href="/" className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-sans font-black transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider shadow-sm">
                    {activeTab === 'lights' ? t('citizen.lights.goBack') : t('citizen.waste.goBack')}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center font-mono text-[9px] text-slate-400 uppercase tracking-widest pointer-events-none font-bold">
          {t('citizen.footer')}
        </div>
      </div>
    </div>
  );
}
