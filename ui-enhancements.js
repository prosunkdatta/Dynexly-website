// UI Enhancements
document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nav = document.querySelector('nav');
    if (nav) {
        nav.classList.remove('glass-header');
        window.addEventListener('scroll', () => nav.classList.toggle('scrolled-nav', window.scrollY > 40));
        if (window.scrollY > 40) nav.classList.add('scrolled-nav');
    }

    const mMenu = document.getElementById("mobile-menu"), mToggleBtn = document.querySelector('[onclick="toggleMenu()"]') || document.querySelector('button[id$="toggle"]');
    if (mMenu && !prefersReducedMotion && window.gsap && mToggleBtn) {
        let isOpen = false;
        gsap.set(mMenu, { xPercent: 100, display: "none" });
        const toggle = (e) => {
            if(e) e.stopPropagation();
            isOpen = !isOpen;
            if(isOpen) {
                gsap.set(mMenu, { display: "flex" });
                gsap.to(mMenu, { xPercent: 0, duration: 0.3, ease: "power2.out" });
                document.body.style.overflow = "hidden";
                mMenu.classList.remove('hidden');
            } else {
                gsap.to(mMenu, { xPercent: 100, duration: 0.3, ease: "power2.out", onComplete: () => gsap.set(mMenu, { display: "none" }) });
                document.body.style.overflow = "";
            }
        };
        const newToggle = mToggleBtn.cloneNode(true);
        if(mToggleBtn.parentNode) { mToggleBtn.parentNode.replaceChild(newToggle, mToggleBtn); newToggle.addEventListener("click", toggle); }
        const cBtn = document.getElementById("mobile-close");
        if(cBtn) { const ncBtn = cBtn.cloneNode(true); cBtn.parentNode.replaceChild(ncBtn, cBtn); ncBtn.addEventListener("click", toggle); }
        document.querySelectorAll(".mobile-link").forEach(l => { const nl = l.cloneNode(true); l.parentNode.replaceChild(nl, l); nl.addEventListener("click", () => isOpen && toggle()); });
    }

    if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
        gsap.registerPlugin(ScrollTrigger);
        const cards = document.querySelectorAll(['.glass-card', '.anim-card', '.team-card', '.project-card', '.research-card'].join(', '));
        cards.forEach(c => c.classList.add('gsap-reveal'));
        ScrollTrigger.batch('.gsap-reveal', {
            onEnter: b => gsap.fromTo(b, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.12, overwrite: "auto" }),
            start: "top 85%", once: true
        });

        document.querySelectorAll('.stat-number').forEach(el => {
            let obj = { val: 0 }, tVal = parseInt(el.getAttribute('data-target')) || 30;
            ScrollTrigger.create({
                trigger: el.closest('.anim-stat, .glass-card, section') || el.parentElement,
                start: 'top 85%', once: true,
                onEnter: () => gsap.to(obj, { val: tVal, duration: 1.2, ease: 'power2.out', onUpdate: () => el.textContent = Math.floor(obj.val) })
            });
        });
    }

    document.querySelectorAll('a[href^="#"], a[href*="index.html#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const h = this.getAttribute('href'), tid = h.startsWith('#') ? h.substring(1) : (window.location.pathname.endsWith('index.html') && h.includes('index.html#') ? h.split('#')[1] : '');
            if (tid) {
                const tel = document.getElementById(tid);
                if (tel && !('scrollBehavior' in document.documentElement.style)) {
                    e.preventDefault();
                    const tp = tel.getBoundingClientRect().top + window.pageYOffset - 80, sp = window.pageYOffset, d = tp - sp; let st = null;
                    const anim = (ct) => { if(!st) st = ct; const te = ct - st, r = (-d * (te/600) * ((te/600) - 2) + sp); window.scrollTo(0, Math.floor(r)); if(te < 600) requestAnimationFrame(anim); };
                    requestAnimationFrame(anim);
                }
            }
        });
    });

    const secs = document.querySelectorAll('section[id]'), nlList = document.querySelectorAll('.nav-link');
    if (secs.length && nlList.length) {
        const obs = new IntersectionObserver(ents => {
            ents.forEach(e => {
                if (e.isIntersecting) {
                    nlList.forEach(l => {
                        const h = l.getAttribute('href');
                        if (h && (h === `#${e.target.id}` || (window.location.pathname.endsWith('index.html') && h === `index.html#${e.target.id}`))) {
                            nlList.forEach(lnk => lnk.classList.remove('active')); l.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.3, rootMargin: "-100px 0px 0px 0px" });
        secs.forEach(s => obs.observe(s));
    }
});
