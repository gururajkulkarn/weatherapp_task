import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [cities, setCities] = useState([]);
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
  
    if (!username) {
      navigate('/');
    } else {
      const fetchCities = async () => {
        const response = await fetch(`http://localhost:5000/api/user/${username}`);
        const data = await response.json();
        setCities(data.favoriteCities || []);
        fetchWeatherData(data.favoriteCities || []);
      };
      fetchCities();
    }
  }, [username, navigate]);

  const fetchWeatherData = async (cities) => {
    const apiKey = 'fe95b971c95d476fba095618241209';
    const newWeatherData = {};

    for (const city of cities) {
      try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
        if (!response.ok) {
          throw new Error('City not found');
        }
        const data = await response.json();
        newWeatherData[city] = {
          ...data,
          iconUrl: `https:${data.current.condition.icon}` // Form the URL for the icon
        };
        console.log(data)
      } catch (error) {
        console.error(`Error fetching weather for ${city}:`, error);
        alert(`City "${city}" not found. Please enter a valid city name.`);
      }
    }
    setWeatherData(newWeatherData);
  };

  const addCity = async () => {
    if (cities.length < 5 && cityInput) {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${username}/cities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: cityInput }),
        });

        const updatedCities = await response.json();
        setCities(updatedCities);
        setCityInput('');
        fetchWeatherData(updatedCities);
      } catch (error) {
        alert('Failed to add the city. Please try again.');
      }
    }
  };

  const removeCity = async (city) => {
    const response = await fetch(`http://localhost:5000/api/user/${username}/cities/${city}`, {
      method: 'DELETE',
    });
    const updatedCities = await response.json();
    setCities(updatedCities);

    const updatedWeatherData = { ...weatherData };
    delete updatedWeatherData[city];
    setWeatherData(updatedWeatherData);
  };

  return (
    <Container>
      <Typography variant="h4">Welcome to the weather app {username}</Typography>
      <TextField
        label="Add City"
        value={cityInput}
        onChange={(e) => setCityInput(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button onClick={addCity} variant="contained" color="primary">
        Add City
      </Button>
      {cities.map(city => (
        <Card key={city} style={{ margin: '10px 0' }}>
          <CardContent>
            <Typography variant="h6">{city}</Typography>
          
            {weatherData[city] && (
              <> 
              <Typography>
                Condition: {weatherData[city].current.condition.text}
                <br/>
                <img src={weatherData[city].iconUrl} alt="Weather Icon" style={{ width: '50px', height: '50px' }} />
                <br/>
                Temperature: {weatherData[city].current.temp_c}°C
                <br />
                Humidity: {weatherData[city].current.humidity}°C
                <br />
                Precipitation: {weatherData[city].current.precip_mm}
              </Typography>
        
            </>
                )}
                <br/>
                  <Button onClick={() => removeCity(city)} variant="contained" color="secondary">
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default HomePage;
