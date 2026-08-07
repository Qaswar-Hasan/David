import React from 'react';
import { Menu, FileBarChart2, Factory, RefreshCw, Sun, Moon } from 'lucide-react';
import { useFactory } from '../context/FactoryContext';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  onNavigateToReports: () => void;
  activeTabTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onNavigateToReports, activeTabTitle }) => {
  const { resetToDefaultData } = useFactory();
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 py-3 sm:px-6 shadow-xs no-print transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Side (RTL Start) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white flex items-center justify-center font-extrabold shadow-sm">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                مصنع المباسم البلاستيكية
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                مبسمك عندي - نظام التعبئة والإنتاج ورصد الورديات
              </p>
            </div>
          </div>
        </div>

        {/* Current Screen Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-full border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{activeTabTitle}</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center"
            title={isDarkMode ? 'التفعيل للوضع النهار' : 'التفعيل للوضع الليلي'}
            aria-label="تبديل الوضع الليلي"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>

          <button
            onClick={() => {
              if (confirm('هل ترغب بإعادة ضبط البيانات الافتراضية للتجربة؟')) {
                resetToDefaultData();
              }
            }}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="إعادة ضبط البيانات الافتراضية"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onNavigateToReports}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all hover:shadow"
          >
            <FileBarChart2 className="w-4 h-4" />
            <span className="hidden sm:inline">تقرير الإنتاج</span>
            <span className="sm:hidden">تقرير</span>
          </button>
        </div>
      </div>
    </header>
  );
};

