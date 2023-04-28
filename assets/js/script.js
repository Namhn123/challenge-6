var apiKey = "dd3a891209863bb45d12f6ff64e74adf";//api key gotten from openweathermap

var searchHistory = JSON.parse(localStorage.getItem("search"));//gets search history list from local storage
if (searchHistory == null) { //if there is no list in local storage, set each entry as empty string
	searchHistory = [];
}

//gets the coordinates of a city
function getCoordinates(city) {
	var coordinateUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + encodeURI(city) + "&limit=1&appid=" + apiKey;
	//gets api data from url
	fetch(coordinateUrl)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			getWeather(data[0].lat, data[0].lon);//passes the longitude and latitude to another function
		}).catch(function() {//alerts whenever a bad input is given
			alert("Invalid city name. Please try again.");
		});
}

//gets the data of the current time's weather and sets the text
function getWeather(lat, lon) {
	var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";

	fetch(weatherUrl)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {//if successful, sets the data received as the text
			$("#cityName").text(data.name + " " + dayjs().format("M/D/YYYY"));
			$("#icon").attr("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");//displays icon as img
			$("#temp").text("Temp: " + data.main.temp);
			$("#wind").text("Wind: " + data.wind.speed);
			$("#humidity").text("Humidity: " + data.main.humidity);
			getForecast(lat, lon);//passes latitude and longitude to another function
		});
}

//gets the data of the next 5 days weather at 12pm and sets the text for each one
function getForecast(lat, lon) {
	var weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";

	fetch(weatherUrl)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			var counter = 1;//counter to tell what day is currently in the loop
			for (var i=4; i<=36; i=i+8) {//list gives data every 3 hours, index starts at 4 to give 12pm and increments by 8 to do the next 24 hours
				var forecastDay = data.list[i];
				//sets the text for the respective containers
				$("#day"+counter).text(dayjs().add(counter, 'day').format("M/D/YYYY"));
				$("#icon"+counter).attr("src", "http://openweathermap.org/img/wn/" + forecastDay.weather[0].icon + "@2x.png");
				$("#temp"+counter).text("Temp: " + forecastDay.main.temp);
				$("#wind"+counter).text("Wind: " + forecastDay.wind.speed);
				$("#humidity"+counter).text("Humidity: " + forecastDay.main.humidity);
				counter++;
			}
			$("#weatherDisplay").css("visibility", "visible");//makes the whole display visible
		});
}

//creates buttons of past search history
function displaySearchHistory() {
	$("#searchList").empty();//empties the current buttons on the list
	//creates new button for each entry in the search history
	for(var i=0; i<searchHistory.length; i++) {
		var newBtn = $("<button></button>").text(searchHistory[i]);
		newBtn.attr("type", "button");
		newBtn.attr("class", "btn btn-secondary mt-2 historyBtn");
		$("#searchList").append(newBtn);
	}
}

//uses search history button that was clicked on and gets the weather
function handleHistorySearch(event) {
	event.preventDefault();
	getCoordinates($(this).text())
}

//event handler for submit button
$("#citySubmit").on( "submit", function(event) {
	event.preventDefault();
	searchHistory.unshift($("#city").val());//adds the new search onto the beginning of the search history array
	localStorage.setItem("search", JSON.stringify(searchHistory));//updates local storage
  getCoordinates($("#city").val());//sends city string to function
	displaySearchHistory();//updates the search list buttons
} );

$('#searchList').on('click', '.historyBtn', handleHistorySearch);

displaySearchHistory();