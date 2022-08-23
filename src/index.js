import './sass/_common.scss';
import NewsApiService from './js/api-file';
import Notiflix, { Notify } from 'notiflix';
import LoadButton from './js/components/load-button';
import templateImages from './templates/photo-cards.hbs';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.search-input'),
  searchButton: document.querySelector('.button-search'),
  gallery: document.querySelector('.gallery'),
  //   loadButton: document.querySelector('.load-more'),
};

const newsApiService = new NewsApiService();
const loadButton = new LoadButton({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  scrollZoomFactor: false,
});

refs.form.addEventListener('submit', onSearch);
refs.input.addEventListener(
  'input',
  () => (refs.searchButton.disabled = false)
);
loadButton.refs.button.addEventListener('click', fetchImages);

function onSearch(e) {
  e.preventDefault();
  refs.searchButton.disabled = true;

  newsApiService.searchQuery = e.currentTarget.elements.searchQuery.value;

  if (newsApiService.searchQuery === '') {
    Notify.failure('❌Enter text');
    return;
  }

  loadButton.show();
  newsApiService.resetPage();
  clearImagesContainer();
  fetchImages();
}

function fetchImages() {
  loadButton.disable();

  newsApiService.fetchImages().then(({ data }) => {
    newsApiService.totalPage = Math.ceil(data.total / newsApiService.per_page);
    newsApiService.loadedNow += data.hits.length;

    if (newsApiService.page === 2) {
      Notify.success(`✅Hooray! We found ${data.total} images.`);
    }

    if (newsApiService.totalPage + 1 === newsApiService.page) {
      loadButton.hide();
    }

    if (data.hits.length === 0) {
      Notify.failure(
        '❌Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notify.success(`✅Loaded ${newsApiService.loadedNow} images.`);
    appendImagesMarkup(data.hits);
    simpleLightbox.refresh();

    loadButton.enable();
  });
}

function appendImagesMarkup(images) {
  refs.gallery.insertAdjacentHTML('beforeend', templateImages(images));
}

function clearImagesContainer() {
  refs.gallery.innerHTML = '';
}
