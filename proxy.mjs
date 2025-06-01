import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/api/weather/:place', async (req, res) => {
  const { place } = req.params;
  const url = `https://api.meteo.lt/v1/places/${place}/forecasts/long-term`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Nepavyko gauti duomenų' });
  }
});

app.listen(3001, () => console.log('Proxy veikia ant 3001 porto'));
