export default async function fetchPictures(name, pageNumber) {
  const axios = require('axios');

  try {
    const API_KEY = '26835321-4f7740cc42e1042b435da3ff7';

    const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=4&page=${pageNumber}`;

    const pictures = await axios.get(URL);

    console.log(pageNumber);
    return pictures;
  } catch (error) {
    console.log(error.message);
  }
}
