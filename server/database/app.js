const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());

// Load local JSON data
const reviews_data = JSON.parse(fs.readFileSync("data/reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("data/dealerships.json", 'utf8'));

// Home route
app.get('/', (req, res) => {
  res.send("Welcome to the API (JSON mode)");
});

// Fetch all reviews
app.get('/fetchReviews', (req, res) => {
  try {
    res.json(reviews_data['reviews']);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

// Fetch reviews by dealer ID
app.get('/fetchReviews/dealer/:id', (req, res) => {
  try {
    const dealerId = Number(req.params.id);

    if (Number.isNaN(dealerId)) {
      return res.status(400).json({ error: 'Dealer id must be a number' });
    }

    const documents = reviews_data['reviews'].filter(
      (r) => r.dealership == dealerId
    );

    res.json(documents);

  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealer reviews' });
  }
});

// Fetch all dealerships
app.get('/fetchDealers', (req, res) => {
  try {
    res.json(dealerships_data['dealerships']);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

// Fetch dealerships by state
app.get('/fetchDealers/:state', (req, res) => {
  try {
    const state = req.params.state;

    const documents = dealerships_data['dealerships'].filter(
      (d) => d.state === state
    );

    res.json(documents);

  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships by state' });
  }
});

// Fetch single dealer by ID
app.get('/fetchDealer/:id', (req, res) => {
  try {
    const dealerId = Number(req.params.id);

    if (Number.isNaN(dealerId)) {
      return res.status(400).json({ error: 'Dealer id must be a number' });
    }

    const document = dealerships_data['dealerships'].find(
      (d) => d.id === dealerId
    );

    res.json(document || {});

  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealer' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});