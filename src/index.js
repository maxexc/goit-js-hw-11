import pictureCard from './templates/cards.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { axiosImg } from './js/axiosImgData.js';
import dancingGif from './templates/dancingGif.hbs';
import Notiflix from 'notiflix';
import SmoothScroll from 'smoothscroll-for-websites';

console.log(axiosImg());

// --------- data for infinity scroll ---------- //
const guard = document.querySelector('.guard');
const options = {
  root: null,
  rootMargin: '700px',
  threshold: 1,
};
const observer = new IntersectionObserver(onLoad, options);

// --------- data for infinity scroll ---------- //

const gallery = document.querySelector('.js-gallery-hbs');
const searchForm = document.querySelector('#search-form');

searchForm.addEventListener('submit', onSearchForm);
const gallerySimpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
let query;
let pageNumber = 1;
let totalPage;

function onSearchForm(event) {
  event.preventDefault();
  window.scrollTo({ top: 0 });
  query = event.currentTarget.searchQuery.value.trim();
  // console.log(query);
  gallery.innerHTML = '';
  observer.unobserve(guard);
  pageNumber = 1;

  if (query === '') {
    Notiflix.Notify.warning('The search field is empty. Please try again.');
    return;
  }

  axiosImg(query, pageNumber)
    .then(data => {
      totalPage = Math.ceil(data.totalHits / data.hits.length);
      console.log(data);
      console.log('totalPage:', totalPage);
      // console.log(data.totalHits);
      // console.log(data.hits);
      if (data.totalHits !== 0) {
        gallery.insertAdjacentHTML('beforeend', pictureCard(data.hits));
        observer.observe(guard);
      }
      if (pageNumber === totalPage) {
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
        observer.unobserve(guard);
      }
      gallerySimpleLightbox.refresh();
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

// --------- infinity scroll ---------- //

function onLoad(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('hello');
      axiosImg(query, pageNumber).then(data => {
        pageNumber += 1;
        totalPage = Math.ceil(data.totalHits / data.hits.length);
        console.log('pageNumber:', pageNumber);
        if (pageNumber === totalPage) {
          console.log(pageNumber, totalPage);
          gallery.insertAdjacentHTML('beforeend', pictureCard(data.hits));

          Notiflix.Notify.warning(
            "We're sorry, but you've reached the end of search results."
          );
          observer.unobserve(guard);
        } else {
          gallery.insertAdjacentHTML('beforeend', pictureCard(data.hits));
          observer.observe(guard);
          gallerySimpleLightbox.refresh();
        }
      });
    }
  });
}

// --------- infinity scroll ---------- //

SmoothScroll({
  stepSize: 175,
  animationTime: 800,
  accelerationDelta: 200,
  accelerationMax: 6,
  keyboardSupport: true,
  arrowScroll: 100,
});

// console.log(query);

// -------- dancing Gif --------- //

searchForm.insertAdjacentHTML('beforeend', dancingGif());
const hideGif = document.querySelector('.dancing-gif');
// console.log(hideGif);

hideGif.addEventListener('click', removeGif);
function removeGif() {
  console.log('это клик');
  hideGif.classList.add('dancing-gif__opacity');
  setTimeout(() => hideGif.classList.add('hidden'), 1000);
}
