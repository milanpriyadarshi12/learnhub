// ====================================================
// LearnHub Premium EdTech Platform
// Enhanced JavaScript with Global Search
// ====================================================

document.addEventListener('DOMContentLoaded', function() {
  // Guard against double init
  if (document.body.dataset.lhScriptInit) return;
  document.body.dataset.lhScriptInit = 'true';

  // Initialize all components
  initPageLoader();
  initNavbar();
  initGlobalSearch();
  initSearchTyping();
  initScrollReveal();
  initCounterAnimation();
  initFaqAccordion();
  initMobileMenu();
  initScrollToTop();
  initPasswordToggle();
  initSmoothScroll();
  initProgressBars();
  initTabSwitcher();
  initFloatingCards();
  initParticles();
  initStudyMaterialFilter();
  initCourseFilter();
});

// Page Loader
function initPageLoader() {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', function() {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('page-loaded');
      }, 500);
    });
  }
}

// Navbar Scroll Effect
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
}

// Global Search Data
const searchData = {
  courses: [
    { title: 'UPSC Prelims Complete Course', category: 'UPSC', icon: 'fa-landmark', color: 'blue', url: 'courses.html?search=upsc-prelims' },
    { title: 'UPSC Mains GS Papers', category: 'UPSC', icon: 'fa-landmark', color: 'blue', url: 'courses.html?search=upsc-mains' },
    { title: 'SSC CGL Complete Package', category: 'SSC', icon: 'fa-id-card', color: 'orange', url: 'courses.html?search=ssc-cgl' },
    { title: 'SSC CHSL 2024 Batch', category: 'SSC', icon: 'fa-id-card', color: 'orange', url: 'courses.html?search=ssc-chsl' },
    { title: 'Railway NTPC Master Course', category: 'Railway', icon: 'fa-train', color: 'green', url: 'courses.html?search=railway-ntpc' },
    { title: 'Railway Group D Preparation', category: 'Railway', icon: 'fa-train', color: 'green', url: 'courses.html?search=railway-group-d' },
    { title: 'Banking PO Complete Course', category: 'Banking', icon: 'fa-university', color: 'purple', url: 'courses.html?search=banking-po' },
    { title: 'IBPS Clerk Preparation', category: 'Banking', icon: 'fa-university', color: 'purple', url: 'courses.html?search=ibps-clerk' },
    { title: 'GATE Computer Science', category: 'Engineering', icon: 'fa-microchip', color: 'red', url: 'courses.html?search=gate-cs' },
    { title: 'GATE Electronics & Communication', category: 'Engineering', icon: 'fa-microchip', color: 'red', url: 'courses.html?search=gate-ece' }
  ],
  mockTests: [
    { title: 'UPSC Prelims Full Mock Test', category: 'Mock Test', icon: 'fa-file-alt', color: 'blue', url: 'mocktests.html?search=upsc' },
    { title: 'SSC CGL Tier 1 Mock Tests', category: 'Mock Test', icon: 'fa-file-alt', color: 'orange', url: 'mocktests.html?search=ssc-cgl' },
    { title: 'Banking Aptitude Mock Tests', category: 'Mock Test', icon: 'fa-file-alt', color: 'purple', url: 'mocktests.html?search=banking' },
    { title: 'Railway Reasoning Mock Tests', category: 'Mock Test', icon: 'fa-file-alt', color: 'green', url: 'mocktests.html?search=railway' },
    { title: 'General Aptitude Practice Set', category: 'Mock Test', icon: 'fa-calculator', color: 'yellow', url: 'mocktests.html?search=aptitude' },
    { title: 'Reasoning Practice Set', category: 'Mock Test', icon: 'fa-brain', color: 'purple', url: 'mocktests.html?search=reasoning' }
  ],
  studyMaterials: [
    { title: 'UPSC Current Affairs PDF', category: 'Study Material', icon: 'fa-file-pdf', color: 'red', url: 'studymaterial.html?search=upsc-current-affairs' },
    { title: 'SSC Previous Year Papers', category: 'Study Material', icon: 'fa-file-pdf', color: 'red', url: 'studymaterial.html?search=ssc-papers' },
    { title: 'Banking Awareness Notes', category: 'Study Material', icon: 'fa-sticky-note', color: 'yellow', url: 'studymaterial.html?search=banking-notes' },
    { title: 'Railway GK Notes', category: 'Study Material', icon: 'fa-sticky-note', color: 'green', url: 'studymaterial.html?search=railway-gk' },
    { title: 'Quantitative Aptitude Formulas', category: 'Study Material', icon: 'fa-book', color: 'blue', url: 'studymaterial.html?search=aptitude-formulas' }
  ],
  liveClasses: [
    { title: 'Live: SSC CGL Maths Session', category: 'Live Class', icon: 'fa-video', color: 'red', url: 'liveclasses.html' },
    { title: 'Live: UPSC Polity Discussion', category: 'Live Class', icon: 'fa-video', color: 'red', url: 'liveclasses.html' },
    { title: 'Live: Banking English Session', category: 'Live Class', icon: 'fa-video', color: 'red', url: 'liveclasses.html' }
  ]
};

