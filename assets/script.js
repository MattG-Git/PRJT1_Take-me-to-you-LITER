var apiKey = "f92c4824a1f3e36129b27679f0d59f91";
var city = "";
var searchBarEl = $("#searchBar");
var buttonEl = $("button");

function runApis() {
    var cityInput = searchBarEl.val().trim();
    city = cityInput;
    fetchBeerApi();
    fetchWeatherApi();
    displaySearchCity();
};

function fetchBeerApi() {
    fetch("https://api.openbrewerydb.org/breweries?by_city=" + city + "&per_page=5")
    // the following code converts to json
    .then(function(resp) { return resp.json() }) 
    .then(function(data) {
    console.log(data);
    displayBreweries(data);
    })
    .catch(function() {
    // catch any errors
    });
};

function displayBreweries(d) {
    $("#breweryList").empty();
    console.log(d);
    for (let i = 0; i < d.length; i ++) {
        var brewName = $("<h3>").text(d[i].name).attr("class", "breweryName");
        var brewAddress = $("<p>").text(d[i].street).attr("class", "breweryAddress");
        var brewPostal = $("<p>").text(d[i].postal_code).attr("class","breweryZip");
        var brewUrl = $("<a>").text(d[i].website_url).attr("href", d[i].website_url).attr("class", "breweryLink");

        $("#breweryList").append(
            brewName,
            brewAddress,
            brewPostal,
            brewUrl
        );
    }
};

function fetchWeatherApi() {
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey)
    // the following code converts to json
    .then(function(resp) { return resp.json() }) 
    .then(function(data) {
    //console.log(data);
    displayForecast(data);
    })
    .catch(function() {
        // catch any errors
    });
};

function displaySearchCity() {
    var  cityInput = $("<h2>").text(city);
    $("#cityInput").append(
    cityInput
    );
}

function displayForecast(d) {
    $("weatherForecast").empty();
    var date = 0;
    for (let i = 0; i < d.list.length; i = i + 8){
    //console.log(i,d.list[i]);
    date++; 
    var eachDay = moment().add(date, 'd').format("l");
    var dailyIcon = d.list[i].weather[0].icon;
    var dailyIconUrl = "https://openweathermap.org/img/wn/" + dailyIcon + ".png";
    var dailyFar = Math.round(((parseFloat(d.list[i].main.temp)-273.15)*1.8)+32);

    $("#weatherForecast").append(
        `<div class="card is-one-third">
            <div class="card-content">
                <div class="media">
                <div class="media-left">
                    <figure class="image is-48x48">
                    <img src="${dailyIconUrl}">
                    </figure>
                </div>
                <div class="media-left">
                    <div class="media-content">
                        <p class="title is-4">${eachDay}</p>
                        <p class="subtitle is-6">Temp: ${dailyFar} F</p>
                    </div>
                </div>
            </div>
        </div>`
    )
    }
};

buttonEl.on("click", runApis);