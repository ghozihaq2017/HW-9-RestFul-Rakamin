const express = require('express');
const app = express();
const port = 3000;
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const morgan = require('morgan');

app.use(morgan('tiny'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Movies app listening in port ${port}`);
});
