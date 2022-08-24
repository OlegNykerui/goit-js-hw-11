import axios from 'axios';

const API_KEY = '29443951-f0fab2e7bdcd1423b667d2410';
const BASE_URL = 'https://pixabay.com/api/';
const OPTIONS = {
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 20;
    this.totalPage = 0;
    this.loadedNow = 0;
  }

  async fetchImages() {
    try {
      const searchOptions = {
        params: {
          ...OPTIONS,
          q: this.searchQuery,
          page: this.page,
          per_page: this.per_page,
        },
      };

      this.incrementPage();
      this.resetLoaded();

      const url = `${BASE_URL}?key=${API_KEY}`;

      return axios.get(url, searchOptions);
    } catch (error) {
      console.log(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  resetLoaded() {
    this.loadedNow = 0;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
