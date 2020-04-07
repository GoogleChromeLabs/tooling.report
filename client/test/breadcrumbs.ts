const navs = document.querySelectorAll('#breadcrumbs select');
const urlPaths = window.location.pathname.split('/');

urlPaths.pop();
urlPaths.shift();

navs.forEach(nav => {
  nav.addEventListener('input', event => {
    const target = <HTMLInputElement>event.target;
    const index = target.dataset?.depth ? parseInt(target.dataset.depth!) : -1;

    if (index === -1) return;

    urlPaths[index] = target?.value.slice(0, -1);

    window.location.pathname = urlPaths
      .slice(0, index + 1)
      .reduce((urls, url) => `${urls}/${url}`, '');
  });
});
