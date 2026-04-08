

(function () {
    'use strict';
  
   
    const stickyHeader = document.getElementById('stickyHeader');
    const navbar       = document.getElementById('navbar');
    let lastScrollY    = 0;
    let ticking        = false;
  
    function handleScroll() {
      const y         = window.scrollY;
      const threshold = window.innerHeight * 0.8;
  
      /* Navbar shadow */
      if (navbar) {
        navbar.classList.toggle('scrolled', y > 10);
      }
  
      /* Sticky header: show when scrolling UP past the fold */
      if (stickyHeader) {
        if (y > threshold && y < lastScrollY) {
          stickyHeader.classList.add('visible');
        } else {
          stickyHeader.classList.remove('visible');
        }
      }
  
      lastScrollY = y;
      ticking     = false;
    }
  
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(handleScroll); ticking = true; }
    }, { passive: true });
  
  
  
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
  
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function () {
        const open = mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', String(open));
      });
      mobileMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          mobileMenu.classList.remove('open');
          hamburger.classList.remove('open');
        });
      });
    }
  
  
   
    const mainImg   = document.getElementById('mainImg');
    const galWrap   = document.getElementById('galWrap');
    const galThumbs = document.getElementById('galThumbs');
    const galPrev   = document.getElementById('galPrev');
    const galNext   = document.getElementById('galNext');
    const zoomLens  = document.getElementById('zoomLens');
    const zoomResult= document.getElementById('zoomResult');
  
    if (mainImg && galThumbs) {
      const thumbEls = Array.from(galThumbs.querySelectorAll('.gallery__thumb'));
      let currentIdx = 0;
  
      /* Switch image */
      function switchImage(idx) {
        idx = (idx + thumbEls.length) % thumbEls.length;
        currentIdx = idx;
        const src = thumbEls[idx].dataset.src;
        mainImg.src = src;
        /* zoom result uses same src */
        if (zoomResult) {
          zoomResult.style.backgroundImage = 'url(' + src + ')';
        }
        thumbEls.forEach(function (t, i) { t.classList.toggle('active', i === idx); });
      }
  
      thumbEls.forEach(function (thumb, i) {
        thumb.addEventListener('click', function () { switchImage(i); });
      });
  
      if (galPrev) galPrev.addEventListener('click', function () { switchImage(currentIdx - 1); });
      if (galNext) galNext.addEventListener('click', function () { switchImage(currentIdx + 1); });
  
      /* Init zoom result bg */
      if (zoomResult) {
        zoomResult.style.backgroundImage = 'url(' + mainImg.src + ')';
        zoomResult.style.backgroundSize  = '300%';
      }
  
      /* Zoom on hover */
      if (galWrap && zoomLens && zoomResult) {
        const ZOOM = 3; /* magnification factor */
  
        galWrap.addEventListener('mousemove', function (e) {
          const rect   = galWrap.getBoundingClientRect();
          const lw     = zoomLens.offsetWidth;
          const lh     = zoomLens.offsetHeight;
  
          /* Lens position (clamped inside image) */
          let lx = e.clientX - rect.left - lw / 2;
          let ly = e.clientY - rect.top  - lh / 2;
          lx = Math.max(0, Math.min(lx, rect.width  - lw));
          ly = Math.max(0, Math.min(ly, rect.height - lh));
  
          zoomLens.style.left = lx + 'px';
          zoomLens.style.top  = ly + 'px';
  
          /* Background position for result panel */
          const bx = -(lx * ZOOM) + 'px';
          const by = -(ly * ZOOM) + 'px';
          zoomResult.style.backgroundPosition = bx + ' ' + by;
          zoomResult.style.backgroundSize     = (rect.width * ZOOM) + 'px ' + (rect.height * ZOOM) + 'px';
        });
  
        galWrap.addEventListener('mouseenter', function () {
          zoomLens.style.opacity = '1';
          zoomResult.style.display = 'block';
          zoomResult.style.backgroundImage = 'url(' + mainImg.src + ')';
        });
  
        galWrap.addEventListener('mouseleave', function () {
          zoomLens.style.opacity = '0';
          zoomResult.style.display = 'none';
        });
      }
    }
  
  
    /* ─────────────────────────────────────────────────
       4. MANUFACTURING PROCESS TABS
    ───────────────────────────────────────────────── */
    const tabData = [
      {
        title: 'High-Grade Raw Material Selection',
        desc:  'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.',
        list:  ['PE100 grade material', 'Optimal molecular weight distribution'],
        img:   'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80'
      },
      {
        title: 'Precision Extrusion Process',
        desc:  'Our state-of-the-art single-screw extruders with barrier screws ensure complete homogenization of the HDPE compound for consistent output.',
        list:  ['Controlled melt temperature', 'Barrier screw design for optimal mixing'],
        img:   'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=600&q=80'
      },
      {
        title: 'Precision Cooling System',
        desc:  'Multi-stage vacuum cooling tanks quench the pipe rapidly to lock in dimensional stability and maintain crystalline structure uniformity.',
        list:  ['Multi-stage vacuum cooling', 'Consistent wall thickness'],
        img:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'
      },
      {
        title: 'Accurate Sizing & Calibration',
        desc:  'Precision vacuum sizing bells ensure correct outer diameter and roundness as the pipe exits the extruder head.',
        list:  ['Vacuum sizing bells', 'Real-time diameter monitoring'],
        img:   'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&q=80'
      },
      {
        title: 'Rigorous Quality Control',
        desc:  'Each pipe undergoes dimensional verification, hydrostatic pressure testing, and visual inspection before leaving the production floor.',
        list:  ['Hydrostatic pressure testing', 'Dimensional verification at every meter'],
        img:   'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80'
      },
      {
        title: 'Permanent Pipe Marking',
        desc:  'Inkjet printing systems apply permanent traceability markings including product code, dimensions, pressure rating, and production date.',
        list:  ['Inkjet traceability printing', 'Meets IS/ISO marking standards'],
        img:   'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=70'
      },
      {
        title: 'Automated Cutting to Length',
        desc:  'Flying saws and planetary cutting systems cut pipes to precise lengths without deforming or stressing the pipe ends.',
        list:  ['Flying saw technology', 'Burr-free, square-ended cuts'],
        img:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70'
      },
      {
        title: 'Protective Packaging',
        desc:  'Pipes are bundled, capped, and wrapped to protect against UV exposure and mechanical damage during storage and transit.',
        list:  ['End caps for bore protection', 'UV-resistant wrapping for storage'],
        img:   'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=600&q=70'
      }
    ];
  
    const processTabs = document.getElementById('processTabs');
    const procTitle   = document.getElementById('procTitle');
    const procDesc    = document.getElementById('procDesc');
    const procList    = document.getElementById('procList');
    const procImg     = document.getElementById('procImg');
  
    if (processTabs) {
      processTabs.querySelectorAll('.ptab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          /* Update active tab */
          processTabs.querySelectorAll('.ptab').forEach(function (t) { t.classList.remove('active'); });
          tab.classList.add('active');
  
          /* Update panel content */
          const i    = parseInt(tab.dataset.i, 10);
          const data = tabData[i];
          if (procTitle) procTitle.textContent = data.title;
          if (procDesc)  procDesc.textContent  = data.desc;
          if (procList) {
            procList.innerHTML = data.list
              .map(function (item) { return '<li><span class="check-blue">&#10004;</span> ' + item + '</li>'; })
              .join('');
          }
          if (procImg) {
            procImg.style.opacity = '0';
            procImg.src = data.img;
            procImg.onload = function () {
              procImg.style.transition = 'opacity 0.3s';
              procImg.style.opacity = '1';
            };
          }
        });
      });
    }
  
  
    /* ─────────────────────────────────────────────────
       5. APPLICATIONS DRAG CAROUSEL
    ───────────────────────────────────────────────── */
    const appCarousel = document.getElementById('appCarousel');
    const appPrev     = document.getElementById('appPrev');
    const appNext     = document.getElementById('appNext');
  
    if (appCarousel) {
      /* Arrow navigation */
      function slideApp(dir) {
        const cardW = appCarousel.querySelector('.app-card').offsetWidth + 16;
        appCarousel.scrollBy({ left: dir * cardW, behavior: 'smooth' });
      }
      if (appPrev) appPrev.addEventListener('click', function () { slideApp(-1); });
      if (appNext) appNext.addEventListener('click', function () { slideApp(1); });
  
      /* Mouse drag */
      let isDragging = false, dragStart = 0, scrollStart = 0;
      appCarousel.addEventListener('mousedown',  function (e) { isDragging = true; dragStart = e.clientX; scrollStart = appCarousel.scrollLeft; appCarousel.classList.add('dragging'); });
      document.addEventListener('mousemove', function (e) { if (!isDragging) return; appCarousel.scrollLeft = scrollStart - (e.clientX - dragStart); });
      document.addEventListener('mouseup',   function ()  { isDragging = false; appCarousel.classList.remove('dragging'); });
    }
  
  
    /* ─────────────────────────────────────────────────
       6. TESTIMONIALS DRAG CAROUSEL
    ───────────────────────────────────────────────── */
    const testiTrack = document.getElementById('testiTrack');
    if (testiTrack) {
      let isDragging = false, dragStart = 0, scrollStart = 0;
      testiTrack.addEventListener('mousedown',  function (e) { isDragging = true; dragStart = e.clientX; scrollStart = testiTrack.scrollLeft; testiTrack.classList.add('dragging'); });
      document.addEventListener('mousemove', function (e) { if (!isDragging) return; testiTrack.scrollLeft = scrollStart - (e.clientX - dragStart); });
      document.addEventListener('mouseup',   function ()  { isDragging = false; testiTrack.classList.remove('dragging'); });
  
      /* Auto-scroll testimonials */
      let autoInterval = setInterval(function () {
        const maxScroll = testiTrack.scrollWidth - testiTrack.clientWidth;
        if (testiTrack.scrollLeft >= maxScroll - 5) {
          testiTrack.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          testiTrack.scrollBy({ left: 280 + 16, behavior: 'smooth' });
        }
      }, 4000);
  
      testiTrack.addEventListener('mouseenter', function () { clearInterval(autoInterval); });
      testiTrack.addEventListener('touchstart',  function () { clearInterval(autoInterval); }, { passive: true });
    }
  
  
    /* ─────────────────────────────────────────────────
       7. FAQ ACCORDION
    ───────────────────────────────────────────────── */
    document.querySelectorAll('.faq-item').forEach(function (item) {
      const btn    = item.querySelector('.faq-q');
      const answer = item.querySelector('.faq-a');
      const icon   = item.querySelector('.faq-icon');
  
      if (!btn || !answer) return;
  
      btn.addEventListener('click', function () {
        const isOpen = answer.classList.contains('open');
  
        /* Close all */
        document.querySelectorAll('.faq-a').forEach(function (a) { a.classList.remove('open'); });
        document.querySelectorAll('.faq-item').forEach(function (i) { i.removeAttribute('data-open'); });
        document.querySelectorAll('.faq-icon').forEach(function (ic) { ic.textContent = '⌄'; });
  
        /* Open clicked if it was closed */
        if (!isOpen) {
          answer.classList.add('open');
          item.setAttribute('data-open', 'true');
          if (icon) icon.textContent = '⌃';
        }
      });
    });
  
  
    /* ─────────────────────────────────────────────────
       8. SMOOTH ANCHOR SCROLLING
    ───────────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 64;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset - 12, behavior: 'smooth' });
      });
    });
  
  
    /* ─────────────────────────────────────────────────
       9. SCROLL REVEAL
    ───────────────────────────────────────────────── */
    const revealEls = document.querySelectorAll(
      '.feat-card, .port-card, .testi-card, .faq-item, .specs-row, ' +
      '.process-panel, .resource-row, .section-h2, .section-p, .faq__heading'
    );
  
    const styleTag = document.createElement('style');
    styleTag.textContent = '.reveal-init{opacity:0;transform:translateY(20px);transition:opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1)}.reveal-init.revealed{opacity:1;transform:translateY(0)}';
    document.head.appendChild(styleTag);
  
    revealEls.forEach(function (el) { el.classList.add('reveal-init'); });
  
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('revealed'); });
    }
  
  })();