'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Truck,
  MapPin,
  Compass,
  AlertTriangle,
  Check,
  RotateCcw,
  Sparkles,
  TrendingUp,
  AlertCircle,
  FolderSync,
  Trash2,
  X,
  Send,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface TruckItem {
  id: string;
  driver: string;
  driverAvatar: string;
  completedPercent: number;
  status: 'EN_ROUTE' | 'COLLECTING' | 'AT_DEPOT' | 'STALLED';
  loadPercent: number;
  nextStop: string;
  routeId: string;
  color: string;
  geoCoords: [number, number];
}

interface MissedReport {
  id: string;
  address: string;
  reportedTime: string;
  binType: 'Recycling' | 'Solid Waste' | 'Organic Waste';
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  status: 'UNASSIGNED' | 'DISPATCHED' | 'RESOLVED';
  reporter: string;
  geoCoords: [number, number];
}

const INITIAL_TRUCKS: TruckItem[] = [
  { id: 'TRK-204', driver: 'Suresh Fernando', driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80', completedPercent: 72, status: 'COLLECTING', loadPercent: 85, nextStop: 'Colombo Fort Station Sector 2', routeId: 'CMC-FORT-04', color: '#10b981', geoCoords: [6.9348, 79.8438] },
  { id: 'TRK-812', driver: 'Nishantha Ranasinghe', driverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80', completedPercent: 45, status: 'EN_ROUTE', loadPercent: 40, nextStop: 'Galle Face Promenade', routeId: 'CMC-GALLE-12', color: '#3b82f6', geoCoords: [6.9270, 79.8430] },
  { id: 'TRK-109', driver: 'Kamal Jayawardene', driverAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80', completedPercent: 95, status: 'AT_DEPOT', loadPercent: 98, nextStop: 'Orugodawatta Depot', routeId: 'CMC-ORUG-09', color: '#f59e0b', geoCoords: [6.9412, 79.8810] },
  { id: 'TRK-440', driver: 'Dilini Perera', driverAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80', completedPercent: 15, status: 'COLLECTING', loadPercent: 18, nextStop: 'Bauddhaloka Mawatha', routeId: 'CMC-BAUD-02', color: '#0ea5e9', geoCoords: [6.9115, 79.8655] },
];

const INITIAL_REPORTS: MissedReport[] = [
  { id: 'RPT-3891', address: '122 Havelock Road, Colombo 05', reportedTime: '22 mins ago', binType: 'Recycling', priority: 'HIGH', status: 'UNASSIGNED', reporter: 'Resident (App Request)', geoCoords: [6.8885, 79.8588] },
  { id: 'RPT-1049', address: 'Pettah General Market Entrance', reportedTime: '1 hr ago', binType: 'Solid Waste', priority: 'CRITICAL', status: 'UNASSIGNED', reporter: 'Sonic Bin Sensor Alert', geoCoords: [6.9401, 79.8545] },
  { id: 'RPT-4509', address: 'Modara Beach Walkway', reportedTime: '3 hrs ago', binType: 'Organic Waste', priority: 'NORMAL', status: 'UNASSIGNED', reporter: 'Municipal Inspector Patrol', geoCoords: [6.9625, 79.8710] },
  { id: 'RPT-8821', address: 'Grandpass Road Sector D', reportedTime: '4 hrs ago', binType: 'Solid Waste', priority: 'HIGH', status: 'DISPATCHED', reporter: 'Citizen Hotline File', geoCoords: [6.9485, 79.8690] },
];

export default function WasteManagementDashboard() {
  const { t } = useTranslation();

  const [activeTrucks, setActiveTrucks] = useState<TruckItem[]>(INITIAL_TRUCKS);
  const [missedReports, setMissedReports] = useState<MissedReport[]>(INITIAL_REPORTS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map'>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [focusedTruckId, setFocusedTruckId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<{ type: 'truck' | 'incident'; id: string } | null>(null);
  const [driverMsgVal, setDriverMsgVal] = useState('');
  const [reportFormAddress, setReportFormAddress] = useState('');
  const [reportFormBinType, setReportFormBinType] = useState<'Recycling' | 'Solid Waste' | 'Organic Waste'>('Recycling');
  const [reportFormPriority, setReportFormPriority] = useState<'CRITICAL' | 'HIGH' | 'NORMAL'>('NORMAL');

  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    if (!document.getElementById('leaflet-css-pack')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-pack'; link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    let isMounted = true; let mapInstance: any = null;
    const initTimer = setTimeout(() => {
      import('leaflet').then((L) => {
        if (!isMounted || !mapRef.current) return;
        if (leafletMapInstanceRef.current) { try { leafletMapInstanceRef.current.remove(); } catch (e) { console.warn(e); } }
        mapInstance = L.map(mapRef.current, { zoomControl: false, maxBounds: [[6.80, 79.78], [7.00, 79.94]], attributionControl: true }).setView([6.9250, 79.8550], 13);
        leafletMapInstanceRef.current = mapInstance;
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, minZoom: 12, attribution: 'Tiles &copy; Esri' }).addTo(mapInstance);
        L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);
        setMapLoaded(true);
      }).catch((err) => console.error(err));
    }, 200);
    return () => { isMounted = false; clearTimeout(initTimer); if (mapInstance) { try { mapInstance.remove(); } catch (e) {} leafletMapInstanceRef.current = null; setMapLoaded(false); } };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !leafletMapInstanceRef.current) return;
    const map = leafletMapInstanceRef.current;
    Object.values(markersRef.current).forEach((marker: any) => { try { map.removeLayer(marker); } catch (e) {} });
    markersRef.current = {};
    import('leaflet').then((L) => {
      activeTrucks.forEach((truck) => {
        const isSelected = selectedEntity?.type === 'truck' && selectedEntity?.id === truck.id;
        const ring = isSelected ? `box-shadow: 0 0 0 6px ${truck.color}35, 0 10px 15px -3px rgba(0,0,0,0.3); transform: scale(1.2) translateY(-2px); z-index: 1000 !important;` : `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.15);`;
        const iconHtml = `<div style="position:relative;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:12px;border:1.5px solid #fff;background-color:${truck.color};transition:all 0.3s;${ring}"><span style="position:absolute;width:40px;height:40px;border-radius:9999px;background-color:${truck.color}25;animation:pinPulse 2s infinite;z-index:-10;"></span><svg style="width:15px;height:15px;color:#fff;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h8"/><path d="M19 13v-3a2 2 0 0 0-2-2h-3v7h5a2 2 0 0 0 2-2Z"/><circle cx="7.5" cy="18.5" r="2.5"/><circle cx="16.5" cy="18.5" r="2.5"/></svg></div>`;
        const divIcon = L.divIcon({ html: iconHtml, className: 'custom-leaflet-marker-pack', iconSize: [34, 34], iconAnchor: [17, 17] });
        const marker = L.marker(truck.geoCoords, { icon: divIcon }).addTo(map);
        marker.on('click', () => { setSelectedEntity({ type: 'truck', id: truck.id }); setFocusedTruckId(truck.id); map.setView([truck.geoCoords[0], truck.geoCoords[1] - 0.0025], 14, { animate: true }); });
        markersRef.current[`truck-${truck.id}`] = marker;
      });
      missedReports.forEach((incident) => {
        const isSelected = selectedEntity?.type === 'incident' && selectedEntity?.id === incident.id;
        const color = incident.status === 'DISPATCHED' ? '#4f46e5' : (incident.priority === 'CRITICAL' ? '#ef4444' : (incident.priority === 'HIGH' ? '#f59e0b' : '#64748b'));
        const ring = isSelected ? `box-shadow: 0 0 0 6px ${color}35, 0 10px 15px -3px rgba(0,0,0,0.3); transform: scale(1.2) translateY(-2px); z-index: 1000 !important;` : `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.15);`;
        const pulse = incident.status !== 'DISPATCHED' ? `<span style="position:absolute;width:40px;height:40px;border-radius:9999px;background-color:${color}25;animation:alertPing 1.5s infinite;z-index:-10;"></span>` : '';
        const iconHtml = `<div style="position:relative;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:12px;border:1.5px solid #fff;background-color:${color};transition:all 0.3s;${ring}">${pulse}<svg style="width:15px;height:15px;color:#fff;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>`;
        const divIcon = L.divIcon({ html: iconHtml, className: 'custom-leaflet-marker-pack', iconSize: [34, 34], iconAnchor: [17, 17] });
        const marker = L.marker(incident.geoCoords, { icon: divIcon }).addTo(map);
        marker.on('click', () => { setSelectedEntity({ type: 'incident', id: incident.id }); map.setView([incident.geoCoords[0], incident.geoCoords[1] - 0.0025], 14, { animate: true }); });
        markersRef.current[`incident-${incident.id}`] = marker;
      });
    });
  }, [mapLoaded, activeTrucks, missedReports, selectedEntity]);

  useEffect(() => {
    if (!mapLoaded || !leafletMapInstanceRef.current || !focusedTruckId) return;
    const target = activeTrucks.find(t => t.id === focusedTruckId);
    if (target) leafletMapInstanceRef.current.setView([target.geoCoords[0], target.geoCoords[1] - 0.0025], 14, { animate: true });
  }, [focusedTruckId, mapLoaded, activeTrucks]);

  useEffect(() => {
    if (activeTab === 'map' && leafletMapInstanceRef.current) {
      const timer = setTimeout(() => leafletMapInstanceRef.current.invalidateSize(), 150);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setActiveTrucks(prev => prev.map(t => {
        if (t.status === 'COLLECTING' || t.status === 'EN_ROUTE') {
          const delta = Math.floor(Math.random() * 8) + 1;
          const next = Math.min(t.completedPercent + delta, 100);
          return { ...t, completedPercent: next, loadPercent: Math.min(t.loadPercent + Math.floor(Math.random() * 5), 100), status: next === 100 ? 'AT_DEPOT' : t.status };
        }
        return t;
      }));
      showToast(t('waste.toast.refreshed'));
    }, 1200);
  };

  const dispatchTruck = (reportId: string, truckId: string) => {
    setMissedReports(p => p.map(r => r.id === reportId ? { ...r, status: 'DISPATCHED' } : r));
    showToast(t('waste.toast.dispatched', { truck: truckId }));
    if (selectedEntity?.type === 'incident' && selectedEntity.id === reportId) {
      setSelectedEntity({ type: 'incident', id: reportId });
    }
  };

  const clearReport = (reportId: string) => {
    setMissedReports(prev => prev.filter(r => r.id !== reportId));
    if (selectedEntity?.id === reportId) setSelectedEntity(null);
    showToast(t('waste.toast.cleared', { id: reportId }));
  };

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportFormAddress.trim()) { showToast(t('waste.toast.addressRequired')); return; }
    const randomId = `RPT-${Math.floor(1000 + Math.random() * 9000)}`;
    const ranLat = 6.89 + Math.random() * 0.07;
    const ranLng = 79.84 + Math.random() * 0.05;
    const newRec: MissedReport = { id: randomId, address: reportFormAddress, reportedTime: 'Just now', binType: reportFormBinType, priority: reportFormPriority, status: 'UNASSIGNED', reporter: 'Manual Entry', geoCoords: [ranLat, ranLng] };
    setMissedReports(prev => [newRec, ...prev]);
    setReportFormAddress('');
    showToast(t('waste.toast.added', { id: randomId }));
    if (leafletMapInstanceRef.current) {
      leafletMapInstanceRef.current.setView([ranLat, ranLng - 0.0025], 14, { animate: true });
      setSelectedEntity({ type: 'incident', id: randomId });
    }
  };

  const advanceTruck = (truckId: string) => {
    setActiveTrucks(prev => prev.map(t => {
      if (t.id !== truckId) return t;
      const next = Math.min(t.completedPercent + 10, 100);
      return { ...t, completedPercent: next, loadPercent: Math.min(t.loadPercent + 6, 100), status: next === 100 ? 'AT_DEPOT' : t.status };
    }));
    showToast(t('waste.toast.advanced', { id: truckId }));
  };

  const hardReset = () => {
    setActiveTrucks(INITIAL_TRUCKS);
    setMissedReports(INITIAL_REPORTS);
    setSelectedEntity(null);
    setFocusedTruckId(null);
    showToast(t('waste.toast.reset'));
  };

  const sendDriverMessage = () => {
    if (!driverMsgVal.trim()) return;
    const driver = activeTrucks.find(tr => tr.id === selectedEntity?.id)?.driver || 'Operator';
    showToast(t('waste.toast.messageSent', { driver, msg: driverMsgVal }));
    setDriverMsgVal('');
  };

  const unassignedCount = missedReports.filter(r => r.status === 'UNASSIGNED').length;
  const avgProgress = activeTrucks.length ? Math.round(activeTrucks.reduce((s, tr) => s + tr.completedPercent, 0) / activeTrucks.length) : 0;
  const avgLoad = activeTrucks.length ? Math.round(activeTrucks.reduce((s, tr) => s + tr.loadPercent, 0) / activeTrucks.length) : 0;

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 w-full max-w-[1600px] mx-auto z-10">
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-leaflet-marker-pack { background: transparent !important; border: none !important; }
        @keyframes pinPulse { 0% { transform: scale(0.9); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 0.4; } 100% { transform: scale(0.9); opacity: 0.8; } }
        @keyframes alertPing { 0% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(239,68,68,0.5); } 70% { transform: scale(1.15); box-shadow: 0 0 0 8px rgba(239,68,68,0); } 100% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(239,68,68,0); } }
        .leaflet-container { background: #f1f5f9 !important; font-family: inherit !important; }
        .leaflet-bar { border: 1px solid #e2e8f0 !important; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important; border-radius: 12px !important; overflow: hidden; }
      ` }} />

      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 right-6 px-4 py-3 rounded-xl border border-indigo-200 bg-white text-indigo-800 text-xs font-sans font-bold shadow-2xl flex items-center gap-3 z-50">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" /></span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="font-sans font-black text-2xl md:text-3xl text-slate-900 tracking-tight">{t('waste.title')}</h1>
          <p className="font-sans text-xs text-slate-500 max-w-xl">{t('waste.desc')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button onClick={hardReset} className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-xs font-mono font-bold bg-white transition-all cursor-pointer shadow-sm flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> {t('waste.reset')}
          </button>
          <button onClick={triggerRefresh} disabled={isRefreshing} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-sans font-bold uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50">
            <FolderSync className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? t('waste.refreshing') : t('waste.refresh')}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-slate-400 tracking-wider uppercase font-bold">{t('waste.kpi.trucks')}</span>
            <Truck className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="font-mono text-2xl font-black text-slate-900">4 <span className="text-xs font-sans font-normal text-slate-400">{t('waste.kpi.trucksUnit')}</span></div>
            <p className="font-sans text-[11px] text-slate-500 mt-1">{t('waste.kpi.trucksDesc')}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-rose-700 tracking-wider uppercase font-bold">{t('waste.kpi.alerts')}</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
          </div>
          <div>
            <div className="font-mono text-2xl font-black text-rose-800">{unassignedCount} <span className="text-xs font-sans font-normal text-slate-400">{t('waste.kpi.alertsUnit')}</span></div>
            <p className="font-sans text-[11px] text-slate-500 mt-1">{t('waste.kpi.alertsDesc')}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-slate-400 tracking-wider uppercase font-bold">{t('waste.kpi.progress')}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="font-mono text-2xl font-black text-slate-900">{avgProgress}%</div>
            <p className="font-sans text-[11px] text-slate-500 mt-1">{t('waste.kpi.progressDesc')}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-slate-400 tracking-wider uppercase font-bold">{t('waste.kpi.load')}</span>
            <Trash2 className="w-4 h-4 text-sky-600" />
          </div>
          <div>
            <div className="font-mono text-2xl font-black text-slate-900">{avgLoad}%</div>
            <p className="font-sans text-[11px] text-slate-500 mt-1">{t('waste.kpi.loadDesc')}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-1">
        <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-3 text-xs font-sans font-black tracking-wider uppercase border-b-2 transition-all cursor-pointer ${activeTab === 'dashboard' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
          {t('waste.tabs.operations')}
        </button>
        <button onClick={() => setActiveTab('map')} className={`px-6 py-3 text-xs font-sans font-black tracking-wider uppercase border-b-2 transition-all cursor-pointer ${activeTab === 'map' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
          {t('waste.tabs.map')}
        </button>
      </div>

      {/* Operations tab */}
      {activeTab === 'dashboard' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col space-y-4 shadow-xs">
          <div className="space-y-1">
            <h2 className="font-sans font-black text-lg text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600" />
              {t('waste.fleet.title')}
            </h2>
            <p className="font-sans text-xs text-slate-500">{t('waste.fleet.desc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1">
            {activeTrucks.map((truck) => {
              const isSelected = selectedEntity?.type === 'truck' && selectedEntity?.id === truck.id;
              return (
                <div key={truck.id} onClick={() => { setFocusedTruckId(truck.id); setSelectedEntity({ type: 'truck', id: truck.id }); }}
                  className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer relative overflow-hidden ${isSelected ? 'border-indigo-300 bg-indigo-50/25 shadow-xs' : 'border-slate-200 bg-slate-50/30 hover:bg-slate-50'}`}>
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: truck.color }} />
                  <div className="flex justify-between items-start pl-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-800">{truck.id}</span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{truck.routeId}</span>
                      </div>
                      <h4 className="font-sans font-black text-sm text-slate-800 mt-0.5">{truck.driver}</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black tracking-wider uppercase ${truck.status === 'COLLECTING' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : truck.status === 'EN_ROUTE' ? 'bg-indigo-50 text-indigo-800 border border-indigo-100' : 'bg-amber-50 text-amber-800 border border-amber-100'}`}>
                      {truck.status}
                    </span>
                  </div>
                  <div className="pl-2 space-y-2 mb-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono text-slate-400">
                        <span>{t('waste.fleet.route')}</span><span className="font-bold text-slate-700">{truck.completedPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                        <div className="h-full" style={{ width: `${truck.completedPercent}%`, backgroundColor: truck.color }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono text-slate-400">
                        <span>{t('waste.fleet.load')}</span>
                        <span className={`font-bold ${truck.loadPercent >= 90 ? 'text-rose-600 animate-pulse' : 'text-slate-600'}`}>{truck.loadPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                        <div className="h-full bg-slate-400" style={{ width: `${truck.loadPercent}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="pl-2 flex items-center justify-between gap-2.5 text-[10px] font-sans bg-white border border-slate-100 p-2 rounded-lg">
                    <span className="text-slate-500 truncate font-semibold">{t('waste.fleet.next')} <strong className="text-slate-700 font-black">{truck.nextStop}</strong></span>
                    <button onClick={(e) => { e.stopPropagation(); advanceTruck(truck.id); }} className="px-2 py-0.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 font-mono text-[9px] font-bold cursor-pointer shrink-0">
                      {t('waste.fleet.advance')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Map tab */}
      {activeTab === 'map' && (
        <div className="lg:col-span-12 w-full h-[680px] flex flex-col min-h-[500px]">
          <div className="bg-white p-2 rounded-2xl overflow-hidden relative border border-slate-200 flex-1 flex flex-col shadow-xs">
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3 z-20 pointer-events-none">
              <div className="py-2.5 px-3.5 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md flex items-center gap-2.5 pointer-events-auto shadow-md">
                <Compass className="w-5 h-5 text-indigo-600 animate-spin" style={{ animationDuration: '6s' }} />
                <div>
                  <span className="font-sans font-black text-xs text-slate-800 block">{t('waste.map.title')}</span>
                  <span className="font-mono text-[9px] text-indigo-700 font-bold block">{t('waste.map.live')}</span>
                </div>
              </div>
              {selectedEntity && (
                <button onClick={() => setSelectedEntity(null)} className="p-2 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-md text-slate-500 hover:text-slate-800 pointer-events-auto shadow-md transition-colors cursor-pointer text-xs flex items-center gap-1 font-sans font-bold">
                  <X className="w-3.5 h-3.5" /> {t('waste.map.closePanel')}
                </button>
              )}
            </div>
            <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />
            <div className="absolute bottom-4 left-4 pointer-events-none z-10 hidden sm:block">
              <div className="py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white/90 text-[10px] font-mono text-slate-500 font-bold">
                {t('waste.map.nodeCount', { trucks: activeTrucks.length, incidents: missedReports.length })}
              </div>
            </div>

            <AnimatePresence>
              {selectedEntity && (
                <motion.div initial={{ x: '110%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '110%', opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-3 right-3 bottom-3 w-full max-w-[325px] bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 z-30 flex flex-col pointer-events-auto overflow-hidden p-5">
                  <div className="flex items-center justify-between border-b pb-4 mb-4">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-700 tracking-wider uppercase font-black">
                        {selectedEntity.type === 'truck' ? t('waste.truck.title') : t('waste.incident.title')}
                      </span>
                      <h3 className="text-slate-900 font-sans font-black text-base flex items-center gap-1.5 mt-0.5">
                        {selectedEntity.type === 'truck' ? t('waste.truck.title') : t('waste.incident.id')}
                        <span className="font-mono text-slate-500">#{selectedEntity.id}</span>
                      </h3>
                    </div>
                    <button onClick={() => setSelectedEntity(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 text-xs font-sans">
                    {selectedEntity.type === 'truck' && (() => {
                      const truck = activeTrucks.find(tr => tr.id === selectedEntity.id);
                      if (!truck) return <p className="text-slate-400">Not found.</p>;
                      return (
                        <>
                          <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={truck.driverAvatar} alt={truck.driver} className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm" />
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">{t('waste.truck.driver')}</span>
                              <h4 className="font-sans font-black text-slate-800 text-sm leading-tight mt-0.5">{truck.driver}</h4>
                              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{truck.routeId}</span>
                            </div>
                          </div>
                          <div className="space-y-2.5">
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 tracking-wide block font-semibold uppercase">{t('waste.truck.area')}</span>
                              <span className="text-slate-800 font-bold block mt-0.5">{truck.nextStop}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 block font-semibold uppercase">{t('waste.truck.status')}</span>
                              <span className="text-slate-800 font-bold flex items-center gap-1.5 mt-0.5">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: truck.color }} />{truck.status}
                              </span>
                            </div>
                            <div className="space-y-1 bg-slate-50/50 p-3 border border-slate-100 rounded-xl">
                              <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase">{t('waste.truck.load')}</span>
                              <div className="flex justify-between font-mono text-[10px] mt-1 text-slate-600">
                                <span>{t('waste.truck.weight')}</span>
                                <span className={truck.loadPercent >= 90 ? 'text-rose-600 font-bold' : 'font-bold'}>{truck.loadPercent}%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mt-1 shadow-inner">
                                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${truck.loadPercent}%`, backgroundColor: truck.loadPercent >= 90 ? '#ef4444' : (truck.loadPercent >= 75 ? '#f59e0b' : '#3b82f6') }} />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 pt-2 border-t mt-auto">
                            <label className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider block">{t('waste.truck.sendMsg')}</label>
                            <div className="flex gap-1.5">
                              <input type="text" placeholder={t('waste.truck.msgPlaceholder')} value={driverMsgVal} onChange={(e) => setDriverMsgVal(e.target.value)}
                                className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none" />
                              <button onClick={sendDriverMessage} className="bg-indigo-600 hover:bg-indigo-500 p-2 text-white rounded-xl cursor-pointer transition-colors">
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1 pt-1">
                              {[t('waste.truck.goToDepot'), t('waste.truck.urgent')].map(txt => (
                                <button key={txt} onClick={() => setDriverMsgVal(txt)} className="px-2 py-0.5 rounded text-[9px] font-mono border border-slate-200 text-slate-500 bg-slate-50 hover:bg-slate-100">{txt}</button>
                              ))}
                            </div>
                          </div>
                        </>
                      );
                    })()}

                    {selectedEntity.type === 'incident' && (() => {
                      const incident = missedReports.find(i => i.id === selectedEntity.id);
                      if (!incident) return <p className="text-slate-400">Not found.</p>;
                      const isUnassigned = incident.status === 'UNASSIGNED';
                      const pColor = incident.priority === 'CRITICAL' ? 'text-rose-600' : (incident.priority === 'HIGH' ? 'text-amber-600' : 'text-slate-500');
                      return (
                        <>
                          <div className="space-y-4">
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">{t('waste.incident.issue')}</span>
                              <h4 className="text-slate-900 font-sans font-black text-sm block mt-0.5 leading-tight">{t('waste.incident.overflow', { type: incident.binType })}</h4>
                            </div>
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">{t('waste.incident.location')}</span>
                              <span className="text-slate-800 font-bold block mt-0.5">{incident.address}</span>
                              <span className="text-[10px] font-mono text-slate-400 font-semibold block mt-0.5">
                                <MapPin className="w-3 h-3 inline mr-1" />{incident.geoCoords[0].toFixed(4)}°, {incident.geoCoords[1].toFixed(4)}°
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <div>
                                <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">{t('waste.incident.priority')}</span>
                                <span className={`font-mono font-bold block mt-0.5 text-[10px] uppercase ${pColor}`}>{incident.priority}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">{t('waste.incident.reported')}</span>
                                <span className="text-slate-800 font-bold block mt-0.5">{incident.reportedTime}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">{t('waste.incident.source')}</span>
                              <span className="text-slate-700 italic block mt-0.5 font-semibold">{incident.reporter}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">{t('waste.incident.status')}</span>
                              <span className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold mt-1 tracking-wider uppercase ${incident.status === 'UNASSIGNED' ? 'bg-amber-50 text-amber-800 border border-amber-100' : incident.status === 'DISPATCHED' ? 'bg-indigo-50 text-indigo-800 border border-indigo-100' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'}`}>
                                {incident.status}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2 border-t pt-4 mt-auto">
                            <span className="text-[10px] font-mono text-slate-500 uppercase font-black block">{t('waste.incident.sendTruck')}</span>
                            {isUnassigned ? (
                              <div className="space-y-1.5">
                                <p className="text-[10px] text-slate-400 font-semibold mb-1">{t('waste.incident.chooseTruck')}</p>
                                <div className="grid grid-cols-2 gap-1.5 font-bold font-mono">
                                  {activeTrucks.slice(0, 4).map(truck => (
                                    <button key={truck.id} onClick={() => dispatchTruck(incident.id, truck.id)}
                                      className="px-2.5 py-2 rounded-xl text-[10px] bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 transition-colors cursor-pointer text-left flex items-center justify-between">
                                      <span>{truck.id}</span><span className="text-[8px] text-slate-400 font-normal">{truck.completedPercent}%</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-emerald-800 flex items-center justify-between">
                                <span className="font-sans font-bold text-[10px] flex items-center gap-1"><Check className="w-3.5 h-3.5" /> {t('waste.incident.truckSent')}</span>
                                <button onClick={() => clearReport(incident.id)} className="px-2.5 py-1 text-[9px] bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-100/50 rounded-lg font-sans transition-colors cursor-pointer font-bold">{t('waste.incident.markDone')}</button>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Missed collections */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5">
          <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-sans font-black text-lg text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-600 animate-pulse" />
                {t('waste.missed.title')}
              </h2>
              <p className="font-sans text-xs text-slate-500">{t('waste.missed.desc')}</p>
            </div>
            <div className="text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg flex items-center gap-2 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
              {t('waste.missed.unresolved', { count: unassignedCount })}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            <div className="xl:col-span-8 space-y-3">
              <AnimatePresence initial={true}>
                {missedReports.map((report, idx) => {
                  const isSelected = selectedEntity?.type === 'incident' && selectedEntity?.id === report.id;
                  return (
                    <motion.div key={report.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ delay: idx * 0.05 }}
                      onClick={() => { setSelectedEntity({ type: 'incident', id: report.id }); if (leafletMapInstanceRef.current) leafletMapInstanceRef.current.setView([report.geoCoords[0], report.geoCoords[1] - 0.0025], 14, { animate: true }); }}
                      className={`p-4 rounded-xl border bg-white relative overflow-hidden transition-all duration-150 shadow-xs cursor-pointer ${isSelected ? 'border-indigo-400 bg-indigo-50/10' : 'border-slate-200 hover:bg-slate-50/50'}`}>
                      <div className={`absolute top-0 bottom-0 left-0 w-1 ${report.priority === 'CRITICAL' ? 'bg-rose-500' : (report.priority === 'HIGH' ? 'bg-amber-500' : 'bg-slate-400')}`} />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 font-bold">
                            <span className="font-mono text-xs font-black text-slate-800">{report.id}</span>
                            <span className="text-slate-300">•</span>
                            <span className="font-mono text-[9px] text-slate-400 uppercase">{t('waste.missed.reported')} {report.reportedTime}</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[9px] tracking-tight uppercase border border-slate-200">{report.binType}</span>
                          </div>
                          <h4 className="font-sans font-black text-slate-900 text-sm tracking-tight leading-tight mt-1">{report.address}</h4>
                        </div>
                        <div className="flex items-center gap-2.5 font-bold shrink-0">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono tracking-wider ${report.priority === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border border-rose-100' : report.priority === 'HIGH' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}>
                            {report.priority}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono tracking-wider ${report.status === 'DISPATCHED' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : report.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                            {report.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-100 pl-3">
                        <span className="text-[10px] text-slate-400 font-semibold">{report.reporter}</span>
                        <div className="flex items-center gap-1 px-1 py-0.5 font-bold" onClick={(e) => e.stopPropagation()}>
                          {report.status === 'UNASSIGNED' ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-mono text-slate-400 uppercase">{t('waste.missed.sendTruck')}</span>
                              {activeTrucks.slice(0, 3).map(truck => (
                                <button key={truck.id} onClick={() => dispatchTruck(report.id, truck.id)} className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-mono text-[9px] cursor-pointer">
                                  {truck.id}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono text-indigo-700 flex items-center gap-1"><Check className="w-3 h-3" /> {t('waste.missed.dispatched')}</span>
                              <button onClick={() => clearReport(report.id)} className="px-2.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded text-[9px] font-sans transition-colors cursor-pointer">
                                {t('waste.missed.done')}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {missedReports.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 font-sans text-xs bg-white shadow-xs">
                    <Sparkles className="w-6 h-6 text-emerald-500 mx-auto mb-2 animate-pulse" />
                    {t('waste.missed.allClear')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Intake form */}
            <div className="xl:col-span-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div>
                  <h3 className="font-sans font-black text-sm text-slate-800">{t('waste.intake.title')}</h3>
                  <p className="font-sans text-[11px] text-slate-500 font-semibold leading-tight mt-0.5">{t('waste.intake.desc')}</p>
                </div>
                <form onSubmit={handleAddReport} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 uppercase font-black block">{t('waste.intake.address')}</label>
                    <input type="text" required placeholder={t('waste.intake.addressPlaceholder')} value={reportFormAddress} onChange={(e) => setReportFormAddress(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs font-sans text-slate-800 focus:outline-none focus:border-indigo-500 shadow-inner" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 uppercase font-black block">{t('waste.intake.binType')}</label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['Recycling', 'Solid Waste', 'Organic Waste'] as const).map(type => (
                        <button key={type} type="button" onClick={() => setReportFormBinType(type)}
                          className={`py-1.5 rounded-lg text-[9px] font-mono border transition-all cursor-pointer font-bold ${reportFormBinType === type ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}>
                          {type.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 uppercase font-black block">{t('waste.intake.priority')}</label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['NORMAL', 'HIGH', 'CRITICAL'] as const).map(tier => (
                        <button key={tier} type="button" onClick={() => setReportFormPriority(tier)}
                          className={`py-1.5 rounded-lg text-[9px] font-mono border transition-all cursor-pointer font-bold ${reportFormPriority === tier ? (tier === 'CRITICAL' ? 'bg-rose-50 border-rose-200 text-rose-700' : tier === 'HIGH' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-indigo-50 border-indigo-200 text-indigo-700') : 'bg-white border-slate-200 text-slate-500'}`}>
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-bold uppercase rounded-xl text-[10px] tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {t('waste.intake.submit')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
