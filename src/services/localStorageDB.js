// =============================================================
// localStorageDB.js — localStorage-based data layer for Nassab
// =============================================================

const KEYS = {
  users: 'nassab_users',
  families: 'nassab_families',
  persons: 'nassab_persons',
  familyMembers: 'nassab_family_members', // user ↔ family mapping
  currentUser: 'nassab_current_user',
  seeded: 'nassab_seeded',
};

// ─── Helpers ────────────────────────────────────────────────
const generateId = () =>
  'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);

const getStore = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

const setStore = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// ─── Users ──────────────────────────────────────────────────
export const getUsers = () => getStore(KEYS.users);

export const createUser = (email, password, fullName) => {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    throw new Error('البريد الإلكتروني مسجل مسبقاً');
  }
  const user = {
    id: generateId(),
    email,
    password, // plain text for demo only
    user_metadata: { full_name: fullName },
    created_at: new Date().toISOString(),
  };
  users.push(user);
  setStore(KEYS.users, users);
  return user;
};

export const findUserByEmail = (email) => getUsers().find((u) => u.email === email);

export const loginUser = (email, password) => {
  const user = findUserByEmail(email);
  if (!user) throw new Error('المستخدم غير موجود');
  if (user.password !== password) throw new Error('كلمة المرور غير صحيحة');
  setCurrentUser(user);
  return user;
};

export const setCurrentUser = (user) => {
  if (user) {
    const { password, ...safe } = user;
    localStorage.setItem(KEYS.currentUser, JSON.stringify(safe));
  } else {
    localStorage.removeItem(KEYS.currentUser);
  }
};

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.currentUser));
  } catch {
    return null;
  }
};

export const logoutUser = () => localStorage.removeItem(KEYS.currentUser);

// ─── Families ───────────────────────────────────────────────
export const getFamilies = () => getStore(KEYS.families);

export const createFamily = (familyName, originCity, creatorId) => {
  const families = getFamilies();
  const family = {
    id: generateId(),
    family_name: familyName,
    origin_city: originCity,
    created_by: creatorId,
    created_at: new Date().toISOString(),
  };
  families.push(family);
  setStore(KEYS.families, families);

  // Add creator as admin member
  addFamilyMember(family.id, creatorId, 'admin');

  return family;
};

export const getFamilyById = (familyId) =>
  getFamilies().find((f) => f.id === familyId) || null;

export const getUserFamilies = (userId) => {
  const memberships = getStore(KEYS.familyMembers).filter((m) => m.user_id === userId);
  const families = getFamilies();
  return memberships.map((m) => {
    const family = families.find((f) => f.id === m.family_id);
    return family ? { ...family, role: m.role } : null;
  }).filter(Boolean);
};

export const addFamilyMember = (familyId, userId, role = 'member') => {
  const members = getStore(KEYS.familyMembers);
  if (!members.find((m) => m.family_id === familyId && m.user_id === userId)) {
    members.push({ family_id: familyId, user_id: userId, role });
    setStore(KEYS.familyMembers, members);
  }
};

// ─── Persons ────────────────────────────────────────────────
export const getPersons = () => getStore(KEYS.persons);

export const createPerson = (data) => {
  const persons = getPersons();
  const person = {
    id: generateId(),
    full_name: data.full_name || '',
    birth_date: data.birth_date || null,
    death_date: data.death_date || null,
    gender: data.gender || 'male',
    job: data.job || '',
    education: data.education || '',
    marital_status: data.marital_status || '',
    phone: data.phone || '',
    city: data.city || '',
    notes: data.notes || '',
    father_id: data.father_id || null,
    mother_id: data.mother_id || null,
    spouse_id: data.spouse_id || null,
    family_id: data.family_id,
    user_id: data.user_id || null,
    created_at: new Date().toISOString(),
  };
  persons.push(person);
  setStore(KEYS.persons, persons);
  return person;
};

export const getPersonById = (personId) =>
  getPersons().find((p) => p.id === personId) || null;

export const getPersonsByFamily = (familyId) =>
  getPersons().filter((p) => p.family_id === familyId);

export const updatePerson = (personId, data) => {
  const persons = getPersons();
  const idx = persons.findIndex((p) => p.id === personId);
  if (idx === -1) throw new Error('الشخص غير موجود');
  persons[idx] = { ...persons[idx], ...data, id: personId };
  setStore(KEYS.persons, persons);
  return persons[idx];
};

