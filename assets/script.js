var apiKey = "f92c4824a1f3e36129b27679f0d59f91";
var city = "";
var searchBarEl = $("#searchBar");
var buttonEl = $("button");
var cityList = [];
var headerOn = false;

function runApis() {
    var cityInput = searchBarEl.val().trim();
    city = cityInput;

    function storedCity() {
        cityList.push(city)
        localStorage.setItem("cityList", JSON.stringify(cityList));
        console.log(localStorage, cityList);
    };

    storedCity();
    fetchBeerApi();
    fetchWeatherApi();
    displaySearchCity();
    displayHeader();
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

function displayHeader() {
    if (headerOn) {
        return;
    }else {
        var header = $("<h2>").text("🍻 BREWERIES 🍻");
        $("#breweryHeader").append(
            header
        )
        headerOn = true
    }
};

function displayBreweries(d) {
    $("#breweryList").empty();
    console.log(d);
    for (let i = 0; i < d.length; i ++) {
        var brewUrl = $("<a>").text(d[i].name).attr("href", d[i].website_url).attr("class", "breweryLink");
        var brewAddress = $("<p>").text(d[i].street).attr("class", "breweryAddress");
        var brewPostal = $("<p>").text(d[i].postal_code).attr("class","breweryZip");


        $("#breweryList").append(
            brewUrl,
            brewAddress,
            brewPostal
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
    $("#weatherForecast").empty();
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
                        ${dailyFar >= 100 ?
                            "<p>👽  The heat is out of this world,<br> don't forget to stay hydrated!</p>" : ""
                        }
                        ${dailyFar <= 50 ?
                            "<p> Pluto 🪐 is warmer this time of year, <br> wear a Jacket!</p>" : ""
                        }
                        ${dailyFar < 99 && dailyFar > 51 ?
                            "<p>It's a great day to enjoy <br> a beer on Earth!🍺  </p>" : ""
                        }
                    </div>
                </div>
            </div>
        </div>`
    )
    }
};

buttonEl.on("click", runApis);