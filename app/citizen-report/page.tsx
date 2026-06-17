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
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function CitizenQuickReport() {
  const [activeTab, setActiveTab] = useState<'lights' | 'waste'>('lights');
  
  // Street light outage form states
  const [issueType, setIssueType] = useState('Bulb Blown');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  // Waste Management complaint form states
  const [complaintType, setComplaintType] = useState('Overflowing Public Bin');
  const [wasteType, setWasteType] = useState<'Solid Waste' | 'Organic Waste' | 'Recycling'>('Solid Waste');
  const [wasteAdditionalNotes, setWasteAdditionalNotes] = useState('');
  
  // Submission triggers
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Pre-filled variables for Street Light outage
  const mockLightId = 'LGT-CMC-9021';
  const mockCoordinates = '6.9271° N, 79.8612° E (Zone 4 - Marine Drive Coastal Promenade)';
  const mockSubstation = 'Kollupitiya LECO Sub-station Grid 12B';

  // Pre-filled variables for Waste Management
  const mockBinId = 'BIN-CMC-0418';
  const mockWasteCoordinates = '6.9348° N, 79.8438° E (Zone 2 - Colombo Fort Market Road)';
  const mockWasteSubstation = 'Colombo Fort Abans Environmental Fleet Sector 4';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate direct remote sync
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div id="citizen-report-portal" className="min-h-screen w-full flex items-center justify-center p-4 relative bg-slate-50 md:p-8">
      
      {/* Soft light grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30 pointer-events-none -coding-z-10" />

      {/* Mobile Frame Container */}
      <div className="w-full max-w-[450px] flex flex-col space-y-5 z-10">
        
        {/* Navigation Indicator / Back Link */}
        <div className="flex items-center justify-between px-2 text-slate-500">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-xs hover:text-slate-800 font-mono tracking-tight transition-colors font-semibold"
            id="back-to-console-btn"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Console
          </Link>
          <div className="flex items-center gap-1 text-[10px] font-mono text-indigo-700 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse mr-1" />
            Citizen Portal
          </div>
        </div>

        {/* Dynamic Category Selector Switch Tabs */}
        <div className="bg-slate-200/90 p-1 rounded-2xl border border-slate-300 flex gap-1 shadow-sm">
          <button
            onClick={() => {
              setActiveTab('lights');
              setIsSuccess(false);
            }}
            className={`flex-1 py-3 rounded-xl text-xs font-sans font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === 'lights'
                ? 'bg-white text-slate-900 border border-slate-200/50 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lightbulb className={`w-4 h-4 ${activeTab === 'lights' ? 'text-amber-500' : 'text-slate-400'}`} />
            Street Lights
          </button>
          
          <button
            onClick={() => {
              setActiveTab('waste');
              setIsSuccess(false);
            }}
            className={`flex-1 py-3 rounded-xl text-xs font-sans font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === 'waste'
                ? 'bg-white text-slate-800 border border-slate-200/50 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Trash2 className={`w-4 h-4 ${activeTab === 'waste' ? 'text-indigo-600 animate-pulse animate-bounce' : 'text-slate-400'}`} style={{ animationDuration: '3s' }} />
            Waste Management
          </button>
        </div>

        {/* Primary Centered Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key={activeTab === 'lights' ? 'lights-form-state' : 'waste-form-state'}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Simulated Scanned Header Badge */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs border ${
                    activeTab === 'lights' 
                      ? 'bg-amber-50 border-amber-100 text-amber-600' 
                      : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                  }`}>
                    {activeTab === 'lights' ? (
                      <QrCode className="w-6 h-6 animate-pulse" />
                    ) : (
                      <Trash2 className="w-5 h-5 animate-pulse" />
                    )}
                  </div>
                  <div>
                    <h1 className="font-sans font-black text-lg text-slate-900 tracking-tight leading-tight">
                      {activeTab === 'lights' ? 'Street Light QR Asset Scanned' : 'Waste Container QR Verified'}
                    </h1>
                    <p className="font-sans text-[11px] text-slate-400 font-bold">
                      {activeTab === 'lights' 
                        ? 'Direct photocell dispatch reporting engaged'
                        : 'Abans & Cleantech priority callback portal'
                      }
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {activeTab === 'lights' ? (
                    // --- STREET LIGHT REPORT FORM GUTS ---
                    <>
                      {/* Read-only Pre-filled Light ID */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider block">
                          Target Equipment ID
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            readOnly
                            value={mockLightId}
                            className="w-full h-11 px-3.5 pl-10 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 font-bold focus:outline-none"
                          />
                          <Lightbulb className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {/* Read-only Pre-filled Location Coordinates */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider block">
                          Scanned GPS Coordinates
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            readOnly
                            value={mockCoordinates}
                            className="w-full h-11 px-3.5 pl-10 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans text-slate-600 focus:outline-none font-semibold"
                          />
                          <MapPin className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {/* Issue Type Dropdown Selector */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider block">
                          Identify Failure Mode
                        </label>
                        <div className="relative">
                          <select
                            value={issueType}
                            onChange={(e) => setIssueType(e.target.value)}
                            className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 focus:border-amber-550 focus:bg-white rounded-xl text-xs font-sans text-slate-800 font-semibold focus:outline-none cursor-pointer appearance-none"
                          >
                            <option value="Bulb Blown">Bulb Blown (Complete Outage)</option>
                            <option value="Physical Damage">Physical Damage (Pole / Case Severed)</option>
                            <option value="Flickering">Flickering (Photocell Cycling Fault)</option>
                            <option value="Always On">Always On during Daylight (Energy Waste)</option>
                            <option value="Cable Exposed">Sub-surface Cable Exposed (Hazard)</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l border-slate-200 pl-2.5">
                            <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                          </div>
                        </div>
                      </div>

                      {/* Optional Citizen Notes */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-mono text-slate-500 uppercase font-black block">
                            Outage Description
                          </label>
                          <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">Optional</span>
                        </div>
                        <textarea
                          placeholder="e.g. Scaffolding nearby, tree branches obstruct safety, or coordinates altered..."
                          rows={3}
                          value={additionalNotes}
                          onChange={(e) => setAdditionalNotes(e.target.value)}
                          className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white resize-none transition-all"
                        />
                      </div>
                    </>
                  ) : (
                    // --- WASTE MANAGEMENT COMPLAINT FORM GUTS ---
                    <>
                      {/* Read-only Pre-filled Container Pin ID */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider block">
                          Target Bin ID / RFID Tag
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            readOnly
                            value={mockBinId}
                            className="w-full h-11 px-3.5 pl-10 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 font-bold focus:outline-none"
                          />
                          <Trash2 className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {/* Read-only Pre-filled Location Coordinates for Waste */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider block">
                          Container Coordinates GPS
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            readOnly
                            value={mockWasteCoordinates}
                            className="w-full h-11 px-3.5 pl-10 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans text-slate-650 text-slate-600 focus:outline-none font-semibold"
                          />
                          <MapPin className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {/* Waste Complaint Category Selector */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider block">
                          Complaint Reason
                        </label>
                        <div className="relative">
                          <select
                            value={complaintType}
                            onChange={(e) => setComplaintType(e.target.value)}
                            className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-sans text-slate-800 font-semibold focus:outline-none cursor-pointer appearance-none"
                          >
                            <option value="Overflowing Public Bin">Overflowing Public Bin / Bin Full</option>
                            <option value="Missed House Collection">Missed Household Trash Collection</option>
                            <option value="Illegal Dumping Center">Illegal Commercial Dumping Site</option>
                            <option value="Bin Broken / Lost Cover">Bin Broken, No Cap or Damaged Rails</option>
                            <option value="Severe Pest Infestation">Severe Pest Infestation / Odor Complaint</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l border-slate-200 pl-2.5">
                            <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                          </div>
                        </div>
                      </div>

                      {/* Waste Compartment Type selector button grid */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase font-black block">Compartment Type</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['Solid Waste', 'Organic Waste', 'Recycling'] as const).map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setWasteType(type)}
                              className={`py-2 px-1 rounded-xl text-[10px] font-mono border transition-all cursor-pointer font-bold ${
                                wasteType === type 
                                  ? 'bg-indigo-50 border-indigo-250 text-indigo-700 ring-2 ring-indigo-100' 
                                  : 'bg-slate-50 border-slate-200 text-slate-550 hover:text-slate-900'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Optional Waste Context */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-mono text-slate-500 uppercase font-black block">
                            Sanitary / Hazard Context
                          </label>
                          <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">Optional</span>
                        </div>
                        <textarea
                          placeholder="Describe the incident (e.g. flies/cats gathering, plastic bottles obstructing traffic, odor block radius)..."
                          rows={3}
                          value={wasteAdditionalNotes}
                          onChange={(e) => setWasteAdditionalNotes(e.target.value)}
                          className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none transition-all"
                        />
                      </div>
                    </>
                  )}

                  {/* General GPS SLA disclaimer block */}
                  <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex gap-2 text-[10px] font-sans text-slate-500 leading-normal">
                    <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>Your GPS coordinates override allows direct municipal contractor dispatch, optimizing telemetry routing protocols.</span>
                  </div>

                  {/* Dynamic Submit Buttons */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full h-12 rounded-xl text-white font-sans font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${
                      activeTab === 'lights' 
                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/10' 
                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/10'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-bounce"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        SYNCING REMOTE SYSTEMS...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                        {activeTab === 'lights' ? 'SUBMIT DISPATCH ALARM' : 'FILE SANITATION COMPLAINT'}
                      </>
                    )}
                  </motion.button>

                </form>
              </motion.div>
            ) : (
              // Immersive transition Success State Replacing Form
              <motion.div
                key={activeTab === 'lights' ? 'success-lights' : 'success-waste'}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 120, 
                  damping: 14 
                }}
                className="text-center py-6 space-y-6"
              >
                {/* Checkmarked animated circular halo of success */}
                <div className="flex justify-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className={`relative flex items-center justify-center w-20 h-20 rounded-full border shadow-sm ${
                      activeTab === 'lights' 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                        : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                    }`}
                  >
                    <CheckCircle2 className="w-10 h-10" />
                    <span className={`absolute -inset-2.5 rounded-full animate-ping opacity-60 pointer-events-none ${
                      activeTab === 'lights' ? 'bg-emerald-500/10' : 'bg-indigo-500/10'
                    }`} style={{ animationDuration: '3s' }} />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <h2 className="font-sans font-black text-xl text-slate-900 tracking-tight">
                    {activeTab === 'lights' ? 'Outage Registered!' : 'Sanitation Ticket Filed!'}
                  </h2>
                  <p className="font-sans text-xs text-slate-500 max-w-[300px] mx-auto leading-relaxed">
                    A maintenance alarm has been registered inside the <span className="font-mono text-slate-700 font-bold">{activeTab === 'lights' ? mockSubstation : mockWasteSubstation}</span> dispatcher sector.
                  </p>
                </div>

                {/* Estimate Repair Information box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 max-w-[325px] mx-auto">
                  <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest block font-extrabold">COMMITMENT BOUNDS</span>
                  
                  <div className="flex items-center justify-between text-xs font-sans border-b border-slate-100 pb-2.5">
                    <span className="text-slate-500 flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold">
                      <Clock className="w-3.5 h-3.5 text-slate-400 animate-spin" style={{ animationDuration: '10s' }} /> SLA TARGET WINDOW:
                    </span>
                    <span className={`font-black font-mono ${activeTab === 'lights' ? 'text-emerald-700' : 'text-indigo-700'}`}>
                      {activeTab === 'lights' ? '12 Hours' : '4 Hours (Urgent Clean)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-slate-500 flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-405 text-slate-400" /> CONTRACTED GROUP:
                    </span>
                    <span className="font-black text-slate-750 text-slate-700">
                      {activeTab === 'lights' ? 'Lanka Electricity Company' : 'Abans Environmental Corp'}
                    </span>
                  </div>
                </div>

                {/* Return controls action */}
                <div className="flex flex-col gap-2 pt-4">
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setAdditionalNotes('');
                      setWasteAdditionalNotes('');
                    }}
                    className={`w-full py-2.5 rounded-xl border hover:bg-slate-50 text-xs font-mono tracking-wide font-black transition-all cursor-pointer uppercase ${
                      activeTab === 'lights' 
                        ? 'border-amber-200 text-amber-700 hover:text-amber-800' 
                        : 'border-indigo-200 text-indigo-700 hover:text-indigo-800'
                    }`}
                  >
                    {activeTab === 'lights' ? 'SUBMIT ANOTHER OUTAGE' : 'REPORT NEW BIN FLOOD'}
                  </button>

                  <Link
                    href="/"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-sans font-black transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider shadow-sm"
                  >
                    Exit Portal & Console
                  </Link>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Footer info brand */}
        <div className="text-center font-mono text-[9px] text-slate-400 uppercase tracking-widest pointer-events-none font-bold">
          © Colombo Municipal Council • CMC Operations
        </div>

      </div>
    </div>
  );
}