export const deletePerson = (personId) => {
  let persons = getPersons();
  persons = persons.filter((p) => p.id !== personId);
  // Also clear father_id / mother_id references
  persons = persons.map((p) => ({
    ...p,
    father_id: p.father_id === personId ? null : p.father_id,
    mother_id: p.mother_id === personId ? null : p.mother_id,
    spouse_id: p.spouse_id === personId ? null : p.spouse_id,
  }));
  setStore(KEYS.persons, persons);
};

export const getPersonByUserId = (userId) =>
  getPersons().find((p) => p.user_id === userId) || null;

// ─── Search ─────────────────────────────────────────────────
export const searchAll = (query) => {
  const q = query.toLowerCase().trim();
  if (!q) return { persons: [], families: [] };

  const allPersons = getPersons();
  const allFamilies = getFamilies();

  const persons = allPersons.filter((p) => {
    const fields = [p.full_name, p.job, p.city, p.education, p.notes].filter(Boolean);
    return fields.some((f) => f.toLowerCase().includes(q));
  }).map((p) => {
    const family = allFamilies.find((f) => f.id === p.family_id);
    return { ...p, families: family || null };
  });

  const families = allFamilies.filter((f) => {
    const fields = [f.family_name, f.origin_city].filter(Boolean);
    return fields.some((field) => field.toLowerCase().includes(q));
  });

  return { persons, families };
};

