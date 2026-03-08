import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { editRequestAPI, familyAPI } from '../services/api';
import Layout from '../components/Layout';

const AdminEditRequests = () => {
  const { familyId } = useParams();
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(familyId || '');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFamilies();
  }, []);

  useEffect(() => {
    if (selectedFamily) {
      loadRequests();
    }
  }, [selectedFamily]);

  const loadFamilies = async () => {
    try {
      const response = await familyAPI.getAll();
      const ownerFamilies = (response.data.families || []).filter(f => f.role === 'owner');
      setFamilies(ownerFamilies);
      if (ownerFamilies.length > 0 && !selectedFamily) {
        setSelectedFamily(ownerFamilies[0].id);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء تحميل العائلات');
    }
  };

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await editRequestAPI.getFamilyRequests(selectedFamily);
      setRequests(response.data.editRequests || []);
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await editRequestAPI.approve(requestId);
      loadRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء الموافقة على الطلب');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await editRequestAPI.reject(requestId);
      loadRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء رفض الطلب');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50';
      default:
        return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'مقبول';
      case 'rejected': return 'مرفوض';
      default: return 'قيد الانتظار';
    }
  };

  if (families.length === 0 && !loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="glass-panel p-10 text-center border-t-4 border-t-amber-500 dark:border-t-amber-400">
            <div className="w-20 h-20 mx-auto bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4 text-amber-500 dark:text-amber-400">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">صلاحيات غير كافية</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              هذه الصفحة خاصة بصاحب العائلة (الأونر) فقط. صاحب العائلة هو من يقبل أو يرفض الطلبات التي يرسلها المدير (الأدمن).
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8 animate-slide-up">
        {/* Header Section */}
        <div className="glass-panel p-8 sm:p-10 relative overflow-hidden group border-t-4 border-t-amber-500 dark:border-t-amber-400">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-10 dark:opacity-20 transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700"></div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 dark:shadow-amber-900/40">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                  قبول الطلبات
                </h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                بصفتك صاحب العائلة، يمكنك قبول أو رفض الطلبات التي يرسلها المدير (إضافة أفراد أو تعديلات) حتى لا تُطبَّق تغييرات دون موافقتك.
              </p>
            </div>

            {/* Family Selector */}
            <div className="w-full sm:w-auto min-w-[250px] relative z-20">
              <label htmlFor="family" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                اختر العائلة
              </label>
              <div className="relative">
                <select
                  id="family"
                  value={selectedFamily}
                  onChange={(e) => setSelectedFamily(e.target.value)}
                  className="appearance-none w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 py-3 pl-10 pr-4 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium cursor-pointer"
                >
                  {families.map((family) => (
                    <option key={family.id} value={family.id}>
                      {family.family_name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50/80 dark:bg-red-900/40 border border-red-100 dark:border-red-800/50 p-4 animate-fade-in backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-bold text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-amber-500 dark:border-t-amber-400 animate-spin"></div>
            </div>
          </div>
        ) : requests.length > 0 ? (
          <div className="card glass-panel overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/50 text-right">
                <thead className="bg-slate-50/80 dark:bg-slate-800/80">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">الشخص</th>
                    <th scope="col" className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">الحقل المعدل</th>
                    <th scope="col" className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">القيمة السابقة</th>
                    <th scope="col" className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">القيمة الجديدة</th>
                    <th scope="col" className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">الحالة</th>
                    <th scope="col" className="px-6 py-4 text-center text-sm font-bold text-slate-700 dark:text-slate-300">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white/40 dark:bg-slate-900/40">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-slate-100">
                        {request.persons?.full_name || 'غير معروف'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg inline-block mt-2 ml-4">
                        {request.field_name}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400 line-through decoration-red-400 dark:decoration-red-600">
                        {request.old_value || 'غير متوفر'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {request.new_value || 'غير متوفر'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border ${getStatusStyle(
                            request.status
                          )}`}
                        >
                          {getStatusText(request.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        {request.status === 'pending' ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="group relative px-4 py-2 border-2 border-emerald-500 dark:border-emerald-600/50 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl hover:bg-emerald-500 dark:hover:bg-emerald-600 hover:text-white transition-all shadow-sm shadow-emerald-500/10 dark:shadow-emerald-900/40 flex items-center justify-center"
                              title="قبول التعديل"
                            >
                              <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="group relative px-4 py-2 border-2 border-red-500 dark:border-red-600/50 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-500 dark:hover:bg-red-600 hover:text-white transition-all shadow-sm shadow-red-500/10 dark:shadow-red-900/40 flex items-center justify-center"
                              title="رفض التعديل"
                            >
                              <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600 text-xs">تمت المراجعة</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-16 text-center border-2 border-dashed border-slate-300 dark:border-slate-700">
            <div className="w-20 h-20 mx-auto bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200 mb-2">لا توجد طلبات معلقة</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              عظيم! لا توجد طلبات تعديل تنتظر المراجعة في هذه العائلة حالياً.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminEditRequests;
