/* =============================================================
   LearnHub Admin Panel — admin.js
   Frontend-only: localStorage, no backend, no Supabase
   ============================================================= */
'use strict';

/* ── Storage Keys (mirror database.js) ─────────────────────── */
const ADMIN_KEYS = {
  USERS:      'lh_users_db',
  COURSES:    'lh_courses_db',
  TESTS:      'lh_mock_tests_db',
  RESULTS:    'lh_test_results_db',
  MATERIALS:  'lh_study_materials_db',
  SETTINGS:   'lh_admin_settings',
  SESSION:    'lh_admin_session'
};

/* ── Seed helpers ───────────────────────────────────────────── */
const SEED_USERS = [
  { id:1, name:'Admin', email:'admin@learnhub.com', password:'admin123', role:'admin', createdAt:'2024-01-01', enrolledCourses:[], mockTests:[], analytics:{testsAttempted:0,averageScore:0,studyHours:0}, status:'active' },
  { id:2, name:'Super Admin', email:'superadmin@learnhub.com', password:'super123', role:'admin', createdAt:'2024-01-01', enrolledCourses:[], mockTests:[], analytics:{testsAttempted:0,averageScore:0,studyHours:0}, status:'active' },
  { id:101, name:'Rahul Sharma', email:'student@learnhub.com', password:'student123', role:'student', createdAt:'2024-03-15', enrolledCourses:[1,2,3], mockTests:[1,2,3], analytics:{testsAttempted:42,averageScore:78,studyHours:156}, status:'active', profile:{phone:'+91 9876543210',targetExam:'SSC CGL'} },
  { id:102, name:'Priya Patel', email:'priya@learnhub.com', password:'priya123', role:'student', createdAt:'2024-04-10', enrolledCourses:[4,5], mockTests:[4,5], analytics:{testsAttempted:18,averageScore:82,studyHours:89}, status:'active', profile:{phone:'+91 9123456789',targetExam:'Banking PO'} },
  { id:103, name:'Amit Kumar', email:'amit@learnhub.com', password:'amit123', role:'student', createdAt:'2024-02-20', enrolledCourses:[6], mockTests:[6], analytics:{testsAttempted:31,averageScore:71,studyHours:210}, status:'active', profile:{phone:'+91 9988776655',targetExam:'UPSC'} },
  { id:104, name:'Neha Joshi', email:'neha@learnhub.com', password:'neha123', role:'student', createdAt:'2024-05-01', enrolledCourses:[2,3], mockTests:[1], analytics:{testsAttempted:7,averageScore:68,studyHours:42}, status:'active', profile:{phone:'+91 9000112233',targetExam:'SSC CHSL'} },
  { id:105, name:'Rohit Verma', email:'rohit@learnhub.com', password:'rohit123', role:'student', createdAt:'2024-05-10', enrolledCourses:[8], mockTests:[], analytics:{testsAttempted:3,averageScore:65,studyHours:20}, status:'blocked', profile:{phone:'+91 9112233445',targetExam:'Railway'} }
];

const SEED_COURSES = [
  { id:1, title:'SSC CGL Complete Foundation 2024', category:'SSC', instructor:'Rakesh Kumar', price:2499, originalPrice:3499, rating:4.8, students:15000, hours:120, image:'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop', badge:'30% OFF', description:'Complete preparation for SSC CGL Tier 1 & Tier 2.' },
  { id:2, title:'Quantitative Aptitude Masterclass', category:'SSC', instructor:'Sunil Verma', price:1299, originalPrice:1999, rating:4.7, students:22000, hours:80, image:'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=400&h=200&fit=crop', badge:'BESTSELLER', description:'Master QA for all competitive exams.' },
  { id:3, title:'English Grammar Complete Course', category:'General', instructor:'Sunita Verma', price:999, originalPrice:1499, rating:4.6, students:18500, hours:60, image:'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=200&fit=crop', badge:'POPULAR', description:'From basics to advanced English grammar.' },
  { id:4, title:'Banking PO Complete Course', category:'Banking', instructor:'Amit Sharma', price:3499, originalPrice:4999, rating:4.9, students:28000, hours:150, image:'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=400&h=200&fit=crop', badge:'30% OFF', description:'Complete IBPS PO & SBI PO preparation.' },
  { id:5, title:'IBPS Clerk Preparation', category:'Banking', instructor:'Neha Gupta', price:1999, originalPrice:2999, rating:4.7, students:12000, hours:90, image:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop', badge:'NEW', description:'Crack IBPS Clerk with comprehensive preparation.' },
  { id:6, title:'UPSC Civil Services Prelims', category:'UPSC', instructor:'Dr. Priya Singh', price:4999, originalPrice:6999, rating:4.9, students:9500, hours:200, image:'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=200&fit=crop', badge:'PREMIUM', description:'Comprehensive UPSC Prelims preparation.' },
  { id:7, title:'UPSC Mains GS Papers', category:'UPSC', instructor:'Dr. Rahul Gupta', price:5999, originalPrice:7999, rating:4.8, students:6200, hours:240, image:'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=200&fit=crop', badge:'ADVANCED', description:'Master GS Papers 1-4 for UPSC Mains.' },
  { id:8, title:'Railway NTPC Master Course', category:'Railway', instructor:'Vikram Singh', price:1799, originalPrice:2499, rating:4.6, students:31000, hours:100, image:'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop', badge:'TRENDING', description:'Complete RRB NTPC preparation.' }
];

const SEED_TESTS = [
  { id:1, title:'SSC CGL Tier 1 - Full Mock Test 1', category:'SSC', questions:100, duration:60, maxScore:200, difficulty:'Medium', freeAccess:true, createdAt:'2024-01-10' },
  { id:2, title:'SSC CGL Tier 1 - Full Mock Test 2', category:'SSC', questions:100, duration:60, maxScore:200, difficulty:'Hard', freeAccess:false, createdAt:'2024-01-15' },
  { id:3, title:'SSC CHSL Mock Test', category:'SSC', questions:100, duration:60, maxScore:200, difficulty:'Easy', freeAccess:true, createdAt:'2024-02-01' },
  { id:4, title:'IBPS PO Prelims - Mock 1', category:'Banking', questions:100, duration:60, maxScore:100, difficulty:'Medium', freeAccess:true, createdAt:'2024-02-10' },
  { id:5, title:'SBI PO Prelims Mock', category:'Banking', questions:100, duration:60, maxScore:100, difficulty:'Hard', freeAccess:false, createdAt:'2024-03-01' },
  { id:6, title:'UPSC Prelims GS Paper 1', category:'UPSC', questions:100, duration:120, maxScore:200, difficulty:'Hard', freeAccess:false, createdAt:'2024-03-15' },
  { id:7, title:'Railway NTPC - General Awareness', category:'Railway', questions:50, duration:30, maxScore:50, difficulty:'Easy', freeAccess:true, createdAt:'2024-04-01' }
];

const SEED_MATERIALS = [
  { id:1, title:'SSC CGL Previous Year Papers (2015-2024)', category:'SSC', type:'PDF', size:'12 MB', url:'#', downloads:45000, free:true, createdAt:'2024-01-01' },
  { id:2, title:'Quantitative Aptitude Formula Sheet', category:'General', type:'PDF', size:'2 MB', url:'#', downloads:78000, free:true, createdAt:'2024-01-05' },
  { id:3, title:'Banking Awareness Complete Notes', category:'Banking', type:'PDF', size:'8 MB', url:'#', downloads:32000, free:false, createdAt:'2024-02-01' },
  { id:4, title:'UPSC Current Affairs May 2024', category:'UPSC', type:'PDF', size:'5 MB', url:'#', downloads:21000, free:true, createdAt:'2024-04-01' },
  { id:5, title:'UPSC GS Paper 1 Notes', category:'UPSC', type:'Notes', size:'15 MB', url:'#', downloads:18000, free:false, createdAt:'2024-03-01' },
  { id:6, title:'Railway GK Capsule 2024', category:'Railway', type:'PDF', size:'3 MB', url:'#', downloads:29000, free:true, createdAt:'2024-03-20' }
];

const DEFAULT_SETTINGS = {
  siteName: 'LearnHub',
  logoUrl: '',
  themeColor: '#6366f1',
  footerText: '© 2024 LearnHub. India\'s Most Trusted Learning Platform.',
  adminEmail: 'admin@learnhub.com'
};

/* ── DB Helpers ─────────────────────────────────────────────── */
const DB = {
  load(key, seed) {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : (seed ? seed.map(i=>({...i})) : []); }
    catch(e) { return seed ? seed.map(i=>({...i})) : []; }
  },
  save(key, data) { try { localStorage.setItem(key, JSON.stringify(data)); } catch(e){} },
  getUsers()     { return this.load(ADMIN_KEYS.USERS, SEED_USERS); },
  saveUsers(d)   { this.save(ADMIN_KEYS.USERS, d); },
  getCourses()   { return this.load(ADMIN_KEYS.COURSES, SEED_COURSES); },
  saveCourses(d) { this.save(ADMIN_KEYS.COURSES, d); },
  getTests()     { return this.load(ADMIN_KEYS.TESTS, SEED_TESTS); },
  saveTests(d)   { this.save(ADMIN_KEYS.TESTS, d); },
  getResults()   { return this.load(ADMIN_KEYS.RESULTS, []); },
  getMaterials() { return this.load(ADMIN_KEYS.MATERIALS, SEED_MATERIALS); },
  saveMaterials(d){ this.save(ADMIN_KEYS.MATERIALS, d); },
  getSettings()  { const s = this.load(ADMIN_KEYS.SETTINGS, null); return s && s.siteName ? s : {...DEFAULT_SETTINGS}; },
  saveSettings(d){ this.save(ADMIN_KEYS.SETTINGS, d); }
};

/* ── Auth Guard ─────────────────────────────────────────────── */
// Uses the SAME session key as auth.js ('learnhubUser') to prevent redirect loops
const LH_SESSION_KEY = 'learnhubUser';

function guardAdmin() {
  // Read from both storages (same as auth.js Session.get)
  const raw = localStorage.getItem(LH_SESSION_KEY) || sessionStorage.getItem(LH_SESSION_KEY);
  if (!raw) { window.location.replace('login.html'); return null; }
  try {
    const s = JSON.parse(raw);
    if (!s || s.role !== 'admin') { window.location.replace('login.html'); return null; }
    return s;
  } catch(e) { window.location.replace('login.html'); return null; }
}

function adminLogout() {
  localStorage.removeItem(LH_SESSION_KEY);
  sessionStorage.removeItem(LH_SESSION_KEY);
  localStorage.removeItem('learnhubRemember');
  window.location.replace('login.html');
}

