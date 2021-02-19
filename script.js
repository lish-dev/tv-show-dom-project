const rootElem = document.getElementById("root");
const fruit = document.getElementById("cherries");
// store a reference to the search bar which is the input
const searchBar = document.getElementById("searchBar");
const allEpisodes = getAllEpisodes();
//store a reference to all episodes
const epList = getAllEpisodes();

//You can edit ALL of the code here
function setup() {
  makePageForEpisodes(allEpisodes);
}

function searchFunction() {
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
function jonSnow(dragon) {
  let jon = `<option value="1" >See all episodes</option>`;

  dragon.forEach((episode) => {
    jon += `<option value="${episode.id}">
    Season ${seasonNumbers(episode.season).toString().padStart(2, 0)}  
    Episode ${seasonNumbers(episode.number).toString().padStart(2, 0)}
    ${episode.name}</option>`;
  });

  fruit.insertAdjacentHTML("afterbegin", jon);
}
jonSnow(allEpisodes);
searchFunction(allEpisodes);


//when user click on the drop down menu data can be selected
function dropDown(shows) {
  fruit.addEventListener("change", (m) => {
    m.preventDefault();
    const searchId = +m.target.value;
    let filteredList = [];
    if (searchId === 1) {
      filteredList = shows;
    } else {
      filteredList = shows.filter((drink) => {
        return drink.id === searchId;
      });
    }
    rootElem.innerHTML = "";
    makePageForEpisodes(filteredList);
  });
}

dropDown(allEpisodes);

window.onload = setup;

//function searchEpisode(query) {
//   const url = `https://api.tvmaze.com/shows/82/episodes${query}`;
//   fetch(url)
//     .then((response) => response.json())
//     .then((jsonData) => {
//       const results = jsonData.map((element) => element.show.name);
//       renderResults(results);
//     });
// }
