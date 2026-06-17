'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  AlertTriangle, 
  Truck, 
  CheckCircle,
  MapPin,
  Compass,
  Activity,
  Clock,
  ArrowRight,
  Lightbulb,
  Building2
} from 'lucide-react';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  module: 'street-lights' | 'waste' | 'system';
  title: string;
  description: string;
  time: string;
  status: 'info' | 'warning' | 'success';
}

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState('21:45:00');
  const [currentDate, setCurrentDate] = useState('Monday, June 15, 2026');
  const [activeLayer, setActiveLayer] = useState<'all' | 'lights' | 'trucks'>('all');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Recent Activity Feed containing the latest 5 actions across council
  const [activities] = useState<ActivityItem[]>([
    {
      id: 'act-001',
      module: 'street-lights',
      title: 'LECO Emergency Team dispatched to Galle Road',
      description: 'Dispatched response unit to address the high-voltage photocell line breakdown in Colombo 03 Corridor.',
      time: '4 mins ago',
      status: 'warning',
    },
    {
      id: 'act-002',
      module: 'waste',
      title: 'Abans Fleet Route CMC-04 Optimized',
      description: 'Recalculated dispatch course for Pettah Sector 4. Saved 15.2% fuel across clean-up tracks.',
      time: '18 mins ago',
      status: 'success',
    },
    {
      id: 'act-003',
      module: 'system',
      title: 'CEB Smart-Dimming Night Protocol active',
      description: 'Triggered 50% energy conservation drop for residential street lights on Ward Place and Flower Road.',
      time: '1 hour ago',
      status: 'info',
    },
    {
      id: 'act-004',
      module: 'waste',
      title: 'Cleantech Container CMC-71 Fully Emptied',
      description: 'Service completed at Viharamahadevi Park Entrance. Capacity index reset to 0% successfully.',
      time: '2 hours ago',
      status: 'success',
    },
    {
      id: 'act-005',
      module: 'street-lights',
      title: 'SLA Escalation Threshold Sync Done',
      description: 'CMC Administrator synchronized central SLA warning escalation gates with LECO and Abans.',
      time: '3 hours ago',
      status: 'info',
    },
  ]);

  // Synchronize dynamic time ticker on client
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- ARCGIS LEAFLET MAP REFS & STATE ---
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});

  // Map simulated hotspots for street lights and waste trucks in Colombo, Sri Lanka
  const mapHotspots = [
    { 
      id: 'node-l1', 
      type: 'light', 
      geoCoords: [6.9180, 79.8510] as [number, number], 
      title: 'Galle Road Colombo 03 Corridor', 
      status: '78 Active, 2 Defective (LECO assigned)', 
      color: '#f59e0b', 
      ringColor: '#f59e0b35' 
    },
    { 
      id: 'node-l2', 
      type: 'light', 
      geoCoords: [6.9140, 79.8630] as [number, number], 
      title: 'Duplication Road & Ward Place Grid', 
      status: '128 Active, 12 Defective (High Priority)', 
      color: '#ef4444', 
      ringColor: '#ef444435' 
    },
    { 
      id: 'node-t1', 
      type: 'waste', 
      geoCoords: [6.9320, 79.8490] as [number, number], 
      title: 'Abans Compactor Unit #4', 
      status: 'En route to Pettah Sector 4 Depot', 
      color: '#4f46e5', 
      ringColor: '#4f46e535' 
    },
    { 
      id: 'node-t2', 
      type: 'waste', 
      geoCoords: [6.9240, 79.8515] as [number, number], 
      title: 'Cleantech Compactor Unit #8', 
      status: 'Compacting at Slave Island Promenade', 
      color: '#3b82f6', 
      ringColor: '#3b82f635' 
    },
    { 
      id: 'node-l3', 
      type: 'light', 
      geoCoords: [6.8980, 79.8530] as [number, number], 
      title: 'Marine Drive Coastal Lighting', 
      status: '45 Active, Nominal (A++ Efficiency)', 
      color: '#10b981', 
      ringColor: '#10b98135' 
    },
  ];

  // --- DIRECTIVES FOR LEAFLET BOOTSTRAPPING ---
  useEffect(() => {
    if (!document.getElementById('leaflet-css-pack')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-pack';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    let isMounted = true;
    let mapInstance: any = null;

    const initTimer = setTimeout(() => {
      import('leaflet').then((L) => {
        if (!isMounted || !mapRef.current) return;

        if (leafletMapInstanceRef.current) {
          try {
            leafletMapInstanceRef.current.remove();
          } catch (e) {
            console.warn(e);
          }
        }

        mapInstance = L.map(mapRef.current, {
          zoomControl: false,
          maxBounds: [[6.80, 79.78], [7.00, 79.94]],
          attributionControl: true
        }).setView([6.9180, 79.8552], 13);

        leafletMapInstanceRef.current = mapInstance;

        // Esri ArcGIS Street base tile layer
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 18,
          minZoom: 12,
          attribution: 'ArcGIS &copy; Esri &mdash; Colombo GIS Operations'
        }).addTo(mapInstance);

        L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);
        setMapLoaded(true);
      }).catch((err) => console.error('Leaflet loading error', err));
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(initTimer);
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch (e) {}
        leafletMapInstanceRef.current = null;
        setMapLoaded(false);
      }
    };
  }, []);

  const filteredHotspots = mapHotspots.filter((spot) => {
    if (activeLayer === 'all') return true;
    if (activeLayer === 'lights') return spot.type === 'light';
    if (activeLayer === 'trucks') return spot.type === 'waste';
    return true;
  });

  // --- MARKERS COORDINATION & MAP EVENT BINDING ---
  useEffect(() => {
    if (!mapLoaded || !leafletMapInstanceRef.current) return;
    const map = leafletMapInstanceRef.current;

    // Remove old triggers
    Object.values(markersRef.current).forEach((marker: any) => {
      try {
        map.removeLayer(marker);
      } catch (e) {}
    });
    markersRef.current = {};

    import('leaflet').then((L) => {
      filteredHotspots.forEach((spot) => {
        const isHovered = hoveredNode === spot.id;
        const pointerRing = isHovered 
          ? `box-shadow: 0 0 0 6px ${spot.color}35, 0 10px 15px -3px rgba(0,0,0,0.3); transform: scale(1.15) translateY(-1px); z-index: 1000 !important;` 
          : `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.15);`;

        const iconHtml = `
          <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: 1.5px solid #ffffff; background-color: ${spot.color}; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); ${pointerRing}">
            <span style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background-color: ${spot.color}25; animation: pinPulse 2.5s infinite; z-index: -10;"></span>
            ${spot.type === 'light' ? `
              <svg style="width: 14px; height: 14px; color:#ffffff;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
                <path d="M9 18h6"/>
                <path d="M10 22h4"/>
              </svg>
            ` : `
              <svg style="width: 14px; height: 14px; color:#ffffff;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h8"/>
                <path d="M19 13v-3a2 2 0 0 0-2-2h-3v7h5a2 2 0 0 0 2-2Z"/>
                <circle cx="7.5" cy="18.5" r="2.5"/>
                <circle cx="16.5" cy="18.5" r="2.5"/>
              </svg>
            `}
          </div>
        `;

        const divIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-leaflet-marker-pack',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker(spot.geoCoords, { icon: divIcon }).addTo(map);

        const popupContent = `
          <div style="font-family: var(--font-sans, sans-serif); min-width: 180px; padding: 4px;">
            <div style="font-weight: 800; color: #0f172a; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; font-size: 11px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${spot.color};"></span>
              ${spot.title}
            </div>
            <div style="font-size: 10px; color: #475569; border-top: 1px solid #f1f5f9; padding-top: 4px; margin-top: 4px; line-height: 1.33;">
              <strong>Status:</strong> ${spot.status}
            </div>
            <div style="font-size: 8px; font-family: var(--font-mono, monospace); color: #94a3b8; text-transform: uppercase; margin-top: 4px;">
              Colombo GIS • Unit ${spot.id}
            </div>
          </div>
        `;
        marker.bindPopup(popupContent, { closeButton: false, offset: L.point(0, -5) });

        marker.on('click', () => {
          map.setView(spot.geoCoords, 14, { animate: true });
        });

        markersRef.current[`spot-${spot.id}`] = marker;
      });
    });
  }, [mapLoaded, activeLayer, hoveredNode, filteredHotspots]);

  return (
    <div id="dashboard-stage" className="flex-1 p-6 md:p-10 space-y-8 w-full max-w-[1600px] mx-auto z-10">
      
      {/* Background soft highlights */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-slate-100/40 via-transparent to-transparent pointer-events-none -z-10" />

      {/* Hero Header Banner Component */}
      <div id="main-dashboard-banner" className="relative h-44 w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200/80">
        <img 
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&h=500&q=80" 
          alt="Colombo Sri Lanka Skyline Infrastructure Grid Layout" 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4 text-white">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">OPERATIONAL CENTER</span>
              <span>• CMC SUPERVISOR OVERVIEW</span>
            </div>
            <h1 className="font-sans font-black text-2xl md:text-3xl text-white tracking-tight leading-none">
              Colombo MC Command Suite
            </h1>
            <p className="font-sans text-xs text-slate-300 max-w-xl">
              Unified GIS telemetry mapping for Lanka Electricity Company grids, Abans & Cleantech sweep tracks, and automated SLA warnings.
            </p>
          </div>

          {/* Master Clock Widget nested inside banner for gorgeous telemetry integration */}
          <div className="flex items-center gap-3.5 px-4 py-2 rounded-xl border border-white/10 bg-black/30 backdrop-blur-md self-start md:self-auto">
            <div className="flex flex-col items-end">
              <span className="font-mono text-lg font-black tracking-wider text-emerald-450 text-emerald-400" id="clock-ticker">
                {currentTime}
              </span>
              <span className="font-sans text-[9px] text-slate-350 font-bold uppercase tracking-wider">
                {currentDate}
              </span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div className="p-1.5 bg-white/10 rounded-lg text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Row of 4 KPI cards with bright custom styling */}
      <div id="kpi-cards-row" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Total Open Complaints */}
        <motion.div 
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-36" 
          id="kpi-open-complaints"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-450 tracking-wider uppercase font-bold">Total Open Complaints</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-650 flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-mono text-3xl font-black text-slate-900 tracking-tight">142</div>
            <p className="font-sans text-[11px] text-slate-550 mt-1">
              Active citizen logs requiring oversight
            </p>
          </div>
        </motion.div>

        {/* KPI 2: Critical SLA Breaches (Highlighted with soft alerts) */}
        <motion.div 
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/40 p-5 flex flex-col justify-between h-36 shadow-xs" 
          id="kpi-sla-breaches"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-rose-700 tracking-wider uppercase font-bold">Critical SLA Breaches</span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-mono text-3xl font-black text-rose-800 tracking-tight">3</div>
            <p className="font-sans text-[11px] text-rose-650 font-medium mt-1">
              Immediate maintenance action requested
            </p>
          </div>
        </motion.div>

        {/* KPI 3: Active Garbage Trucks */}
        <motion.div 
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-36" 
          id="kpi-active-garbage"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-450 tracking-wider uppercase font-bold">Active Garbage Trucks</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-650 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-mono text-3xl font-black text-slate-900 tracking-tight">
              8<span className="text-sm font-sans font-normal text-slate-500 ml-1">/ 12 active</span>
            </div>
            <p className="font-sans text-[11px] text-slate-550 mt-1">
              Solid waste fleet deployed in field
            </p>
          </div>
        </motion.div>

        {/* KPI 4: Total Resolved Today */}
        <motion.div 
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-36" 
          id="kpi-total-resolved"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-450 tracking-wider uppercase font-bold">Total Resolved Today</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-650 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-mono text-3xl font-black text-emerald-700 tracking-tight">49</div>
            <p className="font-sans text-[11px] text-emerald-600 mt-1">
              Incidents closed by crew contractors
            </p>
          </div>
        </motion.div>

      </div>

      {/* ArcGIS Map Container (Bright Blueprint Style) */}
      <div id="arcgis-map-container" className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
        
        {/* Map Header Panel */}
        <div id="map-header-overlay" className="absolute top-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 z-20 pointer-events-none">
          
          {/* Legend and coordinates */}
          <div className="bg-white/95 backdrop-blur-md py-2 px-3.5 rounded-xl border border-slate-200 flex items-center gap-3 self-start pointer-events-auto shadow-xs">
            <Compass className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
            <div>
              <span className="font-sans font-bold text-[11px] text-slate-900 block">ArcGIS Pro CMC Unified Map</span>
              <span className="font-mono text-[9px] text-slate-400 tracking-wider block">Colombo 01–15 • 6.9271° N, 79.8612° E</span>
            </div>
          </div>

          {/* Layer Controls */}
          <div className="flex items-center gap-2 self-start sm:self-center pointer-events-auto">
            <div className="bg-slate-100/90 backdrop-blur-md p-1 rounded-xl border border-slate-200/60 flex gap-1 shadow-xs">
              <button
                id="btn-map-all"
                onClick={() => setActiveLayer('all')}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase font-mono tracking-wide cursor-pointer transition-all ${
                  activeLayer === 'all' 
                    ? 'bg-white text-slate-900 border border-slate-200 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All Nodes
              </button>
              <button
                id="btn-map-lights"
                onClick={() => setActiveLayer('lights')}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase font-mono tracking-wide cursor-pointer transition-all ${
                  activeLayer === 'lights' 
                    ? 'bg-white text-slate-900 border border-slate-200 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Lights Grid
              </button>
              <button
                id="btn-map-trucks"
                onClick={() => setActiveLayer('trucks')}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase font-mono tracking-wide cursor-pointer transition-all ${
                  activeLayer === 'trucks' 
                    ? 'bg-white text-slate-900 border border-slate-200 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Waste Fleet
              </button>
            </div>
          </div>
              {/* Dynamic Leaflet Map Area */}
        <div className="relative w-full h-[460px] bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100 z-10">
          <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />
          
          {/* Custom style injection for clean pin pulsing and layout keyframes */}
          <style dangerouslySetInnerHTML={{ __html: `
            .custom-leaflet-marker-pack {
              background: transparent !important;
              border: none !important;
            }
            @keyframes pinPulse {
              0% { transform: scale(0.9); opacity: 0.8; }
              50% { transform: scale(1.1); opacity: 0.4; }
              100% { transform: scale(0.9); opacity: 0.8; }
            }
            .leaflet-container {
              background: #f1f5f9 !important;
              font-family: inherit !important;
            }
            .leaflet-bar {
              border: 1px solid #e2e8f0 !important;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
              border-radius: 12px !important;
              overflow: hidden;
            }
          ` }} />

          {/* Prompt to click / drag */}
          <div className="absolute bottom-4 left-4 pointer-events-none flex items-center gap-2 z-10">
            <div className="text-[10px] font-mono py-1 px-2.5 border border-slate-200 bg-white/90 text-slate-500 rounded-lg shadow-sm">
              Use drag and zoom to explore Colombo live nodes
            </div>
          </div>
        </div>    </div>
      </div>

      {/* Feature Split Layout: Quick Report Promotion & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Split Left: Action Callouts & Unsplash visual preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="font-sans font-black text-slate-900 text-lg">Citizen Quick Action</h3>
            <p className="font-sans text-xs text-slate-500 leading-relaxed">
              Scan-capable, client-side automated report telemetry is ready for testing. Citizens can click to pre-fill device GPS attributes instantly.
            </p>
            
            {/* Maintenance Truck Visual Aspect */}
            <div className="relative h-32 w-full rounded-xl overflow-hidden border border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=600&h=250&q=80" 
                alt="City Infrastructure Maintenance Truck" 
                className="w-full h-full object-cover grayscale brightness-95 filter hover:grayscale-0 transition-all duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              <div className="absolute bottom-3 left-3 text-[10px] font-mono text-white opacity-90 uppercase tracking-widest font-bold">
                Abans & Cleantech CMC Contractors
              </div>
            </div>

            <Link 
              href="/citizen-report" 
              className="mt-2 w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 hover:shadow-xs active:scale-[0.99] text-white font-sans font-bold text-xs uppercase tracking-wider transition-all"
            >
              Test Mobile Citizen Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Split Right: Recent Activity Live Log */}
        <div id="recent-activity-panel" className="lg:col-span-7 bg-white border border-slate-200/90 p-6 rounded-2xl flex flex-col space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h2 className="font-sans font-black text-lg text-slate-900 flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-emerald-600" />
                Recent Activity Feed
              </h2>
              <p className="font-sans text-xs text-slate-450">Broadcasting active system logs and department overrides</p>
            </div>
            <div>
              <span className="px-2.5 py-0.5 bg-slate-50 border border-slate-200 text-[9px] font-mono text-slate-500 font-bold rounded-full">
                COUNCIL LIVE LOGS
              </span>
            </div>
          </div>

          {/* Stream of 5 Actions */}
          <div className="divide-y divide-slate-100" id="activity-feed">
            {activities.map((act) => (
              <div key={act.id} className="py-3.5 flex gap-4 items-start group hover:bg-slate-50/50 transition-all px-2 rounded-xl">
                
                {/* Module specifier Icon */}
                <div className={`p-2.5 rounded-xl border z-10 flex-shrink-0 ${
                  act.module === 'street-lights' 
                    ? 'bg-amber-50 border-amber-100 text-amber-700' 
                    : act.module === 'waste' 
                    ? 'bg-indigo-50 border-indigo-100 text-indigo-700' 
                    : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                }`}>
                  {act.module === 'street-lights' ? (
                    <Lightbulb className="w-4 h-4" />
                  ) : act.module === 'waste' ? (
                    <Truck className="w-4 h-4" />
                  ) : (
                    <Building2 className="w-4 h-4" />
                  )}
                </div>

                {/* Title & Description of Activity */}
                <div className="flex-1 space-y-0.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="font-sans font-bold text-sm text-slate-800 group-hover:text-slate-900 transition-colors">
                      {act.title}
                    </h4>
                    <span className="font-mono text-[10px] text-slate-400">
                      {act.time}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-slate-500 leading-normal">
                    {act.description}
                  </p>
                </div>

                {/* Status indicator pill */}
                <div className="self-center hidden sm:block">
                  {act.status === 'success' ? (
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                      RESOLVED
                    </span>
                  ) : act.status === 'warning' ? (
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                      DISPATCHED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-slate-100 text-slate-600 rounded-full border border-slate-205 border-slate-200">
                      AUTOMATION
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation jump-button */}
          <div className="pt-2 flex items-center justify-end">
            <Link 
              href="/street-lights" 
              className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-600 font-bold"
            >
              Manage Operations Grid <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
