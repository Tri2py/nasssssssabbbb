import { useState, useEffect } from 'react';
import { editRequestAPI } from '../services/api';
import Layout from '../components/Layout';

const EditRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await editRequestAPI.getUserRequests();
      setRequests(response.data.editRequests || []);
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء تحميل الطلبات');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500 dark:border-t-indigo-400 animate-spin animation-delay-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8 animate-slide-up">
        {/* Header Section */}
        <div className="glass-panel p-8 sm:p-10 relative overflow-hidden group border-t-4 border-t-primary-500 dark:border-t-primary-400">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-400 to-indigo-500 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-10 dark:opacity-20 transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700"></div>

          <div className="flex items-center gap-4 mb-2 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/30 dark:shadow-primary-900/40">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              طلبات التعديل الخاصة بك
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium relative z-10">
            تابع حالة الطلبات التي قدمتها لتعديل بيانات الأشخاص في شجرة العائلة.
          </p>
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

        {requests.length > 0 ? (
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
                    <th scope="col" className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">تاريخ الطلب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white/40 dark:bg-slate-900/40">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-slate-100">
                        {request.persons?.full_name || 'غير معروف'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg inline-block mt-2 ml-4 border outline dark:outline-indigo-500/20">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(request.created_at).toLocaleDateString('ar-EG')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-12 text-center border-2 border-dashed border-slate-300 dark:border-slate-700">
            <div className="w-20 h-20 mx-auto bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-2">لا توجد طلبات</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
              لم تقم بتقديم أي طلبات تعديل حتى الآن. عندما تقوم بتحديث بيانات شخص في الشجرة، ستظهر الطلبات هنا.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EditRequests;
