const express = require('express');
const router = express.Router();
const pool = require('../config/config.js');
const moviesController = require('../controllers/movies.controller.js');

// GET ALL MOVIES
router.get('/', moviesController.getAll);

// GET MOVIES DETAIL
router.get('/:id', moviesController.getOne);

// ADD NEW MOVIE
router.post('/', moviesController.add);

// UPDATE MOVIE BY ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, genres, year } = req.body;

  if (!title || !genres || !year) {
    res.status(400).json({ message: 'All fields are required!' });
    return;
  }

  const sql = `
    UPDATE
      movies
    SET
      title = $1,
      genres = $2,
      year = $3
    WHERE
      id = $4
    RETURNING *
  `;

  const values = [title, genres, year, id];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Movie Not Found' });
      } else {
        res.status(200).json(result.rows[0]);
      }
    }
  });
});

// DELETE MOVIE BY ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM
      movies
    WHERE
      id = $1
    RETURNING *
  `;

  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Movie Not Found' });
      } else {
        res
          .status(200)
          .json({ message: 'Movie deleted successfully', deletedMovie: result.rows[0] });
      }
    }
  });
});

module.exports = router;
