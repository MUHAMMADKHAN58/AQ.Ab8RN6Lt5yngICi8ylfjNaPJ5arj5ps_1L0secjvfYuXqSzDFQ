import { useState } from 'react';
import { ShieldCheck, ToggleLeft, ToggleRight, X, Sparkles, Key, CheckCircle, AlertTriangle, MapPin, DollarSign } from 'lucide-react';
import { OwnerConfig, PakistanCity } from '../types';
import { PAKISTAN_CITIES } from '../data/pakistanData';

interface HiddenOwnerModalProps {
  config: OwnerConfig;
  onUpdateConfig: (newConfig: Partial<OwnerConfig>) => void;
  onClose: () => void;
  onSimulateGpsCity: (city: PakistanCity) => void;
  isUrdu: boolean;
}

export function HiddenOwnerModal({
  config,
  onUpdateConfig,
  onClose,
  onSimulateGpsCity,
  isUrdu,
}: HiddenOwnerModalProps) {
  const [emailInput, setEmailInput] = useState(config.currentUserEmail);
  const [feePkrInput, setFeePkrInput] = useState(config.platformFeePkr.toString());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isCurrentEmailOwner =
    emailInput.trim().toLowerCase() === config.ownerEmail.toLowerCase();

  const handleToggleFeeSystem = () => {
    onUpdateConfig({ feeSystemEnabled: !config.feeSystemEnabled });
    triggerSaveFeedback();
  };

  const handleApplyEmail = () => {
    onUpdateConfig({ currentUserEmail: emailInput.trim() });
    triggerSaveFeedback();
  };

  const handleSetQuickOwner = () => {
    setEmailInput(config.ownerEmail);
    onUpdateConfig({ currentUserEmail: config.ownerEmail });
    triggerSaveFeedback();
  };

  const handleUpdateFeeAmount = () => {
    const val = parseInt(feePkrInput, 10);
    if (!isNaN(val) && val >= 0) {
      onUpdateConfig({ platformFeePkr: val });
      triggerSaveFeedback();
    }
  };

  const triggerSaveFeedback = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl shadow-amber-950/40 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950/30 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base tracking-tight">
                  Owner & Platform Admin
                </h3>
                <span className="text-[10px] bg-amber-500 text-neutral-950 font-bold px-1.5 py-0.5 rounded">
                  HIDDEN PANEL
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                System configuration, fee switches & owner exemption
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {savedSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4" />
              <span>Settings updated instantly!</span>
            </div>
          )}

          {/* 1. OWNER STATUS CARD (Directly matching user prompt mandate) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-800/90 to-neutral-950 border border-amber-500/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>PERMANENT OWNER POLICY</span>
                </div>
                <p className="text-sm font-bold text-white font-mono">
                  {config.ownerEmail}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Status: 100% FREE FOREVER (Zero Platform Fee)</span>
                </div>
              </div>

              <button
                onClick={handleSetQuickOwner}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all shadow-md shrink-0"
              >
                Log In As Owner
              </button>
            </div>

            {/* Email Switcher / Tester */}
            <div className="mt-3 pt-3 border-t border-neutral-800/80">
              <label className="text-[11px] text-neutral-400 block mb-1">
                Active User Email for testing fee exemption:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. mk3738766@gmail.com"
                  className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
                />
                <button
                  onClick={handleApplyEmail}
                  className="px-3 py-1.5 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-semibold"
                >
                  Set
                </button>
              </div>

              {isCurrentEmailOwner ? (
                <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  You are identified as the Owner! Platform Fee = <strong>Rs. 0 (Free)</strong>
                </p>
              ) : (
                <p className="text-[11px] text-neutral-400 mt-1">
                  Non-owner email. Normal fee rules apply.
                </p>
              )}
            </div>
          </div>

          {/* 2. HIDDEN FEE TOGGLE (User prompt: "Hidden Fee Toggle") */}
          <div className="p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700/80">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">
                    Platform Fee System
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      config.feeSystemEnabled
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {config.feeSystemEnabled ? 'FEE SYSTEM ON' : '100% FREE MODE (OFF)'}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5 max-w-xs">
                  {config.feeSystemEnabled
                    ? 'Customers pay a platform fee per booking (Owner remains 100% Free).'
                    : 'feeSystemEnabled = false. Direct free connect for all Pakistanis.'}
                </p>
              </div>

              <button
                onClick={handleToggleFeeSystem}
                className="p-1 text-neutral-300 hover:text-white transition-colors"
                title="Toggle Platform Fee System"
              >
                {config.feeSystemEnabled ? (
                  <ToggleRight className="w-10 h-10 text-amber-400" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-neutral-500" />
                )}
              </button>
            </div>

            {/* Fee amount setting if fee system is enabled */}
            {config.feeSystemEnabled && (
              <div className="mt-4 pt-3 border-t border-neutral-700/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-neutral-300 font-medium">Standard Booking Fee:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Rs.</span>
                  <input
                    type="number"
                    value={feePkrInput}
                    onChange={(e) => setFeePkrInput(e.target.value)}
                    className="w-20 bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-white text-right focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleUpdateFeeAmount}
                    className="px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-xs text-white"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. PAN-PAKISTAN GPS TESTING RADAR (Verify "No Lahore fixed") */}
          <div className="p-4 rounded-2xl bg-neutral-800/40 border border-neutral-700/60">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-white text-xs sm:text-sm">
                Pan-Pakistan GPS Verification (No Lahore Fixed)
              </h4>
            </div>
            <p className="text-xs text-neutral-400 mb-3">
              Instant GPS simulator to test distance calculations across all regions of Pakistan:
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 text-xs">
              {PAKISTAN_CITIES.slice(0, 8).map((city) => (
                <button
                  key={city.name}
                  onClick={() => {
                    onSimulateGpsCity(city);
                    onClose();
                  }}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-emerald-950/40 hover:border-emerald-500/50 border border-neutral-700 text-neutral-300 hover:text-emerald-300 text-center transition-colors"
                >
                  <div className="font-semibold">{city.name}</div>
                  <div className="text-[10px] text-neutral-500 font-urdu">{city.nameUr}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-mono">
            Owner: mk3738766@gmail.com
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
