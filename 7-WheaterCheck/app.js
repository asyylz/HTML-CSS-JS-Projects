// const fetchData = async () => {
//     const url = "https://weatherapi-com.p.rapidapi.com/current.json?q=53.1%2C-0.13";
//     const options = {
//       method: "GET",
//       headers: {
//         "X-RapidAPI-Key": "b8b2bc6cc3def4c8452b6812772a682f",
//         "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
//       },
//     };
//     try {
//       const response = await fetch(url, options);
//       const result = await response.text();
//       console.log(result);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   // Call the fetchData function to execute the asynchronous operation
//   fetchData();

/* ---------------------- API Call ---------------------- */
// const apiKey = "b8b2bc6cc3def4c8452b6812772a682f";
// const city = "London"
// const getData = () => {
//     fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error("There was an error with the URL");
//         }
//         return res.json();
//       })
//       .then((data) => {
//         console.log(data);
//       })
//       .catch((error) => {
//         console.error("An error occurred:", error);
//       });
// }
// getData();
/* ------------------------ JSON ------------------------ */
fetch("weather.json")
  .then((response) => response.json())
  .then((data) => {
    localStorage.setItem("weather", JSON.stringify(data));
    // if (!localStorage.getItem("weatherOut")) {
    //   localStorage.setItem("weatherOut", "[]");
    // }
    console.log(data);
  })
  .catch((error) => {
    console.error("Error fetching weather data:", error);
  });
const weatherOut = JSON.parse(localStorage.getItem("weather")) || [];
/* ------------------ Global variables ------------------ */
//const cityName = document.querySelector("h2.mt-3.mb-0");
let cityName;
let weatherDegree;
let times;
let icontext;
let icon;
function cathHTMLElements() {
  cityName = document.querySelector("h2.mt-3.mb-0");
  weatherDegree = document.querySelector("h1.large-font.mr-3");
  timeAndDate = document.querySelector("small.time-and-date");
  icontext = document.querySelector("small.icon-text");
  console.log(icontext)
  icon = document.querySelector("h3.icon");
}
function retriveWeatherData() {
  const divForWeatherContext = document.querySelector("body");
  divForWeatherContext.innerHTML = "";
  divForWeatherContext.insertAdjacentHTML("beforeend", createWeatherContext());
  cathHTMLElements();
  cityName.textContent = weatherOut.name;
  weatherDegree.textContent = weatherOut.main.temp.toFixed(0) + "°C";
  timeAndDate.textContent = formatTimeAndDate(weatherOut.time)
  icontext.textContent = weatherOut.weather[0].description;
  //icon.textContent = weatherOut.weather[0].icon;
  //icon.classList.add('')
}
retriveWeatherData();

function formatTimeAndDate(timezoneOffsetMs) {
  timezoneOffsetMs = 10800 * 1000;
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
function createWeatherContext() {
  return ` <div class="container-fluid px-1 px-sm-3 py-5 mx-auto">
    <div class="row d-flex justify-content-center">
        <div class="row card0">
            <div class="card1 col-lg-8 col-md-7">
                <h1>Weather</h1>
                <div class="text-center">
                    <img class="image mt-5" src="/assets/london.jpeg">
                </div>
                <div class="row px-3 mt-3 mb-3">
                    <h1 class="large-font mr-3">26&#176;</h1>
                    <div class="d-flex flex-column mr-3">
                        <h2 class="mt-3 mb-0">London</h2>
                        <small class="time-and-date">10:36 - Tuesday, 22 Oct '19</small>
                    </div>
                    <div class="d-flex flex-column text-center">
                        <h3 class="icon mt-4">icon</h3>
                        <small class="icon-text">Sunny</small>
                    </div>
                </div>
            </div>
            <div class="card2 col-lg-4 col-md-5">
                <div class="row px-3">
                    <input type="text" name="location" placeholder="Another location" class="mb-5">
                    <div class="fa fa-search mb-5 mr-0 text-center"></div>
                </div>
                <div class="mr-5">
                    <p class="light-text suggestion">Birmingham</p>
                    <p class="light-text suggestion">Manchester</p>
                    <p class="light-text suggestion">New York</p>
                    <p class="light-text suggestion">California</p>

                    <div class="line my-5"></div>

                    <p>Weather Details</p>
                    <div class="row px-3">
                        <p class="light-text">Cloudy</p>
                        <p class="ml-auto">12%</p>
                    </div>
                    <div class="row px-3">
                        <p class="light-text">Humidity</p>
                        <p class="ml-auto">78%</p>
                    </div>
                    <div class="row px-3">
                        <p class="light-text">Wind</p>
                        <p class="ml-auto">1km/h</p>
                    </div>
                    <div class="row px-3">
                        <p class="light-text">Rain</p>
                        <p class="ml-auto">0mm</p>
                    </div>
                    <div class="line mt-3"></div>
                </div>
            </div>
        </div>
    </div>
</div>`;
}
