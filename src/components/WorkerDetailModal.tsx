import { Star, ShieldCheck, MapPin, Phone, MessageSquare, Clock, X, Check, Award, Shield, AlertTriangle } from 'lucide-react';
import { Worker, UserLocation, OwnerConfig } from '../types';
import { TRADE_SERVICES } from '../data/pakistanData';
import { calculateHaversineDistance, formatDistance } from '../utils/geo';

interface WorkerDetailModalProps {
  worker: Worker;
  userLocation: UserLocation;
  ownerConfig: OwnerConfig;
  onBook: (worker: Worker) => void;
  onClose: () => void;
  isUrdu: boolean;
}

export function WorkerDetailModal({
  worker,
  userLocation,
  ownerConfig,
  onBook,
  onClose,
  isUrdu,
}: WorkerDetailModalProps) {
  const distanceKm = calculateHaversineDistance(
    userLocation.latitude,
    userLocation.longitude,
    worker.latitude,
    worker.longitude
  );

  const isOwner =
    ownerConfig.currentUserEmail.trim().toLowerCase() === ownerConfig.ownerEmail.toLowerCase();

  const services = TRADE_SERVICES[worker.trade] || [];

  const handleCall = () => {
    window.open(`tel:${worker.phone}`);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum ${worker.name}! I would like to book your ${worker.trade.replace('_', ' ')} services in ${userLocation.city}.`
    );
    window.open(`https://wa.me/${worker.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Verified KaamWala Profile
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Worker Hero Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={worker.photoUrl}
              alt={worker.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white">{worker.name}</h2>
                {worker.cnicVerified && (
                  <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    CNIC Verified
                  </span>
                )}
                {worker.policeVerified && (
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-semibold border border-blue-500/30">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    Police Verified
                  </span>
                )}
              </div>

              <p className="text-sm text-neutral-300 font-medium mt-0.5">
                {isUrdu ? worker.titleUr : worker.titleEn}
              </p>

              <div className="flex items-center gap-3 text-xs text-neutral-400 mt-2 flex-wrap">
                <div className="flex items-center text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 mr-1" />
                  <span>{worker.rating.toFixed(1)}</span>
                  <span className="text-neutral-400 font-normal ml-1">({worker.reviewsCount} reviews)</span>
                </div>
                <span>•</span>
                <span className="text-neutral-300 font-semibold">{worker.completedJobsCount} jobs completed</span>
                <span>•</span>
                <span className="text-neutral-400">{worker.experienceYears} years experience</span>
              </div>
            </div>
          </div>

          {/* GPS Distance & Location Pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs">
            <div className="flex items-center gap-2 text-neutral-300">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Base Station: <strong>{worker.area}, {worker.city}</strong></span>
            </div>
            <div className="text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              GPS Distance: {formatDistance(distanceKm)} from you
            </div>
          </div>

          {/* About / Bio */}
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
              About & Experience
            </h3>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed bg-neutral-800/40 p-3.5 rounded-xl border border-neutral-800">
              {isUrdu ? worker.bioUr : worker.bioEn}
            </p>
          </div>

          {/* Verified Skills */}
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Verified Technical Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-neutral-800 text-emerald-300 px-3 py-1 rounded-xl border border-neutral-700 font-medium flex items-center gap-1.5"
                >
                  <Check className="w-3 h-3 text-emerald-400" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Trade Services Catalog with Pricing */}
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Standard Rates for {worker.trade.replace('_', ' ').toUpperCase()}</span>
              <span className="text-[11px] text-neutral-500 font-normal">Official Rate Card</span>
            </h3>
            <div className="divide-y divide-neutral-800 bg-neutral-950/50 rounded-2xl border border-neutral-800 overflow-hidden">
              {services.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between text-xs hover:bg-neutral-800/30 transition-colors">
                  <div>
                    <div className="font-semibold text-white">
                      {isUrdu ? item.nameUr : item.nameEn}
                    </div>
                    <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      <span>{item.timeEstimate}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400 text-sm">
                      Rs. {item.estimatedPricePkr}
                    </span>
                    <span className="text-[10px] text-neutral-500 block">approx</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Reviews */}
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Verified Customer Reviews ({worker.reviews.length})
            </h3>
            <div className="space-y-2">
              {worker.reviews.map((r) => (
                <div key={r.id} className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">{r.userName} ({r.userCity})</span>
                    <div className="flex items-center text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                      <span>{r.rating}</span>
                    </div>
                  </div>
                  <p className="text-neutral-300">{r.comment}</p>
                  <span className="text-[10px] text-neutral-500 mt-1 block">{r.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Fee Transparency Box */}
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Visit / Inspection Fee:</span>
              <span className="font-bold text-white">Rs. {worker.visitFeePkr}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Platform Service Charge:</span>
              {isOwner ? (
                <span className="font-bold text-amber-400">
                  Rs. 0 (Owner VIP Exemption Active)
                </span>
              ) : !ownerConfig.feeSystemEnabled ? (
                <span className="font-bold text-emerald-400">
                  Rs. 0 (100% Free Mode)
                </span>
              ) : (
                <span className="font-bold text-white">
                  Rs. {ownerConfig.platformFeePkr}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCall}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Call {worker.phone}</span>
            </button>
            <button
              onClick={handleWhatsApp}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-emerald-500/30"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          </div>

          <button
            onClick={() => onBook(worker)}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-emerald-950 flex items-center gap-1.5"
          >
            <span>Proceed to Book</span>
          </button>
        </div>
      </div>
    </div>
  );
}
