const breadcrumbs = document.querySelector('#breadcrumbs');
const navs = document.querySelectorAll('#breadcrumbs select') as NodeListOf<
  HTMLSelectElement
>;
const allowedKeys = new Set(['Tab', 'Enter', ' ']);
const preventedKeys = new Set(['ArrowUp', 'ArrowDown']);

for (const nav of navs) {
  let ignoreChange = false;

  nav.addEventListener('change', event => {
    if (ignoreChange) return;
    const target = event.target as HTMLSelectElement;
    window.location.pathname = target.value;
  });

  nav.addEventListener('keydown', ({ key }) => {
    if (preventedKeys.has(key)) {
      ignoreChange = true;
    } else if (allowedKeys.has(key)) {
      ignoreChange = false;
    }
  });
}
