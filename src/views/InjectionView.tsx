import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import { Factory, Plus, Trash2, CheckCircle, AlertCircle, Calendar, User, Clock, Layers } from 'lucide-react';

export const InjectionView: React.FC = () => {
  const { machines, shifts, workers, injectionRecords, addInjectionRecord, deleteInjectionRecord } = useFactory();

  // Filter injection machines
  const injectionMachines = machines.filter(
    (m) => m.departmentName.includes('حقن') || m.departmentId === 1
  );

  // Form State
  const [selectedMachineId, setSelectedMachineId] = useState<number>(injectionMachines[0]?.id || 0);
  const [selectedShiftId, setSelectedShiftId] = useState<number>(shifts[0]?.id || 0);
  const [selectedOperatorId, setSelectedOperatorId] = useState<number>(workers[0]?.id || 0);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [rawMaterialKg, setRawMaterialKg] = useState<string>('');
  const [finishedKg, setFinishedKg] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const rawNum = parseFloat(rawMaterialKg) || 0;
  const finishedNum = parseFloat(finishedKg) || 0;
  const wasteNum = Math.max(0, rawNum - finishedNum);
  const yieldPct = rawNum > 0 ? (finishedNum / rawNum) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawMaterialKg || !finishedKg || rawNum <= 0) {
      alert('يرجى إدخال أوزان المواد الأولية والخرج بشكل صحيح.');
      return;
    }

    const machine = machines.find((m) => m.id === selectedMachineId) || injectionMachines[0];
    const shift = shifts.find((s) => s.id === selectedShiftId) || shifts[0];
    const operator = workers.find((w) => w.id === selectedOperatorId) || workers[0];

    addInjectionRecord(
      date,
      machine?.id || 1,
      machine?.name || 'آلة حقن',
      shift?.id || 1,
      shift?.name || 'وردية صباحية',
      operator?.id || 1,
      operator?.name || 'مشغل',
      rawNum,
      finishedNum,
      notes
    );

    setRawMaterialKg('');
    setFinishedKg('');
    setNotes('');
    setSuccessMsg('تم حفظ سجل قسم الحقن بنجاح!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Factory className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">قسم آلة الحقن (Injection Machine)</h2>
            <p className="text-xs text-slate-500 font-medium">تسجيل كميات الخرج والمواد الأولية وحساب الهدر</p>
          </div>
        </div>
        <div className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold self-start sm:self-center">
          Module A
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Entry Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-600" />
          تسجيل عملية حقن جديدة
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Machine selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">الآلة / الماكينة</label>
            <select
              value={selectedMachineId}
              onChange={(e) => setSelectedMachineId(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {injectionMachines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Shift selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">الوردية</label>
            <select
              value={selectedShiftId}
              onChange={(e) => setSelectedShiftId(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {shifts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.startTime} - {s.endTime})
                </option>
              ))}
            </select>
          </div>

          {/* Operator selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">مشغل الآلة / العامل</label>
            <select
              value={selectedOperatorId}
              onChange={(e) => setSelectedOperatorId(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.role})
                </option>
              ))}
            </select>
          </div>

          {/* Date picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">تاريخ التسجيل</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Weights inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              وزن المواد الأولية (كغ)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="مثال: 120.0"
              value={rawMaterialKg}
              onChange={(e) => setRawMaterialKg(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              وزن الخرج الصافي للمباسم (كغ)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="مثال: 114.5"
              value={finishedKg}
              onChange={(e) => setFinishedKg(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Live Calculation Preview Card */}
        {rawNum > 0 && (
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-indigo-700 block">وزن الهدر المحسوب:</span>
              <span className="text-lg font-bold text-rose-600">{wasteNum.toFixed(2)} كغ</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-indigo-700 block">نسبة الإنتاجية (Efficiency):</span>
              <span className="text-lg font-bold text-indigo-700">{yieldPct.toFixed(1)}%</span>
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">ملاحظات إضافية</label>
          <input
            type="text"
            placeholder="مثال: تم تغيير القالب، جودة البوليمر ممتازة..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-5 h-5" />
          حفظ سجل عملية الحقن
        </button>
      </form>

      {/* Historical Logs List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          سجلات عمليات الحقن السابقة
        </h3>

        {injectionRecords.length === 0 ? (
          <div className="text-center py-8 text-slate-400 font-medium text-sm">
            لا توجد سجلات حقن سابقة.
          </div>
        ) : (
          <div className="space-y-3">
            {injectionRecords.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-200 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{r.machineName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-bold">
                      {r.shiftName}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                    <span>مواد أولية: <strong className="text-slate-900">{r.rawMaterialWeightKg.toFixed(1)} كغ</strong></span>
                    <span>خرج صافي: <strong className="text-slate-900">{r.finishedMouthpiecesWeightKg.toFixed(1)} كغ</strong></span>
                    <span>هدر: <strong className="text-rose-600">{r.wasteWeightKg.toFixed(1)} كغ</strong></span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {r.operatorName}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {r.date}</span>
                    {r.notes && <span className="italic text-slate-500">"{r.notes}"</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-medium">الإنتاجية</div>
                    <div className="text-base font-bold text-indigo-700">{r.yieldPercentage.toFixed(1)}%</div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('هل أنت تأكد من حذف هذا السجل؟')) {
                        deleteInjectionRecord(r.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
