import React, { useState } from 'react';
import { Copy, Share2, Download, X, Check } from 'lucide-react';

interface ReportShareModalProps {
  reportText: string;
  onClose: () => void;
}

export const ReportShareModal: React.FC<ReportShareModalProps> = ({ reportText, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `تقرير_مصنع_المباسم_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'تقرير إنتاج مصنع المباسم',
          text: reportText,
        });
      } catch (e) {
        console.log('Share dismissed', e);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-l from-indigo-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              📋
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">ملخص تقرير الإنتاج والتعبئة</h3>
              <p className="text-xs text-slate-500 font-medium">تقرير الإحصائيات الشاملة الجاهز للمشاركة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Content Box */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-50/50">
          <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs sm:text-sm font-mono whitespace-pre-wrap leading-relaxed border border-slate-800 dir-rtl shadow-inner">
            {reportText}
          </pre>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-white flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            {copied ? 'تم النسخ!' : 'نسخ التقرير'}
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            تحميل كملف
          </button>

          <button
            onClick={handleShare}
            className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Share2 className="w-4 h-4" />
            مشاركة
          </button>
        </div>
      </div>
    </div>
  );
};
