/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Navigation,
  MapPin,
  Flame,
  AlertCircle,
  PlusCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageSquare,
  Wrench,
  Zap,
  Wind,
  SlidersHorizontal,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import {
  TradeType,
  Worker,
  UserLocation,
  OwnerConfig,
  JobRequest,
  PakistanCity,
} from './types';
import {
  OWNER_EMAIL_DEFAULT,
  PAKISTAN_CITIES,
  INITIAL_WORKERS,
} from './data/pakistanData';
import {
  calculateHaversineDistance,
  formatDistance,
  reverseGeocodePakistan,
} from './utils/geo';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { TradeSelector } from './components/TradeSelector';
import { WorkerCard } from './components/WorkerCard';
import { WorkerDetailModal } from './components/WorkerDetailModal';
import { BookJobModal } from './components/BookJobModal';
import { HiddenOwnerModal } from './components/HiddenOwnerModal';
import { LocationPickerModal } from './components/LocationPickerModal';
import { ActiveBookingsModal } from './components/ActiveBookingsModal';
import { RegisterWorkerModal } from './components/RegisterWorkerModal';
import { DirectEmergencyCallBanner } from './components/DirectEmergencyCallBanner';

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // App Language State
  const [isUrdu, setIsUrdu] = useState(false);

  // App Role: Customer or Worker
  const [activeRole, setActiveRole] = useState<'customer' | 'worker'>('customer');

  // Phone Frame mode for Flutter mobile feel
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Owner Config State (Persistent)
  const [ownerConfig, setOwnerConfig] = useState<OwnerConfig>(() => {
    const saved = localStorage.getItem('kaamwala_owner_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      ownerEmail: OWNER_EMAIL_DEFAULT,
      feeSystemEnabled: false, // matches user prompt: bool feeSystemEnabled = false;
      platformFeePkr: 150,
      commissionPercent: 5,
      currentUserEmail: OWNER_EMAIL_DEFAULT, // Pre-authenticated with owner email for VIP access
      secretAccessCode: '7860',
    };
  });

  // Current Pan-Pakistan Location State (No Lahore fixed)
  const [userLocation, setUserLocation] = useState<UserLocation>(() => {
    const saved = localStorage.getItem('kaamwala_user_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    // Default start in Islamabad / Rawalpindi or Karachi (No Lahore fixed!)
    return {
      latitude: 33.6844,
      longitude: 73.0479,
      city: 'Islamabad',
      area: 'F-7 & Blue Area',
      address: 'F-7 Markaz, Islamabad, Federal Capital',
      isGps: false,
    };
  });

  const [isGpsLoading, setIsGpsLoading] = useState(false);

  // Workers state (Persistent + custom additions)
  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem('kaamwala_workers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_WORKERS;
  });

  // Bookings / Job Requests state
  const [bookings, setBookings] = useState<JobRequest[]>(() => {
    const saved = localStorage.getItem('kaamwala_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'job-init-1',
        customerName: 'Khurram Shehzad',
        customerPhone: '03009876543',
        customerEmail: OWNER_EMAIL_DEFAULT,
        trade: 'electrician',
        title: 'UPS & Inverter Wiring Fault',
        description: 'Main breaker trips immediately when switching from WAPDA to UPS inverter.',
        address: 'House #42, Street 18, F-7/2, Islamabad',
        city: 'Islamabad',
        area: 'F-7',
        latitude: 33.69,
        longitude: 73.05,
        isUrgent: true,
        status: 'accepted',
        createdAt: 'Today, 2:15 PM',
        estimatedFeePkr: 1950,
        platformFeePkr: 0, // Owner free
        assignedWorkerId: 'w-el-2',
        assignedWorkerName: 'Abdul Rehman Abbasi',
      },
    ];
  });

  // UI Filter States
  const [selectedTrade, setSelectedTrade] = useState<TradeType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyEmergency, setOnlyEmergency] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance');

  // Modals state
  const [activeWorkerModal, setActiveWorkerModal] = useState<Worker | null>(null);
  const [bookingWorker, setBookingWorker] = useState<Worker | null>(null);
  const [isBroadcastBookingOpen, setIsBroadcastBookingOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isRegisterWorkerOpen, setIsRegisterWorkerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('kaamwala_owner_config', JSON.stringify(ownerConfig));
  }, [ownerConfig]);

  useEffect(() => {
    localStorage.setItem('kaamwala_user_location', JSON.stringify(userLocation));
  }, [userLocation]);

  useEffect(() => {
    localStorage.setItem('kaamwala_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('kaamwala_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Is Current User the designated Owner?
  const isOwner =
    ownerConfig.currentUserEmail.trim().toLowerCase() ===
    ownerConfig.ownerEmail.trim().toLowerCase();

  // Trigger live GPS Geolocation
  const handleTriggerGps = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.');
      return;
    }

    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        try {
          const geo = await reverseGeocodePakistan(latitude, longitude, PAKISTAN_CITIES);
          const newLoc: UserLocation = {
            latitude,
            longitude,
            city: geo.city,
            area: geo.area,
            address: geo.address,
            isGps: true,
            accuracy,
          };
          setUserLocation(newLoc);
          showToast(`GPS Fixed: ${geo.area}, ${geo.city}`);
        } catch {
          setUserLocation((prev) => ({
            ...prev,
            latitude,
            longitude,
            isGps: true,
          }));
          showToast('GPS coordinates acquired successfully');
        } finally {
          setIsGpsLoading(false);
        }
      },
      (err) => {
        setIsGpsLoading(false);
        console.warn('Geolocation error:', err.message);
        showToast('GPS unavailable. You can choose any Pakistan city manually.');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Simulate a Pakistani city coordinates (No Lahore fixed!)
  const handleSimulateCity = (city: PakistanCity) => {
    setUserLocation({
      latitude: city.latitude,
      longitude: city.longitude,
      city: city.name,
      area: city.popularAreas[0] || 'Central Area',
      address: `${city.popularAreas[0] || 'Center'}, ${city.name}, ${city.province}`,
      isGps: true,
    });
    showToast(`Simulated Pan-Pakistan GPS: ${city.name}`);
  };

  // Filter & Sort Workers based on Trade, Distance, Emergency, Search
  const filteredWorkers = useMemo(() => {
    return workers
      .filter((w) => {
        // Trade match
        if (selectedTrade !== 'all' && w.trade !== selectedTrade) {
          return false;
        }
        // Emergency match
        if (onlyEmergency && !w.emergencyAvailable) {
          return false;
        }
        // Search text match
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = w.name.toLowerCase().includes(query);
          const matchTrade = w.trade.toLowerCase().includes(query);
          const matchCity = w.city.toLowerCase().includes(query);
          const matchArea = w.area.toLowerCase().includes(query);
          const matchSkills = w.skills.some((s) => s.toLowerCase().includes(query));
          if (!matchName && !matchTrade && !matchCity && !matchArea && !matchSkills) {
            return false;
          }
        }
        return true;
      })
      .map((w) => {
        const dist = calculateHaversineDistance(
          userLocation.latitude,
          userLocation.longitude,
          w.latitude,
          w.longitude
        );
        return { worker: w, distanceKm: dist };
      })
      .sort((a, b) => {
        if (sortBy === 'distance') {
          return a.distanceKm - b.distanceKm;
        }
        if (sortBy === 'rating') {
          return b.worker.rating - a.worker.rating;
        }
        if (sortBy === 'price') {
          return a.worker.visitFeePkr - b.worker.visitFeePkr;
        }
        return 0;
      })
      .map((item) => item.worker);
  }, [workers, selectedTrade, onlyEmergency, searchQuery, userLocation, sortBy]);

  // Counts for each of the 3 trades
  const tradeCounts = useMemo(() => {
    return {
      all: workers.length,
      electrician: workers.filter((w) => w.trade === 'electrician').length,
      plumber: workers.filter((w) => w.trade === 'plumber').length,
      ac_technician: workers.filter((w) => w.trade === 'ac_technician').length,
    };
  }, [workers]);

  // Handle New Booking Creation
  const handleCreateJob = (jobData: Omit<JobRequest, 'id' | 'createdAt' | 'status'>) => {
    const newJob: JobRequest = {
      ...jobData,
      id: `job-${Date.now()}`,
      createdAt: 'Just now',
      status: 'pending',
    };
    setBookings((prev) => [newJob, ...prev]);
    showToast('Booking request sent successfully to nearby technicians!');
  };

  // Handle New Worker Registered
  const handleRegisterWorker = (newWorker: Worker) => {
    setWorkers((prev) => [newWorker, ...prev]);
    showToast(`Welcome ${newWorker.name}! Your profile is now live on KaamWala.`);
  };

  // Content rendering helper
  const appContent = (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col antialiased">
      {/* Top Main Navigation Header */}
      <Header
        userLocation={userLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onRefreshGps={handleTriggerGps}
        isGpsLoading={isGpsLoading}
        isUrdu={isUrdu}
        onToggleLanguage={() => setIsUrdu(!isUrdu)}
        activeRole={activeRole}
        onToggleRole={setActiveRole}
        onOpenOwnerModal={() => setIsOwnerModalOpen(true)}
        isOwner={isOwner}
        feeSystemEnabled={ownerConfig.feeSystemEnabled}
        bookingsCount={bookings.length}
        onOpenBookings={() => setIsBookingsModalOpen(true)}
        onOpenRegisterWorker={() => setIsRegisterWorkerOpen(true)}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Toast alert banner */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400/40 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* OWNER VIP EXEMPTION HIGHLIGHT (if owner logged in) */}
        {isOwner && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Owner mk3738766@gmail.com is FREE:</strong> All platform charges waived. Fee system is currently{' '}
                <strong className="uppercase">{ownerConfig.feeSystemEnabled ? 'ON' : 'OFF (0% Free for Everyone)'}</strong>.
              </span>
            </div>
            <button
              onClick={() => setIsOwnerModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-[11px] shrink-0"
            >
              Hidden Fee Toggle
            </button>
          </div>
        )}

        {/* CUSTOMER MODE VIEW */}
        {activeRole === 'customer' && (
          <>
            {/* 24/7 Emergency Dispatch Banner */}
            <DirectEmergencyCallBanner
              onQuickEmergencyFilter={(trade) => {
                setSelectedTrade(trade);
                setOnlyEmergency(true);
              }}
              onRequestBroadcast={() => setIsBroadcastBookingOpen(true)}
              isUrdu={isUrdu}
            />

            {/* 3 Core Trades Selector (Electrician, Plumber, AC Technician) */}
            <TradeSelector
              selectedTrade={selectedTrade}
              onSelectTrade={setSelectedTrade}
              isUrdu={isUrdu}
              counts={tradeCounts}
            />

            {/* Search & Filter Toolbar */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 sm:p-4 mb-6 shadow-sm">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={
                      isUrdu
                        ? 'نام، ہنر یا علاقہ تلاش کریں (مثلاً وائرنگ، گیزر، انورٹر...)'
                        : 'Search by technician name, skill or area (e.g. Solar, Inverter PCB, Leakage...)'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filter & Sort Controls */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                  {/* Emergency 30-min fast toggle */}
                  <button
                    onClick={() => setOnlyEmergency(!onlyEmergency)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                      onlyEmergency
                        ? 'bg-rose-950/60 border-rose-500 text-rose-300 shadow'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>{isUrdu ? 'صرف ایمرجنسی' : '30-Min Emergency Only'}</span>
                  </button>

                  {/* Sort By Dropdown */}
                  <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1 text-xs text-neutral-300 shrink-0">
                    <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="distance" className="bg-neutral-900 text-white">
                        Sort: Nearest GPS
                      </option>
                      <option value="rating" className="bg-neutral-900 text-white">
                        Sort: Top Rated
                      </option>
                      <option value="price" className="bg-neutral-900 text-white">
                        Sort: Lowest Visit Fee
                      </option>
                    </select>
                  </div>

                  {/* Broadcast Job button */}
                  <button
                    onClick={() => setIsBroadcastBookingOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'اوپن آرڈر پوسٹ کریں' : 'Broadcast Job'}</span>
                  </button>
                </div>
              </div>

              {/* Active Filter Chips */}
              <div className="flex items-center justify-between text-xs text-neutral-400 mt-2.5 pt-2 border-t border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <span>
                    Showing <strong className="text-white">{filteredWorkers.length}</strong> available{' '}
                    {selectedTrade === 'all'
                      ? 'technicians'
                      : selectedTrade.replace('_', ' ')}
                  </span>
                  <span>in</span>
                  <button
                    onClick={() => setIsLocationModalOpen(true)}
                    className="text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" />
                    {userLocation.city}
                  </button>
                </div>

                <button
                  onClick={handleTriggerGps}
                  className="text-[11px] text-neutral-400 hover:text-emerald-400 flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isGpsLoading ? 'animate-spin text-emerald-400' : ''}`} />
                  <span>Update Distances</span>
                </button>
              </div>
            </div>

            {/* Workers Grid */}
            {filteredWorkers.length === 0 ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-10 text-center">
                <Wrench className="w-12 h-12 mx-auto text-neutral-600 mb-3" />
                <h3 className="text-base font-bold text-white">
                  {isUrdu ? 'اس فلٹر کے تحت کوئی کاریگر نہیں ملا' : 'No Technicians Found'}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                  Try clearing your search query, switching trades, or expanding your location radius.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedTrade('all');
                      setOnlyEmergency(false);
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setIsBroadcastBookingOpen(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white"
                  >
                    Post an Open Job
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWorkers.map((worker) => (
                  <WorkerCard
                    key={worker.id}
                    worker={worker}
                    userLocation={userLocation}
                    onSelectWorker={(w) => setActiveWorkerModal(w)}
                    onQuickBook={(w) => setBookingWorker(w)}
                    isUrdu={isUrdu}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* WORKER HUB VIEW (When user toggles to Worker mode) */}
        {activeRole === 'worker' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-950 via-neutral-900 to-neutral-900 border border-emerald-500/40 rounded-3xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {isUrdu ? 'کاریگر پورٹل' : 'KaamWala Tradesman Hub'}
                  </span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">
                    {isUrdu ? 'اپنے علاقے میں کام حاصل کریں' : 'Get Direct Jobs in Your City'}
                  </h2>
                  <p className="text-xs text-neutral-300 mt-1 max-w-xl">
                    Zero commission in Free Mode. Direct customer calls and WhatsApp bookings. Verified
                    NADRA CNIC badge for higher trust.
                  </p>
                </div>
                <button
                  onClick={() => setIsRegisterWorkerOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950 shrink-0 flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isUrdu ? 'نیا کاریگر رجسٹر کریں' : 'Register Profile'}</span>
                </button>
              </div>
            </div>

            {/* Live Incoming Jobs Feed in current city */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <span>{isUrdu ? 'آپ کے شہر میں تازہ ترین آرڈرز' : `Incoming Job Requests in ${userLocation.city}`}</span>
                  <span className="text-xs font-normal text-neutral-400">
                    ({bookings.length} jobs)
                  </span>
                </h3>
              </div>

              <div className="space-y-3">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-400 uppercase">
                          {b.trade.replace('_', ' ')}
                        </span>
                        {b.isUrgent && (
                          <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold">
                            🚨 30-min Urgent
                          </span>
                        )}
                        <span className="text-[10px] text-neutral-400">{b.createdAt}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm mt-1">{b.title}</h4>
                      <p className="text-xs text-neutral-400 mt-0.5">{b.description}</p>
                      <div className="flex items-center gap-2 text-xs text-neutral-300 mt-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{b.address}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 border-neutral-800 pt-2 sm:pt-0">
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-500 uppercase block">Budget</span>
                        <span className="font-extrabold text-emerald-400 text-sm">
                          Rs. {b.estimatedFeePkr}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => window.open(`tel:${b.customerPhone}`)}
                          className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Call</span>
                        </button>
                        <button
                          onClick={() => window.open(`https://wa.me/${b.customerPhone}`, '_blank')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold flex items-center gap-1 border border-emerald-500/30"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">KaamWala</span>
            <span className="font-urdu text-neutral-400">کام والا</span>
            <span>• Pan-Pakistan GPS (Karachi, Lahore, Islamabad, Peshawar, Quetta & All Cities)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOwnerModalOpen(true)}
              className="text-neutral-400 hover:text-amber-400 transition-colors flex items-center gap-1 text-[11px]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Owner & Hidden Fee Toggle</span>
            </button>
            <span>•</span>
            <button
              onClick={handleTriggerGps}
              className="text-neutral-400 hover:text-emerald-400 transition-colors"
            >
              Recalibrate GPS
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Worker Full Detail Modal */}
      {activeWorkerModal && (
        <WorkerDetailModal
          worker={activeWorkerModal}
          userLocation={userLocation}
          ownerConfig={ownerConfig}
          onBook={(w) => {
            setActiveWorkerModal(null);
            setBookingWorker(w);
          }}
          onClose={() => setActiveWorkerModal(null)}
          isUrdu={isUrdu}
        />
      )}

      {/* 2. Book Specific Worker Modal */}
      {bookingWorker && (
        <BookJobModal
          worker={bookingWorker}
          userLocation={userLocation}
          ownerConfig={ownerConfig}
          onSubmitJob={handleCreateJob}
          onClose={() => setBookingWorker(null)}
          isUrdu={isUrdu}
        />
      )}

      {/* 3. Broadcast Job to All Nearby Modal */}
      {isBroadcastBookingOpen && (
        <BookJobModal
          worker={null}
          defaultTrade={selectedTrade}
          userLocation={userLocation}
          ownerConfig={ownerConfig}
          onSubmitJob={handleCreateJob}
          onClose={() => setIsBroadcastBookingOpen(false)}
          isUrdu={isUrdu}
        />
      )}

      {/* 4. Pan-Pakistan Location & GPS Modal */}
      {isLocationModalOpen && (
        <LocationPickerModal
          currentLocation={userLocation}
          onSelectLocation={(loc) => {
            setUserLocation(loc);
            showToast(`Location set to ${loc.area}, ${loc.city}`);
          }}
          onTriggerGps={handleTriggerGps}
          isGpsLoading={isGpsLoading}
          onClose={() => setIsLocationModalOpen(false)}
          isUrdu={isUrdu}
        />
      )}

      {/* 5. Hidden Owner & Fee Toggle Modal */}
      {isOwnerModalOpen && (
        <HiddenOwnerModal
          config={ownerConfig}
          onUpdateConfig={(newCfg) => {
            setOwnerConfig((prev) => ({ ...prev, ...newCfg }));
            showToast('Platform configuration saved.');
          }}
          onClose={() => setIsOwnerModalOpen(false)}
          onSimulateGpsCity={handleSimulateCity}
          isUrdu={isUrdu}
        />
      )}

      {/* 6. Active Bookings Modal */}
      {isBookingsModalOpen && (
        <ActiveBookingsModal
          bookings={bookings}
          ownerConfig={ownerConfig}
          onUpdateStatus={(id, status) => {
            setBookings((prev) =>
              prev.map((b) => (b.id === id ? { ...b, status } : b))
            );
            showToast('Status updated.');
          }}
          onClose={() => setIsBookingsModalOpen(false)}
          isUrdu={isUrdu}
        />
      )}

      {/* 7. Register New Worker Modal */}
      {isRegisterWorkerOpen && (
        <RegisterWorkerModal
          userLocation={userLocation}
          onRegister={handleRegisterWorker}
          onClose={() => setIsRegisterWorkerOpen(false)}
          isUrdu={isUrdu}
        />
      )}
    </div>
  );

  // If initial splash screen is active, show the Flutter-style SplashScreen
  if (showSplash) {
    return (
      <SplashScreen
        onComplete={() => setShowSplash(false)}
        userLocation={userLocation}
        isOwner={isOwner}
        feeSystemEnabled={ownerConfig.feeSystemEnabled}
      />
    );
  }

  // If Mobile Frame toggle is enabled, wrap inside a sleek Smartphone Mockup frame (Flutter mobile feel)
  if (isMobileFrame) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-2 sm:p-6">
        <div className="w-full max-w-sm sm:max-w-md h-[94vh] bg-neutral-900 border-4 border-neutral-700 rounded-[44px] shadow-2xl overflow-hidden relative flex flex-col">
          {/* Phone Speaker & Camera Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-neutral-800 rounded-b-2xl z-40 flex items-center justify-center">
            <div className="w-12 h-1 bg-neutral-700 rounded-full" />
          </div>

          <div className="flex-1 overflow-y-auto pt-4 flex flex-col">
            {appContent}
          </div>
        </div>
      </div>
    );
  }

  return appContent;
}

