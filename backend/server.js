const express = require('express');
const mongodb = require('./database/connect');
const bodyParser = require('body-parser'); //npm, for POST requests
const swaggerUi = require('swagger-ui-express');
const swaggerDocumentAuto = require('./swagger/swagger-auto.json');
const swaggerDocument = require('./swagger/swagger.json');

const port = process.env.PORT || 3000;
const app = express();

// setup express app
app
  // .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumentAuto))
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use(bodyParser.json())
  .use('/', require('./routes'));

//
process.on('uncaughtException', (err, origin) => {
  console.log(process.stderr.fd, `Caught exception: ${err}\n + Exception origin: ${origin}`);
});

// now connect to database...
mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listen on port ${port}`);
  }
});
