const navs = document.querySelectorAll('#breadcrumbs select');

navs.forEach(nav => {
  nav?.addEventListener('input', e => {
    const target = <HTMLInputElement>e.target;
    console.log(target?.value);
  });
});
