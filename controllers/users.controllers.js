const pool = require('../config/config.js');

class UsersController {
  // Get List Users
  static getAll = async (req, res, next) => {
    try {
      const sql = `
        SELECT
          *
        FROM
          users
      `;

      const result = await pool.query(sql);
      res.status(200).json(result.rows);
    } catch (err) {
      next(err);
    }
  };

  // Get Detail User
  static getOne = async (req, res, next) => {
    try {
      const { id } = req.params;

      const sql = `
        SELECT
          *
        FROM
          users
        WHERE
          id = $1
      `;

      const result = await pool.query(sql, [id]);

      if (result.rows.length === 0) {
        throw { name: 'ErrorNotFound', message: 'User Not Found' };
      } else {
        res.status(200).json(result.rows[0]);
      }
    } catch (err) {
      next(err);
    }
  };

  // Add User
  static add = async (req, res, next) => {
    try {
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

      const result = await pool.query(sql, values);

      res.status(201).json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  };

  // Update User
  static update = async (req, res, next) => {
    try {
      let { email, gender, password, role } = req.body;
      const { id } = req.params;

      const searchSQL = `
        SELECT
          *
        FROM
          users
        WHERE
          id = $1
      `;

      const result = await pool.query(searchSQL, [id]);

      if (result.rows.length !== 0) {
        const updateSql = `
        UPDATE
          users
        SET
          email = $1,
          gender = $2,
          password = $3,
          role = $4
        WHERE
          id = $5
        `;

        const currentUser = result.rows[0];
        email = email || currentUser.email;
        gender = gender || currentUser.gender;
        password = password || currentUser.password;
        role = role || currentUser.role;

        const values = [email, gender, password, role, id];

        await pool.query(updateSql, values);

        res.status(200).json({ message: 'User updated successfully' });
      } else {
        throw { name: 'ErrorNotFound', message: 'Movie Not Found' };
      }
    } catch (err) {
      next(err);
    }
  };

  // Delete User
  static delete = async (req, res, next) => {
    try {
      const { id } = req.params;

      const searchSQL = `
        SELECT
          *
        FROM
          users
        WHERE
          id = $1
      `;

      const result = await pool.query(searchSQL, [id]);

      if (result.rows.length > 0) {
        const deleteSql = `
          DELETE FROM
            users
          WHERE
            id = $1
          RETURNING *
        `;

        const data = await pool.query(deleteSql, [id]);
        res.status(200).json({ message: 'User deleted successfully', deletedMovie: data.rows[0] });
      } else {
        throw { name: 'ErrorNotFound', message: 'User Not Found' };
      }
    } catch (err) {
      next(err);
    }
  };
}

module.exports = UsersController;
