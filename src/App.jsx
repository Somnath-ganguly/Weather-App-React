import { useState, useEffect } from 'react';

import './App.css'

/*Images*/

import searchIcon from "./assets/search.png";
import clearIcon from "./assets/clear.png";
import cloudIcon from "./assets/cloud.png";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/rain.png";
import WindIcon from "./assets/wind.png";
import snowIcon from "./assets/snow.png";
import HumidityIcon from "./assets/Humidity.png";



const WeatherDetails =({icon, temp, city , country, lat,log ,Humidity, Wind }) =>{
  return (
  <>
  <div className="image">
    <img src={icon} alt="Image" />
  </div>
  <div className="temp">{temp}°C</div>
  <div className="location">{city}</div>
  <div className="country">{country} </div>
  <div className="cord">
    <div>
      <span className="lat">latitude</span>
      <span>{lat}</span>
    </div>
     <div>
      <span className="log">longitude</span>
      <span>{log}</span>
    </div>
  </div>
  <div className="data-container">
   <div className="element">
      <img src={HumidityIcon} alt=" humidity" className="icon" />
         <div className="data">
        <div className="humidity-percent">{Humidity}%</div>
        <div className="text1">Humidity</div>
      </div>
    </div>
    
    <div className="element">
     <img src={WindIcon} alt="wind" className="icon" /> 
        <div className="data">
        <div className="wind-percent">{Wind}km/h</div>
        <div className="text2">Wind Speed</div> 
      </div>
     </div> 
    </div>

  </>
  );
};

function App() {

  const api_key = import.meta.env.VITE_API_KEY;

  const [text,setText]= useState("Kolkata");

  const [icon, setIcon ] = useState(snowIcon);
  const [temp, setTemp ] = useState(0);
  const [city, setCity  ] =useState("Kolkata");
  const [country,setCountry] = useState("IN")
  const [lat, setLat]  = useState(0);
  const [log,setLog] = useState(0);
  const [Humidity, setHumidity] = useState(0);
  const [Wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState (false);
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState(null);

  const weatherIconMap = {
    "01d":clearIcon,
    "01n":clearIcon,
    "02d":cloudIcon,
    "02n":cloudIcon,
    "03d":drizzleIcon,
    "03n":drizzleIcon,
    "04d":drizzleIcon,
    "04n":drizzleIcon,
    "09d":rainIcon,
    "09n":rainIcon,
    "10d":rainIcon,
    "10n":rainIcon,
    "13d":snowIcon,
    "13n":snowIcon,
  };
  
const  search = async () => {
    setLoading(true);
  setError(null);
  setCityNotFound(false);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(text)}&units=metric&appid=${api_key}`;

try {

  let res = await fetch(url);
  let data = await res.json();
 if(data.cod === 404 || data.cod === "404") {
  console.error("city not found");
  setCityNotFound(true);
  return;
 }
 if(!res.ok) {
  throw new Error(data.message || "Weather service request failed");
 }
 setHumidity(data.main.humidity);
 setWind(data.wind.speed);
 setTemp(Math.floor(data.main.temp));
 setCity(data.name);
 setCountry(data.sys.country);
 setLat(data.coord.lat);
 setLog(data.coord.lon);

 const weatherIconCode = data.weather[0].icon;
  
 setIcon(weatherIconMap[weatherIconCode] || clearIcon);
 setCityNotFound(false);
  

 } catch(error){
  console.error("An error occurred:", error.message);
  setError("An error occurred while fetching weather data.");
} finally {
  setLoading(false);
}
};

 const handleCity = (e) => {
  setText(e.target.value);
  console.log(e.target.value)
 };
 const handlekeyDown = (e) => {

 if(e.key === "Enter") {
  search();
 } 
};
useEffect(function () {
  search();
}, []);

  return  (
     <>
      <div className="container">
       <div className="input-container">
        <input type="text"
         className="cityInput"
        placeholder="Search City" 
         onChange={handleCity} value={text}  onKeyDown={handlekeyDown}/> 
        <div className="search-icon"  onClick={( ) => search()}>
          <img src={searchIcon} alt="Search" />
        </div>
        </div> 
        

        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}

        
        {!loading && ! cityNotFound && <WeatherDetails  icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} Humidity={Humidity} Wind={Wind}/>}
        </div>
      
    </>
  );
}

export default App;
