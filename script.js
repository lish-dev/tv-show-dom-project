const rootElem = document.getElementById("root");

// this references the drop down show menu for the shows index HTML
const showsSelect = document.getElementById("ShowMenu");

//this references the episodes drop down Menu index HTML
const selection = document.getElementById("SelectionMenu");

// store a reference to the search bar for episodes
const searchBarEpisodes = document.getElementById("searchBarEpisodes");

// store a reference to the HTML which will display the number of shows
const numberOfShows = document.getElementById("number-of-shows");

// store a reference to the HTML which will display the total number of shows
const totalNumberOfShows = document.getElementById("total-number-of-shows");

// store a reference to the HTML which will display the number of episodes
const numberOfEpisodes = document.getElementById("number-of-episodes");

// store a reference to the HTML which will display the total number of episodes
const totalNumberOfEpisodes = document.getElementById(
  "total-number-of-episodes"
);

// level 500- to display either show or episode on the webpage
const searchOptionsForShows = document.getElementById("header-for-shows");
searchOptionsForShows.style.display = "block";
const searchOptionsForEpisodes = document.getElementById("header-for-episodes");
searchOptionsForEpisodes.style.display = "none";

// level 500- Back button used on click when the user goes back to the main page
const backButtonForShows = document.getElementById("backButton");
backButtonForShows.onclick = async (e) => {
  toggleViews();
  setup();
};

//fetching the list of episodes via the URL
async function getEpisodes(id) {
  const episodes = await fetch(`https://api.tvmaze.com/shows/${id}/episodes`);
  const data = await episodes.json();
  return data;
}

//fetching the list of shows via the api URL
async function getShows() {
  const shows = await fetch("https://api.tvmaze.com/shows");
  const data = await shows.json();
  return data;
}

function updateNumberOfShows(value, total) {
  numberOfShows.innerText = value;
  totalNumberOfShows.innerText = total;
}

function updateNumberOfEpisodes(value, total) {
  numberOfEpisodes.innerText = value;
  totalNumberOfEpisodes.innerText = total;
}

//store a reference to all episodes
async function setup() {
  const newShows = await getShows();
  listShows(newShows);
  dropDownListForEpisodes(newShows);
  setUpShows(newShows);
  searchShowFunction(newShows);
  updateNumberOfShows(newShows.length, newShows.length);

}

//level 500
function setUpShows(newShows) {
  makePageForShows(newShows);
}

function searchFunction(epList) {
  // listening for when user types in a search term
  searchBarEpisodes.addEventListener("input", (e) => {
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
    //to display for the episodes without a picture
    let summary = "";
    let image =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEbc1reBfoICJRvfy0e8dLAfQsIuBY6IDONg&usqp=CAU";
    if (episode.image) {
      image = episode.image.medium;
    }
    //displays the season and episode per show
    if (episode.summary) {
      summary = episode.summary;
    }
    html += `<div class= "episodeGrid"> <h2>${episode.name} 
    - S${seasonNumbers(episode.season)}  
    E${seasonNumbers(episode.number)} 
    </h2> 
       <img src = "${image} " alt = " ">
    
    ${summary}</div>`;
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
  let tvEpisode = `<option value="1" >See all episodes</option>`;

  // displays Episode name and Season number
  watch.forEach((episode) => {
    tvEpisode += `<option value="${episode.id}">
    S ${seasonNumbers(episode.season).toString().padStart(2, 0)}  
    E ${seasonNumbers(episode.number).toString().padStart(2, 0)}
    ${episode.name}</option>`;
  });

  selection.insertAdjacentHTML("afterbegin", tvEpisode);
}

// this function displays the list of shows in the first drop down box starting from see all shows
function listShows(shows) {
  let tvShow = `<option value="1" >See all shows</option>`;

  // displays series name on the first drop down box
  shows
    .sort(function (a, b) {
      a.name.toLowerCase();
      b.name.toLowerCase();
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    })
    .forEach((series) => {
      tvShow += `<option value="${series.id}"> 
    ${series.name}</option>`;
    });

  showsSelect.insertAdjacentHTML("afterbegin", tvShow);
}

//when the user clicks on the drop down menu, episode data can be selected
function dropDownListForShows(shows) {
  selection.addEventListener("change", (m) => {
    const searchId = +m.target.value;
    let filteredList = [];
    if (searchId === 0) {
      filteredList = shows;
    } else {
      filteredList = shows.filter((series) => {
        return series.id === searchId;
      });
    }
    rootElem.innerHTML = "";
    makePageForEpisodes(filteredList);
  });
}

// when the user clicks on the first drop down menu, new shows can be selected
function dropDownListForEpisodes() {
  showsSelect.addEventListener("change", async (m) => {
    const searchId = +m.target.value;
    if (searchId !== 0) {
      const episodes = await fetch(
        `https://api.tvmaze.com/shows/${searchId}/episodes`
      );
      const data = await episodes.json();
      rootElem.innerHTML = "";
      makePageForEpisodes(data);
      watchShow(data);
      dropDownListForShows(data);
    }
  });
}

//Level 500: toggle the display of the web page views

function toggleViews() {
  if (searchOptionsForShows.style.display === "block") {
    // if the user interface is displaying shows, hide it and show episodes.
    searchOptionsForShows.style.display = "none";
    searchOptionsForEpisodes.style.display = "block";
  } else {
    //if the web page is displaying episodes, hide it and display shows.
    searchOptionsForShows.style.display = "block";
    searchOptionsForEpisodes.style.display = "none";
  }
}

function makePageForShows(showList) {
  // store html string in variable
  let html = "";
  // loop through episodes & append  html to variable
  //For each show, you must display at least name, image, summary, genres, status, rating, and runtime.
  showList.forEach((show) => {
    const genreList = show.genres.toString().split(",").join("| ");
    html += `<div class= "episodeGrid" onClick = "selectShow(${show.id})">
    <h2>${show.name}</h2>
    <h3>Genres: ${genreList}</h3>
    <h4>Rating: ${show.rating.average}</h4>
    <h4>Run Time: ${show.runtime}</h4>
    <img src = "${show.image.medium}" alt = " "/>
    <p>${show.summary}</p>
    </div>`;
  });
  // insert my search results 'html' into the user interface.
  rootElem.innerHTML = html;
}

function searchShowFunction(newShowList) {
  // listening for when user types in a search term
  searchBarShows.addEventListener("input", (e) => {
    // get search input & convert text to lower case
    // the reason for lower case conversion is because uppercase 'W' is not equal to lowercase 'w'.
    const searchString = e.target.value.toLowerCase();
    //check if episode name or episode summary in lower case includes my search string which is also lowercase
    // if the input & comparison values are not converted to lowercase, the results of the filter may not include all possible matches
    const filteredNames = newShowList.filter(
      (show) =>
        show.name.toLowerCase().includes(searchString) ||
        show.summary.toLowerCase().includes(searchString) ||
        show.genres.filter((genre) =>
          genre.toLowerCase().includes(searchString)
        ).length
    );
    // now I have my filtered data, present on screen
    makePageForShows(filteredNames);
    //update total for all number of episodes
    updateNumberOfShows(filteredNames.length, newShowList.length);
  });
}

async function selectShow(showid) {
  const epList = await getEpisodes(showid);
  watchShow(epList);
  searchFunction(epList);
  dropDownListForShows(epList);
  updateNumberOfEpisodes(epList.length, epList.length);
  makePageForEpisodes(epList);
  toggleViews();
}

window.onload = setup;
