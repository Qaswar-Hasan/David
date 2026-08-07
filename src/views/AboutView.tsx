import React from 'react';
import {
  Info,
  UserCheck,
  Code2,
  Factory,
  ShieldCheck,
  Award,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto dir-rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-900/50 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 text-indigo-300 flex items-center justify-center font-black shrink-0 shadow-inner">
              <Factory className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">مبسمك عندي</h1>
                <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-md border border-indigo-400/30">
                  الإصدار 1.0.0
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 font-medium">
                النظام الموحد لإدارة وتتبع إنتاج المباسم البلاستيكية وحسابات العملاء
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Badge Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">معلومات مطور التطبيق</h2>
            <p className="text-xs text-slate-500 font-medium">Developer Information</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-slate-50 p-6 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-right">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md ring-4 ring-indigo-100 shrink-0">
              ق
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1 flex items-center justify-center sm:justify-start gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Developed By
              </div>
              <h3 className="text-2xl font-black text-slate-900">قسورة حسن</h3>
              <p className="text-xs text-slate-600 font-bold mt-1">QASWARA HASAN</p>
            </div>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-xs text-center sm:text-left">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">حقوق التطبيق والتطوير</span>
            <span className="text-xs font-black text-slate-800 dir-ltr block mt-0.5">
              Developed by QASWARA HASAN
            </span>
          </div>
        </div>
      </div>

      {/* Application Features Overview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">عن تطبيق مصنع المباسم (مبسمك عندي)</h2>
            <p className="text-xs text-slate-500 font-medium">خصائص مميزات وأقسام النظام</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              قسم الحقن (Module A)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              تسجيل خامات الحقن وتحديد الوزن النهائي والمخلفات مع حساب مؤشر الكفاءة الإنتاجية آلياً لكل آلة ووردية.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              التغليف الآلي (Module B)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              حساب الفرق التراكمي في أوزان التغليف الآلي للورديات وضمان الدقة والشفافية التامة.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              التعبئة اليدوية (Module C)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              تتبع أكياس العملاء (40 مبسم لكل كيس)، وطرح وزن تار الكيس وتصنيف المنتجات حسب نوع العميل ومحاسبتهم بدقة.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              التقارير الموحدة والطباعة
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              تصدير تقارير رسمية منسقة جاهزة للطباعة والتنزيل كملفات PDF أو المشاركة النصية الفورية.
            </p>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center py-4 text-xs font-semibold text-slate-500 space-y-1">
        <div>جميع الحقوق محفوظة © {new Date().getFullYear()} - مصنع المباسم البلاستيكية</div>
        <div className="font-bold text-indigo-600">Developed by QASWARA HASAN</div>
      </div>
    </div>
  );
};