/* ── Toast Notification ─────────────────────────────────────── */
function showToast(msg, type='success') {
  const colors = { success:'#10b981', error:'#ef4444', warning:'#f59e0b', info:'#6366f1' };
  const icons  = { success:'check-circle', error:'times-circle', warning:'exclamation-triangle', info:'info-circle' };
  const t = document.createElement('div');
  t.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    background:#1e293b;color:white;border-radius:12px;
    padding:14px 20px;font-size:14px;font-weight:500;
    display:flex;align-items:center;gap:10px;
    box-shadow:0 10px 30px rgba(0,0,0,0.3);
    border-left:4px solid ${colors[type]};
    animation:slideUp 0.3s cubic-bezier(0.16,1,0.3,1);
    max-width:320px;font-family:'Inter',sans-serif;
  `;
  t.innerHTML = `<i class="fas fa-${icons[type]}" style="color:${colors[type]}"></i>${msg}`;
  if (!document.getElementById('toastStyle')) {
    const s = document.createElement('style');
    s.id = 'toastStyle';
    s.textContent = '@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}';
    document.head.appendChild(s);
  }
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity 0.3s'; setTimeout(()=>t.remove(),300); }, 3000);
}

/* ── Animated Counter ───────────────────────────────────────── */
function animateCount(el, target, prefix='', suffix='', duration=1200) {
  const start = 0;
  const startTime = performance.now();
  function step(now) {
    const p = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1-p, 3);
    const val = Math.round(start + (target - start) * ease);
    el.textContent = prefix + val.toLocaleString('en-IN') + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── Stats Calculator ───────────────────────────────────────── */
function calcStats() {
  const users    = DB.getUsers();
  const courses  = DB.getCourses();
  const tests    = DB.getTests();
  const results  = DB.getResults();
  const students = users.filter(u => u.role === 'student');
  const active   = students.filter(u => u.status !== 'blocked');
  const totalEnrollments = students.reduce((s,u) => s + (u.enrolledCourses||[]).length, 0);
  const revenue = students.reduce((s,u) => {
    return s + (u.enrolledCourses||[]).reduce((cs,cid) => {
      const c = courses.find(x=>x.id===cid);
      return cs + (c ? c.price : 0);
    }, 0);
  }, 0);
  const avgScore = results.length
    ? Math.round(results.reduce((s,r)=>s+r.percentage,0)/results.length)
    : 0;
  return {
    totalStudents: students.length,
    activeStudents: active.length,
    totalCourses: courses.length,
    totalTests: tests.length,
    totalEnrollments,
    revenue,
    testAttempts: results.length,
    avgScore
  };
}

/* ── Section Navigation ─────────────────────────────────────── */
let currentSection = 'overview';
function showSection(name) {
  currentSection = name;
  document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
  const el = document.getElementById('section-' + name);
  if (el) el.classList.remove('hidden');

  document.querySelectorAll('.sidebar-link').forEach(l => {
    l.classList.toggle('active', l.dataset.section === name);
  });

  // Update top bar title
  const titles = {
    overview:       'Admin Dashboard',
    students:       'Student Management',
    courses:        'Course Management',
    tests:          'Mock Test Management',
    materials:      'Study Material',
    analytics:      'Analytics & Reports',
    settings:       'Platform Settings',
    'test-creator': 'Mock Test Creator',
    'test-preview': 'Test Preview'
  };
  const greetEl = document.getElementById('adminGreeting');
  if (greetEl && name !== 'overview') greetEl.textContent = titles[name] || 'Admin Panel';
  else if (greetEl && name === 'overview') {
    const session = JSON.parse(localStorage.getItem(LH_SESSION_KEY) || sessionStorage.getItem(LH_SESSION_KEY) || '{}');
    const h = new Date().getHours();
    const g = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
    greetEl.textContent = `${g}, ${session.name || 'Admin'} 👋`;
  }

  // Load section data
  const loaders = {
    overview:  loadOverview,
    students:  loadStudents,
    courses:   loadCourses,
    tests:     loadTests,
    materials: loadMaterials,
    analytics: loadAnalytics,
    settings:  loadSettings,
    'test-creator': function(){},
    'test-preview': function(){}
  };
  if (loaders[name]) loaders[name]();
}

/* ═══════════════════════════════════════════════════════════════
   1. OVERVIEW / DASHBOARD
═══════════════════════════════════════════════════════════════ */
function loadOverview() {
  const st = calcStats();
  const map = {
    'stat-students':    [st.totalStudents, '', ''],
    'stat-courses':     [st.totalCourses, '', ''],
    'stat-tests':       [st.totalTests, '', ''],
    'stat-enrollments': [st.totalEnrollments, '', ''],
    'stat-revenue':     [st.revenue, '₹', ''],
    'stat-active':      [st.activeStudents, '', '']
  };
  Object.entries(map).forEach(([id, [val, pre, suf]]) => {
    const el = document.getElementById(id);
    if (el) animateCount(el, val, pre, suf);
  });

  // Subscription stats
  if (window.LH_DB && LH_DB.getSubscriptionStats) {
    const subStats = LH_DB.getSubscriptionStats();
    const elPaid = document.getElementById('stat-paid-users');
    const elFree = document.getElementById('stat-free-users');
    const elRev  = document.getElementById('stat-sub-revenue');
    const elConv = document.getElementById('stat-conversion');
    if (elPaid) animateCount(elPaid, subStats.paid, '', '');
    if (elFree) animateCount(elFree, subStats.free, '', '');
    if (elRev)  elRev.textContent = '₹' + (subStats.paid * 999).toLocaleString('en-IN');
    if (elConv && subStats.total > 0)
      elConv.textContent = Math.round((subStats.paid / subStats.total) * 100) + '%';
  }

  // Recent students
  const students = DB.getUsers().filter(u=>u.role==='student').slice(-5).reverse();
  const tbody = document.getElementById('recentStudentsBody');
  if (tbody) {
    tbody.innerHTML = students.map(s => `
      <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">${s.name[0]}</div>
            <div>
              <p class="font-medium text-gray-800 text-sm">${s.name}</p>
              <p class="text-xs text-gray-400">${s.email}</p>
            </div>
          </div>
        </td>
        <td class="py-3 px-4 text-sm text-gray-600">${(s.enrolledCourses||[]).length} courses</td>
        <td class="py-3 px-4 text-sm text-gray-600">${s.analytics?.testsAttempted||0}</td>
        <td class="py-3 px-4">
          <span class="px-2 py-1 rounded-full text-xs font-medium ${s.status==='blocked'?'bg-red-100 text-red-600':'bg-green-100 text-green-600'}">
            ${s.status==='blocked'?'Blocked':'Active'}
          </span>
        </td>
        <td class="py-3 px-4 text-xs text-gray-400">${s.createdAt||'—'}</td>
      </tr>
    `).join('');
  }

  // Recent enrollments
  renderActivityFeed();
}

function renderActivityFeed() {
  const feed = document.getElementById('activityFeed');
  if (!feed) return;
  const users = DB.getUsers().filter(u=>u.role==='student');
  const items = [];
  users.forEach(u => {
    (u.enrolledCourses||[]).forEach(cid => {
      const c = DB.getCourses().find(x=>x.id===cid);
      if(c) items.push({ type:'enroll', user:u.name, item:c.title, icon:'fa-book', color:'text-indigo-500', bg:'bg-indigo-50' });
    });
  });
  const testItems = DB.getResults().slice(-5);
  testItems.forEach(r => {
    const u = users.find(x=>x.id===r.userId);
    const t = DB.getTests().find(x=>x.id===r.testId);
    if(u&&t) items.push({ type:'test', user:u.name, item:`${t.title} — ${r.percentage}%`, icon:'fa-clipboard-check', color:'text-green-500', bg:'bg-green-50' });
  });
  feed.innerHTML = items.slice(0,8).map(a=>`
    <div class="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div class="w-8 h-8 rounded-full ${a.bg} flex items-center justify-center flex-shrink-0">
        <i class="fas ${a.icon} text-xs ${a.color}"></i>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-800">${a.user}</p>
        <p class="text-xs text-gray-500">${a.type==='enroll'?'Enrolled in':'Attempted'} <span class="text-indigo-600">${a.item}</span></p>
      </div>
    </div>
  `).join('') || '<p class="text-gray-400 text-sm text-center py-4">No recent activity</p>';
}

/* ═══════════════════════════════════════════════════════════════
   2. STUDENT MANAGEMENT
═══════════════════════════════════════════════════════════════ */
let studentSearch = '';
let studentFilter = 'all';

function loadStudents() {
  renderStudentTable();
}

function renderStudentTable() {
  const users = DB.getUsers().filter(u => u.role === 'student');
  const courses = DB.getCourses();
  let filtered = users;

  if (studentSearch) {
    const q = studentSearch.toLowerCase();
    filtered = filtered.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }
  if (studentFilter === 'active')   filtered = filtered.filter(u => u.status !== 'blocked');
  if (studentFilter === 'blocked')  filtered = filtered.filter(u => u.status === 'blocked');
  if (studentFilter === 'paid')     filtered = filtered.filter(u => u.subscription === 'paid');
  if (studentFilter === 'free')     filtered = filtered.filter(u => (u.subscription||'free') === 'free');

  const tbody = document.getElementById('studentsTableBody');
  if (!tbody) return;

  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center py-12 text-gray-400"><i class="fas fa-users text-3xl mb-2 block"></i>No students found</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(u => {
    const sub       = u.subscription || 'free';
    const isPaid    = sub === 'paid';
    const isBlocked = u.status === 'blocked';
    const enrolled  = (u.enrolledCourses||[]).length;
    const tests     = (u.purchasedTests||[]).length;
    const mats      = (u.purchasedMaterials||[]).length;

    return `
      <tr class="border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">${u.name[0]}</div>
            <div>
              <p class="font-semibold text-gray-800 text-sm">${u.name}</p>
              <p class="text-xs text-gray-400">#${u.id}</p>
            </div>
          </div>
        </td>
        <td class="py-3 px-4 text-sm text-gray-600">${u.email}</td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-1.5">
            <span class="px-2.5 py-1 rounded-full text-xs font-bold ${isPaid ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}">
              ${isPaid ? '⭐ Paid' : '🆓 Free'}
            </span>
            <button onclick="adminToggleSubscription(${u.id})"
              class="p-1 rounded-lg text-xs ${isPaid ? 'text-red-400 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'} transition"
              title="${isPaid ? 'Downgrade to Free' : 'Upgrade to Paid'}">
              <i class="fas ${isPaid ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
            </button>
          </div>
        </td>
        <td class="py-3 px-4 text-sm text-gray-700">
          <span title="Courses">${enrolled}📚</span>
          <span class="ml-2" title="Tests">${tests}📝</span>
          <span class="ml-2" title="Materials">${mats}📄</span>
        </td>
        <td class="py-3 px-4 text-sm text-gray-700 font-medium">${u.analytics?.testsAttempted||0}</td>
        <td class="py-3 px-4 text-sm text-gray-700">${u.analytics?.averageScore||0}%</td>
        <td class="py-3 px-4">
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${isBlocked?'bg-red-100 text-red-600':'bg-green-100 text-green-600'}">
            ${isBlocked?'Blocked':'Active'}
          </span>
        </td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-1">
            <button onclick="viewStudentDetail(${u.id})" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="View">
              <i class="fas fa-eye text-xs"></i>
            </button>
            <button onclick="toggleStudentBlock(${u.id})" class="p-1.5 ${isBlocked?'text-green-500 hover:bg-green-50':'text-orange-500 hover:bg-orange-50'} rounded-lg transition" title="${isBlocked?'Unblock':'Block'}">
              <i class="fas ${isBlocked?'fa-unlock':'fa-ban'} text-xs"></i>
            </button>
            <button onclick="deleteStudent(${u.id})" class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
              <i class="fas fa-trash-alt text-xs"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/* Admin: manually toggle subscription tier */
function adminToggleSubscription(userId) {
  const users = DB.getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx < 0) return;
  const current = users[idx].subscription || 'free';
  const next    = current === 'paid' ? 'free' : 'paid';
  users[idx].subscription = next;
  DB.saveUsers(users);
  showToast(`${users[idx].name} → ${next === 'paid' ? '⭐ Paid' : '🆓 Free'}`, next === 'paid' ? 'success' : 'info');
  renderStudentTable();
  _adminUpdateSubStats();
}

