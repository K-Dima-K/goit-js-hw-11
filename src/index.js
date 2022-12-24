import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { refs } from './js/refs';
import Gallery from './js/Gallery';
import { createMarkup } from './js/createMarkup';

const gallery = new Gallery();
const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

async function onSubmit(event) {
  event.preventDefault();

  gallery.query = event.currentTarget.elements.searchQuery.value.trim();
  if (!gallery.query) {
    return;
  }

  gallery.startNewPage();
  clearGallery();
  refs.loadMoreBtn.classList.add('is-hidden');
  refs.inputEl.value = '';

  createGallery();
  lightbox.refresh();
}

function renderGallery(markup) {
  refs.galleryEl.insertAdjacentHTML('beforeend', createMarkup(markup));
}

function clearGallery() {
  refs.galleryEl.innerHTML = '';
}

function getData() {
  return gallery.fetchGallery();
}

async function createGallery() {
  await getData()
    .then(data => {
      console.log(data);

      if (data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      Notify.success(`"Hooray! We found ${data.totalHits} images.`);
      renderGallery(data.hits);
      lightbox.refresh();
      refs.loadMoreBtn.classList.remove('is-hidden');
    })
    .catch(error => console.log(error));
}

function onloadMoreBtnClick() {
  gallery.nextPage();
  getData()
    .then(data => {
      renderGallery(data.hits);
      lightbox.refresh();
      if (gallery.page >= Math.ceil(data.totalHits / 40)) {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}

refs.formEl.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onloadMoreBtnClick);
