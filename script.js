const city=document.getElementById('city');
const submit=document.getElementById('submit');
const container= document.getElementById('container');

async function cityData(name) {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${name}?unitGroup=metric&key=RSBBEPD345YP25H32JLM2EK5J&contentType=json`);
        const result = await response.json();
        console.log(result.days[0])
        return {
            address: result.address,
            cityWeather: result.days[0],
        };
    } catch (error) {
        alert("Could not fetch weather for this city. Please check the spelling.");
        throw error;
    }
}

const addCity= async (name) => {
    const city= await cityData(name);

    const weatherBlock=document.createElement('div'); //main div where all data will be displayed
    const cityName=document.createElement('h1'); // display name of the city
    const curTemp=document.createElement('h2'); // display current temp
    const tempRange = document.createElement("p"); //min annd max temp
    const feelsLike = document.createElement("p"); 
    const humidity = document.createElement("p");

    // append everything you want to display
    cityName.textContent=city.address;
    curTemp.textContent=` ${city.cityWeather.temp} \u00B0C` // add the degree symbol
    tempRange.textContent=`${city.cityWeather.tempmax}/${city.cityWeather.tempmin} \u00B0C`
    feelsLike.textContent=`Feels Like: ${city.cityWeather.feelslike} \u00B0C`;
    humidity.textContent=`Humidity: ${city.cityWeather.humidity}%`;
    // add cityName, temp ,humidity, to the div 
    weatherBlock.appendChild(cityName);
    weatherBlock.appendChild(curTemp);
    weatherBlock.appendChild(tempRange);
    weatherBlock.appendChild(feelsLike);
    weatherBlock.appendChild(humidity);
    // remove button to remove added cities 
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
        weatherBlock.remove();
         removeCityFromStorage(city.address); // This removes it from localStorage too
    });
    // add a class to the div to make css easier
    weatherBlock.appendChild(removeBtn);
    weatherBlock.classList.add('weather');
    weatherBlock.classList.add(city.cityWeather.icon); // change background color based on the weather icon 

    // add the div to the container div 
    container.appendChild(weatherBlock);
    
}
function addCityToStorage(input) {
    // Get the existing list of cities from localStorage
    let cities = JSON.parse(localStorage.getItem("cities")) || [];

    // Avoid adding duplicates
    if (!cities.includes(input)) {
        cities.push(input);
        localStorage.setItem("cities", JSON.stringify(cities));
    }
}


submit.addEventListener('click', () => {
    let input = city.value;
    input = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();

    addCity(input); // add city to the dom
    cityData(input);// temporary console log to add more values
    addCityToStorage(input); // add the city to localStorage

    city.value = ''; // Clear input
});


// clean up using css

//get saved cities from localStorage
function getCitiesFromStorage(){
    let cities=JSON.parse(localStorage.getItem("cities"));
    for(let i=0;i<cities.length;i++){
        addCity(cities[i]);
    }
}

//execute the function to load previously saved cities 
getCitiesFromStorage();


// make remove button remove the city from storage
function removeCityFromStorage(cityName) {
    let cities = JSON.parse(localStorage.getItem("cities")) || [];
    cities = cities.filter(city => city !== cityName);
    localStorage.setItem("cities", JSON.stringify(cities));
}
