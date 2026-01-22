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

    function openLightbox(index) {
      currentIndex = index;
      updateLightbox();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
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
      item.addEventListener('click', () => openLightbox(index));
      item.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') openLightbox(index);
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
    });

    lightbox.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextImage();
        else prevImage();
      }
    });
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

    function toggleMusic() {
      if (isPlaying) {
        audio.pause();
        playIcon.style.display = 'inline';
        pauseIcon.style.display = 'none';
        musicToggle.classList.remove('playing');
      } else {
        audio.play().then(() => {
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'inline';
          musicToggle.classList.add('playing');
        }).catch(err => {
          console.log('Audio playback failed:', err);
        });
      }
      isPlaying = !isPlaying;
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
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    function animateNumber(element, newValue) {
      const currentValue = element.textContent;
      if (currentValue !== newValue) {
        element.classList.add('counter-animate');
        element.textContent = newValue;
        setTimeout(() => element.classList.remove('counter-animate'), 500);
      }
    }

    function updateCountdown() {
      const now = new Date();
      const diff = weddingDate - now;

      if (diff <= 0) {
        animateNumber(daysEl, '0');
        animateNumber(hoursEl, '0');
        animateNumber(minutesEl, '0');
        animateNumber(secondsEl, '0');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      animateNumber(daysEl, String(days));
      animateNumber(hoursEl, String(hours));
      animateNumber(minutesEl, String(minutes));
      animateNumber(secondsEl, String(seconds));
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ============================================
  // Confetti Celebration Effect
  // ============================================

  function createConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;

    const colors = ['#D4AF37', '#FFD700', '#FF69B4', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      container.appendChild(confetti);
    }

    // Remove confetti after animation
    setTimeout(() => {
      container.innerHTML = '';
    }, 5000);
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

      const formData = {
        slug: CONFIG.WEDDING_SLUG,
        name: document.getElementById('guest-name').value.trim(),
        email: document.getElementById('guest-email').value.trim(),
        phone: document.getElementById('guest-phone').value.trim(),
        attending: document.querySelector('input[name="attending"]:checked').value,
        guests_count: document.getElementById('guests-count') ? document.getElementById('guests-count').value : '1',
        meal_preference: document.getElementById('meal-preference') ? document.getElementById('meal-preference').value : '',
        message: document.getElementById('message').value.trim(),
        submitted_at: new Date().toISOString()
      };

      // Demo mode
      if (CONFIG.RSVP_SCRIPT_URL.includes('{{') || CONFIG.RSVP_SCRIPT_URL.includes('YOUR_')) {
        console.log('RSVP submission (demo mode):', formData);
        setTimeout(() => {
          buttonText.style.display = 'inline';
          buttonLoading.style.display = 'none';
          submitBtn.disabled = false;

          if (formData.attending === 'yes') {
            formMessage.innerHTML = '🎉 Хвала! Радујемо се вашем присуству!';
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

      fetch(CONFIG.RSVP_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(() => {
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
        submitBtn.disabled = false;

        if (formData.attending === 'yes') {
          formMessage.innerHTML = '🎉 Хвала! Ваша потврда доласка је забележена. Радујемо се вашем присуству!';
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
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    scrollIndicator.addEventListener('click', () => {
      const firstSection = document.querySelector('section');
      if (firstSection) {
        firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    let hasScrolled = false;
    window.addEventListener('scroll', () => {
      if (!hasScrolled && window.scrollY > 100) {
        hasScrolled = true;
        scrollIndicator.style.opacity = '0';
        setTimeout(() => scrollIndicator.style.display = 'none', 300);
      }
    });
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
  });

})();
