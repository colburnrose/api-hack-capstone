"use strict";

const apiKey = "ad749733ee9244e4b8c987ddd5597d42";
const URL = `https://api.sportsdata.io/v3/nfl/scores/json/Player/`;
const PLAYER_SEASON_STATS_BY_ID = `https://api.sportsdata.io/v3/nfl/stats/json/PlayerSeasonStatsByPlayerID/`;
const NEWS = `https://api.sportsdata.io/v3/nfl/scores/json/NewsByPlayerID/`;
let playerHTML = "";
let statsHTML = "";

function checkDone() {
  if (playerHTML !== "" && statsHTML !== "") {
    addPlayer();
  }
}

function displayResults(player) {
  playerHTML = `
    <div class="card" style="width: 18rem;">
        <div class="card-detail">
           <img class="card-image" src="${
             player.PhotoUrl
           }" alt="Card image cap">
           <div class="card-info">
              <h5>${player.FirstName.toUpperCase()}</h5>
              <h5><span>${player.LastName.toUpperCase()}</span></h5>
              <h5>POSITION: ${player.Position}</h5>
              <h5>TEAM: ${player.CurrentTeam}</h5>
              <h5>EXPERIENCE: ${player.ExperienceString}</h5>
              <div class="fw-medium clr-black">Status:<span class="status plain ml0"><i class="fas fa-circle"></i>${
                player.Status
              }</span></div>
            </div>
        </div>
    </div>
        `;
  checkDone();
}

function displayStats(player) {
  statsHTML = `
    <div class="card">
      <div class="stat">
      <p>Passing Rating</p>
        <div class="value"></sup></div>
        <div class="type">read</div>
        </div>

        <div class="stat border">
        <p>Fantasy Points</p>
        <div class="value">${player[0].FantasyPoints}</div>
        </div>

        <div class="stat">
        <div class="value">455</div>
        <div class="type">comments</div>

        <div class="player-stats">
          <div class="card-text">
            <p class="bar-graph">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        </div>
    </div>
    `;
  checkDone();
}

function displayNews(player) {
  $("#news").empty();
  for (let i = 0; i < player.length; i++) {
    return $("#news").append(
      `
     <div class="news-info">
     <p>${player[i].Content}</p>
     </div>
    `
    );
  }
}

function addPlayer() {
  $(".players").append(`<section class="player"><section class="player-info">
          ${playerHTML}
        </section>
        <section class="stat-info">
          ${statsHTML}
        </section></section>`);
  playerHTML = "";
  statsHTML = "";
}

function getFantasyPlayer(playerID) {
  const options = {
    headers: new Headers({
      "Ocp-Apim-Subscription-Key": apiKey,
    }),
  };

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
    .then((data) => displayResults(data))
    .catch((error) => {
      $("#js-error-message").text(`Error making your request ${error.message}`);
    });
}

function getPlayerStatsBySeason(playerID, season = 2020) {
  const options = {
    headers: new Headers({
      "Ocp-Apim-Subscription-Key": apiKey,
    }),
  };

  const url = PLAYER_SEASON_STATS_BY_ID + season + "/" + playerID;
  console.log({ url, options });

  fetch(url, options)
    .then((response) => {
      console.log("This data ", response);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((data) => {
      if (data) {
        displayStats(data);
      }
    })
    .catch((error) => {
      $("#js-error-message").text(`Error making your request ${error.message}`);
    });
}

async function getNewsByPlayerId(playerId) {
  const options = {
    headers: new Headers({
      "Ocp-Apim-Subscription-Key": apiKey,
    }),
  };
  const url = NEWS + playerId;
  console.log(url, options);

  await fetch(url, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((data) => displayNews(data))
    .catch((error) => {
      $("#js-error-message").text(`Error making your request ${error.message}`);
    });
}

// ======================================================
// HELPER FUNCTION =====================================
// GET LIST OF PLAYERS SORTED AND FILTERD BY POSITION
// ======================================================

function generatePlayerList() {
  PLAYERS.sort((a, b) => (a.LastName > b.LastName ? 1 : -1));
  PLAYERS.map((player) => {
    if (player.Position == "QB") {
      $("#js-search-player").append(`
            <option value="${player.PlayerID}">
            ${player.LastName}, ${player.FirstName}
            </option>
        `);
    }
    if (player.Position == "RB") {
      $("#js-search-player").append(`
            <option value="${player.PlayerID}">
            ${player.LastName}, ${player.FirstName}
            </option>
        `);
    }
    if (player.Position == "WR") {
      $("#js-search-player").append(`
            <option value="${player.PlayerID}">
            ${player.LastName}, ${player.FirstName}
            </option>
        `);
    }
    if (player.Position == "TE") {
      $("#js-search-player").append(`
            <option value="${player.PlayerID}">
            ${player.LastName}, ${player.FirstName}
            </option>
        `);
    }
  });
}

// ======================================================
// HELPER FUNCTION ======================================
// FILTER PLAYERS BY POSITION ======================
// ======================================================
function filterPlayerByQB() {
  PLAYERS.filter((player) => player.Position === position.QUARTERBACK).map(
    (p) => {
      $("#js-search-player").append(`
            <option value="${p.PlayerID}">${p.LastName}, ${p.FirstName}</option>
        `);
    }
  );
}

function filterfPlayerByRB() {
  PLAYERS.filter((player) => player.Position === position.RUNNINGBACK).map(
    (p) => {
      $("#js-search-player").append(`
            <option value="${p.PlayerID}">${p.LastName}, ${p.FirstName}</option>
        `);
    }
  );
}

function watchForm() {
  $("form").submit((e) => {
    e.preventDefault();
    console.log("App activiated...");
    let player = $("#js-search-player").val();
    let player2 = $("#js-search-player2").val();
    getFantasyPlayer(player);
    getPlayerStatsBySeason(player);
    // getNewsByPlayerId(player);
  });
}

function main() {
  watchForm();
  filterPlayerByQB();
  filterfPlayerByRB();
  generatePlayerList();
}

$(main);
