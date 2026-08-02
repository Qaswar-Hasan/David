import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import { ReportShareModal } from '../components/ReportShareModal';
import {
  FileBarChart2,
  Share2,
  Users,
  PieChart,
  Clock,
  TrendingUp,
  Percent,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { analyticsState, generateFormattedArabicReport } = useFactory();
  const [periodFilter, setPeriodFilter] = useState<'الكل' | 'أسبوعي' | 'شهري'>('الكل');
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <FileBarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">التقارير والإحصائيات الشاملة</h2>
              <p className="text-xs text-slate-500 font-medium">ملخص أداء المصنع، العملاء، والورديات والتعبئة</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all shrink-0 self-start sm:self-center"
        >
          <Share2 className="w-4 h-4" />
          تصدير التقرير
        </button>
      </div>

      {/* Period Filter Chips */}
      <div className="flex items-center gap-2">
        {(['الكل', 'أسبوعي', 'شهري'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setPeriodFilter(filter)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              periodFilter === filter
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Section 1: Client Breakdown */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Users className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            تقرير وحسابات العملاء (Client Breakdown)
          </h3>
        </div>

        {analyticsState.clientSummaries.length === 0 ? (
          <div className="text-center py-6 text-slate-400 font-medium text-sm">
            لا توجد بيانات عملاء مسجلة بعد.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analyticsState.clientSummaries.map((c) => (
              <div
                key={c.clientId}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-3 hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-base">{c.clientName}</h4>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold">
                    {c.totalBagsCount} كيس
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-medium">إجمالي المباسم:</span>
                    <span className="text-slate-900 font-bold">{c.totalMouthpiecesCount} مبسم</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-medium">صافي الوزن:</span>
                    <span className="text-emerald-700 font-bold">{c.totalNetMouthpiecesWeightKg.toFixed(2)} كغ</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Waste & Loss Analytics */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <PieChart className="w-5 h-5 text-rose-600" />
          <h3 className="text-base font-bold text-slate-900">
            تحليل الهدر والفاقد (Waste & Loss Analytics)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100">
            <span className="text-xs font-semibold text-rose-700 block">هدر قسم الحقن (مواد أولية)</span>
            <span className="text-xl font-black text-rose-600 mt-1 block">
              {analyticsState.totalInjectionWasteKg.toFixed(2)} كغ
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100">
            <span className="text-xs font-semibold text-rose-700 block">فاقد التعبئة اليدوية</span>
            <span className="text-xl font-black text-rose-600 mt-1 block">
              {analyticsState.totalPackagingLossKg.toFixed(2)} كغ
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <span className="text-xs font-semibold text-indigo-700 block">نسبة الكفاءة العامة للحقن</span>
            <span className="text-xl font-black text-indigo-700 mt-1 block">
              {analyticsState.avgInjectionYieldPct.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>مؤشر إنتاجية كفاءة مواد الحقن:</span>
            <span>{analyticsState.avgInjectionYieldPct.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, analyticsState.avgInjectionYieldPct))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Section 3: Shift Performance Comparison */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Clock className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            مقارنة أداء الورديات (Shift Comparison)
          </h3>
        </div>

        {analyticsState.shiftSummaries.length === 0 ? (
          <div className="text-center py-6 text-slate-400 font-medium text-sm">
            لا توجد ورديات مسجلة بعد.
          </div>
        ) : (
          <div className="space-y-3">
            {analyticsState.shiftSummaries.map((s) => (
              <div
                key={s.shiftName}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{s.shiftName}</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    حقن: <strong className="text-slate-800">{s.injectionFinishedKg.toFixed(1)} كغ</strong> | تغليف آلي: <strong className="text-slate-800">{s.autoPackagingKg.toFixed(1)} كغ</strong>
                  </p>
                </div>

                <div className="text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                  <span className="text-xs text-slate-500 font-medium block">تعبئة يدوية: {s.manualBagsCount} كيس</span>
                  <span className="text-sm font-bold text-indigo-700">{s.manualPackagingKg.toFixed(1)} كغ</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showReportModal && (
        <ReportShareModal
          reportText={generateFormattedArabicReport()}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};