/* Update subscription stats in overview */
function _adminUpdateSubStats() {
  if (!window.LH_DB) return;
  const stats = LH_DB.getSubscriptionStats();
  const el = document.getElementById('stat-paid-users');
  if (el) el.textContent = stats.paid;
  const el2 = document.getElementById('stat-free-users');
  if (el2) el2.textContent = stats.free;
}


function toggleStudentBlock(id) {
  const users = DB.getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx < 0) return;
  const isBlocked = users[idx].status === 'blocked';
  users[idx].status = isBlocked ? 'active' : 'blocked';
  DB.saveUsers(users);
  showToast(isBlocked ? `Student unblocked` : `Student blocked`, isBlocked ? 'success' : 'warning');
  renderStudentTable();
}

function deleteStudent(id) {
  if (!confirm('Delete this student permanently? This cannot be undone.')) return;
  const users = DB.getUsers().filter(u => u.id !== id);
  DB.saveUsers(users);
  showToast('Student deleted', 'success');
  renderStudentTable();
}

function viewStudentDetail(id) {
  const u = DB.getUsers().find(x=>x.id===id);
  if (!u) return;
  const courses = DB.getCourses();
  const results = DB.getResults().filter(r=>r.userId===id);
  const enrolled = (u.enrolledCourses||[]).map(cid=>{
    const c = courses.find(x=>x.id===cid);
    return c ? `<li class="text-sm text-gray-700 py-1 border-b border-gray-50 last:border-0">📚 ${c.title} — ₹${c.price.toLocaleString()}</li>` : '';
  }).join('');
  const tests = results.map(r=>{
    const t = DB.getTests().find(x=>x.id===r.testId);
    return t ? `<li class="text-sm text-gray-700 py-1 border-b border-gray-50 last:border-0">🎯 ${t.title} — ${r.percentage}%</li>` : '';
  }).join('');

  openModal(`
    <div class="flex items-center gap-4 mb-6">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">${u.name[0]}</div>
      <div>
        <h3 class="text-xl font-bold text-gray-800">${u.name}</h3>
        <p class="text-gray-500 text-sm">${u.email}</p>
        <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 inline-block ${u.status==='blocked'?'bg-red-100 text-red-600':'bg-green-100 text-green-600'}">${u.status||'active'}</span>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-3 mb-5">
      <div class="bg-indigo-50 rounded-xl p-3 text-center">
        <p class="text-2xl font-bold text-indigo-600">${(u.enrolledCourses||[]).length}</p>
        <p class="text-xs text-gray-500">Courses</p>
      </div>
      <div class="bg-green-50 rounded-xl p-3 text-center">
        <p class="text-2xl font-bold text-green-600">${u.analytics?.testsAttempted||0}</p>
        <p class="text-xs text-gray-500">Tests</p>
      </div>
      <div class="bg-orange-50 rounded-xl p-3 text-center">
        <p class="text-2xl font-bold text-orange-600">${u.analytics?.averageScore||0}%</p>
        <p class="text-xs text-gray-500">Avg Score</p>
      </div>
    </div>
    ${enrolled ? `<div class="mb-4"><p class="font-semibold text-gray-800 mb-2 text-sm">Enrolled Courses</p><ul class="max-h-32 overflow-y-auto">${enrolled}</ul></div>` : ''}
    ${tests ? `<div><p class="font-semibold text-gray-800 mb-2 text-sm">Test Attempts</p><ul class="max-h-32 overflow-y-auto">${tests}</ul></div>` : '<p class="text-sm text-gray-400">No tests attempted yet.</p>'}
  `, 'Student Details');
}

/* ═══════════════════════════════════════════════════════════════
   3. COURSE MANAGEMENT
═══════════════════════════════════════════════════════════════ */
function loadCourses() {
  renderCourseTable();
}

