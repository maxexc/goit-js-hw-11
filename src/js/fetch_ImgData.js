import axios from 'axios';
export { fetchImg };

const API_URL = 'https://pixabay.com/api/';
const KEY = '30747162-c0f899af5e8792e55f79454a6';

async function fetchImg(query, page) {
  //   let page = 1;
  return await axios.get(
    `${API_URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
}
