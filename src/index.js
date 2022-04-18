import './sass/main.scss';
import fetchPictures from './js/fetchPictures';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import LoadMoreBtn from './js/load-more-btn';

// fetchPictures('beautiful girls');

const refs = {
  inputData: document.querySelector('#search-form input'),
  galleryDivStructure: document.querySelector('.gallery'),
  buttonSearch: document.querySelector('#search-form button'),
  loadMoreButton: document.querySelector('.load-more'),
};
let inputForNextPage = '';
let numberForNextPage = 1;

const { inputData, galleryDivStructure, buttonSearch, loadMoreButton } = refs;

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

buttonSearch.addEventListener('click', onSearch);

function onSearch(event) {
  loadMoreBtn.disable();
  event.preventDefault();

  let inputForSearch = inputData.value;
  inputForNextPage = inputForSearch;
  numberForNextPage = 1;

  return fetchPictures(inputForSearch, numberForNextPage)
    .then(pictures => renderPictures(pictures))
    .catch(error => {
      console.log(error);
    });
}

function renderPictures(pictures) {
  let pictureCounter = pictures.data.hits.length;

  if (pictureCounter === 0) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  } else {
    loadMoreBtn.enable();
    loadMoreBtn.show();

    const markupDivInfo = pictures.data.hits
      .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
          <div class="photo-card">
          <a class="gallery__item" href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" width = "300" height = "200" loading="lazy"/></a>
            <div class="info">
                <p class="info-item">
                <b>Likes</b>
                <br>${likes}
                </p>

                <p class="info-item">
                <b>Views</b>
                <br>${views}
                </p>

                <p class="info-item">
                <b>Comments</b>
                <br>${comments}
                </p>

                <p class="info-item">
                <b>Downloads</b>
                <br>${downloads}
                </p>
                </div>
            </div>`;
      })
      .join('');
    galleryDivStructure.innerHTML = markupDivInfo;
  }
}
loadMoreButton.addEventListener('click', loadMore);

function loadMore(event) {
  loadMoreBtn.disable();
  event.preventDefault();

  numberForNextPage += 1;
  return fetchPictures(inputForNextPage, numberForNextPage)
    .then(pictures => renderPictures(pictures))
    .catch(error => {
      console.log(error);
    });
}
