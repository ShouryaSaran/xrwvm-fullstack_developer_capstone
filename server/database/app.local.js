const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3030;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const reviewsPath = path.join(__dirname, 'data', 'reviews.json');
const dealershipsPath = path.join(__dirname, 'data', 'dealerships.json');

const reviewsData = JSON.parse(fs.readFileSync(reviewsPath, 'utf8')).reviews || [];
const dealershipsData = JSON.parse(fs.readFileSync(dealershipsPath, 'utf8')).dealerships || [];

let reviews = [...reviewsData];
let dealerships = [...dealershipsData];

app.get('/', async (req, res) => {
  res.send('Welcome to the Local API (no Docker/Mongo)');
});

app.get('/fetchReviews', async (req, res) => {
  res.json(reviews);
});

app.get('/fetchReviews/dealer/:id', async (req, res) => {
  const dealerId = Number(req.params.id);
  if (Number.isNaN(dealerId)) {
    return res.status(400).json({ error: 'Dealer id must be a number' });
  }
  res.json(reviews.filter((r) => Number(r.dealership) === dealerId));
});

app.get('/fetchDealers', async (req, res) => {
  res.json(dealerships);
});

app.get('/fetchDealers/:state', async (req, res) => {
  const state = req.params.state;
  res.json(dealerships.filter((d) => d.state === state));
});

app.get('/fetchDealer/:id', async (req, res) => {
  const dealerId = Number(req.params.id);
  if (Number.isNaN(dealerId)) {
    return res.status(400).json({ error: 'Dealer id must be a number' });
  }
  const dealer = dealerships.find((d) => Number(d.id) === dealerId);
  res.json(dealer || null);
});

app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    const maxId = reviews.length > 0 ? Math.max(...reviews.map((r) => Number(r.id) || 0)) : 0;
    const newReview = {
      id: maxId + 1,
      name: data.name,
      dealership: data.dealership,
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: data.car_year,
    };

    reviews.push(newReview);
    res.json(newReview);
  } catch (error) {
    res.status(500).json({ error: 'Error inserting review' });
  }
});

app.listen(port, () => {
  console.log(`Local backend is running on http://localhost:${port}`);
});