// Global Search Functionality
var _searchInitialized = false;
function initGlobalSearch() {
  if (_searchInitialized) return;
  _searchInitialized = true;

  const searchContainers = document.querySelectorAll('.search-container');
  if (!searchContainers.length) return;

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return text.replace(regex, '<mark style="background:#e0e7ff;color:#4338ca;border-radius:3px;padding:0 2px;">$1</mark>');
  }

  const defaultSuggestionsHTML = `
    <div class="search-suggestion-header">Quick Access</div>
    <div class="search-quick-tags">
      <span class="search-quick-tag" data-query="UPSC">UPSC</span>
      <span class="search-quick-tag" data-query="SSC">SSC</span>
      <span class="search-quick-tag" data-query="Railway">Railway</span>
      <span class="search-quick-tag" data-query="Banking">Banking</span>
      <span class="search-quick-tag" data-query="GATE">GATE</span>
      <span class="search-quick-tag" data-query="Mock Test">Mock Tests</span>
      <span class="search-quick-tag" data-query="Aptitude">Aptitude</span>
      <span class="search-quick-tag" data-query="Reasoning">Reasoning</span>
    </div>
    <div class="search-suggestion-header">Popular Courses</div>
    <div class="search-suggestion-item" data-url="courses.html?category=upsc">
      <div class="icon-wrapper blue"><i class="fas fa-landmark"></i></div>
      <div class="item-text">
        <div class="item-title">UPSC Civil Services</div>
        <div class="item-category">Courses</div>
      </div>
      <i class="fas fa-chevron-right item-arrow"></i>
    </div>
    <div class="search-suggestion-item" data-url="courses.html?category=ssc">
      <div class="icon-wrapper orange"><i class="fas fa-id-card"></i></div>
      <div class="item-text">
        <div class="item-title">SSC CGL 2024</div>
        <div class="item-category">Courses</div>
      </div>
      <i class="fas fa-chevron-right item-arrow"></i>
    </div>
    <div class="search-suggestion-item" data-url="courses.html?category=railway">
      <div class="icon-wrapper green"><i class="fas fa-train"></i></div>
      <div class="item-text">
        <div class="item-title">Railway NTPC</div>
        <div class="item-category">Courses</div>
      </div>
      <i class="fas fa-chevron-right item-arrow"></i>
    </div>
    <div class="search-suggestion-item" data-url="mocktests.html">
      <div class="icon-wrapper yellow"><i class="fas fa-file-alt"></i></div>
      <div class="item-text">
        <div class="item-title">Mock Tests — All Exams</div>
        <div class="item-category">Mock Tests</div>
      </div>
      <i class="fas fa-chevron-right item-arrow"></i>
    </div>
    <div class="search-suggestion-item" data-url="studymaterial.html">
      <div class="icon-wrapper indigo"><i class="fas fa-book-open"></i></div>
      <div class="item-text">
        <div class="item-title">Study Material & PDFs</div>
        <div class="item-category">Study Material</div>
      </div>
      <i class="fas fa-chevron-right item-arrow"></i>
    </div>
  `;

  function createResultsHTML(results, query) {
    if (results.length === 0) {
      return `
        <div class="search-no-results">
          <i class="fas fa-search"></i>
          <p style="font-weight:600;color:#374151;margin-bottom:4px;">No results for "${query}"</p>
          <p style="font-size:13px;">Try: UPSC, SSC, Railway, Banking, GATE</p>
        </div>
      `;
    }

    const categories = {};
    results.forEach(item => {
      if (!categories[item.category]) categories[item.category] = [];
      categories[item.category].push(item);
    });

    let html = `<div style="padding:8px 18px 4px;font-size:11px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">${results.length} result${results.length !== 1 ? 's' : ''}</div>`;

    for (const [category, items] of Object.entries(categories)) {
      html += `<div class="search-suggestion-header">${category}</div>`;
      items.slice(0, 4).forEach(item => {
        html += `
          <div class="search-suggestion-item" data-url="${item.url}">
            <div class="icon-wrapper ${item.color}"><i class="fas ${item.icon}"></i></div>
            <div class="item-text">
              <div class="item-title">${highlightMatch(item.title, query)}</div>
              <div class="item-category">${item.category}</div>
            </div>
            <i class="fas fa-chevron-right item-arrow"></i>
          </div>
        `;
      });
    }

    return html;
  }

  searchContainers.forEach(container => {
    const searchInput = container.querySelector('.search-input');
    const suggestionsContainer = container.querySelector('.search-suggestions');
    if (!searchInput || !suggestionsContainer) return;

    let selectedIndex = -1;

    function performSearch(query) {
      query = query.trim();
      if (!query) {
        suggestionsContainer.innerHTML = defaultSuggestionsHTML;
        return;
      }

      const q = query.toLowerCase();
      const allResults = [
        ...searchData.courses,
        ...searchData.mockTests,
        ...searchData.studyMaterials,
        ...searchData.liveClasses
      ];

      const results = allResults.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );

      suggestionsContainer.innerHTML = createResultsHTML(results, query);
    }

    // Delegate clicks including quick tags
    suggestionsContainer.addEventListener('click', (e) => {
      const tag = e.target.closest('.search-quick-tag');
      if (tag) {
        searchInput.value = tag.dataset.query;
        performSearch(tag.dataset.query);
        return;
      }
      const item = e.target.closest('.search-suggestion-item');
      if (item) {
        const url = item.getAttribute('data-url');
        if (url) window.location.href = url;
      }
    });

    searchInput.addEventListener('input', (e) => {
      selectedIndex = -1;
      performSearch(e.target.value);
      suggestionsContainer.classList.add('active');
    });

    searchInput.addEventListener('focus', () => {
      performSearch(searchInput.value);
      suggestionsContainer.classList.add('active');
    });

    // Close on outside click — scoped to this container
    searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        if (!container.matches(':hover')) {
          suggestionsContainer.classList.remove('active');
          selectedIndex = -1;
        }
      }, 180);
    });

    suggestionsContainer.addEventListener('mousedown', (e) => {
      // Prevent blur from firing before click
      e.preventDefault();
    });

    searchInput.addEventListener('keydown', (e) => {
      const items = suggestionsContainer.querySelectorAll('.search-suggestion-item');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
        items.forEach((el, i) => {
          el.style.background = i === selectedIndex ? 'rgba(99,102,241,0.07)' : '';
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        items.forEach((el, i) => {
          el.style.background = i === selectedIndex ? 'rgba(99,102,241,0.07)' : '';
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          const url = items[selectedIndex].getAttribute('data-url');
          if (url) window.location.href = url;
        } else if (searchInput.value.trim()) {
          window.location.href = `courses.html?search=${encodeURIComponent(searchInput.value.trim())}`;
        }
        suggestionsContainer.classList.remove('active');
      } else if (e.key === 'Escape') {
        suggestionsContainer.classList.remove('active');
        searchInput.blur();
      }
    });
  });
}

