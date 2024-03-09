const { verifyToken } = require('../lib/jwt.js');
const pool = require('../config/config.js');

const authentication = async (req, res, next) => {
  try {
    if (req.header.authorization) {
      const token = request.headers.authorization.split(' ')[1];
      const { id, email } = verifyToken(token);

      const sql = `
        SELECT *
        FROM users
        WHERE id = $1
        AND email = $2
        `;

      const result = await pool.query(sql, [id, email]);

      if (result.rows.length !== 0) {
        const user = result.rows[0];

        req.loggedUser = {
          id: user.id,
          email: user.email,
          role: user.role,
        };

        next();
      } else {
        throw { name: 'Unauthenticated' };
      }
    } else {
      throw { name: 'Unauthenticated' };
    }
  } catch (err) {
    next(err);
  }
};

const authorization = async (req, res, next) => {
  try {
    const { role } = req.loggedUser;

    if (role === 'Admin') {
      next();
    } else {
      throw { name: 'Unauthorized' };
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { authentication, authorization };
