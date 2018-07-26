import React, { Component } from "react";
import "./App.css";

const appId = "b1b35bba8b434a28a0be2a3e1071ae5b";
const units = "metric";

const ICONS = {
  ADD_TRASHBIN: require("./trash-icon24.png")
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      city: "",
      country: "",
      countryCode: "",
      cities: [],
      currentCity: "",
      weatherData: {}
    };
  }

  onCityChange = (event) => {
    const city = event.target.value;
    this.setState(() => ({ city }));

  };
  onCountryChange = (event) => {
    const country = event.target.value;
    this.setState(() => ({ country }));
  };

  handleAddCity = (event) => {
    event.preventDefault();
    const city = this.state.city;
    if (!city || this.state.cities.find((storedCity) => { return storedCity.toLowerCase() === city.toLowerCase() })) return;
    this.setState({cities: [...this.state.cities, city], city: ""})
  };

  updateData = (city) => {
    if (!city) {
      return;
    }
 
    const URL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appId}&units=${units}`;

    fetch(URL).then(res => res.json()).then(json => {
      this.setState({ weatherData: {
        ...this.state.weatherData,
        [city]: json
      } });
    });
  }

  onCityButtonClick = (city) => {
    const data = this.state.weatherData[city];
    if (!data) {
      this.updateData(city);
    }
    this.setState({ currentCity: city });
  }

  onRemoveButtonClick = (cityToDelete) => {
    const newCities = this.state.cities.filter(city => city !== cityToDelete);
    this.setState({ cities: newCities });
  }

  renderCityButtonContents = (city) => {
    const data = this.state.weatherData[city];
    if (!data) return null;
    if (data.message) return (<div className="city-label-error">{data.message}</div>);
    return(<div className="city-label-weather">{data.weather[0].main}, temp:{data.main.temp}°,  wind:{data.wind.speed} m/sec</div>);
  }

  renderCityButton = (city) => {
    return (
      <div className="city-button" onClick={() => this.onCityButtonClick(city)}>
        <img className="icon-trash-bin" src={ICONS.ADD_TRASHBIN} onClick={() => this.onRemoveButtonClick(city)} />
        <div className="city-label">{city}</div>
        {this.renderCityButtonContents(city)}
      </div>
    );
  }

  render() {
    const cities = this.state.cities;
    return ( 
      <div className="app">
        <form className="user-forms">
          <input 
            className="user-forms-input"
            type="text"
            placeholder="City"
            autoFocus
            value={this.state.city}
            onChange={this.onCityChange}
          />
          <input 
            className="user-forms-input"
            type="text"
            placeholder="Country"
            value={this.state.country}
            onChange={this.onCountryChange}
          />
          <div className="add-city-button" onClick={this.handleAddCity}>Add City</div> 
        </form>
        <div className="cities-weather-container">
          <div className="cities-container">
            {cities.map(this.renderCityButton)}
          </div>
          <WeatherDisplay 
             weatherData={this.state.weatherData[this.state.currentCity]}
          />
        </div>
      </div>
    )
  }
}

export default App;

class WeatherDisplay extends Component {

  render() {
    const weatherData = this.props.weatherData;
    if (!weatherData) return (
      <div className="weather-display-window">
        <h1>No city selected</h1>
        <h1 className="no-city-selected-sign">:(</h1>
      </div>
    );

    if (weatherData.message) return (
      <div className="weather-display-window weather-display-error">
        <h1>{weatherData.message}</h1>
        <h1 className="no-city-selected-sign">:(</h1>
      </div>
    );
      
    const weather = weatherData.weather[0];
    
    const iconUrl = "http://openweathermap.org/img/w/" + weather.icon + ".png";
    
    const background = weather.description === "clear sky" 
      ? "weather-display-window-clear" 
      : "weather-display-window-rain";

    return (
      <div className={background}>
        <h1>
          <p>{weather.description} in {weatherData.name}</p>
          <img className="weather-icon" src={iconUrl} alt={weatherData.description} />
        </h1>
        <p>Current: {weatherData.main.temp}°C</p>
        <p>High: {weatherData.main.temp_max}°C</p>
        <p>Low: {weatherData.main.temp_min}°C</p>
        <p>Wind Speed: {weatherData.wind.speed} m/sec</p>
        <p>Pressure: {weatherData.main.pressure} mm Hg</p>
        <p>Humidity: {weatherData.main.humidity} %</p>
      </div>
    );
  }
}

