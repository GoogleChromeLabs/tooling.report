const breadcrumbs = document.querySelector('#breadcrumbs');
const navs = document.querySelectorAll('#breadcrumbs select');
const urlPaths = window.location.pathname.split('/');

urlPaths.pop();
urlPaths.shift();

const state = {
  prevent: false,
};

const keyTab = 9;
const keyEnter = 13;
const keySpace = 32;
const keyUpArrow = 38;
const keyDownArrow = 40;

const allowedKeys = [keyTab, keyEnter, keySpace];
const preventedKeys = [keyUpArrow, keyDownArrow];

window.onload = () => {
  breadcrumbs?.lastElementChild?.scrollIntoView({
    block: 'nearest',
    inline: 'end',
  });
};

navs.forEach(nav => {
  nav.addEventListener('change', event => {
    const target = <HTMLInputElement>event.target;
    const index = target.dataset?.depth ? parseInt(target.dataset.depth!) : -1;

    if (index === -1 || state.prevent) return;

    urlPaths[index] = target.value.slice(0, -1);

    window.location.pathname = urlPaths.slice(0, index + 1).join('/');
  });

  nav.addEventListener('keydown', event => {
    const { keyCode } = event as KeyboardEvent;

    if (preventedKeys.includes(keyCode)) {
      state.prevent = true;
    } else if (allowedKeys.includes(keyCode)) {
      state.prevent = false;
    }
  });
});
