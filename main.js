let interactionsInitialized = false;

function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  setTimeout(() => {
    preloader.classList.add("is-hidden");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 350);
  }, 650);
}

function initPageInteractions() {
  if (interactionsInitialized) return;
  interactionsInitialized = true;
  initMobileMenu();
  initShowcaseCarousel();
  initCardsCarousel();
}

function initShowcaseCarousel() {
  const trackWrap = document.querySelector(".sc-track-wrap");
  const track = document.querySelector(".sc-track");
  const slides = track ? [...track.querySelectorAll(".sc-slide")] : [];
  const prevBtn = document.querySelector(".sc-prev");
  const nextBtn = document.querySelector(".sc-next");
  const dotsContainer = document.querySelector(".sc-dots");
  if (!track || !slides.length) return;

  const scInner    = document.getElementById("scInner");
  const scTagline  = document.getElementById("scTagline");
  const scDesc     = document.getElementById("scDesc");
  const scFeatures = document.getElementById("scFeatures");
  const scCta      = document.getElementById("scCta");

  const slideData = [
    {
      tagline: "Naplata s dlana, gdje god poslujete",
      desc: "Prijenosni Android POS terminal povezan s Fiskator sustavom — naplaćujte karticom i gotovinom, ispisujte fiskalne račune i pratite promet u stvarnom vremenu, bez fiksne blagajne.",
      features: [
        "Kartično i gotovinsko plaćanje na jednom uređaju",
        "Ugrađeni fiskalni pisač",
        "Idealno za teren — dostava, sajmovi, ugostiteljstvo",
        "Sinkronizacija s Fiskator sustavom u stvarnom vremenu",
      ],
      cta: "Zatražite ponudu",
    },
    {
      tagline: "Fiskalna blagajna za sve djelatnosti",
      desc: "Naš POS program za fiskalizaciju 2.0 — moderan, brz i prilagođen hrvatskim propisima. Upravljajte prodajom, računima i izvještajima s jednog mjesta, bez komplikacija.",
      features: [
        "Fiskalizacija 2.0 u skladu s propisima",
        "POS prodaja — gotovina, kartica, transakcijski",
        "Artikli, popusti, dnevni izvještaji",
        "Lokalna instalacija i podrška",
      ],
      cta: "Zatražite demo",
    },
    {
      tagline: "Vaš brand u džepu korisnika",
      desc: "Razvijamo native i cross-platform mobilne aplikacije za iOS i Android. Od ideje i dizajna do objave na App Storeu i Google Playu — sve na jednom mjestu.",
      features: [
        "iOS & Android podrška",
        "Native performanse i glatke animacije",
        "Push notifikacije i offline mod",
        "Integracija s postojećim sustavima",
      ],
      cta: "Zatražite ponudu",
    },
  ];

  let current = 0;
  let isAnimating = false;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "sc-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Slide ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    dotsContainer.querySelectorAll(".sc-dot").forEach((d, i) => {
      d.classList.toggle("active", i === current);
    });
  }

  function updateBtns() {
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === slides.length - 1;
  }

  function updateTrackHeight() {
    if (trackWrap) trackWrap.style.height = `${slides[current].offsetHeight}px`;
  }

  function applyText(data) {
    if (scTagline)  scTagline.textContent = data.tagline;
    if (scDesc)     scDesc.textContent = data.desc;
    if (scFeatures) scFeatures.innerHTML = data.features
      .map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`)
      .join("");
    if (scCta)      scCta.textContent = data.cta;
  }

  function goTo(index) {
    if (isAnimating && index !== 0) return;
    const next = Math.max(0, Math.min(index, slides.length - 1));
    if (next === current && index !== 0) return;
    isAnimating = true;

    const slideWidth = trackWrap.clientWidth;
    track.style.transform = `translateX(-${next * slideWidth}px)`;
    current = next;
    updateTrackHeight();
    updateDots();
    updateBtns();

    // Animate text out → swap → in via CSS transition
    if (scInner) {
      scInner.classList.add("sc-fading");
      setTimeout(() => {
        applyText(slideData[current]);
        scInner.classList.remove("sc-fading");
        isAnimating = false;
      }, 230);
    } else {
      applyText(slideData[current]);
      isAnimating = false;
    }
  }

  prevBtn && prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener("click", () => goTo(current + 1));

  let touchStartX = 0;
  trackWrap.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  trackWrap.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
  }, { passive: true });

  // Init without text animation
  const slideWidth = trackWrap.clientWidth;
  track.style.transform = `translateX(0)`;
  updateTrackHeight();
  updateDots();
  updateBtns();
  window.addEventListener("resize", updateTrackHeight);
  if ("ResizeObserver" in window) {
    const slideObserver = new ResizeObserver(updateTrackHeight);
    slides.forEach((slide) => slideObserver.observe(slide));
  }
}

function initMobileMenu() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("mobileMenu");

  const setScrollLock = (locked) => {
    document.body.style.overflow = locked ? "hidden" : "";
    document.documentElement.style.overflow = locked ? "hidden" : "";
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
    setScrollLock(isOpen);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", false);
      setScrollLock(false);
    });
  });
}

function initCardsCarousel() {
  const carousel = document.getElementById("portfolioCarousel");
  const track = document.querySelector(".portfolio-track");
  const cards = track ? [...track.querySelectorAll(".portfolio-card")] : [];
  const prevBtn = document.querySelector(".portfolio-nav-btn.prev");
  const nextBtn = document.querySelector(".portfolio-nav-btn.next");
  const dots = [...document.querySelectorAll(".portfolio-nav-dot")];
  if (!carousel || !track || !cards.length) return;

  let pageCount = 3;
  let currentPage = 0;
  let maxOffset = 0;
  let pageOffsets = [0];
  let dragging = false;
  let dragStartX = 0;
  let dragStartOffset = 0;
  let resizeTimer;
  let lastViewportWidth = document.documentElement.clientWidth;

  function isMobile() { return window.innerWidth <= 600; }

  function getViewWidth() {
    const style = getComputedStyle(carousel);
    return carousel.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  }

  function measure() {
    const mobile = isMobile();
    pageCount = mobile ? cards.length : Math.min(3, cards.length);

    const viewWidth = getViewWidth();
    const trackRect = track.getBoundingClientRect();
    const metrics = cards.map((card) => {
      const r = card.getBoundingClientRect();
      return { left: r.left - trackRect.left, width: r.width };
    });

    const trackWidth = metrics[cards.length - 1].left + metrics[cards.length - 1].width;
    maxOffset = Math.max(0, Math.round(trackWidth - viewWidth));

    pageOffsets = [];
    if (mobile) {
      for (let p = 0; p < pageCount; p++) {
        pageOffsets.push(Math.max(0, Math.min(Math.round(metrics[p].left), maxOffset)));
      }
    } else {
      for (let p = 0; p < pageCount; p++) {
        if (p === 0) {
          pageOffsets.push(0);
        } else if (p === pageCount - 1) {
          pageOffsets.push(maxOffset);
        } else {
          const innerFirst = metrics[1];
          const innerLast = metrics[cards.length - 2];
          const groupCenter = (innerFirst.left + innerLast.left + innerLast.width) / 2;
          const target = groupCenter - viewWidth / 2;
          pageOffsets.push(Math.max(0, Math.min(Math.round(target), maxOffset)));
        }
      }
    }
  }

  function applyOffset(px) {
    track.style.transform = `translate3d(${-Math.round(px)}px, 0, 0)`;
  }

  function updateUI() {
    dots.forEach((dot, i) => {
      if (i >= pageCount) {
        dot.hidden = true;
        return;
      }
      dot.hidden = false;
      const active = i === currentPage;
      dot.classList.toggle("active", active);
      dot.setAttribute("aria-selected", active ? "true" : "false");
    });
    if (prevBtn) prevBtn.disabled = currentPage === 0;
    if (nextBtn) nextBtn.disabled = currentPage === pageCount - 1;
  }

  function goToPage(page, animate = true) {
    measure();
    page = Math.max(0, Math.min(page, pageCount - 1));
    currentPage = page;
    track.classList.toggle("is-dragging", !animate);
    applyOffset(pageOffsets[page] ?? 0);
    if (!animate) track.classList.remove("is-dragging");
    updateUI();
  }

  function nearestPage(offset) {
    let closest = 0;
    let minDist = Infinity;
    pageOffsets.forEach((pos, p) => {
      const dist = Math.abs(pos - offset);
      if (dist < minDist) {
        minDist = dist;
        closest = p;
      }
    });
    return closest;
  }

  prevBtn && prevBtn.addEventListener("click", () => goToPage(currentPage - 1));
  nextBtn && nextBtn.addEventListener("click", () => goToPage(currentPage + 1));

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const page = parseInt(dot.dataset.page, 10);
      if (!Number.isNaN(page)) goToPage(page);
    });
  });

  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goToPage(currentPage + 1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToPage(currentPage - 1);
    }
  });

  carousel.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging = true;
    dragStartX = e.clientX;
    dragStartOffset = pageOffsets[currentPage] ?? 0;
    carousel.classList.add("is-grabbing");
    track.classList.add("is-dragging");
    carousel.setPointerCapture(e.pointerId);
  });

  carousel.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    const offset = Math.max(0, Math.min(dragStartOffset - dx, maxOffset));
    applyOffset(offset);
  });

  carousel.addEventListener("pointerup", (e) => {
    if (!dragging) return;
    dragging = false;
    carousel.classList.remove("is-grabbing");
    track.classList.remove("is-dragging");
    carousel.releasePointerCapture(e.pointerId);

    const dx = e.clientX - dragStartX;
    if (Math.abs(dx) > carousel.clientWidth * 0.12) {
      goToPage(dx > 0 ? currentPage - 1 : currentPage + 1);
    } else {
      const offset = Math.max(0, Math.min(dragStartOffset - dx, maxOffset));
      goToPage(nearestPage(offset));
    }
  });

  carousel.addEventListener("pointercancel", () => {
    dragging = false;
    carousel.classList.remove("is-grabbing");
    track.classList.remove("is-dragging");
    goToPage(currentPage);
  });

  window.addEventListener("resize", () => {
    const viewportWidth = document.documentElement.clientWidth;
    if (viewportWidth === lastViewportWidth) return;
    lastViewportWidth = viewportWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      measure();
      goToPage(currentPage, false);
    }, 150);
  });

  measure();
  goToPage(0, false);

  requestAnimationFrame(() => {
    measure();
    goToPage(0, false);
  });
}

function initMarquee() {
  const marquee = document.querySelector(".clients-marquee");
  const track = document.querySelector(".clients-track");
  if (!marquee || !track) return;

  function measure() {
    const halfWidth = track.scrollWidth / 2;
    if (halfWidth <= 10) return;
    const duration = halfWidth / 36;
    track.style.setProperty("--marquee-duration", `${duration}s`);
    track.classList.add("is-animated");
  }

  marquee.addEventListener("mouseenter", () => track.classList.add("is-paused"));
  marquee.addEventListener("mouseleave", () => track.classList.remove("is-paused"));
  marquee.addEventListener("focusin", () => track.classList.add("is-paused"));
  marquee.addEventListener("focusout", () => track.classList.remove("is-paused"));
  if ("ResizeObserver" in window) {
    new ResizeObserver(measure).observe(marquee);
  } else {
    let lastViewportWidth = document.documentElement.clientWidth;
    window.addEventListener("resize", () => {
      const viewportWidth = document.documentElement.clientWidth;
      if (viewportWidth === lastViewportWidth) return;
      lastViewportWidth = viewportWidth;
      measure();
    });
  }
  measure();
}

initPreloader();
initMarquee();
initPageInteractions();
