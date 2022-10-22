import pictureCard from './templates/cards.hbs';
import { axiosImg } from './js/axiosImgData.js';
import dancingGif from './templates/dancingGif.hbs';

console.log(axiosImg());

const gallery = document.querySelector('.js-gallery-hbs');
const searchForm = document.querySelector('#search-form');

searchForm.addEventListener('submit', onSearchForm);
let query;
let pageNumber = 1;

function onSearchForm(event) {
  event.preventDefault();
  window.scrollTo({ top: 0 });
  // page = 1;
  query = event.currentTarget.searchQuery.value.trim();
  // console.log(query);
  gallery.innerHTML = '';

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

        // if (data.totalHits > perPage) {
        //   loadMore.classList.remove('is-hidden');
        // }
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

// console.log(query);
searchForm.insertAdjacentHTML('beforeend', dancingGif());
