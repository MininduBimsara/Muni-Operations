'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  X,
  Compass,
  Sliders,
  MapPin,
  BellRing,
  CheckCircle2,
  AlertCircle,
  Clock,
  Map,
  TableProperties,
  MonitorPlay,
  CalendarClock,
  ShieldAlert,
  FileCheck,
  Ruler,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

type BillboardStatus = 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'VIOLATION';

interface Billboard {
  id: string;
  owner: string;
  company: string;
  address: string;
  zone: string;
  size: string;
  licenseNo: string;
  issuedDate: string;
  expiryDate: string;
  feePaid: boolean;
  status: BillboardStatus;
  geoCoords: [number, number];
}

const initialBoards: Billboard[] = [
  { id: 'BB-001', owner: 'Sunil Jayawardena', company: 'Lanka Ads Pvt Ltd', address: '42 Lotus Road, Colombo 01', zone: 'Zone 1', size: '6m × 4m', licenseNo: 'CMC/BB/2024/001', issuedDate: '2024-01-15', expiryDate: '2026-01-14', feePaid: true, status: 'ACTIVE', geoCoords: [6.9350, 79.8430] },
  { id: 'BB-002', owner: 'Nadeesha Perera', company: 'Outdoor Vision SL', address: '18 Galle Road, Colombo 03', zone: 'Zone 3', size: '8m × 5m', licenseNo: 'CMC/BB/2023/018', issuedDate: '2023-06-01', expiryDate: '2025-05-31', feePaid: false, status: 'EXPIRED', geoCoords: [6.9080, 79.8505] },
  { id: 'BB-003', owner: 'Roshan Weerasinghe', company: 'Mega Signs Co', address: '7 D.R. Wijewardene Mw, Colombo 10', zone: 'Zone 2', size: '10m × 6m', licenseNo: 'CMC/BB/2025/007', issuedDate: '2025-03-10', expiryDate: '2027-03-09', feePaid: true, status: 'ACTIVE', geoCoords: [6.9244, 79.8525] },
  { id: 'BB-004', owner: 'Lakshmi Ratnayake', company: 'Prime Hoardings Ltd', address: '91 Baseline Road, Borella', zone: 'Zone 4', size: '5m × 3m', licenseNo: 'CMC/BB/2024/041', issuedDate: '2024-04-20', expiryDate: '2026-04-19', feePaid: true, status: 'ACTIVE', geoCoords: [6.9120, 79.8700] },
  { id: 'BB-005', owner: 'Chamari Silva', company: 'Visual Impact Ads', address: '33 Marine Drive, Colombo 03', zone: 'Zone 3', size: '12m × 6m', licenseNo: 'CMC/BB/PENDING', issuedDate: '—', expiryDate: '—', feePaid: false, status: 'PENDING', geoCoords: [6.9068, 79.8490] },
  { id: 'BB-006', owner: 'Tharaka Bandara', company: 'CityView Ads', address: '15 Havelock Road, Colombo 05', zone: 'Zone 4', size: '6m × 4m', licenseNo: 'CMC/BB/2022/006', issuedDate: '2022-07-01', expiryDate: '2024-06-30', feePaid: false, status: 'EXPIRED', geoCoords: [6.9130, 79.8720] },
  { id: 'BB-007', owner: 'Malith Fernando', company: 'BroadSign Lanka', address: '88 Union Place, Colombo 02', zone: 'Zone 2', size: '8m × 4m', licenseNo: 'CMC/BB/2025/022', issuedDate: '2025-01-08', expiryDate: '2027-01-07', feePaid: true, status: 'VIOLATION', geoCoords: [6.9200, 79.8540] },
  { id: 'BB-008', owner: 'Priya Krishnamurthy', company: 'Neon Galaxy Pvt', address: '204 Duplication Rd, Colombo 03', zone: 'Zone 3', size: '9m × 5m', licenseNo: 'CMC/BB/2025/034', issuedDate: '2025-02-14', expiryDate: '2027-02-13', feePaid: true, status: 'ACTIVE', geoCoords: [6.9100, 79.8610] },
  { id: 'BB-009', owner: 'Dilshan Kumara', company: 'Street Media SL', address: '55 Negombo Road, Grandpass', zone: 'Zone 6', size: '4m × 3m', licenseNo: 'CMC/BB/PENDING', issuedDate: '—', expiryDate: '—', feePaid: false, status: 'PENDING', geoCoords: [6.9400, 79.8800] },
  { id: 'BB-010', owner: 'Samanthi Gunasekara', company: 'ColombAds Ltd', address: '12 Pamankada Lane, Wellawatte', zone: 'Zone 5', size: '5m × 3m', licenseNo: 'CMC/BB/2024/055', issuedDate: '2024-08-01', expiryDate: '2026-07-31', feePaid: true, status: 'ACTIVE', geoCoords: [6.8740, 79.8610] },
  { id: 'BB-011', owner: 'Rajan Selvam', company: 'Tamil Ads Network', address: '67 Dickman Road, Colombo 05', zone: 'Zone 4', size: '7m × 4m', licenseNo: 'CMC/BB/2023/071', issuedDate: '2023-09-15', expiryDate: '2025-09-14', feePaid: false, status: 'EXPIRED', geoCoords: [6.9140, 79.8740] },
  { id: 'BB-012', owner: 'Amara Wickramasinghe', company: 'Island Hoardings', address: '31 Kynsey Road, Borella', zone: 'Zone 4', size: '6m × 3m', licenseNo: 'CMC/BB/2025/088', issuedDate: '2025-04-01', expiryDate: '2027-03-31', feePaid: true, status: 'VIOLATION', geoCoords: [6.9160, 79.8680] },
];

