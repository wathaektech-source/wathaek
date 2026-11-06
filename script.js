// Wathaek website — small, dependency-free interactions
(() => {
  const WHATSAPP = '966595185991';

  // ⬇️ Social accounts — paste each profile link here
  const SOCIAL = {
    facebook: 'https://www.facebook.com/profile.php?id=61595820175379',
    x: 'https://x.com/WathaiqIT',
    snapchat: '',
    linkedin: 'https://www.linkedin.com/in/wathaek-tech-592879449/',
  };

  const root = document.documentElement;
  root.classList.add('js');

  // Light / dark theme switch (default light; the choice is remembered on this device)
  const themeBtn = document.getElementById('themeBtn');
  const metaScheme = document.querySelector('meta[name="color-scheme"]');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const applyTheme = (dark) => {
    if (dark) root.dataset.theme = 'dark'; else delete root.dataset.theme;
    if (metaScheme) metaScheme.content = dark ? 'dark' : 'only light';
    if (metaTheme) metaTheme.content = dark ? '#0A1120' : '#1E6BFF';
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', String(dark));
      themeBtn.setAttribute('aria-label', dark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن');
    }
  };
  applyTheme(root.dataset.theme === 'dark');
  themeBtn?.addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    applyTheme(dark);
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  });

  // Mobile menu
  const header = document.querySelector('.site-header');
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  const setMenu = (open) => {
    header.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
  };
  menuBtn.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Header border once the page scrolls
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Highlight the nav link of the section in view
  const links = [...nav.querySelectorAll('a[href^="#"]:not(.btn)')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));

    // Reveal on scroll. Cards in the same grid cascade in one after another.
    document.querySelectorAll('.reveal').forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
      el.style.setProperty('--i', Math.min(siblings.indexOf(el), 8));
      // Once shown, drop the reveal styles so hover effects run at their own speed
      el.addEventListener('transitionend', (e) => {
        if (e.target !== el || e.propertyName !== 'opacity' || !el.classList.contains('in')) return;
        el.classList.remove('reveal', 'in');
        el.style.removeProperty('--i');
      });
    });
    const reveal = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        if (entry.target.matches('.stats')) countUp(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal, .stagger, .draw').forEach((el) => reveal.observe(el));
  } else {
    document.querySelectorAll('.reveal, .stagger, .draw').forEach((el) => el.classList.add('in'));
  }

  // Numbers count up gently the first time they appear
  function countUp(box) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    box.querySelectorAll('dt').forEach((dt) => {
      const end = parseInt(dt.textContent, 10);
      if (!end) return;
      const start = performance.now(), dur = 1400;
      const tick = (now) => {
        const t = Math.min((now - start) / dur, 1);
        dt.textContent = Math.round(end * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(tick);
      };
      dt.textContent = '0';
      requestAnimationFrame(tick);
    });
  }

  // Contact form → opens WhatsApp with a ready message
  const form = document.getElementById('leadForm');
  const error = document.getElementById('formError');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').trim();
    const phone = (data.get('phone') || '').trim();
    if (!name || !phone) {
      error.hidden = false;
      (name ? form.elements['phone'] : form.elements['name']).focus();
      return;
    }
    error.hidden = true;
    const message = (data.get('message') || '').trim();
    const text = [
      `السلام عليكم، أرغب في ${data.get('type')}.`,
      `الاسم: ${name}`,
      `الجوال: ${phone}`,
      `الخدمة: ${data.get('service')}`,
      message && `التفاصيل: ${message}`,
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });

  // "Request a consultation" links preselect the consultation tab
  document.querySelectorAll('a[href="#contact"]').forEach((a) => {
    a.addEventListener('click', () => { form.elements['type'][0].checked = true; });
  });

  // Social links: fill every icon from SOCIAL
  document.querySelectorAll('[data-social]').forEach((a) => {
    const url = SOCIAL[a.dataset.social];
    if (url) a.href = url;
  });


  // AI section: sector tabs
  document.querySelectorAll('input[name="ai-sector"]').forEach((r) => {
    r.addEventListener('change', () => {
      document.querySelectorAll('.ai-panel').forEach((p) => { p.hidden = p.dataset.panel !== r.value; });
    });
  });

  // AI section: chat demo plays message by message while it is on screen
  const demo = document.getElementById('aiDemo');
  if (demo && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const msgs = [...demo.querySelectorAll('.msg')];
    let timer = null;
    const play = () => {
      demo.classList.add('playing');
      msgs.forEach((m) => m.classList.remove('show'));
      let i = 0;
      const next = () => {
        if (i < msgs.length) {
          msgs[i].classList.add('show');
          timer = setTimeout(next, msgs[i].classList.contains('user') ? 1200 : 2000);
          i += 1;
        } else {
          timer = setTimeout(play, 3500);
        }
      };
      timer = setTimeout(next, 500);
    };
    new IntersectionObserver(([entry]) => {
      clearTimeout(timer);
      if (entry.isIntersecting) play(); else demo.classList.remove('playing');
    }, { threshold: 0.3 }).observe(demo);
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
