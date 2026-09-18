import { useState } from 'react';
import { X, Check, MapPin, Calendar, Clock, AlertTriangle, ShieldCheck, Zap, Wrench, Wind } from 'lucide-react';
import { Worker, UserLocation, OwnerConfig, JobRequest, TradeType } from '../types';
import { TRADE_SERVICES } from '../data/pakistanData';

interface BookJobModalProps {
  worker?: Worker | null;
  defaultTrade?: TradeType;
  userLocation: UserLocation;
  ownerConfig: OwnerConfig;
  onSubmitJob: (job: Omit<JobRequest, 'id' | 'createdAt' | 'status'>) => void;
  onClose: () => void;
  isUrdu: boolean;
}

export function BookJobModal({
  worker,
  defaultTrade = 'electrician',
  userLocation,
  ownerConfig,
  onSubmitJob,
  onClose,
  isUrdu,
}: BookJobModalProps) {
  const [selectedTrade, setSelectedTrade] = useState<'electrician' | 'plumber' | 'ac_technician'>(
    worker ? worker.trade : defaultTrade === 'all' ? 'electrician' : defaultTrade
  );

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('03');
  const [customerEmail, setCustomerEmail] = useState(ownerConfig.currentUserEmail || '');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [address, setAddress] = useState(
    userLocation.address || `${userLocation.area}, ${userLocation.city}`
  );
  const [isUrgent, setIsUrgent] = useState(false);

  const isCustomerOwner =
    customerEmail.trim().toLowerCase() === ownerConfig.ownerEmail.toLowerCase();

  // Determine platform fee based on hidden fee system & owner status
  const platformFee = isCustomerOwner
    ? 0
    : ownerConfig.feeSystemEnabled
    ? ownerConfig.platformFeePkr
    : 0;

  const currentServices = TRADE_SERVICES[selectedTrade] || [];
  const selectedService = currentServices.find((s) => s.id === selectedServiceId);
  const estimatedWorkPrice = selectedService ? selectedService.estimatedPricePkr : 1000;
  const visitFee = worker ? worker.visitFeePkr : 450;
  const totalEstimate = visitFee + estimatedWorkPrice + platformFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please provide your name and phone number.');
      return;
    }

    const title = selectedService
      ? selectedService.nameEn
      : `${selectedTrade.replace('_', ' ').toUpperCase()} Service Request`;

    onSubmitJob({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      trade: selectedTrade,
      title,
      description: issueDescription.trim() || title,
      address: address.trim(),
      city: userLocation.city,
      area: userLocation.area,
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      isUrgent,
      estimatedFeePkr: totalEstimate,
      platformFeePkr: platformFee,
      assignedWorkerId: worker?.id,
      assignedWorkerName: worker?.name,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div>
            <h3 className="font-bold text-white text-base">
              {worker
                ? `${isUrdu ? 'بکنگ برائے' : 'Book'} ${worker.name}`
                : isUrdu
                ? 'فوری کاریگر طلب کریں'
                : 'Request KaamWala Service'}
            </h3>
            <p className="text-[11px] text-neutral-400">
              {userLocation.city} • Direct technician dispatch
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Owner Exemption Banner if email is owner */}
          {isCustomerOwner && (
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <strong>OWNER VIP STATUS ACTIVE ({ownerConfig.ownerEmail}):</strong> Platform fee is completely Waived (Rs. 0)!
              </div>
            </div>
          )}

          {/* Trade Selector (if not assigned to specific worker) */}
          {!worker && (
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                {isUrdu ? 'مطلوبہ ہنر' : 'Required Trade'}:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['electrician', 'plumber', 'ac_technician'] as const).map((t) => {
                  const isSelected = selectedTrade === t;
                  const Icon = t === 'electrician' ? Zap : t === 'plumber' ? Wrench : Wind;
                  const label = t === 'electrician' ? 'Electrician' : t === 'plumber' ? 'Plumber' : 'AC Tech';
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => {
                        setSelectedTrade(t);
                        setSelectedServiceId('');
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow'
                          : 'border-neutral-800 bg-neutral-800/60 text-neutral-400 hover:bg-neutral-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Common Services Dropdown */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              {isUrdu ? 'کام کی نوعیت' : 'Service Type / Common Task'}:
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">General Inspection / Diagnostics</option>
              {currentServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nameEn} (Rs. ~{s.estimatedPricePkr})
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              {isUrdu ? 'مسئلے کی تفصیل' : 'Explain Fault / Specific Instructions'}:
            </label>
            <textarea
              rows={2}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="e.g. Inverter AC throwing E6 error, or short circuit in kitchen breaker..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Your Name *:
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Asad Farooq"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                WhatsApp / Mobile Number *:
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="03001234567"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Email for Owner Verification */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-300">
                Email Address (Optional / Owner Verification):
              </label>
              {customerEmail === ownerConfig.ownerEmail && (
                <span className="text-[10px] text-amber-400 font-semibold">
                  Owner Verified!
                </span>
              )}
            </div>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="e.g. mk3738766@gmail.com"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Address */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-300">
                Complete Address & Landmark *:
              </label>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {userLocation.city}
              </span>
            </div>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House #, Street #, Sector, Landmark..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Emergency Urgent Checkbox */}
          <div
            onClick={() => setIsUrgent(!isUrgent)}
            className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              isUrgent
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                : 'bg-neutral-800/40 border-neutral-700/60 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className={`w-4 h-4 ${isUrgent ? 'text-rose-400' : 'text-neutral-400'}`} />
              <div>
                <div className="font-bold text-xs">
                  {isUrdu ? 'ایمرجنسی سروس (30 منٹ میں آمد)' : '🚨 Urgent Emergency Service (30-min dispatch)'}
                </div>
                <div className="text-[10px] text-neutral-400">
                  Priority alert sent to all nearby on-duty technicians
                </div>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
              isUrgent ? 'bg-rose-500 border-rose-400 text-white' : 'border-neutral-600'
            }`}>
              {isUrgent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* Transparent Cost Breakdown */}
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1 text-xs">
            <div className="flex items-center justify-between text-neutral-400">
              <span>Inspection / Visiting Charge:</span>
              <span className="text-white">Rs. {visitFee}</span>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span>Estimated Work/Repair Cost:</span>
              <span className="text-white">Rs. ~{estimatedWorkPrice}</span>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span>Platform Service Fee:</span>
              {isCustomerOwner ? (
                <span className="text-amber-400 font-bold">
                  Rs. 0 (Owner FREE Exemption)
                </span>
              ) : platformFee === 0 ? (
                <span className="text-emerald-400 font-bold">
                  Rs. 0 (Free Promotion)
                </span>
              ) : (
                <span className="text-white font-bold">Rs. {platformFee}</span>
              )}
            </div>
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-sm font-bold text-emerald-400">
              <span>Estimated Total:</span>
              <span>Rs. ~{totalEstimate}</span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950 transition-all flex items-center justify-center gap-2"
            >
              <span>{isUrdu ? 'آرڈر کنفرم کریں' : 'Confirm Booking Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
