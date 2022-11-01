import axios from 'axios';
import Notiflix from 'notiflix';
export { axiosImg };

Notiflix.Notify.init({
  position: 'left-top',
  cssAnimationStyle: 'zoom',
  fontSize: '20px',
  // showOnlyTheLastOne: true,
});

const API_URL = 'https://pixabay.com/api/';
const KEY = '30747162-c0f899af5e8792e55f79454a6';

async function axiosImg(query, pageNumber) {
  try {
    return await axios
      .get(API_URL, {
        params: {
          key: KEY,
          q: query,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
          page: pageNumber,
          per_page: 40,
        },
      })
      .then(async response => {
        if (response.status !== 200) {
          return Promise.reject(`Error: ${response.message}`);
        }
        if (!response.data.totalHits) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }
        if (pageNumber === 1 && response.data.totalHits) {
          Notiflix.Notify.success(
            `Hooray! We found ${response.data.totalHits} images.`
          );
        }
        return await response.data;
      });
  } catch (error) {
    console.error(error);
  }
}

// async function axiosImg(query, pageNumber) {
//   try {
//     return await axios.get(API_URL, {
//       params: {
//         key: KEY,
//         q: query,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: 'true',
//         page: pageNumber,
//         per_page: 40,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }

// export { axiosImg };

// async function axiosImg(query, page) {
//   //   let page = 1;
//   return await axios.get(
//     `${API_URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
//   );
// }
