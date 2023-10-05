const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Import the 'path' module to work with file paths.
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Set a default port if PORT is not specified in .env.

app.use(cors({ origin: 'http://localhost:3000' }));

// Serve the static React app from the 'build' folder.
app.use(express.static(path.join(__dirname, 'build')));

app.get('/api', async (req, res) => {
  const { latitude, longitude, kilometers } = req.query;

  const apiUrl = `https://api.sallinggroup.com/v1/food-waste/?geo=${latitude},${longitude}&radius=${kilometers}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });

    const responseData = response.data;
    res.json(responseData);
  } catch (error) {
    console.error('Fejl ved at hente data fra det eksterne API:', error);
    res.status(500).json({ error: 'Fejl ved hentning af data fra API' });
  }
});

// For any other routes, serve the React app's 'index.html'.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
