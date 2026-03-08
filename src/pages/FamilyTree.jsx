import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Tree from 'react-d3-tree';
import { personAPI, familyAPI } from '../services/api';
import Layout from '../components/Layout';

// ─── Add / Edit Person Modal ──────────────────────────────────
const PersonModal = ({ isOpen, onClose, onSave, person, persons, familyId, mode }) => {
  const [formData, setFormData] = useState({
    full_name: '', gender: 'male', birth_date: '', death_date: '',
    job: '', education: '', marital_status: '', phone: '', city: '', notes: '',
    father_id: '', mother_id: '',
  });

  useEffect(() => {
    if (person && mode === 'edit') {
      setFormData({
        full_name: person.full_name || '',
        gender: person.gender || 'male',
        birth_date: person.birth_date || '',
        death_date: person.death_date || '',
        job: person.job || '',
        education: person.education || '',
        marital_status: person.marital_status || '',
        phone: person.phone || '',
        city: person.city || '',
        notes: person.notes || '',
        father_id: person.father_id || '',
        mother_id: person.mother_id || '',
      });
    } else if (mode === 'add-child' && person) {
      // Adding a child: pre-fill parent based on selected person's gender
      setFormData((prev) => ({
        ...prev,
        full_name: '', gender: 'male', birth_date: '', death_date: '',
        job: '', education: '', marital_status: '', phone: '', city: person.city || '', notes: '',
        father_id: person.gender === 'male' ? person.id : (person.spouse_id || ''),
        mother_id: person.gender === 'female' ? person.id : (person.spouse_id || ''),
      }));
    } else if (mode === 'add-spouse' && person) {
      setFormData((prev) => ({
        ...prev,
        full_name: '', gender: person.gender === 'male' ? 'female' : 'male',
        birth_date: '', death_date: '', job: '', education: '', marital_status: 'متزوج/ة',
        phone: '', city: person.city || '', notes: '', father_id: '', mother_id: '',
      }));
    } else {
      setFormData({
        full_name: '', gender: 'male', birth_date: '', death_date: '',
        job: '', education: '', marital_status: '', phone: '', city: '', notes: '',
        father_id: '', mother_id: '',
      });
    }
  }, [person, mode]);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const title = mode === 'edit' ? 'تعديل بيانات الشخص' :
    mode === 'add-child' ? 'إضافة ابن / ابنة' :
      mode === 'add-spouse' ? 'إضافة زوج / زوجة' : 'إضافة فرد جديد';

  const males = persons.filter((p) => p.gender === 'male');
  const females = persons.filter((p) => p.gender === 'female');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-slate-200 dark:border-slate-700 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="input-label">الاسم الكامل <span className="text-red-500">*</span></label>
              <input name="full_name" required value={formData.full_name} onChange={handleChange} className="input-field" placeholder="الاسم الكامل" />
            </div>

            <div>
              <label className="input-label">الجنس</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>

            <div>
              <label className="input-label">الحالة الاجتماعية</label>
              <select name="marital_status" value={formData.marital_status} onChange={handleChange} className="input-field">
                <option value="">— اختر —</option>
                <option value="أعزب">أعزب</option>
                <option value="عزباء">عزباء</option>
                <option value="متزوج">متزوج</option>
                <option value="متزوجة">متزوجة</option>
                <option value="أرمل">أرمل</option>
                <option value="أرملة">أرملة</option>
                <option value="مطلق">مطلق</option>
                <option value="مطلقة">مطلقة</option>
              </select>
            </div>

            <div>
              <label className="input-label">تاريخ الميلاد</label>
              <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="input-label">تاريخ الوفاة (إن وجد)</label>
              <input type="date" name="death_date" value={formData.death_date} onChange={handleChange} className="input-field" />
            </div>

            <div>
              <label className="input-label">المهنة</label>
              <input name="job" value={formData.job} onChange={handleChange} className="input-field" placeholder="مثال: مهندس، طبيب..." />
            </div>
            <div>
              <label className="input-label">المؤهل العلمي</label>
              <input name="education" value={formData.education} onChange={handleChange} className="input-field" placeholder="مثال: بكالوريوس هندسة" />
            </div>

            <div>
              <label className="input-label">المدينة</label>
              <input name="city" value={formData.city} onChange={handleChange} className="input-field" placeholder="مثال: دمشق" />
            </div>
            <div>
              <label className="input-label">رقم الهاتف</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="09xxxxxxxx" dir="ltr" />
            </div>

            {(mode === 'add' || mode === 'edit') && (
              <>
                <div>
                  <label className="input-label">الأب</label>
                  <select name="father_id" value={formData.father_id} onChange={handleChange} className="input-field">
                    <option value="">— بدون —</option>
                    {males.map((m) => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="input-label">الأم</label>
                  <select name="mother_id" value={formData.mother_id} onChange={handleChange} className="input-field">
                    <option value="">— بدون —</option>
                    {females.map((f) => <option key={f.id} value={f.id}>{f.full_name}</option>)}
                  </select>
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="input-label">ملاحظات</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="input-field resize-none" placeholder="ملاحظات إضافية..." />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 py-3">
              {mode === 'edit' ? 'حفظ التعديلات' : 'إضافة'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-3">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main FamilyTree Component ──────────────────────────────
const FamilyTree = () => {
  const { familyId } = useParams();
  const [persons, setPersons] = useState([]);
  const [family, setFamily] = useState(null);
  const [treeData, setTreeData] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // add | edit | add-child | add-spouse

  // Theme detection
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  useEffect(() => { loadFamilyData(); }, [familyId]);
  useEffect(() => { if (persons.length > 0) buildTree(); }, [persons]);

  const loadFamilyData = async () => {
    try {
      setLoading(true);
      const [familyRes, personsRes] = await Promise.all([
        familyAPI.getById(familyId),
        personAPI.getFamilyMembers(familyId),
      ]);
      setFamily(familyRes.data.family);
      setPersons(personsRes.data.persons || []);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل بيانات العائلة');
    } finally {
      setLoading(false);
    }
  };

  const buildTree = () => {
    const rootNodes = persons.filter((p) => !p.father_id && !p.mother_id);
    if (rootNodes.length === 0) {
      const sorted = [...persons].sort((a, b) => {
        if (!a.birth_date) return 1;
        if (!b.birth_date) return -1;
        return new Date(a.birth_date) - new Date(b.birth_date);
      });
      if (sorted.length > 0) buildNodeTree(sorted[0]);
    } else {
      // Build from the first male root node (patriarch) or first root node
      const patriarch = rootNodes.find((p) => p.gender === 'male') || rootNodes[0];
      buildNodeTree(patriarch);
    }
  };

  const buildNodeTree = (person) => {
    const visited = new Set();

    const buildNode = (p) => {
      if (visited.has(p.id)) return null;
      visited.add(p.id);

      const children = persons.filter(
        (child) => child.father_id === p.id || child.mother_id === p.id
      );

      // Deduplicate children (if both father & mother point to same family)
      const uniqueChildren = [];
      const seenIds = new Set();
      for (const child of children) {
        if (!seenIds.has(child.id)) {
          seenIds.add(child.id);
          const node = buildNode(child);
          if (node) uniqueChildren.push(node);
        }
      }

      // Build display name with spouse
      const spouse = p.spouse_id ? persons.find((s) => s.id === p.spouse_id) : null;

      return {
        name: p.full_name,
        attributes: {
          id: p.id,
          birthDate: p.birth_date || 'غير معروف',
          job: p.job || 'غير متوفر',
          city: p.city || 'غير متوفر',
          gender: p.gender,
          spouse: spouse ? spouse.full_name : null,
        },
        children: uniqueChildren,
      };
    };

    const tree = buildNode(person);
    setTreeData(tree);
  };

  const handleNodeClick = (nodeData) => {
    const attrs = nodeData.attributes || nodeData.data?.attributes;
    if (attrs?.id) {
      const person = persons.find((p) => p.id === attrs.id);
      setSelectedPerson(person);
    }
  };

  const openModal = (mode) => {
    setModalMode(mode);
    setModalOpen(true);
  };

  const handleModalSave = async (formData) => {
    try {
      if (modalMode === 'edit' && selectedPerson) {
        await personAPI.update(selectedPerson.id, formData);
      } else if (modalMode === 'add-spouse' && selectedPerson) {
        const res = await personAPI.create({ ...formData, family_id: familyId });
        // Link spouse
        await personAPI.update(selectedPerson.id, { spouse_id: res.data.person.id });
        await personAPI.update(res.data.person.id, { spouse_id: selectedPerson.id });
      } else {
        await personAPI.create({
          ...formData,
          family_id: familyId,
        });
      }
      setModalOpen(false);
      await loadFamilyData();
      // Re-select the person if editing
      if (modalMode === 'edit' && selectedPerson) {
        const updated = (await personAPI.getById(selectedPerson.id)).data.person;
        setSelectedPerson(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500 dark:border-t-indigo-400 animate-spin animation-delay-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-500 dark:text-primary-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-400 to-indigo-500 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-10 dark:opacity-20 transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:border-primary-200 dark:hover:border-slate-600 relative z-10"
          >
            ← العودة للوحة التحكم
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/30 dark:shadow-primary-900/40">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-2">
                  شجرة {family?.family_name}
                </h1>
                <p className="text-lg font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  الأصل: {family?.origin_city || 'غير محدد'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="bg-white/60 dark:bg-slate-800/60 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-primary-600 dark:text-primary-400">{persons.length}</span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">الأعضاء</span>
              </div>
              <button
                onClick={() => openModal('add')}
                className="btn-primary py-3 px-5 text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                إضافة فرد
              </button>
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Tree Visualization Container */}
          <div className={`${selectedPerson ? 'lg:col-span-8' : 'lg:col-span-12'} transition-all duration-500 ease-in-out`}>
            {treeData ? (
              <div className="card glass-panel h-[700px] border-2 border-slate-200/60 dark:border-slate-700/60 overflow-hidden relative shadow-inner flex flex-col">
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400 animate-pulse"></div>
                    اضغط على العقدة لعرض التفاصيل
                  </div>
                </div>

                <div className="absolute inset-0 opacity-10 dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '24px 24px', color: isDark ? '#818cf8' : '#4f46e5' }}></div>

                <div className="flex-1 w-full h-full cursor-move" dir="ltr">
                  <Tree
                    data={treeData}
                    orientation="vertical"
                    pathFunc="step"
                    nodeSize={{ x: 250, y: 180 }}
                    translate={{ x: 300, y: 100 }}
                    zoom={0.8}
                    scaleExtent={{ min: 0.1, max: 2 }}
                    onNodeClick={handleNodeClick}
                    renderCustomNodeElement={({ nodeDatum, toggleNode }) => {
                      const isSelected = nodeDatum.attributes?.id === selectedPerson?.id;
                      const isFemale = nodeDatum.attributes?.gender === 'female';
                      const rectFill = isDark ? '#1e293b' : '#ffffff';
                      const rectStroke = isSelected
                        ? (isDark ? '#818cf8' : '#4f46e5')
                        : isFemale
                          ? (isDark ? '#f472b6' : '#ec4899')
                          : (isDark ? '#475569' : '#cbd5e1');
                      const textNameFill = isDark ? '#f8fafc' : '#1e293b';
                      const textAttrFill = isDark ? '#94a3b8' : '#64748b';

                      return (
                        <g>
                          <rect
                            width="180" height="80" x="-90" y="-40" rx="12"
                            fill={rectFill} stroke={rectStroke}
                            strokeWidth={isSelected ? 3 : 1.5}
                            className="shadow-sm cursor-pointer filter drop-shadow-md transition-all duration-300"
                            onClick={() => { handleNodeClick(nodeDatum); toggleNode(); }}
                          />
                          {/* Gender indicator */}
                          <circle
                            cx="-75" cy="-25" r="4"
                            fill={isFemale ? '#ec4899' : '#3b82f6'}
                          />
                          {nodeDatum.children && (
                            <circle cx="0" cy="40" r="8" fill={isDark ? '#818cf8' : '#4f46e5'} stroke={rectFill} strokeWidth="2" />
                          )}
                          <text fill={textNameFill} strokeWidth="0" x="0" y="-8" textAnchor="middle" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '14px' }}>
                            {nodeDatum.name}
                          </text>
                          <text fill={textAttrFill} strokeWidth="0" x="0" y="10" textAnchor="middle" style={{ fontFamily: 'Cairo, sans-serif', fontSize: '11px' }}>
                            {nodeDatum.attributes?.job !== 'غير متوفر' ? nodeDatum.attributes?.job : nodeDatum.attributes?.city}
                          </text>
                          {nodeDatum.attributes?.spouse && (
                            <text fill={isDark ? '#f472b6' : '#ec4899'} strokeWidth="0" x="0" y="26" textAnchor="middle" style={{ fontFamily: 'Cairo, sans-serif', fontSize: '10px' }}>
                              💍 {nodeDatum.attributes.spouse}
                            </text>
                          )}
                        </g>
                      );
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="glass-panel h-[500px] flex items-center justify-center flex-col text-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200 mb-2">لا توجد بيانات متاحة</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">
                  قم بإضافة أفراد إلى العائلة لبناء الشجرة.
                </p>
                <button onClick={() => openModal('add')} className="btn-primary py-2 px-6 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  إضافة أول فرد
                </button>
              </div>
            )}
          </div>

          {/* Person Profile Sidebar Panel */}
          {selectedPerson && (
            <div className="lg:col-span-4 animate-slide-up">
              <div className="card glass-panel sticky top-24 border-t-4 border-t-indigo-500 dark:border-t-indigo-400 overflow-hidden">
                {/* Profile Header Background */}
                <div className="h-24 bg-gradient-to-r from-indigo-500 px-6 to-primary-600 dark:from-indigo-600 dark:to-primary-700 relative">
                  <button
                    onClick={() => setSelectedPerson(null)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="px-6 pb-6 relative">
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 p-1 absolute -top-12 right-6 shadow-xl shadow-indigo-500/20 dark:shadow-indigo-900/40 transform rotate-3 transition-colors">
                    <div className={`w-full h-full rounded-xl flex items-center justify-center text-3xl font-black transform -rotate-3 transition-colors ${selectedPerson.gender === 'female'
                        ? 'bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900 dark:to-rose-900 text-pink-600 dark:text-pink-400'
                        : 'bg-gradient-to-br from-indigo-100 to-primary-100 dark:from-indigo-900 dark:to-primary-900 text-indigo-600 dark:text-indigo-400'
                      }`}>
                      {selectedPerson.full_name?.charAt(0) || 'ش'}
                    </div>
                  </div>

                  <div className="pt-16">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight mb-1">
                      {selectedPerson.full_name}
                    </h2>
                    <p className="text-primary-600 dark:text-primary-400 font-bold text-sm mb-6">
                      {selectedPerson.gender === 'female' ? 'عضوة' : 'عضو'} في العائلة
                      {calculateAge(selectedPerson.birth_date) !== null && (
                        <span className="mr-2 text-slate-400">• {calculateAge(selectedPerson.birth_date)} سنة</span>
                      )}
                    </p>

                    <div className="space-y-3">
                      {/* Info rows */}
                      {[
                        { label: 'تاريخ الميلاد', value: selectedPerson.birth_date ? new Date(selectedPerson.birth_date).toLocaleDateString('ar-EG') : null, icon: '📅', color: 'indigo' },
                        { label: 'المهنة', value: selectedPerson.job, icon: '💼', color: 'emerald' },
                        { label: 'المؤهل العلمي', value: selectedPerson.education, icon: '🎓', color: 'blue' },
                        { label: 'الحالة الاجتماعية', value: selectedPerson.marital_status, icon: '💍', color: 'pink' },
                        { label: 'المدينة', value: selectedPerson.city, icon: '🌍', color: 'amber' },
                        { label: 'الهاتف', value: selectedPerson.phone, icon: '📱', color: 'green' },
                      ].filter((item) => item.value).map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors">
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500">{item.label}</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.value}</p>
                          </div>
                        </div>
                      ))}

                      {selectedPerson.notes && (
                        <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50">
                          <p className="text-xs font-bold text-amber-600 dark:text-amber-500 mb-1">ملاحظات</p>
                          <p className="text-sm text-slate-700 dark:text-slate-300">{selectedPerson.notes}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                        <button
                          onClick={() => openModal('edit')}
                          className="w-full btn-secondary text-sm py-2.5 flex justify-center items-center gap-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          تعديل البيانات
                        </button>
                        <button
                          onClick={() => openModal('add-child')}
                          className="w-full btn-secondary text-sm py-2.5 flex justify-center items-center gap-2 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          إضافة ابن / ابنة
                        </button>
                        {!selectedPerson.spouse_id && (
                          <button
                            onClick={() => openModal('add-spouse')}
                            className="w-full btn-secondary text-sm py-2.5 flex justify-center items-center gap-2 border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-900/30"
                          >
                            💍 إضافة زوج / زوجة
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Person Modal */}
      <PersonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        person={selectedPerson}
        persons={persons}
        familyId={familyId}
        mode={modalMode}
      />
    </Layout>
  );
};

export default FamilyTree;
