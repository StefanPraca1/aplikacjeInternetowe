const apiKey = '3b20ec2c1a48a38e1f10f7c525a200dc';

document.getElementById('get-weather').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    if (city) {
        getCurrentWeather(city);
        getWeatherForecast(city);
    } else {
        alert("Wpisz nazwę miasta!");
    }
});

function getCurrentWeather(city) {
    const xhr = new XMLHttpRequest();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pl&units=metric`;

    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const response = JSON.parse(xhr.responseText);
            console.log("Bieżąca pogoda:", response); 
            document.getElementById('current-weather').innerHTML = `
                <h3>Obecna pogoda w ${response.name}</h3>
                <p>Temperatura: ${response.main.temp}°C</p>
                <p>Opis: ${response.weather[0].description}</p>
                <img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png" 
                     alt="${response.weather[0].description}" class="weather-icon">
            `;
        } else if (xhr.readyState == 4) {
            alert("Nie można pobrać danych o pogodzie.");
        }
    };
    xhr.send();
}

function getWeatherForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=pl&units=metric`;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Nie można pobrać prognozy pogody.");
            }
        })
        .then(data => {
            console.log("Prognoza pogody (5 dni):", data); 
            const forecastContainer = document.getElementById('forecast');
            forecastContainer.innerHTML = `<h3>Prognoza 5-dniowa dla ${city}</h3>`;

           
            const groupedForecasts = groupForecastsByDate(data.list);

            for (const [date, forecasts] of Object.entries(groupedForecasts)) {
                forecastContainer.innerHTML += `<h4>${date}</h4>`; 
                forecasts.forEach(forecast => {
                    const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
                    forecastContainer.innerHTML += `
                        <div class="forecast-item">
                            <img src="${iconUrl}" alt="${forecast.weather[0].description}" class="weather-icon">
                            <p><strong>${forecast.dt_txt}</strong></p>
                            <p>Temperatura: ${forecast.main.temp}°C</p>
                            <p>Opis: ${forecast.weather[0].description}</p>
                        </div>
                    `;
                });
            }
        })
        .catch(error => alert(error.message));
}

// Funkcja do grupowania prognoz po datach
function groupForecastsByDate(forecasts) {
    return forecasts.reduce((acc, forecast) => {
        const date = forecast.dt_txt.split(' ')[0]; // Pobieramy tylko datę (bez godziny)
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(forecast);
        return acc;
    }, {});
}
