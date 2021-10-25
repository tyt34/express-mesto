/* eslint-disable */
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); //
const NotFoundError = require('../errors/not-found-error');
const CastError = require('../errors/cast-error');
const ValidationError = require('../errors/validation-error');
const RepeatEmail = require('../errors/repeat-email');

module.exports.getUsers = (req, res, next) => {
  console.log(' > > get Users < <');
  User.find({})
    .then((users) => {
      console.log({ data: users });
      return res.status(200).send({ data: users });
    })
    .catch(err => next(err));
};

module.exports.getUserId = (req, res, next) => {
  console.log(' > > get User use ID < <');
  const { id } = req.params;
  console.log(' id for get -> ', id);
  User.findById(id)
    .then((user) => {
      console.log(' search user: \n', user);
      if (!user) {
        throw new NotFoundError();
      }
      console.log({ data: user });
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError();
      }
      return res.status(err.statusCode).send({ message: err.message, err: err.name });
    })
    .catch(err => next(err));
};

module.exports.changeUser = (req, res, next) => {
  console.log(' > > change User < < ');
  console.log(' user id -> ', req.user._id);
  console.log(' you send -> ', req.body);
  const { name, about } = req.body;
  if ((name === undefined) && (about === undefined)) {
    return res.status(400).send({ message: 'Неправильные keys в body запроса' });
  }
  User.findByIdAndUpdate(
    {
      _id: req.user._id,
    },
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      console.log(user);
      if (!user) {
        throw new NotFoundError();
      }
      console.log(user);
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        //throw new CastError();
        throw new ValidationError();
      }
      return res.status(err.statusCode).send({ message: err.message, err: err.name });
    })
    .catch(err => next(err));
};

module.exports.changeAvatar = (req, res, next) => {
  console.log(' > > change Avatar < < ');
  console.log(' you send -> ', req.body);
  const { avatar } = req.body;
  if (avatar === undefined) {
    return res.status(400).send({ message: 'Неправильные keys в body запроса' });
  }
  User.findByIdAndUpdate(
    {
      _id: req.user._id,
    },
    {
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Указанные данные отсутствуют' });
      }
      console.log(user);
      return res.send(user);
    })
    .catch((err) => {
      //console.log('name eor => ', err);
      if (err.name === 'ValidationError') {
        console.log(err.message);
        throw new ValidationError(err.message);
      }
      return res.status(err.statusCode).send({ message: err.message, err: err.name });
    })
    .catch(err => next(err));
};

module.exports.createUser = (req, res, next) => {
  console.log(' > > create User < < ');
  console.log(' you send -> ', req.body);
  const { name, about, avatar, email, password } = req.body;
  if (email === undefined || password === undefined) {
    return res.status(400).send({ message: 'Неправильные keys в body запроса' });
  }
  bcrypt.hash(req.body.password, 11)
    .then( hash => User.create({
      email: email,
      password: hash,
    }))
    .then((user) => {
      if (!user) {
        throw new ValidationError();
      }
      console.log({ data: user });
      return res.send({ data: user });
    })
    .catch((err) => {
      console.log(' = => ',err);
      if (err.name === 'ValidationError') {
        throw new ValidationError();
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        throw new RepeatEmail();
      }
      return res.status(err.statusCode).send({ message: err.message, err: err.name });
    })
    .catch(err => {
      //console.log(' - - > '+err);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Неправильные keys в body запроса' });
        //console.log(' er 1'); // !!!
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  console.log(' > > Login User < < ');
  const { email, password } = req.body;
  console.log(' Email: '+email+' Pass: '+password);
  if (email === undefined || password === undefined) {
    return res.status(400).send({ message: 'Неправильные keys в body запроса' });
  }
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      if (bcrypt.compare(password, user.password)) {
        return user
      } else {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '123', { expiresIn: '7d' });
      console.log('Bearer '+token);
      res.send( { token } );
    })
    .catch((err) => {
      res.status(401).send({ message: err.message }); // это ошибка получается из return Promise.reject
    })
    .catch(err => next(err));
};

module.exports.getMe = (req, res, next) => {
  console.log(' > > get information about me  < < ');
  console.log(' -- - > ', req.user);
  console.log(' id - > '+req.user._id);
  User.findById(req.user._id)
    .then((user) => {
      console.log(' search user: \n', user);
      if (!user) {
        throw new NotFoundError();
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError();
      }
      return res.status(err.statusCode).send({ message: err.message, err: err.name });
    })
    .catch(err => next(err));
}
