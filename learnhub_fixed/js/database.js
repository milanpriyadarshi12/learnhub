/* ================================================================
   LearnHub — Complete JavaScript Database System
   Frontend-only: localStorage only. No backend, no Supabase.
   Works with Live Server, file://, or any static host.
   ================================================================ */

'use strict';

window.LH_DB = (function () {

  /* ── Storage Keys ──────────────────────────────────────────── */
  const KEYS = {
    USERS:        'lh_users_db',
    COURSES:      'lh_courses_db',
    MOCK_TESTS:   'lh_mock_tests_db',
    TEST_RESULTS: 'lh_test_results_db',
    STUDY_MATS:   'lh_study_materials_db'
  };

  /* ── Seed Data ─────────────────────────────────────────────── */

  const SEED_USERS = [
    {
      id: 1,
      name: 'Admin',
      email: 'admin@learnhub.com',
      password: 'admin123',
      role: 'admin',
      createdAt: '2024-01-01',
      profile: { avatar: '', phone: '', targetExam: '', bio: '' },
      enrolledCourses: [],
      completedCourses: [],
      mockTests: [],
      savedMaterials: [],
      achievements: ['Platform Builder'],
      analytics: { testsAttempted: 0, averageScore: 0, studyHours: 0 },
      settings: { darkMode: false, language: 'en' }
    },
    {
      id: 2,
      name: 'Super Admin',
      email: 'superadmin@learnhub.com',
      password: 'super123',
      role: 'admin',
      createdAt: '2024-01-01',
      profile: { avatar: '', phone: '', targetExam: '', bio: '' },
      enrolledCourses: [],
      completedCourses: [],
      mockTests: [],
      savedMaterials: [],
      achievements: [],
      analytics: { testsAttempted: 0, averageScore: 0, studyHours: 0 },
      settings: { darkMode: false, language: 'en' }
    },
    {
      id: 101,
      name: 'Rahul Sharma',
      email: 'student@learnhub.com',
      password: 'student123',
      role: 'student',
      createdAt: '2024-03-15',
      profile: {
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
        phone: '+91 9876543210',
        targetExam: 'SSC CGL 2024',
        bio: 'Preparing for SSC CGL 2024'
      },
      enrolledCourses: [1, 2, 3],
      completedCourses: [2],
      mockTests: [1, 2, 3],
      savedMaterials: [1, 2],
      achievements: ['Quiz Master', '7-Day Streak', 'Top Performer'],
      analytics: { testsAttempted: 42, averageScore: 78, studyHours: 156 },
      settings: { darkMode: false, language: 'en' }
    },
    {
      id: 102,
      name: 'Priya Patel',
      email: 'priya@learnhub.com',
      password: 'priya123',
      role: 'student',
      createdAt: '2024-04-10',
      profile: {
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b1faed5c?w=40&h=40&fit=crop',
        phone: '+91 9123456789',
        targetExam: 'Banking (IBPS PO)',
        bio: 'Aiming for IBPS PO 2024'
      },
      enrolledCourses: [4, 5],
      completedCourses: [],
      mockTests: [4, 5],
      savedMaterials: [3],
      achievements: ['Fast Learner'],
      analytics: { testsAttempted: 18, averageScore: 82, studyHours: 89 },
      settings: { darkMode: false, language: 'en' }
    },
    {
      id: 103,
      name: 'Amit Kumar',
      email: 'amit@learnhub.com',
      password: 'amit123',
      role: 'student',
      createdAt: '2024-02-20',
      profile: {
        avatar: '',
        phone: '+91 9988776655',
        targetExam: 'UPSC Civil Services',
        bio: 'UPSC aspirant 2025'
      },
      enrolledCourses: [6, 7],
      completedCourses: [6],
      mockTests: [6],
      savedMaterials: [4, 5],
      achievements: ['Consistent Learner', '30-Day Streak'],
      analytics: { testsAttempted: 65, averageScore: 71, studyHours: 230 },
      settings: { darkMode: false, language: 'en' }
    }
  ];

  const SEED_COURSES = [
    { id: 1, title: 'SSC CGL Complete Foundation 2024', category: 'SSC', instructor: 'Rakesh Kumar', price: 2499, originalPrice: 3499, rating: 4.8, students: 15000, hours: 120, image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop', badge: '30% OFF', description: 'Complete preparation for SSC CGL Tier 1 & Tier 2.' },
    { id: 2, title: 'Quantitative Aptitude Masterclass', category: 'SSC', instructor: 'Sunil Verma', price: 1299, originalPrice: 1999, rating: 4.7, students: 22000, hours: 80, image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=400&h=200&fit=crop', badge: 'BESTSELLER', description: 'Master QA for all competitive exams.' },
    { id: 3, title: 'English Grammar Complete Course', category: 'General', instructor: 'Sunita Verma', price: 999, originalPrice: 1499, rating: 4.6, students: 18500, hours: 60, image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=200&fit=crop', badge: 'POPULAR', description: 'From basics to advanced English grammar.' },
    { id: 4, title: 'Banking PO Complete Course', category: 'Banking', instructor: 'Amit Sharma', price: 3499, originalPrice: 4999, rating: 4.9, students: 28000, hours: 150, image: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=400&h=200&fit=crop', badge: '30% OFF', description: 'Complete IBPS PO & SBI PO preparation.' },
    { id: 5, title: 'IBPS Clerk Preparation', category: 'Banking', instructor: 'Neha Gupta', price: 1999, originalPrice: 2999, rating: 4.7, students: 12000, hours: 90, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop', badge: 'NEW', description: 'Crack IBPS Clerk with comprehensive preparation.' },
    { id: 6, title: 'UPSC Civil Services Prelims', category: 'UPSC', instructor: 'Dr. Priya Singh', price: 4999, originalPrice: 6999, rating: 4.9, students: 9500, hours: 200, image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=200&fit=crop', badge: 'PREMIUM', description: 'Comprehensive UPSC Prelims preparation.' },
    { id: 7, title: 'UPSC Mains GS Papers', category: 'UPSC', instructor: 'Dr. Rahul Gupta', price: 5999, originalPrice: 7999, rating: 4.8, students: 6200, hours: 240, image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=200&fit=crop', badge: 'ADVANCED', description: 'Master GS Papers 1-4 for UPSC Mains.' },
    { id: 8, title: 'Railway NTPC Master Course', category: 'Railway', instructor: 'Vikram Singh', price: 1799, originalPrice: 2499, rating: 4.6, students: 31000, hours: 100, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop', badge: 'TRENDING', description: 'Complete RRB NTPC preparation.' }
  ];

  const SEED_MOCK_TESTS = [
    { id: 1, title: 'SSC CGL Tier 1 - Full Mock Test 1', category: 'SSC', questions: 100, duration: 60, maxScore: 200, difficulty: 'Medium', freeAccess: true },
    { id: 2, title: 'SSC CGL Tier 1 - Full Mock Test 2', category: 'SSC', questions: 100, duration: 60, maxScore: 200, difficulty: 'Hard', freeAccess: false },
    { id: 3, title: 'SSC CHSL Mock Test', category: 'SSC', questions: 100, duration: 60, maxScore: 200, difficulty: 'Easy', freeAccess: true },
    { id: 4, title: 'IBPS PO Prelims - Mock 1', category: 'Banking', questions: 100, duration: 60, maxScore: 100, difficulty: 'Medium', freeAccess: true },
    { id: 5, title: 'SBI PO Prelims Mock', category: 'Banking', questions: 100, duration: 60, maxScore: 100, difficulty: 'Hard', freeAccess: false },
    { id: 6, title: 'UPSC Prelims GS Paper 1', category: 'UPSC', questions: 100, duration: 120, maxScore: 200, difficulty: 'Hard', freeAccess: false },
    { id: 7, title: 'Railway NTPC - General Awareness', category: 'Railway', questions: 50, duration: 30, maxScore: 50, difficulty: 'Easy', freeAccess: true }
  ];

  const SEED_TEST_RESULTS = [
    { id: 1, userId: 101, testId: 1, score: 156, maxScore: 200, percentage: 78, rank: 234, timeTaken: 54, date: '2024-05-18', correct: 78, incorrect: 15, unattempted: 7 },
    { id: 2, userId: 101, testId: 2, score: 162, maxScore: 200, percentage: 81, rank: 198, timeTaken: 59, date: '2024-05-17', correct: 81, incorrect: 12, unattempted: 7 },
    { id: 3, userId: 101, testId: 3, score: 148, maxScore: 200, percentage: 74, rank: 312, timeTaken: 57, date: '2024-05-16', correct: 74, incorrect: 18, unattempted: 8 },
    { id: 4, userId: 102, testId: 4, score: 82, maxScore: 100, percentage: 82, rank: 145, timeTaken: 55, date: '2024-05-15', correct: 82, incorrect: 12, unattempted: 6 },
    { id: 5, userId: 103, testId: 6, score: 142, maxScore: 200, percentage: 71, rank: 456, timeTaken: 118, date: '2024-05-14', correct: 71, incorrect: 22, unattempted: 7 }
  ];

  const SEED_STUDY_MATERIALS = [
    { id: 1, title: 'SSC CGL Previous Year Papers (2015-2024)', category: 'SSC', type: 'PDF', size: '12 MB', downloads: 45000, free: true },
    { id: 2, title: 'Quantitative Aptitude Formula Sheet', category: 'General', type: 'PDF', size: '2 MB', downloads: 78000, free: true },
    { id: 3, title: 'Banking Awareness Complete Notes', category: 'Banking', type: 'PDF', size: '8 MB', downloads: 32000, free: false },
    { id: 4, title: 'UPSC Current Affairs May 2024', category: 'UPSC', type: 'PDF', size: '5 MB', downloads: 21000, free: true },
    { id: 5, title: 'UPSC GS Paper 1 Notes', category: 'UPSC', type: 'Notes', size: '15 MB', downloads: 18000, free: false },
    { id: 6, title: 'Railway GK Capsule 2024', category: 'Railway', type: 'PDF', size: '3 MB', downloads: 29000, free: true }
  ];

  /* ── Generic load/save helpers ─────────────────────────────── */
  function _load(key, seed) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : (seed ? seed.map(function (i) { return Object.assign({}, i); }) : []);
    } catch (e) {
      return seed ? seed.map(function (i) { return Object.assign({}, i); }) : [];
    }
  }

  function _save(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
  }

  /* ── Users: always ensure seed admins are present ───────────── */
  function _loadUsers() {
    const stored = _load(KEYS.USERS, null);
    if (!stored || stored.length === 0) {
      const fresh = SEED_USERS.map(function (u) { return Object.assign({}, u); });
      _save(KEYS.USERS, fresh);
      return fresh;
    }
    const adminIds = new Set(stored.map(function (u) { return u.id; }));
    const missing  = SEED_USERS.filter(function (u) { return u.role === 'admin' && !adminIds.has(u.id); });
    let result = stored;
    if (missing.length > 0) {
      result = missing.concat(stored);
    }
    // Migrate: ensure subscription + purchase arrays on all users
    let dirty = false;
    result = result.map(function(u) {
      if (u.role !== 'student') return u;
      const copy = Object.assign({}, u);
      if (!copy.subscription)       { copy.subscription = 'free'; dirty = true; }
      if (!copy.purchasedTests)     { copy.purchasedTests = []; dirty = true; }
      if (!copy.purchasedMaterials) { copy.purchasedMaterials = []; dirty = true; }
      return copy;
    });
    if (dirty || missing.length > 0) _save(KEYS.USERS, result);
    return result;
  }

  function _saveUsers(users) { _save(KEYS.USERS, users); }

  function _loadSeeded(key, seed) {
    const stored = _load(key, null);
    if (!stored || stored.length === 0) {
      _save(key, seed);
      return seed.slice();
    }
    return stored;
  }

  /* ── Public API ─────────────────────────────────────────────── */
  return {

    /* ─── USER METHODS ─────────────────────────────────────── */

    findByEmail: function (email) {
      const users = _loadUsers();
      return users.find(function (u) {
        return u.email.toLowerCase() === email.toLowerCase().trim();
      }) || null;
    },

    findById: function (id) {
      return _loadUsers().find(function (u) { return u.id === id; }) || null;
    },

    authenticate: function (email, password) {
      const user = this.findByEmail(email);
      if (!user) return { error: 'no_user' };
      if (user.password !== password.trim()) return { error: 'wrong_password' };
      const safe = Object.assign({}, user);
      delete safe.password;
      return { user: safe };
    },

    register: function (name, email, password, phone, targetExam) {
      const users = _loadUsers();
      const exists = users.find(function (u) {
        return u.email.toLowerCase() === email.toLowerCase().trim();
      });
      if (exists) return { error: 'email_taken' };
      if (password.length < 8) return { error: 'weak_password' };

      const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password,
        role: 'student',
        subscription: 'free',
        createdAt: new Date().toISOString().split('T')[0],
        profile: { avatar: '', phone: phone || '', targetExam: targetExam || '', bio: '' },
        enrolledCourses: [],
        purchasedTests: [],
        purchasedMaterials: [],
        completedCourses: [],
        mockTests: [],
        savedMaterials: [],
        achievements: ['New Member'],
        analytics: { testsAttempted: 0, averageScore: 0, studyHours: 0 },
        settings: { darkMode: false, language: 'en' }
      };

      users.push(newUser);
      _saveUsers(users);
      const safe = Object.assign({}, newUser);
      delete safe.password;
      return { user: safe };
    },

    updateProfile: function (userId, profileData) {
      const users = _loadUsers();
      const idx = users.findIndex(function (u) { return u.id === userId; });
      if (idx === -1) return { error: 'not_found' };
      if (profileData.name) users[idx].name = profileData.name;
      users[idx].profile = Object.assign({}, users[idx].profile || {}, profileData);
      _saveUsers(users);
      const safe = Object.assign({}, users[idx]);
      delete safe.password;
      return { user: safe };
    },

    /* Full profile update — all fields including nested profile object */
    updateProfileFull: function (userId, data) {
      const users = _loadUsers();
      const idx = users.findIndex(function (u) { return u.id === userId; });
      if (idx === -1) return { error: 'not_found' };
      const u = users[idx];
      if (data.name)  u.name  = data.name.trim();
      if (data.email) u.email = data.email.toLowerCase().trim();
      if (!u.profile) u.profile = {};
      if (data.phone      !== undefined) u.profile.phone      = data.phone;
      if (data.dob        !== undefined) u.profile.dob        = data.dob;
      if (data.address    !== undefined) u.profile.address    = data.address;
      if (data.bio        !== undefined) u.profile.bio        = data.bio;
      if (data.targetExam !== undefined) u.profile.targetExam = data.targetExam;
      if (data.studyHours !== undefined) u.profile.studyHours = data.studyHours;
      if (data.avatar     !== undefined) u.profile.avatar     = data.avatar;
      users[idx] = u;
      _saveUsers(users);
      const safe = Object.assign({}, u);
      delete safe.password;
      return { user: safe };
    },

    getAllStudents: function () {
      return _loadUsers()
        .filter(function (u) { return u.role === 'student'; })
        .map(function (u) { const s = Object.assign({}, u); delete s.password; return s; });
    },

    getCounts: function () {
      const users = _loadUsers();
      return {
        total:    users.length,
        admins:   users.filter(function (u) { return u.role === 'admin'; }).length,
        students: users.filter(function (u) { return u.role === 'student'; }).length
      };
    },

    /* ─── COURSE METHODS ───────────────────────────────────── */

    getCourses: function () {
      return _loadSeeded(KEYS.COURSES, SEED_COURSES);
    },

    getCourseById: function (id) {
      return this.getCourses().find(function (c) { return c.id === id; }) || null;
    },

    enrollCourse: function (userId, courseId) {
      const users = _loadUsers();
      const idx = users.findIndex(function (u) { return u.id === userId; });
      if (idx === -1) return { error: 'user_not_found' };
      if (!users[idx].enrolledCourses) users[idx].enrolledCourses = [];
      if (users[idx].enrolledCourses.includes(courseId)) return { error: 'already_enrolled' };
      users[idx].enrolledCourses.push(courseId);
      _saveUsers(users);
      return { success: true };
    },

    getEnrolledCourses: function (userId) {
      const user = this.findById(userId);
      if (!user || !user.enrolledCourses) return [];
      const courses = this.getCourses();
      return user.enrolledCourses.map(function (id) {
        return courses.find(function (c) { return c.id === id; });
      }).filter(Boolean);
    },

    /* ─── MOCK TEST METHODS ────────────────────────────────── */

    getMockTests: function () {
      return _loadSeeded(KEYS.MOCK_TESTS, SEED_MOCK_TESTS);
    },

    getMockTestById: function (id) {
      return this.getMockTests().find(function (t) { return t.id === id; }) || null;
    },

    /* ─── TEST RESULTS METHODS ─────────────────────────────── */

    getTestResults: function () {
      return _loadSeeded(KEYS.TEST_RESULTS, SEED_TEST_RESULTS);
    },

    getTestResultsByUser: function (userId) {
      return this.getTestResults().filter(function (r) { return r.userId === userId; });
    },

    saveTestResult: function (result) {
      const results = this.getTestResults();
      const newResult = Object.assign(
        { id: Date.now(), date: new Date().toISOString().split('T')[0] },
        result
      );
      results.push(newResult);
      _save(KEYS.TEST_RESULTS, results);

      /* Update user analytics */
      const users = _loadUsers();
      const userIdx = users.findIndex(function (u) { return u.id === result.userId; });
      if (userIdx !== -1) {
        const userResults = results.filter(function (r) { return r.userId === result.userId; });
        const avg = Math.round(userResults.reduce(function (s, r) { return s + r.percentage; }, 0) / userResults.length);
        users[userIdx].analytics = users[userIdx].analytics || {};
        users[userIdx].analytics.testsAttempted = userResults.length;
        users[userIdx].analytics.averageScore   = avg;
        if (!users[userIdx].mockTests) users[userIdx].mockTests = [];
        if (!users[userIdx].mockTests.includes(result.testId)) {
          users[userIdx].mockTests.push(result.testId);
        }
        _saveUsers(users);
      }
      return { success: true, result: newResult };
    },

    /* ─── STUDY MATERIALS ──────────────────────────────────── */

    getStudyMaterials: function () {
      return _loadSeeded(KEYS.STUDY_MATS, SEED_STUDY_MATERIALS);
    },

    saveMaterial: function (userId, materialId) {
      const users = _loadUsers();
      const idx = users.findIndex(function (u) { return u.id === userId; });
      if (idx === -1) return { error: 'user_not_found' };
      if (!users[idx].savedMaterials) users[idx].savedMaterials = [];
      if (!users[idx].savedMaterials.includes(materialId)) {
        users[idx].savedMaterials.push(materialId);
        _saveUsers(users);
      }
      return { success: true };
    },

    getSavedMaterials: function (userId) {
      const user = this.findById(userId);
      if (!user || !user.savedMaterials) return [];
      const mats = this.getStudyMaterials();
      return user.savedMaterials.map(function (id) {
        return mats.find(function (m) { return m.id === id; });
      }).filter(Boolean);
    },

    /* ─── ANALYTICS ────────────────────────────────────────── */

    getUserAnalytics: function (userId) {
      const user = this.findById(userId);
      if (!user) return null;
      const results  = this.getTestResultsByUser(userId);
      const enrolled = this.getEnrolledCourses(userId);
      return {
        testsAttempted:   results.length,
        averageScore:     results.length
          ? Math.round(results.reduce(function (s, r) { return s + r.percentage; }, 0) / results.length)
          : 0,
        studyHours:       (user.analytics && user.analytics.studyHours) || 0,
        coursesEnrolled:  enrolled.length,
        coursesCompleted: (user.completedCourses || []).length,
        achievements:     user.achievements || [],
        recentTests:      results.slice(-5).reverse()
      };
    },

    addAchievement: function (userId, achievement) {
      const users = _loadUsers();
      const idx = users.findIndex(function (u) { return u.id === userId; });
      if (idx === -1) return;
      if (!users[idx].achievements) users[idx].achievements = [];
      if (!users[idx].achievements.includes(achievement)) {
        users[idx].achievements.push(achievement);
        _saveUsers(users);
      }
    },

    /* ─── SUBSCRIPTION / PURCHASE METHODS ──────────────────── */

    recordPurchase: function (userId, type, itemId) {
      const users = _loadUsers();
      const idx = users.findIndex(function (u) { return u.id === userId; });
      if (idx === -1) return { error: 'user_not_found' };

      const u = users[idx];
      if (!u.subscription)      u.subscription      = 'free';
      if (!u.purchasedTests)    u.purchasedTests    = [];
      if (!u.purchasedMaterials) u.purchasedMaterials = [];
      if (!u.enrolledCourses)   u.enrolledCourses   = [];

      if (type === 'course') {
        if (!u.enrolledCourses.includes(itemId)) u.enrolledCourses.push(itemId);
        u.subscription = 'paid';
      } else if (type === 'test') {
        if (!u.purchasedTests.includes(itemId)) u.purchasedTests.push(itemId);
        u.subscription = 'paid';
      } else if (type === 'material') {
        if (!u.purchasedMaterials.includes(itemId)) u.purchasedMaterials.push(itemId);
        u.subscription = 'paid';
      } else if (type === 'liveclass') {
        u.subscription = 'paid';
      }

      users[idx] = u;
      _saveUsers(users);

      const safe = Object.assign({}, u);
      delete safe.password;
      return { success: true, updatedUser: safe };
    },

    setSubscription: function (userId, level) {
      const users = _loadUsers();
      const idx = users.findIndex(function (u) { return u.id === userId; });
      if (idx === -1) return { error: 'not_found' };
      users[idx].subscription = level;
      _saveUsers(users);
      return { success: true };
    },

    getSubscriptionStats: function () {
      const students = _loadUsers().filter(function (u) { return u.role === 'student'; });
      const paid  = students.filter(function (u) { return u.subscription === 'paid'; });
      const free  = students.filter(function (u) { return (u.subscription || 'free') === 'free'; });
      return {
        total:    students.length,
        paid:     paid.length,
        free:     free.length,
        revenue:  paid.length * 999  // placeholder
      };
    }
  };

})();
