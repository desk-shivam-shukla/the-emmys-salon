import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initLenis() {
  if (reducedMotion) return null;

  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

function initAnchorScroll(lenis: Lenis | null) {
  document.querySelectorAll<HTMLAnchorElement>('a[data-scroll]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href?.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      if (lenis) {
        lenis.scrollTo(target as HTMLElement, { offset: -80 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initReveals() {
  if (reducedMotion) {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.remove('reveal');
    });
    return;
  }

  gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((container) => {
    const items = container.querySelectorAll('.reveal-child');
    gsap.from(items, {
      opacity: 0,
      y: 24,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
      },
    });
  });
}

function initNavSpy() {
  const sections = ['concept', 'menu', 'staff', 'gallery', 'access'];
  const links = new Map<string, HTMLAnchorElement>();
  document.querySelectorAll<HTMLAnchorElement>('a[data-nav]').forEach((link) => {
    const id = link.dataset.nav;
    if (id) links.set(id, link);
  });

  sections.forEach((id) => {
    const section = document.getElementById(id);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        const link = links.get(id);
        if (!link) return;
        if (self.isActive) {
          links.forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      },
    });
  });
}

function initHeroSequence() {
  if (reducedMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
  tl.from('[data-hero="title"]', { opacity: 0, y: 30, duration: 1 })
    .from('[data-hero="tagline"]', { opacity: 0, y: 20, duration: 0.8 }, '-=0.5')
    .from('[data-hero="cta"]', { opacity: 0, y: 16, duration: 0.7 }, '-=0.4');
}

function initStaffMotion() {
  if (reducedMotion) return;
  const section = document.getElementById('staff');
  if (!section) return;

  gsap.from('#staff [data-staff="photo"]', {
    x: -40,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: { trigger: section, start: 'top 75%' },
  });
  gsap.from('#staff [data-staff="copy"]', {
    x: 40,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: { trigger: section, start: 'top 75%' },
  });
}

export function initSpaMotion() {
  const lenis = initLenis();
  initAnchorScroll(lenis);
  initHeroSequence();
  initReveals();
  initStaffMotion();
  initNavSpy();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSpaMotion);
} else {
  initSpaMotion();
}
