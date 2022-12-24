import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '32198335-9a9b26a5cd264db7fe2daf7b5';

export default class Gallery {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchGallery() {
    try {
      const { data } = await axios.get(
        `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}&page=${this.page}`
      );

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  nextPage() {
    this.page += 1;
  }

  startNewPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
