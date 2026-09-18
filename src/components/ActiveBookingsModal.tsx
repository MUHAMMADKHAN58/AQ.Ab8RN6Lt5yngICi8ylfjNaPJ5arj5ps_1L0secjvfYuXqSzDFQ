import { X, CheckCircle2, Clock, MapPin, Phone, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';
import { JobRequest, OwnerConfig } from '../types';

interface ActiveBookingsModalProps {
  bookings: JobRequest[];
  ownerConfig: OwnerConfig;
  onUpdateStatus: (id: string, status: JobRequest['status']) => void;
  onClose: () => void;
  isUrdu: boolean;
}

export function ActiveBookingsModal({
  bookings,
  ownerConfig,
  onUpdateStatus,
  onClose,
  isUrdu,
}: ActiveBookingsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div>
            <h3 className="font-bold text-white text-base">
              {isUrdu ? 'آپ کے آرڈرز اور بکنگز' : 'My Bookings & Service Requests'}
            </h3>
            <p className="text-[11px] text-neutral-400">
              {bookings.length} {bookings.length === 1 ? 'active task' : 'active tasks'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-3">
          {bookings.length === 0 ? (
            <div className="py-12 text-center text-neutral-400">
              <Clock className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
              <p className="font-semibold text-sm">No bookings yet</p>
              <p className="text-xs text-neutral-500 mt-1">
                Select a technician or post a job to see it tracked here.
              </p>
            </div>
          ) : (
            bookings.map((job) => {
              const isOwnerOrder =
                job.customerEmail.toLowerCase() === ownerConfig.ownerEmail.toLowerCase();

              return (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-bold text-emerald-400">
                          {job.trade.replace('_', ' ')}
                        </span>
                        {job.isUrgent && (
                          <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold border border-rose-500/30">
                            🚨 Urgent
                          </span>
                        )}
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            job.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : job.status === 'in_progress'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {job.status.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mt-1">{job.title}</h4>
                      <p className="text-xs text-neutral-400 mt-0.5">{job.description}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-emerald-400 text-sm">
                        Rs. {job.estimatedFeePkr}
                      </span>
                      {isOwnerOrder && (
                        <div className="text-[10px] text-amber-400 font-bold flex items-center justify-end gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Owner Free</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location and time */}
                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-900">
                    <div className="flex items-center gap-1.5 truncate max-w-[240px]">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{job.address}</span>
                    </div>
                    <span>{job.createdAt}</span>
                  </div>

                  {/* Worker assignment info if any */}
                  {job.assignedWorkerName && (
                    <div className="bg-neutral-900 p-2.5 rounded-xl text-xs flex items-center justify-between">
                      <span className="text-neutral-300">
                        Assigned: <strong className="text-white">{job.assignedWorkerName}</strong>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => window.open(`tel:${job.customerPhone}`)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-400"
                          title="Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => window.open(`https://wa.me/${job.customerPhone}`, '_blank')}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-400"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    {job.status !== 'completed' && (
                      <button
                        onClick={() => onUpdateStatus(job.id, 'completed')}
                        className="px-3 py-1 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Completed</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
