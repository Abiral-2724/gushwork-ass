/**
 * script.js — Gushwork landing page interactions
 *
 * Features:
 *  1. Sticky header — slides in after scrolling past the first fold,
 *                     slides out when scrolling back up.
 *  2. Image carousel — drag/swipe, prev/next buttons, dot navigation.
 *  3. Carousel zoom   — hover over a card → overlay with zoomed info panel.
 *  4. Mobile menu     — hamburger toggle.
 *  5. Scroll reveal   — fade-in elements as they enter the viewport.
 */

(function () {
    'use strict';
  
    /* ─────────────────────────────────────────────────────────────
       1. STICKY HEADER
       Shows when user scrolls below the hero (first viewport height).
       Hides when scrolling back to the top.
    ───────────────────────────────────────────────────────────── */
    const stickyHeader  = document.getElementById('stickyHeader');
    const mainNav       = document.getElementById('mainNav');
    let   lastScrollY   = 0;
    let   ticking       = false;
  
    /**
     * Determine whether to show or hide the sticky header.
     * Threshold = height of the viewport (i.e. past the first fold).
     */
    function updateStickyHeader() {
      const currentY  = window.scrollY;
      const threshold = window.innerHeight * 0.85; // 85% of viewport
  
      if (currentY > threshold && currentY < lastScrollY) {
        // Scrolling UP and past the fold → show sticky header
        stickyHeader.classList.add('visible');
      } else if (currentY <= threshold || currentY > lastScrollY) {
        // Scrolling DOWN, or back near top → hide sticky header
        stickyHeader.classList.remove('visible');
      }
  
      lastScrollY = currentY;
      ticking     = false;
    }
  
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateStickyHeader);
        ticking = true;
      }
    }, { passive: true });
  
  
    /* ─────────────────────────────────────────────────────────────
       2. MOBILE MENU
    ───────────────────────────────────────────────────────────── */
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
  
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function () {
        const isOpen = mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen.toString());
        mobileMenu.setAttribute('aria-hidden', (!isOpen).toString());
      });
  
      // Close menu when a link inside is clicked
      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          mobileMenu.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          mobileMenu.setAttribute('aria-hidden', 'true');
        });
      });
    }
  
  
    /* ─────────────────────────────────────────────────────────────
       3. IMAGE CAROUSEL
       - Scroll snapping via CSS
       - Prev / Next buttons
       - Dot navigation
       - Mouse drag support
       - Touch swipe support
       - Active-dot reflects scroll position
    ───────────────────────────────────────────────────────────── */
    const carousel    = document.getElementById('carousel');
    const prevBtn     = document.getElementById('prevBtn');
    const nextBtn     = document.getElementById('nextBtn');
    const dotsWrapper = document.getElementById('carouselDots');
  
    if (carousel && prevBtn && nextBtn && dotsWrapper) {
      const cards     = Array.from(carousel.querySelectorAll('.carousel__card'));
      const cardCount = cards.length;
      let   currentIndex = 0;
  
      // ── Build dots ──────────────────────────────────────────
      cards.forEach(function (_, i) {
        const dot  = document.createElement('button');
        dot.className  = 'carousel__dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', function () { scrollToCard(i); });
        dotsWrapper.appendChild(dot);
      });
  
      const dots = dotsWrapper.querySelectorAll('.carousel__dot');
  
      // ── Scroll to a specific card index ────────────────────
      function scrollToCard(index) {
        index = Math.max(0, Math.min(index, cardCount - 1));
        currentIndex = index;
  
        const card   = cards[index];
        const offset = card.offsetLeft - carousel.offsetLeft;
        carousel.scrollTo({ left: offset, behavior: 'smooth' });
  
        updateDots();
        updateButtons();
      }
  
      // ── Update active dot ───────────────────────────────────
      function updateDots() {
        dots.forEach(function (d, i) {
          const isActive = (i === currentIndex);
          d.classList.toggle('active', isActive);
          d.setAttribute('aria-selected', isActive.toString());
        });
      }
  
      // ── Update button disabled states ───────────────────────
      function updateButtons() {
        prevBtn.disabled = (currentIndex === 0);
        nextBtn.disabled = (currentIndex === cardCount - 1);
      }
  
      // ── Button clicks ───────────────────────────────────────
      prevBtn.addEventListener('click', function () { scrollToCard(currentIndex - 1); });
      nextBtn.addEventListener('click', function () { scrollToCard(currentIndex + 1); });
  
      // ── Keyboard navigation inside carousel ────────────────
      carousel.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft')  scrollToCard(currentIndex - 1);
        if (e.key === 'ArrowRight') scrollToCard(currentIndex + 1);
      });
  
      // ── Sync dots with native scroll (touch / trackpad) ────
      let scrollTimer;
      carousel.addEventListener('scroll', function () {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function () {
          // Find which card is most visible
          let closestIndex = 0;
          let minDist      = Infinity;
  
          cards.forEach(function (card, i) {
            const cardLeft  = card.offsetLeft - carousel.offsetLeft;
            const dist      = Math.abs(carousel.scrollLeft - cardLeft);
            if (dist < minDist) {
              minDist      = dist;
              closestIndex = i;
            }
          });
  
          currentIndex = closestIndex;
          updateDots();
          updateButtons();
        }, 80);
      }, { passive: true });
  
      // ── Mouse drag support ──────────────────────────────────
      let isDragging   = false;
      let dragStartX   = 0;
      let scrollStartX = 0;
  
      carousel.addEventListener('mousedown', function (e) {
        isDragging   = true;
        dragStartX   = e.clientX;
        scrollStartX = carousel.scrollLeft;
        carousel.classList.add('dragging');
      });
  
      document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        const dx = e.clientX - dragStartX;
        carousel.scrollLeft = scrollStartX - dx;
      });
  
      document.addEventListener('mouseup', function () {
        if (!isDragging) return;
        isDragging = false;
        carousel.classList.remove('dragging');
      });
  
      // ── Auto-play (optional, subtle) ────────────────────────
      let autoPlayInterval = setInterval(function () {
        if (currentIndex < cardCount - 1) {
          scrollToCard(currentIndex + 1);
        } else {
          scrollToCard(0);
        }
      }, 4500);
  
      // Pause auto-play on user interaction
      function pauseAutoPlay() {
        clearInterval(autoPlayInterval);
      }
  
      carousel.addEventListener('mouseenter', pauseAutoPlay);
      carousel.addEventListener('touchstart', pauseAutoPlay, { passive: true });
      prevBtn.addEventListener('click', pauseAutoPlay);
      nextBtn.addEventListener('click', pauseAutoPlay);
      dotsWrapper.addEventListener('click', pauseAutoPlay);
  
      // Init
      updateDots();
      updateButtons();
    }
  
  
    /* ─────────────────────────────────────────────────────────────
       4. CAROUSEL ZOOM — Enhanced hover zoom effect
       Adds a floating large-preview panel to the right of hovered card.
    ───────────────────────────────────────────────────────────── */
    const carouselCards = document.querySelectorAll('.carousel__card');
  
    carouselCards.forEach(function (card) {
      const imgEl = card.querySelector('.carousel__img');
      if (!imgEl) return;
  
      // Create a floating zoom panel
      const zoomPanel = document.createElement('div');
      zoomPanel.className     = 'zoom-panel';
      zoomPanel.setAttribute('aria-hidden', 'true');
  
      const zoomImg = document.createElement('img');
      zoomImg.src   = imgEl.src;
      zoomImg.alt   = '';
  
      // Get tags from the inline zoom overlay
      const zoomInfo = card.querySelector('.zoom__info');
      const infoClone = zoomInfo ? zoomInfo.cloneNode(true) : null;
  
      zoomPanel.appendChild(zoomImg);
      if (infoClone) zoomPanel.appendChild(infoClone);
      document.body.appendChild(zoomPanel);
  
      // Apply styles
      Object.assign(zoomPanel.style, {
        position:     'fixed',
        width:        '200px',
        height:       '240px',
        borderRadius: '16px',
        overflow:     'hidden',
        boxShadow:    '0 24px 64px rgba(0,0,0,0.22)',
        border:       '3px solid #fff',
        pointerEvents:'none',
        opacity:      '0',
        transform:    'scale(0.88) translateY(8px)',
        transition:   'opacity 0.25s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)',
        zIndex:       '9999',
      });
  
      Object.assign(zoomImg.style, {
        width:      '100%',
        height:     '100%',
        objectFit:  'cover',
        display:    'block',
      });
  
      // Position and show on hover
      card.addEventListener('mouseenter', function (e) {
        positionZoomPanel(card, zoomPanel);
        zoomPanel.style.opacity   = '1';
        zoomPanel.style.transform = 'scale(1) translateY(0)';
      });
  
      card.addEventListener('mouseleave', function () {
        zoomPanel.style.opacity   = '0';
        zoomPanel.style.transform = 'scale(0.88) translateY(8px)';
      });
  
      // Update position on scroll (so it doesn't detach)
      carousel.addEventListener('scroll', function () {
        if (zoomPanel.style.opacity === '1') {
          positionZoomPanel(card, zoomPanel);
        }
      }, { passive: true });
    });
  
    /**
     * Position the floating zoom panel to the right of the card,
     * or to the left if not enough space on the right.
     */
    function positionZoomPanel(card, panel) {
      const rect      = card.getBoundingClientRect();
      const panelW    = 200;
      const panelH    = 240;
      const margin    = 12;
      const vpW       = window.innerWidth;
      const vpH       = window.innerHeight;
  
      let left, top;
  
      // Prefer right side
      if (rect.right + panelW + margin <= vpW) {
        left = rect.right + margin;
      } else {
        left = rect.left - panelW - margin;
      }
  
      // Vertically centred on card
      top = rect.top + (rect.height / 2) - (panelH / 2);
      top = Math.max(8, Math.min(top, vpH - panelH - 8));
  
      panel.style.left = left + 'px';
      panel.style.top  = top  + 'px';
    }
  
    // Clean up zoom panels when page is hidden (tab switch)
    document.addEventListener('visibilitychange', function () {
      document.querySelectorAll('.zoom-panel').forEach(function (p) {
        p.style.opacity = '0';
      });
    });
  
  
    /* ─────────────────────────────────────────────────────────────
       5. SCROLL REVEAL ANIMATIONS
       Adds .in-view to elements with .reveal when they enter viewport.
    ───────────────────────────────────────────────────────────── */
    const revealTargets = document.querySelectorAll(
      '.step-card, .pricing-card, .testimonial-card, ' +
      '.section-heading, .section-subtext, .section-label, ' +
      '.hero__badge, .hero__heading, .hero__subtext, .hero__actions, .hero__stats'
    );
  
    // Add reveal class programmatically
    revealTargets.forEach(function (el, i) {
      el.classList.add('reveal');
      // Stagger siblings
      const parent  = el.parentElement;
      const siblings = parent ? parent.querySelectorAll(':scope > .reveal') : [];
      const sibIndex = Array.from(siblings).indexOf(el);
      if (sibIndex > 0 && sibIndex <= 3) {
        el.classList.add('reveal--delay-' + sibIndex);
      }
    });
  
    // IntersectionObserver for reveals
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target); // only animate once
          }
        });
      }, {
        threshold:  0.12,
        rootMargin: '0px 0px -40px 0px',
      });
  
      revealTargets.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      // Fallback for older browsers
      revealTargets.forEach(function (el) {
        el.classList.add('in-view');
      });
    }
  
  
    /* ─────────────────────────────────────────────────────────────
       6. SMOOTH ANCHOR SCROLLING
       Offset scrolls by the navbar height so sections aren't
       hidden behind the fixed nav.
    ───────────────────────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
  
        const target = document.querySelector(targetId);
        if (!target) return;
  
        e.preventDefault();
  
        const navHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
          10
        ) || 72;
  
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
  
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      });
    });
  
  
    /* ─────────────────────────────────────────────────────────────
       7. NAVBAR SCROLL EFFECT
       Adds a subtle shadow to the main nav on scroll.
    ───────────────────────────────────────────────────────────── */
    if (mainNav) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 10) {
          mainNav.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
        } else {
          mainNav.style.boxShadow = 'none';
        }
      }, { passive: true });
    }
  
  })();