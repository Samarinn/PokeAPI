import './home.js';
import './detalhes.js';

function router() {
  const outlet = document.getElementById('main-content');
  const hash = window.location.hash;

  if (hash === '#/detalhes') {
    outlet.innerHTML = '<app-detalhes></app-detalhes>';
  } else {
    outlet.innerHTML = '<app-home></app-home>';
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);