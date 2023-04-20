let searchInput = document.querySelector(".search-box input");
let searchButton = document.querySelector(".search-box button");
let weatherImage = document.querySelector(".weather-icon");
let weather = document.querySelector(".weather");
let errorText = document.querySelector(".error");
let dateOutput = document.querySelector(".date");
let coverWeather = document.querySelector(".imgWeather");

const apiKey = "2c8228a4e72d849615c04b5ce863daae";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (response.status === 404) {
        errorText.style.display = "block";
        weather.style.display = "none";
    } else {
        const data = await response.json();
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "&#8451";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
        if (data.weather[0].main == "Clear") {
            weatherImage.src = "img/clear.png";
            coverWeather.src = "img/clear.jpg";
        } else if (data.weather[0].main == "Clouds") {
            weatherImage.src = "img/clouds.png";
            coverWeather.src = "img/cloudy.jpg";
        } else if (data.weather[0].main == "Rain") {
            weatherImage.src = "img/rain.png";
            coverWeather.src = "img/rainy.jpg";
        } else if (data.weather[0].main == "Snow") {
            weatherImage.src = "img/snow.png";
            coverWeather.src = "img/snow.jpg";
        }
        weather.style.display = "block";
        errorText.style.display = "none";
    }
}

window.addEventListener("load", function () {
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let today = new Date();
    let day = days[today.getDay()];
    let month = months[today.getMonth()];
    let date = today.getDate();
    let formattedDate = `${day} ${date} ${month}`;
    dateOutput.innerHTML = formattedDate;
    let city = 'Kyiv';
    checkWeather(city);
});

searchButton.addEventListener("click", () => {
    checkWeather(searchInput.value);
    searchInput.value = "";
});

searchInput.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
        checkWeather(searchInput.value);
        searchInput.value = "";
    }
});