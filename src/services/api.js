// =============================================================
// api.js — localStorage-based API layer (no backend required)
// =============================================================

import * as db from './localStorageDB';

// Wrapper to match the { data: { ... } } shape that existing pages expect
const mockRes = (data) => Promise.resolve({ data });

// Auth API
export const authAPI = {
  register: async (email, password, fullName) => {
    const user = db.createUser(email, password, fullName);
    db.setCurrentUser(user);
    const { password: _, ...safeUser } = user;
    return { data: { user: safeUser, session: { access_token: 'local-token' } } };
  },
  login: async (email, password) => {
    const user = db.loginUser(email, password);
    const { password: _, ...safeUser } = user;
    return { data: { user: safeUser, session: { access_token: 'local-token' } } };
  },
  logout: async () => {
    db.logoutUser();
    return mockRes({});
  },
  getCurrentUser: async () => {
    const user = db.getCurrentUser();
    return mockRes({ user });
  },
};

// Family API
export const familyAPI = {
  create: async (formData) => {
    const user = db.getCurrentUser();
    const family = db.createFamily(
      formData.familyName || formData.family_name || formData,
      formData.originCity || formData.origin_city || '',
      user?.id
    );

    // If grandfather data is provided, create the root person
    if (formData.grandfatherName) {
      db.createPerson({
        full_name: formData.grandfatherName,
        birth_date: formData.grandfatherBirthDate || null,
        death_date: formData.grandfatherDeathDate || null,
        job: formData.grandfatherJob || '',
        gender: 'male',
        family_id: family.id,
      });
    }

    return { data: { family } };
  },
  getAll: async () => {
    const user = db.getCurrentUser();
    const families = user ? db.getUserFamilies(user.id) : [];
    return { data: { families } };
  },
  getById: async (familyId) => {
    const family = db.getFamilyById(familyId);
    return { data: { family } };
  },
  update: async (familyId, data) => {
    // Basic update — for future use
    return mockRes({});
  },
};

// Person API
export const personAPI = {
  create: async (data) => {
    const person = db.createPerson(data);
    return { data: { person } };
  },
  getById: async (personId) => {
    const person = db.getPersonById(personId);
    return { data: { person } };
  },
  getProfile: async () => {
    const user = db.getCurrentUser();
    const person = user ? db.getPersonByUserId(user.id) : null;
    return { data: { person } };
  },
  getFamilyMembers: async (familyId) => {
    const persons = db.getPersonsByFamily(familyId);
    return { data: { persons } };
  },
  update: async (personId, data) => {
    const person = db.updatePerson(personId, data);
    return { data: { person } };
  },
  delete: async (personId) => {
    db.deletePerson(personId);
    return mockRes({});
  },
};

// Edit Request API (stub — kept for sidebar/routing compatibility)
export const editRequestAPI = {
  create: async () => mockRes({}),
  getUserRequests: async () => mockRes({ requests: [] }),
  getFamilyRequests: async () => mockRes({ requests: [] }),
  approve: async () => mockRes({}),
  reject: async () => mockRes({}),
};

// Search API
export const searchAPI = {
  search: async (query) => {
    const results = db.searchAll(query);
    return { data: { results } };
  },
};

export default {};
