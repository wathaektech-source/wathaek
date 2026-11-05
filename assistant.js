// Wathaek assistant — an always-on chat helper.
// It answers from the company's own content (no server needed) and hands
// anything it can't answer to WhatsApp with the visitor's question attached.
(() => {
  const WHATSAPP = '966595185991';
  const PHONE = '059 518 5991';
  const EMAIL = 'app@wathaek.tech';

  const root = document.getElementById('assistant');
  if (!root) return;
  const body = document.getElementById('asBody');
  const chips = document.getElementById('asChips');
  const form = document.getElementById('asForm');
  const input = document.getElementById('asText');
  const launcher = document.getElementById('asLauncher');
  const teaser = document.getElementById('asTeaser');
  const isPhone = () => matchMedia('(max-width: 640px)').matches;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Knowledge (from the website content) ----------
  const SERVICES = [
    { id: 'ai', title: 'الذكاء الاصطناعي والحلول الذكية',
      desc: 'نطوّر حلولًا قائمة على الذكاء الاصطناعي ترفع الإنتاجية، وتبسّط العمليات، وتحسّن تجربة عملائك.',
      items: ['المساعدات الذكية وروبوتات المحادثة', 'أتمتة المهام وسير العمل', 'تحليل البيانات وإعداد التقارير', 'دمج الذكاء الاصطناعي في مواقعك وأنظمتك الحالية', 'تطوير حلول ذكاء اصطناعي مخصّصة'],
      kw: ['ذكاء', 'اصطناعي', 'ai', 'شات', 'chat', 'روبوت', 'محادثه', 'بوت', 'bot', 'gpt'] },
    { id: 'web', title: 'تصميم وتطوير المواقع الإلكترونية',
      desc: 'نصمّم مواقع احترافية وسريعة ومتوافقة مع الجوال، تعكس هوية نشاطك وتساعدك على الوصول إلى عملائك.',
      items: ['مواقع الشركات والمؤسسات', 'المواقع التعريفية والخدمية', 'منصات الويب والبوابات الإلكترونية', 'صفحات الهبوط', 'تحسين الأداء وتجربة المستخدم'],
      kw: ['موقع', 'مواقع', 'ويب', 'web', 'website', 'صفحه هبوط', 'هبوط', 'بوابه', 'منصه'] },
    { id: 'store', title: 'المتاجر الإلكترونية',
      desc: 'ننشئ متاجر إلكترونية تساعدك على عرض منتجاتك وإدارة عمليات البيع وتقديم تجربة شراء سهلة وآمنة.',
      items: ['تصميم وتطوير المتاجر', 'إدارة المنتجات والطلبات', 'ربط بوابات الدفع وشركات الشحن', 'تحسين تجربة التسوق والشراء'],
      kw: ['متجر', 'متاجر', 'تجاره', 'store', 'shop', 'دفع', 'شحن', 'منتجات', 'بيع اونلاين'] },
    { id: 'app', title: 'تصميم وتطوير التطبيقات',
      desc: 'نحوّل أفكارك إلى تطبيقات عملية تخدم عملاءك وتدعم نمو مشروعك.',
      items: ['تطبيقات iOS وAndroid', 'تطبيقات الخدمات والأعمال', 'تطبيقات التجارة الإلكترونية', 'تطبيقات مخصّصة حسب احتياجك'],
      kw: ['تطبيق', 'تطبيقات', 'app', 'ios', 'android', 'اندرويد', 'ايفون', 'iphone', 'ابل'] },
    { id: 'erp', title: 'أنظمة تخطيط موارد المؤسسات ERP',
      desc: 'نساعد المنشآت على تنظيم عملياتها من خلال أنظمة تربط الإدارات والبيانات في منصة متكاملة.',
      items: ['الحسابات والمالية', 'المخزون والمشتريات', 'المبيعات والموارد البشرية', 'التقارير ومتابعة الأداء', 'تهيئة الأنظمة وتكاملها وفق احتياجات المنشأة'],
      kw: ['erp', 'موارد', 'محاسب', 'حسابات', 'مخزون', 'مشتريات', 'موارد بشريه', 'رواتب'] },
    { id: 'pos', title: 'أنظمة نقاط البيع POS',
      desc: 'نوفّر حلول نقاط بيع تساعد المتاجر والمطاعم والمنشآت التجارية على إدارة المبيعات والمنتجات والمخزون بكفاءة.',
      items: ['إدارة عمليات البيع والفواتير', 'متابعة المخزون', 'تقارير المبيعات', 'الربط مع الأنظمة الأخرى حسب المتطلبات'],
      kw: ['pos', 'نقاط البيع', 'نقطه بيع', 'كاشير', 'فواتير', 'فاتوره', 'مطعم', 'مطاعم', 'كافيه'] },
    { id: 'consult', title: 'الاستشارات التقنية والتحول الرقمي',
      desc: 'نساعدك على اختيار التقنية المناسبة وتحديد أولويات التطوير وبناء خطة واضحة للتحول الرقمي.',
      items: ['تقييم الأنظمة والبنية التقنية', 'تحليل الاحتياجات والمتطلبات', 'اختيار الحلول والمنصات', 'تخطيط المشاريع التقنية', 'استشارات الذكاء الاصطناعي والأتمتة'],
      kw: ['تحول رقمي', 'تقييم', 'تخطيط', 'خطه'] },
    { id: 'biz', title: 'حلول الأعمال وتطوير الأنظمة',
      desc: 'نصمّم حلولًا تقنية تنظّم الإجراءات، وترفع الكفاءة، وتربط العمليات داخل المنشأة.',
      items: ['أتمتة الإجراءات الإدارية', 'أنظمة إدارة العملاء CRM', 'تكامل الأنظمة وتبادل البيانات', 'لوحات المعلومات والتقارير', 'تطوير أنظمة مخصّصة للأعمال'],
      kw: ['crm', 'نظام', 'انظمه', 'اتمته', 'لوحات', 'داشبورد', 'dashboard', 'تقارير', 'اجراءات', 'ربط', 'api'] },
    { id: 'seo', title: 'التسويق الرقمي وتحسين محركات البحث',
      desc: 'نساعد نشاطك على تعزيز حضوره الرقمي وتحسين فرص الوصول إلى العملاء المستهدفين.',
      items: ['إدارة إعلانات Google', 'تحسين محركات البحث SEO', 'تهيئة المواقع للظهور في نتائج البحث', 'تحسين المحتوى والكلمات المفتاحية', 'قياس وتحليل الأداء الرقمي'],
      kw: ['seo', 'تسويق', 'اعلان', 'اعلانات', 'قوقل', 'جوجل', 'google', 'محركات', 'ظهور', 'سيو'] },
  ];

  const INTENTS = [
    { id: 'greet', kw: ['سلام', 'مرحب', 'هلا', 'اهلا', 'صباح', 'مساء', 'hello', 'hi'] },
    { id: 'thanks', kw: ['شكر', 'مشكور', 'يعطيك', 'تسلم', 'thanks', 'thank'] },
    { id: 'price', kw: ['سعر', 'اسعار', 'تكلفه', 'تكاليف', 'كم يكلف', 'بكم', 'عرض سعر', 'ميزانيه', 'price'] },
    { id: 'contact', kw: ['تواصل', 'رقم', 'هاتف', 'جوال', 'واتس', 'whatsapp', 'ايميل', 'بريد', 'email', 'اتصل', 'كلم'] },
    { id: 'consult', kw: ['استشار', 'نصيحه', 'انصح', 'افضل حل', 'اختار'] },
    { id: 'process', kw: ['كيف تعملون', 'كيف تشتغلون', 'مراحل', 'خطوات', 'اليه', 'مده', 'وقت', 'كم ياخذ'] },
    { id: 'about', kw: ['من انتم', 'من نحن', 'عنكم', 'خبره', 'الشركه', 'المؤسسه', 'وثائق'] },
    { id: 'services', kw: ['خدمات', 'خدماتكم', 'تقدمون', 'وش تسوون', 'ماذا تقدم', 'شغلكم', 'تشتغلون'] },
  ];

  // ---------- Helpers ----------
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (t) => t.toLowerCase()
    .replace(/[ً-ْـ]/g, '')
    .replace(/[إأآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي');
  // Latin keywords match whole words only (so "ai" doesn't match inside "email")
  const hits = (text, kw) => kw.reduce((n, k) => {
    const nk = norm(k);
    const found = /^[a-z0-9 ]+$/.test(nk) ? new RegExp(`\\b${nk}\\b`).test(text) : text.includes(nk);
    return n + (found ? 1 : 0);
  }, 0);
  const wa = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  const ICON = (id) => `<svg><use href="#${id}"/></svg>`;
  const list = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
  const acts = (...a) => `<div class="acts">${a.join('')}</div>`;
  const btnWA = (label, msg) => `<a href="${wa(msg)}" target="_blank" rel="noopener">${ICON('i-chat')}${label}</a>`;
  const btnForm = (label = 'نموذج التواصل') => `<a class="alt" href="#contact" data-goto>${label}</a>`;

  // ---------- Replies ----------
  function reply(raw) {
    const t = norm(raw);
    const score = (kw) => hits(t, kw);
    const best = SERVICES.map((s) => [s, score(s.kw)]).sort((a, b) => b[1] - a[1])[0];
    const intent = INTENTS.map((i) => [i.id, score(i.kw)]).filter(([, n]) => n > 0).map(([id]) => id);

    if (intent.includes('price')) {
      const about = best[1] ? ` لخدمة <b>${esc(best[0].title)}</b>` : '';
      return {
        html: `تكلفة المشروع${about} تعتمد على احتياجك ونطاق العمل. أرسل لنا فكرة مختصرة عن مشروعك، ونرسل لك عرض سعر مناسب.` +
          acts(btnWA('اطلب عرض سعر', `السلام عليكم، أرغب في عرض سعر${best[1] ? ` لخدمة: ${best[0].title}` : ''}.`), btnForm()),
        chips: ['خدماتنا', 'تواصل معنا'],
      };
    }
    if (best[1] > 0) return service(best[0]);
    if (intent.includes('greet')) return { html: 'أهلًا وسهلًا بك 😊 كيف أقدر أساعدك؟ اختر من الخيارات بالأسفل أو اكتب سؤالك.', chips: START };
    if (intent.includes('thanks')) return { html: 'العفو! سعداء بخدمتك. إذا عندك أي سؤال آخر أنا هنا 👋', chips: START };
    if (intent.includes('contact')) return contact();
    if (intent.includes('consult')) return consult();
    if (intent.includes('process')) return processInfo();
    if (intent.includes('about')) return about();
    if (intent.includes('services')) return servicesList();
    return {
      html: 'سؤال جميل! أفضل من يجيبك عليه فريقنا مباشرة. أرسل سؤالك عبر واتساب وسنرد عليك في أقرب وقت.' +
        acts(btnWA('أرسل سؤالي عبر واتساب', `السلام عليكم، لدي سؤال: ${raw}`)),
      chips: START,
    };
  }

  const service = (s) => ({
    html: `<b>${esc(s.title)}</b><br>${esc(s.desc)}${list(s.items)}` +
      acts(btnWA('اطلب هذه الخدمة', `السلام عليكم، أرغب في الاستفسار عن خدمة: ${s.title}.`), btnForm('اطلب استشارتك')),
    chips: ['عرض سعر', 'خدماتنا', 'آلية العمل'],
  });
  const servicesList = () => ({
    html: 'نقدّم <b>9 خدمات</b> مترابطة من الاستشارة إلى التطوير. اختر خدمة لأعرض لك تفاصيلها 👇',
    chips: SERVICES.map((s) => s.title),
  });
  const consult = () => ({
    html: '<b>استشارات للأفراد:</b> نساعدك على تحويل فكرتك إلى مشروع رقمي، واختيار الحل المناسب، وتحديد الخطوات الصحيحة قبل التنفيذ.<br><br>' +
      '<b>استشارات للشركات:</b> نساعد المنشآت على تطوير أنظمتها، واختيار حلول ERP وPOS، وتوظيف الذكاء الاصطناعي والأتمتة.' +
      acts(btnWA('اطلب استشارتك', 'السلام عليكم، أرغب في طلب استشارة تقنية.'), btnForm()),
    chips: ['خدماتنا', 'عرض سعر'],
  });
  const contact = () => ({
    html: `يسعدنا تواصلك 🌟<br>📞 الهاتف وواتساب: <b dir="ltr">${PHONE}</b><br>✉️ البريد: <b dir="ltr">${EMAIL}</b>` +
      acts(btnWA('واتساب', 'السلام عليكم، أرغب في التواصل معكم.'), `<a class="alt" href="mailto:${EMAIL}">${ICON('i-mail')}البريد</a>`),
    chips: ['خدماتنا', 'اطلب استشارة'],
  });
  const processInfo = () => ({
    html: 'نعمل معك في <b>6 خطوات واضحة</b>:' + list(['فهم احتياجاتك وأهدافك', 'تحليل المتطلبات واقتراح الحل المناسب', 'إعداد التصور وخطة التنفيذ', 'التصميم والتطوير', 'الاختبار والتسليم', 'الدعم والتطوير المستمر وفق الاتفاق']),
    chips: ['اطلب استشارة', 'عرض سعر'],
  });
  const about = () => ({
    html: '<b>وثائق المتكاملة لتقنية المعلومات</b> مؤسسة سعودية بخبرة <b>14 عامًا</b> في تقنية المعلومات، وتخصّص في الذكاء الاصطناعي. نقدّم حلولًا تقنية ورقمية للأفراد والشركات من الاستشارة إلى التطوير والدعم.',
    chips: ['خدماتنا', 'آلية العمل', 'تواصل معنا'],
  });

  const START = ['خدماتنا', 'الذكاء الاصطناعي', 'اطلب استشارة', 'عرض سعر', 'تواصل معنا'];
  // Chip labels map straight to answers
  const CHIP = {
    'خدماتنا': servicesList, 'اطلب استشارة': consult, 'تواصل معنا': contact, 'آلية العمل': processInfo,
    'عرض سعر': () => reply('عرض سعر'),
  };
  SERVICES.forEach((s) => { CHIP[s.title] = () => service(s); });
  CHIP['الذكاء الاصطناعي'] = () => service(SERVICES[0]);

  // ---------- Rendering ----------
  const scrollDown = () => { body.scrollTop = body.scrollHeight; };
  function addMsg(html, who) {
    const el = document.createElement('div');
    el.className = `msg ${who}`;
    el.innerHTML = html;
    body.appendChild(el);
    scrollDown();
  }
  function setChips(labels = []) {
    chips.innerHTML = '';
    labels.forEach((label) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.addEventListener('click', () => ask(label, CHIP[label]));
      chips.appendChild(b);
    });
  }
  let busy = false;
  function botSay(res) {
    busy = true;
    setChips([]);
    const typing = document.createElement('div');
    typing.className = 'msg bot typing';
    typing.innerHTML = '<i></i><i></i><i></i>';
    body.appendChild(typing);
    scrollDown();
    const wait = reduced() ? 150 : 650 + Math.min(res.html.length * 2, 700);
    setTimeout(() => {
      typing.remove();
      addMsg(res.html, 'bot');
      setChips(res.chips);
      busy = false;
    }, wait);
  }
  function ask(text, fn) {
    if (busy || !text.trim()) return;
    addMsg(esc(text), 'user');
    botSay(fn ? fn() : reply(text));
  }

  // ---------- Open / close ----------
  let greeted = false;
  function open() {
    root.classList.add('open');
    launcher.setAttribute('aria-expanded', 'true');
    launcher.setAttribute('aria-label', 'إغلاق المساعد');
    teaser.hidden = true;
    if (!greeted) {
      greeted = true;
      botSay({ html: 'مرحبًا 👋 أنا <b>مساعد وثائق المتكاملة</b>.<br>أقدر أعرّفك على خدماتنا، وأجهّز لك طلب استشارة أو عرض سعر. كيف أقدر أساعدك؟', chips: START });
    }
    if (!isPhone()) setTimeout(() => input.focus({ preventScroll: true }), 350);
  }
  function close() {
    root.classList.remove('open');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', 'فتح المساعد');
    teaser.hidden = false;
  }
  launcher.addEventListener('click', () => (root.classList.contains('open') ? close() : open()));
  teaser.addEventListener('click', open);
  document.getElementById('asMin').addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('open')) close(); });
  body.addEventListener('click', (e) => { if (e.target.closest('[data-goto]') && isPhone()) close(); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value;
    input.value = '';
    ask(text);
  });

  // Always on screen: open on desktop, show the greeting bubble on phones.
  setTimeout(() => (isPhone() ? (teaser.hidden = false) : open()), 1200);
})();
