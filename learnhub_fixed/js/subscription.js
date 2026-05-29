/* ================================================================
   LearnHub — Subscription & Payment System · subscription.js
   Handles: Free/Paid user tiers, per-item purchase gating,
            payment simulation modal, access control, admin tools.
   Storage: localStorage only. No backend required.
   ================================================================ */

'use strict';

window.LH_SUB = (function () {

  /* ── Config ─────────────────────────────────────────────────── */
  const CURRENCY = '₹';
  const GATEWAY_DELAY_MS = 1800;  // simulate payment processing

  /* ── Payment Modal HTML (injected once into <body>) ─────────── */
  const MODAL_ID = 'lh-payment-modal';

  function _injectModal() {
    if (document.getElementById(MODAL_ID)) return;
    const div = document.createElement('div');
    div.innerHTML = `
      <!-- ========================================================
           LEARNHUB PAYMENT MODAL
      ========================================================= -->
      <div id="${MODAL_ID}" style="display:none;position:fixed;inset:0;z-index:99998;
        background:rgba(15,23,42,.7);backdrop-filter:blur(6px);
        display:none;align-items:center;justify-content:center;padding:16px;">

        <!-- ─── Payment Card ─── -->
        <div id="lh-pay-card" style="background:#fff;border-radius:20px;width:100%;max-width:440px;
          box-shadow:0 25px 60px rgba(0,0,0,.25);overflow:hidden;animation:lhPayIn .22s ease;">

          <!-- Header -->
          <div style="background:linear-gradient(135deg,#6366f1,#7c3aed);padding:22px 24px 18px;position:relative;">
            <button onclick="LH_SUB.closePayment()" style="position:absolute;top:14px;right:14px;
              background:rgba(255,255,255,.2);border:none;border-radius:50%;width:30px;height:30px;
              cursor:pointer;color:#fff;font-size:14px;display:flex;align-items:center;justify-content:center;"
              aria-label="Close">&times;</button>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <div style="width:38px;height:38px;background:rgba(255,255,255,.2);border-radius:10px;
                display:flex;align-items:center;justify-content:center;">
                <i class="fas fa-lock-open" style="color:#fff;font-size:15px;"></i>
              </div>
              <div>
                <p style="color:rgba(255,255,255,.8);font-size:11px;font-weight:600;letter-spacing:.05em;">LEARNHUB SECURE CHECKOUT</p>
                <p id="lh-pay-item-name" style="color:#fff;font-weight:700;font-size:15px;line-height:1.2;max-width:280px;"></p>
              </div>
            </div>
            <div style="display:flex;align-items:baseline;gap:6px;">
              <span id="lh-pay-amount" style="color:#fff;font-size:28px;font-weight:800;"></span>
              <span id="lh-pay-original" style="color:rgba(255,255,255,.5);font-size:14px;text-decoration:line-through;"></span>
              <span id="lh-pay-savings" style="background:rgba(255,255,255,.2);color:#fff;font-size:11px;font-weight:700;
                padding:2px 8px;border-radius:100px;margin-left:4px;"></span>
            </div>
          </div>

          <!-- Body: simulated card form -->
          <div id="lh-pay-form-area" style="padding:22px 24px;">
            <p style="font-size:12px;font-weight:700;color:#64748b;letter-spacing:.05em;margin-bottom:12px;">PAYMENT DETAILS (DEMO)</p>

            <!-- UPI / Card tabs -->
            <div style="display:flex;gap:8px;margin-bottom:16px;">
              <button id="lh-tab-upi" onclick="LH_SUB._setTab('upi')"
                style="flex:1;padding:8px;border-radius:10px;border:2px solid #6366f1;background:#f0f4ff;
                color:#6366f1;font-size:12px;font-weight:700;cursor:pointer;">
                <i class="fas fa-mobile-alt mr-1"></i> UPI
              </button>
              <button id="lh-tab-card" onclick="LH_SUB._setTab('card')"
                style="flex:1;padding:8px;border-radius:10px;border:2px solid #e2e8f0;background:#fff;
                color:#94a3b8;font-size:12px;font-weight:700;cursor:pointer;">
                <i class="fas fa-credit-card mr-1"></i> Card
              </button>
              <button id="lh-tab-nb" onclick="LH_SUB._setTab('nb')"
                style="flex:1;padding:8px;border-radius:10px;border:2px solid #e2e8f0;background:#fff;
                color:#94a3b8;font-size:12px;font-weight:700;cursor:pointer;">
                <i class="fas fa-university mr-1"></i> Net Banking
              </button>
            </div>

            <!-- UPI input -->
            <div id="lh-pay-upi" style="margin-bottom:14px;">
              <label style="font-size:12px;font-weight:600;color:#64748b;display:block;margin-bottom:6px;">UPI ID</label>
              <input id="lh-upi-id" type="text" placeholder="yourname@upi" value="demo@okicici"
                style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;
                box-sizing:border-box;outline:none;font-family:inherit;"
                onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='#e2e8f0'">
            </div>

            <!-- Card inputs (hidden by default) -->
            <div id="lh-pay-card-fields" style="display:none;margin-bottom:14px;">
              <div style="margin-bottom:10px;">
                <label style="font-size:12px;font-weight:600;color:#64748b;display:block;margin-bottom:6px;">Card Number</label>
                <input type="text" placeholder="4242 4242 4242 4242" maxlength="19"
                  style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;
                  box-sizing:border-box;outline:none;font-family:inherit;"
                  onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='#e2e8f0'">
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div>
                  <label style="font-size:12px;font-weight:600;color:#64748b;display:block;margin-bottom:6px;">Expiry (MM/YY)</label>
                  <input type="text" placeholder="12/26" maxlength="5"
                    style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;
                    box-sizing:border-box;outline:none;font-family:inherit;"
                    onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='#e2e8f0'">
                </div>
                <div>
                  <label style="font-size:12px;font-weight:600;color:#64748b;display:block;margin-bottom:6px;">CVV</label>
                  <input type="password" placeholder="•••" maxlength="3"
                    style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;
                    box-sizing:border-box;outline:none;font-family:inherit;"
                    onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='#e2e8f0'">
                </div>
              </div>
            </div>

            <!-- Net banking (hidden by default) -->
            <div id="lh-pay-nb-fields" style="display:none;margin-bottom:14px;">
              <label style="font-size:12px;font-weight:600;color:#64748b;display:block;margin-bottom:6px;">Select Bank</label>
              <select style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;
                box-sizing:border-box;outline:none;font-family:inherit;background:#fff;">
                <option>State Bank of India</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Axis Bank</option>
                <option>Kotak Mahindra Bank</option>
              </select>
            </div>

            <!-- Security note -->
            <div style="background:#f0fdf4;border-radius:10px;padding:10px 12px;margin-bottom:16px;
              display:flex;align-items:center;gap:8px;">
              <i class="fas fa-shield-alt" style="color:#10b981;font-size:14px;flex-shrink:0;"></i>
              <p style="font-size:11px;color:#047857;line-height:1.4;">
                <strong>100% Secure · Demo Mode</strong> — No real payment will be charged. This is a simulation.
              </p>
            </div>

            <!-- Pay button -->
            <button id="lh-pay-btn" onclick="LH_SUB._processPayment()"
              style="width:100%;padding:14px;background:linear-gradient(135deg,#6366f1,#7c3aed);color:#fff;
              border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;
              display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity .2s;">
              <i class="fas fa-lock" style="font-size:13px;"></i>
              <span id="lh-pay-btn-text">Pay Securely</span>
            </button>

            <!-- Cancel -->
            <button onclick="LH_SUB.closePayment()"
              style="width:100%;padding:10px;background:none;border:none;color:#94a3b8;
              font-size:13px;cursor:pointer;margin-top:8px;">Cancel</button>
          </div>

          <!-- Processing overlay -->
          <div id="lh-pay-processing" style="display:none;padding:40px 24px;text-align:center;">
            <div style="width:60px;height:60px;border:4px solid #e2e8f0;border-top-color:#6366f1;
              border-radius:50%;animation:lhSpin 0.9s linear infinite;margin:0 auto 16px;"></div>
            <p style="font-weight:700;color:#1e293b;font-size:16px;">Processing Payment…</p>
            <p style="color:#94a3b8;font-size:13px;margin-top:4px;">Please do not close this window</p>
          </div>

          <!-- Success state -->
          <div id="lh-pay-success" style="display:none;padding:40px 24px;text-align:center;">
            <div style="width:70px;height:70px;background:linear-gradient(135deg,#10b981,#059669);
              border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
              <i class="fas fa-check" style="color:#fff;font-size:28px;"></i>
            </div>
            <h3 style="font-size:20px;font-weight:800;color:#1e293b;margin-bottom:6px;">Payment Successful!</h3>
            <p id="lh-pay-success-msg" style="color:#64748b;font-size:14px;margin-bottom:8px;"></p>
            <p id="lh-pay-order-id" style="font-size:11px;color:#94a3b8;font-family:monospace;margin-bottom:20px;"></p>
            <button onclick="LH_SUB._afterSuccess()"
              style="background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;
              border-radius:12px;padding:12px 32px;font-size:14px;font-weight:700;cursor:pointer;">
              <i class="fas fa-arrow-right mr-2"></i>Access Content
            </button>
          </div>
        </div>
      </div>

      <style>
        @keyframes lhPayIn {
          from { transform: scale(.93) translateY(20px); opacity: 0; }
          to   { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes lhSpin {
          to { transform: rotate(360deg); }
        }
        #lh-payment-modal { display: none; }
        #lh-payment-modal.lh-pay-open { display: flex !important; }

        /* Subscription badge in nav / dashboard */
        .lh-sub-badge-free {
          background: #f1f5f9; color: #64748b;
          font-size: 10px; font-weight: 700; padding: 2px 8px;
          border-radius: 100px; letter-spacing: .04em;
        }
        .lh-sub-badge-paid {
          background: linear-gradient(135deg,#fbbf24,#f59e0b);
          color: #7c2d12; font-size: 10px; font-weight: 700;
          padding: 2px 8px; border-radius: 100px; letter-spacing: .04em;
        }
        /* Lock overlay on course / test cards */
        .lh-locked-overlay {
          position: absolute; inset: 0; background: rgba(15,23,42,.55);
          border-radius: inherit; display: flex; align-items: center;
          justify-content: center; cursor: pointer; z-index: 2;
        }
        /* Subscription card in dashboard */
        .lh-sub-card {
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          border-radius: 16px; padding: 20px; color: #fff;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; flex-wrap: wrap;
        }
        .lh-sub-card.free-plan {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          color: #1e293b; border: 1.5px solid #e2e8f0;
        }
        .lh-sub-card.paid-plan {
          background: linear-gradient(135deg, #6366f1, #7c3aed);
        }
      </style>`;
    document.body.appendChild(div.firstElementChild);
  }

  /* ── Internal state for current purchase ────────────────────── */
  let _current = null;  // { type, id, name, price, originalPrice, cb }

  /* ── Tab switcher in payment modal ──────────────────────────── */
  function _setTab(tab) {
    ['upi','card','nb'].forEach(function(t) {
      const btn   = document.getElementById('lh-tab-' + t);
      const field = document.getElementById('lh-pay-' + (t === 'upi' ? 'upi' : t === 'card' ? 'card-fields' : 'nb-fields'));
      const active = (t === tab);
      if (btn) {
        btn.style.borderColor = active ? '#6366f1' : '#e2e8f0';
        btn.style.background  = active ? '#f0f4ff'  : '#fff';
        btn.style.color       = active ? '#6366f1'  : '#94a3b8';
      }
      if (field) field.style.display = active ? 'block' : 'none';
    });
  }

  /* ── Open the payment modal ──────────────────────────────────── */
  function openPayment(opts) {
    // opts = { type: 'course'|'test'|'material'|'liveclass', id, name, price, originalPrice, onSuccess }
    _injectModal();
    _current = opts;

    // Populate header
    const nameEl = document.getElementById('lh-pay-item-name');
    const amtEl  = document.getElementById('lh-pay-amount');
    const origEl = document.getElementById('lh-pay-original');
    const saveEl = document.getElementById('lh-pay-savings');
    if (nameEl) nameEl.textContent = opts.name;
    if (amtEl)  amtEl.textContent  = CURRENCY + opts.price.toLocaleString('en-IN');
    if (origEl) {
      if (opts.originalPrice && opts.originalPrice > opts.price) {
        origEl.textContent = CURRENCY + opts.originalPrice.toLocaleString('en-IN');
        origEl.style.display = 'inline';
        const saving = Math.round((1 - opts.price / opts.originalPrice) * 100);
        if (saveEl) { saveEl.textContent = saving + '% OFF'; saveEl.style.display = 'inline'; }
      } else {
        origEl.style.display = 'none';
        if (saveEl) saveEl.style.display = 'none';
      }
    }
    if (document.getElementById('lh-pay-btn-text'))
      document.getElementById('lh-pay-btn-text').textContent = 'Pay ' + CURRENCY + opts.price.toLocaleString('en-IN') + ' Securely';

    // Show form, hide others
    _showPayArea('form');
    _setTab('upi');

    const modal = document.getElementById(MODAL_ID);
    if (modal) { modal.style.display = 'flex'; modal.classList.add('lh-pay-open'); }

    document.body.style.overflow = 'hidden';
  }

  /* ── Show a sub-area of the modal ────────────────────────────── */
  function _showPayArea(area) {
    ['lh-pay-form-area','lh-pay-processing','lh-pay-success'].forEach(function(id) {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    const target = area === 'form' ? 'lh-pay-form-area' : area === 'processing' ? 'lh-pay-processing' : 'lh-pay-success';
    const el = document.getElementById(target);
    if (el) el.style.display = 'block';
  }

  /* ── Close the modal ─────────────────────────────────────────── */
  function closePayment() {
    const modal = document.getElementById(MODAL_ID);
    if (modal) { modal.style.display = 'none'; modal.classList.remove('lh-pay-open'); }
    document.body.style.overflow = '';
    _current = null;
  }

  /* ── Simulate payment processing ────────────────────────────── */
  function _processPayment() {
    if (!_current) return;
    _showPayArea('processing');

    setTimeout(function() {
      _completePayment();
    }, GATEWAY_DELAY_MS);
  }

  /* ── Complete purchase & update user record ──────────────────── */
  function _completePayment() {
    if (!_current) return;

    // Get current session
    const session = _getSession();
    if (!session) { closePayment(); window.location.href = 'login.html'; return; }

    // Persist purchase to DB
    const result = _recordPurchase(session.id, _current.type, _current.id);

    // Update session in storage
    if (result.updatedUser) {
      _updateSession(result.updatedUser);
    }

    // Show success
    const orderId = 'LH' + Date.now().toString().slice(-8).toUpperCase();
    const msgEl = document.getElementById('lh-pay-success-msg');
    const oidEl = document.getElementById('lh-pay-order-id');
    if (msgEl) msgEl.textContent = '"' + _current.name + '" is now unlocked!';
    if (oidEl) oidEl.textContent = 'Order ID: ' + orderId;

    _showPayArea('success');
  }

  /* ── After clicking "Access Content" ────────────────────────── */
  function _afterSuccess() {
    const cb = _current && _current.onSuccess;
    closePayment();
    if (typeof cb === 'function') {
      cb(_current);
    } else {
      // Default: reload page to reflect access
      window.location.reload();
    }
  }

  /* ── Record purchase in localStorage ────────────────────────── */
  function _recordPurchase(userId, type, itemId) {
    // Update via LH_DB if available
    if (window.LH_DB && typeof LH_DB.recordPurchase === 'function') {
      return LH_DB.recordPurchase(userId, type, itemId);
    }

    // Fallback: direct localStorage manipulation
    const UKEY = 'lh_users_db';
    let users = [];
    try { users = JSON.parse(localStorage.getItem(UKEY) || '[]'); } catch(e) {}

    const idx = users.findIndex(function(u) { return u.id === userId; });
    if (idx === -1) return { error: 'user_not_found' };

    const u = users[idx];
    if (!u.subscription) u.subscription = 'free';
    if (!u.purchasedTests)     u.purchasedTests = [];
    if (!u.purchasedMaterials) u.purchasedMaterials = [];
    if (!u.enrolledCourses)    u.enrolledCourses = [];

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
    } else if (type === 'plan') {
      // itemId is like 'plan_pro' or 'plan_ultimate'
      var planName = String(itemId).replace('plan_', '');
      u.subscription = 'paid';
      u.plan = planName;
      u.planActivatedAt = new Date().toISOString();
    }

    users[idx] = u;
    localStorage.setItem(UKEY, JSON.stringify(users));

    const safe = Object.assign({}, u);
    delete safe.password;
    return { success: true, updatedUser: safe };
  }

  /* ── Session helpers ─────────────────────────────────────────── */
  function _getSession() {
    try {
      const raw = localStorage.getItem('learnhubUser') || sessionStorage.getItem('learnhubUser');
      return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
  }

  function _updateSession(user) {
    const inLocal = !!localStorage.getItem('learnhubUser');
    const data = JSON.stringify(user);
    if (inLocal) localStorage.setItem('learnhubUser', data);
    else          sessionStorage.setItem('learnhubUser', data);
  }

  /* ── Access checks ───────────────────────────────────────────── */
  function canAccessCourse(courseId, priceNum) {
    // Free courses (price === 0) always accessible
    if (!priceNum || priceNum === 0) return true;
    const user = _getSession();
    if (!user) return false;
    const enrolled = user.enrolledCourses || [];
    return enrolled.includes(courseId) || enrolled.includes(String(courseId));
  }

  function canAccessTest(testId, isFree) {
    if (isFree) return true;
    const user = _getSession();
    if (!user) return false;
    const purchased = user.purchasedTests || [];
    return purchased.includes(testId) || purchased.includes(String(testId));
  }

  function canAccessMaterial(materialId, isFree) {
    if (isFree) return true;
    const user = _getSession();
    if (!user) return false;
    const purchased = user.purchasedMaterials || [];
    return purchased.includes(materialId) || purchased.includes(String(materialId));
  }

  function getSubscription() {
    const user = _getSession();
    return user ? (user.subscription || 'free') : 'free';
  }

  /* ── Show "needs login" toast ────────────────────────────────── */
  function _needsLogin(page) {
    window.location.href = 'login.html?next=' + (page || window.location.pathname.split('/').pop());
  }

  /* ── Generic "access denied" gate — opens payment or login ───── */
  function requireAccess(opts) {
    // opts: { type, id, name, price, originalPrice, isFree, onSuccess }
    const user = _getSession();
    if (!user) { _needsLogin(); return false; }
    if (opts.isFree || opts.price === 0) return true;  // free content

    // Check if already purchased
    let alreadyOwned = false;
    if (opts.type === 'course')   alreadyOwned = canAccessCourse(opts.id, opts.price);
    if (opts.type === 'test')     alreadyOwned = canAccessTest(opts.id, false);
    if (opts.type === 'material') alreadyOwned = canAccessMaterial(opts.id, false);

    if (alreadyOwned) return true;

    // Open payment modal
    openPayment(opts);
    return false;
  }

  /* ── Dashboard subscription widget injector ─────────────────── */
  function injectDashboardSubCard() {
    const container = document.getElementById('lh-sub-card-container');
    if (!container) return;
    const user = _getSession();
    if (!user) return;

    const sub      = user.subscription || 'free';
    const isPaid   = (sub === 'paid');
    const courses  = (user.enrolledCourses || []).length;
    const tests    = (user.purchasedTests || []).length;
    const mats     = (user.purchasedMaterials || []).length;

    container.innerHTML = `
      <div class="lh-sub-card ${isPaid ? 'paid-plan' : 'free-plan'}">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <div style="width:36px;height:36px;background:${isPaid ? 'rgba(255,255,255,.2)' : '#e0e7ff'};
              border-radius:10px;display:flex;align-items:center;justify-content:center;">
              <i class="fas ${isPaid ? 'fa-crown' : 'fa-user'}" style="color:${isPaid ? '#fbbf24' : '#6366f1'};font-size:16px;"></i>
            </div>
            <div>
              <p style="font-size:12px;font-weight:600;opacity:.75;">SUBSCRIPTION</p>
              <p style="font-size:20px;font-weight:800;line-height:1;">${isPaid ? '⭐ Paid Member' : '🆓 Free Plan'}</p>
            </div>
          </div>
          <div style="display:flex;gap:16px;margin-top:10px;flex-wrap:wrap;">
            <div style="text-align:center;">
              <p style="font-size:18px;font-weight:800;">${courses}</p>
              <p style="font-size:10px;opacity:.7;font-weight:600;">Courses</p>
            </div>
            <div style="text-align:center;">
              <p style="font-size:18px;font-weight:800;">${tests}</p>
              <p style="font-size:10px;opacity:.7;font-weight:600;">Tests</p>
            </div>
            <div style="text-align:center;">
              <p style="font-size:18px;font-weight:800;">${mats}</p>
              <p style="font-size:10px;opacity:.7;font-weight:600;">Materials</p>
            </div>
          </div>
        </div>
        ${!isPaid ? `
        <a href="pricing.html"
          style="white-space:nowrap;background:linear-gradient(135deg,#6366f1,#7c3aed);color:#fff;
          padding:10px 18px;border-radius:12px;font-size:13px;font-weight:700;text-decoration:none;
          display:flex;align-items:center;gap:6px;box-shadow:0 4px 14px rgba(99,102,241,.35);">
          <i class="fas fa-crown" style="color:#fbbf24;"></i> Upgrade
        </a>` : `
        <div style="text-align:right;">
          <span style="background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#7c2d12;
            font-size:11px;font-weight:800;padding:4px 12px;border-radius:100px;">ACTIVE</span>
          <p style="font-size:10px;margin-top:6px;opacity:.7;">All purchased content unlocked</p>
        </div>`}
      </div>`;
  }

  /* ── Navbar subscription badge ───────────────────────────────── */
  function injectNavBadge() {
    const user = _getSession();
    if (!user || user.role === 'admin') return;
    const sub = user.subscription || 'free';

    // Remove old badge if present
    const existing = document.querySelector('.lh-sub-nav-badge');
    if (existing) existing.remove();

    const nameEl = document.querySelector('.lh-nav-name-text');
    if (!nameEl) return;

    const badge = document.createElement('span');
    badge.className = 'lh-sub-nav-badge ' + (sub === 'paid' ? 'lh-sub-badge-paid' : 'lh-sub-badge-free');
    badge.textContent = sub === 'paid' ? '⭐ Paid' : 'Free';

    // Insert after name text, inside .lh-nav-name div
    const nameContainer = nameEl.parentElement;
    if (nameContainer) {
      // Remove old role text and replace with badge on same line
      const roleEl = nameContainer.querySelector('.lh-nav-role-text');
      if (roleEl) nameContainer.insertBefore(badge, roleEl.nextSibling);
      else nameContainer.appendChild(badge);
    }
  }

  /* ── Subscribe to a Plan (Pro / Ultimate) ───────────────────── */
  function subscribePlan(plan, billing) {
    const user = _getSession();
    if (!user) { window.location.href = 'login.html'; return; }

    var prices = { pro: { monthly: 499, yearly: 2999 }, ultimate: { monthly: 999, yearly: 5999 } };
    var price   = prices[plan] ? prices[plan][billing || 'monthly'] : 0;
    var label   = plan.charAt(0).toUpperCase() + plan.slice(1);

    openPayment({
      id:       'plan_' + plan,
      type:     'plan',
      name:     'LearnHub ' + label + ' Plan',
      price:    price,
      currency: CURRENCY,
      plan:     plan,
      billing:  billing || 'monthly',
      onSuccess: function() {
        // Persist plan field
        try {
          var UKEY  = 'lh_users_db';
          var users = JSON.parse(localStorage.getItem(UKEY) || '[]');
          var idx   = users.findIndex(function(u){ return u.id === user.id; });
          if (idx !== -1) {
            users[idx].plan        = plan;
            users[idx].planBilling = billing || 'monthly';
            localStorage.setItem(UKEY, JSON.stringify(users));
          }
        } catch(e) {}
        // Update session with plan
        var updated = Object.assign({}, _getSession(), {
          subscription: 'paid',
          plan: plan,
          planBilling: billing || 'monthly'
        });
        _updateSession(updated);

        if (window.location.pathname.includes('pricing')) {
          setTimeout(function(){ window.location.href = 'dashboard.html'; }, 1500);
        } else {
          window.location.reload();
        }
      }
    });
  }

  /* ── Public API ─────────────────────────────────────────────── */
  return {
    openPayment,
    closePayment,
    requireAccess,
    canAccessCourse,
    canAccessTest,
    canAccessMaterial,
    getSubscription,
    subscribePlan,
    injectDashboardSubCard,
    injectNavBadge,
    _setTab,
    _processPayment,
    _afterSuccess,
    _recordPurchase,
    _getSession
  };

})();
