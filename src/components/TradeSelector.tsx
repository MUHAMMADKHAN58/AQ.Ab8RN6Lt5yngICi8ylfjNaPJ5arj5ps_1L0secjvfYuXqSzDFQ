import { Zap, Wrench, Wind, CheckCircle, Flame } from 'lucide-react';
import { TradeType } from '../types';

interface TradeSelectorProps {
  selectedTrade: TradeType;
  onSelectTrade: (trade: TradeType) => void;
  isUrdu: boolean;
  counts: {
    all: number;
    electrician: number;
    plumber: number;
    ac_technician: number;
  };
}

export function TradeSelector({ selectedTrade, onSelectTrade, isUrdu, counts }: TradeSelectorProps) {
  const trades = [
    {
      id: 'all' as TradeType,
      titleEn: 'All Trades',
      titleUr: 'تمام ہنر مند',
      descEn: 'Electrician, Plumber & AC',
      descUr: 'الیکٹریشن، پلمبر اور اے سی',
      icon: CheckCircle,
      color: 'from-neutral-700 to-neutral-800 text-neutral-200',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/30',
      badgeColor: 'bg-neutral-800 text-neutral-300',
      count: counts.all,
    },
    {
      id: 'electrician' as TradeType,
      titleEn: 'Electrician',
      titleUr: 'الیکٹریشن',
      descEn: 'UPS, Solar, Wiring & DB Faults',
      descUr: 'یو پی ایس، سولر، وائرنگ اور بریکر',
      icon: Zap,
      color: 'from-amber-500/20 to-amber-600/10 text-amber-400',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-950/20',
      badgeColor: 'bg-amber-500/20 text-amber-300',
      count: counts.electrician,
    },
    {
      id: 'plumber' as TradeType,
      titleEn: 'Plumber',
      titleUr: 'پلمبر',
      descEn: 'Pipes, Motors, Geysers & Leakage',
      descUr: 'پائپ، موٹر، گیزر اور لیکیج',
      icon: Wrench,
      color: 'from-blue-500/20 to-blue-600/10 text-blue-400',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-950/20',
      badgeColor: 'bg-blue-500/20 text-blue-300',
      count: counts.plumber,
    },
    {
      id: 'ac_technician' as TradeType,
      titleEn: 'AC Technician',
      titleUr: 'اے سی ٹیکنیشن',
      descEn: 'Inverter PCB, Gas R410 & Jet Service',
      descUr: 'انورٹر کارڈ، گیس ریفل اور کیمیکل واش',
      icon: Wind,
      color: 'from-cyan-500/20 to-cyan-600/10 text-cyan-400',
      activeBorder: 'border-cyan-500 ring-2 ring-cyan-500/30 bg-cyan-950/20',
      badgeColor: 'bg-cyan-500/20 text-cyan-300',
      count: counts.ac_technician,
    },
  ];

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span>{isUrdu ? 'مطلوبہ ہنر مند منتخب کریں' : 'Select Trade Category'}</span>
            <span className="text-xs font-normal text-neutral-400">
              ({isUrdu ? '3 بنیادی پیشے' : '3 Core Trades'})
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
          <Flame className="w-3.5 h-3.5" />
          <span>{isUrdu ? 'تصدیق شدہ کاریگر' : 'Verified Professionals'}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        {trades.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedTrade === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTrade(item.id)}
              className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? `${item.activeBorder} bg-neutral-800/90 shadow-lg`
                  : 'border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800/70 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.count} {isUrdu ? 'دستیاب' : 'Online'}
                </span>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-1">
                  <span className="font-bold text-sm sm:text-base text-white">
                    {item.titleEn}
                  </span>
                  <span className="font-urdu text-xs text-neutral-300">
                    {item.titleUr}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                  {isUrdu ? item.descUr : item.descEn}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
