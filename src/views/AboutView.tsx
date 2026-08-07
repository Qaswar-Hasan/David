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
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-lg space-y-6 transition-colors">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">معلومات مطور التطبيق</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Developer Information</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-slate-950 p-6 sm:p-8 rounded-2xl border border-indigo-500/40 cyber-pro-card flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          {/* Animated Ambient Cyber Glow Backdrops */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-5 text-center sm:text-right">
            {/* Sharp Cyber Avatar Diamond */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 blur-sm opacity-80 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border border-indigo-400/50 text-indigo-300 flex items-center justify-center font-black text-2xl sm:text-3xl shadow-2xl backdrop-blur-md">
                <Code2 className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-black text-indigo-400 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" /> Lead Software Architect & Developer
              </div>
              
              {/* Ultra Sharp Pro Max Typography */}
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight animate-sharp-pro-text py-1 leading-none font-sans">
                قسورة حسن
              </h3>
              
              <div className="pt-1">
                <span className="text-xs font-black text-indigo-300 tracking-[0.2em] dir-ltr inline-block bg-slate-900/90 px-3.5 py-1.5 rounded-lg border border-indigo-500/40 shadow-inner">
                  QASWARA HASAN
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 bg-slate-900/90 px-6 py-4 rounded-xl border border-indigo-500/30 shadow-xl text-center sm:text-left backdrop-blur-md shrink-0">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-widest">حقوق التطوير والملكية</span>
            <span className="text-xs font-extrabold text-indigo-300 dir-ltr block mt-1 tracking-wider">
              Developed by QASWARA HASAN
            </span>
          </div>
        </div>
      </div>


      {/* Application Features Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">عن تطبيق مصنع المباسم (مبسمك عندي)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">خصائص مميزات وأقسام النظام</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              قسم الحقن (Module A)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              تسجيل خامات الحقن وتحديد الوزن النهائي والمخلفات مع حساب مؤشر الكفاءة الإنتاجية آلياً لكل آلة ووردية.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              التغليف الآلي (Module B)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              حساب الفرق التراكمي في أوزان التغليف الآلي للورديات وضمان الدقة والشفافية التامة.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              التعبئة اليدوية (Module C)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              تتبع أكياس العملاء (40 مبسم لكل كيس)، وطرح وزن تار الكيس وتصنيف المنتجات حسب نوع العميل ومحاسبتهم بدقة.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              التقارير الموحدة والطباعة
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              تصدير تقارير رسمية منسقة جاهزة للطباعة والتنزيل كملفات PDF أو المشاركة النصية الفورية.
            </p>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 space-y-1">
        <div>جميع الحقوق محفوظة © {new Date().getFullYear()} - مصنع المباسم البلاستيكية</div>
        <div className="font-bold text-indigo-600 dark:text-indigo-400">Developed by QASWARA HASAN</div>
      </div>

    </div>
  );
};
