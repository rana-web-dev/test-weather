const condition_img = document.getElementById("condition-img");
const city_name = document.getElementById("city-name");
const country_name = document.getElementById("country-name");
const main_text = document.getElementById("main");
const description = document.getElementById("description");
const temparature = document.getElementById("temp");
const pressure = document.getElementById("pressure");
const humidity = document.getElementById("humidity");

const city_input = document.getElementById("city-input");
const historyEl = document.getElementById("history");
const master_history = document.getElementById("master-history");

const url_keys = "bf1efa9f7ab72b9bf42a602fa15a7d23";
const base_url = `https://api.openweathermap.org/data/2.5/weather?appid=${url_keys}`;

const icon_url = `http://openweathermap.org/img/wn/`;
const defualt_city = "Pabna, BD";

// Function and Condition

window.onload = function () {
  navigator.geolocation.getCurrentPosition(
    (s) => {
      // console.log(s.coords)
      getWeatherData(null, s.coords);
    },
    (e) => {
      // console.log(e);
      getWeatherData();
    }
  );

  axios.get("/api/history").then((data) => {
    console.log(data);
  });

  city_input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      if (e.target.value) {
        console.log("Hala click korchis keno");
        getWeatherData(e.target.value);
        const countrys = e.target.value;
        const obj = { countrys };
        axios
          .post("http://localhost:5656/history", person)
          .then((data) => console.log(data));
      } else {
        alert("Please Enter a Valid City Name..");
      }

      function getWeatherData(city = defualt_city, coords) {
        let url = base_url;
        city === null
          ? (url = `${url}&lat=${coords.latitude}&lon=${coords.longitude}`)
          : (url = `${url}&q=${city}`);
        // console.log(url)

        axios
          .get(url)
          .then(({ data }) => {
            let weather = {
              icon: data.weather[0].icon,
              city_name: data.name,
              country_name: data.sys.country,
              main_text: data.weather[0].main,
              description: data.weather[0].description,
              temparature: data.main.temp,
              pressure: data.main.pressure,
              humidity: data.main.humidity,
            };

            // Send data to database
            axios
              .post("http://localhost:5656/history", weather)
              .then((data) => console.log(data));

            setWeather(weather);
            setData(weather);
          })
          .catch((e) => {});
      }

      function setWeather(weather) {
        condition_img.src = `${icon_url}${weather.icon}.png`;
        city_name.innerHTML = weather.city_name;
        country_name.innerHTML = weather.country_name;
        main_text.innerHTML = weather.main_text;
        description.innerHTML = weather.description;
        temparature.innerHTML = weather.temparature;
        pressure.innerHTML = weather.pressure;
        humidity.innerHTML = weather.humidity;
      }
    }
  });
};

axios
  .get("http://localhost:5656/weather")
  .then(({ data }) => searchHistory(data));

function historyDelete(history) {

  console.log(history);

  axios.delete(`http://localhost:5656/weather/${history._id}`)
  .then((result) => console.log(result));

}

function searchHistory(data) {
  const historyId = document.getElementById("master-history");

  const dataRev = data.reverse();

  dataRev.forEach((history) => {
    const {
      _id,
      city_name,
      country_name,
      description,
      humidity,
      icon,
      main_text,
      pressure,
      temparature,
    } = history;


    const createDiv = document.createElement("div");
    createDiv.innerHTML = `

      <div class="block p-4 rounded-lg shadow-lg bg-white w-11/12">
        <div class="flex w-full">
            <div class="w-32">
              <img src="https://openweathermap.org/img/w/03d.png" class="condition w-full" alt="">
            </div>
            <div class="text-left w-auto leading-7 pl-4">
              <p>
                <strong>
                  <span class="city"> ${country_name} </span>, 
                  <span class="country"> ${city_name} </span>
                </strong><br>
                <strong>
                  <span class="main"> Cloud </span>
                </strong>
                ( <span class="description"> ${description} </span> ) <br>
                TEMPARATURE : <strong><span id="temp"> ${temparature} </span></strong> <br>
                PRESSURE : <strong><span id="pressure"> ${pressure} </span></strong>,
                HUMIDITY : <strong><span id="humidity"> ${humidity} </span></strong>
              </p>
            </div>
          </div>
          <button class="border px-2 py-0" onclick="historyDelete('${history}')">Delete</button>
      </div> 
      
      `;
    historyId.appendChild(createDiv);
  });
}
