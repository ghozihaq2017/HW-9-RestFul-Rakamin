const express = require('express');
const router = express.Router();
const pool = require('../config/config.js');

// GET ALL MOVIES
router.get('/', (req, res) => {
  const sql = `
    SELECT
      *
    FROM
      movies
  `;

  pool.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error!' });
    } else {
      res.status(200).json(result.rows);
    }
  });
});

// GET MOVIES DETAIL
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      *
    FROM
      movies
    WHERE
      id = $1
  `;

  pool.query(sql, [id], (err, result) => {
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

// ADD NEW MOVIE
router.post('/', (req, res) => {
  const { title, genres, year } = req.body;

  if (!title || !genres || !year) {
    res.status(400).json({ message: 'All fields are required!' });
    return;
  }

  const sql = `
    INSERT INTO
      movies ( title, genres, year)
    VALUES
      ($1, $2, $3)
    RETURNING *
  `;

  const values = [title, genres, year];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.status(201).json(result.rows[0]);
    }
  });
});

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
