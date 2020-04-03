const navs = document.querySelectorAll('#breadcrumbs select');
const urlPath = window.location.pathname.split('/');

urlPath.pop();
urlPath.shift();

navs.forEach(nav => {
  nav?.addEventListener('input', e => {
    const target = <HTMLInputElement>e.target;
    const data = target.dataset;
    var index: number = -1;

    if (data) {
      index = parseInt(data.depth as string);
    }

    if (index !== -1) {
      urlPath[index] = target?.value.slice(0, -1);

      window.location.pathname = urlPath
        .slice(0, index + 1)
        .reduce((paths, path) => `${paths}/${path}`, '');
    }
  });
});
