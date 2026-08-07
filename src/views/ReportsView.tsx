import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import {
  FileBarChart2,
  Printer,
  Copy,
  Download,
  Users,
  PieChart,
  Clock,
  Check,
  Factory,
  ShieldCheck,
  Award,
  Calendar,
  Layers,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { analyticsState, generateFormattedArabicReport } = useFactory();
  const [periodFilter, setPeriodFilter] = useState<'الكل' | 'أسبوعي' | 'شهري'>('الكل');
  const [copied, setCopied] = useState(false);

  const currentDate = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const reportId = `REP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}`;

  const handlePrintPdf = () => {
    window.print();
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateFormattedArabicReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const reportText = generateFormattedArabicReport();
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `تقرير_مصنع_المباسم_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Top Controls Toolbar (Hidden during print) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-sm">
              <FileBarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">صفحة التقارير والطباعة الرسمية</h2>
              <p className="text-xs text-slate-500 font-medium">مبسمك عندي - تصدير تقارير الإنتاج والحسابات كملف PDF احترافي</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrintPdf}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-indigo-200 transition-all hover:scale-[1.02]"
            >
              <Printer className="w-4 h-4" />
              <span>تحميل / طباعة كملف PDF</span>
            </button>

            <button
              onClick={handleCopyText}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
              title="نسخ نص التقرير"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copied ? 'تم النسخ' : 'نسخ النص'}</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
              title="تحميل كملف نصي"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>ملف نصي</span>
            </button>
          </div>
        </div>

        {/* Filter Period Chips */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 ml-2">الفترة الزمنية:</span>
          {(['الكل', 'أسبوعي', 'شهري'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setPeriodFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                periodFilter === filter
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Printable Formal PDF Document Sheet */}
      <div className="print-page bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-8 relative overflow-hidden dir-rtl">
        {/* Document Header Banner */}
        <div className="border-b-2 border-indigo-600 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-950 text-amber-400 border-2 border-amber-400/30 flex items-center justify-center font-black shadow-lg">
              <Factory className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">مصنع المباسم البلاستيكية</h1>
                <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-black rounded-md border border-indigo-200">
                  مبسمك عندي
                </span>
              </div>
              <p className="text-xs font-bold text-slate-600 mt-1">
                سجل المتابعة والإنتاج والتعبئة وحسابات العملاء الموحد
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                قسم الحقن (A) • التغليف الآلي (B) • التعبئة اليدوية (C)
              </p>
            </div>
          </div>

          <div className="text-right sm:text-left bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 min-w-[200px]">
            <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-extrabold mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>تاريخ التقرير:</span>
            </div>
            <p className="text-xs font-bold text-slate-800">{currentDate}</p>
            <div className="mt-2 text-[11px] text-slate-500 font-mono flex justify-between gap-2 border-t border-slate-200 pt-1">
              <span>رقم التقرير:</span>
              <span className="font-bold text-slate-700">{reportId}</span>
            </div>
          </div>
        </div>

        {/* Executive Summary Metrics Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
            <Award className="w-4 h-4 text-indigo-600" />
            ملخص المؤشرات الرئيسية للإنتاج
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-100">
              <span className="text-[11px] font-bold text-indigo-700 block">صافي إنتاج الحقن</span>
              <span className="text-lg sm:text-xl font-black text-indigo-900 mt-0.5 block">
                {analyticsState.totalInjectionFinishedKg.toFixed(2)} <span className="text-xs font-medium">كغ</span>
              </span>
            </div>

            <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-100">
              <span className="text-[11px] font-bold text-blue-700 block">وزن التغليف الآلي</span>
              <span className="text-lg sm:text-xl font-black text-blue-900 mt-0.5 block">
                {analyticsState.totalAutoPackagingKg.toFixed(2)} <span className="text-xs font-medium">كغ</span>
              </span>
            </div>

            <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-100">
              <span className="text-[11px] font-bold text-amber-800 block">التعبئة اليدوية (40 مبسم)</span>
              <span className="text-lg sm:text-xl font-black text-amber-900 mt-0.5 block">
                {analyticsState.totalManualPackagingKg.toFixed(2)} <span className="text-xs font-medium">كغ</span>
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-100">
              <span className="text-[11px] font-bold text-emerald-800 block">إجمالي عدد الأكياس</span>
              <span className="text-lg sm:text-xl font-black text-emerald-900 mt-0.5 block">
                {analyticsState.totalManualBagsCount} <span className="text-xs font-medium">كيس</span>
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Client Accounts Breakdown Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              جدول توزيع أكياس وحسابات العملاء
            </h3>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              إجمالي العملاء: {analyticsState.clientSummaries.length}
            </span>
          </div>

          {analyticsState.clientSummaries.length === 0 ? (
            <div className="p-6 text-center text-slate-400 font-medium text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              لا توجد سجلاّت أكياس منسوبة لعملاء في الفترة المحددة.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3">اسم العميل</th>
                    <th className="p-3">عدد الأكياس</th>
                    <th className="p-3">إجمالي المباسم (تقريبي)</th>
                    <th className="p-3">صافي الوزن (كغ)</th>
                    <th className="p-3">نسبة المساهمة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {analyticsState.clientSummaries.map((c) => {
                    const totalWeight = analyticsState.totalManualPackagingKg || 1;
                    const pct = ((c.totalNetMouthpiecesWeightKg / totalWeight) * 100).toFixed(1);
                    return (
                      <tr key={c.clientId} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{c.clientName}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md font-bold">
                            {c.totalBagsCount} كيس
                          </span>
                        </td>
                        <td className="p-3">{c.totalMouthpiecesCount.toLocaleString('ar-EG')} مبسم</td>
                        <td className="p-3 font-bold text-emerald-700">{c.totalNetMouthpiecesWeightKg.toFixed(2)} كغ</td>
                        <td className="p-3 font-mono text-slate-600">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 2: Shift Comparison Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              مقارنة وتفاصيل أداء الورديات (Shift Breakdown)
            </h3>
          </div>

          {analyticsState.shiftSummaries.length === 0 ? (
            <div className="p-6 text-center text-slate-400 font-medium text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              لا توجد ورديات سجلت إنتاجاً حتى الآن.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3">اسم الوردية</th>
                    <th className="p-3">ناتج الحقن (كغ)</th>
                    <th className="p-3">التغليف الآلي (كغ)</th>
                    <th className="p-3">التعبئة اليدوية (كغ)</th>
                    <th className="p-3">عدد الأكياس</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {analyticsState.shiftSummaries.map((s) => (
                    <tr key={s.shiftName} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{s.shiftName}</td>
                      <td className="p-3 font-mono">{s.injectionFinishedKg.toFixed(1)} كغ</td>
                      <td className="p-3 font-mono">{s.autoPackagingKg.toFixed(1)} كغ</td>
                      <td className="p-3 font-mono text-indigo-700 font-bold">{s.manualPackagingKg.toFixed(1)} كغ</td>
                      <td className="p-3 font-bold text-amber-800">{s.manualBagsCount} كيس</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 3: Waste & Material Loss Analysis */}
        <div className="space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-rose-600" />
            تحليل الجودة والهدر والفاقد
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">هدر مواد الحقن الأولية:</span>
              <span className="text-base font-black text-rose-600 mt-1 block">
                {analyticsState.totalInjectionWasteKg.toFixed(2)} كغ
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">فاقد وزن التعبئة اليدوية:</span>
              <span className="text-base font-black text-rose-600 mt-1 block">
                {analyticsState.totalPackagingLossKg.toFixed(2)} كغ
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">كفاءة إنتاجية الحقن العامة:</span>
              <span className="text-base font-black text-indigo-700 mt-1 block">
                {analyticsState.avgInjectionYieldPct.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Official Signatures & Stamp Footer */}
        <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-3 gap-4 text-center text-xs text-slate-700 font-semibold">
          <div className="space-y-8">
            <p className="font-bold text-slate-900">مسؤول الوردية / الإنتاج</p>
            <div className="border-b border-dashed border-slate-300 w-32 mx-auto pb-1 text-slate-400 font-serif italic text-[11px]">
              التوقيع: ...................
            </div>
          </div>

          <div className="space-y-8">
            <p className="font-bold text-slate-900">مشرف قسم الجودة والتعبئة</p>
            <div className="border-b border-dashed border-slate-300 w-32 mx-auto pb-1 text-slate-400 font-serif italic text-[11px]">
              التوقيع: ...................
            </div>
          </div>

          <div className="space-y-8">
            <p className="font-bold text-slate-900">اعتماد إدارة المصنع</p>
            <div className="border-2 border-slate-200 rounded-2xl w-24 h-12 mx-auto flex items-center justify-center text-[10px] text-slate-400 font-bold bg-slate-50/50">
              ختم الاعتماد
            </div>
          </div>
        </div>

        {/* Footer Hash */}
        <div className="text-center pt-2 text-[10px] text-slate-400 font-mono border-t border-slate-100 flex items-center justify-between">
          <span>نظام مصنع المباسم البلاستيكية - مبسمك عندي</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> موثق ومُصنّف آلياً
          </span>
        </div>
      </div>
    </div>
  );
};

