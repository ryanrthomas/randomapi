import { searchAnime, searchRandomAnime } from "../api.js";

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const isHomePage = path.endsWith("index.html") || path === "/" || path.endsWith("/");
  const isExplorePage = path.endsWith("explore.html");
  const isResultPage = path.endsWith("anime.html");

  setupSearch();

  if (isHomePage) {
    setupHomePage();
  }
  else if (isExplorePage) {
    loadRandomAnime();
  }
  else if (isResultPage) {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get("id");
    if (animeId) {
      loadAnimeDetails(animeId);
    }
  }
});

const setupSearch = () => {
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  if (!searchInput || !searchResults) {
    return;
  }

  let debounce;

  searchInput.addEventListener("input", (element) => {
    clearTimeout(debounce);
    const query = element.target.value.trim();

    if (!query) {
      searchResults.innerHTML = "";
      searchResults.style.display = "none";
      return;
    }

    debounce = setTimeout(async () => {
      try {
        const results = await searchAnime(query);
        displaySearchResults(results, searchResults);
      }
      catch (error) {
        searchResults.innerHTML = "<p>Search failed. Please try again.</p>";
        searchResutls.style.display = "block";
      }
    }, 300);
  });

  document.addEventListener("click", (element) => {
    if (!searchInput.contains(element.target) && !searchResults.contains(element.target)) {
      searchResults.style.display = 'none';
    }
  });
};

const displaySearchResults = (results, container) => {
  if (!results || results.length === 0) {
    container.innerHTML = "<p>No results found</p>";
    container.style.display = "block";
    return;
  }
  
  container.innerHTML = "";
  
  results.forEach(anime => {
    const resultItem = document.createElement("div");
    resultItem.className = "search-result-item";
    
    resultItem.innerHTML = `
      <img src="${anime.images.jpg.small_image_url || './src/img/no-image.png'}">
      <div class="search-result-info">
        <h4>${anime.title}</h4>
        <p>${anime.type || ''} · ${anime.episodes ? anime.episodes + ' episodes' : 'Unknown episodes'}</p>
      </div>
    `;
    
    resultItem.addEventListener("click", () => {
      window.location.href = `anime.html?id=${anime.mal_id}`;
    });
    
    container.appendChild(resultItem);
  });
  
  container.style.display = "block";
};

const loadRandomAnime = async () => {
  const contentDiv = document.getElementById("content");
  if (!contentDiv) return;
  
  contentDiv.innerHTML = "<div class='loading'>Loading random anime...</div>";
  
  try {
    const anime = await searchRandomAnime();
    displayAnimeDetails(anime, contentDiv);
  } 
  catch (error) {
    contentDiv.innerHTML = `
      <div class="error-message">
        <h2>Failed to load random anime</h2>
        <p>There was an error loading the data. Please try again.</p>
        <button id="retry-button" class="btn primary-btn">Try Again</button>
      </div>
    `;
    
    document.getElementById("retry-button").addEventListener("click", loadRandomAnime);
  }
};

const displayAnimeDetails = (anime, container) => {

  const genres = anime.genres ? 
    anime.genres.map(genre => genre.name).join(', ') 
    : 'Unknown';
  
  container.innerHTML = `
    <div class="anime-details">
      <div class="anime-header">
        <h1>${anime.title}</h1>
      </div>
      
      <div class="anime-main-content">
        <div class="anime-poster">
          <img src="${anime.images.jpg.large_image_url || './src/img/no-image.png'}" alt="${anime.title}">
        </div>
        
        <div class="anime-info">
          <p><strong>Type:</strong> ${anime.type || 'Unknown'}</p>
          <p><strong>Episodes:</strong> ${anime.episodes || 'Unknown'}</p>
          <p><strong>Status:</strong> ${anime.status || 'Unknown'}</p>
          <p><strong>Score:</strong> ${anime.score || 'N/A'}</p>
          <p><strong>Genres:</strong> ${genres}</p>
          
          <div class="synopsis">
            <h3>Synopsis</h3>
            <p>${anime.synopsis || 'No synopsis available.'}</p>
          </div>
        </div>
      </div>
      
      <div class="action-buttons">
        ${window.location.pathname.endsWith('explore.html') ? 
          '<button id="new-random-anime" class="btn primary-btn">Get Another Random Anime</button>' : ''}
        <a href="${anime.url}" target="_blank" class="btn secondary-btn">View on MyAnimeList</a>
      </div>
    </div>
  `;
  
  if (window.location.pathname.endsWith('explore.html')) {
    document.getElementById('new-random-anime').addEventListener('click', loadRandomAnime);
  }

}; 

const searchContainer = document.querySelector(".search-container");
const nav = document.querySelector("nav");

if (!isHomePage && searchContainer && nav) {
  nav.appendChild(searchContainer); 
}



