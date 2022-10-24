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

//

const refs = {
  gallery: document.querySelector('.js-gallery-hbs'),
  searchForm: document.querySelector('#search-form'),
};
// console.log(refs.hideGif);
refs.searchForm.addEventListener('submit', onSearchForm);

// ------- SimpleLightbox ------- //
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
  refs.gallery.innerHTML = '';
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
        refs.gallery.insertAdjacentHTML('beforeend', pictureCard(data.hits));
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
      refs.searchForm.reset();
    });
}

// --------- infinity scroll ---------- //

function onLoad(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('hello');
      axiosImg(query, pageNumber)
        .then(data => {
          pageNumber += 1;
          totalPage = Math.ceil(data.totalHits / data.hits.length);
          console.log('pageNumber:', pageNumber);
          if (pageNumber === totalPage) {
            console.log(pageNumber, totalPage);
            refs.gallery.insertAdjacentHTML(
              'beforeend',
              pictureCard(data.hits)
            );

            Notiflix.Notify.warning(
              "We're sorry, but you've reached the end of search results."
            );
            gallerySimpleLightbox.refresh();
            observer.unobserve(guard);
          } else {
            refs.gallery.insertAdjacentHTML(
              'beforeend',
              pictureCard(data.hits)
            );
            gallerySimpleLightbox.refresh();
            observer.observe(guard);
            gallerySimpleLightbox.refresh();
          }
        })
        .catch(error => console.log(error));
    }
  });
}

// --------- SmoothScroll ---------- //

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

refs.searchForm.insertAdjacentHTML('beforeend', dancingGif());
refs.hideGif = document.querySelector('.dancing-gif');

refs.hideGif.addEventListener('click', removeGif);
function removeGif() {
  console.log('это клик');
  refs.hideGif.classList.add('dancing-gif__opacity');
  setTimeout(() => refs.hideGif.classList.add('hidden'), 1000);
}
