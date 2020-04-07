const navs = document.querySelectorAll('#breadcrumbs select');
const urlPaths = window.location.pathname.split('/');

urlPaths.pop();
urlPaths.shift();

navs.forEach(nav => {
  nav.addEventListener('input', event => {
    const target = <HTMLInputElement>event.target;
    const data = target.dataset;
    let index = -1;

    if (data) {
      index = parseInt(data.depth!);
    }

    if (index !== -1) {
      urlPaths[index] = target?.value.slice(0, -1);

      window.location.pathname = urlPaths
        .slice(0, index + 1)
        .reduce((urls, url) => `${urls}/${url}`, '');
    }
  });
});
