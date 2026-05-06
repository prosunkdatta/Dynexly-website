// UI Enhancements & Interactions – Dynexly (2026)
document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ── Navigation scroll transparency ──────────────────────
  const nav = document.querySelector("nav");
  if (nav) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        nav.classList.add("scrolled-nav");
      } else {
        nav.classList.remove("scrolled-nav");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }

  // ── Smooth scroll for hash links ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offsetPosition =
          target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        closeMobileMenu();
      }
    });
  });

  // ── Active section tracking ──────────────────────────────
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (sections.length && navLinks.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.remove("active");
              const href = link.getAttribute("href");
              if (
                href === "#" + entry.target.id ||
                href === "index.html#" + entry.target.id
              ) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" }
    );
    sections.forEach((sec) => obs.observe(sec));
  }

  // ── Mobile menu ──────────────────────────────────────────
  const mMenu = document.getElementById("mobile-menu");
  const mToggleBtn = document.getElementById("mobile-toggle");
  const mCloseBtn = document.getElementById("mobile-close");
  let isOpen = false;

  function openMobileMenu() {
    if (!mMenu || !window.gsap) return;
    isOpen = true;
    mMenu.style.display = "flex";
    gsap.fromTo(mMenu, { xPercent: 100 }, { xPercent: 0, duration: 0.3, ease: "power2.out" });
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    if (!mMenu || !isOpen) return;
    if (window.gsap) {
      gsap.to(mMenu, {
        xPercent: 100,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => { mMenu.style.display = "none"; },
      });
    } else {
      mMenu.style.display = "none";
    }
    isOpen = false;
    document.body.style.overflow = "";
  }

  if (mMenu && mToggleBtn) {
    mToggleBtn.addEventListener("click", () => {
      isOpen ? closeMobileMenu() : openMobileMenu();
    });
  }
  if (mCloseBtn) {
    mCloseBtn.addEventListener("click", closeMobileMenu);
  }
  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // ── GSAP reveal animations ───────────────────────────────
  if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const heroEls = ["#hero-heading", "#hero-text", "#hero-buttons"]
      .map((s) => document.querySelector(s))
      .filter(Boolean);
    if (heroEls.length) {
      gsap.to(heroEls, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
        delay: 0.2,
      });
    }

    // Highlight word pulse on hero enter
    ScrollTrigger.create({
      trigger: "#home",
      start: "top top",
      end: "bottom center",
      onEnter: () =>
        gsap.to("#highlight-word", {
          color: "#A8D8F0",
          scale: 1.05,
          textShadow: "0 0 10px rgba(168,216,240,0.5)",
          duration: 0.5,
          yoyo: true,
          repeat: 1,
        }),
    });

    // Card reveal stagger
    ScrollTrigger.batch(".card-reveal", {
      interval: 0.1,
      batchMax: 3,
      onEnter: (batch) =>
        gsap.fromTo(
          batch,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1,
            overwrite: "auto",
          }
        ),
      start: "top 85%",
      once: true,
    });

    // Stats counter
    document.querySelectorAll(".stat-number").forEach((el) => {
      const obj = { val: 0 };
      const tVal = parseInt(el.getAttribute("data-target")) || 10;
      ScrollTrigger.create({
        trigger: el.closest("section") || el.parentElement,
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(obj, {
            val: tVal,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => (el.textContent = Math.floor(obj.val)),
          }),
      });
    });
  }

  // ── Leadership card icon rotation ────────────────────────
  const leadCard = document.getElementById("leadership-card-el");
  const leadIcon = document.getElementById("leadership-svg");
  if (leadCard && leadIcon && !prefersReducedMotion) {
    let baseRot = 0;
    let speed = 0.2;
    let targetSpeed = 0.2;

    const animRotation = () => {
      baseRot += speed;
      leadIcon.style.transform = `rotate(${baseRot}deg)`;
      speed += (targetSpeed - speed) * 0.05;
      requestAnimationFrame(animRotation);
    };
    requestAnimationFrame(animRotation);

    leadCard.addEventListener("mousemove", (e) => {
      const rect = leadCard.getBoundingClientRect();
      leadCard.style.setProperty("--mouse-x", e.clientX - rect.left + "px");
      leadCard.style.setProperty("--mouse-y", e.clientY - rect.top + "px");
      targetSpeed = 1.0;
    });
    leadCard.addEventListener("mouseleave", () => {
      targetSpeed = 0.2;
    });
  }
});
