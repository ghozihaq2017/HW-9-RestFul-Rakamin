const pool = require('../config/config.js');

class MoviesController {
  // Get List Movies
  static getAll = async (req, res, next) => {
    try {
      const sql = `
        SELECT
          *
        FROM
          movies
      `;

      const result = await pool.query(sql);
      res.status(200).json(result.rows);
    } catch (err) {
      next(err);
    }
  };

  // Get Detail Movie
  static getOne = async (req, res, next) => {
    try {
      const { id } = req.params;

      const sql = `
        SELECT
          *
        FROM
          movies
        WHERE
          id = $1
      `;

      const result = await pool.query(sql, [id]);

      if (result.rows.length === 0) {
        // res.status(404).json({ message: 'Movie Not Found' });
        throw { name: 'ErrorNotFound', message: 'Movie Not Found' };
      } else {
        res.status(200).json(result.rows[0]);
      }
    } catch (err) {
      next(err);
    }
  };

  // Add Movie
  static add = async (req, res, next) => {
    try {
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

      const result = await pool.query(sql, values);

      res.status(201).json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  };

  // Update Movie
  static update = async (req, res, next) => {
    try {
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
    } catch (err) {
      next(err);
    }
  };
}

module.exports = MoviesController;
