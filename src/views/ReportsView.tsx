import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  FileBarChart2,
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
  Share2,
  MessageSquare,
  MessageCircle,
  Send,
  Smartphone,
  Loader2,
  Eye,
  X,
  FolderDown,
  FileText,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { analyticsState, generateFormattedArabicReport } = useFactory();
  const [periodFilter, setPeriodFilter] = useState<'الكل' | 'أسبوعي' | 'شهري'>('الكل');
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  // PDF Preview & File Sharing State
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showLocationInfo, setShowLocationInfo] = useState(false);

  const currentDate = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const reportId = `REP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}`;

  // Helper function to build PDF instance
  const generatePdfInstance = async () => {
    const element = document.getElementById('printable-report-sheet');
    if (!element) return null;

    window.scrollTo(0, 0);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc) => {
        const el = clonedDoc.getElementById('printable-report-sheet');
        if (el) {
          el.style.letterSpacing = 'normal';
          el.style.wordSpacing = 'normal';
          const allNodes = el.querySelectorAll('*');
          allNodes.forEach((node) => {
            const htmlNode = node as HTMLElement;
            htmlNode.style.letterSpacing = 'normal';
            htmlNode.style.wordSpacing = 'normal';
          });
        }
      },
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add First Page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Loop to add subsequent pages if report exceeds 1 A4 page length
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    const fileName = `تقرير_مصنع_المباسم_${new Date().toISOString().split('T')[0]}.pdf`;
    const blob = pdf.output('blob');
    const file = new File([blob], fileName, { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    setPdfBlobUrl(url);
    setPdfFile(file);

    return { pdf, url, file, fileName };
  };

  // Direct PDF Download
  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const res = await generatePdfInstance();
      if (res) {
        res.pdf.save(res.fileName);
        setShowLocationInfo(true);
        setShareSuccess('تم تحميل الملف بنجاح! تجده في مجلد (التنزيلات Downloads) على هاتفك');
        setTimeout(() => setShareSuccess(null), 4000);
      }
    } catch (err) {
      console.error('PDF Generation error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Open Preview Modal
  const handlePreviewPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      if (!pdfBlobUrl) {
        await generatePdfInstance();
      }
      setIsPreviewOpen(true);
    } catch (err) {
      console.error('PDF Preview error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Share PDF File directly via Web Share API
  const handleSharePdfFile = async () => {
    try {
      setIsGeneratingPdf(true);
      let targetFile = pdfFile;
      if (!targetFile) {
        const res = await generatePdfInstance();
        targetFile = res?.file || null;
      }

      if (targetFile && navigator.canShare && navigator.canShare({ files: [targetFile] })) {
        await navigator.share({
          title: 'تقرير مصنع المباسم البلاستيكية - مبسمك عندي',
          text: 'مرفق تقرير الإنتاج والمتابعة الموحد لمصنع المباسم البلاستيكية.',
          files: [targetFile],
        });
        setShareSuccess('تمت مشاركة ملف الـ PDF بنجاح!');
        setTimeout(() => setShareSuccess(null), 3000);
      } else if (navigator.share) {
        await navigator.share({
          title: 'تقرير مصنع المباسم - مبسمك عندي',
          text: generateFormattedArabicReport(),
        });
        setShareSuccess('تمت مشاركة ملخص التقرير بنجاح!');
        setTimeout(() => setShareSuccess(null), 3000);
      } else {
        setIsPreviewOpen(true);
        setShareSuccess('تم فتح معاينة الملف للمشاركة والتحميل');
        setTimeout(() => setShareSuccess(null), 3000);
      }
    } catch (err) {
      console.log('Share canceled or not supported:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateFormattedArabicReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Social Sharing Handlers
  const reportText = generateFormattedArabicReport();

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(reportText)}`;
    window.open(url, '_blank');
  };

  const shareToTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(reportText)}`;
    window.open(url, '_blank');
  };

  const shareToSms = () => {
    const url = `sms:?body=${encodeURIComponent(reportText)}`;
    window.location.href = url;
  };

  const shareToMessenger = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'تقرير مصنع المباسم - مبسمك عندي',
          text: reportText,
        });
        setShareSuccess('تمت المشاركة بنجاح');
        setTimeout(() => setShareSuccess(null), 3000);
        return;
      } catch (e) {
        // user cancelled or share failed
      }
    }
    const url = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(window.location.href)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const shareNativeSystem = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'تقرير مصنع المباسم - مبسمك عندي',
          text: reportText,
        });
        setShareSuccess('تمت المشاركة بنجاح');
        setTimeout(() => setShareSuccess(null), 3000);
      } catch (e) {
        handleCopyText();
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Notification toast */}
      {shareSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-bold animate-bounce text-center max-w-[90vw]">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{shareSuccess}</span>
        </div>
      )}

      {/* Top Controls Toolbar (Hidden during print) */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5 no-print transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
              <FileBarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">صفحة التقارير والطباعة الرسمية</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">مبسمك عندي - تصدير تقارير الإنتاج والمشاركة الفورية</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-emerald-200 dark:shadow-none transition-all hover:scale-[1.02] disabled:opacity-60"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري معالجة PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>تحميل كملف PDF</span>
                </>
              )}
            </button>

            {/* Preview PDF Button */}
            <button
              onClick={handlePreviewPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 active:bg-indigo-200 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all hover:scale-[1.02] disabled:opacity-60"
            >
              <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>معاينة التقرير</span>
            </button>

            {/* Direct Share PDF File Button */}
            <button
              onClick={handleSharePdfFile}
              disabled={isGeneratingPdf}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-indigo-200 dark:shadow-none transition-all hover:scale-[1.02] disabled:opacity-60"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة ملف PDF</span>
            </button>

            {/* Copy Text Button */}
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
              title="نسخ نص التقرير"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
              <span>{copied ? 'تم النسخ' : 'نسخ النص'}</span>
            </button>
          </div>
        </div>

        {/* Location Info Banner */}
        {showLocationInfo && (
          <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 text-xs font-bold text-amber-900 flex items-start justify-between gap-3 shadow-xs animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-amber-100 rounded-xl shrink-0 text-amber-700">
                <FolderDown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-amber-950">أين يوجد ملف الـ PDF بعد التحميل؟</p>
                <p className="mt-1 text-xs text-amber-800 font-medium leading-relaxed">
                  تجد الملف المُحمل داخل مجلد <span className="font-bold underline text-amber-950">التنزيلات (Downloads)</span> في مدير الملفات على هاتفك باسم 
                  <span className="font-mono dir-ltr inline-block px-1.5 py-0.5 bg-amber-100/80 rounded mx-1 text-amber-900 font-bold">
                    تقرير_مصنع_المباسم_...pdf
                  </span>.
                  يمكنك أيضاً معاينته مباشرة أو مشاركته كملف مستند عبر الأزرار أعلاه.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowLocationInfo(false)}
              className="p-1 text-amber-600 hover:text-amber-800 rounded-lg shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Social Share Bar */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Share2 className="w-4 h-4 text-indigo-600" />
            <span>مشاركة التقرير عبر تطبيقات التواصل:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {/* WhatsApp */}
            <button
              onClick={shareToWhatsApp}
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>واتساب</span>
            </button>

            {/* Telegram */}
            <button
              onClick={shareToTelegram}
              className="p-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200/80 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Send className="w-4 h-4 text-sky-600" />
              <span>تلغرام</span>
            </button>

            {/* Messenger */}
            <button
              onClick={shareToMessenger}
              className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200/80 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4 text-blue-600" />
              <span>ماسنجر</span>
            </button>

            {/* SMS */}
            <button
              onClick={shareToSms}
              className="p-2.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200/80 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Smartphone className="w-4 h-4 text-purple-600" />
              <span>رسائل SMS</span>
            </button>

            {/* Native Share */}
            <button
              onClick={shareNativeSystem}
              className="col-span-2 sm:col-span-1 p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Share2 className="w-4 h-4 text-slate-600" />
              <span>مشاركة عامة</span>
            </button>
          </div>
        </div>

        {/* Filter Period Chips */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
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
      <div
        id="printable-report-sheet"
        className="print-page bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-8 relative overflow-hidden dir-rtl"
      >
        {/* Document Header Banner */}
        <div className="border-b-2 border-indigo-600 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-950 text-amber-400 border-2 border-amber-400/30 flex items-center justify-center font-black shadow-lg">
              <Factory className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-normal">مصنع المباسم البلاستيكية</h1>
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
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 tracking-normal">
            <Award className="w-4 h-4 text-indigo-600" />
            ملخص المؤشرات الرئيسية للإنتاج
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-100">
              <span className="text-[11px] font-bold text-indigo-700 block">صافي إنتاج الحقن</span>
              <span className="text-lg sm:text-xl font-black text-indigo-900 mt-0.5 block">
                {(analyticsState?.totalInjectionFinishedKg ?? 0).toFixed(2)} <span className="text-xs font-medium">كغ</span>
              </span>
            </div>

            <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-100">
              <span className="text-[11px] font-bold text-blue-700 block">وزن التغليف الآلي</span>
              <span className="text-lg sm:text-xl font-black text-blue-900 mt-0.5 block">
                {(analyticsState?.totalAutoPackKg ?? 0).toFixed(2)} <span className="text-xs font-medium">كغ</span>
              </span>
            </div>

            <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-100">
              <span className="text-[11px] font-bold text-amber-800 block">التعبئة اليدوية (40 مبسم)</span>
              <span className="text-lg sm:text-xl font-black text-amber-900 mt-0.5 block">
                {(analyticsState?.totalManualPackKg ?? 0).toFixed(2)} <span className="text-xs font-medium">كغ</span>
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-100">
              <span className="text-[11px] font-bold text-emerald-800 block">إجمالي عدد الأكياس</span>
              <span className="text-lg sm:text-xl font-black text-emerald-900 mt-0.5 block">
                {analyticsState?.totalManualBagsCount ?? 0} <span className="text-xs font-medium">كيس</span>
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
                  {analyticsState?.clientSummaries?.map((c) => {
                    const totalWeight = analyticsState?.totalManualPackKg || 1;
                    const pct = (((c?.totalNetMouthpiecesWeightKg ?? 0) / totalWeight) * 100).toFixed(1);
                    return (
                      <tr key={c.clientId} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{c.clientName}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md font-bold">
                            {c.totalBagsCount} كيس
                          </span>
                        </td>
                        <td className="p-3">{(c?.totalMouthpiecesCount ?? 0).toLocaleString('ar-EG')} مبسم</td>
                        <td className="p-3 font-bold text-emerald-700">{(c?.totalNetMouthpiecesWeightKg ?? 0).toFixed(2)} كغ</td>
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
                {(analyticsState?.totalInjectionWasteKg ?? 0).toFixed(2)} كغ
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">فاقد وزن التعبئة اليدوية:</span>
              <span className="text-base font-black text-rose-600 mt-1 block">
                {(analyticsState?.totalPackagingLossKg ?? 0).toFixed(2)} كغ
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">كفاءة إنتاجية الحقن العامة:</span>
              <span className="text-base font-black text-indigo-700 mt-1 block">
                {(analyticsState?.avgInjectionYieldPct ?? 0).toFixed(1)}%
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

      {/* Interactive PDF Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in no-print">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden dir-rtl">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">معاينة تقرير PDF الرسمي</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">مصنع المباسم البلاستيكية - مبسمك عندي</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {pdfBlobUrl && (
                  <a
                    href={pdfBlobUrl}
                    download={pdfFile?.name || 'تقرير_مصنع_المباسم.pdf'}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">تحميل الملف</span>
                  </a>
                )}
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / PDF Viewer */}
            <div className="p-4 flex-1 overflow-y-auto bg-slate-100/80 dark:bg-slate-950/80 flex items-center justify-center min-h-[400px]">
              {pdfBlobUrl ? (
                <iframe
                  src={pdfBlobUrl}
                  className="w-full h-[65vh] rounded-2xl border border-slate-300 dark:border-slate-700 shadow-md bg-white"
                  title="معاينة التقرير"
                />
              ) : (
                <div className="p-8 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">جاري معالجة إعداد معاينة الملف...</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                💡 يتم حفظ الملف مباشرة في مجلد (التنزيلات Downloads) عند الضغط على زر التحميل.
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSharePdfFile}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة الملف الآن</span>
                </button>

                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