const STATUS_CONFIG: Record<BillboardStatus, { color: string; ring: string; dot: string; icon: React.ReactNode }> = {
  ACTIVE:    { color: 'bg-emerald-50 border-emerald-100 text-emerald-800', ring: '#10b981', dot: 'bg-emerald-500', icon: <CheckCircle2 className="w-4 h-4" /> },
  EXPIRED:   { color: 'bg-slate-50 border-slate-200 text-slate-600',       ring: '#94a3b8', dot: 'bg-slate-400',   icon: <Clock className="w-4 h-4" /> },
  PENDING:   { color: 'bg-amber-50 border-amber-100 text-amber-800',        ring: '#f59e0b', dot: 'bg-amber-500',  icon: <FileCheck className="w-4 h-4" /> },
  VIOLATION: { color: 'bg-rose-50 border-rose-100 text-rose-800',           ring: '#ef4444', dot: 'bg-rose-500',   icon: <ShieldAlert className="w-4 h-4" /> },
};

export default function BillboardPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'MAP' | 'TABLE'>('MAP');
  const [boards, setBoards] = useState<Billboard[]>(initialBoards);
  const [selectedId, setSelectedId] = useState<string | null>('BB-001');
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [zoneFilter, setZoneFilter] = useState<string>('ALL');

  const mapRef = React.useRef<HTMLDivElement | null>(null);
  const leafletMapRef = React.useRef<any>(null);
  const markersRef = React.useRef<{ [key: string]: any }>({});
  const [mapLoaded, setMapLoaded] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const totalBoards = boards.length;
  const activeCount  = boards.filter(b => b.status === 'ACTIVE').length;
  const expiredCount = boards.filter(b => b.status === 'EXPIRED').length;
  const violationCount = boards.filter(b => b.status === 'VIOLATION').length;
  const pendingCount = boards.filter(b => b.status === 'PENDING').length;

  const filteredBoards = useMemo(() => {
    return boards.filter(b => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        b.id.toLowerCase().includes(q) ||
        b.owner.toLowerCase().includes(q) ||
        b.company.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.licenseNo.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
      const matchZone = zoneFilter === 'ALL' || b.zone === zoneFilter;
      return matchSearch && matchStatus && matchZone;
    });
  }, [boards, searchQuery, statusFilter, zoneFilter]);

  const handleApprove = (id: string) => {
    setBoards(prev => prev.map(b =>
      b.id === id ? { ...b, status: 'ACTIVE', licenseNo: `CMC/BB/${new Date().getFullYear()}/${id.replace('BB-', '')}`, issuedDate: new Date().toISOString().slice(0, 10), expiryDate: new Date(Date.now() + 2 * 365.25 * 86400000).toISOString().slice(0, 10), feePaid: true } : b
    ));
    showToast(t('billboard.toast.approved', { id }));
  };

  const handleSendNotice = (id: string) => {
    const board = boards.find(b => b.id === id);
    setSendingId(id);
    setTimeout(() => {
      setSendingId(null);
      if (board) showToast(t('billboard.toast.noticeSent', { owner: board.owner }));
    }, 1100);
  };

  const handleRenew = (id: string) => {
    setBoards(prev => prev.map(b =>
      b.id === id ? { ...b, status: 'ACTIVE', expiryDate: new Date(Date.now() + 2 * 365.25 * 86400000).toISOString().slice(0, 10), feePaid: true } : b
    ));
    showToast(t('billboard.toast.renewed', { id }));
  };

  React.useEffect(() => {
    if (activeTab !== 'MAP') return;
    if (!document.getElementById('leaflet-css-pack')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-pack'; link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    let isMounted = true; let mapInstance: any = null;
    const timer = setTimeout(() => {
      import('leaflet').then((L) => {
        if (!isMounted || !mapRef.current) return;
        if (leafletMapRef.current) { try { leafletMapRef.current.remove(); } catch (e) {} }
        mapInstance = L.map(mapRef.current, { zoomControl: false, attributionControl: true }).setView([6.9185, 79.8620], 13);
        leafletMapRef.current = mapInstance;
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 18, minZoom: 11, attribution: 'Tiles &copy; Esri',
        }).addTo(mapInstance);
        L.control.zoom({ position: 'topright' }).addTo(mapInstance);
        setMapLoaded(true);
      }).catch(console.error);
    }, 150);
    return () => {
      isMounted = false; clearTimeout(timer);
      if (mapInstance) { try { mapInstance.remove(); } catch (e) {} leafletMapRef.current = null; setMapLoaded(false); }
    };
  }, [activeTab]);

  React.useEffect(() => {
    if (!mapLoaded || !leafletMapRef.current) return;
    const map = leafletMapRef.current;
    Object.values(markersRef.current).forEach((m: any) => { try { map.removeLayer(m); } catch (e) {} });
    markersRef.current = {};
    import('leaflet').then((L) => {
      boards.forEach((board) => {
        const isSelected = selectedId === board.id;
        const cfg = STATUS_CONFIG[board.status];
        const pulse = (board.status === 'VIOLATION' || board.status === 'EXPIRED')
          ? `<span style="position:absolute;width:36px;height:36px;border-radius:50%;background:${cfg.ring}30;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;z-index:-1;"></span>`
          : '';
        const ring = isSelected
          ? `box-shadow:0 0 0 5px ${cfg.ring}30;transform:scale(1.2);z-index:999!important;`
          : 'box-shadow:0 4px 8px rgba(0,0,0,0.15);';
        const iconHtml = `<div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:10px;border:2px solid white;background:${cfg.ring};transition:all 0.3s;${ring}">${pulse}<svg style="width:14px;height:14px;color:white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="4" rx="2"/><path d="M7 20h10"/><path d="M9 16v4"/><path d="M15 16v4"/></svg></div>`;
        const divIcon = L.divIcon({ html: iconHtml, className: 'billboard-marker', iconSize: [32, 32], iconAnchor: [16, 16] });
        const marker = L.marker(board.geoCoords, { icon: divIcon }).addTo(map);
        marker.on('click', () => {
          setSelectedId(board.id);
          map.setView([board.geoCoords[0], board.geoCoords[1] - 0.003], 15, { animate: true, duration: 1.0 });
        });
        const popupHtml = `<div style="font-family:sans-serif;min-width:150px;padding:4px;"><div style="font-weight:800;color:#0f172a;font-size:11px;margin-bottom:4px;">${board.id} — ${board.company}</div><div style="font-size:10px;color:#475569;border-top:1px solid #f1f5f9;padding-top:4px;">${board.address}</div></div>`;
        marker.bindPopup(popupHtml, { closeButton: false, offset: L.point(0, -6) });
        markersRef.current[board.id] = marker;
      });
    });
  }, [mapLoaded, boards, selectedId]);

  React.useEffect(() => {
    if (!mapLoaded || !selectedId || !leafletMapRef.current) return;
    const board = boards.find(b => b.id === selectedId);
    if (board) leafletMapRef.current.setView([board.geoCoords[0], board.geoCoords[1] - 0.003], 15, { animate: true, duration: 1.0 });
  }, [selectedId, mapLoaded, boards]);

  const selectedBoard = boards.find(b => b.id === selectedId);
  const uniqueZones = Array.from(new Set(boards.map(b => b.zone))).sort();

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 w-full max-w-[1600px] mx-auto z-10">
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 px-4 py-3 rounded-xl border border-emerald-200 bg-white text-emerald-800 text-xs font-sans font-bold shadow-xl flex items-center gap-3 z-50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-sans font-black text-2xl md:text-3xl text-slate-900 tracking-tight">{t('billboard.title')}</h1>
        <p className="font-sans text-xs text-slate-500 max-w-xl">{t('billboard.desc')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-slate-50 rounded-lg text-slate-600 border border-slate-100"><MonitorPlay className="w-5 h-5" /></div>
          <div className="space-y-0.5">
            <span className="font-sans text-[10px] text-slate-400 font-bold tracking-wider block uppercase">{t('billboard.kpi.total')}</span>
            <span className="font-mono text-2xl font-black text-slate-800">{totalBoards}</span>
            <span className="font-sans text-[10px] text-slate-400 block">{t('billboard.kpi.totalDesc')}</span>
          </div>
        </div>
        <div className="bg-white border border-emerald-100 p-5 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700 border border-emerald-100"><CheckCircle2 className="w-5 h-5" /></div>
          <div className="space-y-0.5">
            <span className="font-sans text-[10px] text-emerald-600 font-bold tracking-wider block uppercase">{t('billboard.kpi.active')}</span>
            <span className="font-mono text-2xl font-black text-emerald-700">{activeCount}</span>
            <span className="font-sans text-[10px] text-emerald-500 block">{t('billboard.kpi.activeDesc')}</span>
          </div>
        </div>
        <div className="relative overflow-hidden bg-rose-50/40 border border-rose-200 p-5 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-rose-100 rounded-lg text-rose-700 border border-rose-200"><ShieldAlert className="w-5 h-5 animate-pulse" /></div>
          <div className="space-y-0.5">
            <span className="font-sans text-[10px] text-rose-700 font-bold tracking-wider block uppercase">{t('billboard.kpi.violations')}</span>
            <span className="font-mono text-2xl font-black text-rose-800">{violationCount}</span>
            <span className="font-sans text-[10px] text-rose-600 block">{t('billboard.kpi.violationsDesc')}</span>
          </div>
        </div>
        <div className="bg-white border border-amber-100 p-5 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-700 border border-amber-100"><CalendarClock className="w-5 h-5" /></div>
          <div className="space-y-0.5">
            <span className="font-sans text-[10px] text-amber-700 font-bold tracking-wider block uppercase">{t('billboard.kpi.expired')}</span>
            <span className="font-mono text-2xl font-black text-amber-800">{expiredCount + pendingCount}</span>
            <span className="font-sans text-[10px] text-amber-600 block">{t('billboard.kpi.expiredDesc')}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button onClick={() => setActiveTab('MAP')}
          className={`pb-3.5 text-xs font-sans font-black tracking-widest uppercase transition-all border-b-2 px-6 flex items-center gap-2.5 cursor-pointer ${activeTab === 'MAP' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
          <Map className="w-4 h-4" />
          {t('billboard.tabs.map')}
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold ml-1">Live</span>
        </button>
        <button onClick={() => setActiveTab('TABLE')}
          className={`pb-3.5 text-xs font-sans font-black tracking-widest uppercase transition-all border-b-2 px-6 flex items-center gap-2.5 cursor-pointer ${activeTab === 'TABLE' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
          <TableProperties className="w-4 h-4" />
          {t('billboard.tabs.table')}
        </button>
      </div>

      {/* MAP TAB */}
      {activeTab === 'MAP' && (
        <div className="space-y-5">
          <style dangerouslySetInnerHTML={{ __html: `
            .billboard-marker { background: transparent !important; border: none !important; }
            .leaflet-container { font-family: inherit !important; background: #f8fafc !important; }
            .leaflet-bar { border: 1px solid #cbd5e1 !important; box-shadow: 0 4px 12px rgba(15,23,42,0.08) !important; border-radius: 12px !important; overflow: hidden; }
            .leaflet-bar a { background-color: #ffffff !important; border-bottom: 1px solid #f1f5f9 !important; color: #475569 !important; transition: all 0.2s; }
            .leaflet-bar a:hover { background-color: #f8fafc !important; color: #0f172a !important; }
            @keyframes ping { 0% { transform: scale(0.9); opacity: 0.8; } 70% { transform: scale(1.15); opacity: 0.3; } 100% { transform: scale(0.9); opacity: 0.8; } }
          ` }} />

          <div className="relative w-full h-[650px] bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-lg flex">
            <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />

            {/* Top-left overlay */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-2">
              <div className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-md flex items-center gap-3 pointer-events-auto shadow-md">
                <Compass className="w-5 h-5 text-emerald-600 animate-spin" style={{ animationDuration: '10s' }} />
                <div>
                  <span className="font-sans font-black text-xs text-slate-800 flex items-center gap-1.5 leading-none mb-1">
                    {t('billboard.map.title')}
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
                  </span>
                  <span className="font-mono text-[9px] text-emerald-700 tracking-wider block font-bold">{t('billboard.map.live')}</span>
                </div>
              </div>

              {/* Quick-nav list */}
              <div className="pointer-events-auto flex flex-col gap-1 bg-white/95 backdrop-blur-md p-2 border border-slate-200 rounded-xl shadow-md max-h-64 overflow-y-auto">
                {boards.map(board => {
                  const cfg = STATUS_CONFIG[board.status];
                  return (
                    <button
                      key={board.id}
                      onClick={() => {
                        setSelectedId(board.id);
                        if (leafletMapRef.current) leafletMapRef.current.setView([board.geoCoords[0], board.geoCoords[1] - 0.003], 15, { animate: true, duration: 1.0 });
                      }}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[10px] font-sans font-bold transition-all cursor-pointer ${selectedId === board.id ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      <span className={`h-2 w-2 rounded-full shrink-0 ${cfg.dot}`} />
                      <span className="truncate max-w-[170px]">{board.id} — {board.company}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-10 p-4 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-md">
              <h4 className="font-sans font-black text-[10px] text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b pb-1.5">
                <Sliders className="w-3 h-3" /> {t('billboard.map.legend')}
              </h4>
              <div className="space-y-2">
                {([
                  { dot: 'bg-emerald-500', label: t('billboard.status.active') },
                  { dot: 'bg-rose-500',    label: t('billboard.status.violation') },
                  { dot: 'bg-amber-500',   label: t('billboard.status.pending') },
                  { dot: 'bg-slate-400',   label: t('billboard.status.expired') },
                ] as const).map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${item.dot}`} />
                    <span className="font-sans font-bold text-slate-700 text-[10px] uppercase">{item.label}</span>
                  </div>
                ))}
                <div className="mt-2.5 pt-2 border-t border-slate-100 font-mono text-[9px] text-slate-400 font-bold">
                  {t('billboard.map.totalBoards', { count: boards.length })}
                </div>
              </div>
            </div>

            {/* Hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <div className="text-[10px] font-mono py-1 px-2.5 border border-slate-200 bg-white/90 text-slate-500 rounded-lg shadow-sm whitespace-nowrap">
                {t('billboard.map.hint')}
              </div>
            </div>

            {/* Detail Panel */}
            <AnimatePresence>
              {selectedBoard && (
                <motion.div
                  initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                  className="absolute top-0 right-0 h-full w-full sm:w-[390px] bg-white border-l border-slate-200 shadow-2xl z-20 flex flex-col pointer-events-auto"
                >
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div>
                      <h3 className="font-sans font-black text-base text-slate-900">{selectedBoard.id}</h3>
                      <p className="font-mono text-[10px] text-slate-400 mt-0.5">{selectedBoard.company}</p>
                    </div>
                    <button onClick={() => setSelectedId(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Status */}
                    <div className={`p-4 rounded-xl border flex items-center gap-3 ${STATUS_CONFIG[selectedBoard.status].color}`}>
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center border shrink-0 bg-white ${STATUS_CONFIG[selectedBoard.status].color}`}>
                        {STATUS_CONFIG[selectedBoard.status].icon}
                      </div>
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block font-bold">{t('billboard.panel.status')}</span>
                        <span className="font-sans font-black text-xs uppercase tracking-tight">
                          {t(`billboard.status.${selectedBoard.status.toLowerCase()}`)}
                        </span>
                      </div>
                    </div>

                    {/* Details grid */}
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/30">
                      {[
                        { label: t('billboard.panel.owner'),   value: selectedBoard.owner },
                        { label: t('billboard.panel.address'), value: selectedBoard.address, icon: <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> },
                        { label: t('billboard.panel.zone'),    value: selectedBoard.zone },
                        { label: t('billboard.panel.size'),    value: selectedBoard.size, icon: <Ruler className="w-3.5 h-3.5 text-slate-400 shrink-0" /> },
                        { label: t('billboard.panel.license'), value: selectedBoard.licenseNo },
                        { label: t('billboard.panel.issued'),  value: selectedBoard.issuedDate },
                        { label: t('billboard.panel.expiry'),  value: selectedBoard.expiryDate, highlight: selectedBoard.status === 'EXPIRED' || selectedBoard.status === 'VIOLATION' },
                      ].map(row => (
                        <div key={row.label} className="p-3.5 flex flex-col gap-0.5">
                          <span className="font-mono text-[9px] text-slate-400 uppercase font-black">{row.label}</span>
                          <span className={`font-sans text-xs font-bold flex items-center gap-1.5 leading-normal ${row.highlight ? 'text-rose-600' : 'text-slate-800'}`}>
                            {row.icon}{row.value}
                          </span>
                        </div>
                      ))}
                      <div className="p-3.5 flex items-center justify-between">
                        <span className="font-mono text-[9px] text-slate-400 uppercase font-black">{t('billboard.panel.feePaid')}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black font-mono border ${selectedBoard.feePaid ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                          {selectedBoard.feePaid ? t('billboard.panel.feeYes') : t('billboard.panel.feeNo')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 border-t border-slate-100 bg-slate-50/55 flex flex-col gap-2.5">
                    {selectedBoard.status === 'PENDING' && (
                      <button onClick={() => handleApprove(selectedBoard.id)}
                        className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer">
                        <FileCheck className="w-4 h-4" /> {t('billboard.action.approve')}
                      </button>
                    )}
                    {selectedBoard.status === 'EXPIRED' && (
                      <button onClick={() => handleRenew(selectedBoard.id)}
                        className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer">
                        <CalendarClock className="w-4 h-4" /> {t('billboard.action.renew')}
                      </button>
                    )}
                    {(selectedBoard.status === 'VIOLATION' || selectedBoard.status === 'EXPIRED') && (
                      <button
                        onClick={() => handleSendNotice(selectedBoard.id)}
                        disabled={sendingId === selectedBoard.id}
                        className="w-full h-11 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                        <BellRing className={`w-4 h-4 ${sendingId === selectedBoard.id ? 'animate-bounce' : ''}`} />
                        {sendingId === selectedBoard.id ? t('billboard.action.sending') : t('billboard.action.sendNotice')}
                      </button>
                    )}
                    {selectedBoard.status === 'ACTIVE' && (
                      <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/65 text-emerald-800 text-[11px] font-sans font-black flex items-center justify-center gap-2 leading-none">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        {t('billboard.panel.activeMsg')}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* TABLE TAB */}
      {activeTab === 'TABLE' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col space-y-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                <MonitorPlay className="w-5 h-5 text-emerald-600" />
                <h2>{t('billboard.table.title')}</h2>
              </div>
              <p className="font-sans text-xs text-slate-500">{t('billboard.table.desc')}</p>
            </div>
            {(searchQuery !== '' || statusFilter !== 'ALL' || zoneFilter !== 'ALL') && (
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); setZoneFilter('ALL'); showToast(t('billboard.toast.filtersReset')); }}
                className="px-2.5 py-1 text-[10px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1.5 transition-colors self-start font-bold animate-pulse">
                {t('billboard.table.resetFilters')} <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-2">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder={t('billboard.table.search')}
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-xs font-sans text-slate-800 placeholder-slate-400 transition-all focus:outline-none" />
            </div>
            <div className="md:col-span-3 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 hover:border-slate-300 transition-colors">
              <Filter className="w-3.5 h-3.5 text-slate-400 mr-2" />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-transparent text-xs font-sans text-slate-700 font-semibold w-full focus:outline-none cursor-pointer h-10 py-1">
                <option value="ALL">{t('billboard.table.allStatus')}</option>
                <option value="ACTIVE">{t('billboard.status.active')}</option>
                <option value="EXPIRED">{t('billboard.status.expired')}</option>
                <option value="PENDING">{t('billboard.status.pending')}</option>
                <option value="VIOLATION">{t('billboard.status.violation')}</option>
              </select>
            </div>
            <div className="md:col-span-4 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 hover:border-slate-300 transition-colors">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mr-2" />
              <select value={zoneFilter} onChange={e => setZoneFilter(e.target.value)} className="bg-transparent text-xs font-sans text-slate-700 font-semibold w-full focus:outline-none cursor-pointer h-10 py-1">
                <option value="ALL">{t('billboard.table.allZones')}</option>
                {uniqueZones.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-mono text-[10px] uppercase tracking-wider font-bold">
                  <th className="pb-3.5 pt-2 pl-3">{t('billboard.table.colId')}</th>
                  <th className="pb-3.5 pt-2">{t('billboard.table.colOwner')}</th>
                  <th className="pb-3.5 pt-2">{t('billboard.table.colZone')}</th>
                  <th className="pb-3.5 pt-2">{t('billboard.table.colSize')}</th>
                  <th className="pb-3.5 pt-2">{t('billboard.table.colExpiry')}</th>
                  <th className="pb-3.5 pt-2">{t('billboard.table.colStatus')}</th>
                  <th className="pb-3.5 pt-2 pr-3 text-right">{t('billboard.table.colActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBoards.length > 0 ? filteredBoards.map(board => {
                  const isUrgent = board.status === 'VIOLATION' || board.status === 'EXPIRED';
                  const cfg = STATUS_CONFIG[board.status];
                  return (
                    <tr key={board.id}
                      className={`group transition-all duration-150 ${board.status === 'VIOLATION' ? 'bg-rose-50/30 hover:bg-rose-50/50' : board.status === 'EXPIRED' ? 'bg-slate-50/50 hover:bg-slate-50' : 'hover:bg-slate-50/80'}`}
                      style={{ boxShadow: isUrgent ? `inset 3px 0 0 ${board.status === 'VIOLATION' ? '#f43f5e' : '#94a3b8'}` : 'none' }}
                    >
                      <td className="py-4 pl-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-700">{board.id}</span>
                          {isUrgent && <span className={`h-2 w-2 rounded-full animate-pulse ${board.status === 'VIOLATION' ? 'bg-rose-500' : 'bg-slate-400'}`} />}
                        </div>
                      </td>
                      <td className="py-4 max-w-xs">
                        <div className="font-sans text-slate-800 font-bold">{board.owner}</div>
                        <div className="font-sans text-[10px] text-slate-400 mt-0.5">{board.company}</div>
                      </td>
                      <td className="py-4">
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">{board.zone}</span>
                      </td>
                      <td className="py-4">
                        <span className="font-mono text-[11px] text-slate-500 flex items-center gap-1"><Ruler className="w-3 h-3 text-slate-400" />{board.size}</span>
                      </td>
                      <td className="py-4">
                        <span className={`font-mono text-[11px] font-semibold ${board.status === 'EXPIRED' ? 'text-rose-600' : board.status === 'VIOLATION' ? 'text-rose-500' : 'text-slate-450'}`}>
                          {board.expiryDate}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider font-mono border uppercase ${cfg.color} ${isUrgent ? 'animate-pulse' : ''}`}>
                          {t(`billboard.status.${board.status.toLowerCase()}`)}
                        </span>
                      </td>
                      <td className="py-4 pr-3">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {board.status === 'PENDING' && (
                            <button onClick={() => handleApprove(board.id)}
                              className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 transition-all cursor-pointer flex items-center gap-1">
                              <FileCheck className="w-3 h-3" /> {t('billboard.action.approve')}
                            </button>
                          )}
                          {board.status === 'EXPIRED' && (
                            <button onClick={() => handleRenew(board.id)}
                              className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 transition-all cursor-pointer flex items-center gap-1">
                              <CalendarClock className="w-3 h-3" /> {t('billboard.action.renew')}
                            </button>
                          )}
                          {(board.status === 'VIOLATION' || board.status === 'EXPIRED') && (
                            <button onClick={() => handleSendNotice(board.id)} disabled={sendingId === board.id}
                              className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50">
                              <BellRing className={`w-3 h-3 ${sendingId === board.id ? 'animate-bounce' : ''}`} />
                              {t('billboard.action.sendNotice')}
                            </button>
                          )}
                          {board.status === 'ACTIVE' && (
                            <span className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> {t('billboard.status.active')}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-sans text-sm border-dashed border border-slate-200 rounded-2xl">
                      {t('billboard.table.noResults')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
