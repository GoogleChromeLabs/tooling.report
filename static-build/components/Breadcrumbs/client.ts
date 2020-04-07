const navs = document.querySelectorAll('#breadcrumbs select');
const urlPath = window.location.pathname.split('/');

urlPath.pop();
urlPath.shift();

navs.forEach(nav => {
  nav.addEventListener('input', event => {
    const target = <HTMLInputElement>event.target;
    const data = target.dataset;
    let index = -1;

    if (data) {
      index = parseInt(data.depth!);
    }

    if (index !== -1) {
      urlPath[index] = target?.value.slice(0, -1);

      window.location.pathname = urlPath
        .slice(0, index + 1)
        .reduce((paths, path) => `${paths}/${path}`, '');
    }
  });
});
