const apiKey = "";
const URL = `https://api.sportsdata.io/v3/nfl/scores/json/Player/`;
const PLAYER_SEASON_STATS_BY_ID = `https://api.sportsdata.io/v3/nfl/stats/json/PlayerSeasonStatsByPlayerID/`;

function displayResults(player) {
  console.log(player);
  $("#results-list").empty();

  $("#results-list").append(
    `
    <div class="card" style="width: 18rem;">
        <div class="bg-light">
           <img class="card-image" src="${player.PhotoUrl}" alt="Card image cap">
        </div>

        <div class="bg-light">
          <div class="card-text">
            <div class="card-info">
              <h5 class="card-title">${player.FirstName} ${player.LastName}</h5>
              <h5 class="card-title">${player.CurrentTeam} - ${player.Position}</h5>
            </div>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>

          <div class="card-stats">
             <div class="stat">
              <div class="value">${player.PassingAttempts}</sup></div>
              <div class="type">read</div>
             </div>

             <div class="stat border">
              <div class="value">5123</div>
              <div class="type">views</div>
             </div>

             <div class="stat">
              <div class="value">455</div>
              <div class="type">comments</div>
             </div>
          </div>
        </div>
    </div>
        `
  );

  $("#results").removeClass("hidden");
}

function getFantasyPlayer(playerID) {
  const options = {
    headers: new Headers({
      "Ocp-Apim-Subscription-Key": apiKey,
    }),
  };
  // let playerStats = getPlayerStatsBySeason(playerID);
  // console.log(playerStats);

  const url = URL + playerID;
  console.log({ url, options });

  fetch(url, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((error) => {
      $("#js-error-message").text(`Error making your request ${error.message}`);
    });
}

function getPlayerStatsBySeason(playerID = 13320, season = 2020) {
  const options = {
    headers: new Headers({
      "Ocp-Apim-Subscription-Key": apiKey,
    }),
  };

  const url = PLAYER_SEASON_STATS_BY_ID + season + "/" + playerID;
  console.log({ url, options });

  fetch(url, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((error) => console.error(error.message));
}

function generatePlayerList() {
  filterPlayerByPosition();
  PLAYERS.sort((a, b) => (a.LastName > b.LastName ? 1 : -1));
  //PLAYERS.filter((p) => p.Position === "QB").map((player) => {
  PLAYERS.map((player) => {
    $("#js-search-player").append(`
            <option value="${player.PlayerID}">
            ${player.LastName}, ${player.FirstName}
            </option>
        `);
  });
}

function filterPlayerByPosition() {
  PLAYERS.filter((player) => player.Position === "QB").map((p) => {
    $("#js-search-player").append(`
            <option value="${p.PlayerID}">${p.LastName}, ${p.FirstName}</option>
        `);
  });
}

function watchForm() {
  $("form").submit((e) => {
    e.preventDefault();
    console.log("App activiated...");
    let player = $("#js-search-player").val();
    getFantasyPlayer(player);
  });
}

function main() {
  watchForm();
  generatePlayerList();
}

$(main);