// Search Bar Typing Animation
// Search Bar Typing Animation
function initSearchTyping() {
  const searchInputs = document.querySelectorAll('.search-input');

  searchInputs.forEach(searchInput => {
    if (!searchInput || searchInput.value || searchInput.dataset.typingInit) return;
    searchInput.dataset.typingInit = 'true';

    const placeholders = [
      'Search UPSC courses...',
      'Search SSC CGL...',
      'Search Railway NTPC...',
      'Search Mock Tests...',
      'Search Banking PO...',
      'Search GATE exam...',
      'Search Study Material...',
      'Search Reasoning...',
      'Search Aptitude...',
    ];

    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      if (document.activeElement === searchInput || searchInput.value) {
        setTimeout(type, 1000);
        return;
      }

      const currentText = placeholders[currentIndex];

      if (isDeleting) {
        searchInput.placeholder = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        searchInput.placeholder = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 2200;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % placeholders.length;
        typingSpeed = 400;
      }

      setTimeout(type, typingSpeed);
    }
    
    setTimeout(type, 1000);
  });
}

// Scroll Reveal Animation
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  function checkReveal() {
    reveals.forEach((element, index) => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const revealPoint = 150;
      
      if (elementTop < windowHeight - revealPoint) {
        // Add staggered delay based on index within visible elements
        setTimeout(() => {
          element.classList.add('active');
        }, index % 4 * 100);
      }
    });
  }
  
  window.addEventListener('scroll', checkReveal);
  checkReveal();
}

