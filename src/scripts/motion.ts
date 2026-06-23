// One Lenis + GSAP loop drives all motion. Reveals fade up on scroll, photos
// clip-path wipe in, and the home page opens with the vision intro once per
// session. Everything degrades: reduced motion or a failed import leaves the
// content visible and static.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const PREFERS_REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_MOBILE = matchMedia('(max-width: 760px)').matches;
const INTRO_FLAG = 'vp_intro_seen';

function setupThemeToggle() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const cur = root.getAttribute('data-theme');
    const sysDark = matchMedia('(prefers-color-scheme: dark)').matches;
    let next: 'light' | 'dark';
    if (cur === 'dark') next = 'light';
    else if (cur === 'light') next = 'dark';
    else next = sysDark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('vp_theme', next); } catch { /* storage blocked */ }
  });
}

function showAllReveals() {
  document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => { el.style.opacity = '1'; });
}

function runIntro(onDone: () => void): boolean {
  const intro = document.getElementById('intro');
  if (!intro) return false;

  let seen = false;
  try { seen = sessionStorage.getItem(INTRO_FLAG) === '1'; } catch { /* ignore */ }
  if (seen) { intro.style.display = 'none'; return false; }
  try { sessionStorage.setItem(INTRO_FLAG, '1'); } catch { /* ignore */ }

  const finish = () => {
    intro.style.display = 'none';
    onDone();
  };

  gsap.set('#heroImg', { scale: 1.16 });
  const tl = gsap.timeline({ onComplete: finish });
  tl.to('.word', { opacity: 1, duration: .55, ease: 'power2.out' })
    .to('.skip', { opacity: 1, duration: .3 }, '<')
    .to('.lid.top', { yPercent: -14, duration: .55, ease: 'power2.inOut' }, '+=.25')
    .to('.lid.bottom', { yPercent: 14, duration: .55, ease: 'power2.inOut' }, '<')
    .to('.word', { opacity: 0, duration: .4, ease: 'power1.out' }, '<.05')
    .to('.skip', { opacity: 0, duration: .3 }, '<')
    .to('.lid.top', { yPercent: -101, duration: 1.1, ease: 'expo.inOut' }, '+=.12')
    .to('.lid.bottom', { yPercent: 101, duration: 1.1, ease: 'expo.inOut' }, '<')
    .to('#heroImg', { scale: 1, duration: 1.6, ease: 'expo.out' }, '<')
    .fromTo('.hero .reveal', { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .14 }, '-=.7');

  // Keep it under two seconds on phones by compressing the whole timeline.
  if (IS_MOBILE) tl.timeScale(1.9);

  // Tap to skip jumps to the end.
  const skip = () => tl.progress(1);
  intro.addEventListener('click', skip);
  const skipBtn = intro.querySelector('.skip');
  if (skipBtn) skipBtn.addEventListener('click', skip);

  return true;
}

function init() {
  setupThemeToggle();

  if (PREFERS_REDUCED) {
    showAllReveals();
    const intro = document.getElementById('intro');
    if (intro) intro.style.display = 'none';
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  const startScroll = () => lenis.start();
  const introRunning = runIntro(startScroll);
  if (introRunning) lenis.stop();

  // Scroll reveals. The hero reveals are handled inside the intro timeline.
  gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.fromTo(el, { opacity: 0, y: 42 }, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  // If the hero exists but the intro did not run this load, reveal it normally.
  if (!introRunning) {
    gsap.utils.toArray<HTMLElement>('.hero .reveal').forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .12 });
    });
  }

  // Clip-path wipes for cover tiles and category covers.
  gsap.utils.toArray<HTMLElement>('.shot, .cat').forEach((el) => {
    const ph = el.querySelector('.ph');
    if (!ph) return;
    gsap.fromTo(ph, { clipPath: 'inset(100% 0 0 0)' }, {
      clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  // Story image opens from the center band.
  const storyImg = document.querySelector('.story-img .ph');
  if (storyImg) {
    gsap.fromTo('.story-img .ph', { clipPath: 'inset(40% 0 40% 0)', scale: 1.12 }, {
      clipPath: 'inset(0 0 0 0)', scale: 1, duration: 1.5, ease: 'expo.out',
      scrollTrigger: { trigger: '.story-img', start: 'top 80%' },
    });
  }
}

init();
