/* eslint-disable */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
/*
app.use((req, res, next) => {
  req.user = { _id: '615ca641fc1c816c53808953' };
  next();
});
*/
app.use('/', require('./routes/app'));

app.use(auth);

app.use('/', require('./routes/user'));
app.use('/', require('./routes/card'));

app.use((req, res) => {
  res.status(404).send({ message: 'Вы пытаетесь обратится по несуществующему адресу' });
});

app.use((err, req, res, next) => {
  // res.status(500).send({ message: 'На сервере произошла ошибка' });
  // res.status(err.statusCode).send({ message: err.message });
  // console.log(err);
  if (err.statusCode != undefined) {
    res.status(err.statusCode).send({ message: err.message, err: err.name });
    //console.log('1');
  } else {
    console.log('неизвестная ошибка в app');
    console.log(err.statusCode);
    const { statusCode = 500, message } = err;

    res
      .status(statusCode)
      .send({
        // проверяем статус и выставляем сообщение в зависимости от него
        message: statusCode === 500
          ? 'На сервере произошла ошибка'
          : message,
      });
  }

});

app.listen(PORT, () => {
  console.log(PORT);
});
