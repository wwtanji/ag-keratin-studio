const STRAND_SELECTOR = '.strand';
const RANGE_SELECTOR = '[data-smooth-range]';
const NUMBER_PATTERN = /-?\d+(?:\.\d+)?/g;
const START_VALUE = 0;
const END_VALUE = 85;
const INTRO_MS = 2600;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const strands = [...document.querySelectorAll(STRAND_SELECTOR)];
const range = document.querySelector(RANGE_SELECTOR);

function interpolate(from, to, amount) {
  const targets = to.match(NUMBER_PATTERN).map(Number);
  let position = 0;
  return from.replace(NUMBER_PATTERN, (value) => {
    const start = Number(value);
    const end = targets[position];
    position += 1;
    return String(Number((start + (end - start) * amount).toFixed(1)));
  });
}

function render(value) {
  const amount = value / 100;
  strands.forEach((strand) => {
    strand.setAttribute('d', interpolate(strand.dataset.frizzy, strand.dataset.smooth, amount));
  });
}

function playIntro() {
  const startedAt = performance.now();
  function frame(now) {
    const progress = Math.min(1, (now - startedAt) / INTRO_MS);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = START_VALUE + (END_VALUE - START_VALUE) * eased;
    range.value = String(Math.round(value));
    render(value);
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

range.addEventListener('input', () => render(Number(range.value)));

if (matchMedia(REDUCED_MOTION_QUERY).matches) {
  render(Number(range.value));
} else {
  render(START_VALUE);
  playIntro();
}
