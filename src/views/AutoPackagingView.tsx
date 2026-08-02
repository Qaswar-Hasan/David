import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import { Gauge, Plus, Trash2, CheckCircle, Calendar, User, Scale } from 'lucide-react';

export const AutoPackagingView: React.FC = () => {
  const { machines, shifts, workers, autoPackagingRecords, addAutoPackagingRecord, deleteAutoPackagingRecord } = useFactory();

  const autoMachines = machines.filter(
    (m) => m.departmentName.includes('تغليف') || m.departmentId === 2
  );

  const [selectedMachineId, setSelectedMachineId] = useState<number>(autoMachines[0]?.id || 0);
  const [selectedShiftId, setSelectedShiftId] = useState<number>(shifts[0]?.id || 0);
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<number[]>([workers[0]?.id || 0]);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [startAccumulatedKg, setStartAccumulatedKg] = useState<string>('');
  const [endAccumulatedKg, setEndAccumulatedKg] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const startNum = parseFloat(startAccumulatedKg) || 0;
  const endNum = parseFloat(endAccumulatedKg) || 0;
  const netNum = Math.max(0, endNum - startNum);

  const toggleWorker = (id: number) => {
    setSelectedWorkerIds((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((wId) => wId !== id) : prev) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startAccumulatedKg || !endAccumulatedKg || endNum < startNum) {
      alert('يرجى تأكيد إدخال الوزن التراكمي للبدء والنهاية بشكل صحيح (وزن النهاية يجب أن يكون أكبر من أو يساوي البدء).');
      return;
    }

    const machine = machines.find((m) => m.id === selectedMachineId) || autoMachines[0];
    const shift = shifts.find((s) => s.id === selectedShiftId) || shifts[0];
    const workerNamesStr = workers
      .filter((w) => selectedWorkerIds.includes(w.id))
      .map((w) => w.name)
      .join('، ');

    addAutoPackagingRecord(
      date,
      machine?.id || 3,
      machine?.name || 'آلة تغليف آلي',
      shift?.id || 1,
      shift?.name || 'وردية صباحية',
      workerNamesStr || 'عمال الوردية',
      startNum,
      endNum,
      notes
    );

    setStartAccumulatedKg(endAccumulatedKg); // Set start for next shift to end of previous!
    setEndAccumulatedKg('');
    setNotes('');
    setSuccessMsg('تم حفظ سجل آلة التغليف الآلي بنجاح!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">قسم آلة التغليف الآلي (Automatic Packaging)</h2>
            <p className="text-xs text-slate-500 font-medium">تسجيل الأوزان التراكمية في بداية ونهاية الوردية وحساب الصافي</p>
          </div>
        </div>
        <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold self-start sm:self-center">
          Module B
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Entry Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-600" />
          تسجيل قراءة وردية تغليف آلي
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Machine */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">الآلة / الماكينة</label>
            <select
              value={selectedMachineId}
              onChange={(e) => setSelectedMachineId(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {autoMachines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Shift */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">الوردية</label>
            <select
              value={selectedShiftId}
              onChange={(e) => setSelectedShiftId(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {shifts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">تاريخ التسجيل</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Worker Multi-Selector Pills */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            العمال المكلفون بالوردية (يمكن اختيار أكثر من عامل)
          </label>
          <div className="flex flex-wrap gap-2">
            {workers.map((w) => {
              const isSelected = selectedWorkerIds.includes(w.id);
              return (
                <button
                  type="button"
                  key={w.id}
                  onClick={() => toggleWorker(w.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {w.name} ({w.role})
                </button>
              );
            })}
          </div>
        </div>

        {/* Accumulated Weights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              الوزن التراكمي في بداية الوردية (كغ)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="مثال: 1450.0"
              value={startAccumulatedKg}
              onChange={(e) => setStartAccumulatedKg(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              الوزن التراكمي في نهاية الوردية (كغ)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="مثال: 1580.5"
              value={endAccumulatedKg}
              onChange={(e) => setEndAccumulatedKg(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Live Calculation Preview */}
        {endNum >= startNum && startNum > 0 && (
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-800 block">صافي إنتاج الوردية المحسوب:</span>
              <span className="text-xl font-black text-emerald-700">{netNum.toFixed(1)} كغ</span>
            </div>
            <Scale className="w-8 h-8 text-emerald-500 opacity-60" />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">ملاحظات الوردية</label>
          <input
            type="text"
            placeholder="مثال: تم إيقاف الماكينة للتنظيف لمدة 15 دقيقة..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-5 h-5" />
          حفظ قراءة الوردية
        </button>
      </form>

      {/* History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          سجلات التغليف الآلي السابقة
        </h3>

        {autoPackagingRecords.length === 0 ? (
          <div className="text-center py-8 text-slate-400 font-medium text-sm">
            لا توجد سجلات تغليف آلي سابقة.
          </div>
        ) : (
          <div className="space-y-3">
            {autoPackagingRecords.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-200 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{r.machineName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {r.shiftName}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                    <span>بداية الوردية: <strong className="text-slate-900">{r.startAccumulatedWeightKg.toFixed(1)} كغ</strong></span>
                    <span>نهاية الوردية: <strong className="text-slate-900">{r.endAccumulatedWeightKg.toFixed(1)} كغ</strong></span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {r.workerNames}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {r.date}</span>
                    {r.notes && <span className="italic text-slate-500">"{r.notes}"</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-medium">صافي الإنتاج</div>
                    <div className="text-base font-bold text-emerald-700">{r.netShiftWeightKg.toFixed(1)} كغ</div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('هل أنت تأكد من حذف هذا السجل؟')) {
                        deleteAutoPackagingRecord(r.id);
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
