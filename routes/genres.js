const valtdateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Genre, validateCourse} = require('../models/genres');
const express = require('express');
const router = express.Router();

// const genres = [
//     {id: 1, name: 'Poetry'},
//     {id: 2, name: 'Novel'},
//     {id: 3, name: 'Drama'},
//     {id: 4, name: 'Fiction '},
//     {id: 5, name: 'Nonfiction'}
// ];

router.get('/', async (req, res) => {
        // throw new Error('Could not get the Genres');
        const genres = await Genre.find().sort('name');
        res.send(genres);
    });

router.get('/:id',valtdateObjectId,  async (req, res) => {
        const genre = await Genre.findById(req.params.id);

        if(!genre) return res.status(404).send('Genre not found');
    
        res.send(genre); 
    });

router.post('/', auth, async (req, res) => {
        const {error} = validateCourse(req.body);
        if(error) return res.status(400).send(error.details[0].message);
    
        let genre = new Genre({
            name: req.body.name
        });
        await genre.save();
    
        res.send(genre);    
    });

router.put('/:id', [auth, admin], async (req, res) => {
        const {error} = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre =  await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true})

    if(!genre) return res.status(404).send('Genre not found');

    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
        const genre = await Genre.findOneAndDelete(req.params.id);

        if(!genre) return res.status(404).send('Genre not found');

        res.send(genre);
        console.log(error);
        res.status(500).send('Something Went Wrong');
    });

module.exports = router;