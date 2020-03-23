const styles = require('./styles.css');

const div = `<div class="${styles['class-name-1']}"></div>`;
const div2 = `<div class="${styles['class-name-2']}"></div>`;
document.body.insertAdjacentHTML('beforeend', div);
document.body.insertAdjacentHTML('beforeend', div2);
