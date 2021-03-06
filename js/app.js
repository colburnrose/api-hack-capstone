"use strict";

const URL = `https://api.sportsdata.io/v3/nfl/scores/json/Player/`;
const PLAYER_SEASON_STATS_BY_ID = `https://api.sportsdata.io/v3/nfl/stats/json/PlayerSeasonStatsByPlayerID/`;
let playerHTML = "";
let statsHTML = "";

function checkDone() {
  if (playerHTML !== "" && statsHTML !== "") {
    addPlayer();
  }
}

function displayResults(player) {
  playerHTML = `
    <div class="card">
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
  <h4 class="stat-label">2020 SEASON STATS</h4>
    <div class="card-stats">
          <div class="stat">
          <p>YDS</p>
              <div class="value">${player[0].PassingYards}</div>
          </div>
          <div class="stat">
          <p>TD</p>
            <div class="value">${player[0].PassingTouchdowns}</div>
          </div>
          <div class="stat">
          <p>INT</p>
            <div class="value">${player[0].PassingInterceptions}</div>
          </div>
          <div class="stat">
          <p>QBR</p>
            <div class="value">${player[0].PassingRating}</div>
          </div>
      </div>
    `;
  checkDone();
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

  fetch(url, options)
    .then((response) => {
      if (response.status !== 200) {
        return Promise.reject(new error("Failed to get response"));
      } else {
        return response.json();
      }
    })
    .then((data) => {
      if (data) {
        displayResults(data);
      } else {
        throw new Error("Bad request: select a QB that is not the same.");
      }
    })
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

  fetch(url, options)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("Bad response");
      } else {
        return response.json();
      }
    })
    .then((data) => {
      if (data.length === 0) {
        throw new Error("Please select a QB that has some data to compare.");
      } else {
        displayStats(data);
      }
    })
    .catch((error) => {
      $("#js-error-message").text(
        `Error making your request: ${error.message}`
      );
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
    let player = $("#js-search-player").val();
    var index = $("#js-search-player").get(0).selectedIndex;

    getFantasyPlayer(player);
    getPlayerStatsBySeason(player);
    $("#js-search-player option:eq(" + index + ")").remove();
  });
}

function main() {
  watchForm();
  filterPlayerByQB();
  generatePlayerList();
}

$(main);
