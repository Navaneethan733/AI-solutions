/**
 * STACKLY - Unified Interactions & Scripts
 * Contains all global, services, about, blog, and contact behaviors
 */

// =========================================================================
// Global Navigation History Tracker
// Saves the current page URL to sessionStorage whenever the user navigates
// to the login or signup pages, so the Go Back button can restore them.
// =========================================================================
(function () {
  const AUTH_PAGES = ['login.html', 'signup.html'];
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // If we are currently on an auth page, do NOT overwrite the saved return URL
  const isAuthPage = AUTH_PAGES.some(p => currentPage.includes(p));

  if (!isAuthPage) {
    // Save full URL (pathname + hash for anchor/section links) as the return destination
    sessionStorage.setItem('stackly_return_url', window.location.href);
  }

  // Intercept all <a> clicks that navigate to auth pages so we capture the source URL first
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (AUTH_PAGES.some(p => href && href.includes(p))) {
      // Save current page before navigating away to auth
      sessionStorage.setItem('stackly_return_url', window.location.href);
    }
  }, true);
}());

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Scroll Reveal Animations (Intersection Observer)
  // =========================================================================
  const animatedElements = document.querySelectorAll('[data-animate]');

  if (animatedElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => revealObserver.observe(el));
  }

  // =========================================================================
  // 2. Animated Counter for Stats
  // =========================================================================
  const counterElements = document.querySelectorAll('.animate-counter');

  if (counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target'));
          if (isNaN(target)) return;

          const suffix = el.getAttribute('data-suffix') || '';
          const isDecimal = target % 1 !== 0;
          const duration = 1800;
          const startTime = performance.now();

          const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = isDecimal 
              ? (easeProgress * target).toFixed(1)
              : Math.floor(easeProgress * target);

            el.textContent = currentVal + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
            }
          };

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.2
    });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // =========================================================================
  // 3. Testimonials Carousel (Home & Shared)
  // =========================================================================
  const quoteTextEl = document.querySelector('.quote-text');
  const authorNameEl = document.querySelector('.author-info h4');
  const authorRoleEl = document.querySelector('.author-info p');
  const authorAvatarEl = document.querySelector('.author-avatar');
  const dots = document.querySelectorAll('.dot');

  if (quoteTextEl && authorNameEl && authorRoleEl && dots.length > 0) {
    const testimonials = [
      {
        quote: "Duis aute irure dolor in reprehenderit in voluptate cillum dolore excepteur sint occaecat non proident sunt in culpa qui officia deserunt mollit anim id est voluptatem quia voluptas",
        name: "John Anderson",
        role: "Founder",
        avatar: "assets/images/avatar1.webp"
      },
      {
        quote: "STACKLY completely modernized our enterprise workflows. Their machine learning pipelines reduced our latency by 70% and revolutionized our client delivery.",
        name: "Sarah Jenkins",
        role: "CTO at HyperScale",
        avatar: "assets/images/avatar2.webp"
      },
      {
        quote: "The autonomous agent deployment from STACKLY enabled us to scale past 100k automated inquiries daily without increasing operational headcount.",
        name: "Marcus Vance",
        role: "VP of Product",
        avatar: "assets/images/avatar3.webp"
      }
    ];

    let currentTestimonial = 0;

    const showTestimonial = (index) => {
      currentTestimonial = index;
      const t = testimonials[index];

      quoteTextEl.style.opacity = '0';
      quoteTextEl.style.transform = 'translateY(10px)';

      setTimeout(() => {
        quoteTextEl.textContent = t.quote;
        authorNameEl.textContent = t.name;
        authorRoleEl.textContent = t.role;
        if (authorAvatarEl) authorAvatarEl.src = t.avatar;

        quoteTextEl.style.transition = 'all 0.3s ease';
        quoteTextEl.style.opacity = '1';
        quoteTextEl.style.transform = 'translateY(0)';
      }, 200);

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => showTestimonial(index));
    });

    setInterval(() => {
      const nextIndex = (currentTestimonial + 1) % testimonials.length;
      showTestimonial(nextIndex);
    }, 6000);
  }

  // =========================================================================
  // 4. Video Modal Popup (Home & Blog)
  // =========================================================================
  const videoBtns = document.querySelectorAll('.video-pill-badge, #watchVideoBtn, #blogVideoBtn, .video-thumb-card');
  const videoModal = document.getElementById('videoModal');
  const videoCloseBtn = document.querySelector('.video-modal-close');
  const videoIframe = document.getElementById('videoIframe');

  if (videoModal && videoIframe) {
    const openVideo = (url) => {
      videoIframe.src = url || "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1";
      videoModal.classList.add('active');
    };

    const closeVideo = () => {
      videoModal.classList.remove('active');
      videoIframe.src = "";
    };

    videoBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openVideo();
      });
    });

    if (videoCloseBtn) {
      videoCloseBtn.addEventListener('click', closeVideo);
    }

    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeVideo();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeVideo();
      }
    });
  }

  // =========================================================================
  // 5. 3D Card Tilt Interaction
  // =========================================================================
  const tiltCards = document.querySelectorAll('.hero-card-left, .hero-ai-card, .project-card, .service-card, .service-bento-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / (rect.height / 2)) * -4;
      const tiltY = (x / (rect.width / 2)) * 4;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // =========================================================================
  // 6. Smooth Navbar Scroll Appearance & Mobile Toggle
  // =========================================================================
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.style.boxShadow = '0 12px 36px rgba(0, 0, 0, 0.08)';
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      } else {
        navbar.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.03)';
        navbar.style.background = 'rgba(255, 255, 255, 0.85)';
      }
    });
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const navPillGroup = document.querySelector('.nav-pill-group');
  if (menuToggle && navPillGroup) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navPillGroup.classList.toggle('mobile-open');
    });

    document.addEventListener('click', (e) => {
      if (!navPillGroup.contains(e.target) && !menuToggle.contains(e.target)) {
        navPillGroup.classList.remove('mobile-open');
      }
    });
  }

  // =========================================================================
  // 7. FAQ Accordion Toggle Interaction (Shared & Contact)
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        const parentAccordion = item.closest('.faq-accordion') || document;
        const siblingItems = parentAccordion.querySelectorAll('.faq-item');
        siblingItems.forEach(otherItem => otherItem.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // =========================================================================
  // 8. Blog Page Features (Filter Tabs, Search, Newsletter)
  // =========================================================================
  const catTabs = document.querySelectorAll('.cat-tab');
  const blogCards = document.querySelectorAll('.blog-card');

  if (catTabs.length > 0 && blogCards.length > 0) {
    catTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        catTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const selectedCat = tab.getAttribute('data-cat');

        blogCards.forEach(card => {
          const cardCat = card.getAttribute('data-cat');
          if (selectedCat === 'all' || cardCat === selectedCat) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 30);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  const searchInput = document.getElementById('blog-search-input');
  const searchBtn = document.getElementById('blog-search-btn');

  if (searchInput && blogCards.length > 0) {
    const performSearch = () => {
      const query = searchInput.value.toLowerCase().trim();
      const categoriesSection = document.getElementById('categories');

      if (query !== '' && categoriesSection) {
        categoriesSection.scrollIntoView({ behavior: 'smooth' });
      }

      blogCards.forEach(card => {
        const title = card.querySelector('.blog-card-title')?.textContent.toLowerCase() || '';
        const excerpt = card.querySelector('.blog-card-excerpt')?.textContent.toLowerCase() || '';
        const cat = card.querySelector('.blog-card-category')?.textContent.toLowerCase() || '';

        if (query === '' || title.includes(query) || excerpt.includes(query) || cat.includes(query)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    };

    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
    if (searchBtn) searchBtn.addEventListener('click', performSearch);
  }

  // Newsletter Form
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');

      if (submitBtn) {
        const oldText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        setTimeout(() => {
          submitBtn.textContent = 'Subscribed!';
          submitBtn.style.background = '#10b981';
          if (input) input.value = '';
          setTimeout(() => {
            submitBtn.textContent = oldText;
            submitBtn.style.background = '';
          }, 3000);
        }, 600);
      }
    });
  }

  // =========================================================================
  // 9. Contact Page Form Handling
  // =========================================================================
  const contactForm = document.getElementById('main-contact-form');
  const contactSubmitBtn = document.getElementById('submit-btn');
  const contactSubmitText = document.getElementById('submit-btn-text');
  const contactSuccessMsg = document.getElementById('contact-success-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (contactSubmitBtn) {
        contactSubmitBtn.disabled = true;
        if (contactSubmitText) contactSubmitText.textContent = 'Transmitting...';
      }

      setTimeout(() => {
        contactForm.reset();
        if (contactSubmitBtn) {
          contactSubmitBtn.disabled = false;
          if (contactSubmitText) contactSubmitText.textContent = 'Send Message';
        }
        if (contactSuccessMsg) {
          contactSuccessMsg.style.display = 'block';
          contactSuccessMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => {
            contactSuccessMsg.style.display = 'none';
          }, 6000);
        }
      }, 900);
    });
  }

  // =========================================================================
  // 10. Authentication Handling (Login & Signup)
  // =========================================================================
  // Password Visibility Toggle
  const pwdToggles = document.querySelectorAll('.auth-toggle-pwd');
  pwdToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const inputWrap = toggle.closest('.auth-input-wrap');
      const input = inputWrap ? inputWrap.querySelector('input') : null;
      if (!input) return;

      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      toggle.innerHTML = isPassword 
        ? `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
        : `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    });
  });

  // Password Strength Meter (Signup page)
  const signupPwdInput = document.getElementById('signup-password');
  const strengthFill = document.querySelector('.pwd-strength-fill');
  const strengthLabel = document.querySelector('.pwd-strength-label');

  if (signupPwdInput && strengthFill && strengthLabel) {
    signupPwdInput.addEventListener('input', () => {
      const val = signupPwdInput.value;
      let score = 0;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      if (val.length === 0) {
        strengthFill.style.width = '0%';
        strengthFill.style.background = '#e2e8f0';
        strengthLabel.textContent = 'Password strength';
        strengthLabel.style.color = '#64748b';
      } else if (score <= 1) {
        strengthFill.style.width = '25%';
        strengthFill.style.background = '#ef4444';
        strengthLabel.textContent = 'Weak';
        strengthLabel.style.color = '#ef4444';
      } else if (score === 2) {
        strengthFill.style.width = '50%';
        strengthFill.style.background = '#f59e0b';
        strengthLabel.textContent = 'Medium';
        strengthLabel.style.color = '#f59e0b';
      } else if (score === 3) {
        strengthFill.style.width = '75%';
        strengthFill.style.background = '#3b82f6';
        strengthLabel.textContent = 'Strong';
        strengthLabel.style.color = '#3b82f6';
      } else {
        strengthFill.style.width = '100%';
        strengthFill.style.background = '#10b981';
        strengthLabel.textContent = 'Very strong';
        strengthLabel.style.color = '#10b981';
      }
    });
  }

  // Login Form Submission — validates inputs then redirects to correct dashboard
  const loginForm = document.getElementById('login-form');
  const loginSubmitBtn = document.getElementById('login-submit-btn');
  const loginFeedback = document.getElementById('login-feedback');
  const loginPortal = document.getElementById('login-portal');
  const loginEmailInput = document.getElementById('login-email');
  const loginPasswordInput = document.getElementById('login-password');

  function showLoginError(msg) {
    if (loginFeedback) {
      loginFeedback.className = 'auth-feedback-msg error';
      loginFeedback.style.display = 'block';
      loginFeedback.textContent = msg;
    }
    if (loginSubmitBtn) {
      loginSubmitBtn.disabled = false;
      loginSubmitBtn.innerHTML = '<span>Log In to Console</span><span>&#9658;</span>';
    }
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Hide any previous feedback
      if (loginFeedback) { loginFeedback.style.display = 'none'; loginFeedback.textContent = ''; }

      const email = loginEmailInput ? loginEmailInput.value.trim() : '';
      const password = loginPasswordInput ? loginPasswordInput.value : '';
      const selectedPortal = loginPortal ? loginPortal.value : 'user';

      // --- JS Validation ---
      if (!email) {
        showLoginError('Please enter your User ID / Work Email.');
        if (loginEmailInput) loginEmailInput.focus();
        return;
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showLoginError('Please enter a valid email address (e.g. name@company.com).');
        if (loginEmailInput) loginEmailInput.focus();
        return;
      }
      if (!password) {
        showLoginError('Please enter your password.');
        if (loginPasswordInput) loginPasswordInput.focus();
        return;
      }
      if (password.length < 6) {
        showLoginError('Password must be at least 6 characters.');
        if (loginPasswordInput) loginPasswordInput.focus();
        return;
      }

      // --- Show loading state ---
      if (loginSubmitBtn) {
        loginSubmitBtn.disabled = true;
        loginSubmitBtn.innerHTML = '<span>Verifying Credentials...</span>';
      }

      // --- Determine redirect target from dropdown ---
      const targetUrl = selectedPortal === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
      const portalLabel = selectedPortal === 'admin' ? 'Admin Dashboard' : 'User Dashboard';

      // --- Derive display name from email (part before @) ---
      const rawName = email.split('@')[0];
      // Capitalize each word separated by dots or underscores
      const displayName = rawName
        .replace(/[._]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());

      // --- Save user session info for dashboard to consume ---
      sessionStorage.setItem('stackly_user_name', displayName);
      sessionStorage.setItem('stackly_user_email', email);
      sessionStorage.setItem('stackly_user_role', selectedPortal);

      setTimeout(() => {
        if (loginFeedback) {
          loginFeedback.className = 'auth-feedback-msg success';
          loginFeedback.style.display = 'block';
          loginFeedback.textContent = `\u2713 Authentication successful! Redirecting to ${portalLabel}...`;
        }
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 1000);
      }, 800);
    });
  }

  // Signup Form Submission
  const signupForm = document.getElementById('signup-form');
  const signupSubmitBtn = document.getElementById('signup-submit-btn');
  const signupFeedback = document.getElementById('signup-feedback');

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (signupSubmitBtn) {
        signupSubmitBtn.disabled = true;
        signupSubmitBtn.innerHTML = '<span>Provisioning Sandbox VPC...</span>';
      }

      setTimeout(() => {
        if (signupFeedback) {
          signupFeedback.className = 'auth-feedback-msg success';
          signupFeedback.style.display = 'block';
          signupFeedback.textContent = 'Account created successfully! Welcome to STACKLY AI.';
        }
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      }, 1000);
    });
  }

  // =========================================================================
  // Go Back Button — Returns user to exact previous page using sessionStorage
  // =========================================================================
  const goBackBtns = document.querySelectorAll('#goBackBtn, .btn-goback');
  const AUTH_PAGES_CHECK = ['login.html', 'signup.html'];
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const isOnAuthPage = AUTH_PAGES_CHECK.some(p => currentPage.includes(p));

  if (isOnAuthPage && goBackBtns.length > 0) {
    // Determine where to go back to
    const savedReturnUrl = sessionStorage.getItem('stackly_return_url');
    let returnUrl = 'index.html'; // Safe fallback

    if (savedReturnUrl) {
      // Make sure the saved URL isn't itself an auth page (prevent loops)
      const savedPage = savedReturnUrl.split('/').pop().split('?')[0];
      const savedIsAuth = AUTH_PAGES_CHECK.some(p => savedPage.includes(p));
      if (!savedIsAuth) {
        returnUrl = savedReturnUrl;
      }
    } else if (document.referrer) {
      // Fallback: use browser referrer if available and not an auth page
      const refPage = document.referrer.split('/').pop().split('?')[0];
      const refIsAuth = AUTH_PAGES_CHECK.some(p => refPage.includes(p));
      if (!refIsAuth) {
        returnUrl = document.referrer;
      }
    }

    // Update all Go Back button hrefs so they point to the correct return destination
    goBackBtns.forEach(btn => {
      btn.setAttribute('href', returnUrl);
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Clear the stored URL so a fresh navigation after returning works correctly
        sessionStorage.removeItem('stackly_return_url');
        window.location.href = returnUrl;
      });
    });
  }

  // =========================================================================
  // 11. Dashboard Interactive Features (Admin & User)
  // =========================================================================

  // --- Profile Hydration from Login Session ---
  // Reads user info saved by the login form and populates all profile elements
  const sessionName  = sessionStorage.getItem('stackly_user_name');
  const sessionEmail = sessionStorage.getItem('stackly_user_email');
  const sessionRole  = sessionStorage.getItem('stackly_user_role');

  if (sessionName) {
    // Derive short name (first name only) for compact header pill
    const shortName = sessionName.split(' ')[0];

    // Generate a DiceBear avatar URL from the user's name (consistent, unique avatar)
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sessionName)}&backgroundColor=4f46e5,7c3aed,e11d48&fontFamily=Arial&fontSize=40&fontWeight=700`;

    // Role label for sidebar email line
    const roleLabel = sessionRole === 'admin' ? 'SuperAdmin' : 'Pro';

    // --- Admin Dashboard elements ---
    const adminSidebarUsername = document.getElementById('admin-sidebar-username');
    const adminSidebarEmail    = document.getElementById('admin-sidebar-email');
    const adminSidebarAvatar   = document.getElementById('admin-sidebar-avatar');
    const adminHeaderUsername  = document.getElementById('admin-header-username');
    const adminHeaderAvatar    = document.getElementById('admin-header-avatar');

    if (adminSidebarUsername) adminSidebarUsername.textContent = sessionName;
    if (adminSidebarEmail && sessionEmail) adminSidebarEmail.textContent = `${sessionEmail} \u00b7 ${roleLabel}`;
    if (adminSidebarAvatar) { adminSidebarAvatar.src = avatarUrl; adminSidebarAvatar.alt = sessionName; }
    if (adminHeaderUsername) adminHeaderUsername.textContent = shortName;
    if (adminHeaderAvatar)   { adminHeaderAvatar.src = avatarUrl; adminHeaderAvatar.alt = sessionName; }

    // --- User Dashboard elements ---
    const userSidebarUsername = document.getElementById('user-sidebar-username');
    const userSidebarEmail    = document.getElementById('user-sidebar-email');
    const userSidebarAvatar   = document.getElementById('user-sidebar-avatar');
    const userHeaderUsername  = document.getElementById('user-header-username');
    const userHeaderAvatar    = document.getElementById('user-header-avatar');

    if (userSidebarUsername) userSidebarUsername.textContent = sessionName;
    if (userSidebarEmail && sessionEmail) userSidebarEmail.textContent = `${sessionEmail} \u00b7 ${roleLabel}`;
    if (userSidebarAvatar) { userSidebarAvatar.src = avatarUrl; userSidebarAvatar.alt = sessionName; }
    if (userHeaderUsername) userHeaderUsername.textContent = shortName;
    if (userHeaderAvatar)   { userHeaderAvatar.src = avatarUrl; userHeaderAvatar.alt = sessionName; }
  }

  // Mobile Sidebar Toggle & Off-canvas Drawer
  const sidebarToggleBtn = document.querySelector('.dash-toggle-btn');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const sidebarCloseBtn = document.querySelector('.sidebar-close-btn');
  const sidebarBackdrop = document.querySelector('.sidebar-backdrop');

  if (sidebarToggleBtn && sidebar) {
    sidebarToggleBtn.addEventListener('click', () => {
      sidebar.classList.add('sidebar-open');
      if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    });

    const closeSidebar = () => {
      sidebar.classList.remove('sidebar-open');
      if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    };

    if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  // Copy to Clipboard (API Keys & Endpoints)
  const copyBtns = document.querySelectorAll('.btn-copy-code');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetText = btn.getAttribute('data-copy') || '';
      if (navigator.clipboard && targetText) {
        navigator.clipboard.writeText(targetText);
      }
      const originalText = btn.innerHTML;
      btn.innerHTML = '&#10003; Copied!';
      btn.style.color = '#10b981';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.color = '';
      }, 2000);
    });
  });

  // Playground Test Inference Runner
  const runInferenceBtn = document.getElementById('run-inference-btn');
  const playgroundOutput = document.getElementById('playground-output');
  if (runInferenceBtn && playgroundOutput) {
    runInferenceBtn.addEventListener('click', () => {
      runInferenceBtn.disabled = true;
      runInferenceBtn.textContent = 'Running Neural Inference...';
      playgroundOutput.textContent = 'Streaming tensor response from cluster...';

      setTimeout(() => {
        runInferenceBtn.disabled = false;
        runInferenceBtn.textContent = 'Run Test Inference';
        const simulatedResponse = {
          status: 200,
          latency: "14.2ms",
          model: "stackly-neuro-kernel-v3.4",
          tokens_used: 142,
          output: "Predictions generated successfully with 99.82% confidence threshold. Automated guardrails verified zero anomalies."
        };
        playgroundOutput.textContent = JSON.stringify(simulatedResponse, null, 2);
      }, 700);
    });
  }

  // Model Status Switch Toggles
  const modelToggles = document.querySelectorAll('.model-toggle-input');
  modelToggles.forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const parentCard = toggle.closest('.model-card');
      const statusPill = parentCard ? parentCard.querySelector('.model-status-pill') : null;
      if (statusPill) {
        if (toggle.checked) {
          statusPill.className = 'status-pill success model-status-pill';
          statusPill.textContent = 'Active';
        } else {
          statusPill.className = 'status-pill warning model-status-pill';
          statusPill.textContent = 'Paused';
        }
      }
    });
  });
});

// Global Helper fallback for inline onclicks
function handleContactSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
}

