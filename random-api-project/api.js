import axios from "axios";

const API_BASE_URL = "https://api.jikan.moe/v4";
const ROUTES = {
  getAnimeSearch: `${API_BASE_URL}/anime`,
  getRandomAnime: `${API_BASE_URL}/random/anime`
};
const API_DELAY = 500;

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const searchAnime = async (query, numOfResults = 10) => {
  try {
    await delay(API_DELAY);
    const response = await axios.get(ROUTES.getAnimeSearch, {
      params: {
        q: query,
        limit: numOfResults,
        sfw: false
      }
    });

    return response.data.data;
  }
  catch (error) {
    throw error;
  }
};

export const searchRandomAnime = async () => {
  try {
    await delay(API_DELAY);
    const response = await axios.get(ROUTES.getRandomAnime);

    return response.data.data;
  }
  catch(error) {
    throw error;
  }
};

