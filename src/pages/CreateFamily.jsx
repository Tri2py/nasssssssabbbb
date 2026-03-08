import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { familyAPI } from '../services/api';
import Layout from '../components/Layout';

const CreateFamily = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    familyName: '',
    originCity: '',
    grandfatherName: '',
    grandfatherBirthDate: '',
    grandfatherDeathDate: '',
    grandfatherJob: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const response = await familyAPI.create(formData);
      navigate(`/family/${response.data.family.id}`);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء إنشاء العائلة');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 animate-slide-up">
        <div className="card glass-panel border-t-4 border-t-primary-500 dark:border-t-primary-400 overflow-hidden relative">

          {/* Background Decorative Element */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary-400 to-indigo-500 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-10 dark:opacity-20 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

          <div className="p-8 sm:p-12 relative z-10">
            <div className="text-center mb-10">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 dark:shadow-primary-900/40 mb-6 transform rotate-3">
                <div className="w-full h-full bg-white/20 dark:bg-black/20 rounded-2xl flex items-center justify-center transform -rotate-3">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-3">
                إنشاء عائلة جديدة
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
                ابدأ بكتابة تاريخ عائلتك العريق. قم بإدخال بيانات الجد المؤسس لتكون النواة الأولى للشجرة.
              </p>
            </div>

            {error && (
              <div className="mb-8 rounded-xl bg-red-50/80 dark:bg-red-900/40 border border-red-100 dark:border-red-800/50 p-4 animate-fade-in backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-bold text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Family Data Section */}
              <div className="bg-slate-50/50 dark:bg-slate-800/50 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-primary-500 dark:bg-primary-400"></div>

                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm">١</span>
                  بيانات العائلة الأساسية
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label" htmlFor="familyName">
                      اسم العائلة (اللقب) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <input
                        type="text" id="familyName" name="familyName" required
                        className="input-field pr-10"
                        placeholder="مثال: القحطاني، الشمري، ..."
                        value={formData.familyName} onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="input-label" htmlFor="originCity">مدينة المنشأ</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <input
                        type="text" id="originCity" name="originCity"
                        className="input-field pr-10"
                        placeholder="مثال: الرياض، جدة، ..."
                        value={formData.originCity} onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Grandfather Data Section */}
              <div className="bg-slate-50/50 dark:bg-slate-800/50 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500 dark:bg-indigo-400"></div>

                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm">٢</span>
                  بيانات الجد الأكبر (المؤسس)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="input-label" htmlFor="grandfatherName">
                      الاسم الكامل للجد <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" id="grandfatherName" name="grandfatherName" required
                      className="input-field" placeholder="الاسم الرباعي أو الخماسي"
                      value={formData.grandfatherName} onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="input-label" htmlFor="grandfatherBirthDate">تاريخ الميلاد (تقريبي أو دقيق)</label>
                    <input type="date" id="grandfatherBirthDate" name="grandfatherBirthDate"
                      className="input-field" value={formData.grandfatherBirthDate} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="input-label" htmlFor="grandfatherDeathDate">تاريخ الوفاة (إن وجد)</label>
                    <input type="date" id="grandfatherDeathDate" name="grandfatherDeathDate"
                      className="input-field" value={formData.grandfatherDeathDate} onChange={handleChange} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="input-label" htmlFor="grandfatherJob">المهنة أو الوظيفة</label>
                    <input type="text" id="grandfatherJob" name="grandfatherJob"
                      className="input-field" placeholder="مثال: تاجر، قاضي، مزارع..."
                      value={formData.grandfatherJob} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-lg">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الإنشاء...
                    </span>
                  ) : (
                    'تأسيس العائلة'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateFamily;
