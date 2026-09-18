import { useState } from 'react';
import { X, Check, ShieldCheck, Zap, Wrench, Wind, UserPlus, MapPin } from 'lucide-react';
import { Worker, UserLocation } from '../types';
import { PAKISTAN_CITIES } from '../data/pakistanData';

interface RegisterWorkerModalProps {
  userLocation: UserLocation;
  onRegister: (newWorker: Worker) => void;
  onClose: () => void;
  isUrdu: boolean;
}

export function RegisterWorkerModal({
  userLocation,
  onRegister,
  onClose,
  isUrdu,
}: RegisterWorkerModalProps) {
  const [trade, setTrade] = useState<'electrician' | 'plumber' | 'ac_technician'>('electrician');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('03');
  const [whatsapp, setWhatsapp] = useState('923');
  const [cnic, setCnic] = useState('');
  const [selectedCity, setSelectedCity] = useState(userLocation.city || 'Lahore');
  const [area, setArea] = useState(userLocation.area || 'Main City');
  const [experienceYears, setExperienceYears] = useState('5');
  const [visitFeePkr, setVisitFeePkr] = useState('500');
  const [hourlyRatePkr, setHourlyRatePkr] = useState('800');
  const [bio, setBio] = useState('');
  const [skillsText, setSkillsText] = useState('Wiring, Breaker Repair, Inverter');
  const [emergencyAvailable, setEmergencyAvailable] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please fill in your name and phone number.');
      return;
    }

    const cityObj = PAKISTAN_CITIES.find((c) => c.name === selectedCity) || PAKISTAN_CITIES[0];
    const latOffset = (Math.random() - 0.5) * 0.03;
    const lonOffset = (Math.random() - 0.5) * 0.03;

    const newWorker: Worker = {
      id: `w-custom-${Date.now()}`,
      name: name.trim(),
      trade,
      titleEn: `Certified ${trade.replace('_', ' ')} Expert`,
      titleUr: `مستند ${trade === 'electrician' ? 'الیکٹریشن' : trade === 'plumber' ? 'پلمبر' : 'اے سی کاریگر'}`,
      rating: 5.0,
      reviewsCount: 1,
      experienceYears: parseInt(experienceYears, 10) || 5,
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim().replace(/^0/, '92'),
      cnicVerified: Boolean(cnic.trim()),
      policeVerified: false,
      hourlyRatePkr: parseInt(hourlyRatePkr, 10) || 750,
      visitFeePkr: parseInt(visitFeePkr, 10) || 500,
      bioEn: bio.trim() || `Skilled professional with ${experienceYears} years experience in ${selectedCity}.`,
      bioUr: `ماہر کاریگر برائے ${selectedCity}`,
      skills: skillsText.split(',').map((s) => s.trim()).filter(Boolean),
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
      latitude: cityObj.latitude + latOffset,
      longitude: cityObj.longitude + lonOffset,
      city: selectedCity,
      area: area.trim(),
      isAvailable: true,
      emergencyAvailable,
      completedJobsCount: 12,
      reviews: [
        {
          id: `r-${Date.now()}`,
          userName: 'Verified Customer',
          userCity: selectedCity,
          rating: 5,
          comment: 'Prompt response and excellent work ethic.',
          date: 'Recent',
        },
      ],
    };

    onRegister(newWorker);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {isUrdu ? 'بطور کاریگر رجسٹریشن' : 'Join KaamWala as a Skilled Technician'}
              </h3>
              <p className="text-[11px] text-neutral-400">
                Electrician • Plumber • AC Technician (Pan-Pakistan)
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Trade selection */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
              Select Your Trade Category *:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['electrician', 'plumber', 'ac_technician'] as const).map((t) => {
                const isSelected = trade === t;
                const Icon = t === 'electrician' ? Zap : t === 'plumber' ? Wrench : Wind;
                const label = t === 'electrician' ? 'Electrician' : t === 'plumber' ? 'Plumber' : 'AC Tech';
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTrade(t)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
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

          {/* Full Name & CNIC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Full Name (as per CNIC) *:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ustad Imran Ali"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                NADRA CNIC Number:
              </label>
              <input
                type="text"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                placeholder="35201-1234567-1"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Contact Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Calling Mobile Number *:
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03001234567"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                WhatsApp Number:
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="923001234567"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* City & Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                City in Pakistan *:
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {PAKISTAN_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.nameUr})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Base Area / Sector *:
              </label>
              <input
                type="text"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Gulshan, DHA, F-7"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Rates and Experience */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Experience (Yrs):
              </label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Visit Fee (Rs):
              </label>
              <input
                type="number"
                value={visitFeePkr}
                onChange={(e) => setVisitFeePkr(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Hourly Rate (Rs):
              </label>
              <input
                type="number"
                value={hourlyRatePkr}
                onChange={(e) => setHourlyRatePkr(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Key skills */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Specific Tools / Specializations (comma separated):
            </label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="e.g. Inverter PCB, R410 Gas, PPRC Welding"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Emergency Availability Checkbox */}
          <div
            onClick={() => setEmergencyAvailable(!emergencyAvailable)}
            className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60 flex items-center justify-between cursor-pointer"
          >
            <div>
              <span className="text-xs font-bold text-white block">
                Available for 30-Minute Emergency Calls
              </span>
              <span className="text-[10px] text-neutral-400">
                Shows emergency badge on your card for urgent nighttime or blackout bookings
              </span>
            </div>
            <input
              type="checkbox"
              checked={emergencyAvailable}
              onChange={() => {}}
              className="w-4 h-4 rounded text-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{isUrdu ? 'رجسٹریشن مکمل کریں' : 'Complete Registration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