function renderCourseTable() {
  const courses = DB.getCourses();
  const q = (document.getElementById('courseSearch')||{}).value||'';
  const filtered = q ? courses.filter(c=>c.title.toLowerCase().includes(q.toLowerCase())||c.category.toLowerCase().includes(q.toLowerCase())) : courses;

  const grid = document.getElementById('coursesGrid');
  if (!grid) return;

  if (!filtered.length) {
    grid.innerHTML = '<div class="col-span-3 text-center py-12 text-gray-400"><i class="fas fa-book text-3xl mb-2 block"></i>No courses found</div>';
    return;
  }
  grid.innerHTML = filtered.map(c => `
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div class="relative h-36 bg-gray-100 overflow-hidden">
        <img src="${c.image||'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop'}" alt="" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <span class="absolute top-2 left-2 px-2 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-lg">${c.category}</span>
        ${c.badge?`<span class="absolute top-2 right-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-lg">${c.badge}</span>`:''}
      </div>
      <div class="p-4">
        <h4 class="font-semibold text-gray-800 text-sm mb-1 leading-snug line-clamp-2">${c.title}</h4>
        <p class="text-xs text-gray-500 mb-3">👨‍🏫 ${c.instructor} • ${c.hours}h</p>
        <div class="flex items-center justify-between mb-3">
          <div>
            <span class="font-bold text-indigo-600">₹${c.price.toLocaleString()}</span>
            <span class="text-xs text-gray-400 line-through ml-1">₹${c.originalPrice.toLocaleString()}</span>
          </div>
          <span class="text-xs text-gray-500">⭐ ${c.rating} • ${(c.students||0).toLocaleString()} students</span>
        </div>
        <div class="flex gap-2">
          <button onclick="openCourseForm(${c.id})" class="flex-1 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition">
            <i class="fas fa-edit mr-1"></i>Edit
          </button>
          <button onclick="deleteCourse(${c.id})" class="flex-1 py-1.5 text-xs font-medium bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition">
            <i class="fas fa-trash-alt mr-1"></i>Delete
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function openCourseForm(id) {
  const courses = DB.getCourses();
  const c = id ? courses.find(x=>x.id===id) : null;
  openModal(`
    <h3 class="text-lg font-bold text-gray-800 mb-5">${c?'Edit Course':'Add New Course'}</h3>
    <div class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div class="col-span-2">
          <label class="block text-xs font-semibold text-gray-600 mb-1">Course Title *</label>
          <input id="cf_title" class="admin-input" value="${c?c.title:''}" placeholder="Enter course title">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Category *</label>
          <select id="cf_cat" class="admin-input">
            ${['SSC','Banking','UPSC','Railway','General'].map(cat=>`<option ${c&&c.category===cat?'selected':''}>${cat}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Instructor *</label>
          <input id="cf_inst" class="admin-input" value="${c?c.instructor:''}" placeholder="Instructor name">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Price (₹) *</label>
          <input id="cf_price" type="number" class="admin-input" value="${c?c.price:''}" placeholder="e.g. 2499">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Original Price (₹)</label>
          <input id="cf_oprice" type="number" class="admin-input" value="${c?c.originalPrice:''}" placeholder="e.g. 3499">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Duration (hours)</label>
          <input id="cf_hours" type="number" class="admin-input" value="${c?c.hours:''}" placeholder="e.g. 120">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Badge</label>
          <input id="cf_badge" class="admin-input" value="${c?c.badge||'':''}" placeholder="e.g. BESTSELLER">
        </div>
        <div class="col-span-2">
          <label class="block text-xs font-semibold text-gray-600 mb-1">Thumbnail Image</label>

          <!-- Upload dropzone (hidden when image set) -->
          <div id="cf_upload_zone" style="${c&&c.image?'display:none':''}">
            <label for="cf_img_file" id="cf_img_dropzone" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;width:100%;padding:20px 12px;border:2px dashed #c7d2fe;border-radius:12px;background:#f5f7ff;cursor:pointer;transition:border-color 0.2s,background 0.2s;" onmouseenter="this.style.borderColor='#6366f1';this.style.background='#eef2ff'" onmouseleave="this.style.borderColor='#c7d2fe';this.style.background='#f5f7ff'">
              <div style="width:40px;height:40px;border-radius:10px;background:#e0e7ff;display:flex;align-items:center;justify-content:center;"><i class='fas fa-cloud-upload-alt' style='color:#6366f1;font-size:18px;'></i></div>
              <span style="font-size:13px;font-weight:600;color:#4f46e5;">Click to upload image</span>
              <span style="font-size:11px;color:#94a3b8;">JPG, PNG or WEBP &nbsp;·&nbsp; Max 5MB</span>
            </label>
          </div>

          <!-- Preview (shown after crop) -->
          <div id="cf_img_preview_wrap" style="${c&&c.image?'':'display:none'}">
            <div style="position:relative;width:100%;padding-top:56.25%;border-radius:12px;overflow:hidden;background:#0f172a;border:1.5px solid #e2e8f0;">
              <img id="cf_img_preview" src="${c&&c.image?c.image:''}" alt="Thumbnail" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;">
            </div>
            <!-- Action bar below preview -->
            <div style="display:flex;gap:8px;margin-top:8px;">
              <label for="cf_img_file" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:8px;border:1.5px solid #c7d2fe;border-radius:10px;background:#f5f7ff;cursor:pointer;font-size:12px;font-weight:600;color:#4f46e5;transition:background 0.15s;" onmouseenter="this.style.background='#eef2ff'" onmouseleave="this.style.background='#f5f7ff'">
                <i class="fas fa-sync-alt"></i> Change Image
              </label>
              <button type="button" onclick="cfRemoveImage()" style="display:flex;align-items:center;justify-content:center;gap:5px;padding:8px 14px;border:1.5px solid #fecaca;border-radius:10px;background:#fff5f5;cursor:pointer;font-size:12px;font-weight:600;color:#ef4444;transition:background 0.15s;" onmouseenter="this.style.background='#fee2e2'" onmouseleave="this.style.background='#fff5f5'">
                <i class="fas fa-trash-alt"></i> Remove
              </button>
            </div>
          </div>

          <input type="file" id="cf_img_file" accept="image/jpeg,image/png,image/webp" style="display:none;" onchange="handleCourseImgUpload(this)">
          <input type="hidden" id="cf_img_data" value="${c&&c.image?c.image:''}">
          <p id="cf_img_err" style="color:#ef4444;font-size:11px;margin-top:5px;"></p>
        </div>
        <div class="col-span-2">
          <label class="block text-xs font-semibold text-gray-600 mb-1">Description</label>
          <textarea id="cf_desc" class="admin-input h-20 resize-none" placeholder="Course description">${c?c.description||'':''}</textarea>
        </div>
      </div>
    </div>
    <div class="flex gap-3 mt-5">
      <button onclick="saveCourse(${c?c.id:'null'})" class="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition text-sm">
        <i class="fas fa-save mr-1"></i>${c?'Update Course':'Add Course'}
      </button>
      <button onclick="closeModal()" class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition text-sm">Cancel</button>
    </div>
  `);
}

function handleCourseImgUpload(input) {
  const err = document.getElementById('cf_img_err');
  err.textContent = '';
  const file = input.files[0];
  if (!file) return;

  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) {
    err.textContent = '❌ Only JPG, PNG or WEBP files are allowed.';
    input.value = '';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    err.textContent = '❌ Image must be under 5MB.';
    input.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    input.value = ''; // reset so same file can be re-selected
    // Open cropper; on confirm update preview + data
    lhCropper.open(e.target.result, function(croppedDataUrl) {
      document.getElementById('cf_img_data').value = croppedDataUrl;
      document.getElementById('cf_img_preview').src = croppedDataUrl;
      document.getElementById('cf_upload_zone').style.display = 'none';
      document.getElementById('cf_img_preview_wrap').style.display = 'block';
    });
  };
  reader.onerror = function() {
    err.textContent = '❌ Failed to read file. Please try again.';
  };
  reader.readAsDataURL(file);
}
window.handleCourseImgUpload = handleCourseImgUpload;

function cfRemoveImage() {
  document.getElementById('cf_img_data').value = '';
  document.getElementById('cf_img_preview').src = '';
  document.getElementById('cf_img_preview_wrap').style.display = 'none';
  document.getElementById('cf_upload_zone').style.display = 'block';
  document.getElementById('cf_img_err').textContent = '';
  const f = document.getElementById('cf_img_file');
  if (f) f.value = '';
}
window.cfRemoveImage = cfRemoveImage;

function saveCourse(id) {
  const title = document.getElementById('cf_title').value.trim();
  const instructor = document.getElementById('cf_inst').value.trim();
  const price = parseInt(document.getElementById('cf_price').value) || 0;
  if (!title || !instructor || !price) { showToast('Please fill required fields', 'error'); return; }

  const courses = DB.getCourses();
  const data = {
    title,
    category: document.getElementById('cf_cat').value,
    instructor,
    price,
    originalPrice: parseInt(document.getElementById('cf_oprice').value) || price,
    hours: parseInt(document.getElementById('cf_hours').value) || 0,
    badge: document.getElementById('cf_badge').value.trim(),
    image: document.getElementById('cf_img_data').value.trim() || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop',
    description: document.getElementById('cf_desc').value.trim(),
    rating: 4.5, students: 0
  };

  if (id && id !== 'null') {
    const idx = courses.findIndex(c=>c.id===id);
    if (idx>=0) courses[idx] = { ...courses[idx], ...data };
    showToast('Course updated!', 'success');
  } else {
    data.id = Date.now();
    courses.push(data);
    showToast('Course added!', 'success');
  }
  DB.saveCourses(courses);
  closeModal();
  renderCourseTable();
}

function deleteCourse(id) {
  if (!confirm('Delete this course?')) return;
  DB.saveCourses(DB.getCourses().filter(c=>c.id!==id));
  showToast('Course deleted', 'success');
  renderCourseTable();
}

/* ═══════════════════════════════════════════════════════════════
   4. MOCK TEST MANAGEMENT
═══════════════════════════════════════════════════════════════ */
function loadTests() {
  renderTestTable();
}

function renderTestTable() {
  const tests = DB.getTests();
  const tbody = document.getElementById('testsTableBody');
  if (!tbody) return;

  if (!tests.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-12 text-gray-400">No tests found</td></tr>';
    return;
  }

  const diffColors = { Easy:'bg-green-100 text-green-700', Medium:'bg-yellow-100 text-yellow-700', Hard:'bg-red-100 text-red-700' };
  tbody.innerHTML = tests.map(t => `
    <tr class="border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
      <td class="py-3 px-4">
        <p class="font-medium text-gray-800 text-sm">${t.title}</p>
        <p class="text-xs text-gray-400">Created: ${t.createdAt||'—'}</p>
      </td>
      <td class="py-3 px-4"><span class="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-lg font-medium">${t.category}</span></td>
      <td class="py-3 px-4 text-sm text-gray-700">
        ${t.questions}
        ${t.questionData && t.questionData.length ? `<span class="ml-1 text-xs text-green-600">(${t.questionData.length} built)</span>` : ''}
      </td>
      <td class="py-3 px-4 text-sm text-gray-700">${t.duration} min</td>
      <td class="py-3 px-4 text-sm text-gray-700">${t.maxScore}</td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 rounded-full text-xs font-semibold ${diffColors[t.difficulty]||'bg-gray-100 text-gray-600'}">${t.difficulty}</span>
      </td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 rounded-full text-xs ${t.freeAccess?'bg-green-100 text-green-700':'bg-purple-100 text-purple-700'}">${t.freeAccess?'Free':'Paid'}</span>
      </td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 rounded-full text-xs ${t.published?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}">${t.published?'Published':'Draft'}</span>
      </td>
      <td class="py-3 px-4">
        <div class="flex gap-1">
          <button onclick="openTestForm(${t.id})" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Edit / Build Questions"><i class="fas fa-edit text-xs"></i></button>
          <button onclick="deleteTest(${t.id})" class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete"><i class="fas fa-trash-alt text-xs"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* ═══════════════════════════════════════════════════════════════
   MOCK TEST CREATOR — Integrated Admin Panel Creator
   Opens inside admin layout (not modal, not separate page)
═══════════════════════════════════════════════════════════════ */

let _tcrEditId   = null;   // null = new test, number = editing existing
let _tcrQuestions = [];    // array of question objects

/* ── Open Creator (replaces old openTestForm) ─────────────── */
function openTestForm(id) {
  _tcrEditId    = id || null;
  _tcrQuestions = [];

  // Pre-fill if editing
  const tests = DB.getTests();
  const t = id ? tests.find(x => x.id === id) : null;

  if (t) {
    _tcrQuestions = (t.questionData || []).map((q, i) => ({ ...q, _uid: Date.now() + i }));
  }

  // Navigate to creator section (keeps sidebar/navbar intact)
  showSection('test-creator');

  // Update heading
  const heading = document.getElementById('tcr-heading');
  const subheading = document.getElementById('tcr-subheading');
  if (heading) heading.textContent = t ? 'Edit Mock Test' : 'Create Mock Test';
  if (subheading) subheading.textContent = t ? `Editing: ${t.title}` : 'Build your test step by step — inside the admin panel';

  // Reset form fields
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  const setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
  setVal('tcr_title', t ? t.title : '');
  setVal('tcr_desc',  t ? (t.description || '') : '');
  setVal('tcr_dur',   t ? t.duration : 60);
  setVal('tcr_marks', t ? (t.marksPerQ || 2) : 2);
  setVal('tcr_neg',   t ? (t.negativeMarks !== undefined ? t.negativeMarks : 0.5) : 0.5);
  setVal('tcr_pass',  t ? (t.passPercent || 33) : 33);
  setChk('tcr_free',       t ? !!t.freeAccess : false);
  setChk('tcr_shuffle',    t ? !!t.shuffleQ : false);
  setChk('tcr_showResult', t ? (t.showResult !== false) : true);

  // Category & difficulty
  const catEl  = document.getElementById('tcr_cat');
  const diffEl = document.getElementById('tcr_diff');
  if (catEl  && t) catEl.value  = t.category   || 'SSC';
  if (diffEl && t) diffEl.value = t.difficulty  || 'Medium';

  // Status badge
  const badge = document.getElementById('tcr-status-badge');
  if (badge) {
    badge.className = 'badge ' + (t && t.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700');
    badge.innerHTML = '<i class="fas fa-circle text-xs mr-1"></i>' + (t && t.published ? 'Published' : 'Draft');
  }

  tcrRenderQuestions();
  tcrUpdateStats();
}

/* ── Close Creator → back to tests list ─────────────────────── */
function closeTestCreator() {
  showSection('tests');
}

/* ── Add a new blank question ────────────────────────────────── */
function addQuestion() {
  const type = (document.getElementById('tcr_qtype') || {}).value || 'mcq';
  const uid  = Date.now();
  const q = {
    _uid:    uid,
    type:    type,
    text:    '',
    options: type === 'truefalse'
      ? ['True', 'False']
      : ['', '', '', ''],
    correct: 0,        // index of correct option
    marks:   parseFloat((document.getElementById('tcr_marks') || {}).value) || 2,
    explanation: ''
  };
  _tcrQuestions.push(q);
  tcrRenderQuestions();
  tcrUpdateStats();

  // Scroll to new question
  setTimeout(() => {
    const lastCard = document.querySelector('#tcr-questions-list .tcr-q-card:last-child');
    if (lastCard) lastCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 80);
}

/* ── Render all question cards ───────────────────────────────── */
function tcrRenderQuestions() {
  const list  = document.getElementById('tcr-questions-list');
  const empty = document.getElementById('tcr-empty-state');
  if (!list) return;

  if (!_tcrQuestions.length) {
    if (empty) empty.style.display = '';
    // Remove any existing cards
    list.querySelectorAll('.tcr-q-card').forEach(c => c.remove());
    tcrUpdateQCountBadge();
    return;
  }
  if (empty) empty.style.display = 'none';
  tcrUpdateQCountBadge();

  // Remove old cards and re-render
  list.querySelectorAll('.tcr-q-card').forEach(c => c.remove());

  _tcrQuestions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'admin-card p-5 tcr-q-card';
    card.dataset.uid = q._uid;

    const isTrue = q.type === 'truefalse';
    const opts   = isTrue ? ['True', 'False'] : (q.options || ['', '', '', '']);

    const optionsHTML = opts.map((opt, oi) => {
      const isCorrect = q.correct === oi;
      return `
        <div class="flex items-center gap-2 mb-2">
          <button type="button"
            onclick="tcrSetCorrect(${q._uid}, ${oi})"
            class="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
              ${isCorrect
                ? 'border-green-500 bg-green-500'
                : 'border-gray-300 hover:border-indigo-400'}"
            title="Mark as correct">
            ${isCorrect ? '<i class="fas fa-check text-white" style="font-size:9px"></i>' : ''}
          </button>
          <span class="text-xs font-bold text-gray-400 flex-shrink-0 w-5">${String.fromCharCode(65+oi)}.</span>
          ${isTrue
            ? `<span class="flex-1 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-700 font-medium">${opt}</span>`
            : `<input type="text" class="flex-1 admin-input text-sm"
                placeholder="Option ${String.fromCharCode(65+oi)}"
                value="${tcrEsc(opt)}"
                oninput="tcrUpdateOption(${q._uid}, ${oi}, this.value)">`
          }
          ${isCorrect ? '<span class="text-xs font-semibold text-green-600 flex-shrink-0"><i class="fas fa-check-circle mr-1"></i>Correct</span>' : ''}
        </div>
      `;
    }).join('');

    card.innerHTML = `
      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="flex items-center gap-2 flex-shrink-0">
          <div class="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">${idx + 1}</div>
          <span class="text-xs font-medium px-2 py-0.5 rounded-full ${isTrue ? 'bg-sky-100 text-sky-700' : 'bg-indigo-100 text-indigo-700'}">${isTrue ? 'True/False' : 'MCQ'}</span>
        </div>
        <div class="flex items-center gap-1 ml-auto">
          ${idx > 0 ? `<button onclick="tcrMoveQ(${q._uid},-1)" class="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition" title="Move up"><i class="fas fa-chevron-up text-xs"></i></button>` : ''}
          ${idx < _tcrQuestions.length - 1 ? `<button onclick="tcrMoveQ(${q._uid},1)" class="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition" title="Move down"><i class="fas fa-chevron-down text-xs"></i></button>` : ''}
          <button onclick="tcrDuplicateQ(${q._uid})" class="p-1.5 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition" title="Duplicate"><i class="fas fa-copy text-xs"></i></button>
          <button onclick="tcrDeleteQ(${q._uid})" class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete"><i class="fas fa-trash-alt text-xs"></i></button>
        </div>
      </div>

      <!-- Question Text -->
      <textarea class="admin-input text-sm mb-3" rows="2" style="resize:none;font-family:inherit"
        placeholder="Type your question here… (e.g. Which of the following is NOT a fundamental right?)"
        oninput="tcrUpdateQText(${q._uid}, this.value)">${tcrEsc(q.text)}</textarea>

      <!-- Options -->
      <div class="mb-3">
        <p class="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
          <i class="fas fa-list-ul text-gray-400"></i>
          Options — <span class="text-green-600 font-semibold">click ○ to mark correct answer</span>
        </p>
        ${optionsHTML}
      </div>

      <!-- Explanation + Marks row -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100">
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-gray-500 mb-1">Explanation (optional)</label>
          <input type="text" class="admin-input text-xs"
            placeholder="Brief explanation for the correct answer…"
            value="${tcrEsc(q.explanation || '')}"
            oninput="tcrUpdateExplanation(${q._uid}, this.value)">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1">Marks for this Q</label>
          <input type="number" class="admin-input text-xs" min="0.5" step="0.5" value="${q.marks || 2}"
            oninput="tcrUpdateQMarks(${q._uid}, this.value)">
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

/* ── Inline mutation helpers (called from card HTML) ─────────── */
function tcrUpdateQText(uid, val) {
  const q = _tcrQuestions.find(x => x._uid === uid);
  if (q) q.text = val;
}
function tcrUpdateOption(uid, oi, val) {
  const q = _tcrQuestions.find(x => x._uid === uid);
  if (q) q.options[oi] = val;
}
function tcrSetCorrect(uid, oi) {
  const q = _tcrQuestions.find(x => x._uid === uid);
  if (!q) return;
  q.correct = oi;
  tcrRenderQuestions();    // re-render to update radio indicators
}
function tcrUpdateExplanation(uid, val) {
  const q = _tcrQuestions.find(x => x._uid === uid);
  if (q) q.explanation = val;
}
function tcrUpdateQMarks(uid, val) {
  const q = _tcrQuestions.find(x => x._uid === uid);
  if (q) { q.marks = parseFloat(val) || 2; tcrUpdateStats(); }
}
function tcrDeleteQ(uid) {
  _tcrQuestions = _tcrQuestions.filter(q => q._uid !== uid);
  tcrRenderQuestions();
  tcrUpdateStats();
}
function tcrDuplicateQ(uid) {
  const idx = _tcrQuestions.findIndex(q => q._uid === uid);
  if (idx < 0) return;
  const copy = { ..._tcrQuestions[idx], _uid: Date.now(), options: [..._tcrQuestions[idx].options] };
  _tcrQuestions.splice(idx + 1, 0, copy);
  tcrRenderQuestions();
  tcrUpdateStats();
}
function tcrMoveQ(uid, dir) {
  const idx = _tcrQuestions.findIndex(q => q._uid === uid);
  const ni  = idx + dir;
  if (ni < 0 || ni >= _tcrQuestions.length) return;
  [_tcrQuestions[idx], _tcrQuestions[ni]] = [_tcrQuestions[ni], _tcrQuestions[idx]];
  tcrRenderQuestions();
}

/* ═══════════════════════════════════════════════════════════════
   CSV IMPORT SYSTEM
═══════════════════════════════════════════════════════════════ */

/* ── Trigger file picker ─────────────────────────────────────── */
function tcrTriggerCSV() {
  const inp = document.getElementById('tcr-csv-input');
  if (inp) { inp.value = ''; inp.click(); }
}

/* ── Show format reference box ───────────────────────────────── */
function tcrShowFormatBox() {
  const box = document.getElementById('tcr-csv-format-box');
  if (box) box.classList.remove('hidden');
  // Also scroll to builder
  const toolbar = document.getElementById('tcr-builder-toolbar');
  if (toolbar) toolbar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ── Drag / Drop handlers ────────────────────────────────────── */
function tcrDragOver(e) {
  e.preventDefault();
  const dz = document.getElementById('tcr-csv-dropzone');
  if (dz) dz.classList.add('tcr-dropzone-active');
}
function tcrDragLeave(e) {
  const dz = document.getElementById('tcr-csv-dropzone');
  if (dz) dz.classList.remove('tcr-dropzone-active');
}
function tcrDrop(e) {
  e.preventDefault();
  const dz = document.getElementById('tcr-csv-dropzone');
  if (dz) dz.classList.remove('tcr-dropzone-active');
  const file = e.dataTransfer?.files?.[0];
  if (!file) return;
  _tcrProcessCSVFile(file);
}

/* ── File input change handler ───────────────────────────────── */
function tcrHandleCSVFile(input) {
  const file = input?.files?.[0];
  if (!file) return;
  _tcrProcessCSVFile(file);
}

/* ── Core CSV processor ──────────────────────────────────────── */
function _tcrProcessCSVFile(file) {
  // Validate extension
  if (!file.name.toLowerCase().endsWith('.csv')) {
    tcrShowCSVErrors([`Invalid file type "${file.name}". Only .csv files are supported.`]);
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    _tcrParseAndImport(text, file.name);
  };
  reader.onerror = function() {
    tcrShowCSVErrors(['Failed to read the file. Please try again.']);
  };
  reader.readAsText(file, 'UTF-8');
}

/* ── CSV Parser (handles quotes, commas, newlines) ───────────── */
function _tcrParseCSV(text) {
  const rows = [];
  const lines = text.split(/\r?\n/);
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li].trim();
    if (!line) continue;
    const row = [];
    let inQuote = false, cell = '';
    for (let ci = 0; ci < line.length; ci++) {
      const ch = line[ci];
      if (ch === '"') {
        if (inQuote && line[ci+1] === '"') { cell += '"'; ci++; }
        else { inQuote = !inQuote; }
      } else if (ch === ',' && !inQuote) {
        row.push(cell.trim()); cell = '';
      } else {
        cell += ch;
      }
    }
    row.push(cell.trim());
    rows.push(row);
  }
  return rows;
}

/* ── Validate headers ────────────────────────────────────────── */
const CSV_REQUIRED_HEADERS = ['question', 'optiona', 'optionb', 'optionc', 'optiond', 'correctanswer'];
function _tcrValidateHeaders(headers) {
  const norm = headers.map(h => h.toLowerCase().replace(/\s/g, ''));
  const missing = CSV_REQUIRED_HEADERS.filter(req => !norm.includes(req));
  return missing;
}

/* ── Parse + import ──────────────────────────────────────────── */
function _tcrParseAndImport(csvText, fileName) {
  // Hide previous messages
  _tcrHideCSVMessages();

  const rows = _tcrParseCSV(csvText);
  if (rows.length < 2) {
    tcrShowCSVErrors(['The CSV file is empty or has no data rows. Add questions and try again.']);
    return;
  }

  const headers = rows[0].map(h => h.toLowerCase().replace(/\s+/g, ''));
  const missingCols = _tcrValidateHeaders(rows[0]);
  if (missingCols.length) {
    tcrShowCSVErrors([
      `Missing required columns: ${missingCols.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}`,
      'Expected header row: Question, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, Marks, Explanation'
    ]);
    return;
  }

  // Column index map
  const COL = {};
  headers.forEach((h, i) => COL[h] = i);

  const imported = [];
  const errors   = [];
  const warnings = [];

  const dataRows = rows.slice(1).filter(r => r.some(c => c.trim() !== ''));

  dataRows.forEach((row, ri) => {
    const rowNum = ri + 2; // 1-indexed, +1 for header
    const get = (key) => (row[COL[key]] || '').trim();

    const qText   = get('question');
    const optA    = get('optiona');
    const optB    = get('optionb');
    const optC    = get('optionc');
    const optD    = get('optiond');
    const correct = get('correctanswer').toUpperCase();
    const marksRaw = get('marks');
    const explan  = get('explanation') || '';

    // Validate question text
    if (!qText) {
      errors.push(`Row ${rowNum}: Question text is empty`);
      return;
    }

    // Validate options
    if (!optA || !optB) {
      errors.push(`Row ${rowNum}: At least OptionA and OptionB are required`);
      return;
    }

    // Validate correct answer
    const correctMap = { A: 0, B: 1, C: 2, D: 3 };
    if (!Object.keys(correctMap).includes(correct)) {
      errors.push(`Row ${rowNum}: CorrectAnswer "${get('correctanswer')}" is invalid. Must be A, B, C, or D`);
      return;
    }
    const correctIdx = correctMap[correct];

    // Validate the correct option exists
    const opts = [optA, optB, optC, optD];
    if (!opts[correctIdx] || !opts[correctIdx].trim()) {
      errors.push(`Row ${rowNum}: CorrectAnswer is "${correct}" but Option${correct} is empty`);
      return;
    }

    // Marks
    let marks = parseFloat(marksRaw);
    if (isNaN(marks) || marks <= 0) {
      if (marksRaw !== '') warnings.push(`Row ${rowNum}: Invalid marks "${marksRaw}" — defaulting to 1`);
      marks = 1;
    }

    // C/D optional — use empty string if missing
    imported.push({
      _uid:        Date.now() + ri + Math.random(),
      type:        'mcq',
      text:        qText,
      options:     [optA, optB, optC || '', optD || ''],
      correct:     correctIdx,
      marks:       marks,
      explanation: explan
    });
  });

  if (errors.length) {
    tcrShowCSVErrors(errors, warnings);
    return;
  }

  if (!imported.length) {
    tcrShowCSVErrors(['No valid questions found in the CSV. Please check the format and try again.']);
    return;
  }

  // Confirm if questions already exist
  if (_tcrQuestions.length > 0) {
    const choice = confirm(
      `You already have ${_tcrQuestions.length} question(s).\n\n` +
      `• Click OK to REPLACE all with the ${imported.length} imported questions\n` +
      `• Click Cancel to APPEND ${imported.length} questions to existing ones`
    );
    if (choice) {
      _tcrQuestions = imported;
    } else {
      _tcrQuestions = [..._tcrQuestions, ...imported];
    }
  } else {
    _tcrQuestions = imported;
  }

  tcrRenderQuestions();
  tcrUpdateStats();
  tcrUpdateQCountBadge();

  // Show success message
  const successEl = document.getElementById('tcr-csv-success');
  const msgEl     = document.getElementById('tcr-csv-success-msg');
  const subEl     = document.getElementById('tcr-csv-success-sub');
  const totalM    = _tcrQuestions.reduce((s,q) => s + (q.marks||1), 0);
  if (successEl) successEl.classList.remove('hidden');
  if (msgEl) msgEl.textContent = `✅ ${imported.length} questions imported from ${fileName}`;
  if (subEl) {
    const warnStr = warnings.length ? ` · ${warnings.length} warning(s)` : '';
    subEl.textContent = `Total marks: ${totalM} · Duration: ${document.getElementById('tcr_dur')?.value || 60} min${warnStr}`;
  }

  if (warnings.length) {
    setTimeout(() => tcrShowCSVErrors([], warnings), 100);
  }

  showToast(`${imported.length} questions imported successfully!`, 'success');

  // Scroll to questions list
  setTimeout(() => {
    const list = document.getElementById('tcr-questions-list');
    if (list) list.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 200);
}

/* ── Show error panel ────────────────────────────────────────── */
function tcrShowCSVErrors(errors, warnings) {
  const panel = document.getElementById('tcr-csv-errors');
  const list  = document.getElementById('tcr-csv-error-list');
  if (!panel || !list) return;

  let html = '';
  if (errors && errors.length) {
    errors.forEach(e => {
      html += `<div class="flex items-start gap-1.5 py-1">
        <i class="fas fa-times-circle text-red-400 mt-0.5 flex-shrink-0"></i>
        <span>${e}</span>
      </div>`;
    });
  }
  if (warnings && warnings.length) {
    html += `<div class="mt-2 pt-2 border-t border-red-100">`;
    warnings.forEach(w => {
      html += `<div class="flex items-start gap-1.5 py-1 text-amber-700">
        <i class="fas fa-exclamation-triangle text-amber-400 mt-0.5 flex-shrink-0"></i>
        <span>${w}</span>
      </div>`;
    });
    html += `</div>`;
  }

  list.innerHTML = html;
  panel.classList.remove('hidden');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ── Hide all CSV message panels ─────────────────────────────── */
function _tcrHideCSVMessages() {
  ['tcr-csv-errors', 'tcr-csv-success'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
}

/* ── Update question count badge ─────────────────────────────── */
function tcrUpdateQCountBadge() {
  const badge = document.getElementById('tcr-q-count-badge');
  if (!badge) return;
  const n = _tcrQuestions.length;
  badge.textContent = `${n} question${n !== 1 ? 's' : ''}`;
  badge.classList.toggle('hidden', n === 0);
}

/* ── Download sample CSV ─────────────────────────────────────── */
function tcrDownloadSampleCSV() {
  const rows = [
    'Question,OptionA,OptionB,OptionC,OptionD,CorrectAnswer,Marks,Explanation',
    'What is 2+2?,1,2,3,4,D,1,Because 2+2 equals 4',
    'Capital of India?,Mumbai,New Delhi,Kolkata,Chennai,B,2,New Delhi is the capital of India',
    'Which planet is closest to the Sun?,Venus,Earth,Mercury,Mars,C,1,Mercury is the closest planet to the Sun',
    'Who wrote Romeo and Juliet?,Charles Dickens,William Shakespeare,Jane Austen,Mark Twain,B,2,Shakespeare wrote this famous play',
    'What is the chemical symbol for Gold?,Ag,Au,Fe,Cu,B,1,Au comes from the Latin word Aurum',
    'Which is the largest ocean?,Atlantic,Indian,Arctic,Pacific,D,1,Pacific Ocean is the largest',
    'HCF of 36 and 48?,6,9,12,18,C,2,Highest Common Factor of 36 and 48 is 12'
  ];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'learnhub_sample_questions.csv';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('Sample CSV downloaded!', 'success');
}



/* ── Update live stats panel ─────────────────────────────────── */
function tcrUpdateStats() {
  const qCount    = _tcrQuestions.length;
  const totalMark = _tcrQuestions.reduce((s, q) => s + (parseFloat(q.marks) || 2), 0);
  const dur       = parseInt((document.getElementById('tcr_dur') || {}).value) || 60;
  const pass      = parseInt((document.getElementById('tcr_pass') || {}).value) || 33;
  const passMarks = Math.ceil(totalMark * pass / 100);

  const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setTxt('tcr-stat-q',     qCount);
  setTxt('tcr-stat-marks', totalMark % 1 === 0 ? totalMark : totalMark.toFixed(1));
  setTxt('tcr-stat-dur',   dur);
  setTxt('tcr-stat-pass',  passMarks);
}

/* ── Escape helper ───────────────────────────────────────────── */
function tcrEsc(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── Read current form data into object ──────────────────────── */
function tcrReadForm() {
  const getVal = id => { const e = document.getElementById(id); return e ? e.value.trim() : ''; };
  const getChk = id => { const e = document.getElementById(id); return e ? e.checked : false; };
  return {
    title:        getVal('tcr_title'),
    description:  getVal('tcr_desc'),
    category:     getVal('tcr_cat'),
    difficulty:   getVal('tcr_diff'),
    duration:     parseInt(getVal('tcr_dur'))   || 60,
    marksPerQ:    parseFloat(getVal('tcr_marks')) || 2,
    negativeMarks: parseFloat(getVal('tcr_neg')) || 0,
    passPercent:  parseInt(getVal('tcr_pass'))   || 33,
    freeAccess:   getChk('tcr_free'),
    shuffleQ:     getChk('tcr_shuffle'),
    showResult:   getChk('tcr_showResult'),
  };
}

/* ── Validate before save ────────────────────────────────────── */
function tcrValidate(data, requireQ) {
  if (!data.title) { showToast('Please enter a test title', 'error'); return false; }
  if (requireQ && !_tcrQuestions.length) { showToast('Add at least one question before publishing', 'error'); return false; }
  for (let i = 0; i < _tcrQuestions.length; i++) {
    const q = _tcrQuestions[i];
    if (!q.text || !q.text.trim()) { showToast(`Question ${i+1} has no text`, 'error'); return false; }
    if (q.type === 'mcq') {
      const filled = q.options.filter(o => o && o.trim()).length;
      if (filled < 2) { showToast(`Question ${i+1} needs at least 2 options`, 'error'); return false; }
    }
  }
  return true;
}

/* ── Save Draft ──────────────────────────────────────────────── */
function saveDraftTest() {
  const data = tcrReadForm();
  if (!tcrValidate(data, false)) return;
  _tcrPersist(data, false);
  showToast('Draft saved successfully!', 'success');
}

/* ── Publish Test ────────────────────────────────────────────── */
function publishTest() {
  const data = tcrReadForm();
  if (!tcrValidate(data, true)) return;
  _tcrPersist(data, true);
  showToast(`"${data.title}" published! Students can see it now.`, 'success');

  // Update badge
  const badge = document.getElementById('tcr-status-badge');
  if (badge) {
    badge.className = 'badge bg-green-100 text-green-700';
    badge.innerHTML = '<i class="fas fa-circle text-xs mr-1"></i>Published';
  }

  // Go back to tests list after short delay
  setTimeout(() => { showSection('tests'); }, 1200);
}

/* ── Internal persist ────────────────────────────────────────── */
function _tcrPersist(data, published) {
  const tests = DB.getTests();
  const totalMarks = _tcrQuestions.reduce((s, q) => s + (parseFloat(q.marks) || 2), 0);

  // Strip _uid before saving
  const cleanQs = _tcrQuestions.map(q => {
    const { _uid, ...rest } = q;
    return rest;
  });

  const record = {
    ...data,
    published,
    questions:    _tcrQuestions.length,
    maxScore:     totalMarks,
    questionData: cleanQs,
    updatedAt:    new Date().toISOString().split('T')[0]
  };

  if (_tcrEditId) {
    const idx = tests.findIndex(t => t.id === _tcrEditId);
    if (idx >= 0) {
      tests[idx] = { ...tests[idx], ...record };
    }
  } else {
    record.id        = Date.now();
    record.createdAt = new Date().toISOString().split('T')[0];
    tests.push(record);
    _tcrEditId = record.id;   // so subsequent saves update the same record
  }
  DB.saveTests(tests);

  // Refresh stats bar
  const stat = document.getElementById('stat-tests');
  if (stat) stat.textContent = tests.length;
}

/* ── Preview Test (inside admin, not new tab) ────────────────── */
function previewTest() {
  const data   = tcrReadForm();
  const totalM = _tcrQuestions.reduce((s, q) => s + (parseFloat(q.marks) || 1), 0);
  const passM  = Math.ceil(totalM * (data.passPercent || 33) / 100);

  const diffColors = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };
  const diffBg     = { Easy: '#f0fdf4', Medium: '#fffbeb', Hard: '#fef2f2' };

  // ── Question Palette ─────────────────────────────────────────
  const paletteHtml = _tcrQuestions.length ? `
    <div class="mb-6 admin-card p-5">
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-bold text-gray-800 text-sm flex items-center gap-2">
          <i class="fas fa-th text-indigo-500"></i> Question Palette
          <span class="text-xs text-gray-400 font-normal">(click any number to jump)</span>
        </h4>
        <div class="flex items-center gap-3 text-xs">
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-indigo-600 inline-block"></span>Active</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-green-100 border border-green-400 inline-block"></span>Answered</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-gray-100 border border-gray-300 inline-block"></span>Not Visited</span>
        </div>
      </div>
      <div class="tcr-palette" id="tcr-preview-palette">
        ${_tcrQuestions.map((q, i) => `
          <button class="tcr-palette-btn ${i === 0 ? 'active' : 'unanswered'}"
            id="tcr-pal-${i}"
            onclick="tcrPreviewJump(${i})"
            title="${tcrEsc(q.text.substring(0, 60))}${q.text.length > 60 ? '…' : ''}">
            ${i + 1}
          </button>
        `).join('')}
      </div>
    </div>
  ` : '';

  // ── Questions ────────────────────────────────────────────────
  let qHtml = '';
  if (!_tcrQuestions.length) {
    qHtml = `<div class="text-center py-12 text-gray-400">
      <i class="fas fa-clipboard-list text-4xl mb-3 block opacity-50"></i>
      <p class="font-medium">No questions added yet</p>
      <p class="text-sm mt-1">Add questions manually or upload a CSV</p>
    </div>`;
  } else {
    qHtml = _tcrQuestions.map((q, i) => {
      const opts = q.type === 'truefalse' ? ['True', 'False'] : (q.options || []);
      const optHtml = opts.filter(o => o && o.trim()).map((o, oi) => {
        const isCorrect = q.correct === oi;
        return `<label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition
          ${isCorrect ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}">
          <div class="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
            ${isCorrect ? 'border-green-500 bg-green-500' : 'border-gray-300'}">
            ${isCorrect ? '<i class="fas fa-check text-white" style="font-size:8px"></i>' : ''}
          </div>
          <span class="text-sm ${isCorrect ? 'font-semibold text-green-700' : 'text-gray-700'}">${String.fromCharCode(65+oi)}. ${tcrEsc(o)}</span>
          ${isCorrect ? '<span class="ml-auto text-xs text-green-600 font-semibold whitespace-nowrap">✓ Correct</span>' : ''}
        </label>`;
      }).join('');

      return `<div class="border border-gray-200 rounded-xl p-5 mb-4 scroll-mt-4" id="tcr-prev-q-${i}">
        <div class="flex items-start gap-3 mb-3">
          <div class="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">${i+1}</div>
          <p class="text-sm font-medium text-gray-800 leading-relaxed flex-1">${tcrEsc(q.text) || '<em class="text-gray-400">No question text</em>'}</p>
          <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full flex-shrink-0 whitespace-nowrap">${q.marks} mark${q.marks != 1 ? 's' : ''}</span>
        </div>
        <div class="space-y-2 pl-10 mb-2">${optHtml}</div>
        ${q.explanation ? `<div class="mt-3 pl-10 text-xs text-blue-700 bg-blue-50 rounded-lg p-2.5 flex items-start gap-1.5">
          <i class="fas fa-lightbulb mt-0.5 flex-shrink-0"></i>
          <span><strong>Explanation:</strong> ${tcrEsc(q.explanation)}</span></div>` : ''}
      </div>`;
    }).join('');
  }

  const previewContent = document.getElementById('tcr-preview-content');
  if (previewContent) {
    previewContent.innerHTML = `
      <!-- Test Header Card -->
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5 pb-5 border-b border-gray-100">
        <div class="flex-1">
          <h3 class="text-xl font-bold text-gray-800 mb-1">${tcrEsc(data.title) || 'Untitled Test'}</h3>
          <p class="text-sm text-gray-500 mb-3">${tcrEsc(data.description) || 'No description provided'}</p>
          <div class="flex flex-wrap gap-2">
            <span class="badge bg-indigo-100 text-indigo-700"><i class="fas fa-tag mr-1"></i>${data.category}</span>
            <span class="badge" style="background:${diffBg[data.difficulty] || '#f1f5f9'};color:${diffColors[data.difficulty] || '#64748b'}">${data.difficulty}</span>
            <span class="badge ${data.freeAccess ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}">${data.freeAccess ? '🆓 Free' : '💎 Paid'}</span>
            ${data.shuffleQ ? '<span class="badge bg-amber-100 text-amber-700"><i class="fas fa-random mr-1"></i>Shuffle ON</span>' : ''}
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 flex-shrink-0">
          <div class="bg-indigo-50 rounded-xl px-3 py-2.5 text-center">
            <p class="text-xl font-bold text-indigo-600">${_tcrQuestions.length}</p>
            <p class="text-xs text-gray-500 mt-0.5">Questions</p>
          </div>
          <div class="bg-purple-50 rounded-xl px-3 py-2.5 text-center">
            <p class="text-xl font-bold text-purple-600">${totalM % 1 === 0 ? totalM : totalM.toFixed(1)}</p>
            <p class="text-xs text-gray-500 mt-0.5">Total Marks</p>
          </div>
          <div class="bg-sky-50 rounded-xl px-3 py-2.5 text-center">
            <p class="text-xl font-bold text-sky-600">${data.duration}</p>
            <p class="text-xs text-gray-500 mt-0.5">Minutes</p>
          </div>
          <div class="bg-red-50 rounded-xl px-3 py-2.5 text-center">
            <p class="text-xl font-bold text-red-500">−${data.negativeMarks || 0}</p>
            <p class="text-xs text-gray-500 mt-0.5">Neg. Marks</p>
          </div>
          <div class="bg-green-50 rounded-xl px-3 py-2.5 text-center">
            <p class="text-xl font-bold text-green-600">${passM}</p>
            <p class="text-xs text-gray-500 mt-0.5">Pass Marks</p>
          </div>
        </div>
      </div>

      <!-- Admin Notice -->
      <div class="mb-5 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-700">
        <i class="fas fa-user-shield mt-0.5 flex-shrink-0 text-amber-500"></i>
        <span><strong>Admin Preview Mode:</strong> Correct answers highlighted in green. Students see options without highlights — answers revealed only after submission.</span>
      </div>

      <!-- Question Palette -->
      ${paletteHtml}

      <!-- Questions List -->
      <div id="tcr-prev-questions">${qHtml}</div>
    `;
  }

  showSection('test-preview');
}

/* ── Jump to question in preview (second copy removed) */

/* ── Close Preview → back to creator ────────────────────────── */
function closeTestPreview() {
  showSection('test-creator');
  // Restore state
  const heading = document.getElementById('tcr-heading');
  if (heading) heading.textContent = _tcrEditId ? 'Edit Mock Test' : 'Create Mock Test';
  tcrRenderQuestions();
  tcrUpdateStats();
}

/* ── Legacy saveTest (kept for backward compat) ──────────────── */
function saveTest(id) {
  // Re-route to new creator save
  const data = tcrReadForm();
  if (!tcrValidate(data, false)) return;
  _tcrPersist(data, true);
  showToast('Test saved!', 'success');
  showSection('tests');
}

function deleteTest(id) {
  if (!confirm('Delete this mock test?')) return;
  DB.saveTests(DB.getTests().filter(t => t.id !== id));
  showToast('Test deleted', 'success');
  renderTestTable();
}


/* ═══════════════════════════════════════════════════════════════
   5. STUDY MATERIAL MANAGEMENT
═══════════════════════════════════════════════════════════════ */
function loadMaterials() {
  renderMaterialsGrid();
}

function renderMaterialsGrid() {
  const mats = DB.getMaterials();
  const q = (document.getElementById('materialSearch')||{}).value||'';
  const filtered = q ? mats.filter(m=>m.title.toLowerCase().includes(q.toLowerCase())||m.category.toLowerCase().includes(q.toLowerCase())) : mats;

  const grid = document.getElementById('materialsGrid');
  if (!grid) return;

  const typeIcons = { PDF:'fa-file-pdf text-red-500', Notes:'fa-sticky-note text-yellow-500', Video:'fa-video text-blue-500' };

  if (!filtered.length) {
    grid.innerHTML = '<div class="col-span-3 text-center py-12 text-gray-400">No materials found</div>';
    return;
  }

  grid.innerHTML = filtered.map(m => `
    <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between mb-3">
        <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
          <i class="fas ${typeIcons[m.type]||'fa-file text-gray-400'} text-lg"></i>
        </div>
        <div class="flex gap-1">
          <span class="px-2 py-0.5 rounded-lg text-xs font-medium ${m.free?'bg-green-100 text-green-700':'bg-purple-100 text-purple-700'}">${m.free?'Free':'Paid'}</span>
        </div>
      </div>
      <h4 class="font-semibold text-gray-800 text-sm mb-1 leading-snug">${m.title}</h4>
      <div class="flex items-center gap-2 text-xs text-gray-400 mb-3">
        <span class="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded">${m.category}</span>
        <span>${m.type}</span>
        <span>${m.size}</span>
      </div>
      <p class="text-xs text-gray-500 mb-3">⬇ ${(m.downloads||0).toLocaleString()} downloads</p>
      <div class="flex gap-2">
        <button onclick="openMaterialForm(${m.id})" class="flex-1 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition">
          <i class="fas fa-edit mr-1"></i>Edit
        </button>
        <button onclick="deleteMaterial(${m.id})" class="flex-1 py-1.5 text-xs font-medium bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition">
          <i class="fas fa-trash-alt mr-1"></i>Delete
        </button>
      </div>
    </div>
  `).join('');
}

function openMaterialForm(id) {
  const mats = DB.getMaterials();
  const m = id ? mats.find(x=>x.id===id) : null;
  openModal(`
    <h3 class="text-lg font-bold text-gray-800 mb-5">${m?'Edit Material':'Add Study Material'}</h3>
    <div class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
        <input id="mf_title" class="admin-input" value="${m?m.title:''}" placeholder="Material title">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Category</label>
          <select id="mf_cat" class="admin-input">
            ${['SSC','Banking','UPSC','Railway','General'].map(c=>`<option ${m&&m.category===c?'selected':''}>${c}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Type</label>
          <select id="mf_type" class="admin-input">
            ${['PDF','Notes','Video'].map(t=>`<option ${m&&m.type===t?'selected':''}>${t}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">File Size</label>
          <input id="mf_size" class="admin-input" value="${m?m.size||'':''}" placeholder="e.g. 5 MB">
        </div>
        <div class="flex items-center gap-3 pt-4">
          <input type="checkbox" id="mf_free" class="w-4 h-4 text-indigo-600" ${m&&m.free?'checked':''}>
          <label for="mf_free" class="text-sm font-medium text-gray-700">Free Access</label>
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">File/Link URL</label>
        <input id="mf_url" class="admin-input" value="${m?m.url||'':''}" placeholder="https://...">
      </div>
    </div>
    <div class="flex gap-3 mt-5">
      <button onclick="saveMaterial(${m?m.id:'null'})" class="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition text-sm">
        <i class="fas fa-save mr-1"></i>${m?'Update':'Add Material'}
      </button>
      <button onclick="closeModal()" class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition text-sm">Cancel</button>
    </div>
  `);
}

function saveMaterial(id) {
  const title = document.getElementById('mf_title').value.trim();
  if (!title) { showToast('Please enter a title', 'error'); return; }

  const mats = DB.getMaterials();
  const data = {
    title,
    category: document.getElementById('mf_cat').value,
    type: document.getElementById('mf_type').value,
    size: document.getElementById('mf_size').value || '—',
    url: document.getElementById('mf_url').value || '#',
    free: document.getElementById('mf_free').checked,
    downloads: 0,
    createdAt: new Date().toISOString().split('T')[0]
  };

  if (id && id !== 'null') {
    const idx = mats.findIndex(m=>m.id===id);
    if (idx>=0) mats[idx] = { ...mats[idx], ...data };
    showToast('Material updated!', 'success');
  } else {
    data.id = Date.now();
    mats.push(data);
    showToast('Material added!', 'success');
  }
  DB.saveMaterials(mats);
  closeModal();
  renderMaterialsGrid();
}

function deleteMaterial(id) {
  if (!confirm('Delete this material?')) return;
  DB.saveMaterials(DB.getMaterials().filter(m=>m.id!==id));
  showToast('Material deleted', 'success');
  renderMaterialsGrid();
}

/* ═══════════════════════════════════════════════════════════════
   6. ANALYTICS
═══════════════════════════════════════════════════════════════ */
function loadAnalytics() {
  const st = calcStats();
  const users = DB.getUsers().filter(u=>u.role==='student');
  const courses = DB.getCourses();
  const tests = DB.getTests();

  // Category breakdown
  const catMap = {};
  courses.forEach(c => { catMap[c.category] = (catMap[c.category]||0) + 1; });
  const catColors = { SSC:'#6366f1', Banking:'#0ea5e9', UPSC:'#10b981', Railway:'#f59e0b', General:'#ec4899' };

  const catBar = document.getElementById('categoryBreakdown');
  if (catBar) {
    const total = courses.length;
    catBar.innerHTML = Object.entries(catMap).map(([cat, count]) => `
      <div class="mb-3">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-medium text-gray-700">${cat}</span>
          <span class="text-sm font-bold text-gray-800">${count} courses (${Math.round(count/total*100)}%)</span>
        </div>
        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-1000" style="width:${count/total*100}%;background:${catColors[cat]||'#6366f1'}"></div>
        </div>
      </div>
    `).join('');
  }

  // Student score distribution
  const scoreRanges = { '90-100':0, '75-89':0, '60-74':0, '40-59':0, 'Below 40':0 };
  users.forEach(u => {
    const s = u.analytics?.averageScore||0;
    if(s>=90) scoreRanges['90-100']++;
    else if(s>=75) scoreRanges['75-89']++;
    else if(s>=60) scoreRanges['60-74']++;
    else if(s>=40) scoreRanges['40-59']++;
    else scoreRanges['Below 40']++;
  });

  const scoreDist = document.getElementById('scoreDist');
  if (scoreDist) {
    const maxVal = Math.max(...Object.values(scoreRanges), 1);
    const scoreColors = { '90-100':'#10b981', '75-89':'#6366f1', '60-74':'#f59e0b', '40-59':'#f97316', 'Below 40':'#ef4444' };
    scoreDist.innerHTML = Object.entries(scoreRanges).map(([range, count]) => `
      <div class="mb-3">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-medium text-gray-700">${range}%</span>
          <span class="text-sm font-bold" style="color:${scoreColors[range]}">${count} students</span>
        </div>
        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-1000" style="width:${count/maxVal*100}%;background:${scoreColors[range]}"></div>
        </div>
      </div>
    `).join('');
  }

  // Top performing students
  const topStudents = [...users].sort((a,b)=>(b.analytics?.averageScore||0)-(a.analytics?.averageScore||0)).slice(0,5);
  const topList = document.getElementById('topStudents');
  if (topList) {
    topList.innerHTML = topStudents.map((u,i) => `
      <div class="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
        <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i===0?'bg-yellow-100 text-yellow-700':i===1?'bg-gray-100 text-gray-600':i===2?'bg-orange-100 text-orange-600':'bg-gray-50 text-gray-500'}">${i+1}</span>
        <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">${u.name[0]}</div>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-800">${u.name}</p>
          <p class="text-xs text-gray-400">${u.analytics?.testsAttempted||0} tests</p>
        </div>
        <div class="text-right">
          <p class="text-sm font-bold text-indigo-600">${u.analytics?.averageScore||0}%</p>
          <p class="text-xs text-gray-400">avg score</p>
        </div>
      </div>
    `).join('');
  }

  // Summary stats
  const analyticsStats = {
    'ana-totalStudents': st.totalStudents,
    'ana-avgScore':       st.avgScore,
    'ana-enrollments':    st.totalEnrollments,
    'ana-testAttempts':   st.testAttempts
  };
  Object.entries(analyticsStats).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if(el) animateCount(el, val);
  });
}

/* ═══════════════════════════════════════════════════════════════
   7. SETTINGS
═══════════════════════════════════════════════════════════════ */
function loadSettings() {
  const s = DB.getSettings();
  const fields = ['siteName','logoUrl','themeColor','footerText','adminEmail'];
  fields.forEach(f => {
    const el = document.getElementById('set_'+f);
    if (el) el.value = s[f]||'';
  });
}

function saveSettings() {
  const s = DB.getSettings();
  const fields = ['siteName','logoUrl','themeColor','footerText','adminEmail'];
  fields.forEach(f => {
    const el = document.getElementById('set_'+f);
    if (el) s[f] = el.value;
  });
  DB.saveSettings(s);
  showToast('Settings saved!', 'success');

  // Apply theme color live
  const color = s.themeColor;
  if (color) document.documentElement.style.setProperty('--admin-primary', color);
}

function resetSettings() {
  if (!confirm('Reset all settings to default?')) return;
  DB.saveSettings({...DEFAULT_SETTINGS});
  loadSettings();
  showToast('Settings reset to default', 'info');
}

/* ── Modal ──────────────────────────────────────────────────── */
function openModal(content, title) {
  const overlay = document.getElementById('adminModal');
  const body = document.getElementById('adminModalBody');
  if (!overlay || !body) return;
  body.innerHTML = content;
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  setTimeout(() => overlay.querySelector('.modal-box')?.classList.add('modal-in'), 10);
}

function closeModal() {
  const overlay = document.getElementById('adminModal');
  if (!overlay) return;
  overlay.classList.add('hidden');
  overlay.classList.remove('flex');
}

/* ── Init ───────────────────────────────────────────────────── */
window.adminInit = function() {
  const session = guardAdmin();
  if (!session) return;

  // Set admin name
  const nameEl = document.getElementById('adminName');
  if (nameEl) nameEl.textContent = session.name;
  const initEl = document.getElementById('adminInitial');
  if (initEl) initEl.textContent = session.name[0];

  // Greeting
  const greetEl = document.getElementById('adminGreeting');
  if (greetEl) {
    const h = new Date().getHours();
    const g = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
    greetEl.textContent = `${g}, ${session.name} 👋`;
  }

  // Seed DB if empty
  if (!localStorage.getItem(ADMIN_KEYS.USERS)) DB.saveUsers(DB.getUsers());
  if (!localStorage.getItem(ADMIN_KEYS.COURSES)) DB.saveCourses(DB.getCourses());
  if (!localStorage.getItem(ADMIN_KEYS.TESTS)) DB.saveTests(DB.getTests());
  if (!localStorage.getItem(ADMIN_KEYS.MATERIALS)) DB.saveMaterials(DB.getMaterials());

  // Sidebar links
  document.querySelectorAll('.sidebar-link[data-section]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      showSection(el.dataset.section);
      // Mobile: close sidebar
      document.getElementById('sidebar')?.classList.remove('open');
      document.getElementById('sidebarOverlay')?.classList.add('hidden');
    });
  });

  // Mobile menu
  const menuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarOverlay?.classList.toggle('hidden');
    });
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      sidebar?.classList.remove('open');
      sidebarOverlay.classList.add('hidden');
    });
  }

  // Close modal on backdrop click
  const modal = document.getElementById('adminModal');
  if (modal) modal.addEventListener('click', e => { if(e.target===modal) closeModal(); });

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', adminLogout);

  // Load default section
  showSection('overview');
};

