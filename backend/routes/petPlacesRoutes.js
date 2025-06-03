const express = require('express');
const router = express.Router();

const petPlaces = [
  {
    id: '1',
    title: 'Viešbutis PACAI',
    description:
      'Prabangus viešbutis Vilniaus senamiestyje, draugiškas augintiniams.',
    location: 'Vilnius',
    type: 'viešbutis',
    image: '/images/pacai.png',
    petFriendly: true,
    url: 'https://www.booking.com/hotel/lt/pacai.lt.html',
  },
  {
    id: '2',
    title: 'Sodyba Ignė',
    description: 'Rami sodyba Druskininkuose su galimybe apsistoti su šunimi.',
    location: 'Druskininkai',
    type: 'sodyba',
    image: '/images/igne.png',
    petFriendly: true,
    url: 'https://www.booking.com/country-houses/igne.lt.html',
  },
  {
    id: '3',
    title: 'Kempingas Nida',
    description:
      'Kempingas Kuršių nerijoje su galimybe apsistoti su augintiniu.',
    location: 'Nida',
    type: 'kempingas',
    image: '/images/nida.png',
    petFriendly: true,
    url: 'https://www.booking.com/hotel/lt/nida-camping.lt.html',
  },
];

router.get('/', (req, res) => {
  res.json(petPlaces);
});

module.exports = router;
