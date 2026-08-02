import React, { useState, useEffect } from 'react';
import { useFactory } from '../context/FactoryContext';
import { ShoppingBag, Plus, Trash2, CheckCircle, User, Calendar, Tag, AlertTriangle } from 'lucide-react';

export const ManualPackagingView: React.FC = () => {
  const { clients, bagTypes, shifts, workers, manualPackagingRecords, addManualPackagingRecord, deleteManualPackagingRecord } = useFactory();

  const [selectedClientId, setSelectedClientId] = useState<number>(clients[0]?.id || 0);
  const [selectedBagTypeId, setSelectedBagTypeId] = useState<number>(bagTypes[0]?.id || 0);
  const [selectedShiftId, setSelectedShiftId] = useState<number>(shifts[0]?.id || 0);
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<number[]>([workers[0]?.id || 0]);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Form inputs
  const [emptyBagTareGrams, setEmptyBagTareGrams] = useState<string>('4.5');
  const [unpackedWeightKg, setUnpackedWeightKg] = useState<string>('');
  const [totalPackedWeightKg, setTotalPackedWeightKg] = useState<string>('');
  const [mouthpiecesPerBag, setMouthpiecesPerBag] = useState<number>(40);
  const [notes, setNotes] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Update tare and bag types when client changes
  useEffect(() => {
    const clientBags = bagTypes.filter((b) => b.clientId === selectedClientId);
    if (clientBags.length > 0) {
      setSelectedBagTypeId(clientBags[0].id);
      setEmptyBagTareGrams(clientBags[0].emptyBagTareGrams.toString());
      setMouthpiecesPerBag(clientBags[0].mouthpiecesPerBag);
    } else {
      setEmptyBagTareGrams('4.5');
    }
  }, [selectedClientId, bagTypes]);

  // When bag type changes
  useEffect(() => {
    const selectedBag = bagTypes.find((b) => b.id === selectedBagTypeId);
    if (selectedBag) {
      setEmptyBagTareGrams(selectedBag.emptyBagTareGrams.toString());
      setMouthpiecesPerBag(selectedBag.mouthpiecesPerBag);
    }
  }, [selectedBagTypeId, bagTypes]);

  const tareNum = parseFloat(emptyBagTareGrams) || 4.5;
  const unpackedNum = parseFloat(unpackedWeightKg) || 0;
  const packedNum = parseFloat(totalPackedWeightKg) || 0;

  // Selected bag type info for avg mouthpiece weight
  const selectedBagObj = bagTypes.find((b) => b.id === selectedBagTypeId);
  const avgPieceGrams = selectedBagObj?.avgMouthpieceWeightGrams || 2.5;

  // Single bag expected total weight (g) = (40 * 2.5g) + 4.5g = 104.5g
  const singleBagTotalGrams = mouthpiecesPerBag * avgPieceGrams + tareNum;

  // Live Auto Calculations
  const calcTotalBags = packedNum > 0 && singleBagTotalGrams > 0 ? Math.round((packedNum * 1000) / singleBagTotalGrams) : 0;
  const calcMouthpiecesCount = calcTotalBags * mouthpiecesPerBag;
  const totalTareKg = (calcTotalBags * tareNum) / 1000.0;
  const calcNetMouthpiecesKg = Math.max(0, packedNum - totalTareKg);
  const calcLossKg = Math.max(0, unpackedNum - calcNetMouthpiecesKg);

  const toggleWorker = (id: number) => {
    setSelectedWorkerIds((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((wId) => wId !== id) : prev) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!totalPackedWeightKg || packedNum <= 0) {
      alert('يرجى إدخال الوزن الكلي للأكياس المعبأة (كغ) بشكل صحيح.');
      return;
    }

    const clientObj = clients.find((c) => c.id === selectedClientId) || clients[0];
    const bagTypeObj = bagTypes.find((b) => b.id === selectedBagTypeId);
    const shiftObj = shifts.find((s) => s.id === selectedShiftId) || shifts[0];
    const workerNamesStr = workers
      .filter((w) => selectedWorkerIds.includes(w.id))
      .map((w) => w.name)
      .join('، ');

    addManualPackagingRecord(
      date,
      clientObj?.id || 1,
      clientObj?.name || 'عميل عام',
      bagTypeObj?.id || null,
      bagTypeObj?.typeName || 'أكياس تعبئة 40 مبسم',
      shiftObj?.id || 1,
      shiftObj?.name || 'وردية صباحية',
      workerNamesStr || 'عمال التعبئة',
      tareNum,
      unpackedNum,
      packedNum,
      mouthpiecesPerBag,
      calcTotalBags,
      notes
    );

    setUnpackedWeightKg('');
    setTotalPackedWeightKg('');
    setNotes('');
    setSuccessMsg(`تم حفظ عملية التعبئة اليدوية بنجاح! (عدد الأكياس المحسوبة: ${calcTotalBags} كيس)`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">قسم التعبئة اليدوية (40 مبسم/كيس)</h2>
            <p className="text-xs text-slate-500 font-medium">حساب عدد الأكياس وصافي الوزن والفاقد حسب تصنيف العميل</p>
          </div>
        </div>
        <div className="px-3.5 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-bold self-start sm:self-center">
          Module C
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
          <Plus className="w-4 h-4 text-amber-600" />
          تسجيل دفعة تعبئة يدوية جديدة
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Client Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">العميل / المشترِي</label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Bag Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">نوع الكيس والمعيار</label>
            <select
              value={selectedBagTypeId}
              onChange={(e) => setSelectedBagTypeId(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {bagTypes
                .filter((b) => !b.clientId || b.clientId === selectedClientId)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.typeName} ({b.emptyBagTareGrams}g tare)
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Worker Multi-Selector Pills */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            العمال المكلفون بالتعبئة
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
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {w.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weights inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              وزن الكيس الفارغ (غرام Tare)
            </label>
            <input
              type="number"
              step="0.1"
              value={emptyBagTareGrams}
              onChange={(e) => setEmptyBagTareGrams(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              وزن المباسم قبل التعبئة (كغ)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="مثال: 26.0"
              value={unpackedWeightKg}
              onChange={(e) => setUnpackedWeightKg(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              إجمالي وزن الأكياس المعبأة (كغ)
            </label>
            <input
              type="number"
              step="0.001"
              placeholder="مثال: 26.125"
              value={totalPackedWeightKg}
              onChange={(e) => setTotalPackedWeightKg(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Live Calculation Preview Card */}
        {packedNum > 0 && (
          <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-3">
            <div className="text-xs font-bold text-amber-900 flex items-center justify-between border-b border-amber-200/60 pb-2">
              <span>🧮 نتائج الحساب الآلي (سعة الكيس: {mouthpiecesPerBag} مبسم)</span>
              <span className="bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-md">
                وزن الكيس التقديري: {singleBagTotalGrams.toFixed(1)}غ
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-white/90 p-3 rounded-xl border border-amber-100 shadow-2xs">
                <span className="text-[11px] text-slate-500 font-semibold block">عدد الأكياس المعبأة</span>
                <span className="text-lg font-black text-amber-800">{calcTotalBags} كيس</span>
              </div>

              <div className="bg-white/90 p-3 rounded-xl border border-amber-100 shadow-2xs">
                <span className="text-[11px] text-slate-500 font-semibold block">إجمالي المباسم</span>
                <span className="text-lg font-black text-slate-900">{calcMouthpiecesCount} مبسم</span>
              </div>

              <div className="bg-white/90 p-3 rounded-xl border border-amber-100 shadow-2xs">
                <span className="text-[11px] text-slate-500 font-semibold block">صافي وزن المباسم</span>
                <span className="text-lg font-black text-emerald-700">{calcNetMouthpiecesKg.toFixed(2)} كغ</span>
              </div>

              <div className="bg-white/90 p-3 rounded-xl border border-amber-100 shadow-2xs">
                <span className="text-[11px] text-slate-500 font-semibold block">فاقد التعبئة</span>
                <span className="text-lg font-black text-rose-600">{calcLossKg.toFixed(2)} كغ</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">ملاحظات التعبئة</label>
          <input
            type="text"
            placeholder="مثال: تم تجهيز طلبية خليل بالكامل..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-5 h-5" />
          حفظ عملية التعبئة اليدوية
        </button>
      </form>

      {/* History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          سجلات التعبئة اليدوية السابقة
        </h3>

        {manualPackagingRecords.length === 0 ? (
          <div className="text-center py-8 text-slate-400 font-medium text-sm">
            لا توجد سجلات تعبئة يدوية سابقة.
          </div>
        ) : (
          <div className="space-y-3">
            {manualPackagingRecords.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-200 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{r.clientName}</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">
                      {r.calculatedTotalBags} كيس ({r.calculatedTotalMouthpieces} مبسم)
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                    <span>النوع: <strong className="text-slate-800">{r.bagTypeName}</strong></span>
                    <span>الوزن الإجمالي: <strong className="text-slate-900">{r.totalPackedBagsWeightKg.toFixed(2)} كغ</strong></span>
                    <span>صافي المباسم: <strong className="text-emerald-700">{r.netMouthpiecesWeightKg.toFixed(2)} كغ</strong></span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {r.workerNames}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {r.date}</span>
                    {r.notes && <span className="italic text-slate-500">"{r.notes}"</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-medium">فاقد التعبئة</div>
                    <div className="text-sm font-bold text-rose-600">{r.packagingLossKg.toFixed(2)} كغ</div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('هل أنت تأكد من حذف هذا السجل؟')) {
                        deleteManualPackagingRecord(r.id);
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
