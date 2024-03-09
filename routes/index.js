const express = require('express');

const router = express.Router();
const moviesRouter = require('./movies.route.js');
const usersRouter = require('./users.route.js');
const authRouter = require('./auth.route.js');
const { authentication } = require('../middlewares/auth.js');

router.use('/auth', authRouter);
router.use(authentication);
router.use('/movies', moviesRouter);
router.use('/users', usersRouter);

module.exports = router;
