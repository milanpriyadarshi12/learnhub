/* ============================================================
   LearnHub — Premium Page Loader · loader.js
   Handles: HTML injection, scroll lock, dismiss on load.
   Must be the FIRST script in <head> or top of <body>.
   ============================================================ */

(function () {
  'use strict';

  /* ── Singleton guard ──────────────────────────────────────── */
  if (window.__lhLoaderInit) return;
  window.__lhLoaderInit = true;

  /* ── Upgrade or create .page-loader ──────────────────────── */
  function buildLoader() {
    /* Find existing .page-loader (some pages have a basic one) */
    var existing = document.querySelector('.page-loader');

    /* Premium inner markup */
    var inner = [
      '<div class="lh-loader-brand">',
      '  <div class="lh-loader-logo">',
      '    <div class="lh-loader-icon">',
      '      <i class="fas fa-graduation-cap"></i>',
      '    </div>',
      '    <span class="lh-loader-wordmark">LearnHub</span>',
      '  </div>',
      '  <div class="lh-loader-bar-track">',
      '    <div class="lh-loader-bar-fill"></div>',
      '  </div>',
      '  <span class="lh-loader-tagline">Loading your experience</span>',
      '</div>'
    ].join('');

    if (existing) {
      /* Replace whatever was inside (spinner etc.) with premium markup */
      existing.innerHTML = inner;
    } else {
      /* Create fresh loader and prepend as very first body child */
      var loader = document.createElement('div');
      loader.className = 'page-loader';
      loader.setAttribute('role', 'status');
      loader.setAttribute('aria-label', 'Loading');
      loader.innerHTML = inner;

      /* Insert before everything else in body */
      if (document.body.firstChild) {
        document.body.insertBefore(loader, document.body.firstChild);
      } else {
        document.body.appendChild(loader);
      }
    }
  }

  /* ── Lock scroll while loading ────────────────────────────── */
  function lockScroll() {
    document.body.classList.add('lh-loading');
  }

  /* ── Dismiss loader ───────────────────────────────────────── */
  function dismissLoader() {
    var loader = document.querySelector('.page-loader');
    if (!loader) return;

    /* Unlock scroll first so page feels responsive immediately */
    document.body.classList.remove('lh-loading');
    document.body.classList.add('page-loaded');

    /* Fade out */
    loader.classList.add('lh-loader-hidden');

    /* Remove from DOM after transition to free memory */
    setTimeout(function () {
      if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 600);
  }

  /* ── Timing strategy ──────────────────────────────────────── */
  /*
     We want the loader to feel intentional but never slow things down.
     - Minimum display: 600ms (logo + bar animation is appreciable)
     - Dismiss trigger: window 'load' event (all resources ready)
     - The two timers race; we dismiss whichever finishes last.
  */
  function initDismiss() {
    var minDisplayMs  = 650;   /* minimum time loader is shown        */
    var startTime     = Date.now();
    var pageLoaded    = false;
    var minTimePassed = false;

    function tryDismiss() {
      if (pageLoaded && minTimePassed) dismissLoader();
    }

    /* Minimum display timer */
    setTimeout(function () {
      minTimePassed = true;
      tryDismiss();
    }, minDisplayMs);

    /* Page fully loaded */
    if (document.readyState === 'complete') {
      pageLoaded = true;
    } else {
      window.addEventListener('load', function onLoad() {
        window.removeEventListener('load', onLoad);
        pageLoaded = true;
        tryDismiss();
      });
    }

    /* Hard safety cap — never block user more than 3.5s */
    setTimeout(function () {
      dismissLoader();
    }, 3500);
  }

  /* ── Run immediately when DOM is available ────────────────── */
  function run() {
    buildLoader();
    lockScroll();
    initDismiss();
  }

  if (document.body) {
    run();
  } else {
    /* In case script is in <head> — wait for body */
    document.addEventListener('DOMContentLoaded', run);
  }

})();
