import { AlertTriangle, Zap, Wrench, Wind, PhoneCall, ArrowRight } from 'lucide-react';
import { TradeType } from '../types';

interface DirectEmergencyCallBannerProps {
  onQuickEmergencyFilter: (trade: TradeType) => void;
  onRequestBroadcast: () => void;
  isUrdu: boolean;
}

export function DirectEmergencyCallBanner({
  onQuickEmergencyFilter,
  onRequestBroadcast,
  isUrdu,
}: DirectEmergencyCallBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/70 via-neutral-900 to-neutral-900 border border-rose-500/30 p-4 sm:p-5 mb-6 shadow-xl shadow-rose-950/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                {isUrdu ? 'فوری ایمرجنسی ہیلپ لائن' : '24/7 Emergency Quick Dispatch'}
              </span>
              <span className="text-[10px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded">
                LIVE
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
              {isUrdu
                ? 'شارٹ سرکٹ، پائپ لیکیج یا اے سی خرابی؟'
                : 'Power Outage, Pipe Burst or AC Breakdown?'}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Instant dispatch of on-call technicians near your GPS position with guaranteed fast response.
            </p>
          </div>
        </div>

        {/* Right quick dispatch buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onQuickEmergencyFilter('electrician')}
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1.5 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{isUrdu ? 'الیکٹریشن' : 'Electrician'}</span>
          </button>

          <button
            onClick={() => onQuickEmergencyFilter('plumber')}
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-blue-300 text-xs font-semibold border border-blue-500/30 flex items-center gap-1.5 transition-colors"
          >
            <Wrench className="w-3.5 h-3.5 text-blue-400" />
            <span>{isUrdu ? 'پلمبر' : 'Plumber'}</span>
          </button>

          <button
            onClick={() => onQuickEmergencyFilter('ac_technician')}
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-cyan-300 text-xs font-semibold border border-cyan-500/30 flex items-center gap-1.5 transition-colors"
          >
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isUrdu ? 'اے سی ٹیکنیشن' : 'AC Tech'}</span>
          </button>

          <button
            onClick={onRequestBroadcast}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-rose-950"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'فوری کاریگر بلائیں' : 'Request Dispatch'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
