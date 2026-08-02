export interface Client {
  id: number;
  name: String;
  phone?: string | null;
  notes?: string | null;
  createdAt: number;
}

export interface BagType {
  id: number;
  clientId?: number | null;
  clientName: string;
  typeName: string; // e.g., "أكياس خليل 40 مبسم شفاف"
  mouthpiecesPerBag: number; // default 40
  emptyBagTareGrams: number; // e.g. 4.5g or 5.0g
  avgMouthpieceWeightGrams: number; // e.g. 2.5g
  notes?: string | null;
}

export interface Department {
  id: number;
  name: string; // e.g., "قسم آلة الحقن", "قسم آلة التغليف الآلي", "قسم التعبئة اليدوية"
  code: string;
  isSystem?: boolean;
}

export interface Machine {
  id: number;
  name: string; // e.g., "حقن 01", "حقن 02", "تغليف 01"
  departmentId: number;
  departmentName: string;
  status: 'نشط' | 'صيانة';
}

export interface Shift {
  id: number;
  name: string; // e.g., "وردية صباحية", "وردية مسائية", "وردية ليلية"
  startTime: string; // "08:00"
  endTime: string; // "16:00"
}

export interface Worker {
  id: number;
  name: string;
  role: string; // "حقن", "تغليف آلي", "تعبئة يدوية", "مشرف"
  phone?: string | null;
}

export interface InjectionRecord {
  id: number;
  date: string; // YYYY-MM-DD
  timestamp: number;
  machineId: number;
  machineName: string;
  shiftId: number;
  shiftName: string;
  operatorId: number;
  operatorName: string;
  rawMaterialWeightKg: number; // وزن المواد الأولية (كغ)
  finishedMouthpiecesWeightKg: number; // وزن الخرج بعد الانتهاء (كغ)
  wasteWeightKg: number; // وزن الهدر (كغ) = rawMaterial - finished
  yieldPercentage: number; // نسبة الإنتاجية = (finished / rawMaterial) * 100
  notes?: string | null;
}

export interface AutoPackagingRecord {
  id: number;
  date: string; // YYYY-MM-DD
  timestamp: number;
  machineId: number;
  machineName: string;
  shiftId: number;
  shiftName: string;
  workerNames: string; // e.g. "أحمد المحمد، سامر علي"
  startAccumulatedWeightKg: number; // الوزن التراكمي بداية الوردية
  endAccumulatedWeightKg: number; // الوزن التراكمي نهاية الوردية
  netShiftWeightKg: number; // صافي وزن الإنتاج = end - start
  notes?: string | null;
}

export interface ManualPackagingRecord {
  id: number;
  date: string; // YYYY-MM-DD
  timestamp: number;
  clientId: number;
  clientName: string; // e.g., "أكياس خليل", "أكياس يحيى"
  bagTypeId?: number | null;
  bagTypeName: string;
  shiftId: number;
  shiftName: string;
  workerNames: string;
  emptyBagsTareGrams: number;
  totalEmptyBagsWeightGrams: number;
  unpackedMouthpiecesWeightKg: number; // وزن المباسم غير المعبأة قبل التعبئة
  totalPackedBagsWeightKg: number; // الوزن الكلي للأكياس المعبأة
  mouthpiecesPerBag: number; // default 40
  calculatedTotalBags: number; // عدد الأكياس المعبأة
  calculatedTotalMouthpieces: number; // عدد المباسم الكلي
  netMouthpiecesWeightKg: number; // صافي وزن المباسم المنتجة
  packagingLossKg: number; // الفاقد أو الهدر
  notes?: string | null;
}

export interface ClientReportSummary {
  clientId: number;
  clientName: string;
  totalBagsCount: number;
  totalMouthpiecesCount: number;
  totalPackedWeightKg: number;
  totalNetMouthpiecesWeightKg: number;
  totalLossKg: number;
}

export interface ShiftPerformanceSummary {
  shiftName: string;
  injectionCount: number;
  injectionFinishedKg: number;
  autoPackagingKg: number;
  manualPackagingKg: number;
  manualBagsCount: number;
}

export interface FactoryAnalyticsState {
  totalInjectionRawKg: number;
  totalInjectionFinishedKg: number;
  totalInjectionWasteKg: number;
  avgInjectionYieldPct: number;
  totalAutoPackKg: number;
  totalManualPackKg: number;
  totalManualBagsCount: number;
  totalManualMouthpiecesCount: number;
  totalPackagingLossKg: number;
  clientSummaries: ClientReportSummary[];
  shiftSummaries: ShiftPerformanceSummary[];
}
