import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Client,
  BagType,
  Department,
  Machine,
  Shift,
  Worker,
  InjectionRecord,
  AutoPackagingRecord,
  ManualPackagingRecord,
  FactoryAnalyticsState,
  ClientReportSummary,
  ShiftPerformanceSummary,
} from '../types';

interface FactoryContextType {
  clients: Client[];
  bagTypes: BagType[];
  departments: Department[];
  machines: Machine[];
  shifts: Shift[];
  workers: Worker[];
  injectionRecords: InjectionRecord[];
  autoPackagingRecords: AutoPackagingRecord[];
  manualPackagingRecords: ManualPackagingRecord[];
  analyticsState: FactoryAnalyticsState;

  // Master Data Actions
  addClient: (name: string, phone?: string | null, notes?: string | null) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: number) => void;

  addBagType: (
    clientId: number | null,
    clientName: string,
    typeName: string,
    mouthpiecesPerBag: number,
    tareGrams: number,
    avgWeightGrams: number,
    notes?: string | null
  ) => void;
  updateBagType: (bagType: BagType) => void;
  deleteBagType: (id: number) => void;

  addDepartment: (name: string, code: string) => void;
  deleteDepartment: (id: number) => void;

  addMachine: (name: string, departmentId: number, departmentName: string) => void;
  deleteMachine: (id: number) => void;

  addShift: (name: string, startTime: string, endTime: string) => void;
  deleteShift: (id: number) => void;

  addWorker: (name: string, role: string, phone?: string | null) => void;
  deleteWorker: (id: number) => void;

  // Production Module Actions
  addInjectionRecord: (
    date: string,
    machineId: number,
    machineName: string,
    shiftId: number,
    shiftName: string,
    operatorId: number,
    operatorName: string,
    rawMaterialKg: number,
    finishedKg: number,
    notes?: string | null
  ) => void;
  deleteInjectionRecord: (id: number) => void;

  addAutoPackagingRecord: (
    date: string,
    machineId: number,
    machineName: string,
    shiftId: number,
    shiftName: string,
    workerNames: string,
    startAccumulatedKg: number,
    endAccumulatedKg: number,
    notes?: string | null
  ) => void;
  deleteAutoPackagingRecord: (id: number) => void;

  addManualPackagingRecord: (
    date: string,
    clientId: number,
    clientName: string,
    bagTypeId: number | null,
    bagTypeName: string,
    shiftId: number,
    shiftName: string,
    workerNames: string,
    emptyBagsTareGrams: number,
    unpackedMouthpiecesKg: number,
    totalPackedBagsKg: number,
    mouthpiecesPerBag: number,
    calculatedTotalBags: number,
    notes?: string | null
  ) => void;
  deleteManualPackagingRecord: (id: number) => void;

  generateFormattedArabicReport: () => string;
  resetToDefaultData: () => void;
}

const FactoryContext = createContext<FactoryContextType | undefined>(undefined);

// Initial Seed Data
const defaultClients: Client[] = [
  { id: 1, name: 'أكياس خليل', phone: '0501234567', notes: 'عميل رئيسي - أكياس شفافة 40 مبسم', createdAt: Date.now() - 86400000 * 5 },
  { id: 2, name: 'أكياس يحيى', phone: '0507654321', notes: 'عميل أكياس مسموكة ملونة 40 مبسم', createdAt: Date.now() - 86400000 * 4 },
  { id: 3, name: 'أكياس النور', phone: '0551122334', notes: 'طلبيات تعبئة جودة عالية', createdAt: Date.now() - 86400000 * 2 },
];

const defaultBagTypes: BagType[] = [
  { id: 1, clientId: 1, clientName: 'أكياس خليل', typeName: 'أكياس خليل 40 مبسم شفاف', mouthpiecesPerBag: 40, emptyBagTareGrams: 4.5, avgMouthpieceWeightGrams: 2.5, notes: 'قياس قياسي' },
  { id: 2, clientId: 2, clientName: 'أكياس يحيى', typeName: 'أكياس يحيى 40 مبسم ملون', mouthpiecesPerBag: 40, emptyBagTareGrams: 5.0, avgMouthpieceWeightGrams: 2.5, notes: 'أكياس ملونة' },
  { id: 3, clientId: 3, clientName: 'أكياس النور', typeName: 'أكياس النور 40 مبسم جامبو', mouthpiecesPerBag: 40, emptyBagTareGrams: 4.8, avgMouthpieceWeightGrams: 2.6, notes: 'سماكة عالية' },
];

