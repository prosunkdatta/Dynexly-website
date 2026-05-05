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
        nav.classList.remove("bg-transparent");
      } else {
        nav.classList.remove("scrolled-nav");
      }
    };
    window.addEventListener("scroll", handleScroll);
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
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        closeMobileMenu();
      }
    });
  });

  // ── Active section tracking ────────────────────────────
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

  // ── Mobile menu ────────────────────────────────────────
  const mMenu = document.getElementById("mobile-menu");
  const mToggleBtn = document.getElementById("mobile-toggle");
  const cBtn = document.getElementById("mobile-close");

  function closeMobileMenu() {
    if (!mMenu || !window.gsap) return;
    gsap.to(mMenu, {
      xPercent: 100,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        mMenu.classList.add("hidden");
        gsap.set(mMenu, { display: "none" });
      },
    });
    document.body.style.overflow = "";
  }

  function openMobileMenu() {
    if (!mMenu || !window.gsap) return;
    mMenu.classList.remove("hidden");
    gsap.set(mMenu, { display: "flex" });
    gsap.to(mMenu, {
      xPercent: 0,
      duration: 0.3,
      ease: "power2.out",
    });
    document.body.style.overflow = "hidden";
  }

  if (mMenu && mToggleBtn && window.gsap) {
    let isOpen = false;
    gsap.set(mMenu, { xPercent: 100, display: "none" });

    mToggleBtn.addEventListener("click", () => {
      isOpen = !isOpen;
      if (isOpen) openMobileMenu();
      else closeMobileMenu();
    });

    if (cBtn) {
      cBtn.addEventListener("click", () => {
        isOpen = false;
        closeMobileMenu();
      });
    }

    // Close when a mobile menu link is clicked
    document.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", () => {
        isOpen = false;
        closeMobileMenu();
      });
    });
  }

  // ── GSAP reveal animations ─────────────────────────────
  if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance (optional IDs: hero-heading, hero-text, hero-buttons)
    const heroHeading = document.getElementById("hero-heading");
    const heroText = document.getElementById("hero-text");
    const heroButtons = document.getElementById("hero-buttons");
    if (heroHeading || heroText || heroButtons) {
      gsap.to([heroHeading, heroText, heroButtons], {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      });
    }

    // Highlight word pulse
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

    // Batch reveal for cards
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
      const tVal = parseInt(el.getAttribute("data-target")) || 30;
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

  // ── Leadership card icon rotation ───────────────────────
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

    leadCard.addEventListener("mousemove", () => {
      targetSpeed = 1.0;
    });
    leadCard.addEventListener("mouseleave", () => {
      targetSpeed = 0.2;
    });
  }
});