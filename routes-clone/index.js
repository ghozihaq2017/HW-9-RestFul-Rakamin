const express = require('express');

const router = express.Router();
const moviesRouter = require('./movies.route.js');
const usersRouter = require('./users.route.js');

router.use('/movies', moviesRouter);
router.use('/users', usersRouter);

module.exports = router;
