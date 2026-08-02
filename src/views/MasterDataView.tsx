import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import {
  Database,
  Users,
  ShoppingBag,
  Factory,
  Cpu,
  Clock,
  UserCheck,
  Plus,
  Trash2,
  X,
  Check,
} from 'lucide-react';
import { Client, BagType } from '../types';

export const MasterDataView: React.FC = () => {
  const {
    clients,
    bagTypes,
    departments,
    machines,
    shifts,
    workers,
    addClient,
    deleteClient,
    addBagType,
    deleteBagType,
    addDepartment,
    deleteDepartment,
    addMachine,
    deleteMachine,
    addShift,
    deleteShift,
    addWorker,
    deleteWorker,
  } = useFactory();

  const [activeTab, setActiveTab] = useState<'clients' | 'bagTypes' | 'departments' | 'machines' | 'shifts' | 'workers'>('clients');

  // Modal forms states
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  const [bagTypeName, setBagTypeName] = useState('');
  const [bagClientId, setBagClientId] = useState<number>(clients[0]?.id || 0);
  const [bagTareGrams, setBagTareGrams] = useState('4.5');
  const [bagPiecesPerBag, setBagPiecesPerBag] = useState('40');
  const [bagAvgPieceGrams, setBagAvgPieceGrams] = useState('2.5');

  const [depName, setDepName] = useState('');
  const [depCode, setDepCode] = useState('');

  const [machName, setMachName] = useState('');
  const [machDepId, setMachDepId] = useState<number>(departments[0]?.id || 1);

  const [shiftName, setShiftName] = useState('');
  const [shiftStart, setShiftStart] = useState('08:00');
  const [shiftEnd, setShiftEnd] = useState('16:00');

  const [workerName, setWorkerName] = useState('');
  const [workerRole, setWorkerRole] = useState('تعبئة يدوية');
  const [workerPhone, setWorkerPhone] = useState('');

  const handleSave = () => {
    if (activeTab === 'clients') {
      if (!clientName.trim()) return;
      addClient(clientName, clientPhone, clientNotes);
      setClientName('');
      setClientPhone('');
      setClientNotes('');
    } else if (activeTab === 'bagTypes') {
      if (!bagTypeName.trim()) return;
      const clientObj = clients.find((c) => c.id === Number(bagClientId));
      addBagType(
        clientObj?.id || null,
        clientObj?.name || 'عام',
        bagTypeName,
        parseInt(bagPiecesPerBag) || 40,
        parseFloat(bagTareGrams) || 4.5,
        parseFloat(bagAvgPieceGrams) || 2.5
      );
      setBagTypeName('');
    } else if (activeTab === 'departments') {
      if (!depName.trim()) return;
      addDepartment(depName, depCode || 'DEP');
      setDepName('');
      setDepCode('');
    } else if (activeTab === 'machines') {
      if (!machName.trim()) return;
      const depObj = departments.find((d) => d.id === Number(machDepId)) || departments[0];
      addMachine(machName, depObj?.id || 1, depObj?.name || 'عام');
      setMachName('');
    } else if (activeTab === 'shifts') {
      if (!shiftName.trim()) return;
      addShift(shiftName, shiftStart, shiftEnd);
      setShiftName('');
    } else if (activeTab === 'workers') {
      if (!workerName.trim()) return;
      addWorker(workerName, workerRole, workerPhone);
      setWorkerName('');
      setWorkerPhone('');
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">إدارة البيانات الأساسية (Master Data)</h2>
            <p className="text-xs text-slate-500 font-medium">إضافة وتعديل العملاء، أنواع الأكياس، الآلات، والورديات</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          إضافة عنصر جديد
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'clients', label: 'العملاء', icon: Users },
          { id: 'bagTypes', label: 'أنواع الأكياس', icon: ShoppingBag },
          { id: 'departments', label: 'الأقسام', icon: Factory },
          { id: 'machines', label: 'الآلات', icon: Cpu },
          { id: 'shifts', label: 'الورديات', icon: Clock },
          { id: 'workers', label: 'العمال', icon: UserCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content per Tab */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        {activeTab === 'clients' && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">سجل العملاء والمشترين</h3>
            {clients.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                  <p className="text-xs text-slate-500">{c.phone || 'بدون رقم هاتف'} {c.notes ? `• ${c.notes}` : ''}</p>
                </div>
                <button
                  onClick={() => deleteClient(c.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'bagTypes' && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">معايير أنواع الأكياس</h3>
            {bagTypes.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{b.typeName}</h4>
                  <p className="text-xs text-slate-500">
                    العميل: {b.clientName} | سعة الكيس: {b.mouthpiecesPerBag} مبسم | وزن الكيس الفارغ: {b.emptyBagTareGrams}g tare
                  </p>
                </div>
                <button
                  onClick={() => deleteBagType(b.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">أقسام المصنع</h3>
            {departments.map((d) => (
              <div key={d.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{d.name}</h4>
                  <p className="text-xs text-slate-500">كود القسم: {d.code}</p>
                </div>
                {!d.isSystem && (
                  <button
                    onClick={() => deleteDepartment(d.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'machines' && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">الآلات والماكينات</h3>
            {machines.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                  <p className="text-xs text-slate-500">القسم: {m.departmentName} | الحالة: {m.status}</p>
                </div>
                <button
                  onClick={() => deleteMachine(m.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'shifts' && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">الورديات المسجلة</h3>
            {shifts.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                  <p className="text-xs text-slate-500">أوقات العمل: {s.startTime} - {s.endTime}</p>
                </div>
                <button
                  onClick={() => deleteShift(s.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'workers' && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">فريق العمل والعمال</h3>
            {workers.map((w) => (
              <div key={w.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{w.name}</h4>
                  <p className="text-xs text-slate-500">التخصص: {w.role} {w.phone ? `• ${w.phone}` : ''}</p>
                </div>
                <button
                  onClick={() => deleteWorker(w.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">إضافة عنصر جديد</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeTab === 'clients' && (
              <div className="space-y-3 text-xs font-bold text-slate-700">
                <div>
                  <label>اسم العميل / الشحنة</label>
                  <input
                    type="text"
                    placeholder="مثال: أكياس خليل"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label>رقم الهاتف</label>
                  <input
                    type="text"
                    placeholder="050xxxxxxx"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label>ملاحظات</label>
                  <input
                    type="text"
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            )}

            {activeTab === 'bagTypes' && (
              <div className="space-y-3 text-xs font-bold text-slate-700">
                <div>
                  <label>اسم معيار الكيس</label>
                  <input
                    type="text"
                    placeholder="مثال: أكياس خليل 40 مبسم شفاف"
                    value={bagTypeName}
                    onChange={(e) => setBagTypeName(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label>العميل التابع له</label>
                  <select
                    value={bagClientId}
                    onChange={(e) => setBagClientId(Number(e.target.value))}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label>وزن الكيس الفارغ (غرام)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={bagTareGrams}
                      onChange={(e) => setBagTareGrams(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label>سعة الكيس (مبسم)</label>
                    <input
                      type="number"
                      value={bagPiecesPerBag}
                      onChange={(e) => setBagPiecesPerBag(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'departments' && (
              <div className="space-y-3 text-xs font-bold text-slate-700">
                <div>
                  <label>اسم القسم</label>
                  <input
                    type="text"
                    placeholder="مثال: قسم صيانة القوالب"
                    value={depName}
                    onChange={(e) => setDepName(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label>رمز القسم (Code)</label>
                  <input
                    type="text"
                    placeholder="MAINT"
                    value={depCode}
                    onChange={(e) => setDepCode(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            )}

            {activeTab === 'machines' && (
              <div className="space-y-3 text-xs font-bold text-slate-700">
                <div>
                  <label>اسم الآلة</label>
                  <input
                    type="text"
                    placeholder="مثال: حقن 03"
                    value={machName}
                    onChange={(e) => setMachName(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label>القسم التابع له</label>
                  <select
                    value={machDepId}
                    onChange={(e) => setMachDepId(Number(e.target.value))}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'shifts' && (
              <div className="space-y-3 text-xs font-bold text-slate-700">
                <div>
                  <label>اسم الوردية</label>
                  <input
                    type="text"
                    placeholder="مثال: وردية إضافية"
                    value={shiftName}
                    onChange={(e) => setShiftName(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label>وقت البدء</label>
                    <input
                      type="text"
                      placeholder="08:00"
                      value={shiftStart}
                      onChange={(e) => setShiftStart(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label>وقت النهاية</label>
                    <input
                      type="text"
                      placeholder="16:00"
                      value={shiftEnd}
                      onChange={(e) => setShiftEnd(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'workers' && (
              <div className="space-y-3 text-xs font-bold text-slate-700">
                <div>
                  <label>اسم العامل</label>
                  <input
                    type="text"
                    placeholder="مثال: طارق المحمد"
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label>التخصص / الدور</label>
                  <input
                    type="text"
                    placeholder="تعبئة يدوية / حقن"
                    value={workerRole}
                    onChange={(e) => setWorkerRole(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label>رقم الهاتف</label>
                  <input
                    type="text"
                    placeholder="050xxxxxxx"
                    value={workerPhone}
                    onChange={(e) => setWorkerPhone(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleSave}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold mt-4"
            >
              حفظ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
