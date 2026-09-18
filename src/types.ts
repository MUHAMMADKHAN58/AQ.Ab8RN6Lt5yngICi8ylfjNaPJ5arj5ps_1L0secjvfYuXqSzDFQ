export type TradeType = 'all' | 'electrician' | 'plumber' | 'ac_technician';

export interface ServiceItem {
  id: string;
  nameEn: string;
  nameUr: string;
  estimatedPricePkr: number;
  timeEstimate: string;
}

export interface WorkerReview {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Worker {
  id: string;
  name: string;
  trade: 'electrician' | 'plumber' | 'ac_technician';
  titleEn: string;
  titleUr: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  phone: string;
  whatsapp: string;
  email?: string;
  cnicVerified: boolean;
  policeVerified: boolean;
  hourlyRatePkr: number;
  visitFeePkr: number;
  bioEn: string;
  bioUr: string;
  skills: string[];
  photoUrl: string;
  latitude: number;
  longitude: number;
  city: string;
  area: string;
  isAvailable: boolean;
  emergencyAvailable: boolean;
  completedJobsCount: number;
  reviews: WorkerReview[];
}

export interface JobRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  trade: 'electrician' | 'plumber' | 'ac_technician';
  title: string;
  description: string;
  address: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  isUrgent: boolean;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  estimatedFeePkr: number;
  platformFeePkr: number;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
}

export interface PakistanCity {
  name: string;
  nameUr: string;
  province: string;
  latitude: number;
  longitude: number;
  popularAreas: string[];
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
  area: string;
  address: string;
  isGps: boolean;
  accuracy?: number;
}

export interface OwnerConfig {
  ownerEmail: string; // "mk3738766@gmail.com"
  feeSystemEnabled: boolean; // default: false
  platformFeePkr: number; // e.g. 150
  commissionPercent: number; // e.g. 5
  currentUserEmail: string;
  secretAccessCode: string;
}
