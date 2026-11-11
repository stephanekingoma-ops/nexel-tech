/* NeXel Tech — v2 : interactions (canvas de profondeur, emblème X extrudé,
   bascules 3D, i18n FR/EN, formulaire sans envoi).
   Motion : chaque animation nomme ses propriétés, courbe et durée
   (tokens --ease-out / --ease-in-out dans site.css). */
(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const CONTACT = { email: "" };   // courriel à renseigner
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const $ = id => document.getElementById(id);
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => "#" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");
  let scrambleGen = 0;

  /* ================= Traductions ================= */
  const EN = {
    "nav.home": "NeXel Tech, back to top", "nav.work": "Work", "nav.method": "Method", "nav.about": "About",
    "lang.label": "Language", "cta": "Request a diagnostic",
    "st.on": "System online", "st.svc": "Repair · Software · Web · AI",
    "emblem.aria": "NeXel Tech emblem in three dimensions, click to animate",
    "scroll.hint": "Scroll to explore",
    "h.title": "Computers repaired, software built, projects <em>delivered</em>.",
    "h.lede": "Computers repaired, software built, AI wired into your tools. One partner, from cable to code.",
    "t.aria": "Sample diagnostic session", "t.title": "nexel@workshop: ~", "t.live": "ONLINE",
    "sx1": "Domains managed", "sx2": "Certifications", "sx3": "Integrated services", "sx4": "Toronto · remote",
    "b1": "Computer repair", "b2": "Data recovery", "b3": "System installs", "b4": "Wi-Fi networks", "b5": "Custom software", "b6": "Websites", "b7": "AI integration", "b8": "Automation",
    "s.h2": "Four components, one board.",
    "s.lede": "From the computer that won't boot to the software your business is missing, every service connects to the others. No need to coordinate three different vendors.",
    "u1.tag": "Workshop", "u1.h": "Repair and maintenance", "u1.aria": "Computer test bench, example", "u1.rep": "REPLACED", "u1.bench": "Test bench", "ex": "example",
    "u1.p": "Diagnostics, part replacement, operating system installs, Wi-Fi problems, data backup and recovery. On site or remote.",
    "u1.t4": "Cloud backup",
    "u2.tag": "Software", "u2.h": "Custom software", "u2.aria": "Code excerpt running, example",
    "u2.code": '<span><i class="k">def</i> invoice(client, hours):</span><span>    rate = client.hourly_rate</span><span>    total = hours * rate</span><span>    <i class="k">if</i> client.taxable:</span><span>        total *= <i class="s">1.13</i>   <i class="m"># Ontario HST</i></span><span>    <i class="k">return</i> Invoice(client, total)</span>',
    "u2.out": "› 6 tests passed",
    "u2.p": "Business applications, internal tools, automation of repetitive tasks. We start from the way you already work.",
    "u2.t1": "Web apps", "u2.t2": "Internal tools", "u2.t3": "Databases",
    "u3.h": "Websites", "u3.aria": "Website mockup being built", "u3.url": "your-business.ca",
    "u3.p": "Business websites, sales pages, online stores. Fast on phones, easy to update, built so your customers get in touch.",
    "u3.t1": "Showcase", "u3.t2": "Store", "u3.t3": "SEO", "u3.t4": "Hosting",
    "u4.tag": "AI", "u4.h": "AI integration", "u4.aria": "Emails, invoices and forms go through a model that sorts, summarizes and records them",
    "g1": "Emails", "g2": "Invoices", "g3": "Forms", "g4": "Sorting", "g5": "Summary", "g6": "CRM entry",
    "u4.p": "Assistants connected to your tools, automatic sorting and summarizing of documents, automation between your apps. We automate what wastes your time, and only that.",
    "u4.t4": "Training",
    "w.h2": "Platforms built for Africa and Canada.",
    "w.lede": "Health, payments, education, retail: six projects picked from the 37 domains managed by NeXel Tech. Each link opens the live site.",
    "w1": "Health platform for French- and Portuguese-speaking Africa, with patient, hospital and pharmacy spaces. Built with ITE SET RDC.",
    "w2": "Payments for the DRC and Central Africa: multi-currency wallets, virtual cards, contactless payments and tontines. In French, English and Lingala.",
    "w3": "Retail management software for Africa: point of sale, inventory, purchasing, loyalty and reports, selling in CDF, USD, XOF, XAF and EUR.",
    "w4": "Academic registry for the DRC. Employers, embassies and government offices verify a diploma for free; graduates access their transcripts and certified documents.",
    "w5": "School management for primary and secondary schools in the DRC: school life, grading, deliberations and official documents, finances, administration.",
    "w6": "Cultural events of the African diaspora in Canada, with automatic posting of La Découverte magazine articles to Facebook.",
    "tg.health": "Health", "tg.plat": "Platform", "tg.multi": "Multilingual", "tg.retail": "Retail", "tg.edu": "Education", "tg.verif": "Verification", "tg.webapp": "Web and app",
    "r.title": "more domains hosted and managed by NeXel Tech.", "r.p": "37 domains in total, including the six projects above.", "r.k1": "Featured", "r.k2": "Hosted",
    "m.h2": "You see the product move forward every week.",
    "m.lede": "Every software or web project runs on Scrum. Stéphane holds one role per project: certified Scrum Master to keep the team moving, or Product Owner to carry your priorities. Never both on the same project, so each role keeps its full effectiveness. Work is split into short sprints, and each sprint ends with a demo of what works.",
    "st1": "Assessment", "st1d": "We listen to your needs and look at what you already have. You leave with a clear estimate.",
    "st2": "Product backlog", "st2d": "Features are listed and ranked by their value to you. You decide the order.",
    "st3d": "One to two weeks of development, then a review where you test the result.",
    "st4": "Delivery and support", "st4d": "Launch, training for your team, then ongoing maintenance.",
    "sp.aria": "Animated sprint board, example", "sp.title": "Sprint board · <b>example</b>", "sp.day": "day",
    "l0": "To do", "l1": "In progress", "l2": "Review", "l3": "Done",
    "k1": "Home page", "k3": "Online payments", "k4": "Contact form", "k5": "Mobile testing", "k6": "Go live",
    "f.chart": "Cloud bill · 12 months", "f.group": "Show the bill", "f.before": "Before", "f.after": "After FinOps",
    "f.aria": "Chart: the share of resources paid for but unused shrinks after optimization",
    "f.used": "Resources used", "f.waste": "Paid for but unused", "f.note": "Illustration of the principle, no real client data.",
    "f.h2": "Pay for the cloud you actually use.",
    "f.lede": "Cloud bills often grow without anyone noticing: forgotten servers, oversized machines, storage nobody cleans up. FinOps makes these costs visible and brings them back to what you need.",
    "f.l1": "<b>Inventory and tagging</b> of every resource, by project and by team",
    "f.l2": "<b>Rightsizing</b> oversized servers and shutting down idle ones",
    "f.l3": "<b>Commitments and reservations</b> where usage is stable",
    "f.l4": "<b>Budget alerts</b> and a monthly report you can actually read",
    "a.alt": "Portrait of Stéphane Kingoma", "a.label": "Founder",
    "a.p1": "Before founding NeXel Tech, Stéphane spent years close to the machines: hardware failures, Wi-Fi networks, system installs, backups to company cloud storage. He then coordinated product projects and supported the rollout of truck-tracking software for a transport company in Zambia.",
    "a.p2": "That mix of hands-on support and product management is the foundation of NeXel Tech. Based in Toronto, he works with clients in Canada and Africa.",
    "bom.cap": "Bill of materials · certifications", "bom.ref": "Ref.", "bom.iss": "Issuer",
    "bom.c4": "Google AI Professional Certificate · Google AI Essentials",
    "c.label": "Connector", "c.h2": "Tell us about your problem or your project.",
    "c.lede": "Describe the issue in a few lines. We'll reply with a first opinion and an estimate, with no commitment.",
    "c.email": "Email", "c.phone": "Phone", "c.area": "Area", "c.todo": "to be added", "c.region": "Toronto, Ontario · remote anywhere", "c.copy": "Copy",
    "c.name": "Name", "c.need": "Service", "c.msg": "Your message", "c.ph": "E.g. my laptop won't start since an update",
    "o1": "Computer repair", "o2": "Custom software", "o3": "Website", "o4": "AI integration", "o5": "Scrum or FinOps support", "o6": "Other",
    "c.submit": "Prepare my request",
    "ft.tag": "Repair, software, web and AI. From cable to code, in Toronto and remotely.", "ft.s1": "Repair", "ft.co": "Company",
    "kn1": "Repair", "kn2": "Build", "kn3": "Ship", "kn4": "Optimize", "rl0": "Home"
  };
  const MSG = {
    fr: { errName: "Indiquez votre nom.", errMail: "Ce courriel semble incomplet. Vérifiez-le, par exemple nom@domaine.ca.", errMsg: "Décrivez votre besoin en une ou deux phrases.",
          subj: "Objet :", from: "De :", ready: "Votre demande est prête. Copiez-la et envoyez-la par texto au +1 (438) 220-7582, ou appelez-nous.",
          readyTo: e => `Votre demande est prête. Copiez-la et envoyez-la à ${e}.`,
          copy: "Copier la demande", copied: "Copié", selected: "Texte sélectionné, faites Copier" },
    en: { errName: "Enter your name.", errMail: "This email looks incomplete. Check it, for example name@domain.ca.", errMsg: "Describe what you need in a sentence or two.",
          subj: "Subject:", from: "From:", ready: "Your request is ready. Copy it and text it to +1 (438) 220-7582, or give us a call.",
          readyTo: e => `Your request is ready. Copy it and send it to ${e}.`,
          copy: "Copy request", copied: "Copied", selected: "Text selected, use Copy" }
  };
  const SCRIPTS = {
    fr: [
      [["c","nexel deploy site-web --client boulangerie"],["ok","Compilation des pages ........ 12"],["ok","Images optimisées ............ -68 % poids"],["ok","Test mobile .................. réussi"],["info","->  Certificat HTTPS ............ actif"],["ok","En ligne : boulangerie-exemple.ca"]],
      [["c","nexel sprint review --projet gestion-stock"],["ok","NX-21  Page d'accueil ......... fait"],["ok","NX-22  Sauvegarde nuage ....... fait"],["warn","NX-23  Paiement en ligne ...... à finir"],["info","->  Démo client ................ jeudi 10 h"],["ok","Vitesse de l'équipe ......... stable"]],
      [["c","nexel finops audit --compte nuage-pme"],["warn","Serveurs inactifs ............ 4"],["warn","Disques non attachés ......... 9"],["info","->  Arrêt planifié .............. hors heures"],["info","->  Redimensionnement ........... 3 serveurs"],["ok","Alertes de budget ............ actives"]],
      [["c","nexel diagnostic --poste client-07"],["ok","Processeur ............ 41 °C"],["ok","Mémoire vive .......... 16 Go"],["warn","Disque SSD ............ secteurs défectueux"],["info","->  Sauvegarde vers le nuage .... 100 %"],["info","->  Remplacement du disque ...... fait"],["ok","Poste rétabli, données intactes"]]
    ],
    en: [
      [["c","nexel deploy website --client bakery"],["ok","Pages compiled ............... 12"],["ok","Images optimized ............. -68% weight"],["ok","Mobile test .................. passed"],["info","->  HTTPS certificate .......... active"],["ok","Live: bakery-example.ca"]],
      [["c","nexel sprint review --project inventory"],["ok","NX-21  Home page ............. done"],["ok","NX-22  Cloud backup .......... done"],["warn","NX-23  Online payments ....... to finish"],["info","->  Client demo ................ Thursday 10 a.m."],["ok","Team velocity ................ steady"]],
      [["c","nexel finops audit --account sme-cloud"],["warn","Idle servers ................. 4"],["warn","Unattached disks ............. 9"],["info","->  Scheduled shutdown ......... off-hours"],["info","->  Rightsizing ................ 3 servers"],["ok","Budget alerts ................ active"]],
      [["c","nexel diagnostic --machine client-07"],["ok","Processor ............. 41 °C"],["ok","Memory ................ 16 GB"],["warn","SSD drive ............. bad sectors"],["info","->  Backup to cloud ............ 100%"],["info","->  Drive replacement .......... done"],["ok","Machine restored, data intact"]]
    ]
  };

  const FR = {}, FRA = new Map();
  document.querySelectorAll("[data-i18n]").forEach(el => { const k = el.dataset.i18n; if (!(k in FR)) FR[k] = el.innerHTML; });
  document.querySelectorAll("[data-i18n-attr]").forEach(el => {
    el.dataset.i18nAttr.split(";").forEach(pair => { const [attr, key] = pair.split(":"); if (!FRA.has(key)) FRA.set(key, el.getAttribute(attr) || ""); });
  });
  let lang = "fr";
  const tr = k => (lang === "en" ? (EN[k] ?? FR[k]) : FR[k]);
  function detectLang() {
    try { const s = localStorage.getItem("nexel-lang"); if (s === "fr" || s === "en") return s; } catch (e) {}
    const list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    for (const l of list) { if (/^fr\b/i.test(l)) return "fr"; if (/^en\b/i.test(l)) return "en"; }
    return "en";
  }
  let termToken = 0;
  function applyLang(l, save) {
    lang = l; scrambleGen++;
    document.querySelectorAll("[data-i18n]").forEach(el => { const v = tr(el.dataset.i18n); if (v !== undefined && el.innerHTML !== v) el.innerHTML = v; });
    document.querySelectorAll("[data-i18n-attr]").forEach(el => {
      el.dataset.i18nAttr.split(";").forEach(pair => { const [attr, key] = pair.split(":"); el.setAttribute(attr, l === "en" ? (EN[key] ?? FRA.get(key)) : FRA.get(key)); });
    });
    document.documentElement.lang = l;
    $("langFr").setAttribute("aria-pressed", l === "fr");
    $("langEn").setAttribute("aria-pressed", l === "en");
    $("fCopy").textContent = MSG[l].copy;
    if (CONTACT.email) { const e = $("cEmail"); e.textContent = CONTACT.email; e.classList.remove("todo"); e.removeAttribute("data-i18n"); }
    if (!$("fOut").hidden) buildRequest(false);
    $("fErr").textContent = "";
    tickClock();
    startTerm();
    if (save) { try { localStorage.setItem("nexel-lang", l); } catch (e) {} }
  }

  /* ================= Horloge de Toronto ================= */
  const clock = $("clock");
  function tickClock() {
    try {
      const parts = new Intl.DateTimeFormat(lang === "en" ? "en-CA" : "fr-CA", { timeZone: "America/Toronto", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZoneName: "short" }).formatToParts(new Date());
      const g = t => (parts.find(p => p.type === t) || {}).value || "";
      clock.textContent = `${g("hour")}:${g("minute")}:${g("second")} ${g("timeZoneName")}`;
    } catch (e) { clock.textContent = ""; }
  }
  setInterval(tickClock, 1000);

  /* ================= Emblème X en 3D ================= */
  const hero = $("hero"), emblem = $("emblem"), e3d = $("emblem3d");
  const XP1 = "72,0 104,0 34,112 2,112", XP2 = "2,0 34,0 104,112 72,112";
  (function buildEmblem() {
    const LAYERS = 9, GAP = 9;
    let html = "";
    for (let i = LAYERS - 1; i >= 0; i--) {
      const t = i / (LAYERS - 1);
      const col = mix("#159ec4", "#04101f", t);
      const polys = i === 0
        ? `<polygon points="${XP1}" fill="#0aa3c4"/><polygon points="${XP2}" fill="#1bcfef"/>`
        : `<polygon points="${XP1}" fill="${col}"/><polygon points="${XP2}" fill="${col}"/>`;
      html += `<div class="x-layer${i === 0 ? " front" : ""}" style="transform:translateZ(${-i * GAP}px)"><svg viewBox="0 0 104 112" aria-hidden="true">${polys}</svg></div>`;
    }
    e3d.innerHTML = html;
  })();
  let erx = 0, ery = 0, trx = 0, tryy = 0, lastEmblemMove = -1e9;
  hero.addEventListener("pointermove", e => {
    const r = emblem.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth;
    const dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
    trx = clamp(-dy * 16, -16, 16); tryy = clamp(dx * 18, -18, 18);
    lastEmblemMove = performance.now();
    tmx = clamp(e.clientX / innerWidth, 0, 1); tmy = clamp(e.clientY / innerHeight, 0, 1);
  }, { passive: true });
  emblem.addEventListener("click", () => {
    emblem.classList.remove("pop"); void emblem.offsetWidth; emblem.classList.add("pop");
    setTimeout(() => emblem.classList.remove("pop"), 600);
  });

  /* ================= Champ de profondeur (canvas) ================= */
  const cv = $("depth"), ctx = cv.getContext("2d");
  let W = 0, H = 0, parts = [], depthVisible = true, tmx = .5, tmy = .5;
  function sizeDepth() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = hero.clientWidth; H = hero.clientHeight;
    cv.width = Math.max(1, W * dpr); cv.height = Math.max(1, H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(clamp(W * H / 24000, 36, 90));
    parts = [];
    for (let i = 0; i < n; i++) parts.push({ x: rnd(0, W), y: rnd(0, H), z: rnd(.15, 1), s: rnd(.5, 1.4), vx: rnd(-6, 6), vy: rnd(4, 14), tw: rnd(0, 6.28) });
  }
  function drawDepth(now, dt) {
    ctx.clearRect(0, 0, W, H);
    const t = now / 1000;
    const horizon = H * .62, vx = W / 2 + (tmx - .5) * 70;
    ctx.lineWidth = 1;
    for (let i = -9; i <= 9; i++) {
      ctx.strokeStyle = "rgba(27,207,239,.055)";
      ctx.beginPath(); ctx.moveTo(vx + i * 34, horizon); ctx.lineTo(vx + i * W * .2, H); ctx.stroke();
    }
    for (let k = 0; k < 8; k++) {
      const p = ((t / 9 + k / 8) % 1), y = horizon + (H - horizon) * p * p;
      ctx.strokeStyle = `rgba(27,207,239,${(.03 + .09 * p).toFixed(3)})`;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    for (const p of parts) {
      p.x += p.vx * dt * (.25 + p.z); p.y -= p.vy * dt * (.25 + p.z);
      if (p.y < -8) { p.y = H + 8; p.x = rnd(0, W); }
      if (p.x < -8) p.x = W + 8; else if (p.x > W + 8) p.x = -8;
      const px = p.x + (tmx - .5) * 80 * (1.15 - p.z), py = p.y + (tmy - .5) * 52 * (1.15 - p.z);
      const twk = .7 + .3 * Math.sin(t * 2 + p.tw);
      ctx.fillStyle = `rgba(140,225,250,${((.1 + p.z * .5) * twk).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(px, py, (0.7 + p.z * 2.1) * p.s, 0, 6.2832); ctx.fill();
    }
  }
  sizeDepth();
  let rsz; addEventListener("resize", () => { clearTimeout(rsz); rsz = setTimeout(sizeDepth, 160); });
  new IntersectionObserver(es => { depthVisible = es[0].isIntersecting; }).observe(hero);

  let lastT = performance.now();
  function tick(now) {
    const dt = Math.min(.064, (now - lastT) / 1000); lastT = now;
    if (!reduce) {
      if (now - lastEmblemMove > 3000) {
        const t = now / 1000;
        trx = Math.sin(t * .5) * 5; tryy = Math.cos(t * .42) * 6;
      }
      erx += (trx - erx) * .07; ery += (tryy - ery) * .07;
      e3d.style.transform = `rotateX(${erx.toFixed(2)}deg) rotateY(${ery.toFixed(2)}deg)`;
    }
    if (depthVisible) drawDepth(now, reduce ? 0 : dt);
    requestAnimationFrame(tick);
  }
  if (!reduce) requestAnimationFrame(tick); else { drawDepth(performance.now(), 0); }

  /* ================= Bascules 3D : spring lerp, souris fine uniquement === */
  if (!reduce && finePointer) document.querySelectorAll("[data-tilt]").forEach(el => {
    const max = parseFloat(el.dataset.tilt) || 7;
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const apply = () => {
      cx += (tx - cx) * .16; cy += (ty - cy) * .16;
      el.style.transform = `perspective(1100px) rotateX(${cy.toFixed(2)}deg) rotateY(${tx.toFixed(2)}deg)`;
      if (Math.abs(tx - cx) > .02 || Math.abs(ty - cy) > .02) raf = requestAnimationFrame(apply); else raf = 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(apply); };
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - .5) * 2 * max;
      ty = -((e.clientY - r.top) / r.height - .5) * 2 * max;
      kick();
    });
    el.addEventListener("pointerleave", () => { tx = 0; ty = 0; kick(); });
  });

  /* ================= Révélation au défilement (stagger 80ms) ============ */
  const rio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { rio.unobserve(e.target); e.target.classList.add("in"); }
  }), { threshold: .12 });
  const cards = [...document.querySelectorAll(".card")];
  document.querySelectorAll(".rv").forEach(el => {
    const ci = cards.indexOf(el);
    if (ci >= 0) el.style.transitionDelay = (ci * 80) + "ms";
    rio.observe(el);
  });

  /* ================= Registre : compteur + LEDs ======================= */
  function countUp(el, delay) {
    const end = +el.dataset.count; if (reduce || !end) return;
    const start = performance.now() + delay, dur = 1400;
    el.textContent = "0";
    const step = now => {
      const k = clamp((now - start) / dur, 0, 1), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(end * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const leds = $("leds");
  for (let k = 0; k < 37; k++) leds.insertAdjacentHTML("beforeend", `<i class="${k < 6 ? "f" : ""}" style="--k:${k}"></i>`);
  let regDone = false;
  new IntersectionObserver(es => {
    if (es[0].isIntersecting && !regDone) { regDone = true; if (!reduce) { leds.classList.add("run"); countUp($("regNum"), 200); } }
  }, { threshold: .4 }).observe($("registry"));

  /* ================= Terminal ================= */
  const term = $("term");
  const tag = { ok: "[ok]", warn: "[!!]" };
  function lineEl(kind, text) {
    const s = document.createElement("span"); s.className = kind;
    if (tag[kind]) { const b = document.createElement("b"); b.textContent = tag[kind]; s.append(b, "  " + text); }
    else s.textContent = kind === "info" ? "  " + text : text;
    return s;
  }
  const caretEl = () => { const c = document.createElement("span"); c.className = "caret"; return c; };
  function renderStatic(sc) { term.textContent = ""; for (const [k, t] of sc) term.append(lineEl(k, t), "\n"); term.append(caretEl()); }
  async function runTerm(token) {
    await sleep(4200);
    let i = 0;
    while (token === termToken) {
      const sc = SCRIPTS[lang][i % 4];
      term.textContent = "";
      const caret = caretEl(); term.append(caret);
      for (const [kind, text] of sc) {
        if (token !== termToken) return;
        if (kind === "c") {
          const s = document.createElement("span"); s.className = "c"; term.insertBefore(s, caret);
          for (const ch of text) { if (token !== termToken) return; s.textContent += ch; await sleep(28 + Math.random() * 40); }
          term.insertBefore(document.createTextNode("\n"), caret); await sleep(350);
        } else {
          term.insertBefore(lineEl(kind, text), caret); term.insertBefore(document.createTextNode("\n"), caret);
          await sleep(kind === "info" ? 650 : 420);
        }
      }
      await sleep(3800); i++;
    }
  }
  function startTerm() { const token = ++termToken; renderStatic(SCRIPTS[lang][3]); if (!reduce) runTerm(token); }

  /* ================= U2 : exécution pas à pas ================= */
  const codeOut = $("codeOut");
  if (!reduce) {
    let ci = 0;
    setInterval(() => {
      const lines = document.querySelectorAll("#code span");
      lines.forEach(l => l.classList.remove("cur"));
      if (ci < lines.length) { lines[ci].classList.add("cur"); codeOut.style.opacity = .35; } else codeOut.style.opacity = 1;
      ci = (ci + 1) % (lines.length + 3);
    }, 650);
  }

  /* ================= Tableau de sprint (FLIP, 600ms ease-out) ========= */
  const lanes = [...document.querySelectorAll(".lane")];
  const dayEl = $("day"), burn = $("burn");
  const counts = () => lanes.forEach(l => { l.querySelector(".n").textContent = l.querySelectorAll(".tk").length; });
  const progress = () => { burn.style.width = (lanes[3].querySelectorAll(".tk").length / 6 * 100) + "%"; };
  counts(); progress();
  function move(card, lane) {
    const a = card.getBoundingClientRect(); lane.appendChild(card); const b = card.getBoundingClientRect();
    card.style.transition = "none"; card.style.transform = `translate(${a.left - b.left}px, ${a.top - b.top}px)`;
    card.getBoundingClientRect();
    card.style.transition = "transform .6s cubic-bezier(0.23,1,0.32,1)"; card.style.transform = "";
    counts(); progress();
  }
  let day = 6, tickN = 0, sprintVisible = false;
  new IntersectionObserver(es => { sprintVisible = es[0].isIntersecting; }).observe(document.querySelector(".sprint"));
  if (!reduce) setInterval(() => {
    if (!sprintVisible) return;
    const tkCards = [...document.querySelectorAll(".tk")].sort((x, y) => x.dataset.id - y.dataset.id);
    const pending = tkCards.filter(c => c.parentElement.dataset.l !== "3");
    if (!pending.length) { tkCards.forEach(c => move(c, lanes[0])); day = 1; dayEl.textContent = day; return; }
    const c = pending[tickN % Math.min(pending.length, 3)];
    move(c, lanes[+c.parentElement.dataset.l + 1]);
    tickN++; day = Math.min(10, day + (tickN % 2 ? 1 : 0)); dayEl.textContent = day;
  }, 1500);

  /* ================= Graphique FinOps (900ms ease-out) ================ */
  const months = ["J","F","M","A","M","J","J","A","S","O","N","D"];
  const used = [48,50,53,52,56,58,57,60,62,61,64,66];
  const before = [34,37,40,44,47,50,54,57,60,63,66,70];
  const after = before.map((v, i) => i < 4 ? v : Math.max(8, v * (i < 6 ? .55 : .22)));
  const X0 = 30, X1 = 580, Y0 = 236, YMAX = 150, Ytop = 18;
  const sx = i => X0 + (X1 - X0) * i / (months.length - 1);
  const sy = v => Y0 - (Y0 - Ytop) * v / YMAX;
  for (let k = 0; k <= 4; k++) { const y = Y0 - (Y0 - Ytop) * k / 4; $("grid").insertAdjacentHTML("beforeend", `<line x1="${X0}" x2="${X1}" y1="${y}" y2="${y}"${k ? ' stroke-dasharray="2 4"' : ""}/>`); }
  months.forEach((m, i) => $("xlab").insertAdjacentHTML("beforeend", `<text x="${sx(i)}" y="258">${m}</text>`));
  const aUsed = $("aUsed"), aWaste = $("aWaste");
  function area(top, bottom) {
    let d = `M${sx(0)} ${sy(top[0])}`;
    for (let i = 1; i < top.length; i++) d += ` L${sx(i)} ${sy(top[i])}`;
    for (let i = bottom.length - 1; i >= 0; i--) d += ` L${sx(i)} ${sy(bottom[i])}`;
    return d + " Z";
  }
  let cur = before.slice();
  function render(w) { aUsed.setAttribute("d", area(used, used.map(() => 0))); aWaste.setAttribute("d", area(used.map((u, i) => u + w[i]), used)); }
  render(cur);
  const bB = $("bBefore"), bA = $("bAfter");
  let anim;
  function goTo(target) {
    cancelAnimationFrame(anim);
    const from = cur.slice(), start = performance.now(), dur = reduce ? 1 : 900;
    const step = now => { const k = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - k, 3); cur = from.map((v, i) => v + (target[i] - v) * e); render(cur); if (k < 1) anim = requestAnimationFrame(step); };
    anim = requestAnimationFrame(step);
  }
  function setMode(isAfter) { bA.setAttribute("aria-pressed", isAfter); bB.setAttribute("aria-pressed", !isAfter); goTo(isAfter ? after : before); }
  bB.addEventListener("click", () => setMode(false));
  bA.addEventListener("click", () => setMode(true));
  let autoDone = false;
  new IntersectionObserver(es => { if (es[0].isIntersecting && !autoDone) { autoDone = true; setTimeout(() => setMode(true), 1400); } }, { threshold: .6 }).observe($("finChart"));
  if (reduce) $("graph").pauseAnimations();

  /* ================= Copier ================= */
  async function copyText(text, btn, restore, fallbackEl) {
    try { await navigator.clipboard.writeText(text); btn.textContent = MSG[lang].copied; }
    catch (x) { if (fallbackEl) { const r = document.createRange(); r.selectNodeContents(fallbackEl); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } btn.textContent = MSG[lang].selected; }
    setTimeout(() => { btn.textContent = restore(); }, 2200);
  }
  document.querySelectorAll(".copy[data-copy]").forEach(b => b.addEventListener("click", () => copyText(b.dataset.copy, b, () => tr("c.copy"), $("cPhone"))));

  /* ================= Formulaire (prépare la demande, aucun envoi serveur) ================= */
  const form = $("form"), err = $("fErr"), out = $("fOut"), txt = $("fText"), hint = $("fHint");
  function buildRequest(validate) {
    const m = MSG[lang];
    const name = form.fName.value.trim(), mail = form.fMail.value.trim(), msg = form.fMsg.value.trim();
    const type = form.fType.options[form.fType.selectedIndex].text;
    if (validate) {
      if (!name) { err.textContent = m.errName; form.fName.focus(); return; }
      if (!/^\S+@\S+\.\S+$/.test(mail)) { err.textContent = m.errMail; form.fMail.focus(); return; }
      if (msg.length < 10) { err.textContent = m.errMsg; form.fMsg.focus(); return; }
    }
    err.textContent = "";
    txt.textContent = `${m.subj} ${type}\n${m.from} ${name} <${mail}>\n\n${msg}`;
    hint.textContent = CONTACT.email ? m.readyTo(CONTACT.email) : m.ready;
    out.hidden = false;
  }
  form.addEventListener("submit", e => { e.preventDefault(); buildRequest(true); });
  $("fCopy").addEventListener("click", e => copyText(txt.textContent, e.currentTarget, () => MSG[lang].copy, txt));

  /* ============ Rail, bande cinétique, portrait, titres ============ */
  const railLinks = [...document.querySelectorAll(".rail a")], railFill = $("railFill");
  const kin = $("kinetic"), kinRows = [...document.querySelectorAll(".kin-row")];
  const pframe = document.querySelector(".pframe"), pimg = pframe.querySelector("img");
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    railFill.style.height = (clamp(scrollY / (max || 1), 0, 1) * 100).toFixed(2) + "%";
    let cur = 0;
    railLinks.forEach((a, i) => { const el = $(a.getAttribute("href").slice(1)); if (el && el.getBoundingClientRect().top < innerHeight * .45) cur = i; });
    railLinks.forEach((a, i) => a.classList.toggle("on", i === cur));
    const kr = kin.getBoundingClientRect();
    if (kr.bottom > 0 && kr.top < innerHeight && !reduce) {
      const p = (innerHeight - kr.top) / (innerHeight + kr.height);
      kinRows.forEach((row, i) => { const d = i % 2 ? 1 : -1; row.style.transform = `translate3d(${(d * (p - .5) * 44).toFixed(2)}vw,0,0)`; });
    }
    const pr = pframe.getBoundingClientRect();
    if (pr.bottom > 0 && pr.top < innerHeight && !reduce) {
      const c = (pr.top + pr.height / 2 - innerHeight / 2) / innerHeight;
      pimg.style.setProperty("--py", clamp(c * -30, -18, 18).toFixed(1) + "px");
    }
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  const GLYPHS = "01<>/\\[]{}#*+=_XNE";
  function scramble(el) {
    const gen = scrambleGen, final = el.textContent, len = final.length, t0 = performance.now(), dur = 750;
    el.style.minHeight = el.offsetHeight + "px";
    const step = now => {
      if (gen !== scrambleGen) { el.style.minHeight = ""; return; }
      const k = clamp((now - t0) / dur, 0, 1), upto = Math.floor(k * len);
      let out = "";
      for (let i = 0; i < len; i++) { const ch = final[i]; out += (i < upto || ch === " ") ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]; }
      el.textContent = out;
      if (k < 1) requestAnimationFrame(step); else { el.textContent = final; el.style.minHeight = ""; }
    };
    requestAnimationFrame(step);
  }
  if (!reduce) {
    const hio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { hio.unobserve(e.target); scramble(e.target); } }), { threshold: .6 });
    document.querySelectorAll("section h2").forEach(h => hio.observe(h));
  }

  const bomBody = $("bomBody");
  [...bomBody.rows].forEach((r, i) => r.style.setProperty("--r", i));
  if (!reduce) {
    const sio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { sio.unobserve(e.target); e.target.classList.add("scan"); } }), { threshold: .45 });
    sio.observe(pframe); sio.observe(bomBody);
  }

  /* ================= Démarrage ================= */
  $("langFr").addEventListener("click", () => applyLang("fr", true));
  $("langEn").addEventListener("click", () => applyLang("en", true));
  applyLang(detectLang(), false);
  setTimeout(() => document.documentElement.classList.remove("nx-intro"), 2300);
})();
