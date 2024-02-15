const citySearchInput = document.querySelector("input.mb-5");
const cityName = document.querySelector("h2.mt-3.mb-0");
const weatherDegree = document.querySelector("h1.large-font.mr-3");
const timeAndDate = document.querySelector("small.time-and-date");
const icontext = document.querySelector("small.icon-text");
const icon = document.querySelector("img.icon");
const cloudy = document.querySelector(".cloud p.ml-auto");
const wind = document.querySelector(".wind p.ml-auto");
const humidity = document.querySelector(".humidity p.ml-auto");
const pressure = document.querySelector(".pressure p.ml-auto");
const optCity1 = document.querySelector(".optcity__one");
const optCity2 = document.querySelector(".optcity__two");
const optCity3 = document.querySelector(".optcity__three");
const optCity4 = document.querySelector(".optcity__four");

let cityData = [];
const apiKey = "b8b2bc6cc3def4c8452b6812772a682f";
const defaultCity = "london";
async function fetchWeatherData(city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) {
        throw new Error("There was an error with the URL");
      }
      const data = await response.json();
      const cityData = [data];
      console.log(cityData);
      retriveWeatherData(cityData);
    } catch (error) {
      handleApiError(error);
    }
  }
  
function handleApiError(error) {
  console.error("An error occurred:", error);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchWeatherData(defaultCity);
});

citySearchInput.addEventListener("keydown", function (e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    let city = e.target.value;
    console.log(city);
    fetchWeatherData(city);
  }
});

function retriveWeatherData(citySelected) {
  cityName.textContent = citySelected[0].name;
  weatherDegree.textContent = citySelected[0].main.temp.toFixed(0) + "°C";
  timeAndDate.textContent = formatTimeAndDate(citySelected[0].timezone);
  icontext.textContent = citySelected[0].weather[0].description;
  icon.src = `https://openweathermap.org/img/wn/${citySelected[0].weather[0].icon}@2x.png`;
  cloudy.textContent = `${citySelected[0].clouds.all}%`;
  wind.textContent = `${citySelected[0].wind.speed.toFixed(2)} km/h`;
  humidity.textContent = `${citySelected[0].main.humidity}%`;
  pressure.textContent = `${citySelected[0].main.pressure.toFixed(0)} hPa`;
}

function formatTimeAndDate(timezoneOffsetMs) {
  timezoneOffsetMs = timezoneOffsetMs * 1000;
  const currentTimeMs = Date.now();
  const timeInSpecifiedTimezone = new Date(currentTimeMs + timezoneOffsetMs);

  // Extract hours, minutes, and seconds from the time
  const hours = timeInSpecifiedTimezone.getUTCHours();
  const minutes = timeInSpecifiedTimezone.getUTCMinutes();

  // Extract date components
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayOfWeek = days[timeInSpecifiedTimezone.getUTCDay()];
  const dayOfMonth = String(timeInSpecifiedTimezone.getUTCDate()).padStart(
    2,
    "0"
  );
  const monthName = months[timeInSpecifiedTimezone.getUTCMonth()];
  const year = String(timeInSpecifiedTimezone.getUTCFullYear()); // Get last 2 digits of the year

  // Format the date and time
  const formattedDateTime = `${hours}:${minutes} - ${dayOfWeek}-${dayOfMonth} ${monthName} ${year}`;
  return formattedDateTime;
}
