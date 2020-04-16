const breadcrumbs = document.querySelector('#breadcrumbs');
const navs = document.querySelectorAll('#breadcrumbs select') as NodeListOf<
  HTMLSelectElement
>;
const urlPaths = window.location.pathname.split('/').slice(1, -1);

let ignoreChange = false;

const allowedKeys = new Set(['Tab', 'Enter', ' ']);
const preventedKeys = new Set(['ArrowUp', 'ArrowDown']);

window.onload = () => {
  breadcrumbs?.lastElementChild?.scrollIntoView({
    block: 'nearest',
    inline: 'end',
  });
};

for (const nav of navs) {
  nav.addEventListener('change', event => {
    const target = event.target as HTMLSelectElement;
    const index = target.dataset.depth ? parseInt(target.dataset.depth) : -1;

    if (index === -1 || ignoreChange) return;

    urlPaths[index] = target.value.slice(0, -1);

    window.location.pathname = urlPaths.slice(0, index + 1).join('/');
  });

  nav.addEventListener('keydown', ({ key }) => {
    if (preventedKeys.has(key)) {
      ignoreChange = true;
    } else if (allowedKeys.has(key)) {
      ignoreChange = false;
    }
  });
}
