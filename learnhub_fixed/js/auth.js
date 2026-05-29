/* ================================================================
   LearnHub — Auth System · auth.js  (FIXED)
   Handles: session, login, signup, logout, route protection,
            dynamic navbar UI, form wiring.
   Uses: localStorage + sessionStorage ONLY.
   ================================================================ */

'use strict';

window.LH_AUTH = (function () {

  /* ── Constants ──────────────────────────────────────────────── */
  const SESSION_KEY  = 'learnhubUser';
  const REMEMBER_KEY = 'learnhubRemember';
  const LOGIN_PAGE   = 'login.html';
  const STUDENT_HOME = 'dashboard.html';
  const ADMIN_HOME   = 'admin-dashboard.html';

  const STUDENT_PROTECTED = [
    'dashboard.html', 'profile.html', 'mocktest-detail.html', 'course-detail.html'
  ];
  const ADMIN_PROTECTED = ['admin-dashboard.html'];
  const AUTH_ONLY_PAGES = ['login.html', 'signup.html'];

  /* ── Helpers ─────────────────────────────────────────────────── */
  function _currentPage() {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  }

  function _redirect(page) {
    if (_currentPage() !== page) {
      window.location.replace(page);
    }
  }

  function _showError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    el.classList.add('lh-auth-shake');
    setTimeout(function () { el.classList.remove('lh-auth-shake'); }, 500);
  }

  function _clearError(el) {
    if (!el) return;
    el.textContent = '';
    el.style.display = 'none';
  }

  function _setButtonLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
      btn.dataset.originalHtml = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i>Please wait…';
      btn.disabled = true;
      btn.style.opacity = '0.85';
    } else {
      btn.innerHTML = btn.dataset.originalHtml || btn.innerHTML;
      btn.disabled = false;
      btn.style.opacity = '';
    }
  }

  /* ── Session management ──────────────────────────────────────── */
  var Session = {
    get: function () {
      try {
        var raw = localStorage.getItem(SESSION_KEY) ||
                  sessionStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) { return null; }
    },

    set: function (user, remember) {
      var data = JSON.stringify(user);
      if (remember) {
        localStorage.setItem(SESSION_KEY, data);
        localStorage.setItem(REMEMBER_KEY, '1');
      } else {
        sessionStorage.setItem(SESSION_KEY, data);
      }
    },

    clear: function () {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(REMEMBER_KEY);
    },

    isLoggedIn: function () { return this.get() !== null; },
    isAdmin:    function () { var u = this.get(); return u && u.role === 'admin'; },
    isStudent:  function () { var u = this.get(); return u && u.role === 'student'; }
  };

  /* ── Route protection ────────────────────────────────────────── */
  function _guardRoutes() {
    var page = _currentPage();

    /* Admin dashboard: only guard if NOT already an admin session */
    if (ADMIN_PROTECTED.includes(page)) {
      if (!Session.isAdmin()) {
        _redirect(Session.isLoggedIn() ? STUDENT_HOME : LOGIN_PAGE);
      }
      return; /* stop here — don't fall through to student guard */
    }

    if (STUDENT_PROTECTED.includes(page) && !Session.isLoggedIn()) {
      _redirect(LOGIN_PAGE + '?next=' + encodeURIComponent(page));
      return;
    }

    if (AUTH_ONLY_PAGES.includes(page) && Session.isLoggedIn()) {
      var user = Session.get();
      _redirect(user.role === 'admin' ? ADMIN_HOME : STUDENT_HOME);
    }
  }

  /* ── Dynamic navbar UI ───────────────────────────────────────── */
  function _updateNavbar() {
    var user = Session.get();
    var loginLinks  = document.querySelectorAll('a[href="login.html"]');
    var signupLinks = document.querySelectorAll('a[href="signup.html"]');

    if (!user) {
      loginLinks.forEach(function (el) { el.style.display = ''; });
      signupLinks.forEach(function (el) { el.style.display = ''; });
      document.querySelectorAll('.lh-nav-user').forEach(function (el) { el.remove(); });
      return;
    }

    loginLinks.forEach(function (el) { el.style.display = 'none'; });
    signupLinks.forEach(function (el) { el.style.display = 'none'; });
    if (document.querySelector('.lh-nav-user')) return;

    var initials = user.name.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase();
    var dashHref = user.role === 'admin' ? ADMIN_HOME : STUDENT_HOME;
    var avatar   = user.profile ? user.profile.avatar : (user.avatar || '');
    var exam     = user.profile ? user.profile.targetExam : (user.targetExam || '');

    var mobileBtn   = document.querySelector('.mobile-menu-btn');
    var navbarRight = mobileBtn
      ? mobileBtn.parentElement
      : (document.querySelector('.navbar .flex.items-center') || document.querySelector('.navbar'));

    if (!navbarRight) return;

    var badge = document.createElement('div');
    badge.className = 'lh-nav-user flex items-center gap-3';
    badge.innerHTML =
      '<a href="' + dashHref + '" class="flex items-center gap-2 lh-nav-user-link" title="Go to Dashboard">' +
        '<div class="lh-nav-avatar">' +
          (avatar
            ? '<img src="' + avatar + '" alt="' + user.name + '" class="w-full h-full object-cover rounded-full">'
            : '<span class="lh-nav-initials">' + initials + '</span>') +
        '</div>' +
        '<div class="hidden md:block lh-nav-name">' +
          '<p class="lh-nav-name-text">' + user.name + '</p>' +
          '<p class="lh-nav-role-text">' + (user.role === 'admin' ? '⚡ Admin' : (exam || 'Student')) + '</p>' +
        '</div>' +
      '</a>' +
      '<button class="lh-nav-logout" id="lhNavLogoutBtn" title="Logout"><i class="fas fa-sign-out-alt"></i></button>';

    if (mobileBtn) {
      navbarRight.insertBefore(badge, mobileBtn);
    } else {
      navbarRight.appendChild(badge);
    }

    document.getElementById('lhNavLogoutBtn').addEventListener('click', function (e) {
      e.preventDefault();
      LH_AUTH.logout();
    });

    // Add subscription badge to navbar
    setTimeout(function() {
      if (window.LH_SUB && typeof LH_SUB.injectNavBadge === 'function') {
        LH_SUB.injectNavBadge();
      }
    }, 100);
  }

  /* ── Update dashboard / profile pages ───────────────────────── */
  function _updateDashboardUI() {
    var user = Session.get();
    if (!user) return;

    /* Greeting */
    var greeting = document.querySelector('h1');
    if (greeting && (greeting.textContent.includes('Rahul') || greeting.textContent.includes('Welcome back'))) {
      greeting.innerHTML = 'Welcome back, ' + user.name.split(' ')[0] + '! 👋';
    }

    /* Stats cards — load from DB if available */
    if (typeof window.LH_DB !== 'undefined') {
      var analytics = LH_DB.getUserAnalytics(user.id);
      if (analytics) {
        var el = document.querySelector('[data-lh-stat="courses"]');
        if (el) el.textContent = analytics.coursesEnrolled;
        el = document.querySelector('[data-lh-stat="tests"]');
        if (el) el.textContent = analytics.testsAttempted;
        el = document.querySelector('[data-lh-stat="hours"]');
        if (el) el.textContent = analytics.studyHours + 'h';
      }
    }

    /* Profile name in header */
    var profileName = document.querySelector('.main-content .text-sm.font-medium');
    var profileExam = document.querySelector('.main-content .text-xs.text-gray-500');
    if (profileName) profileName.textContent = user.name;
    if (profileExam) {
      var exam = user.profile ? user.profile.targetExam : (user.targetExam || '');
      profileExam.textContent = exam || (user.role === 'admin' ? 'Administrator' : 'Student');
    }

    /* Profile avatar */
    var avatarImg = document.querySelector('.main-content img[alt="Profile"]');
    var avatar    = user.profile ? user.profile.avatar : (user.avatar || '');
    if (avatarImg && avatar) avatarImg.src = avatar;

    /* Wire logout links */
    document.querySelectorAll('a[href="index.html"]').forEach(function (el) {
      if (el.querySelector('.fa-sign-out-alt') || el.textContent.trim() === 'Logout') {
        el.href = '#';
        el.addEventListener('click', function (e) {
          e.preventDefault();
          LH_AUTH.logout();
        });
      }
    });
  }

  /* ── Error / success banners ─────────────────────────────────── */
  function _ensureBanner(form, cls) {
    var banner = form.querySelector('.' + cls);
    if (!banner) {
      banner = document.createElement('div');
      banner.className = cls;
      banner.style.display = 'none';
      var btn = form.querySelector('button[type="submit"]');
      if (btn) form.insertBefore(banner, btn);
      else form.appendChild(banner);
    }
    return banner;
  }

  /* ── Wire "Coming Soon" for social buttons ───────────────────── */
  function _wireSocialButtons() {
    document.querySelectorAll('.social-btn').forEach(function (btn) {
      if (btn.dataset.lhSocialWired) return;
      btn.dataset.lhSocialWired = 'true';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-clock mr-1"></i> Coming Soon';
        btn.disabled  = true;
        btn.style.opacity = '0.7';
        setTimeout(function () {
          btn.innerHTML = original;
          btn.disabled  = false;
          btn.style.opacity = '';
        }, 2000);
      });
    });
  }

  /* ── Wire login form ─────────────────────────────────────────── */
  function _wireLoginForm() {
    var form = document.querySelector('.auth-card form');
    if (!form || form.dataset.lhWired) return;
    form.dataset.lhWired = 'true';
    form.removeAttribute('action');
    form.removeAttribute('method');

    var emailInput    = form.querySelector('input[type="email"]');
    var passwordInput = form.querySelector('input[type="password"]');
    var rememberCheck = form.querySelector('input[type="checkbox"]');
    var submitBtn     = form.querySelector('button[type="submit"]');
    var errorBanner   = _ensureBanner(form, 'lh-auth-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      _clearError(errorBanner);

      var email    = emailInput    ? emailInput.value.trim() : '';
      var password = passwordInput ? passwordInput.value     : '';
      var remember = rememberCheck ? rememberCheck.checked   : false;

      if (!email) {
        _showError(errorBanner, '⚠️ Please enter your email address.');
        emailInput && emailInput.focus(); return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        _showError(errorBanner, '⚠️ Please enter a valid email address.');
        emailInput && emailInput.focus(); return;
      }
      if (!password) {
        _showError(errorBanner, '⚠️ Please enter your password.');
        passwordInput && passwordInput.focus(); return;
      }

      _setButtonLoading(submitBtn, true);

      var result = window.LH_DB ? window.LH_DB.authenticate(email, password) : { error: 'db_missing' };

      setTimeout(function () {
        if (result.error) {
          _setButtonLoading(submitBtn, false);
          if (result.error === 'no_user') {
            _showError(errorBanner, '❌ No account found with this email. Please sign up.');
          } else if (result.error === 'wrong_password') {
            _showError(errorBanner, '❌ Incorrect password. Please try again.');
            if (passwordInput) { passwordInput.value = ''; passwordInput.focus(); }
          } else {
            _showError(errorBanner, '❌ Login failed. Please try again.');
          }
          return;
        }

        Session.set(result.user, remember);
        _setButtonLoading(submitBtn, false);
        submitBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Login successful!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        submitBtn.disabled = true;

        var params = new URLSearchParams(window.location.search);
        var next   = params.get('next');

        setTimeout(function () {
          if (result.user && result.user.role === 'admin') {
            window.location.replace(ADMIN_HOME);
          } else if (next && !ADMIN_PROTECTED.includes(next)) {
            window.location.replace(next);
          } else {
            window.location.replace(STUDENT_HOME);
          }
        }, 700);
      }, 400);
    });
  }

  /* ── Wire signup form ────────────────────────────────────────── */
  function _wireSignupForm() {
    var form = document.querySelector('.auth-card form');
    if (!form || form.dataset.lhWired) return;
    form.dataset.lhWired = 'true';
    form.removeAttribute('action');
    form.removeAttribute('method');

    var nameInput     = form.querySelector('input[type="text"]');
    var emailInput    = form.querySelector('input[type="email"]');
    var phoneInput    = form.querySelector('input[type="tel"]');
    var passwordInput = form.querySelector('input[type="password"]');
    var examSelect    = form.querySelector('select');
    var termsCheck    = form.querySelector('input[type="checkbox"]');
    var submitBtn     = form.querySelector('button[type="submit"]');
    var errorBanner   = _ensureBanner(form, 'lh-auth-error');
    var successBanner = _ensureBanner(form, 'lh-auth-success');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      _clearError(errorBanner);
      _clearError(successBanner);

      var name     = nameInput     ? nameInput.value.trim()  : '';
      var email    = emailInput    ? emailInput.value.trim() : '';
      var phone    = phoneInput    ? phoneInput.value.trim() : '';
      var password = passwordInput ? passwordInput.value     : '';
      var exam     = examSelect    ? examSelect.value        : '';

      if (!name || name.length < 2) {
        _showError(errorBanner, '⚠️ Please enter your full name (at least 2 characters).');
        nameInput && nameInput.focus(); return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        _showError(errorBanner, '⚠️ Please enter a valid email address.');
        emailInput && emailInput.focus(); return;
      }
      if (!password || password.length < 8) {
        _showError(errorBanner, '⚠️ Password must be at least 8 characters long.');
        passwordInput && passwordInput.focus(); return;
      }
      if (termsCheck && !termsCheck.checked) {
        _showError(errorBanner, '⚠️ Please accept the Terms of Service to continue.');
        return;
      }

      _setButtonLoading(submitBtn, true);

      var result = window.LH_DB ? window.LH_DB.register(name, email, password, phone, exam) : { error: 'db_missing' };

      setTimeout(function () {
        if (result.error) {
          _setButtonLoading(submitBtn, false);
          if (result.error === 'email_taken') {
            _showError(errorBanner, '❌ An account with this email already exists. Please login.');
            emailInput && emailInput.focus();
          } else if (result.error === 'weak_password') {
            _showError(errorBanner, '⚠️ Password must be at least 8 characters.');
            passwordInput && passwordInput.focus();
          } else {
            _showError(errorBanner, '❌ Registration failed. Please try again.');
          }
          return;
        }

        Session.set(result.user, false);
        _setButtonLoading(submitBtn, false);
        submitBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Account created!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        submitBtn.disabled = true;

        setTimeout(function () { window.location.replace(STUDENT_HOME); }, 700);
      }, 400);
    });
  }

  /* ── Detect page and wire ─────────────────────────────────────── */
  function _wireForms() {
    var page = _currentPage();
    if (page === 'login.html')  _wireLoginForm();
    if (page === 'signup.html') _wireSignupForm();
  }

  /* ── Public API ─────────────────────────────────────────────── */
  return {

    init: function () {
      _guardRoutes();
      document.addEventListener('DOMContentLoaded', function () {
        _updateNavbar();
        _updateDashboardUI();
        _wireForms();
        _wireSocialButtons();
      });
    },

    logout: function () {
      Session.clear();
      window.location.replace(LOGIN_PAGE);
    },

    getUser:    function () { return Session.get(); },
    isLoggedIn: function () { return Session.isLoggedIn(); },
    isAdmin:    function () { return Session.isAdmin(); },

    /* Expose session key for admin.js compatibility */
    SESSION_KEY: SESSION_KEY
  };

})();

/* ── Auto-initialize ──────────────────────────────────────────── */
LH_AUTH.init();
