// Server.js visada yra pagrindinis failas, kuris paleidžia serverį ir nukreipia maršrutus į atitinkamus failus
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/authRoutes'); // importuojame autentifikacijos maršrutus
const dogProfileRoutes = require('./routes/dogProfileRoutes'); // importuojame dog profile maršrutus
const petPlacesRoutes = require('./routes/petPlacesRoutes');
const commentRoutes = require('./routes/commentRoutes');
const messagesRoutes = require('./routes/messagesRoutes');

// Įkeliame aplinkos kintamuosius iš .env failo
dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();
// Cors - leidžia siusti API užklausas iš kito domeno pvz. localhost:3000 -> localhost:5173
// Cors leidžia naršyklėms siųsti API užklausas iš (kito) skirtingų domenų, pvz. localhost:3000 -> localhost:5173
// Tai leidžia mums siųsti užklausas iš mūsų front-end aplikacijos (pvz. React) į mūsų back-end serverį (Express).
// Pašalinu šį nereikalingą CORS middleware:
// app.use(cors());
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173', // tavo local React serveris
  'https://withyourdog.lt', // būsimas viešas domenas (galima palikti, net jei dar neegzistuoja)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // leidžiam net postman ar kitus įrankius, jei origin nėra nurodytas (undefined)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// --- ČIA SVARBU: Leidžiam prieigą prie uploads katalogo ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Maršrutai ---
// app.use('/api/reviews', reviewRoutes); // Nukreipiame visas API užklausas, kurios prasideda /api/reviews į reviewRoutes failą, kuris toliau tvarkys užklausas susijusias su atsiliepimais.
app.use('/api/auth', authRoutes); // Nukreipiame visas API užklausas, kurios prasideda /api/auth į authRoutes failą, kuris toliau tvarkys užklausas susijusias su autentifikacija.
app.use('/api/dog-profile', dogProfileRoutes); // Nukreipiame visas API užklausas, kurios prasideda /api/dog-profile į dogProfileRoutes failą, kuris toliau tvarkys užklausas susijusias su dog profile.
app.use('/api/pet-places', petPlacesRoutes); // Nukreipiame visas API užklausas, kurios prasideda /api/pet-places į petPlacesRoute failą, kuris toliau tvarkys užklausas susijusias su pet places.
app.use('/api/comments', commentRoutes);
app.use('/api/messages', messagesRoutes);

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
  console.log('Gaunamas miestas:', place);
  try {
    const response = await axios.get(
      `https://api.meteo.lt/v1/places/${place}/forecasts/long-term`
    );
    if (!response.data || response.data.error) {
      return res.status(404).json({ error: 'Tokio miesto orų duomenų nėra' });
    }
    res.json(response.data);
  } catch (err) {
    console.error('Orų API klaida:', err?.response?.data || err.message || err);
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: 'Tokio miesto orų duomenų nėra' });
    }
    res.status(500).json({ error: 'Nepavyko gauti orų duomenų' });
  }
});

// Paleidžiame serverį
app.listen(PORT, () => {
  console.log(`Serveris veikia: http://localhost:${PORT}`);
});
