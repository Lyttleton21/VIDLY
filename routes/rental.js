const auth = require('../middleware/auth');
const {Rental, validateRental} = require('../models/rental');
const {Movie} = require('../models/movies');
const {Customer} = require('../models/customers'); 
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
  });
  
  router.post('/', auth, async (req, res) => {
    const { error } = validateRental(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');
  
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie.');
  
    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');
  
    const rental = new Rental({ 
      customer: {
        _id: customer._id,
        name: customer.name, 
        phone: customer.phone
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate
      }
    });
    await rental.save();

    movie.numberInStock--;
    movie.save();
  });
  
  router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
  
    if (!rental) return res.status(404).send('The rental with the given ID was not found.');
  
    res.send(rental);
  });
  
  module.exports = router; 