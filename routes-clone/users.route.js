const express = require('express');
const router = express.Router();
const pool = require('../config/config.js');

// GET ALL USERS
router.get('/', (req, res) => {
  const sql = `
    SELECT
      *
    FROM 
      users
  `;

  pool.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.status(200).json(result.rows);
    }
  });
});

// GET USERS DETAIL
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      *
    FROM
      users
    WHERE
      id = $1
  `;

  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Users Not Found' });
      } else {
        res.status(200).json(result.rows[0]);
      }
    }
  });
});

// ADD NEW USER
router.post('/', (req, res) => {
  const { email, gender, password, role } = req.body;

  if (!email || !gender || !password || !role) {
    res.status(400).json({ message: 'All fields are required!' });
    return;
  }

  const sql = `
    INSERT INTO
      users ( email, gender, password, role)
    VALUES
      ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [email, gender, password, role];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.status(201).json(result.rows[0]);
    }
  });
});

// UPDATE USER BY ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { email, gender, password, role } = req.body;

  if (!email || !gender || !password || !role) {
    res.status(400).json({ message: 'All fields are required!' });
    return;
  }

  const sql = `
    UPDATE
      movies
    SET
      email = $1,
      gender = $2,
      password = $3,
      role = $4
    WHERE
      id = $5
    RETURNING *
  `;

  const values = [email, gender, password, role, id];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'User Not Found' });
      } else {
        res.status(200).json(result.rows[0]);
      }
    }
  });
});

// DELETE USER BY ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM
      users
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
        res.status(404).json({ message: 'User Not Found' });
      } else {
        res.status(200).json({ message: 'User deleted successfully', deletedUser: result.rows[0] });
      }
    }
  });
});

module.exports = router;