// Counter Animation
function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter');
  
  const observerOptions = {
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target + suffix;
          }
        };
        
        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => observer.observe(counter));
}

// FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// Mobile Menu
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (!menuBtn || !navMenu) return;
  if (menuBtn.dataset.mobileMenuWired) return;
  menuBtn.dataset.mobileMenuWired = 'true';

  // Create backdrop overlay
  let backdrop = document.getElementById('nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'nav-backdrop';
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  function openMenu() {
    navMenu.classList.add('open');
    menuBtn.classList.add('active');
    backdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';
    const spans = menuBtn.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    menuBtn.classList.remove('active');
    backdrop.classList.remove('visible');
    document.body.style.overflow = '';
    const spans = menuBtn.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close when clicking a nav link
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on backdrop click
  backdrop.addEventListener('click', closeMenu);

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMenu();
  });
}

// Scroll to Top Button
function initScrollToTop() {
  const scrollTopBtn = document.querySelector('.scroll-top');
  
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });
    
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Password Toggle
function initPasswordToggle() {
  const toggles = document.querySelectorAll('.password-toggle');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.parentElement.querySelector('input');
      const icon = toggle.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// Progress Bars Animation
function initProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar-fill, .progress-fill');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width') || bar.style.width;
        bar.style.width = width;
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  
  progressBars.forEach(bar => {
    const targetWidth = bar.style.width || bar.getAttribute('data-width');
    bar.setAttribute('data-width', targetWidth);
    bar.style.width = '0%';
    observer.observe(bar);
  });
}

// Tab Switcher
function initTabSwitcher() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(targetId)?.classList.add('active');
    });
  });
}

// Floating Cards Animation Enhancement
function initFloatingCards() {
  // Animation is now handled by .card-float-wrapper inside each .floating-card.
  // The CSS pauses the animation on hover — no JS transform manipulation needed.
  // Just ensure any legacy animationPlayState overrides are removed.
  document.querySelectorAll('.floating-card').forEach(card => {
    card.style.animationPlayState = '';
  });
}

// Floating Particles
function initParticles() {
  const container = document.querySelector('.particles-container');
  if (!container) return;
  
  // Particles are created via CSS, but we can add dynamic ones here if needed
}

