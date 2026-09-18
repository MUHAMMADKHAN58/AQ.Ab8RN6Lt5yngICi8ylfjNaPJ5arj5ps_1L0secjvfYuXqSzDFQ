import { useState } from 'react';
import { MapPin, Navigation, Globe, Shield, ShieldCheck, Briefcase, UserCheck, Smartphone, Monitor } from 'lucide-react';
import { UserLocation } from '../types';

interface HeaderProps {
  userLocation: UserLocation;
  onOpenLocationModal: () => void;
  onRefreshGps: () => void;
  isGpsLoading: boolean;
  isUrdu: boolean;
  onToggleLanguage: () => void;
  activeRole: 'customer' | 'worker';
  onToggleRole: (role: 'customer' | 'worker') => void;
  onOpenOwnerModal: () => void;
  isOwner: boolean;
  feeSystemEnabled: boolean;
  bookingsCount: number;
  onOpenBookings: () => void;
  onOpenRegisterWorker: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export function Header({
  userLocation,
  onOpenLocationModal,
  onRefreshGps,
  isGpsLoading,
  isUrdu,
  onToggleLanguage,
  activeRole,
  onToggleRole,
  onOpenOwnerModal,
  isOwner,
  feeSystemEnabled,
  bookingsCount,
  onOpenBookings,
  onOpenRegisterWorker,
  isMobileFrame,
  onToggleMobileFrame,
}: HeaderProps) {
  const [logoTapCount, setLogoTapCount] = useState(0);

  const handleLogoClick = () => {
    const next = logoTapCount + 1;
    setLogoTapCount(next);
    if (next >= 3) {
      setLogoTapCount(0);
      onOpenOwnerModal();
    } else {
      // Reset tap counter after 2 seconds
      setTimeout(() => setLogoTapCount(0), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 text-white transition-all shadow-sm">
      {/* Top micro-bar: Location & Owner Status */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between text-xs border-b border-neutral-800/60 gap-2">
        {/* GPS location pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors border border-neutral-700/60"
            title="Change Location anywhere in Pakistan"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-[200px]">
              {userLocation.area ? `${userLocation.area}, ` : ''}{userLocation.city || 'Pan-Pakistan'}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded">
              {userLocation.isGps ? 'GPS' : 'City'}
            </span>
          </button>

          <button
            onClick={onRefreshGps}
            disabled={isGpsLoading}
            className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-emerald-400 transition-colors border border-neutral-700/60"
            title="Live GPS Refresh"
          >
            <Navigation className={`w-3 h-3 ${isGpsLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>

        {/* Right side controls: Fee badge, Owner badge, Mobile frame switch, Language switch */}
        <div className="flex items-center gap-2">
          {/* Owner VIP Badge or Fee Status */}
          <button
            onClick={onOpenOwnerModal}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] transition-all ${
              isOwner
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                : feeSystemEnabled
                ? 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
            }`}
            title="Owner Settings & Hidden Fee Toggle"
          >
            {isOwner ? (
              <>
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span className="font-medium">mk3738766 (FREE VIP)</span>
              </>
            ) : (
              <>
                <Shield className="w-3 h-3 text-neutral-400" />
                <span>{feeSystemEnabled ? 'Fee Active' : '0% Free Mode'}</span>
              </>
            )}
          </button>

          {/* Frame view toggle for desktop testing */}
          <button
            onClick={onToggleMobileFrame}
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors border border-neutral-700/50 text-[11px]"
            title={isMobileFrame ? 'Switch to Full Width View' : 'Preview in Native Mobile App Frame'}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3 h-3 text-neutral-400" />
                <span>Full</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3 h-3 text-emerald-400" />
                <span>Mobile View</span>
              </>
            )}
          </button>

          {/* Urdu / English language toggle */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors border border-neutral-700/50 text-[11px]"
          >
            <Globe className="w-3 h-3 text-emerald-400" />
            <span className="font-semibold">{isUrdu ? 'English' : 'اردو'}</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand logo & Triple-Tap secret trigger */}
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          title="Tip: Tap 3 times for Hidden Owner Fee Toggle"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-950 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xl tracking-tighter">KW</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white">KaamWala</span>
              <span className="font-urdu text-lg text-emerald-400 leading-none">کام والا</span>
            </div>
            <p className="text-[10px] text-neutral-400 font-medium">
              Pan-Pakistan GPS On-Demand Trades
            </p>
          </div>
        </div>

        {/* Right action group */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Customer / Worker Mode Selector */}
          <div className="hidden sm:flex bg-neutral-800 p-1 rounded-xl border border-neutral-700">
            <button
              onClick={() => onToggleRole('customer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeRole === 'customer'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'گاہک' : 'Customer'}</span>
            </button>
            <button
              onClick={() => onToggleRole('worker')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeRole === 'worker'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'ہنر مند / کاریگر' : 'Worker Hub'}</span>
            </button>
          </div>

          {/* Bookings / Requests Button */}
          <button
            onClick={onOpenBookings}
            className="relative px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <span>{isUrdu ? 'آرڈرز' : 'Bookings'}</span>
            {bookingsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 font-bold text-[11px] flex items-center justify-center">
                {bookingsCount}
              </span>
            )}
          </button>

          {/* Register as Worker button */}
          <button
            onClick={onOpenRegisterWorker}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-950/40 hidden md:flex items-center gap-1"
          >
            <span>+ {isUrdu ? 'کاریگر بنیں' : 'Join as KaamWala'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
