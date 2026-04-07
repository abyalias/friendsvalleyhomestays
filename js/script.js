/* ============================================================
   FRIENDS VALLEY HOME STAY — Main Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar: scroll behaviour ── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Navbar: active link highlight ── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const observerOpts = { rootMargin: '-40% 0px -55% 0px' };
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const match = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }, observerOpts);
  sections.forEach(s => sectionObserver.observe(s));

  /* ── Navbar: mobile toggle ── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ── Hero Slider ── */
  const slides    = document.querySelectorAll('.hero-slide');
  const dots      = document.querySelectorAll('.hero-dots .dot');
  let   current   = 0;
  let   sliderTimer;

  const goToSlide = idx => {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  };

  const startSlider = () => {
    sliderTimer = setInterval(() => goToSlide(current + 1), 3000);
  };

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(sliderTimer);
      goToSlide(+dot.dataset.idx);
      startSlider();
    });
  });

  startSlider();

  /* ── Gallery Lightbox ── */
  const galleryItems  = document.querySelectorAll('.gallery-item');
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');
  const lightboxCtr   = document.getElementById('lightboxCounter');
  const images = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    alt: item.querySelector('img').alt,
  }));
  let lightboxIdx = 0;

  const openLightbox = idx => {
    lightboxIdx = idx;
    lightboxImg.src = images[idx].src;
    lightboxImg.alt = images[idx].alt;
    lightboxCtr.textContent = `${idx + 1} / ${images.length}`;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  const prevLightbox = () => openLightbox((lightboxIdx - 1 + images.length) % images.length);
  const nextLightbox = () => openLightbox((lightboxIdx + 1) % images.length);

  galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevLightbox);
  lightboxNext.addEventListener('click', nextLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prevLightbox();
    if (e.key === 'ArrowRight')  nextLightbox();
  });

  /* ── Contact FAB Popup ── */
  const fab          = document.getElementById('contactFab');
  const popup        = document.getElementById('contactPopup');
  const popupClose   = document.getElementById('contactPopupClose');

  const togglePopup = open => {
    fab.classList.toggle('open', open);
    popup.classList.toggle('open', open);
  };

  fab.addEventListener('click', () => togglePopup(!popup.classList.contains('open')));
  popupClose.addEventListener('click', () => togglePopup(false));

  // Close popup when clicking outside
  document.addEventListener('click', e => {
    const wrapper = document.getElementById('contactFabWrapper');
    if (!wrapper.contains(e.target)) togglePopup(false);
  });

  /* ── Contact Form: WhatsApp submit ── */
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name    = contactForm.name.value.trim();
    const phone   = contactForm.phone.value.trim();
    const message = contactForm.message.value.trim();
    const text    = `Hi Friends Valley Home Stay!%0AMy name is ${encodeURIComponent(name)}.${phone ? '%0APhone: ' + encodeURIComponent(phone) : ''}%0A%0A${encodeURIComponent(message)}`;
    window.open(`https://wa.me/919895020913?text=${text}`, '_blank');
    contactForm.innerHTML = '<div class="contact-form-success"><i class="fas fa-check-circle" style="font-size:2rem;display:block;margin-bottom:.5rem;"></i>Message sent via WhatsApp!<br/>We\'ll get back to you soon.</div>';
  });

  /* ── Scroll-reveal animation ── */
  const revealEls = document.querySelectorAll(
    '.attraction-card, .review-card, .booking-card, .gallery-item, .stat-item, .feature'
  );
  const revealStyle = document.createElement('style');
  revealStyle.textContent = `
    .reveal-ready {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity .55s ease, transform .55s ease;
    }
    .reveal-ready.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(revealStyle);

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    // If already in or above the viewport on load, reveal immediately
    if (rect.top < window.innerHeight + 100) {
      el.classList.add('revealed');
    } else {
      el.classList.add('reveal-ready');
      el.style.transitionDelay = (i % 6) * 60 + 'ms';
      revealObserver.observe(el);
    }
  });

});
