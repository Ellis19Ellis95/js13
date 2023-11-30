
import { fetchImages } from './requests';
import { createPhotoCard, createColumnContainers } from './markup';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';


const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');


let page = 1;
let searchQuery = '';


form.addEventListener('submit', handleSubmit);




async function handleSubmit(event) {
    event.preventDefault();
    gallery.innerHTML = '';
    page = 1;
    searchQuery = event.target.elements.searchQuery.value.trim();
  
    if (searchQuery === '') {
      Notiflix.Notify.warning('Please enter a search term!');
      return;
    }
  
    try {
      const response = await fetchImages(searchQuery, page);
      
      if (response.data.hits.length === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        loadMoreBtn.style.display = 'none';
        return;
      }
  
      handleImages(response.data.hits);
  
      const totalHits = response.data.totalHits;
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  
      handleEndOfResults(response.data.hits.length);
      smoothScrollToNextGroup();
    } catch (error) {
      handleFetchError(error);
    }
  }

loadMoreBtn.addEventListener('click', handleLoadMore);



async function handleLoadMore() {
    page++;
    
    try {
      const response = await fetchImages(searchQuery, page);
      const newImages = response?.data?.hits;
    
      if (!response || !newImages || newImages.length === 0) {
        throw new Error('No valid response or new images found.');
      }
    
      handleImages(newImages);
    
      handleEndOfResults(response.data.hits.length);
      scrollToNewImages();
    } catch (error) {
      console.error('Error fetching more images: ', error);
      Notiflix.Notify.failure('Oops! Something went wrong while loading more images.');
    }
  }
  


  function handleLoadMoreError(error) {
    console.error('Error fetching more images: ', error);
    Notiflix.Notify.failure('Oops! Something went wrong while loading more images.');
  }


function handleEndOfResults(imagesLength) {
  if (imagesLength < 40) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  } else {
    loadMoreBtn.style.display = 'block';
  }
}

function scrollToNewImages() {
  const firstNewImage = document.querySelector('.column-container:last-child');
  if (firstNewImage) {
    firstNewImage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function smoothScrollToNextGroup() {
  
}
 async function handleSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  searchQuery = event.target.elements.searchQuery.value.trim();

  if (searchQuery === '') {
    Notiflix.Notify.warning('Please enter a search term!');
    return;
  }

  try {
    const response = await fetchImages(searchQuery, page);
    
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    handleImages(response.data.hits);

    const totalHits = response.data.totalHits;
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

    handleEndOfResults(response.data.hits.length);
    smoothScrollToNextGroup();
  } catch (error) {
    handleFetchError(error);
  }
}

function handleFetchError(error) {
  console.error('Error fetching images: ', error);
  Notiflix.Notify.failure('Oops! Something went wrong. Please try again.');
}

loadMoreBtn.style.display = 'none';  