// Study Material Filter
function initStudyMaterialFilter() {
  // Legacy filter tab support
  const filterTabs = document.querySelectorAll('.filter-tab');
  const materialCards = document.querySelectorAll('.material-card');

  if (filterTabs.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const category = tab.getAttribute('data-category');
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        materialCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.classList.add('filtering');
            setTimeout(() => card.classList.remove('filtering'), 400);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // NEW — Study Material page real-time search
  const smSearch = document.getElementById('sm-search-input');
  const smCount = document.getElementById('sm-search-count');
  const smIcon = document.getElementById('sm-search-icon');

  if (!smSearch) return;

  // Collect all filterable card wrappers
  const smCards = document.querySelectorAll('.sm-card-wrapper');

  // Inject no-results message after first grid
  const firstGrid = document.getElementById('sm-notes-grid');
  let noResultsEl = document.getElementById('sm-no-results');
  if (!noResultsEl && firstGrid) {
    noResultsEl = document.createElement('div');
    noResultsEl.id = 'sm-no-results';
    noResultsEl.className = 'sm-no-results-msg';
    noResultsEl.innerHTML = `<i class="fas fa-search-minus"></i><p style="font-weight:600;font-size:16px;color:#374151;margin-bottom:4px;">No materials found</p><p style="font-size:13px;">Try: maths, reasoning, GK, current affairs, UPSC, SSC</p>`;
    firstGrid.insertAdjacentElement('afterend', noResultsEl);
  }

  let filterTimeout;

  smSearch.addEventListener('input', (e) => {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
      const query = e.target.value.toLowerCase().trim();
      let visibleCount = 0;

      smCards.forEach((wrapper, i) => {
        const searchAttr = (wrapper.getAttribute('data-search') || '').toLowerCase();
        const titleEl = wrapper.querySelector('h3');
        const titleText = titleEl ? titleEl.textContent.toLowerCase() : '';
        const descEl = wrapper.querySelector('p');
        const descText = descEl ? descEl.textContent.toLowerCase() : '';

        const matches = !query ||
          searchAttr.includes(query) ||
          titleText.includes(query) ||
          descText.includes(query);

        if (matches) {
          wrapper.classList.remove('hidden-by-filter');
          wrapper.classList.add('filter-show');
          wrapper.style.animationDelay = `${visibleCount * 40}ms`;
          visibleCount++;
        } else {
          wrapper.classList.add('hidden-by-filter');
          wrapper.classList.remove('filter-show');
        }
      });

      // Update count indicator
      if (smCount) {
        if (query && smCards.length > 0) {
          smCount.textContent = `${visibleCount} found`;
        } else {
          smCount.textContent = '';
        }
      }

      // Show/hide no-results
      if (noResultsEl) {
        noResultsEl.style.display = (query && visibleCount === 0) ? 'block' : 'none';
      }

      // Animate search icon
      if (smIcon) {
        smIcon.style.color = query ? '#6366f1' : '';
        smIcon.style.transform = query ? 'translateY(-50%) scale(1.2)' : 'translateY(-50%) scale(1)';
      }
    }, 150);
  });
}

// Progress Ring Animation
function setProgress(circle, percent) {
  const radius = circle.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;
  
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

// Notification Toast
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed top-20 right-4 px-6 py-4 rounded-xl text-white font-medium z-50 transform translate-x-full transition-all duration-300 shadow-lg ${
    type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  }`;
  toast.innerHTML = `
    <div class="flex items-center gap-3">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Form Validation
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    const errorMessage = input.parentElement.querySelector('.error-message');
    
    if (!input.value.trim()) {
      input.classList.add('border-red-500');
      if (errorMessage) errorMessage.textContent = 'This field is required';
      isValid = false;
    } else {
      input.classList.remove('border-red-500');
      if (errorMessage) errorMessage.textContent = '';
    }
    
    if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        input.classList.add('border-red-500');
        if (errorMessage) errorMessage.textContent = 'Please enter a valid email';
        isValid = false;
      }
    }
    
    if (input.type === 'password' && input.value) {
      if (input.value.length < 8) {
        input.classList.add('border-red-500');
        if (errorMessage) errorMessage.textContent = 'Password must be at least 8 characters';
        isValid = false;
      }
    }
  });
  
  return isValid;
}

// Course Filter (legacy helper — kept for backward compat)
function filterCourses(category) {
  document.querySelectorAll('.course-card').forEach(course => {
    const courseCategory = course.getAttribute('data-category');
    if (category === 'all' || courseCategory === category) {
      course.style.display = 'block';
    } else {
      course.style.display = 'none';
    }
  });
}

