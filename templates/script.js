/**
 * Wedding Invitation - Client-side JavaScript
 * Enhanced with 2025 Trends: Animations, Gallery, Music, Timeline
 */

(function() {
  'use strict';

  // Configuration - will be replaced during build
  const CONFIG = {
    RSVP_SCRIPT_URL: '{{RSVP_SCRIPT_URL}}',
    WEDDING_SLUG: '{{WEDDING_SLUG}}'
  };

  // ============================================
  // Scroll-Triggered Animations (Trend #1)
  // ============================================

  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      '.animate-fade-up, .animate-fade-left, .animate-fade-right, .animate-scale, .animate-stagger'
    );

    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after animation to save resources
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  }

  // ============================================
  // Photo Gallery with Lightbox (Trend #2)
  // ============================================

  function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');

    if (!galleryItems.length || !lightbox) return;

    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => ({
      src: item.dataset.fullSrc || item.querySelector('img').src,
      caption: item.dataset.caption || ''
    }));

    let previousFocus = null;

    function openLightbox(index) {
      previousFocus = document.activeElement;
      currentIndex = index;
      updateLightbox();
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-modal', 'true');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.removeAttribute('aria-modal');
      document.body.style.overflow = '';
      if (previousFocus) previousFocus.focus();
    }

    function updateLightbox() {
      const image = images[currentIndex];
      lightboxImage.src = image.src;
      lightboxImage.alt = image.caption;
      lightboxCaption.textContent = image.caption;
      lightboxCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightbox();
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightbox();
    }

    // Event listeners
    galleryItems.forEach((item, index) => {
      if (!item.getAttribute('tabindex')) item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('click', () => openLightbox(index));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(index); }
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });

    // Touch swipe support
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextImage();
        else prevImage();
      }
    }, { passive: true });
  }

  // ============================================
  // Background Music Player (Trend #3)
  // ============================================

  function initMusicPlayer() {
    const musicToggle = document.getElementById('music-toggle');
    const audio = document.getElementById('background-music');

    if (!musicToggle || !audio) return;

    const playIcon = musicToggle.querySelector('.music-play');
    const pauseIcon = musicToggle.querySelector('.music-pause');
    let isPlaying = false;

    let isToggling = false;

    function toggleMusic() {
      if (isToggling) return;

      if (isPlaying) {
        audio.pause();
        playIcon.style.display = 'inline';
        pauseIcon.style.display = 'none';
        musicToggle.classList.remove('playing');
        musicToggle.setAttribute('aria-label', 'Пусти музику');
        isPlaying = false;
      } else {
        isToggling = true;
        audio.play().then(function() {
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'inline';
          musicToggle.classList.add('playing');
          musicToggle.setAttribute('aria-label', 'Паузирај музику');
          isPlaying = true;
          isToggling = false;
        }).catch(function(err) {
          console.log('Audio playback failed:', err);
          isToggling = false;
          musicToggle.setAttribute('aria-label', 'Музика није доступна');
          musicToggle.classList.add('music-error');
          setTimeout(function() { musicToggle.classList.remove('music-error'); }, 2000);
        });
      }
    }

    musicToggle.addEventListener('click', toggleMusic);

    // Show music player with subtle animation after page load
    setTimeout(() => {
      document.getElementById('music-player').classList.add('visible');
    }, 2000);
  }

  // ============================================
  // Love Story Timeline Animations (Trend #4)
  // ============================================

  function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    });

    timelineItems.forEach(item => observer.observe(item));
  }

  // ============================================
  // Countdown Timer
  // ============================================

  function initCountdown() {
    const countdownElement = document.querySelector('.countdown-timer');
    if (!countdownElement) return;

    const weddingDate = new Date(countdownElement.dataset.weddingDate);
    if (isNaN(weddingDate.getTime())) return;

    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const lastValues = {};
    function animateNumber(element, newValue) {
      var key = element.id;
      if (lastValues[key] !== newValue) {
        lastValues[key] = newValue;
        element.classList.add('counter-animate');
        element.textContent = newValue;
        setTimeout(function() { element.classList.remove('counter-animate'); }, 500);
      }
    }

    var countdownInterval = null;

    function updateCountdown() {
      var now = new Date();
      var diff = weddingDate - now;

      if (diff <= 0) {
        animateNumber(daysEl, '00');
        animateNumber(hoursEl, '00');
        animateNumber(minutesEl, '00');
        animateNumber(secondsEl, '00');
        if (countdownInterval) {
          clearInterval(countdownInterval);
          countdownInterval = null;
        }
        return;
      }

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((diff % (1000 * 60)) / 1000);

      animateNumber(daysEl, String(days).padStart(2, '0'));
      animateNumber(hoursEl, String(hours).padStart(2, '0'));
      animateNumber(minutesEl, String(minutes).padStart(2, '0'));
      animateNumber(secondsEl, String(seconds).padStart(2, '0'));
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);

    // Pause when tab hidden, resume when visible
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
      } else {
        if (!countdownInterval) { updateCountdown(); countdownInterval = setInterval(updateCountdown, 1000); }
      }
    });
  }

  // ============================================
  // Confetti Celebration Effect
  // ============================================

  function createConfetti() {
    var container = document.getElementById('confetti-container');
    if (!container) return;

    // Respect reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    container.innerHTML = '';
    var colors = ['#D4AF37', '#FFD700', '#FF69B4', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    var confettiCount = 50;
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < confettiCount; i++) {
      var confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.cssText = 'left:' + (Math.random() * 100) + '%;background-color:' + colors[Math.floor(Math.random() * colors.length)] + ';animation-delay:' + (Math.random() * 3) + 's;animation-duration:' + (Math.random() * 2 + 2) + 's';
      fragment.appendChild(confetti);
    }
    container.appendChild(fragment);

    setTimeout(function() { container.innerHTML = ''; }, 5000);
  }

  // ============================================
  // RSVP Form
  // ============================================

  function initRSVPForm() {
    const form = document.getElementById('rsvp-form');
    if (!form) return;

    const guestsCountGroup = document.getElementById('guests-count-group');
    const mealGroup = document.getElementById('meal-group');
    const attendingRadios = document.querySelectorAll('input[name="attending"]');

    function toggleConditionalFields() {
      const isAttending = document.querySelector('input[name="attending"]:checked');
      const attending = isAttending && isAttending.value === 'yes';

      if (guestsCountGroup) {
        guestsCountGroup.style.display = attending ? 'block' : 'none';
      }
      if (mealGroup) {
        mealGroup.style.display = attending ? 'block' : 'none';
      }
    }

    attendingRadios.forEach(radio => {
      radio.addEventListener('change', toggleConditionalFields);
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const submitBtn = document.getElementById('submit-btn');
      const buttonText = submitBtn.querySelector('.button-text');
      const buttonLoading = submitBtn.querySelector('.button-loading');
      const formMessage = document.getElementById('form-message');

      // Show loading state
      buttonText.style.display = 'none';
      buttonLoading.style.display = 'inline-flex';
      submitBtn.disabled = true;
      submitBtn.classList.remove('pulse');
      formMessage.textContent = '';
      formMessage.className = 'form-message';

      const emailInput = document.getElementById('guest-email');
      const phoneInput = document.getElementById('guest-phone');
      const email = emailInput.value.trim();
      const phone = phoneInput.value.trim();

      // Validate email if provided
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formMessage.textContent = 'Молимо унесите исправну е-маил адресу.';
        formMessage.className = 'form-message error';
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
        submitBtn.disabled = false;
        emailInput.focus();
        return;
      }

      // Validate phone if provided (allow digits, spaces, +, -, (, ))
      if (phone && !/^[+\d\s()\-]{6,20}$/.test(phone)) {
        formMessage.textContent = 'Молимо унесите исправан број телефона.';
        formMessage.className = 'form-message error';
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
        submitBtn.disabled = false;
        phoneInput.focus();
        return;
      }

      const formData = {
        slug: CONFIG.WEDDING_SLUG,
        name: document.getElementById('guest-name').value.trim(),
        email: email,
        phone: phone,
        attending: document.querySelector('input[name="attending"]:checked').value,
        guests_count: document.getElementById('guests-count') ? document.getElementById('guests-count').value : '1',
        meal_preference: document.getElementById('meal-preference') ? document.getElementById('meal-preference').value : '',
        message: document.getElementById('message').value.trim(),
        submitted_at: new Date().toISOString()
      };

      // Demo mode
      if (CONFIG.RSVP_SCRIPT_URL.includes('{{RSVP_SCRIPT_URL}}') || CONFIG.RSVP_SCRIPT_URL.includes('YOUR_') || CONFIG.RSVP_SCRIPT_URL === '') {
        console.log('RSVP submission (demo mode):', formData);
        setTimeout(() => {
          buttonText.style.display = 'inline';
          buttonLoading.style.display = 'none';
          submitBtn.disabled = false;

          if (formData.attending === 'yes') {
            formMessage.textContent = '\uD83C\uDF89 Хвала! Радујемо се вашем присуству!';
            createConfetti();
          } else {
            formMessage.textContent = 'Хвала на обавештењу. Жао нам је што нећете моћи да присуствујете.';
          }
          formMessage.className = 'form-message success';
          form.reset();
          toggleConditionalFields();
        }, 1500);
        return;
      }

      // Google Apps Script requires no-cors mode to avoid CORS preflight failures
      fetch(CONFIG.RSVP_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(formData)
      })
      .then(() => {
        // Response is opaque with no-cors; show success optimistically
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
        submitBtn.disabled = false;

        if (formData.attending === 'yes') {
          formMessage.textContent = '\uD83C\uDF89 Хвала! Ваша потврда доласка је забележена. Радујемо се вашем присуству!';
          createConfetti();
        } else {
          formMessage.textContent = 'Хвала на обавештењу. Жао нам је што нећете моћи да присуствујете.';
        }
        formMessage.className = 'form-message success';
        form.reset();
        toggleConditionalFields();
      })
      .catch(error => {
        console.error('Error submitting RSVP:', error);
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.classList.add('pulse');
        formMessage.textContent = 'Дошло је до грешке. Молимо покушајте поново.';
        formMessage.className = 'form-message error';
      });
    });
  }

  // ============================================
  // Universal Swipe Navigation Helper
  // ============================================

  function initSwipeNavigation() {
    // Detect if page has sections that can be swiped
    const sections = document.querySelectorAll('section, .page, .gallery-room, .cinema-section, .magazine-page');
    if (sections.length < 2) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const threshold = 50; // Minimum swipe distance

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;

      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      // Check if horizontal swipe is stronger than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
        // Horizontal swipe detected
        const horizontalContainer = document.querySelector('.gallery-container, [data-swipe-horizontal]');
        if (horizontalContainer) {
          if (diffX > 0) {
            // Swipe left - scroll right
            horizontalContainer.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
          } else {
            // Swipe right - scroll left
            horizontalContainer.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
          }
        }
      }
    }, { passive: true });

    // Add visual swipe hint for horizontal scrolling layouts
    const horizontalContainer = document.querySelector('.gallery-container');
    if (horizontalContainer && window.innerWidth <= 768) {
      const hint = document.createElement('div');
      hint.className = 'swipe-hint';
      hint.innerHTML = '<span>👆 Превуците да бисте видели више</span>';
      hint.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);color:white;padding:8px 16px;border-radius:20px;font-size:12px;z-index:1000;opacity:0;transition:opacity 0.3s;';
      document.body.appendChild(hint);

      setTimeout(() => { hint.style.opacity = '1'; }, 1000);
      setTimeout(() => { hint.style.opacity = '0'; }, 4000);
      setTimeout(() => { hint.remove(); }, 4500);
    }
  }

  // ============================================
  // Section Navigation with Keyboard & Swipe
  // ============================================

  function initSectionNavigation() {
    // Only enable section navigation for full-page layouts (cinema, magazine)
    const sections = document.querySelectorAll('.cinema-section, .magazine-page');
    if (sections.length < 2) return;

    let currentSection = 0;

    function goToSection(index) {
      if (index >= 0 && index < sections.length) {
        currentSection = index;
        sections[currentSection].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Keyboard navigation — only PageUp/PageDown to avoid hijacking normal scrolling
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT' || e.target.isContentEditable) return;

      if (e.key === 'PageDown') {
        e.preventDefault();
        goToSection(currentSection + 1);
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        goToSection(currentSection - 1);
      }
    });

    // Update current section on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          currentSection = Array.from(sections).indexOf(entry.target);
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
  }

  // ============================================
  // Smooth Scrolling & Scroll Indicator
  // ============================================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initScrollIndicator() {
    var scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    scrollIndicator.addEventListener('click', function() {
      var firstSection = document.querySelector('section');
      if (firstSection) {
        firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    function onScroll() {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
        setTimeout(function() { scrollIndicator.style.display = 'none'; }, 300);
        window.removeEventListener('scroll', onScroll);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ============================================
  // Initialize Everything
  // ============================================

  document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initCountdown();
    initRSVPForm();
    initSmoothScroll();
    initScrollIndicator();
    initGallery();
    initMusicPlayer();
    initTimeline();
    initSwipeNavigation();
    initSectionNavigation();
  });

})();
