let searchInput = document.querySelector(".search-box input");
let searchButton = document.querySelector(".search-box button");
let weatherImage = document.querySelector(".weather-icon");
let weather = document.querySelector(".weather");
let errorText = document.querySelector(".error");
let dateOutput = document.querySelector(".date");
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const apiKey = "2c8228a4e72d849615c04b5ce863daae";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;
const apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=`;

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (response.status === 404) {
        errorText.style.display = "block";
        weather.style.display = "none";
    } else {
        const data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "&#8451";
        document.querySelector(".description").innerHTML = data.weather[0].description;
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
        if (data.weather[0].main == "Clear") {
            weatherImage.src = "img/clear.png";
            document.body.style.backgroundImage =  'url("img/clear.jpg")';
        } else if (data.weather[0].main == "Clouds") {
            weatherImage.src = "img/clouds.png";
            document.body.style.backgroundImage =  'url("img/cloudy.jpg")';
        } else if (data.weather[0].main == "Rain") {
            weatherImage.src = "img/rain.png";
            document.body.style.backgroundImage =  'url("img/rainy.jpg")';
        } else if (data.weather[0].main == "Snow") {
            weatherImage.src = "img/snow.png";
            document.body.style.backgroundImage =  'url("img/snow.jpg")';
        }
        weather.style.display = "flex";
        errorText.style.display = "none";
    }
}

window.addEventListener("load", function () {
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let today = new Date();
    let day = days[today.getDay()];
    let month = months[today.getMonth()];
    let date = today.getDate();
    let formattedDate = `${day} ${date} ${month}`;
    dateOutput.innerHTML = formattedDate;
    
    navigator.geolocation.getCurrentPosition(updateLocation);

    function updateLocation(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        const geolocation = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}9&lon=${longitude}&appid=${apiKey}`;
        cityApi(geolocation);
    }

    async function cityApi(url) {
        const response = await fetch(url);
        let city = await response.json();
        checkWeather(city.name);
        forecast(city.name);
    }
});

searchButton.addEventListener("click", () => {
    checkWeather(searchInput.value);
    forecast(searchInput.value)
    searchInput.value = "";
});

searchInput.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
        checkWeather(searchInput.value);
        forecast(searchInput.value)
        searchInput.value = "";
    }
});


async function forecast(city) {
    let response = await fetch(apiUrlForecast + city + `&appid=${apiKey}` + `&units=metric`);
    let data = await response.json();

    let dailyData = {};

    data.list.forEach(item => {
        let date = new Date(item.dt * 1000);
        let day = days[date.getDay()];
        let temp = item.main.temp;
        let weatherMain = item.weather[0].main;

        let today = days[new Date().getDay()];
        if (day === today) return;

        if (!dailyData[day]) {
            dailyData[day] = {
                temp: temp,
                weatherCount: {},
                weather: weatherMain
            };
        }

        if (temp > dailyData[day].temp) {
            dailyData[day].temp = temp;
        }

        dailyData[day][weatherMain] = (dailyData[day][weatherMain] || 0) + 1;

        dailyData[day].weatherCount[weatherMain] = (dailyData[day].weatherCount[weatherMain] || 0) + 1;

        if (dailyData[day].weatherCount[weatherMain] > (dailyData[day].weatherCount[dailyData[day].weather] || 0)) {
            dailyData[day].mostCommonWeather = weatherMain;
        }

    });

    let forecastContainer = document.querySelector(".forecast");
    if (forecastContainer.children.length != 0) forecastContainer.replaceChildren();

    for (let day in dailyData) {
        const { temp, weather } = dailyData[day];
        forecastDay(day, temp, weather);
    }
}


function forecastDay(day, temp, sky) {
    let forecastContainer = document.querySelector(".forecast");

    let dayBox = document.createElement("div");
    dayBox.classList.add("days");

    let dayDiv = document.createElement("div");
    dayDiv.classList.add("day-header");
    let dayHeader = document.createElement("h1");
    dayHeader.innerHTML = day;
    dayDiv.append(dayHeader);

    let iconDiv = document.createElement("div");
    iconDiv.classList.add("icon-container");
    let icon = document.createElement("img");
    icon.src = getWeatherIcon(sky);
    iconDiv.append(icon);

    let tempDiv = document.createElement("div");
    tempDiv.classList.add("temp-header");
    let tempHeader = document.createElement("h2");
    tempHeader.innerHTML = Math.round(temp) + "&#8451";
    tempDiv.append(tempHeader);

    dayBox.append(dayDiv, iconDiv, tempDiv);
    forecastContainer.append(dayBox);
}


function getWeatherIcon(sky) {
    const icons = {
        Clear: "img/clear.png",
        Clouds: "img/clouds.png",
        Rain: "img/rain.png",
        Snow: "img/snow.png"
    };
    return icons[sky];
}