// Full Course Filter — wires up sidebar controls on courses.html
function initCourseFilter() {
  const courseGrid   = document.querySelector('.course-grid-container');
  const allCards     = document.querySelectorAll('.course-card');
  const applyBtn     = document.getElementById('apply-filters-btn');
  const resetBtn     = document.getElementById('reset-filters-btn');
  const countEl      = document.getElementById('courses-count');
  const sortSelect   = document.getElementById('sort-select');

  if (!allCards.length) return;  // not on courses page

  // Category checkboxes (data-category values match card data-category attr)
  const catAllCb  = document.getElementById('cat-all');
  const catCbs    = document.querySelectorAll('.cat-checkbox');  // specific categories

  // Price radios
  const priceRadios  = document.querySelectorAll('input[name="price"]');
  // Rating radios
  const ratingRadios = document.querySelectorAll('input[name="rating"]');

  function getActiveCategories() {
    if (!catAllCb || catAllCb.checked) return ['all'];
    const selected = [];
    catCbs.forEach(cb => { if (cb.checked) selected.push(cb.value); });
    return selected.length ? selected : ['all'];
  }

  function getActivePrice() {
    let val = 'all';
    priceRadios.forEach(r => { if (r.checked) val = r.value; });
    return val;
  }

  function getActiveRating() {
    let val = 'all';
    ratingRadios.forEach(r => { if (r.checked) val = r.value; });
    return val;
  }

  function cardMatchesPrice(card, price) {
    if (price === 'all') return true;
    return card.getAttribute('data-price') === price;
  }

  function cardMatchesRating(card, rating) {
    if (rating === 'all') return true;
    const cardRating = parseFloat(card.getAttribute('data-rating') || '5');
    return cardRating >= parseFloat(rating);
  }

  function applyFilters() {
    const categories = getActiveCategories();
    const price      = getActivePrice();
    const rating     = getActiveRating();
    let visible = 0;

    allCards.forEach((card, idx) => {
      const cardCat = card.getAttribute('data-category') || '';
      const catMatch = categories.includes('all') || categories.includes(cardCat);
      const priceMatch  = cardMatchesPrice(card, price);
      const ratingMatch = cardMatchesRating(card, rating);

      const show = catMatch && priceMatch && ratingMatch;
      if (show) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        // Staggered reveal
        setTimeout(() => {
          card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, visible * 60);
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countEl) countEl.textContent = visible;
    // Show/hide no-results message
    let noRes = document.getElementById('courses-no-results');
    if (!noRes) {
      noRes = document.createElement('div');
      noRes.id = 'courses-no-results';
      noRes.className = 'course-no-results';
      noRes.innerHTML = '<i class="fas fa-search"></i><p>No courses match your filters.</p><p style="font-size:13px;color:#9ca3af;margin-top:4px;">Try adjusting your filter criteria.</p>';
      const grid = document.querySelector('.course-card')?.parentElement;
      if (grid) grid.insertAdjacentElement('afterend', noRes);
    }
    noRes.style.display = visible === 0 ? 'block' : 'none';
  }

  // "All Courses" checkbox toggles others off
  if (catAllCb) {
    catAllCb.addEventListener('change', () => {
      if (catAllCb.checked) {
        catCbs.forEach(cb => { cb.checked = false; });
      }
    });
  }

  // Specific category deselects "All"
  catCbs.forEach(cb => {
    cb.addEventListener('change', () => {
      if (catAllCb && cb.checked) catAllCb.checked = false;
      if (catAllCb) {
        const anyChecked = Array.from(catCbs).some(c => c.checked);
        if (!anyChecked) catAllCb.checked = true;
      }
    });
  });

  // Apply button
  if (applyBtn) applyBtn.addEventListener('click', applyFilters);

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (catAllCb) catAllCb.checked = true;
      catCbs.forEach(cb => { cb.checked = false; });
      priceRadios.forEach((r, i) => { r.checked = i === 0; });
      ratingRadios.forEach((r, i) => { r.checked = i === 0; });
      applyFilters();
    });
  }

  // Sort select
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const cards = Array.from(allCards).filter(c => c.style.display !== 'none');
      const grid = cards[0]?.parentElement;
      if (!grid) return;
      const sortVal = sortSelect.value;
      cards.sort((a, b) => {
        if (sortVal === 'rating') {
          return parseFloat(b.getAttribute('data-rating') || 0) - parseFloat(a.getAttribute('data-rating') || 0);
        }
        if (sortVal === 'price-asc') {
          return parseInt(a.getAttribute('data-price-num') || 0) - parseInt(b.getAttribute('data-price-num') || 0);
        }
        if (sortVal === 'price-desc') {
          return parseInt(b.getAttribute('data-price-num') || 0) - parseInt(a.getAttribute('data-price-num') || 0);
        }
        return 0;
      });
      cards.forEach(c => grid.appendChild(c));
    });
  }

  // Read ?category= URL param and pre-select the matching checkbox
  const urlParams = new URLSearchParams(window.location.search);
  const urlCategory = urlParams.get('category');
  if (urlCategory && urlCategory !== 'all') {
    // Uncheck "All Categories"
    if (catAllCb) catAllCb.checked = false;
    // Check the matching category checkbox
    catCbs.forEach(cb => {
      cb.checked = (cb.value === urlCategory);
    });
    // Scroll to course grid smoothly after a short delay
    setTimeout(() => {
      const grid = document.querySelector('.course-grid-container');
      if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }

  // Run initial filter (applies URL param selection or shows all)
  applyFilters();
}

// Pricing Toggle
function togglePricing(isYearly) {
  const monthlyPrices = document.querySelectorAll('.monthly-price');
  const yearlyPrices = document.querySelectorAll('.yearly-price');
  
  if (isYearly) {
    monthlyPrices.forEach(el => el.classList.add('hidden'));
    yearlyPrices.forEach(el => el.classList.remove('hidden'));
  } else {
    monthlyPrices.forEach(el => el.classList.remove('hidden'));
    yearlyPrices.forEach(el => el.classList.add('hidden'));
  }
}

// Initialize progress circles
function initProgressCircles() {
  const circles = document.querySelectorAll('.progress-ring-circle');
  
  circles.forEach(circle => {
    const percent = circle.getAttribute('data-percent');
    setProgress(circle, percent);
  });
}

// Mock Test Timer
function initTestTimer(duration, display) {
  let timer = duration, minutes, seconds;
  
  const interval = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    display.textContent = minutes + ':' + seconds;
    
    if (--timer < 0) {
      clearInterval(interval);
      showToast('Time is up! Submitting your test...', 'info');
    }
  }, 1000);
  
  return interval;
}

