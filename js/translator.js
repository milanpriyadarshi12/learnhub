/* ============================================================
   AI TRANSLATOR WIDGET — LearnHub
   Uses Google Translate (unofficial, free, no key, CORS-safe)
   + Web Speech API for voice input/output
   ============================================================ */

(function () {
  'use strict';

  /* ── Singleton guard — prevent double-init on cached navigation ── */
  if (window.__trWidgetLoaded) return;
  window.__trWidgetLoaded = true;

  /* ── Language map ─────────────────────────────────────── */
  const LANGS = {
    auto: { label: '🌐 Auto-detect',  code: 'auto' },
    hi:   { label: '🇮🇳 Hindi',        code: 'hi'   },
    or:   { label: '🇮🇳 Odia',         code: 'or'   },
    bn:   { label: '🇧🇩 Bengali',      code: 'bn'   },
    ta:   { label: '🇮🇳 Tamil',        code: 'ta'   },
    te:   { label: '🇮🇳 Telugu',       code: 'te'   },
    mr:   { label: '🇮🇳 Marathi',      code: 'mr'   },
    ur:   { label: '🇵🇰 Urdu',         code: 'ur'   },
    kn:   { label: '🇮🇳 Kannada',      code: 'kn'   },
    ml:   { label: '🇮🇳 Malayalam',    code: 'ml'   },
  };

  /* BCP-47 codes for Speech Recognition hint */
  const SPEECH_LOCALES = {
    hi: 'hi-IN', or: 'or-IN', bn: 'bn-IN', ta: 'ta-IN',
    te: 'te-IN', mr: 'mr-IN', ur: 'ur-PK', kn: 'kn-IN',
    ml: 'ml-IN', auto: 'en-IN',
  };

  /* ── State ─────────────────────────────────────────────── */
  let isOpen       = false;
  let isRecording  = false;
  let isSpeaking   = false;
  let recognition  = null;
  let speechSynth  = window.speechSynthesis || null;

  /* ── Inject stylesheet ─────────────────────────────────── */
  function injectStyle () {
    if (document.getElementById('tr-style-link')) return;
    const link = document.createElement('link');
    link.id   = 'tr-style-link';
    link.rel  = 'stylesheet';
    link.href = 'css/translator.css';
    document.head.appendChild(link);
  }

  /* ── Build HTML ────────────────────────────────────────── */
  function buildHTML () {
    /* Prevent duplicate widget if script runs twice */
    if (document.getElementById('tr-widget')) return;

    const wrap = document.createElement('div');
    wrap.id = 'tr-widget';

    wrap.innerHTML = `
      <!-- Floating Button -->
      <button id="tr-fab" aria-label="Open AI Translator" title="AI Translator">
        <span class="tr-fab-icon">🌐</span>
        <span id="tr-fab-label">AI Translator</span>
      </button>

      <!-- Popup Panel -->
      <div id="tr-panel" role="dialog" aria-modal="true" aria-label="AI Translator Assistant">

        <!-- Particles -->
        <div id="tr-particles"></div>

        <!-- Header -->
        <div id="tr-header">
          <div class="tr-header-left">
            <div class="tr-logo-orb">🌐</div>
            <div>
              <div class="tr-header-title">AI Translator</div>
              <div class="tr-header-sub">Instant · Voice · Multilingual</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="tr-status-dot" title="Online"></div>
            <button id="tr-close-btn" aria-label="Close translator">✕</button>
          </div>
        </div>

        <!-- Body -->
        <div id="tr-body">

          <!-- Language Selector -->
          <div>
            <div class="tr-label">Translate From</div>
            <div class="tr-lang-row">
              <div class="tr-lang-select-wrap">
                <select id="tr-lang-select" aria-label="Source language">
                  ${Object.entries(LANGS).map(([k, v]) =>
                    `<option value="${k}">${v.label}</option>`
                  ).join('')}
                </select>
              </div>
              <div class="tr-arrow-badge">→</div>
              <div class="tr-target-badge">🇬🇧 English</div>
            </div>
          </div>

          <!-- Detection badge -->
          <div id="tr-detect-badge" aria-live="polite"></div>

          <!-- Input -->
          <div>
            <div class="tr-label">Enter Text</div>
            <div class="tr-textarea-wrap">
              <textarea
                id="tr-input"
                placeholder="Type or paste text here, or use the mic below…"
                rows="4"
                aria-label="Text to translate"
                maxlength="2000"
              ></textarea>
              <div class="tr-input-actions">
                <button class="tr-icon-btn" id="tr-clear-input-btn" title="Clear input" aria-label="Clear input">🗑</button>
                <span id="tr-char-count" style="font-size:11px;color:var(--tr-muted);display:flex;align-items:center;padding:0 4px;">0</span>
              </div>
            </div>
          </div>

          <!-- Mic -->
          <button id="tr-mic-btn" aria-label="Voice input">
            <span id="tr-mic-icon">🎤</span>
            <span id="tr-mic-text">Click to speak</span>
            <div class="tr-mic-waves" id="tr-mic-waves">
              <div class="tr-mic-wave"></div>
              <div class="tr-mic-wave"></div>
              <div class="tr-mic-wave"></div>
              <div class="tr-mic-wave"></div>
              <div class="tr-mic-wave"></div>
            </div>
          </button>

          <!-- Translate -->
          <button id="tr-translate-btn" aria-label="Translate">
            <div class="tr-btn-spinner"></div>
            <span class="tr-btn-text">✨ Translate to English</span>
          </button>

          <!-- Output -->
          <div>
            <div class="tr-label">Translation</div>
            <div id="tr-output-wrap" aria-live="polite">
              <div id="tr-output-text">
                <span class="tr-output-placeholder">Your English translation will appear here…</span>
              </div>
            </div>
            <div class="tr-output-actions">
              <button class="tr-action-btn tr-speak" id="tr-speak-btn" title="Speak translation" aria-label="Speak translation">
                🔊 <span>Speak</span>
              </button>
              <button class="tr-action-btn tr-copy" id="tr-copy-btn" title="Copy translation" aria-label="Copy translation">
                📋 <span>Copy</span>
              </button>
              <button class="tr-action-btn tr-clear" id="tr-clear-all-btn" title="Clear all" aria-label="Clear all">
                🗑 <span>Clear</span>
              </button>
            </div>
          </div>

        </div><!-- /body -->
      </div><!-- /panel -->
    `;

    document.body.appendChild(wrap);
  }

  /* ── Particles ─────────────────────────────────────────── */
  function spawnParticles () {
    const container = document.getElementById('tr-particles');
    if (!container) return;
    const colors = ['#6c47ff','#a78bfa','#38bdf8','#f472b6','#818cf8'];
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('div');
      p.className = 'tr-particle';
      const size = Math.random() * 5 + 3;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        bottom: ${Math.random() * 20}%;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration:${5 + Math.random() * 8}s;
        animation-delay:${Math.random() * 6}s;
      `;
      container.appendChild(p);
    }
  }

  /* ── Open / Close ──────────────────────────────────────── */
  function openPanel () {
    isOpen = true;
    const panel = document.getElementById('tr-panel');
    const fab   = document.getElementById('tr-fab');
    panel.style.visibility = 'visible';
    panel.classList.add('tr-open');
    fab.style.transform = 'scale(0.9)';
    setTimeout(() => { fab.style.transform = ''; }, 200);
  }

  function closePanel () {
    isOpen = false;
    const panel = document.getElementById('tr-panel');
    panel.classList.remove('tr-open');
    /* Hide from render/accessibility after transition completes (350ms) */
    setTimeout(() => {
      if (!isOpen) panel.style.visibility = 'hidden';
    }, 360);
    stopRecording();
    stopSpeaking();
  }

  /* ── Translation via Google Unofficial (free, no key, CORS-safe) ── */
  async function translate (text, fromCode) {
    /* Google's gtx endpoint works cross-origin without API keys */
    const sl = (fromCode === 'auto') ? 'auto' : fromCode;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=en&dt=t&q=${encodeURIComponent(text)}`;

    let res;
    try {
      res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    } catch (networkErr) {
      /* Fallback: MyMemory (no auto-detect, but works for specific langs) */
      if (fromCode !== 'auto') {
        return await translateMyMemory(text, fromCode);
      }
      throw networkErr;
    }

    if (!res.ok) {
      /* Fallback for non-auto selections */
      if (fromCode !== 'auto') return await translateMyMemory(text, fromCode);
      throw new Error('Translation service unavailable');
    }

    const data = await res.json();

    /* Google response shape:
       [ [ ["translated","original",null,null,1], … ], null, "detected_lang", … ]
       Concatenate all translated segments from data[0] */
    if (!Array.isArray(data) || !Array.isArray(data[0])) {
      throw new Error('Unexpected response format');
    }

    const translated   = data[0].map(seg => (seg[0] || '')).join('');
    const detectedLang = (data[2] && typeof data[2] === 'string') ? data[2] : '';

    if (!translated) throw new Error('Empty translation result');

    return { translated, detectedLang };
  }

  /* ── Fallback: MyMemory (specific language pair only) ─── */
  async function translateMyMemory (text, fromCode) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromCode}|en`;
    const res  = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();

    if (!data.responseData || !data.responseData.translatedText) {
      throw new Error('No translation returned');
    }

    const translated   = data.responseData.translatedText;
    const detectedLang = '';

    /* MyMemory sometimes echoes back the original when it can't translate */
    if (translated.toLowerCase() === text.toLowerCase()) {
      throw new Error('Translation failed — text may already be in English');
    }

    return { translated, detectedLang };
  }

  /* ── Type effect ───────────────────────────────────────── */
  function typeText (el, text, speed = 18) {
    el.innerHTML = '';
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  }

  /* ── Show result ───────────────────────────────────────── */
  function showResult (text, detectedLang) {
    const outputWrap = document.getElementById('tr-output-wrap');
    const outputEl   = document.getElementById('tr-output-text');
    const badge      = document.getElementById('tr-detect-badge');
    const langSel    = document.getElementById('tr-lang-select');

    outputWrap.classList.add('tr-has-result');
    typeText(outputEl, text);

    /* Show detection badge when auto-detect is selected and a language was detected */
    const isAutoMode = langSel.value === 'auto';
    if (detectedLang && isAutoMode) {
      const langEntry = LANGS[detectedLang];
      const langName  = langEntry ? langEntry.label : detectedLang.toUpperCase();
      badge.innerHTML = `🔍 Detected: <strong style="color:var(--tr-primary-2)">${langName}</strong>`;
      badge.classList.add('tr-visible');
    } else {
      badge.classList.remove('tr-visible');
    }
  }

  /* ── Loading shimmer ───────────────────────────────────── */
  function showLoading () {
    const el = document.getElementById('tr-output-text');
    el.innerHTML = `
      <div class="tr-shimmer" style="width:90%;"></div>
      <div class="tr-shimmer" style="width:70%;"></div>
      <div class="tr-shimmer" style="width:80%;"></div>
    `;
    document.getElementById('tr-output-wrap').classList.remove('tr-has-result');
    document.getElementById('tr-detect-badge').classList.remove('tr-visible');
  }

  /* ── Handle translate click ────────────────────────────── */
  async function handleTranslate () {
    const inputEl  = document.getElementById('tr-input');
    const btn      = document.getElementById('tr-translate-btn');
    const langSel  = document.getElementById('tr-lang-select');

    const text = inputEl.value.trim();
    if (!text) {
      inputEl.style.borderColor = 'rgba(248,113,113,0.6)';
      inputEl.placeholder = '⚠ Please enter some text first…';
      setTimeout(() => {
        inputEl.style.borderColor = '';
        inputEl.placeholder = 'Type or paste text here, or use the mic below…';
      }, 2000);
      return;
    }

    btn.classList.add('tr-loading');
    btn.disabled = true;
    showLoading();

    try {
      const { translated, detectedLang } = await translate(text, langSel.value);
      showResult(translated, detectedLang);
    } catch (err) {
      const outputEl = document.getElementById('tr-output-text');
      outputEl.innerHTML =
        `<span style="color:#f87171">⚠ Translation failed. Please check your connection and try again.</span>`;
      document.getElementById('tr-output-wrap').classList.remove('tr-has-result');
    } finally {
      btn.classList.remove('tr-loading');
      btn.disabled = false;
    }
  }

  /* ── Voice input ───────────────────────────────────────── */
  function startRecording () {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('🎤 Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const langSel = document.getElementById('tr-lang-select');
    const locale  = SPEECH_LOCALES[langSel.value] || 'hi-IN';

    recognition = new SpeechRecognition();
    recognition.lang            = locale;
    recognition.continuous      = false;
    recognition.interimResults  = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isRecording = true;
      const btn   = document.getElementById('tr-mic-btn');
      const txt   = document.getElementById('tr-mic-text');
      const waves = document.getElementById('tr-mic-waves');
      if (btn)   btn.classList.add('tr-recording');
      if (txt)   txt.textContent = 'Listening…';
      if (waves) waves.style.display = 'flex';
    };

    recognition.onresult = (e) => {
      const spoken = e.results[0][0].transcript;
      const inputEl = document.getElementById('tr-input');
      inputEl.value = spoken;
      updateCharCount();
      stopRecording();
      /* Auto-translate after voice input */
      setTimeout(handleTranslate, 300);
    };

    recognition.onerror = (e) => {
      console.warn('Speech recognition error:', e.error);
      stopRecording();
    };

    recognition.onend = () => { stopRecording(); };

    try {
      recognition.start();
    } catch (e) {
      stopRecording();
    }
  }

  function stopRecording () {
    isRecording = false;
    if (recognition) {
      try { recognition.stop(); } catch (_) {}
      recognition = null;
    }
    const btn   = document.getElementById('tr-mic-btn');
    const txt   = document.getElementById('tr-mic-text');
    const waves = document.getElementById('tr-mic-waves');
    if (btn)   btn.classList.remove('tr-recording');
    if (txt)   txt.textContent = 'Click to speak';
    if (waves) waves.style.display = 'none';
  }

  /* ── Speak output ──────────────────────────────────────── */
  function speakOutput () {
    const outputEl = document.getElementById('tr-output-text');
    const text = outputEl.textContent.trim();
    if (!text || text.includes('will appear here') || text.includes('failed')) return;

    if (isSpeaking) { stopSpeaking(); return; }

    if (!speechSynth) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }

    stopSpeaking();

    const utterance  = new SpeechSynthesisUtterance(text);
    utterance.lang   = 'en-US';
    utterance.rate   = 0.95;
    utterance.pitch  = 1;

    utterance.onstart = () => {
      isSpeaking = true;
      const btn = document.getElementById('tr-speak-btn');
      if (btn) {
        btn.classList.add('tr-speaking');
        const s = btn.querySelector('span');
        if (s) s.textContent = 'Stop';
      }
    };

    utterance.onend = () => {
      isSpeaking = false;
      const btn = document.getElementById('tr-speak-btn');
      if (btn) {
        btn.classList.remove('tr-speaking');
        const s = btn.querySelector('span');
        if (s) s.textContent = 'Speak';
      }
    };

    utterance.onerror = () => {
      isSpeaking = false;
      const btn = document.getElementById('tr-speak-btn');
      if (btn) {
        btn.classList.remove('tr-speaking');
        const s = btn.querySelector('span');
        if (s) s.textContent = 'Speak';
      }
    };

    /* Chrome bug workaround: cancel before speaking */
    speechSynth.cancel();
    setTimeout(() => { speechSynth.speak(utterance); }, 50);
  }

  function stopSpeaking () {
    if (speechSynth) speechSynth.cancel();
    isSpeaking = false;
    const btn = document.getElementById('tr-speak-btn');
    if (btn) {
      btn.classList.remove('tr-speaking');
      const s = btn.querySelector('span');
      if (s) s.textContent = 'Speak';
    }
  }

  /* ── Copy ──────────────────────────────────────────────── */
  function copyOutput () {
    const text = document.getElementById('tr-output-text').textContent.trim();
    if (!text || text.includes('will appear here')) return;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => flashCopy()).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy (text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); flashCopy(); } catch (_) {}
    document.body.removeChild(ta);
  }

  function flashCopy () {
    const btn = document.getElementById('tr-copy-btn');
    if (!btn) return;
    const span = btn.querySelector('span');
    if (span) span.textContent = 'Copied!';
    btn.style.color = '#4ade80';
    setTimeout(() => {
      if (span) span.textContent = 'Copy';
      btn.style.color = '';
    }, 1800);
  }

  /* ── Clear all ─────────────────────────────────────────── */
  function clearAll () {
    document.getElementById('tr-input').value = '';
    document.getElementById('tr-output-text').innerHTML =
      '<span class="tr-output-placeholder">Your English translation will appear here…</span>';
    document.getElementById('tr-output-wrap').classList.remove('tr-has-result');
    document.getElementById('tr-detect-badge').classList.remove('tr-visible');
    updateCharCount();
    stopSpeaking();
  }

  /* ── Char count ────────────────────────────────────────── */
  function updateCharCount () {
    const inp = document.getElementById('tr-input');
    const el  = document.getElementById('tr-char-count');
    if (inp && el) el.textContent = inp.value.length;
  }

  /* ── Auto-resize textarea ──────────────────────────────── */
  function autoResize (el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }

  /* ── Keyboard shortcut ─────────────────────────────────── */
  function handleKeydown (e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleTranslate();
    }
    if (e.key === 'Escape' && isOpen) {
      closePanel();
    }
  }

  /* ── Bind events ───────────────────────────────────────── */
  function bindEvents () {
    document.getElementById('tr-fab').addEventListener('click', () => {
      isOpen ? closePanel() : openPanel();
    });

    document.getElementById('tr-close-btn').addEventListener('click', closePanel);
    document.getElementById('tr-translate-btn').addEventListener('click', handleTranslate);

    document.getElementById('tr-mic-btn').addEventListener('click', () => {
      isRecording ? stopRecording() : startRecording();
    });

    document.getElementById('tr-speak-btn').addEventListener('click', speakOutput);
    document.getElementById('tr-copy-btn').addEventListener('click', copyOutput);
    document.getElementById('tr-clear-all-btn').addEventListener('click', clearAll);

    document.getElementById('tr-clear-input-btn').addEventListener('click', () => {
      document.getElementById('tr-input').value = '';
      updateCharCount();
    });

    const inputEl = document.getElementById('tr-input');
    inputEl.addEventListener('input', () => { updateCharCount(); autoResize(inputEl); });
    inputEl.addEventListener('keydown', handleKeydown);

    /* Close on outside click */
    document.addEventListener('click', (e) => {
      const panel = document.getElementById('tr-panel');
      const fab   = document.getElementById('tr-fab');
      if (isOpen && panel && fab && !panel.contains(e.target) && !fab.contains(e.target)) {
        closePanel();
      }
    });

    document.addEventListener('keydown', handleKeydown);
  }

  /* ── Init ──────────────────────────────────────────────── */
  function init () {
    /* Bail if widget already exists (extra safety for SPA-style navigation) */
    if (document.getElementById('tr-widget')) return;

    injectStyle();
    buildHTML();

    /* Suppress CSS transitions on first paint to prevent open/close flicker */
    const panel = document.getElementById('tr-panel');
    if (panel) {
      panel.classList.add('tr-no-transition');
      /* Ensure panel starts fully hidden — no visibility, no pointer events */
      panel.style.visibility = 'hidden';
      /* Let the browser paint once, then re-enable transitions */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          panel.classList.remove('tr-no-transition');
        });
      });
    }

    spawnParticles();
    bindEvents();
  }

  /* ── Boot ──────────────────────────────────────────────── */
  /* Run as soon as DOM is ready — no setTimeout delay needed.
     The tr-no-transition guard in init() handles any transition flicker. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
