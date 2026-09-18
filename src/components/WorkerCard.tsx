import { Star, ShieldCheck, MapPin, Phone, MessageSquare, Clock, Zap, Wrench, Wind, AlertCircle } from 'lucide-react';
import { Worker, UserLocation } from '../types';
import { calculateHaversineDistance, formatDistance } from '../utils/geo';

interface WorkerCardProps {
  worker: Worker;
  userLocation: UserLocation;
  onSelectWorker: (worker: Worker) => void;
  onQuickBook: (worker: Worker) => void;
  isUrdu: boolean;
}

export function WorkerCard({
  worker,
  userLocation,
  onSelectWorker,
  onQuickBook,
  isUrdu,
}: WorkerCardProps) {
  const distanceKm = calculateHaversineDistance(
    userLocation.latitude,
    userLocation.longitude,
    worker.latitude,
    worker.longitude
  );

  const getTradeBadge = () => {
    switch (worker.trade) {
      case 'electrician':
        return {
          label: isUrdu ? 'الیکٹریشن' : 'Electrician',
          icon: Zap,
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        };
      case 'plumber':
        return {
          label: isUrdu ? 'پلمبر' : 'Plumber',
          icon: Wrench,
          bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
        };
      case 'ac_technician':
        return {
          label: isUrdu ? 'اے سی ٹیکنیشن' : 'AC Technician',
          icon: Wind,
          bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
        };
    }
  };

  const tradeBadge = getTradeBadge();
  const TradeIcon = tradeBadge.icon;

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`tel:${worker.phone}`);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `Assalam-o-Alaikum ${worker.name}! I found your profile on KaamWala app. I need your assistance for ${worker.trade.replace('_', ' ')} in ${userLocation.city}. Are you available?`
    );
    window.open(`https://wa.me/${worker.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div
      onClick={() => onSelectWorker(worker)}
      className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-3xl p-4 sm:p-5 transition-all hover:shadow-xl hover:shadow-black/50 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
    >
      {/* Top row: Avatar, Name, Verification, Trade, Distance */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar with live status */}
            <div className="relative">
              <img
                src={worker.photoUrl}
                alt={worker.name}
                referrerPolicy="no-referrer"
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-neutral-700 group-hover:border-emerald-500 transition-colors shadow"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-neutral-900 ${
                  worker.isAvailable ? 'bg-emerald-500' : 'bg-neutral-500'
                }`}
                title={worker.isAvailable ? 'Available Now' : 'Busy'}
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-emerald-400 transition-colors">
                  {worker.name}
                </h3>
                {worker.cnicVerified && (
                  <span
                    className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-medium"
                    title="NADRA CNIC Verified Tradesman"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5">
                <div className="flex items-center text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                  <span>{worker.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <span className="text-neutral-400">({worker.reviewsCount} reviews)</span>
                <span>•</span>
                <span className="text-neutral-400">{worker.experienceYears}y exp</span>
              </div>
            </div>
          </div>

          {/* Trade Category Pill */}
          <div className="flex flex-col items-end gap-1">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${tradeBadge.bg}`}
            >
              <TradeIcon className="w-3 h-3" />
              <span>{tradeBadge.label}</span>
            </span>
            {worker.emergencyAvailable && (
              <span className="text-[10px] text-rose-400 font-bold flex items-center gap-0.5">
                <AlertCircle className="w-2.5 h-2.5" />
                <span>30m Fast</span>
              </span>
            )}
          </div>
        </div>

        {/* Location & Real Distance in KM */}
        <div className="flex items-center justify-between text-xs bg-neutral-950/60 rounded-xl px-3 py-2 border border-neutral-800/80 mb-3">
          <div className="flex items-center gap-1.5 text-neutral-300 truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{worker.area}, {worker.city}</span>
          </div>
          <div className="text-emerald-400 font-mono font-bold shrink-0 pl-2">
            {formatDistance(distanceKm)} away
          </div>
        </div>

        {/* Short Bio */}
        <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
          {isUrdu ? worker.bioUr : worker.bioEn}
        </p>

        {/* Skills chips */}
        <div className="flex flex-wrap gap-1 mb-4">
          {worker.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md border border-neutral-700/50"
            >
              {skill}
            </span>
          ))}
          {worker.skills.length > 3 && (
            <span className="text-[10px] text-neutral-500 self-center">
              +{worker.skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Bottom Pricing & Action Buttons */}
      <div className="pt-3 border-t border-neutral-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
              Inspection / Visit
            </span>
            <div className="text-sm sm:text-base font-extrabold text-white">
              Rs. {worker.visitFeePkr}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
              Standard Rate
            </span>
            <div className="text-xs sm:text-sm font-semibold text-neutral-300">
              Rs. {worker.hourlyRatePkr} / hr
            </div>
          </div>
        </div>

        {/* Action Button Grid */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={handleCall}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors border border-neutral-700/60"
            title="Direct Phone Call"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Call</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 text-xs font-semibold transition-colors border border-emerald-500/30"
            title="Chat on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickBook(worker);
            }}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950"
          >
            <span>{isUrdu ? 'بک کریں' : 'Book Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
