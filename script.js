const rootElem = document.getElementById("root");

//this references the selection Menu index HTML
const selection = document.getElementById("SelectionMenu");

// store a reference to the search bar which is the input
const searchBar = document.getElementById("searchBar");

// store the number of episodes returned from the search
const numberOfEpisodes = document.getElementById("number-of-episodes");
const totalNumberOfEpisodes = document.getElementById(
  "total-number-of-episodes"
);

//fetching the list of episodes via the URL
async function getEpisodes() {
  const episodes = await fetch("https://api.tvmaze.com/shows/82/episodes");
  const data = await episodes.json();
  return data;
}

//const epList = getAllEpisodes();
function updateNumberOfEpisodes(numberOfShows, totalNumberOfShows) {
  numberOfEpisodes.innerText = numberOfShows;
  totalNumberOfEpisodes.innerText = totalNumberOfShows;
}

//store a reference to all episodes
async function setup() {
  const epList = await getEpisodes();
  makePageForEpisodes(epList);
  //You can edit ALL of the code here
  watchShow(epList);
  searchFunction(epList);
  dropDown(epList);
  updateNumberOfEpisodes(epList.length, epList.length);
}

function searchFunction(epList) {
  // listening for when user types in a search term
  searchBar.addEventListener("input", (e) => {
    // get search input & convert text to lower case
    // the reason for lower case conversion is because uppercase 'W' is not equal to lowercase 'w'.
    const searchString = e.target.value.toLowerCase();

    //check if episode name or episode summary in lower case includes my search string which is also lowercase
    // if the input & comparison values are not converted to lowercase, the results of the filter may not include all possible matches
    const filteredNames = epList.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchString) ||
        episode.summary.toLowerCase().includes(searchString)
    );

    // now I have my filtered data, present on screen
    makePageForEpisodes(filteredNames);

    //update total for all number of episodes
    updateNumberOfEpisodes(filteredNames.length, epList.length);
  });
}

function makePageForEpisodes(episodeList) {
  // store html string in variable
  let html = "";

  // loop through episodes & append  html to variable
  episodeList.forEach((episode) => {
    html += `<h2>${episode.name} 
    - Season ${seasonNumbers(episode.season)}  
    Episode ${seasonNumbers(episode.number)} 
    </h2> <div> <img src = "${episode.image.medium} " alt = " "> 
    ${episode.summary}</div>`;
  });

  // insert my search results 'html' into the user interface.
  rootElem.innerHTML = html;
}

// adds the episode and season
function seasonNumbers(seasonNum) {
  return seasonNum.toString().padStart(2, 0);
}

//adding data to the drop down menu
function watchShow(watch) {
  let tvShow = `<option value="1" >See all episodes</option>`;
  
// displays Episode name and Season number
  watch.forEach((episode) => {
    tvShow += `<option value="${episode.id}">
    Season ${seasonNumbers(episode.season).toString().padStart(2, 0)}  
    Episode ${seasonNumbers(episode.number).toString().padStart(2, 0)}
    ${episode.name}</option>`;
  });

  selection.insertAdjacentHTML("afterbegin", tvShow);
}

//when the user clicks on the drop down menu data can be selected
function dropDown(shows) {
  selection.addEventListener("change", (m) => {
    m.preventDefault();
    const searchId = +m.target.value;
    let filteredList = [];
    if (searchId === 1) {
      filteredList = shows;
    } else {
      filteredList = shows.filter((popcorn) => {
        return popcorn.id === searchId;
      });
    }
    rootElem.innerHTML = "";
    makePageForEpisodes(filteredList);
  });
}

window.onload = setup;
