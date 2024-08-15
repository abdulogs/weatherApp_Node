var api_key = "49cc8c821cd2aff9af04c9f98c36eb74";
var api_endpoint = "https://api.openweathermap.org/data/2.5/"

let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let date_el = document.getElementById("date");
let time_el = document.getElementById("time");

function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
}

function formatTemperature(tempInKelvin) {
    const tempInCelsius = kelvinToCelsius(tempInKelvin);
    return tempInCelsius.toFixed(2) + '° C';
}
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const dateformat12hrs = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    time_el.innerHTML = (dateformat12hrs < 10 ? '0' + dateformat12hrs : dateformat12hrs) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`
    date_el.innerHTML = days[day] + ', ' + date + ' ' + months[month]
}, 1000);

function format_time(data) {
    // Convert the UNIX timestamp to milliseconds
    const date = new Date(data * 1000);

    // Get hours and minutes
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Determine AM or PM suffix
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert 24-hour format to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    // Add leading zero to minutes if necessary
    minutes = minutes < 10 ? '0' + minutes : minutes;

    // Combine hours, minutes, and AM/PM
    const formattedTime = hours + ':' + minutes + ' ' + ampm;

    return formattedTime;
}

function format_week(unixTimestamp) {
    // Convert the UNIX timestamp to milliseconds
    const date = new Date(unixTimestamp * 1000);

    // Get the day of the week
    const dayName = days[date.getDay()];

    return dayName;
}
async function get_location_weather(city) {
    try {
        let data = await fetch(`${api_endpoint}weather?q=${city}&appid=${api_key}`);
        const results = await data.json();

        if (data.ok) {
            let {
                coord
            } = results;
            weekly_weather(coord.lat, coord.lon);
            display_location_weather(results)
        } else {
            console.log("City not found. Please try again.")
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}
async function weekly_weather(latitude, longitude) {
    try {
        let data = await fetch(`${api_endpoint}onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&appid=${api_key}`);
        let results = await data.json();

        if (data.ok) {
            display_weekly_weather(results)
        } else {
            console.error("Weekly Data Error:");
        }
    } catch (error) {
        console.error("Weekly Data Error:", error);
    }
}

function display_weekly_weather(data) {
    let {
        lat,
        lon,
        timezone
    } = data
    let {
        humidity,
        pressure,
        sunrise,
        sunset,
        wind_speed
    } = data.current;
    let template = ""
    document.querySelector("#timezone").innerHTML = timezone
    document.querySelector("#lon").innerHTML = lon
    document.querySelector("#lat").innerHTML = lat
    document.querySelector("#pressure").innerHTML = pressure
    document.querySelector("#wind_speed").innerHTML = wind_speed
    document.querySelector("#humidity").innerHTML = humidity + "%"
    document.querySelector("#sunrise").innerHTML = format_time(sunrise)
    document.querySelector("#sunset").innerHTML = format_time(sunset)

    data.daily.forEach((item) => {
        template += `
        <div class="item">
            <div class="day">${format_week(item.dt)}</div>
            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" class="image">
            <div class="temperature">Night ${formatTemperature(item.temp.night)}</div>
            <div class="temperature">Day ${formatTemperature(item.temp.day)}</div>
        </div>
       `;
    })

    document.getElementById("weekly-forecast").innerHTML = template
}

function display_location_weather(data) {
    let {
        name,
        dt,
        weather,
        main
    } = data
    document.querySelector("#place").innerHTML = name
    document.querySelector("#today").innerHTML = format_week(dt)
    document.querySelector("#icon").src = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
    document.querySelector("#temp").innerHTML = formatTemperature(main.feels_like)
}

