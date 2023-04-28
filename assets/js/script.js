var apiKey = "dd3a891209863bb45d12f6ff64e74adf";
var searchHistory = JSON.parse(localStorage.getItem("search"));
if (searchHistory == null) { //if there is no tasks in local storage, set each entry as empty string
	searchHistory = [];
}

function getCoordinates(city) {
	var coordinateUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + encodeURI(city) + "&limit=1&appid=" + apiKey;

	fetch(coordinateUrl)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			getWeather(data[0].lat, data[0].lon);
		});
}

function getWeather(lat, lon) {
	var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";

	fetch(weatherUrl)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			$("#cityName").text(data.name + " " + dayjs().format("M/D/YYYY"));
			$("#icon").attr("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
			$("#temp").text("Temp: " + data.main.temp);
			$("#wind").text("Wind: " + data.wind.speed);
			$("#humidity").text("Humidity: " + data.main.humidity);
			getForecast(lat, lon);
		});
}

function getForecast(lat, lon) {
	var weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";

	fetch(weatherUrl)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			var counter = 1;
			for (var i=4; i<=36; i=i+8) {
				var forecastDay = data.list[i];
				console.log(forecastDay);
				$("#day"+counter).text(dayjs().add(counter, 'day').format("M/D/YYYY"));
				$("#icon"+counter).attr("src", "http://openweathermap.org/img/wn/" + forecastDay.weather[0].icon + "@2x.png");
				$("#temp"+counter).text("Temp: " + forecastDay.main.temp);
				$("#wind"+counter).text("Wind: " + forecastDay.wind.speed);
				$("#humidity"+counter).text("Humidity: " + forecastDay.main.humidity);
				counter++;
			}
			$("#weatherDisplay").css("visibility", "visible");
		});
}

function displaySearchHistory() {
	$("#searchList").empty();
	for(var i=0; i<searchHistory.length; i++) {
		var newBtn = $("<button></button>").text(searchHistory[i]);
		newBtn.attr("type", "button");
		newBtn.attr("class", "btn btn-secondary mt-2 historyBtn");
		$("#searchList").append(newBtn);
	}
}

function handleHistorySearch(event) {
	event.preventDefault();
	getCoordinates($(this).text())
}


$("#citySubmit").on( "submit", function(event) {
	event.preventDefault();
	searchHistory.unshift($("#city").val());
	localStorage.setItem("search", JSON.stringify(searchHistory));
  getCoordinates($("#city").val());
	displaySearchHistory();
} );

$('#searchList').on('click', '.historyBtn', handleHistorySearch);

displaySearchHistory();