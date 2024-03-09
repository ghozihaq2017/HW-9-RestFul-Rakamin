const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controllers.js');

// GET ALL USERS
router.get('/', usersController.getAll);

// GET USERS DETAIL
router.get('/:id', usersController.getOne);

// ADD NEW USER
router.post('/', usersController.add);

// UPDATE USER BY ID
router.put('/:id', usersController.update);

// DELETE USER BY ID
router.delete('/:id', usersController.delete);

module.exports = router;
