// Server.js visada yra pagrindinis failas, kuris paleidžia serverį ir nukreipia maršrutus į atitinkamus failus
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes'); // importuojame autentifikacijos maršrutus

// Įkeliame aplinkos kintamuosius iš .env failo
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
// Cors - leidžia siusti API užklausas iš kito domeno pvz. localhost:3000 -> localhost:5173
// Cors leidžia naršyklėms siųsti API užklausas iš (kito) skirtingų domenų, pvz. localhost:3000 -> localhost:5173
// Tai leidžia mums siųsti užklausas iš mūsų front-end aplikacijos (pvz. React) į mūsų back-end serverį (Express).
app.use(cors());
app.use(express.json());

// app.use('/api/reviews', reviewRoutes); // Nukreipiame visas API užklausas, kurios prasideda /api/reviews į reviewRoutes failą, kuris toliau tvarkys užklausas susijusias su atsiliepimais.
app.use('/api/auth', authRoutes); // Nukreipiame visas API užklausas, kurios prasideda /api/auth į authRoutes failą, kuris toliau tvarkys užklausas susijusias su autentifikacija.

// Prisijungiame prie Withyourdog-project naudojant mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Prisijungta prie withyourdog-project');
  })
  .catch((err) => {
    console.error('Klaida jungiantis:', err);
  });

// PROXY ORAMS (gali perkelti į patogią vietą)
app.get('/api/weather/:place', async (req, res) => {
  const { place } = req.params;
  try {
    // Galima daryti ir kitiems miestams, ne tik Vilnius
    const response = await axios.get(
      `https://api.meteo.lt/v1/places/${place}/forecasts/long-term`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Nepavyko gauti orų duomenų' });
  }
});

// Paleidžiame serverį
app.listen(PORT, () => {
  console.log(`Serveris veikia: http://localhost:${PORT}`);
});
