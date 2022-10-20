import pictureCard from './templates/cards.hbs';

const gallery = document.querySelector('.js-gallery-hbs');

gallery.insertAdjacentHTML('beforeend', pictureCard());
