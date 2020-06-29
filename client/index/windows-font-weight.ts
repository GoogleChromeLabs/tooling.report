const ua = navigator.userAgent;

if (ua.includes('Windows') && ua.includes('Chrome')) {
  document.body.parentElement?.style.setProperty('--font-weight--light', '400');
}
