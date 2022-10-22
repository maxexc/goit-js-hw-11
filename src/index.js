import pictureCard from './templates/cards.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { axiosImg } from './js/axiosImgData.js';
import dancingGif from './templates/dancingGif.hbs';

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

  if (query === '') {
    // emptySearch();
    return;
  }

  axiosImg(query, pageNumber)
    .then(data => {
      console.log(data);
      // console.log(data.totalHits);
      // console.log(data.hits);
      if (data.totalHits === 0) {
        noImagesFound();
      } else {
        gallery.insertAdjacentHTML('beforeend', pictureCard(data.hits));
        observer.observe(guard);

        // if (data.totalHits > perPage) {
        //   loadMore.classList.remove('is-hidden');
        // }
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
      axiosImg(query, pageNumber)
        .then(data => {
          pageNumber += 1;
          console.log('pageNumber:', pageNumber);
          if (pageNumber === totalPage) {
            console.log(pageNumber, totalPage);

            observer.unobserve(guard);
            noImagesFound();
          } else {
            gallery.insertAdjacentHTML('beforeend', pictureCard(data.hits));
            observer.observe(guard);
            gallerySimpleLightbox.refresh();
          }
        })
        .catch(error => console.log(error))
        .finally(() => {
          searchForm.reset();
        });
    }
  });
}

// --------- infinity scroll ---------- //

// console.log(query);
searchForm.insertAdjacentHTML('beforeend', dancingGif());
