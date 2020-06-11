const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const city = urlParams.get("city");

const initHeight = 40;
const fullHeight = 330;

window.resize = () => {
  const height = window.innerHeight !== initHeight ? initHeight : fullHeight;
  window.parent.postMessage(
    { payload: { id, command: "setLayout", overrideLayout: { height } } },
    "*",
  );
};

const headers = {
  "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
  // "x-rapidapi-key": "0dbf419b4cmsh2bc69fe83f2ec2ep12b92bjsn4ac285772512",
};

const url = `https://community-open-weather-map.p.rapidapi.com/weather?units=metric&q=${city}`;

fetch(url, { method: "GET", headers })
  .then((response) => response.json())
  .then((json) => {
    if (json.message) return;

    // noinspection JSUnresolvedVariable
    document.getElementById(
      "temp",
    ).innerText = `${json.name}: ${json.main.temp}°`;

    document.getElementById("details").innerText = JSON.stringify(
      json.main,
      null,
      2,
    );
  });