// Expose globals
window.showSection = showSection;
window.adminLogout = adminLogout;
window.toggleStudentBlock = toggleStudentBlock;
window.deleteStudent = deleteStudent;
window.viewStudentDetail = viewStudentDetail;
window.openCourseForm = openCourseForm;
window.saveCourse = saveCourse;
window.deleteCourse = deleteCourse;
window.openTestForm = openTestForm;
window.saveTest = saveTest;
window.deleteTest = deleteTest;
window.closeTestCreator = closeTestCreator;
window.addQuestion = addQuestion;
window.tcrSetCorrect = tcrSetCorrect;
window.tcrUpdateQText = tcrUpdateQText;
window.tcrUpdateOption = tcrUpdateOption;
window.tcrUpdateExplanation = tcrUpdateExplanation;
window.tcrUpdateQMarks = tcrUpdateQMarks;
window.tcrDeleteQ = tcrDeleteQ;
window.tcrDuplicateQ = tcrDuplicateQ;
window.tcrMoveQ = tcrMoveQ;
window.tcrUpdateStats = tcrUpdateStats;
window.saveDraftTest = saveDraftTest;
window.publishTest = publishTest;
window.previewTest = previewTest;
window.closeTestPreview = closeTestPreview;
window.tcrTriggerCSV = tcrTriggerCSV;
window.tcrHandleCSVFile = tcrHandleCSVFile;
window.tcrDragOver = tcrDragOver;
window.tcrDragLeave = tcrDragLeave;
window.tcrDrop = tcrDrop;
window.tcrShowFormatBox = tcrShowFormatBox;
window.tcrDownloadSampleCSV = tcrDownloadSampleCSV;
window.tcrPreviewJump = tcrPreviewJump;
window.openMaterialForm = openMaterialForm;
window.saveMaterial = saveMaterial;
window.deleteMaterial = deleteMaterial;
window.saveSettings = saveSettings;
window.resetSettings = resetSettings;
window.closeModal = closeModal;
window.DB = DB;

// Student search
window.adminToggleSubscription = adminToggleSubscription;
window.handleStudentSearch = function(val) { studentSearch=val; renderStudentTable(); };
window.handleStudentFilter = function(val) { studentFilter=val; renderStudentTable(); };