const defaultDepartments: Department[] = [
  { id: 1, name: 'قسم آلة الحقن', code: 'INJ', isSystem: true },
  { id: 2, name: 'قسم آلة التغليف الآلي', code: 'AUTOPACK', isSystem: true },
  { id: 3, name: 'قسم التعبئة اليدوية', code: 'MANPACK', isSystem: true },
];

const defaultMachines: Machine[] = [
  { id: 1, name: 'حقن 01', departmentId: 1, departmentName: 'قسم آلة الحقن', status: 'نشط' },
  { id: 2, name: 'حقن 02', departmentId: 1, departmentName: 'قسم آلة الحقن', status: 'نشط' },
  { id: 3, name: 'تغليف آلي 01', departmentId: 2, departmentName: 'قسم آلة التغليف الآلي', status: 'نشط' },
];

const defaultShifts: Shift[] = [
  { id: 1, name: 'وردية صباحية', startTime: '08:00', endTime: '16:00' },
  { id: 2, name: 'وردية مسائية', startTime: '16:00', endTime: '24:00' },
  { id: 3, name: 'وردية ليلية', startTime: '00:00', endTime: '08:00' },
];

const defaultWorkers: Worker[] = [
  { id: 1, name: 'أحمد المحمد', role: 'حقن', phone: '0501112233' },
  { id: 2, name: 'سامر علي', role: 'تغليف آلي', phone: '0504445566' },
  { id: 3, name: 'محمود الكردي', role: 'تعبئة يدوية', phone: '0507778899' },
  { id: 4, name: 'خالد العمري', role: 'مشرف', phone: '0509990011' },
];

const defaultInjectionRecords: InjectionRecord[] = [
  {
    id: 1,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    timestamp: Date.now() - 86400000,
    machineId: 1,
    machineName: 'حقن 01',
    shiftId: 1,
    shiftName: 'وردية صباحية',
    operatorId: 1,
    operatorName: 'أحمد المحمد',
    rawMaterialWeightKg: 120.0,
    finishedMouthpiecesWeightKg: 114.5,
    wasteWeightKg: 5.5,
    yieldPercentage: 95.4,
    notes: 'تشغيل ممتاز مع هدر منخفض',
  },
  {
    id: 2,
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
    machineId: 2,
    machineName: 'حقن 02',
    shiftId: 2,
    shiftName: 'وردية مسائية',
    operatorId: 1,
    operatorName: 'أحمد المحمد',
    rawMaterialWeightKg: 150.0,
    finishedMouthpiecesWeightKg: 141.0,
    wasteWeightKg: 9.0,
    yieldPercentage: 94.0,
    notes: 'تم فحص القوالب قبل البدء',
  },
];

const defaultAutoPackagingRecords: AutoPackagingRecord[] = [
  {
    id: 1,
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
    machineId: 3,
    machineName: 'تغليف آلي 01',
    shiftId: 1,
    shiftName: 'وردية صباحية',
    workerNames: 'سامر علي، محمود الكردي',
    startAccumulatedWeightKg: 1450.0,
    endAccumulatedWeightKg: 1580.5,
    netShiftWeightKg: 130.5,
    notes: 'انتظام سرعة التغليف الآلي',
  },
];

const defaultManualPackagingRecords: ManualPackagingRecord[] = [
  {
    id: 1,
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
    clientId: 1,
    clientName: 'أكياس خليل',
    bagTypeId: 1,
    bagTypeName: 'أكياس خليل 40 مبسم شفاف',
    shiftId: 1,
    shiftName: 'وردية صباحية',
    workerNames: 'محمود الكردي',
    emptyBagsTareGrams: 4.5,
    totalEmptyBagsWeightGrams: 1125,
    unpackedMouthpiecesWeightKg: 26.0,
    totalPackedBagsWeightKg: 26.125,
    mouthpiecesPerBag: 40,
    calculatedTotalBags: 250,
    calculatedTotalMouthpieces: 10000,
    netMouthpiecesWeightKg: 25.0,
    packagingLossKg: 1.0,
    notes: '250 كيس تعبئة يدوية للعميل خليل',
  },
  {
    id: 2,
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now() - 3600000,
    clientId: 2,
    clientName: 'أكياس يحيى',
    bagTypeId: 2,
    bagTypeName: 'أكياس يحيى 40 مبسم ملون',
    shiftId: 2,
    shiftName: 'وردية مسائية',
    workerNames: 'محمود الكردي، سامر علي',
    emptyBagsTareGrams: 5.0,
    totalEmptyBagsWeightGrams: 900,
    unpackedMouthpiecesWeightKg: 18.5,
    totalPackedBagsWeightKg: 18.9,
    mouthpiecesPerBag: 40,
    calculatedTotalBags: 180,
    calculatedTotalMouthpieces: 7200,
    netMouthpiecesWeightKg: 18.0,
    packagingLossKg: 0.5,
    notes: 'تعبئة أكياس يحيى ملونة',
  },
];

