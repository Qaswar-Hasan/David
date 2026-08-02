import React, { useState } from 'react';
import { FactoryProvider, useFactory } from './context/FactoryContext';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { ReportShareModal } from './components/ReportShareModal';

import { DashboardView } from './views/DashboardView';
import { InjectionView } from './views/InjectionView';
import { AutoPackagingView } from './views/AutoPackagingView';
import { ManualPackagingView } from './views/ManualPackagingView';
import { ReportsView } from './views/ReportsView';
import { MasterDataView } from './views/MasterDataView';

import { motion, AnimatePresence } from 'motion/react';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const { generateFormattedArabicReport } = useFactory();

  const tabTitles: Record<TabType, string> = {
    dashboard: 'لوحة التحكم المركزية',
    injection: 'قسم آلة الحقن - Module A',
    autoPackaging: 'التغليف الآلي - Module B',
    manualPackaging: 'التعبئة اليدوية (40 مبسم) - Module C',
    reports: 'التقارير والإحصائيات الشاملة',
    masterData: 'إدارة البيانات الأساسية',
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans dir-rtl">
      {/* Top Header Bar */}
      <Header
        onToggleSidebar={() => setIsSidebarOpenMobile((prev) => !prev)}
        onOpenReportModal={() => setShowReportModal(true)}
        activeTabTitle={tabTitles[activeTab]}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6 gap-6">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
        />

        {/* Main Active View Area with motion transition */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {activeTab === 'dashboard' && <DashboardView onNavigate={(t) => setActiveTab(t)} />}
              {activeTab === 'injection' && <InjectionView />}
              {activeTab === 'autoPackaging' && <AutoPackagingView />}
              {activeTab === 'manualPackaging' && <ManualPackagingView />}
              {activeTab === 'reports' && <ReportsView />}
              {activeTab === 'masterData' && <MasterDataView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Share Report Modal */}
      {showReportModal && (
        <ReportShareModal
          reportText={generateFormattedArabicReport()}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <FactoryProvider>
      <MainContent />
    </FactoryProvider>
  );
}

export default App;
