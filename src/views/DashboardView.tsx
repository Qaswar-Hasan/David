import React from 'react';
import { useFactory } from '../context/FactoryContext';
import { StatCard } from '../components/StatCard';
import {
  Factory,
  Gauge,
  ShoppingBag,
  FileBarChart2,
  Database,
  Layers,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { TabType } from '../components/Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: TabType) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { analyticsState, injectionRecords, autoPackagingRecords, manualPackagingRecords } = useFactory();

  const totalFinishedOutputKg = analyticsState.totalInjectionFinishedKg + analyticsState.totalAutoPackKg;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner (Professional Polish Design matching DashboardScreen.kt) */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xl text-white shadow-inner">
                M
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">مصنع المباسم البلاستيكية</h2>
                <p className="text-xs sm:text-sm text-indigo-100 font-medium">
                  لوحة التحكم • التشغيل المباشر ورصد الأداء
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full md:w-auto">
            {/* Total output card */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <span className="text-xs font-semibold text-indigo-100 block">إجمالي الخرج الصافي</span>
              <div className="text-xl sm:text-2xl font-black mt-1 flex items-baseline gap-1">
                <span>{totalFinishedOutputKg.toFixed(1)}</span>
                <span className="text-xs font-normal text-indigo-200">كجم</span>
              </div>
            </div>

            {/* Waste Yield Efficiency container */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <span className="text-xs font-semibold text-indigo-100 block">نسبة الكفاءة العامة</span>
              <div className="text-xl sm:text-2xl font-black mt-1 flex items-baseline gap-1">
                <span>{analyticsState.avgInjectionYieldPct.toFixed(1)}</span>
                <span className="text-xs font-normal text-indigo-200">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Module Navigation Cards */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          أقسام الإنتاج والتسجيل المباشر
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('injection')}
            className="text-right p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Factory className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">Module A</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-1">قسم الحقن</h4>
              <p className="text-xs text-slate-500 font-medium">وزن المواد الأولية والخرج والهدر</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('autoPackaging')}
            className="text-right p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gauge className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Module B</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-1">التغليف الآلي</h4>
              <p className="text-xs text-slate-500 font-medium">الأوزان التراكمية وتعيين العمال</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('manualPackaging')}
            className="text-right p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">Module C</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-1">تعبئة 40 مبسم</h4>
              <p className="text-xs text-slate-500 font-medium">تصنيف وحسابات العملاء (خليل، يحيى)</p>
            </div>
          </button>
        </div>
      </div>

      {/* Stats Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="المواد الأولية للحقن"
          value={`${analyticsState.totalInjectionRawKg.toFixed(1)} كغ`}
          subtitle={`الهدر الصافي: ${analyticsState.totalInjectionWasteKg.toFixed(1)} كغ`}
          icon={Layers}
          iconBgColor="bg-indigo-50"
          iconTextColor="text-indigo-600"
        />

        <StatCard
          title="إنتاج التغليف الآلي"
          value={`${analyticsState.totalAutoPackKg.toFixed(1)} كغ`}
          subtitle="سجلات الورديات التراكمية"
          icon={Gauge}
          iconBgColor="bg-emerald-50"
          iconTextColor="text-emerald-600"
        />

        <StatCard
          title="التعبئة اليدوية (40 مبسم/كيس)"
          value={`${analyticsState.totalManualBagsCount} كيس (${analyticsState.totalManualMouthpiecesCount} مبسم)`}
          subtitle={`صافي الوزن: ${analyticsState.totalManualPackKg.toFixed(1)} كغ`}
          icon={ShoppingBag}
          iconBgColor="bg-amber-50"
          iconTextColor="text-amber-600"
        />
      </div>

      {/* Quick Admin & Reports Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('reports')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50/80 text-right flex items-center gap-4 transition-all shadow-2xs"
        >
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <FileBarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">التقارير والإحصائيات الشاملة</h4>
            <p className="text-xs text-slate-500 font-medium">تحليل أداء العملاء والهدر بالورديات</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('masterData')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50/80 text-right flex items-center gap-4 transition-all shadow-2xs"
        >
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">البيانات الأساسية (Master Data)</h4>
            <p className="text-xs text-slate-500 font-medium">إدارة العملاء والآلات والورديات والعمال</p>
          </div>
        </button>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-500" />
            آخر عمليات الإنتاج المسجلة
          </h3>
          <span className="text-xs font-semibold text-slate-400">تحديث مباشر</span>
        </div>

        {injectionRecords.length === 0 && autoPackagingRecords.length === 0 && manualPackagingRecords.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-medium text-sm">
            لا توجد سجلات إنتاج مدخلة بعد. استخدم الأقسام أعلاه لإضافة أول سجل.
          </div>
        ) : (
          <div className="space-y-3">
            {/* Show recent manual packaging entries */}
            {manualPackagingRecords.slice(0, 3).map((rec) => (
              <div
                key={`manual-${rec.id}`}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold">
                      تعبئة يدوية
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{rec.clientName}</h4>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {rec.calculatedTotalBags} كيس ({rec.calculatedTotalMouthpieces} مبسم) — صافي: {rec.netMouthpiecesWeightKg.toFixed(2)} كغ
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {rec.shiftName} | العمال: {rec.workerNames} | {rec.date}
                  </p>
                </div>
              </div>
            ))}

            {/* Show recent injection entries */}
            {injectionRecords.slice(0, 3).map((rec) => (
              <div
                key={`inj-${rec.id}`}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-bold">
                      حقن
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{rec.machineName}</h4>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    خرج: {rec.finishedMouthpiecesWeightKg.toFixed(1)} كغ (كفاءة: {rec.yieldPercentage.toFixed(1)}%)
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {rec.shiftName} | المشغل: {rec.operatorName} | {rec.date}
                  </p>
                </div>

                <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl text-xs font-bold shrink-0">
                  {rec.yieldPercentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
