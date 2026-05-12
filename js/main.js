/* Header scroll */
const header = document.querySelector('.site-header');
const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Hamburger */
const hamburger = document.querySelector('.hamburger');
const spMenu    = document.querySelector('.sp-menu');
if (hamburger && spMenu) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('is-open');
    spMenu.style.display = open ? 'flex' : 'none';
    requestAnimationFrame(() => spMenu.classList.toggle('is-open', open));
  });
  spMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('is-open');
      spMenu.classList.remove('is-open');
      setTimeout(() => { spMenu.style.display = 'none'; }, 400);
    });
  });
}

/* Fade-in on scroll */
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
fadeEls.forEach(el => observer.observe(el));

/* Works filter (works.html) */
const filterBtns = document.querySelectorAll('.filter-btn');
const workItems  = document.querySelectorAll('.work-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const cat = btn.dataset.cat;
    workItems.forEach(item => {
      const show = cat === 'ALL' || item.dataset.cat === cat;
      item.style.display = show ? '' : 'none';
    });
  });
});
