import {
    search,
    windMainEl,
    velocityMainEl,
    humidityMainEl,
    tempMainEl,
    weatherIcon,
    city,
    forecastIcon,
    windEl,
    velocityEl,
    humidityEl,
    time,
    tempEl,
    API_KEY,
    BASE_URL,
} from "./Variables.js";

// Function to update the UI based on the different locations
const uiUpdate = (cityName, humidity, temp, windSpeed, dropletMm, { text }) => {
    humidityMainEl.textContent = humidity + "%";
    tempMainEl.textContent = temp + "°";
    velocityMainEl.textContent =
        Math.round(Math.ceil(windSpeed * (5 / 18))) + " m/s";
    windMainEl.textContent = dropletMm + " mm";

    // Changing the icons based on the weather conditions
    weatherIcon.attributes.name.nodeValue = isWeatherIcon(text);

    city.textContent = cityName;
};

export async function forecastDay(cityName = "london") {
    const responseData = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${cityName}`
    ).then((response) => response.json());

    console.log(responseData.forecast);

    velocityEl.forEach((velocity, index) => {
        const { wind_mph } = responseData.forecast.forecastday[0].hour[index];
        velocity.innerHTML =
            Math.floor(wind_mph) + `<span class="special"> m/h</span>`;
    });

    windEl.forEach((wind, index) => {
        const { precip_mm } = responseData.forecast.forecastday[0].hour[index];
        wind.innerHTML =
            Math.ceil(precip_mm) + `<span class="special"> mm</span>`;
    });

    humidityEl.forEach((humidityValue, index) => {
        const { humidity } = responseData.forecast.forecastday[0].hour[index];
        humidityValue.innerHTML = humidity + `<span class="special"> %</span>`;
    });

    tempEl.forEach((temp, index) => {
        const { temp_c } = responseData.forecast.forecastday[0].hour[index];
        temp.innerHTML = Math.floor(temp_c) + "°";
    });

    time.forEach((timeValue, index) => {
        const { time } = responseData.forecast.forecastday[0].hour[index];
        timeValue.innerHTML = time.split(" ")[1];
    });

    forecastIcon.forEach((icon, index) => {
        const { text } =
            responseData.forecast.forecastday[0].hour[index].condition;
        icon.attributes.name.nodeValue = isWeatherIcon(text);
    });
}

export async function initialData() {
    const responseData = await fetch(
        `${BASE_URL}/current.json?key=${API_KEY}&q=london&aqi=yes`,
        {
            method: "GET",
        }
    ).then((response) => response.json());

    const { humidity, temp_c, wind_kph, precip_mm } = responseData.current;
    const { name: cityName } = responseData.location;

    forecastDay();

    uiUpdate(
        cityName,
        humidity,
        temp_c,
        wind_kph,
        precip_mm,
        responseData.current.condition
    );
}

export async function fetchData(e) {
    e.preventDefault();

    const searchValue = search.value;

    const responseData = await fetch(
        `${BASE_URL}/current.json?key=${API_KEY}&q=${searchValue}&aqi=yes`,
        {
            method: "GET",
        }
    ).then((response) => response.json());

    const { humidity, temp_c, wind_kph, precip_mm } = responseData.current;
    const { name: cityName } = responseData.location;

    // Clears the Search bar value
    clearSearchValue();

    forecastDay(searchValue);

    uiUpdate(
        cityName,
        humidity,
        temp_c,
        wind_kph,
        precip_mm,
        responseData.current.condition
    );
}

// Function to change weather icons
export function isWeatherIcon(weatherText) {
    // For Forecast Icons
    switch (weatherText) {
        case "Mist":
        case "rainy":
        case "Light rain shower":
        case "Moderate rain at times":
            return "rainy";

        case "Partly Cloudy":
        case "Partly cloudy":
        case "Overcast":
            return "cloudy";

        case "Sunny":
        case "Clear":
            return "sunny";

        default:
            return "thunderstorm";
    }
}

// Function to clear the Search value
const clearSearchValue = () => {
    search.value = "";
};
