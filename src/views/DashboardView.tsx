import React, { useMemo, useState } from 'react';
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
  BarChart2,
  BarChart3,
  LineChart as LineChartIcon,
} from 'lucide-react';
import { TabType } from '../components/Sidebar';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

interface DashboardViewProps {
  onNavigate: (tab: TabType) => void;
}

// Custom Tooltip for Recharts
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div dir="rtl" className="bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl text-xs space-y-1.5 border border-slate-700/50 backdrop-blur-md">
        <p className="font-bold text-slate-200 border-b border-slate-800/80 pb-1 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-extrabold text-white">{Number(entry.value).toLocaleString('ar-EG')} كجم</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { analyticsState, injectionRecords, autoPackagingRecords, manualPackagingRecords } = useFactory();
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar');

  const totalFinishedOutputKg = analyticsState.totalInjectionFinishedKg + analyticsState.totalAutoPackKg;

  // Custom helper for local date string YYYY-MM-DD
  const formatLocalDateString = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getDisplayDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      const monthName = d.toLocaleDateString('ar-EG', { month: 'short' });
      return `${day} ${monthName}`;
    }
    return dateStr;
  };

  // Aggregate daily production by date
  const dailyData = useMemo(() => {
    const dateMap: Record<
      string,
      {
        date: string;
        displayDate: string;
        injectionKg: number;
        autoPackKg: number;
        manualPackKg: number;
      }
    > = {};

    // Seed with last 7 days using local dates
    const today = new Date();
    const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    for (let i = 6; i >= 0; i--) {
      const d = new Date(localToday);
      d.setDate(d.getDate() - i);
      const dateStr = formatLocalDateString(d);
      const displayDate = getDisplayDate(dateStr);
      dateMap[dateStr] = {
        date: dateStr,
        displayDate,
        injectionKg: 0,
        autoPackKg: 0,
        manualPackKg: 0,
      };
    }

    // Add injection records
    injectionRecords.forEach((r) => {
      if (!dateMap[r.date]) {
        const displayDate = getDisplayDate(r.date);
        dateMap[r.date] = { date: r.date, displayDate, injectionKg: 0, autoPackKg: 0, manualPackKg: 0 };
      }
      dateMap[r.date].injectionKg += r.finishedMouthpiecesWeightKg;
    });

    // Add auto packaging records
    autoPackagingRecords.forEach((r) => {
      if (!dateMap[r.date]) {
        const displayDate = getDisplayDate(r.date);
        dateMap[r.date] = { date: r.date, displayDate, injectionKg: 0, autoPackKg: 0, manualPackKg: 0 };
      }
      dateMap[r.date].autoPackKg += r.netShiftWeightKg;
    });

    // Add manual packaging records
    manualPackagingRecords.forEach((r) => {
      if (!dateMap[r.date]) {
        const displayDate = getDisplayDate(r.date);
        dateMap[r.date] = { date: r.date, displayDate, injectionKg: 0, autoPackKg: 0, manualPackKg: 0 };
      }
      dateMap[r.date].manualPackKg += r.netMouthpiecesWeightKg;
    });

    return Object.values(dateMap)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((item) => ({
        displayDate: item.displayDate,
        'حقن (كغ)': Number(item.injectionKg.toFixed(1)),
        'تغليف آلي (كغ)': Number(item.autoPackKg.toFixed(1)),
        'تعبئة يدوية (كغ)': Number(item.manualPackKg.toFixed(1)),
        'الإجمالي (كغ)': Number((item.injectionKg + item.autoPackKg + item.manualPackKg).toFixed(1)),
      }));
  }, [injectionRecords, autoPackagingRecords, manualPackagingRecords]);

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

      {/* Daily Production Recharts Chart Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-600" />
              مخطط إجمالي الإنتاج اليومي للمباسم (بالكجم)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              توزيع الكميات الصافية المسجلة يومياً عبر أقسام المصنع المختلفة
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                chartType === 'bar'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>أعمدة</span>
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                chartType === 'area'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LineChartIcon className="w-3.5 h-3.5" />
              <span>مساحة متصلة</span>
            </button>
          </div>
        </div>

        {/* Chart Container (LTR wrapped to avoid SVG coordinate inversion in RTL) */}
        <div dir="ltr" className="h-[340px] w-full pt-2 [direction:ltr]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={dailyData} margin={{ top: 15, right: 5, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="displayDate"
                  interval={0}
                  tick={{ fontSize: 9, fill: '#475569', fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  width={38}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`)}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '16px', fontSize: '12px', fontWeight: 700 }}
                  iconType="circle"
                />
                <Bar dataKey="حقن (كغ)" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar dataKey="تغليف آلي (كغ)" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar dataKey="تعبئة يدوية (كغ)" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            ) : (
              <AreaChart data={dailyData} margin={{ top: 15, right: 5, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorInj" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorManual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="displayDate"
                  interval={0}
                  tick={{ fontSize: 9, fill: '#475569', fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  width={38}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`)}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '16px', fontSize: '12px', fontWeight: 700 }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="حقن (كغ)"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorInj)"
                />
                <Area
                  type="monotone"
                  dataKey="تغليف آلي (كغ)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorAuto)"
                />
                <Area
                  type="monotone"
                  dataKey="تعبئة يدوية (كغ)"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorManual)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
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
