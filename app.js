const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
// у вас эти строчки выше незакомментированные вызывают ошибку в терминале?

app.use((req, res, next) => {
  req.user = { _id: '615ca641fc1c816c53808953' };
  next();
});

app.use('/', require('./routes/user'));
app.use('/', require('./routes/card'));

app.use((req, res) => {
  res.status(404).send({ message: 'Вы пытаетесь обратится по несуществующему адресу' });
});

app.listen(PORT, () => {
  console.log(PORT);
});
