import { useState } from 'react';
import { MapPin, Navigation, X, Check, Search, Compass } from 'lucide-react';
import { PakistanCity, UserLocation } from '../types';
import { PAKISTAN_CITIES } from '../data/pakistanData';

interface LocationPickerModalProps {
  currentLocation: UserLocation;
  onSelectLocation: (location: UserLocation) => void;
  onTriggerGps: () => void;
  isGpsLoading: boolean;
  onClose: () => void;
  isUrdu: boolean;
}

export function LocationPickerModal({
  currentLocation,
  onSelectLocation,
  onTriggerGps,
  isGpsLoading,
  onClose,
  isUrdu,
}: LocationPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<PakistanCity>(
    PAKISTAN_CITIES.find((c) => c.name.toLowerCase() === currentLocation.city.toLowerCase()) || PAKISTAN_CITIES[0]
  );
  const [customArea, setCustomArea] = useState(currentLocation.area || '');

  const filteredCities = PAKISTAN_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nameUr.includes(searchQuery) ||
      c.province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyCityAndArea = (city: PakistanCity, area: string) => {
    // Slight random offset for areas to simulate realistic local coordinates
    const latOffset = (Math.random() - 0.5) * 0.04;
    const lonOffset = (Math.random() - 0.5) * 0.04;

    onSelectLocation({
      latitude: city.latitude + latOffset,
      longitude: city.longitude + lonOffset,
      city: city.name,
      area: area || city.popularAreas[0],
      address: `${area || city.popularAreas[0]}, ${city.name}, ${city.province}`,
      isGps: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {isUrdu ? 'پاکستان میں اپنا علاقہ منتخب کریں' : 'Pan-Pakistan Location'}
              </h3>
              <p className="text-[11px] text-neutral-400">
                Real-time GPS • No Lahore Fixed • Works across all cities
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

        {/* Body Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Live GPS Button */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Navigation className={`w-5 h-5 ${isGpsLoading ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-emerald-300">
                  {isUrdu ? 'براہ راست GPS لوکیشن حاصل کریں' : 'Detect My Live GPS Location'}
                </h4>
                <p className="text-[11px] text-neutral-400">
                  High-accuracy coordinate detection in browser
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onTriggerGps();
                onClose();
              }}
              disabled={isGpsLoading}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm shrink-0"
            >
              {isGpsLoading ? 'Finding...' : isUrdu ? 'GPS آن کریں' : 'Use GPS'}
            </button>
          </div>

          {/* Current selected label */}
          <div className="text-xs bg-neutral-800/80 px-3 py-2 rounded-xl border border-neutral-700/60 flex items-center justify-between">
            <span className="text-neutral-400">Currently active:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {currentLocation.area}, {currentLocation.city} ({currentLocation.latitude.toFixed(2)}°N, {currentLocation.longitude.toFixed(2)}°E)
            </span>
          </div>

          {/* City search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isUrdu ? 'شہر تلاش کریں (کراچی، لاہور، اسلام آباد، پشاور...)' : 'Search city (Karachi, Lahore, Islamabad, Peshawar...)'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-800/90 border border-neutral-700 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Cities Grid */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-2">
              {isUrdu ? 'پاکستان کے تمام بڑے شہر' : 'All Pakistan Cities & Regions'}:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredCities.map((city) => {
                const isCurrent = selectedCity.name === city.name;
                return (
                  <button
                    key={city.name}
                    onClick={() => {
                      setSelectedCity(city);
                      setCustomArea(city.popularAreas[0]);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                        : 'border-neutral-800 bg-neutral-800/60 hover:bg-neutral-800 text-neutral-200'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-white">{city.name}</div>
                      <div className="font-urdu text-[11px] text-neutral-400">{city.nameUr}</div>
                      <div className="text-[10px] text-neutral-500">{city.province}</div>
                    </div>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Popular Areas in selected city */}
          <div className="border-t border-neutral-800 pt-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-neutral-300">
                {isUrdu ? 'علاقہ یا سیکٹر منتخب کریں' : `Select Area in ${selectedCity.name}`}:
              </label>
              <span className="text-[11px] text-neutral-500 font-urdu">{selectedCity.nameUr}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {selectedCity.popularAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => setCustomArea(area)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    customArea === area
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-neutral-800 border-neutral-700/60 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>

            {/* Custom area text input */}
            <input
              type="text"
              placeholder="Or enter custom street / colony name..."
              value={customArea}
              onChange={(e) => setCustomArea(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-neutral-800 flex items-center justify-between bg-neutral-900/90">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleApplyCityAndArea(selectedCity, customArea)}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-emerald-950 flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Location</span>
          </button>
        </div>
      </div>
    </div>
  );
}
