import React from 'react';
import {
  LayoutDashboard,
  Factory,
  Gauge,
  ShoppingBag,
  FileBarChart2,
  Database,
  Info,
  X,
  ChevronLeft,
} from 'lucide-react';

export type TabType = 'dashboard' | 'injection' | 'autoPackaging' | 'manualPackaging' | 'reports' | 'masterData' | 'about';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, isOpenMobile, onCloseMobile }) => {
  const menuItems: { id: TabType; label: string; sub: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: 'dashboard',
      label: 'لوحة التحكم',
      sub: 'التشغيل المباشر والملخص',
      icon: LayoutDashboard,
    },
    {
      id: 'injection',
      label: 'قسم آلة الحقن',
      sub: 'Module A - أوزان الخرج والهدر',
      icon: Factory,
    },
    {
      id: 'autoPackaging',
      label: 'التغليف الآلي',
      sub: 'Module B - الأوزان التراكمية',
      icon: Gauge,
    },
    {
      id: 'manualPackaging',
      label: 'تعبئة 40 مبسم',
      sub: 'Module C - تصنيف العملاء',
      icon: ShoppingBag,
    },
    {
      id: 'reports',
      label: 'التقارير والإحصائيات',
      sub: 'تحليل أداء العملاء والورديات',
      icon: FileBarChart2,
    },
    {
      id: 'masterData',
      label: 'البيانات الأساسية',
      sub: 'العملاء، الآلات، الورديات، العمال',
      icon: Database,
    },
    {
      id: 'about',
      label: 'عن التطبيق',
      sub: 'المطور والمعلومات - قسورة حسن',
      icon: Info,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-l border-slate-200">
      {/* Mobile Header inside drawer */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2">
          <Factory className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-slate-900 text-sm">أقسام المصنع</span>
        </div>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              className={`w-full text-right p-3 rounded-2xl transition-all flex items-center justify-between group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 font-bold'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-indigo-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="text-sm leading-snug">{item.label}</div>
                  <div
                    className={`text-[11px] truncate ${
                      isActive ? 'text-indigo-100' : 'text-slate-400 group-hover:text-slate-500'
                    }`}
                  >
                    {item.sub}
                  </div>
                </div>
              </div>

              <ChevronLeft
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-white opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100 -translate-x-1'
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white rounded-xl p-3 border border-slate-200/60 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-800">مبسمك عندي</div>
          <div className="text-[11px] text-slate-500">الإصدار 1.0.0</div>
          <div className="text-[11px] font-extrabold text-indigo-600 border-t border-slate-100 pt-1">
            Developed by QASWARA HASAN
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 h-[calc(100vh-61px)] sticky top-[61px]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden animate-in fade-in"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 bottom-0 right-0 z-50 w-80 bg-white transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