// Date formatting
function formatDate(date) {
  const options = { weekday: 'short', day: 'numeric', month: 'short' };
  return new Date(date).toLocaleDateString('en-US', options);
}

// Sidebar Toggle for Dashboard
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  if (sidebar) {
    sidebar.classList.toggle('open');
    if (overlay) {
      overlay.classList.toggle('active');
    }
  }
}

// Mobile Search
function openMobileSearch() {
  const overlay = document.querySelector('.mobile-search-overlay');
  const modal = document.querySelector('.mobile-search-modal');
  const input = modal?.querySelector('input');
  
  if (overlay) overlay.classList.add('active');
  if (modal) modal.classList.add('active');
  if (input) input.focus();
}

function closeMobileSearch() {
  const overlay = document.querySelector('.mobile-search-overlay');
  const modal = document.querySelector('.mobile-search-modal');
  
  if (overlay) overlay.classList.remove('active');
  if (modal) modal.classList.remove('active');
}

// Global functions
window.initDashboard = function() {
  initProgressCircles();
  initProgressBars();
};

window.initTest = function(duration) {
  const display = document.querySelector('.timer');
  if (display) {
    initTestTimer(duration, display);
  }
};

window.showToast = showToast;
window.toggleSidebar = toggleSidebar;
window.openMobileSearch = openMobileSearch;
window.closeMobileSearch = closeMobileSearch;
window.filterCourses = filterCourses;
window.togglePricing = togglePricing;