// ─── Seed Data ──────────────────────────────────────────────
export const seedIfNeeded = () => {
  if (localStorage.getItem(KEYS.seeded)) return;

  // ────────────── Demo User ──────────────
  const demoUser = createUser('demo@nassab.com', 'demo123', 'محمد الأحمد');
  setCurrentUser(demoUser);

  // ═══════════════════════════════════════
  // FAMILY 1 — عائلة الأحمد (Al-Ahmad)
  // ═══════════════════════════════════════
  const family1 = {
    id: 'fam_ahmad',
    family_name: 'عائلة الأحمد',
    origin_city: 'دمشق',
    created_by: demoUser.id,
    created_at: new Date().toISOString(),
  };

  // --- Generation 1 (Grandparents) ---
  const ahmad_sr = {
    id: 'p_ahmad_sr', full_name: 'أحمد بن عبدالله الأحمد', birth_date: '1940-03-15', death_date: '2015-11-20',
    gender: 'male', job: 'تاجر أقمشة', education: 'دراسة تقليدية', marital_status: 'متزوج',
    city: 'دمشق', notes: 'مؤسس العائلة - رحمه الله', father_id: null, mother_id: null, spouse_id: 'p_fatima_sr',
    family_id: 'fam_ahmad', user_id: null, created_at: new Date().toISOString(), phone: '',
  };
  const fatima_sr = {
    id: 'p_fatima_sr', full_name: 'فاطمة بنت حسن', birth_date: '1945-07-10', death_date: null,
    gender: 'female', job: 'ربة منزل', education: 'ابتدائي', marital_status: 'أرملة',
    city: 'دمشق', notes: 'أم العائلة', father_id: null, mother_id: null, spouse_id: 'p_ahmad_sr',
    family_id: 'fam_ahmad', user_id: null, created_at: new Date().toISOString(), phone: '',
  };

  // --- Generation 2 (Parents) ---
  const khalid = {
    id: 'p_khalid', full_name: 'خالد أحمد الأحمد', birth_date: '1965-01-22', death_date: null,
    gender: 'male', job: 'مهندس مدني', education: 'بكالوريوس هندسة', marital_status: 'متزوج',
    city: 'دمشق', notes: '', father_id: 'p_ahmad_sr', mother_id: 'p_fatima_sr', spouse_id: 'p_nour',
    family_id: 'fam_ahmad', user_id: null, created_at: new Date().toISOString(), phone: '0912345678',
  };
  const nour = {
    id: 'p_nour', full_name: 'نور الهدى السعيد', birth_date: '1970-09-05', death_date: null,
    gender: 'female', job: 'معلمة', education: 'بكالوريوس تربية', marital_status: 'متزوجة',
    city: 'دمشق', notes: '', father_id: null, mother_id: null, spouse_id: 'p_khalid',
    family_id: 'fam_ahmad', user_id: null, created_at: new Date().toISOString(), phone: '',
  };
  const omar = {
    id: 'p_omar', full_name: 'عمر أحمد الأحمد', birth_date: '1968-04-12', death_date: null,
    gender: 'male', job: 'طبيب أسنان', education: 'دكتوراه طب أسنان', marital_status: 'متزوج',
    city: 'حلب', notes: '', father_id: 'p_ahmad_sr', mother_id: 'p_fatima_sr', spouse_id: 'p_hana',
    family_id: 'fam_ahmad', user_id: null, created_at: new Date().toISOString(), phone: '0956781234',
  };
  const hana = {
    id: 'p_hana', full_name: 'هناء العلي', birth_date: '1972-12-01', death_date: null,
    gender: 'female', job: 'صيدلانية', education: 'بكالوريوس صيدلة', marital_status: 'متزوجة',
    city: 'حلب', notes: '', father_id: null, mother_id: null, spouse_id: 'p_omar',
    family_id: 'fam_ahmad', user_id: null, created_at: new Date().toISOString(), phone: '',
  };
  const maha = {
    id: 'p_maha', full_name: 'مها أحمد الأحمد', birth_date: '1975-06-18', death_date: null,
    gender: 'female', job: 'محاسبة', education: 'بكالوريوس محاسبة', marital_status: 'متزوجة',
    city: 'اللاذقية', notes: '', father_id: 'p_ahmad_sr', mother_id: 'p_fatima_sr', spouse_id: null,
    family_id: 'fam_ahmad', user_id: null, created_at: new Date().toISOString(), phone: '',
  };

  // --- Generation 3 (Children) ---
  const mohammad = {
    id: 'p_mohammad', full_name: 'محمد خالد الأحمد', birth_date: '1992-03-10', death_date: null,
    gender: 'male', job: 'مطور برمجيات', education: 'ماجستير علوم حاسوب', marital_status: 'أعزب',
    city: 'دمشق', notes: '', father_id: 'p_khalid', mother_id: 'p_nour', spouse_id: null,
    family_id: 'fam_ahmad', user_id: demoUser.id, created_at: new Date().toISOString(), phone: '0991234567',
  };
  const sara = {
    id: 'p_sara', full_name: 'سارة خالد الأحمد', birth_date: '1995-08-25', death_date: null,
    gender: 'female', job: 'طبيبة', education: 'دكتوراه طب', marital_status: 'متزوجة',
    city: 'دمشق', notes: '', father_id: 'p_khalid', mother_id: 'p_nour', spouse_id: null,
    family_id: 'fam_ahmad', user_id: null, created_at: new Date().toISOString(), phone: '',
  };
  const ali = {
    id: 'p_ali', full_name: 'علي عمر الأحمد', birth_date: '1998-11-03', death_date: null,
    gender: 'male', job: 'طالب جامعي', education: 'بكالوريوس إدارة أعمال', marital_status: 'أعزب',
    city: 'حلب', notes: '', father_id: 'p_omar', mother_id: 'p_hana', spouse_id: null,
    family_id: 'fam_ahmad', user_id: null, created_at: new Date().toISOString(), phone: '',
  };
  const lina = {
    id: 'p_lina', full_name: 'لينا عمر الأحمد', birth_date: '2001-02-14', death_date: null,
    gender: 'female', job: 'مصممة جرافيك', education: 'بكالوريوس فنون', marital_status: 'عزباء',
    city: 'حلب', notes: '', father_id: 'p_omar', mother_id: 'p_hana', spouse_id: null,
    family_id: 'fam_ahmad', user_id: null, created_at: new Date().toISOString(), phone: '',
  };

  // ═══════════════════════════════════════
  // FAMILY 2 — عائلة الحسيني (Al-Husseini)
  // ═══════════════════════════════════════
  const family2 = {
    id: 'fam_husseini',
    family_name: 'عائلة الحسيني',
    origin_city: 'بغداد',
    created_by: demoUser.id,
    created_at: new Date().toISOString(),
  };

  // --- Generation 1 ---
  const hussein = {
    id: 'p_hussein', full_name: 'حسين عبدالرحمن الحسيني', birth_date: '1935-05-20', death_date: '2010-08-15',
    gender: 'male', job: 'قاضي شرعي', education: 'دراسات عليا شريعة', marital_status: 'متزوج',
    city: 'بغداد', notes: 'مؤسس العائلة - رحمه الله', father_id: null, mother_id: null, spouse_id: 'p_amina',
    family_id: 'fam_husseini', user_id: null, created_at: new Date().toISOString(), phone: '',
  };
  const amina = {
    id: 'p_amina', full_name: 'آمنة بنت سليمان', birth_date: '1940-10-12', death_date: null,
    gender: 'female', job: 'ربة منزل', education: 'ثانوية', marital_status: 'أرملة',
    city: 'بغداد', notes: '', father_id: null, mother_id: null, spouse_id: 'p_hussein',
    family_id: 'fam_husseini', user_id: null, created_at: new Date().toISOString(), phone: '',
  };

  // --- Generation 2 ---
  const zaid = {
    id: 'p_zaid', full_name: 'زيد حسين الحسيني', birth_date: '1960-02-28', death_date: null,
    gender: 'male', job: 'أستاذ جامعي', education: 'دكتوراه أدب عربي', marital_status: 'متزوج',
    city: 'بغداد', notes: '', father_id: 'p_hussein', mother_id: 'p_amina', spouse_id: 'p_layla',
    family_id: 'fam_husseini', user_id: null, created_at: new Date().toISOString(), phone: '07701234567',
  };
  const layla = {
    id: 'p_layla', full_name: 'ليلى الجبوري', birth_date: '1965-06-15', death_date: null,
    gender: 'female', job: 'مديرة مدرسة', education: 'ماجستير تربية', marital_status: 'متزوجة',
    city: 'بغداد', notes: '', father_id: null, mother_id: null, spouse_id: 'p_zaid',
    family_id: 'fam_husseini', user_id: null, created_at: new Date().toISOString(), phone: '',
  };
  const youssef = {
    id: 'p_youssef', full_name: 'يوسف حسين الحسيني', birth_date: '1963-09-08', death_date: null,
    gender: 'male', job: 'مهندس كهرباء', education: 'بكالوريوس هندسة كهربائية', marital_status: 'متزوج',
    city: 'البصرة', notes: '', father_id: 'p_hussein', mother_id: 'p_amina', spouse_id: 'p_samira',
    family_id: 'fam_husseini', user_id: null, created_at: new Date().toISOString(), phone: '',
  };
  const samira = {
    id: 'p_samira', full_name: 'سميرة الربيعي', birth_date: '1968-03-22', death_date: null,
    gender: 'female', job: 'طبيبة أطفال', education: 'دكتوراه طب أطفال', marital_status: 'متزوجة',
    city: 'البصرة', notes: '', father_id: null, mother_id: null, spouse_id: 'p_youssef',
    family_id: 'fam_husseini', user_id: null, created_at: new Date().toISOString(), phone: '',
  };

  // --- Generation 3 ---
  const rania = {
    id: 'p_rania', full_name: 'رانيا زيد الحسيني', birth_date: '1990-12-05', death_date: null,
    gender: 'female', job: 'محامية', education: 'ماجستير قانون', marital_status: 'متزوجة',
    city: 'بغداد', notes: '', father_id: 'p_zaid', mother_id: 'p_layla', spouse_id: null,
    family_id: 'fam_husseini', user_id: null, created_at: new Date().toISOString(), phone: '',
  };
  const hassan = {
    id: 'p_hassan', full_name: 'حسن زيد الحسيني', birth_date: '1993-07-19', death_date: null,
    gender: 'male', job: 'مهندس معماري', education: 'بكالوريوس هندسة معمارية', marital_status: 'أعزب',
    city: 'بغداد', notes: '', father_id: 'p_zaid', mother_id: 'p_layla', spouse_id: null,
    family_id: 'fam_husseini', user_id: null, created_at: new Date().toISOString(), phone: '',
  };
  const dina = {
    id: 'p_dina', full_name: 'دينا يوسف الحسيني', birth_date: '1996-04-30', death_date: null,
    gender: 'female', job: 'مهندسة برمجيات', education: 'بكالوريوس علوم حاسوب', marital_status: 'عزباء',
    city: 'البصرة', notes: '', father_id: 'p_youssef', mother_id: 'p_samira', spouse_id: null,
    family_id: 'fam_husseini', user_id: null, created_at: new Date().toISOString(), phone: '',
  };
  const tarek = {
    id: 'p_tarek', full_name: 'طارق يوسف الحسيني', birth_date: '1999-01-11', death_date: null,
    gender: 'male', job: 'طالب طب', education: 'كلية الطب - سنة خامسة', marital_status: 'أعزب',
    city: 'البصرة', notes: '', father_id: 'p_youssef', mother_id: 'p_samira', spouse_id: null,
    family_id: 'fam_husseini', user_id: null, created_at: new Date().toISOString(), phone: '',
  };

  // ─── Persist Everything ───────────────
  setStore(KEYS.families, [family1, family2]);
  setStore(KEYS.persons, [
    ahmad_sr, fatima_sr, khalid, nour, omar, hana, maha,
    mohammad, sara, ali, lina,
    hussein, amina, zaid, layla, youssef, samira,
    rania, hassan, dina, tarek,
  ]);
  setStore(KEYS.familyMembers, [
    { family_id: 'fam_ahmad', user_id: demoUser.id, role: 'admin' },
    { family_id: 'fam_husseini', user_id: demoUser.id, role: 'admin' },
  ]);

  localStorage.setItem(KEYS.seeded, 'true');
};
