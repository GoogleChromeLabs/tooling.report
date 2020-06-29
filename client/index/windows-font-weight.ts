const ua = navigator.userAgent;

if (ua.includes('Windows') && ua.includes('Chrome')) {
  document.documentElement.style.setProperty('--font-weight--light', '400');
}
