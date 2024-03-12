const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/movies.controller.js');
const { authorization } = require('../middlewares/auth.js');

// GET ALL MOVIES
router.get('/', moviesController.getAll);

// GET MOVIES DETAIL
router.get('/:id', moviesController.getOne);

// ACCESS ONLY BY ENGINEER

// ADD NEW MOVIE
router.post('/', authorization, moviesController.add);

// UPDATE MOVIE BY ID
router.put('/:id', authorization, moviesController.update);

// DELETE MOVIE BY ID
router.delete('/:id', authorization, moviesController.delete);

module.exports = router;
