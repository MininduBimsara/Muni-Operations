'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lightbulb, 
  Zap, 
  Sun, 
  AlertTriangle,
  Power,
  RotateCcw,
  Search,
  Filter,
  Clock,
  ShieldAlert,
  AlertOctagon,
  Wrench,
  X,
  MapPin,
  Compass,
  Sliders,
  Map,
  Cpu,
  Calendar,
  Layers,
  Check,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  lightsCount: number;
  dimmingPercent: number;
  status: 'NOMINAL' | 'OVERLOAD' | 'FAULT';
  efficiencyRating: string;
  schedulerActive: boolean;
}

interface Complaint {
  id: string;
  subject: string;
  location: string;
  reportedDate: string; // ISO format
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  contractor: string;
}

interface MapPinItem {
  id: string;
  location: string;
  installDate: string;
  status: 'WORKING' | 'BROKEN';
  hardwareSpecs: string;
  slaCountdown?: string;
  coordinates: { x: number; y: number };
  geoCoords?: [number, number];
}

export default function Streetlights() {
  // --- STATE FOR VIEW SELECTION ---
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'MAP'>('MAP'); // Defaulting to MAP as requested for prominent showcase

  // --- STATE FOR LUMIN CONTROLLERS ---
  const [zones, setZones] = useState<Zone[]>([
    { id: 'zone-1', name: 'Zone 1 - Galle Face & Colombo Fort Core', lightsCount: 2450, dimmingPercent: 80, status: 'NOMINAL', efficiencyRating: 'A+', schedulerActive: true },
    { id: 'zone-2', name: 'Zone 2 - Kollupitiya & Bambalapitiya Residential', lightsCount: 1800, dimmingPercent: 50, status: 'NOMINAL', efficiencyRating: 'A', schedulerActive: true },
    { id: 'zone-3', name: 'Zone 3 - Orugodawatta & Grandpass Industrial Corridor', lightsCount: 3100, dimmingPercent: 100, status: 'FAULT', efficiencyRating: 'B', schedulerActive: false },
    { id: 'zone-4', name: 'Zone 4 - Marine Drive Coastal Promenade', lightsCount: 1150, dimmingPercent: 90, status: 'NOMINAL', efficiencyRating: 'A++', schedulerActive: true },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [generalOverride, setGeneralOverride] = useState(false);

  // --- COMPLAINTS TELEMETRY TABLE STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [contractorFilter, setContractorFilter] = useState<string>('ALL');
  
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: 'LGT-742',
      subject: 'Full block blackout - high-voltage cable cut during Nelum Tower pathway digging',
      location: 'Duplication Road, Colombo 03',
      reportedDate: '2026-06-11T14:30:00-07:00',
      status: 'PENDING',
      contractor: 'Ceylon Electricity Board (CEB)',
    },
    {
      id: 'LGT-491',
      subject: 'Photocell flickering cycle on fixture #82 near Viharamahadevi Park',
      location: 'Albert Crescent, Colombo 07',
      reportedDate: '2026-06-14T09:12:00-07:00',
      status: 'IN_PROGRESS',
      contractor: 'Lanka Electricity Company (LECO)',
    },
    {
      id: 'LGT-305',
      subject: 'Damaged substation transformer casing from heavy monsoon branch fall',
      location: 'Orugodawatta Industrial Road, Colombo 14',
      reportedDate: '2026-06-10T20:45:00-07:00',
      status: 'PENDING',
      contractor: 'Ceylon Electricity Board (CEB)',
    },
    {
      id: 'LGT-812',
      subject: 'Sub-surface water damage short circuit on coastal light pole',
      location: 'Marine Drive Promenade, Kollupitiya',
      reportedDate: '2026-06-15T18:22:00-07:00',
      status: 'RESOLVED',
      contractor: 'CMC Municipal Engineers',
    },
    {
      id: 'LGT-219',
      subject: 'Sub-station low voltage spike warning near Pettah Main Bazaar',
      location: 'Keyzer Street, Pettah',
      reportedDate: '2026-06-12T01:00:00-07:00',
      status: 'IN_PROGRESS',
      contractor: 'Lanka Electricity Company (LECO)',
    },
    {
      id: 'LGT-903',
      subject: 'High priority solar photocell replacement for LED cluster',
      location: 'Bauddhaloka Mawatha, Colombo 07',
      reportedDate: '2026-06-15T10:00:00-07:00',
      status: 'PENDING',
      contractor: 'CMC Municipal Engineers',
    },
  ]);

  // --- STATE FOR INTERACTIVE COMPREHENSIVE ARCGIS MAP PINS ---
  const [mapPins, setMapPins] = useState<MapPinItem[]>([
    {
      id: 'LGT-742',
      location: 'Duplication Road, Colombo 03 (Near Liberty Plaza)',
      installDate: 'Nov 12, 2522',
      status: 'BROKEN',
      hardwareSpecs: '150W Smart HPS Retrofit - Grid Series',
      slaCountdown: '12h 45m remaining',
      coordinates: { x: 38, y: 55 },
      geoCoords: [6.9135, 79.8525]
    },
    {
      id: 'LGT-812',
      location: 'Marine Drive Promenade, Kollupitiya',
      installDate: 'Oct 01, 2025',
      status: 'WORKING',
      hardwareSpecs: '75W Marine LED Wave Sensor Node',
      coordinates: { x: 22, y: 78 },
      geoCoords: [6.9068, 79.8495]
    },
    {
      id: 'LGT-305',
      location: 'Orugodawatta Industrial Road, Colombo 14',
      installDate: 'Jun 18, 2021',
      status: 'BROKEN',
      hardwareSpecs: '200W Heavy Industrial Smart LED Lamp',
      slaCountdown: '05h 18m remaining',
      coordinates: { x: 78, y: 28 },
      geoCoords: [6.9412, 79.8810]
    },
    {
      id: 'LGT-491',
      location: 'Albert Crescent, Colombo 07 (Viharamahadevi Gate)',
      installDate: 'May 22, 2023',
      status: 'BROKEN',
      hardwareSpecs: '50W High-Efficiency LED Panel v4',
      slaCountdown: '41h 05m remaining',
      coordinates: { x: 58, y: 44 },
      geoCoords: [6.9185, 79.8615]
    },
    {
      id: 'LGT-CMC-012',
      location: 'Galle Face Green Promenade, Colombo 03',
      installDate: 'Mar 15, 2024',
      status: 'WORKING',
      hardwareSpecs: '100W Smart LED - Solar Dimming Node',
      coordinates: { x: 15, y: 35 },
      geoCoords: [6.9290, 79.8438]
    },
    {
      id: 'LGT-903',
      location: 'Bauddhaloka Mawatha, Colombo 07',
      installDate: 'Apr 09, 2024',
      status: 'BROKEN',
      hardwareSpecs: '50W Solar photocell Node Grid v2',
      slaCountdown: '32h 20m remaining',
      coordinates: { x: 50, y: 70 },
      geoCoords: [6.9015, 79.8685]
    },
    {
      id: 'LGT-CMC-045',
      location: 'Lotus Road, Colombo 01 (Fort Central Area)',
      installDate: 'Aug 14, 2023',
      status: 'WORKING',
      hardwareSpecs: '120W High-Density LED Matrix Spot',
      coordinates: { x: 42, y: 18 },
      geoCoords: [6.9348, 79.8425]
    }
  ]);

  const [selectedPinId, setSelectedPinId] = useState<string | null>('LGT-742'); // Pre-selecting the broken Galle Road pin for strong initial presentation
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);

  // --- ARCGIS LEAFLET MAP STATE REFERENCES ---
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = React.useRef<HTMLDivElement | null>(null);
  const leafletMapInstanceRef = React.useRef<any>(null);
  const markersRef = React.useRef<{ [key: string]: any }>({});

  // Dynamic ArcGIS Leaflet Map bootstrapping
  React.useEffect(() => {
    if (activeTab !== 'MAP') return;

    // Inject Leaflet core styling
    if (!document.getElementById('leaflet-css-pack')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-pack';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    let isMounted = true;
    let mapInstance: any = null;

    // Wait until elements are fully painted
    const initTimer = setTimeout(() => {
      import('leaflet').then((L) => {
        if (!isMounted || !mapRef.current) return;

        // Cleanup stale instances on same ref
        if (leafletMapInstanceRef.current) {
          try {
            leafletMapInstanceRef.current.remove();
          } catch (e) {
            console.warn('Map cleanup message:', e);
          }
        }

        // Initialize map centered at Colombo Central
        mapInstance = L.map(mapRef.current, {
          zoomControl: false,
          maxBounds: [
            [6.83, 79.80],
            [6.98, 79.92]
          ],
          attributionControl: true
        }).setView([6.9185, 79.8550], 13.5);

        leafletMapInstanceRef.current = mapInstance;

        // Esri ArcGIS Street base tile layer
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 18,
          minZoom: 12,
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom'
        }).addTo(mapInstance);

        // Add client zoom control in a clean top-right placement
        L.control.zoom({ position: 'topright' }).addTo(mapInstance);

        setMapLoaded(true);
      }).catch((err) => {
        console.error('Failed to load Leaflet module:', err);
      });
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(initTimer);
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch (e) {
          // ignore
        }
        leafletMapInstanceRef.current = null;
        setMapLoaded(false);
      }
    };
  }, [activeTab]);

  // Synchronise leaflet pins with React state mapPins and selected markers
  React.useEffect(() => {
    if (!mapLoaded || !leafletMapInstanceRef.current) return;
    const map = leafletMapInstanceRef.current;

    // Clear previous markers
    Object.values(markersRef.current).forEach((marker: any) => {
      try {
        map.removeLayer(marker);
      } catch (e) {
        // ignore
      }
    });
    markersRef.current = {};

    import('leaflet').then((L) => {
      mapPins.forEach((pin) => {
        const isWorking = pin.status === 'WORKING';
        const isSelected = selectedPinId === pin.id;

        const customIconClass = isWorking 
          ? 'bg-emerald-500 border-emerald-400 text-white' 
          : 'bg-rose-500 border-rose-400 text-white';

        const pulseStyle = !isWorking 
          ? '<span style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background-color: rgba(239, 68, 68, 0.45); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; z-index: -10;"></span>' 
          : (isSelected ? '<span style="position: absolute; width: 30px; height: 30px; border-radius: 9999px; background-color: rgba(16, 185, 129, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; z-index: -10;"></span>' : '');

        const selectedRing = isSelected 
          ? 'box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.25); transform: scale(1.2); filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.15)); z-index: 999 !important;' 
          : 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); hover:scale-115;';

        const iconHtml = `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 12px; border: 1.5px solid; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); ${selectedRing}" class="${customIconClass}">
            ${pulseStyle}
            <svg style="width: 14px; height: 14px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
              <path d="M9 18h6"/>
              <path d="M10 22h4"/>
            </svg>
          </div>
        `;

        const divIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-leaflet-marker-wrapper',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const latLng = pin.geoCoords || [6.9271, 79.8612];
        const marker = L.marker(latLng, { icon: divIcon }).addTo(map);

        marker.on('click', () => {
          setSelectedPinId(pin.id);
          // Gently pan over slightly to the left of focal coordinate to ensure the right detail panel doesn't block the visual focus
          map.setView([latLng[0], latLng[1] - 0.0025], 15, { animate: true, duration: 1.0 });
        });

        markersRef.current[pin.id] = marker;
      });
    });
  }, [mapLoaded, mapPins, selectedPinId]);

  // Center on a pin if selected externally
  React.useEffect(() => {
    if (!mapLoaded || !selectedPinId || !leafletMapInstanceRef.current) return;
    const matchedPin = mapPins.find(p => p.id === selectedPinId);
    if (matchedPin && matchedPin.geoCoords) {
      leafletMapInstanceRef.current.setView([matchedPin.geoCoords[0], matchedPin.geoCoords[1] - 0.0025], 15, { animate: true, duration: 1.0 });
    }
  }, [selectedPinId, mapLoaded, mapPins]);

  // Handle flying with map flyTo utility
  const flyToCoordinates = (latLng: [number, number], zoom = 15) => {
    if (leafletMapInstanceRef.current) {
      leafletMapInstanceRef.current.setView([latLng[0], latLng[1] - 0.0015], zoom, { animate: true, duration: 1.2 });
    }
  };

  // Current system local anchor time: June 15, 2026 
  const anchorTime = new Date('2026-06-15T21:45:18-07:00').getTime();

  const isSlaBreached = (reportedDateStr: string, status: string) => {
    if (status === 'RESOLVED') return false;
    const diffMs = anchorTime - new Date(reportedDateStr).getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours > 48;
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Dispatch emergency repair crew from either list or map view
  const handleDispatchCrewFromMap = (pinId: string) => {
    setDispatchingId(pinId);
    
    // Simulate real world communication delay
    setTimeout(() => {
      // 1. Update the interactive map pin state to Working
      setMapPins(prev => prev.map(p => {
        if (p.id === pinId) {
          return {
            ...p,
            status: 'WORKING',
            slaCountdown: undefined
          };
        }
        return p;
      }));

      // 2. Sync corresponding list complaint table record to RESOLVED
      setComplaints(prev => prev.map(c => {
        if (c.id === pinId) {
          return {
            ...c,
            status: 'RESOLVED',
            contractor: 'Ceylon Electricity Board (CEB)'
          };
        }
        return c;
      }));

      setDispatchingId(null);
      
      const pinObj = mapPins.find(p => p.id === pinId);
      if (pinObj) {
        showToast(`CEB Emergency Maintenance dispatched to ${pinObj.location}. Telemetry updated.`);
      }
    }, 1250);
  };

  const handleUpdateStatus = (id: string, newStatus: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED') => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          showToast(`Complaint ${id} status updated to ${newStatus}`);
          
          // Also sync with map pins status if matched
          setMapPins(mPrev => mPrev.map(p => {
            if (p.id === id) {
              return {
                ...p,
                status: newStatus === 'RESOLVED' ? 'WORKING' : 'BROKEN'
              };
            }
            return p;
          }));

          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  const handleReassignContractor = (id: string, newContractor: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          showToast(`Assigned ${newContractor} to incident ${id}`);
          return { ...c, contractor: newContractor };
        }
        return c;
      })
    );
  };

  const handleDimmingChange = (zoneId: string, val: number) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          return { ...z, dimmingPercent: val };
        }
        return z;
      })
    );
  };

  const toggleScheduler = (zoneId: string) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const newState = !z.schedulerActive;
          showToast(`Dynamic photometrics scheduling ${newState ? 'ENGAGED' : 'PAUSED'} for ${z.name}`);
          return { ...z, schedulerActive: newState };
        }
        return z;
      })
    );
  };

  const resolveZoneFault = (zoneId: string) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          showToast(`Sending dynamic capacitor-restart pulse to high-voltage grid on ${z.name}`);
          return { ...z, status: 'NOMINAL' };
        }
        return z;
      })
    );
  };

  const triggerAbsoluteSafetyOverride = () => {
    const isActivating = !generalOverride;
    setGeneralOverride(isActivating);
    
    setZones((prev) =>
      prev.map((z) => ({
        ...z,
        dimmingPercent: isActivating ? 100 : 70,
        schedulerActive: !isActivating,
      }))
    );

    showToast(
      isActivating 
        ? 'OVERRIDE ENGAGED: Forcing 100% luminous flux across municipal grids!' 
        : 'Emergency safety override revoked. Standard scheduler configurations restored.'
    );
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const matchesContractor = contractorFilter === 'ALL' || c.contractor === contractorFilter;

      return matchesSearch && matchesStatus && matchesContractor;
    });
  }, [complaints, searchQuery, statusFilter, contractorFilter]);

  const selectedPin = useMemo(() => {
    return mapPins.find(p => p.id === selectedPinId);
  }, [mapPins, selectedPinId]);

  const contractors = ['Ceylon Electricity Board (CEB)', 'Lanka Electricity Company (LECO)', 'CMC Municipal Engineers', 'Abans Engineering Services'];

  return (
    <div id="streetlights-grid-stage" className="flex-1 p-6 md:p-10 space-y-8 w-full max-w-[1600px] mx-auto z-10">
      
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 px-4 py-3 rounded-xl border border-emerald-250 border-emerald-200 bg-white text-emerald-800 text-xs font-sans font-bold shadow-xl flex items-center gap-3 z-50"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header and Controls Row */}
      <div id="streetlight-page-header" className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-emerald-700 uppercase font-black">
            <span>GRID SUPERVISION</span>
            <span>•</span>
            <span>DUAL OPERATIONS CONSOLE</span>
          </div>
          <h1 className="font-sans font-black text-2xl md:text-3xl text-slate-900 tracking-tight">
            Street Light Management
          </h1>
          <p className="font-sans text-xs text-slate-500 max-w-xl">
            Audit high-priority lighting complaints, identify SLA violations, and program automated luminosity parameters.
          </p>
        </div>

        {/* Global Override Action Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            id="emergency-override-btn"
            onClick={triggerAbsoluteSafetyOverride}
            className={`px-4 py-2.5 rounded-xl border text-xs font-sans font-bold uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-xs ${
              generalOverride 
                ? 'bg-rose-50 border-rose-200 hover:bg-rose-100 text-rose-700 shadow-rose-250/10'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <Power className="w-4 h-4" />
            {generalOverride ? 'TERMINATE OVERRIDE' : 'FORCE MAX OVERRIDE'}
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Violations */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-rose-50 rounded-lg text-rose-700 border border-rose-100">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <span className="font-sans text-[10px] text-slate-400 font-bold tracking-wider block uppercase">Violations Outstanding</span>
            <span className="font-mono text-lg font-black text-rose-800">
              {complaints.filter((c) => isSlaBreached(c.reportedDate, c.status)).length} SLA Alarms
            </span>
          </div>
        </div>

        {/* Average Lumens */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-700 border border-amber-100">
            <Lightbulb className="w-5 h-5 animate-pulse" style={{ animationDuration: '4s' }} />
          </div>
          <div className="space-y-0.5">
            <span className="font-sans text-[10px] text-slate-400 font-bold tracking-wider block uppercase">Average Lumens Index</span>
            <span className="font-mono text-lg font-black text-slate-800">80% Target Flux</span>
          </div>
        </div>

        {/* Savings Factor */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700 border border-emerald-100">
            <Zap className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="font-sans text-[10px] text-slate-400 font-bold tracking-wider block uppercase">Energy Savings Factor</span>
            <span className="font-mono text-lg font-black text-emerald-700">12.8 kW/h Realtime</span>
          </div>
        </div>

        {/* Assigned Contractors */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-sky-50 rounded-lg text-sky-700 border border-sky-100">
            <Wrench className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="font-sans text-[10px] text-slate-400 font-bold tracking-wider block uppercase">Assigned Contractors</span>
            <span className="font-mono text-lg font-black text-slate-800">4 Core Partners</span>
          </div>
        </div>
      </div>

      {/* Visually Stunning Segmented Tab Controls */}
      <div className="flex border-b border-slate-200" id="management-views-tabs">
        <button
          onClick={() => setActiveTab('MAP')}
          className={`pb-3.5 text-xs font-sans font-black tracking-widest uppercase transition-all border-b-2.5 px-6 flex items-center gap-2.5 cursor-pointer ${
            activeTab === 'MAP'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Compass className="w-4.5 h-4.5" />
          ARCGIS Interactive Map View
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold ml-1">Live</span>
        </button>

        <button
          onClick={() => setActiveTab('TELEMETRY')}
          className={`pb-3.5 text-xs font-sans font-black tracking-widest uppercase transition-all border-b-2.5 px-6 flex items-center gap-2.5 cursor-pointer ${
            activeTab === 'TELEMETRY'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Sliders className="w-4.5 h-4.5" />
          List Registry & Grid Zones
        </button>
      </div>

      {/* TAB 1: INTERACTIVE ARCGIS MAP VIEW (CINEMATIC DESIGN WITH DETAILED SLIDE PANEL) */}
      {activeTab === 'MAP' && (
        <div className="space-y-5 animate-fadeIn" id="arcgis-map-view-block">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-2">
            <div className="space-y-0.5">
              <h2 className="font-sans font-extrabold text-base text-slate-905 text-slate-900 flex items-center gap-2">
                <Map className="w-5 h-5 text-emerald-600" />
                ArcGIS Pro Photometrics Network Map
              </h2>
              <p className="font-sans text-xs text-slate-500">
                Click on any colored streetlight node pin below to inspect physical specifications, active SLA status constraints, and mobilize field support.
              </p>
            </div>
            
            <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-lg self-start">
              <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>COLOMBO BOUNDARIES (ZONE 1-4)</span>
            </div>
          </div>

          {/* Custom style overrides for Leaflet elements inside this screen */}
          <style dangerouslySetInnerHTML={{ __html: `
            .custom-leaflet-marker-wrapper {
              background: transparent !important;
              border: none !important;
            }
            .leaflet-container {
              font-family: inherit !important;
              background: #f8fafc !important;
            }
            .leaflet-bar {
              border: 1px solid #cbd5e1 !important;
              box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08) !important;
              border-radius: 12px !important;
              overflow: hidden;
            }
            .leaflet-bar a {
              background-color: #ffffff !important;
              border-bottom: 1px solid #f1f5f9 !important;
              color: #475569 !important;
              transition: all 0.2s;
            }
            .leaflet-bar a:hover {
              background-color: #f8fafc !important;
              color: #0f172a !important;
            }
          ` }} />

          {/* LARGE SATELLITE MAP CONTAINER PLATFORM (ARCGIS LEAFLET) */}
          <div className="relative w-full h-[650px] bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-lg flex" id="arcgis-satellite-platform">
            
            {/* Actively loaded Leaflet Map container element */}
            <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />

            {/* Simulated Radar Compass/Overlay indicators */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-2">
              <div className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-md flex items-center gap-3 pointer-events-auto shadow-md">
                <Compass className="w-5 h-5 text-emerald-600 animate-spin" style={{ animationDuration: '10s' }} />
                <div>
                  <span className="font-sans font-black text-xs text-slate-800 block flex items-center gap-1.5 leading-none mb-1">
                    ArcGIS GIS Map Portal
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </span>
                  <span className="font-mono text-[9px] text-emerald-700 tracking-wider block font-bold">EPSG:3857 • Live Leaflet API</span>
                </div>
              </div>

              {/* High-quality Quick Focal Point Flight Deck */}
              <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 border border-slate-250 border-slate-200 rounded-xl shadow-md overflow-x-auto max-w-[340px] sm:max-w-none">
                <span className="font-sans font-black text-[9px] text-slate-400 uppercase tracking-widest px-2 pr-1 select-none">Fly To:</span>
                <button
                  onClick={() => flyToCoordinates([6.9290, 79.8438])}
                  className="px-2.5 py-1 text-[10px] font-sans font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors whitespace-nowrap"
                >
                  Galle Face
                </button>
                <button
                  onClick={() => flyToCoordinates([6.9348, 79.8425])}
                  className="px-2.5 py-1 text-[10px] font-sans font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors whitespace-nowrap"
                >
                  Fort Core
                </button>
                <button
                  onClick={() => flyToCoordinates([6.9185, 79.8615])}
                  className="px-2.5 py-1 text-[10px] font-sans font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors whitespace-nowrap"
                >
                  Park Gate
                </button>
                <button
                  onClick={() => flyToCoordinates([6.9412, 79.8810])}
                  className="px-2.5 py-1 text-[10px] font-sans font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors whitespace-nowrap"
                >
                  Orugodawatta
                </button>
              </div>
            </div>

            {/* Float Legend card inside map */}
            <div className="absolute bottom-4 left-4 z-10 pointer-events-auto p-4 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-md max-w-[195px]" id="widget-map-legend">
              <h4 className="font-sans font-black text-[10px] text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b pb-1.5">
                <Sliders className="w-3 h-3 text-slate-400" /> MAP PARAMETERS
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                  <span className="font-sans font-bold text-slate-700 text-[10px] uppercase">Node Working</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500 ring-4 ring-rose-500/20" />
                  <span className="font-sans font-bold text-slate-700 text-[10px] uppercase">SLA Breached</span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between font-mono text-[9px] text-slate-400 font-bold">
                  <span>DEPLOYED NODES:</span>
                  <span className="text-slate-800">{mapPins.length} ACTIVE</span>
                </div>
              </div>
            </div>

            {/* DETAILED STREET LIGHT DETAILS PANEL (FRAMER MOTION SLIDE-IN FROM RIGHT) */}
            <AnimatePresence>
              {selectedPin && (
                <motion.div
                  initial={{ x: '100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '100%', opacity: 0 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                  className="absolute top-0 right-0 h-full w-full sm:w-[390px] bg-white border-l border-slate-200 shadow-2xl z-20 flex flex-col pointer-events-auto"
                  id="streetlight-slideout-telemetry"
                >
                  
                  {/* Detailed Panel Header */}
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-400 tracking-wider font-extrabold uppercase">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-150 text-emerald-800 font-black">ArcGIS NODE</span>
                        <span>•</span>
                        <span>CMC CONTROL</span>
                      </div>
                      <h3 className="font-sans font-black text-base text-slate-900">
                        Node Telemetry: {selectedPin.id}
                      </h3>
                    </div>
                    
                    <button
                      onClick={() => setSelectedPinId(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Close readout panel"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Panel scrollable content info grids */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* Status overview card */}
                    <div className={`p-4 rounded-xl border flex items-center gap-3.5 shadow-sm transition-all ${
                      selectedPin.status === 'WORKING'
                        ? 'bg-emerald-50/40 border-emerald-100 text-emerald-800'
                        : 'bg-rose-50/40 border-rose-100 text-rose-800'
                    }`}>
                      <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 border ${
                        selectedPin.status === 'WORKING'
                          ? 'bg-white border-emerald-200 text-emerald-600'
                          : 'bg-white border-rose-200 text-rose-600'
                      }`}>
                        <Lightbulb className={`w-5 h-5 ${selectedPin.status === 'BROKEN' ? 'animate-pulse' : ''}`} />
                      </div>
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Node Operational Status</span>
                        <span className="font-sans font-black text-xs uppercase tracking-tight block">
                          {selectedPin.status === 'WORKING' ? 'Nominal / Working' : 'SLA Breached / Broken'}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Specifications table form */}
                    <div className="space-y-3">
                      <h4 className="font-sans font-black text-[10px] text-slate-450 uppercase tracking-widest flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-slate-400" />
                        Hardware & Node Profiling
                      </h4>

                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/30 shadow-xs">
                        
                        {/* Geo Location coordinates info */}
                        <div className="p-3.5 flex flex-col gap-1">
                          <span className="font-mono text-[9px] text-slate-400 uppercase font-black">Exact Street Location</span>
                          <span className="font-sans text-xs text-slate-800 font-bold flex items-start gap-1.5 leading-normal">
                            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            {selectedPin.location}
                          </span>
                        </div>

                        {/* Installation Date info */}
                        <div className="p-3.5 flex flex-col gap-1">
                          <span className="font-mono text-[9px] text-slate-400 uppercase font-black">Commissioning Date</span>
                          <span className="font-sans text-xs text-slate-800 font-bold flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                            {selectedPin.installDate}
                          </span>
                        </div>

                        {/* Hardware Rating info */}
                        <div className="p-3.5 flex flex-col gap-1">
                          <span className="font-mono text-[9px] text-slate-400 uppercase font-black">Fixture Specifications</span>
                          <span className="font-sans text-xs text-slate-800 font-bold">
                            {selectedPin.hardwareSpecs}
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* If the current node is broken, provide a warning card containing SLA counts */}
                    {selectedPin.status === 'BROKEN' && (
                      <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/20 space-y-3">
                        <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs uppercase tracking-wider">
                          <Clock className="w-4 h-4 animate-pulse text-rose-600" />
                          SLA Countdown Timer
                        </div>
                        <p className="font-sans text-[11px] text-rose-700/90 leading-relaxed font-semibold">
                          High voltage line failure reported. Escalation flags are active. Action is required before central audit registry tracking triggers automatic financial fine bounds.
                        </p>
                        
                        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-between font-mono text-xs font-black text-rose-900">
                          <span>SLA LIMIT:</span>
                          <span className="text-sm font-black text-rose-600 tracking-wider animate-pulse">{selectedPin.slaCountdown}</span>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Panel CTA action buttons */}
                  <div className="p-5 border-t border-slate-100 bg-slate-50/55 flex flex-col gap-2.5">
                    {selectedPin.status === 'BROKEN' ? (
                      <button
                        onClick={() => handleDispatchCrewFromMap(selectedPin.id)}
                        disabled={dispatchingId === selectedPin.id}
                        className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Wrench className={`w-4 h-4 ${dispatchingId === selectedPin.id ? 'animate-spin' : ''}`} />
                        {dispatchingId === selectedPin.id ? 'DISPATCHING CEB CREW...' : 'DISPATCH MAINTENANCE CREW'}
                      </button>
                    ) : (
                      <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/65 text-emerald-800 text-[11px] font-sans font-black flex items-center justify-center gap-2 leading-none shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        NOMINAL EFFICIENCY MODE ENERGISED
                      </div>
                    )}
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      )}

      {/* TAB 2: ORIGINAL TRADITIONAL LIST REGISTRY & DETAILED CONTROLLERS */}
      {activeTab === 'TELEMETRY' && (
        <div className="space-y-8 animate-fadeIn" id="traditional-telemetry-registers-view">
          
          {/* SECTION 1: INTERACTIVE DATA TABLE FOR STREETLIGHT COMPLAINTS */}
          <div id="lights-incident-center" className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col space-y-5 shadow-xs">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                  <ShieldAlert className="w-5 h-5 text-emerald-600" />
                  <h2>High-Priority Lighting Incidents & Complaints</h2>
                </div>
                <p className="font-sans text-xs text-slate-500">
                  Audit reported photo-sensor or sub-surface grid outages. Red lighting indicates SLA breaches beyond the 48-hour threshold.
                </p>
              </div>

              {/* Reset Filters Option */}
              {(searchQuery !== '' || statusFilter !== 'ALL' || contractorFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                    setContractorFilter('ALL');
                    showToast('Incident filters reset.');
                  }}
                  className="px-2.5 py-1 text-[10px] font-mono border border-slate-200 rounded-lg bg-slate-50 text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1.5 transition-colors self-start font-bold animate-pulse"
                >
                  Reset Filters <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* ADVANCED FILTER UTILITY ROWS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-2">
              
              {/* Search bar */}
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID, Address, or Incident Details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-xs font-sans text-slate-800 placeholder-slate-400 transition-all focus:outline-none"
                />
              </div>

              {/* Status Select dropdown */}
              <div className="md:col-span-3 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 hover:border-slate-350 transition-colors">
                <Filter className="w-3.5 h-3.5 text-slate-400 mr-2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs font-sans text-slate-705 text-slate-700 font-semibold w-full focus:outline-none cursor-pointer h-10 py-1"
                >
                  <option value="ALL">All Status States</option>
                  <option value="PENDING">PENDING ALERT</option>
                  <option value="IN_PROGRESS">IN REPAIR</option>
                  <option value="RESOLVED">RESOLVED SUCCESS</option>
                </select>
              </div>

              {/* Contractor selection */}
              <div className="md:col-span-4 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 hover:border-slate-350 transition-colors">
                <Wrench className="w-3.5 h-3.5 text-slate-400 mr-2" />
                <select
                  value={contractorFilter}
                  onChange={(e) => setContractorFilter(e.target.value)}
                  className="bg-transparent text-xs font-sans text-slate-705 text-slate-700 font-semibold w-full focus:outline-none cursor-pointer h-10 py-1"
                >
                  <option value="ALL">All Contractors</option>
                  {contractors.map((contractor) => (
                    <option key={contractor} value={contractor}>
                      {contractor}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* CORE DATA TABLE CONTAINER */}
            <div className="overflow-x-auto" id="incident-data-table-container">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-mono text-[10px] uppercase tracking-wider font-bold">
                    <th className="pb-3.5 pt-2 pl-3">Incident ID</th>
                    <th className="pb-3.5 pt-2">Complaint / Scope</th>
                    <th className="pb-3.5 pt-2">Address / Node</th>
                    <th className="pb-3.5 pt-2">Reported Date</th>
                    <th className="pb-3.5 pt-2">SLA Period</th>
                    <th className="pb-3.5 pt-2">Status</th>
                    <th className="pb-3.5 pt-2 pr-3 text-right">Contractor Assignment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((c) => {
                      const isBreached = isSlaBreached(c.reportedDate, c.status);

                      return (
                        <tr 
                          key={c.id}
                          className={`relative group transition-all duration-155 duration-150 ${
                            isBreached 
                              ? 'bg-rose-50/30 hover:bg-rose-50/50' 
                              : 'hover:bg-slate-50/80'
                          }`}
                          style={{
                            boxShadow: isBreached ? 'inset 3.0px 0 0 #f43f5e' : 'none'
                          }}
                        >
                          {/* ID with red alert badge */}
                          <td className="py-4 pl-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-700">{c.id}</span>
                              {isBreached && (
                                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                              )}
                            </div>
                          </td>

                          {/* Scope Title */}
                          <td className="py-4 max-w-sm">
                            <div className="font-sans text-slate-800 font-bold group-hover:text-slate-1000 transition-colors uppercase tracking-tight">{c.subject}</div>
                          </td>

                          {/* Location Address */}
                          <td className="py-4">
                            <span className="text-slate-500 font-sans font-medium">{c.location}</span>
                          </td>

                          {/* Date reported */}
                          <td className="py-4">
                            <span className="font-mono text-[11px] text-slate-450 font-semibold">
                              {new Date(c.reportedDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </td>

                          {/* SLA alert pill */}
                          <td className="py-4">
                            {isBreached ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider font-mono bg-rose-50 border border-rose-200 text-rose-700 uppercase animate-pulse">
                                SLA BREACHED (+48H)
                              </span>
                            ) : c.status === 'RESOLVED' ? (
                              <span className="text-emerald-750 text-emerald-700 font-mono text-[9px] font-black uppercase bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                MET NOMINAL
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-slate-400 font-mono text-[10px] font-semibold">
                                <Clock className="w-3.5 h-3.5 text-slate-400" /> WITHIN LIMITS
                              </span>
                            )}
                          </td>

                          {/* Status controller select element */}
                          <td className="py-4">
                            <select
                              value={c.status}
                              onChange={(e) => handleUpdateStatus(c.id, e.target.value as any)}
                              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-sans font-bold border cursor-pointer focus:outline-none transition-all ${
                                c.status === 'RESOLVED'
                                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                                  : c.status === 'IN_PROGRESS'
                                  ? 'bg-amber-50 border-amber-100 text-amber-800'
                                  : 'bg-rose-50 border-rose-100 text-rose-800'
                              }`}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="IN_PROGRESS">IN REPAIR</option>
                              <option value="RESOLVED">RESOLVED</option>
                            </select>
                          </td>

                          {/* Contractor reassign row dropdown list */}
                          <td className="py-4 pr-3 text-right">
                            <select
                              value={c.contractor}
                              onChange={(e) => handleReassignContractor(c.id, e.target.value)}
                              className="bg-slate-50 hover:bg-slate-100 text-[11px] font-sans text-slate-700 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer font-semibold max-w-[170px]"
                            >
                              {contractors.map((cont) => (
                                <option key={cont} value={cont}>
                                  {cont}
                                </option>
                              ))}
                            </select>
                          </td>

                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-sans text-sm border-dashed border border-slate-200 rounded-2xl">
                        No active complaint telemetry matched core search parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* SECTION 2: ZONE LUMEN GRAPH & CONTROLLERS (BOTTOM HALF) */}
          <div id="lights-controllers-panel" className="space-y-6">
            <h2 className="font-sans font-extrabold text-xl text-slate-905 text-slate-900 pb-2 border-b border-slate-100">
              Photocell Node Telemetry & Live Zone Controllers
            </h2>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6" id="zones-list">
              {zones.map((zone) => (
                <div 
                  key={zone.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 transition-all duration-300 relative overflow-hidden shadow-xs hover:border-slate-300"
                  id={`zone-card-${zone.id}`}
                >
                  {/* Overload / scheduler alerts */}
                  {zone.status === 'FAULT' ? (
                    <div className="absolute right-0 top-0 text-[10px] px-3 py-1 bg-rose-50 text-rose-700 border-l border-b border-rose-200 uppercase font-mono tracking-widest rounded-bl-lg font-black animate-pulse">
                      GRID FAULT
                    </div>
                  ) : zone.schedulerActive ? (
                    <div className="absolute right-0 top-0 text-[9px] px-3 py-1 bg-emerald-50 text-emerald-808 text-emerald-800 border-l border-b border-emerald-200 uppercase font-mono tracking-wider rounded-bl-lg font-bold">
                      SCHEDULER PROGRAM ACTIVE
                    </div>
                  ) : null}

                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="font-sans font-black text-base text-slate-900">{zone.name}</h3>
                      <p className="font-mono text-xs text-slate-400 font-semibold">
                        Active Fixtures: <strong className="text-slate-605 text-slate-600 font-bold">{zone.lightsCount} fixtures</strong> • Standard Grid Array
                      </p>
                    </div>
                  </div>

                  {/* Slider power controllers */}
                  <div className="my-6 space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-500 flex items-center gap-1.5 font-semibold">
                        <Sun className="w-4 h-4 text-slate-400" /> Lumen Signal level
                      </span>
                      <span className="text-emerald-705 font-bold text-emerald-700">{zone.dimmingPercent}% Flux Output</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        disabled={zone.status === 'FAULT' || generalOverride}
                        value={zone.dimmingPercent}
                        onChange={(e) => handleDimmingChange(zone.id, parseInt(e.target.value))}
                        className="flex-1 accent-emerald-600 bg-slate-100 h-2 rounded-lg cursor-pointer disabled:opacity-30"
                      />
                    </div>
                  </div>

                  {/* Graphical simulation wave bars representing dynamic live dimming metrics */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between mb-5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Interactive Lumen Profile</span>
                    <div className="flex gap-1.5 items-end h-6">
                      <div className="w-3 bg-emerald-500/10 rounded-sm" style={{ height: `${zone.dimmingPercent * 0.2}px` }} />
                      <div className="w-3 bg-emerald-500/25 rounded-sm" style={{ height: `${zone.dimmingPercent * 0.22}px` }} />
                      <div className="w-3 bg-emerald-500/60 rounded-sm animate-pulse" style={{ height: `${zone.dimmingPercent * 0.24}px` }} />
                      <div className="w-3 bg-emerald-500/25 rounded-sm" style={{ height: `${zone.dimmingPercent * 0.22}px` }} />
                      <div className="w-3 bg-emerald-500/10 rounded-sm" style={{ height: `${zone.dimmingPercent * 0.2}px` }} />
                    </div>
                  </div>

                  {/* Status & Options row */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => toggleScheduler(zone.id)}
                      disabled={zone.status === 'FAULT' || generalOverride}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-30 ${
                        zone.schedulerActive 
                          ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-150'
                          : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-705 text-emerald-700'
                      }`}
                    >
                      {zone.schedulerActive ? 'Set manual override' : 'Engage Smart-Dim'}
                    </button>

                    {zone.status === 'FAULT' && (
                      <button
                        onClick={() => resolveZoneFault(zone.id)}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                        Cold-Restart Relay
                      </button>
                    )}

                    <div className="ml-auto flex items-center gap-1 text-[11px]">
                      <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">Rating Factor:</span>
                      <span className="font-mono text-emerald-700 font-extrabold">{zone.efficiencyRating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