function loadLocal<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    console.error(`Error loading ${key} from localStorage`, e);
    return defaultVal;
  }
}

function saveLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
}

export const FactoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(() => loadLocal('pmf_clients', defaultClients));
  const [bagTypes, setBagTypes] = useState<BagType[]>(() => loadLocal('pmf_bagTypes', defaultBagTypes));
  const [departments, setDepartments] = useState<Department[]>(() => loadLocal('pmf_departments', defaultDepartments));
  const [machines, setMachines] = useState<Machine[]>(() => loadLocal('pmf_machines', defaultMachines));
  const [shifts, setShifts] = useState<Shift[]>(() => loadLocal('pmf_shifts', defaultShifts));
  const [workers, setWorkers] = useState<Worker[]>(() => loadLocal('pmf_workers', defaultWorkers));

  const [injectionRecords, setInjectionRecords] = useState<InjectionRecord[]>(() =>
    loadLocal('pmf_inj_records', defaultInjectionRecords)
  );
  const [autoPackagingRecords, setAutoPackagingRecords] = useState<AutoPackagingRecord[]>(() =>
    loadLocal('pmf_auto_records', defaultAutoPackagingRecords)
  );
  const [manualPackagingRecords, setManualPackagingRecords] = useState<ManualPackagingRecord[]>(() =>
    loadLocal('pmf_manual_records', defaultManualPackagingRecords)
  );

  // Sync to localStorage
  useEffect(() => saveLocal('pmf_clients', clients), [clients]);
  useEffect(() => saveLocal('pmf_bagTypes', bagTypes), [bagTypes]);
  useEffect(() => saveLocal('pmf_departments', departments), [departments]);
  useEffect(() => saveLocal('pmf_machines', machines), [machines]);
  useEffect(() => saveLocal('pmf_shifts', shifts), [shifts]);
  useEffect(() => saveLocal('pmf_workers', workers), [workers]);
  useEffect(() => saveLocal('pmf_inj_records', injectionRecords), [injectionRecords]);
  useEffect(() => saveLocal('pmf_auto_records', autoPackagingRecords), [autoPackagingRecords]);
  useEffect(() => saveLocal('pmf_manual_records', manualPackagingRecords), [manualPackagingRecords]);

  // Analytics Calculation
  const analyticsState = useMemo<FactoryAnalyticsState>(() => {
    const totalRawKg = injectionRecords.reduce((acc, r) => acc + r.rawMaterialWeightKg, 0);
    const totalFinishedKg = injectionRecords.reduce((acc, r) => acc + r.finishedMouthpiecesWeightKg, 0);
    const totalWasteKg = injectionRecords.reduce((acc, r) => acc + r.wasteWeightKg, 0);
    const avgYield = totalRawKg > 0 ? (totalFinishedKg / totalRawKg) * 100 : 0;

    const totalAutoKg = autoPackagingRecords.reduce((acc, r) => acc + r.netShiftWeightKg, 0);
    const totalManualKg = manualPackagingRecords.reduce((acc, r) => acc + r.netMouthpiecesWeightKg, 0);
    const totalManualBags = manualPackagingRecords.reduce((acc, r) => acc + r.calculatedTotalBags, 0);
    const totalManualMouthpieces = manualPackagingRecords.reduce((acc, r) => acc + r.calculatedTotalMouthpieces, 0);
    const totalPkgLoss = manualPackagingRecords.reduce((acc, r) => acc + r.packagingLossKg, 0);

    const clientSummaries: ClientReportSummary[] = clients.map((client) => {
      const clientRecords = manualPackagingRecords.filter(
        (r) => r.clientId === client.id || r.clientName === client.name
      );
      return {
        clientId: client.id,
        clientName: client.name,
        totalBagsCount: clientRecords.reduce((acc, r) => acc + r.calculatedTotalBags, 0),
        totalMouthpiecesCount: clientRecords.reduce((acc, r) => acc + r.calculatedTotalMouthpieces, 0),
        totalPackedWeightKg: clientRecords.reduce((acc, r) => acc + r.totalPackedBagsWeightKg, 0),
        totalNetMouthpiecesWeightKg: clientRecords.reduce((acc, r) => acc + r.netMouthpiecesWeightKg, 0),
        totalLossKg: clientRecords.reduce((acc, r) => acc + r.packagingLossKg, 0),
      };
    });

    const shiftSummaries: ShiftPerformanceSummary[] = shifts.map((shift) => {
      const injShift = injectionRecords.filter((r) => r.shiftName === shift.name);
      const autoShift = autoPackagingRecords.filter((r) => r.shiftName === shift.name);
      const manShift = manualPackagingRecords.filter((r) => r.shiftName === shift.name);

      return {
        shiftName: shift.name,
        injectionCount: injShift.length,
        injectionFinishedKg: injShift.reduce((acc, r) => acc + r.finishedMouthpiecesWeightKg, 0),
        autoPackagingKg: autoShift.reduce((acc, r) => acc + r.netShiftWeightKg, 0),
        manualPackagingKg: manShift.reduce((acc, r) => acc + r.netMouthpiecesWeightKg, 0),
        manualBagsCount: manShift.reduce((acc, r) => acc + r.calculatedTotalBags, 0),
      };
    });

    return {
      totalInjectionRawKg: totalRawKg,
      totalInjectionFinishedKg: totalFinishedKg,
      totalInjectionWasteKg: totalWasteKg,
      avgInjectionYieldPct: avgYield,
      totalAutoPackKg: totalAutoKg,
      totalManualPackKg: totalManualKg,
      totalManualBagsCount: totalManualBags,
      totalManualMouthpiecesCount: totalManualMouthpieces,
      totalPackagingLossKg: totalPkgLoss,
      clientSummaries,
      shiftSummaries,
    };
  }, [injectionRecords, autoPackagingRecords, manualPackagingRecords, clients, shifts]);

  // Actions
  const addClient = (name: string, phone?: string | null, notes?: string | null) => {
    if (!name.trim()) return;
    const newClient: Client = {
      id: Date.now(),
      name: name.trim(),
      phone: phone?.trim() || null,
      notes: notes?.trim() || null,
      createdAt: Date.now(),
    };
    setClients((prev) => [...prev, newClient]);
  };

  const updateClient = (updated: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const deleteClient = (id: number) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const addBagType = (
    clientId: number | null,
    clientName: string,
    typeName: string,
    mouthpiecesPerBag: number,
    tareGrams: number,
    avgWeightGrams: number,
    notes?: string | null
  ) => {
    if (!typeName.trim() || !clientName.trim()) return;
    const newBagType: BagType = {
      id: Date.now(),
      clientId,
      clientName: clientName.trim(),
      typeName: typeName.trim(),
      mouthpiecesPerBag,
      emptyBagTareGrams: tareGrams,
      avgMouthpieceWeightGrams: avgWeightGrams,
      notes: notes?.trim() || null,
    };
    setBagTypes((prev) => [...prev, newBagType]);
  };

  const updateBagType = (updated: BagType) => {
    setBagTypes((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const deleteBagType = (id: number) => {
    setBagTypes((prev) => prev.filter((b) => b.id !== id));
  };

  const addDepartment = (name: string, code: string) => {
    if (!name.trim()) return;
    const newDep: Department = {
      id: Date.now(),
      name: name.trim(),
      code: code.trim(),
      isSystem: false,
    };
    setDepartments((prev) => [...prev, newDep]);
  };

  const deleteDepartment = (id: number) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  const addMachine = (name: string, departmentId: number, departmentName: string) => {
    if (!name.trim()) return;
    const newMachine: Machine = {
      id: Date.now(),
      name: name.trim(),
      departmentId,
      departmentName,
      status: 'نشط',
    };
    setMachines((prev) => [...prev, newMachine]);
  };

  const deleteMachine = (id: number) => {
    setMachines((prev) => prev.filter((m) => m.id !== id));
  };

  const addShift = (name: string, startTime: string, endTime: string) => {
    if (!name.trim()) return;
    const newShift: Shift = {
      id: Date.now(),
      name: name.trim(),
      startTime: startTime.trim() || '08:00',
      endTime: endTime.trim() || '16:00',
    };
    setShifts((prev) => [...prev, newShift]);
  };

  const deleteShift = (id: number) => {
    setShifts((prev) => prev.filter((s) => s.id !== id));
  };

  const addWorker = (name: string, role: string, phone?: string | null) => {
    if (!name.trim()) return;
    const newWorker: Worker = {
      id: Date.now(),
      name: name.trim(),
      role: role.trim() || 'عامل تشغيل',
      phone: phone?.trim() || null,
    };
    setWorkers((prev) => [...prev, newWorker]);
  };

  const deleteWorker = (id: number) => {
    setWorkers((prev) => prev.filter((w) => w.id !== id));
  };

  const addInjectionRecord = (
    date: string,
    machineId: number,
    machineName: string,
    shiftId: number,
    shiftName: string,
    operatorId: number,
    operatorName: string,
    rawMaterialKg: number,
    finishedKg: number,
    notes?: string | null
  ) => {
    const wasteKg = Math.max(0, rawMaterialKg - finishedKg);
    const yieldPct = rawMaterialKg > 0 ? (finishedKg / rawMaterialKg) * 100 : 0;
    const today = new Date().toISOString().split('T')[0];

    const record: InjectionRecord = {
      id: Date.now(),
      date: date.trim() || today,
      timestamp: Date.now(),
      machineId,
      machineName,
      shiftId,
      shiftName,
      operatorId,
      operatorName,
      rawMaterialWeightKg: rawMaterialKg,
      finishedMouthpiecesWeightKg: finishedKg,
      wasteWeightKg: wasteKg,
      yieldPercentage: yieldPct,
      notes: notes?.trim() || null,
    };

    setInjectionRecords((prev) => [record, ...prev]);
  };

  const deleteInjectionRecord = (id: number) => {
    setInjectionRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const addAutoPackagingRecord = (
    date: string,
    machineId: number,
    machineName: string,
    shiftId: number,
    shiftName: string,
    workerNames: string,
    startAccumulatedKg: number,
    endAccumulatedKg: number,
    notes?: string | null
  ) => {
    const netKg = Math.max(0, endAccumulatedKg - startAccumulatedKg);
    const today = new Date().toISOString().split('T')[0];

    const record: AutoPackagingRecord = {
      id: Date.now(),
      date: date.trim() || today,
      timestamp: Date.now(),
      machineId,
      machineName,
      shiftId,
      shiftName,
      workerNames: workerNames.trim(),
      startAccumulatedWeightKg: startAccumulatedKg,
      endAccumulatedWeightKg: endAccumulatedKg,
      netShiftWeightKg: netKg,
      notes: notes?.trim() || null,
    };

    setAutoPackagingRecords((prev) => [record, ...prev]);
  };

  const deleteAutoPackagingRecord = (id: number) => {
    setAutoPackagingRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const addManualPackagingRecord = (
    date: string,
    clientId: number,
    clientName: string,
    bagTypeId: number | null,
    bagTypeName: string,
    shiftId: number,
    shiftName: string,
    workerNames: string,
    emptyBagsTareGrams: number,
    unpackedMouthpiecesKg: number,
    totalPackedBagsKg: number,
    mouthpiecesPerBag: number,
    calculatedTotalBags: number,
    notes?: string | null
  ) => {
    const totalTareGrams = calculatedTotalBags * emptyBagsTareGrams;
    const totalTareKg = totalTareGrams / 1000.0;
    const netMouthpiecesKg = Math.max(0, totalPackedBagsKg - totalTareKg);
    const calcMouthpiecesCount = calculatedTotalBags * mouthpiecesPerBag;
    const lossKg = Math.max(0, unpackedMouthpiecesKg - netMouthpiecesKg);
    const today = new Date().toISOString().split('T')[0];

    const record: ManualPackagingRecord = {
      id: Date.now(),
      date: date.trim() || today,
      timestamp: Date.now(),
      clientId,
      clientName,
      bagTypeId,
      bagTypeName,
      shiftId,
      shiftName,
      workerNames: workerNames.trim(),
      emptyBagsTareGrams,
      totalEmptyBagsWeightGrams: totalTareGrams,
      unpackedMouthpiecesWeightKg: unpackedMouthpiecesKg,
      totalPackedBagsWeightKg: totalPackedBagsKg,
      mouthpiecesPerBag,
      calculatedTotalBags: calculatedTotalBags,
      calculatedTotalMouthpieces: calcMouthpiecesCount,
      netMouthpiecesWeightKg: netMouthpiecesKg,
      packagingLossKg: lossKg,
      notes: notes?.trim() || null,
    };

    setManualPackagingRecords((prev) => [record, ...prev]);
  };

  const deleteManualPackagingRecord = (id: number) => {
    setManualPackagingRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const generateFormattedArabicReport = () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let text = `🏭 *تقرير إنتاج مصنع المباسم البلاستيكية* 🏭\n`;
    text += `📅 التاريخ والوقت: ${dateStr}\n`;
    text += `----------------------------------------\n`;
    text += `🔹 *قسم الحقن (Injection):*\n`;
    text += `• إجمالي المواد الأولية: ${analyticsState.totalInjectionRawKg.toFixed(2)} كغ\n`;
    text += `• إجمالي الخرج الصافي: ${analyticsState.totalInjectionFinishedKg.toFixed(2)} كغ\n`;
    text += `• إجمالي الهدر: ${analyticsState.totalInjectionWasteKg.toFixed(2)} كغ\n`;
    text += `• متوسط نسبة الإنتاجية: ${analyticsState.avgInjectionYieldPct.toFixed(1)}%\n\n`;

    text += `🔹 *قسم التغليف الآلي (Auto Packaging):*\n`;
    text += `• إجمالي الوزن المغلف: ${analyticsState.totalAutoPackKg.toFixed(2)} كغ\n\n`;

    text += `🔹 *قسم التعبئة اليدوية (Manual Packaging 40/bag):*\n`;
    text += `• إجمالي الأكياس المعبأة: ${analyticsState.totalManualBagsCount} كيس\n`;
    text += `• إجمالي المباسم المنتجة: ${analyticsState.totalManualMouthpiecesCount} مبسم\n`;
    text += `• صافي وزن المباسم: ${analyticsState.totalManualPackKg.toFixed(2)} كغ\n`;
    text += `• فاقد التعبئة اليدوية: ${analyticsState.totalPackagingLossKg.toFixed(2)} كغ\n\n`;

    text += `👥 *تفاصيل إنتاج العملاء / الأكياس:*\n`;
    analyticsState.clientSummaries.forEach((c) => {
      text += `▪️ *${c.clientName}*:\n`;
      text += `   - عدد الأكياس: ${c.totalBagsCount} كيس\n`;
      text += `   - عدد المباسم: ${c.totalMouthpiecesCount} مبسم\n`;
      text += `   - الصافي: ${c.totalNetMouthpiecesWeightKg.toFixed(2)} كغ\n`;
    });
    text += `\n⏱️ *أداء الورديات (Shifts):*\n`;
    analyticsState.shiftSummaries.forEach((s) => {
      text += `▪️ *${s.shiftName}*: حقن: ${s.injectionFinishedKg.toFixed(
        1
      )} كغ | تغليف آلي: ${s.autoPackagingKg.toFixed(1)} كغ | تعبئة يدوية: ${s.manualBagsCount} كيس (${s.manualPackagingKg.toFixed(
        1
      )} كغ)\n`;
    });
    text += `----------------------------------------\n`;
    text += `تم التوليد بواسطة تطبيق إدارة مصنع المباسم`;
    return text;
  };

  const resetToDefaultData = () => {
    setClients(defaultClients);
    setBagTypes(defaultBagTypes);
    setDepartments(defaultDepartments);
    setMachines(defaultMachines);
    setShifts(defaultShifts);
    setWorkers(defaultWorkers);
    setInjectionRecords(defaultInjectionRecords);
    setAutoPackagingRecords(defaultAutoPackagingRecords);
    setManualPackagingRecords(defaultManualPackagingRecords);
  };

  return (
    <FactoryContext.Provider
      value={{
        clients,
        bagTypes,
        departments,
        machines,
        shifts,
        workers,
        injectionRecords,
        autoPackagingRecords,
        manualPackagingRecords,
        analyticsState,
        addClient,
        updateClient,
        deleteClient,
        addBagType,
        updateBagType,
        deleteBagType,
        addDepartment,
        deleteDepartment,
        addMachine,
        deleteMachine,
        addShift,
        deleteShift,
        addWorker,
        deleteWorker,
        addInjectionRecord,
        deleteInjectionRecord,
        addAutoPackagingRecord,
        deleteAutoPackagingRecord,
        addManualPackagingRecord,
        deleteManualPackagingRecord,
        generateFormattedArabicReport,
        resetToDefaultData,
      }}
    >
      {children}
    </FactoryContext.Provider>
  );
};

export const useFactory = () => {
  const context = useContext(FactoryContext);
  if (!context) {
    throw new Error('useFactory must be used within a FactoryProvider');
  }
  return context;
};
