const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundAddress = require('./errors/not-found-address');

const { PORT = 3000 } = process.env;
const app = express();

const options = {
  origin: [ // allowedCors
    'http://localhost:3000',
    'http://good.nomoredomains.work/',
    'https://good.nomoredomains.work/',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options));

/*
app.use((req, res, next) => {
  const { origin } = req.headers;
  console.log(origin);
  if (options.options.includes(origin)) {
    console.log(' -> > ');
    // res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Origin', '*');
  } else {
    console.log(' -< -< ');
  }
  next();
});
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.use('/', require('./routes/app'));

app.use(auth);

app.use('/', require('./routes/user'));
app.use('/', require('./routes/card'));

app.use(errorLogger); // errorLogger нужно подключить после
// обработчиков роутов и до обработчиков ошибок:
app.use(errors());

app.use(() => {
  throw new NotFoundAddress();
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(PORT);
});
