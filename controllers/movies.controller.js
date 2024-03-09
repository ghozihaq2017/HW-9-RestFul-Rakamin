const pool = require('../config/config.js');
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

class MoviesController {
  // Get List Movies
  static getAll = async (req, res, next) => {
    try {
      const paginationStr = pagination(req.query);

      const countSql = `
        SELECT
          COUNT(DISTINCT movies.*) AS count
        FROM
          movies
        ${paginationStr}
      `;

      const dataCount = await pool.query(countSql);

      const moviesSize = dataCount.rows[0];

      let { limit, page } = req.query;
      limit = +limit || DEFAULT_LIMIT;
      page = +page || DEFAULT_PAGE;

      let totalPages = 0;
      if (moviesSize && moviesSize.count) {
        totalPages = Math.ceil(+moviesSize.count / limit);
      }

      const nextPage = page + 1 <= totalPages ? page + 1 : null;
      const prevPage = page - 1 > 0 ? page - 1 : null;

      const sql = `
        SELECT
          *
        FROM
          movies
        ${paginationStr}
      `;

      const result = await pool.query(sql);
      res.status(200).json({
        data: result.rows,
        totalPages,
        currentPage: page,
        nextPage,
        prevPage,
      });
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
      let { title, genres, year } = req.body;
      const { id } = req.params;

      const searchSQL = `
        SELECT
          *
        FROM
          movies
        WHERE
          id = $1
      `;

      const result = await pool.query(searchSQL, [id]);

      if (result.rows.length !== 0) {
        const updateSql = `
          UPDATE
            movies
          SET
            title = $1,
            genres = $2,
            year = $3
          WHERE
            id = $4
        `;

        const currentMovie = result.rows[0];
        title = title || currentMovie.title;
        genres = genres || currentMovie.genres;
        year = year || currentMovie.year;

        const values = [title, genres, year, id];
        await pool.query(updateSql, values);

        res.status(200).json({ message: 'Movie updated successfully' });
      } else {
        throw { name: 'ErrorNotFound', message: 'Movie Not Found' };
      }
    } catch (err) {
      next(err);
    }
  };

  static delete = async (req, res, next) => {
    try {
      const { id } = req.params;

      const searchSQL = `
        SELECT
          *
        FROM
          movies
        WHERE
          id = $1
      `;

      const result = await pool.query(searchSQL, [id]);

      if (result.rows.length > 0) {
        const deleteSql = `
          DELETE FROM
            movies
          WHERE
            id = $1
          RETURNING *
        `;

        const data = await pool.query(deleteSql, [id]);
        res.status(200).json({ message: 'Movie deleted successfully', deletedMovie: data.rows[0] });
      } else {
        throw { name: 'ErrorNotFound', message: 'Movie Not Found' };
      }
    } catch (err) {
      next(err);
    }
  };
}

const pagination = (params) => {
  if (Object.entries(params).length === 0) {
    return '';
  } else {
    let { limit, page } = params;
    limit = limit || DEFAULT_LIMIT;
    page = page || DEFAULT_PAGE;

    return `LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  }
};

module.exports = MoviesController;
