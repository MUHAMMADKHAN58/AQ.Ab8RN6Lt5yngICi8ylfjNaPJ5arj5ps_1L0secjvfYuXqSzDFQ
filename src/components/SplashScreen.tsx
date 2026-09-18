import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench, Zap, Wind, Navigation, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { UserLocation } from '../types';

interface SplashScreenProps {
  onComplete: () => void;
  userLocation: UserLocation;
  isOwner: boolean;
  feeSystemEnabled: boolean;
}

export function SplashScreen({ onComplete, userLocation, isOwner, feeSystemEnabled }: SplashScreenProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1400);
    const t3 = setTimeout(() => onComplete(), 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        id="splash-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 text-white p-6 select-none"
      >
        {/* Top subtle bar */}
        <div className="w-full flex items-center justify-between text-xs text-neutral-400 max-w-sm pt-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Pakistan GPS Live
          </span>
          <button
            onClick={onComplete}
            className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-800/60 transition-colors"
          >
            Skip →
          </button>
        </div>

        {/* Center Brand Identity */}
        <div className="flex flex-col items-center text-center my-auto">
          {/* Animated Icon Circle */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="relative w-24 h-24 mb-6 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 p-[2px] shadow-2xl shadow-emerald-900/50"
          >
            <div className="w-full h-full bg-neutral-900 rounded-[22px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm" />
              <div className="relative flex items-center justify-center gap-1 text-emerald-400">
                <Zap className="w-6 h-6 text-amber-400 animate-bounce" style={{ animationDuration: '2s' }} />
                <Wrench className="w-7 h-7 text-emerald-400" />
                <Wind className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>
          </motion.div>

          {/* Urdu Title & English Title */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-1 flex items-center justify-center gap-2">
              <span>کام والا</span>
              <span className="text-emerald-400 font-brand">KaamWala</span>
            </h1>
            <p className="text-xs font-urdu text-neutral-300 tracking-wide mt-1 text-base">
              پاکستان کا سب سے تیز ترین آن ڈیمانڈ ہنر مند نیٹ ورک
            </p>
            <p className="text-xs text-neutral-400 mt-1 font-medium">
              Electrician • Plumber • AC Technician
            </p>
          </motion.div>

          {/* Loading status steps */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-xs text-neutral-300 bg-neutral-800/80 px-4 py-2 rounded-full border border-neutral-700/60 shadow-inner">
              <Navigation className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
              {step === 0 && <span>Initializing Pan-Pakistan GPS...</span>}
              {step === 1 && (
                <span>
                  Detected Location: <strong className="text-emerald-300">{userLocation.city || 'Pakistan'}</strong>
                </span>
              )}
              {step === 2 && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready • Instant Technician Connect
                </span>
              )}
            </div>

            {/* Owner VIP Status badge if owner detected */}
            {isOwner && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center gap-1 text-[11px] bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Owner: mk3738766@gmail.com (100% FREE Access Active)</span>
              </motion.div>
            )}

            {!feeSystemEnabled && (
              <p className="text-[10px] text-neutral-400 mt-1">
                Platform Fee: <span className="text-emerald-400 font-semibold">0% (Completely Free)</span>
              </p>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pb-2">
          <p className="text-[11px] text-neutral-400">
            Karachi • Lahore • Islamabad • Peshawar • Quetta • All Pakistan
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
