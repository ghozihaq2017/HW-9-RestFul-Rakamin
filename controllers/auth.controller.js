const pool = require('../config/config.js');
const { hashPassword, comparePassword } = require('../lib/bcrypt.js');
const { generateToken } = require('../lib/jwt.js');

class AuthController {
  static register = async (req, res, next) => {
    try {
      const { email, gender, password, role } = req.body;

      const hashPass = hashPassword(password);

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

      const values = [email, gender, hashPass, role];

      const result = await pool.query(sql, values);

      res.status(201).json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  };

  static login = async (req, res, next) => {
    try {
      console.log(req.body);
      const { email, password } = req.body;

      // Search User By Email
      const searchSql = `
        SELECT
          *
        FROM
          users
        WHERE email = $1
      `;

      const result = await pool.query(searchSql, [email]);
      console.log(result.rows);

      if (result.rows.length !== 0) {
        // compare password

        const foudUser = result.rows[0];

        if (comparePassword(password, foudUser.password)) {
          // generate token
          const accessToken = generateToken({
            id: foudUser.id,
            email: foudUser.email,
            gender: foudUser.gender,
            role: foudUser.role,
          });

          res.status(200).json({
            message: 'Login Successfully',
            accessToken,
          });
        } else {
          throw { name: 'InvalidCredentials' };
        }
      } else {
        throw { name: 'InvalidCredentials' };
      }
    } catch (err) {
      next(err);
    }
  };
}

module.exports = AuthController;
