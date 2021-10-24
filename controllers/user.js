/* eslint-disable */
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); //
const NotFoundError = require('../errors/not-found-error');
const CastError = require('../errors/cast-error');
const ValidationError = require('../errors/validation-error');

module.exports.getUsers = (req, res, next) => {
  console.log(' > > get Users < <');
  User.find({})
    .then((users) => {
      console.log({ data: users });
      return res.status(200).send({ data: users });
    })
    .catch(err => next(err));
    //.catch((err) => res.status(500).send({ message: err.message }));
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
        // return res.status(404).send({ message: 'Нет такого пользователя' });
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
        //return res.status(404).send({ message: 'Указанные данные отсутствуют' });
        throw new NotFoundError();
      }
      console.log(user);
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        //res.status(400).send({ message: 'Некорректные данные', err: err.name });
        throw new CastError();
      }
      return res.status(err.statusCode).send({ message: err.message, err: err.name });
    })
    .catch(err => next(err));
};

module.exports.changeAvatar = (req, res, next) => {
  console.log(' > > change Avatar < < ');
  console.log(' user id -> ', req.user._id);
  console.log(' you send -> ', req.body);
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
      if (err.name === 'ValidationError') {
        throw new ValidationError();
        //res.status(400).send({ message: 'Некорректные данные', err: err.name });
      }
      //res.status(500).send({ message: err.message, err: err.name });
      return res.status(err.statusCode).send({ message: err.message, err: err.name });
    })
    .catch(err => next(err));
};
/*
module.exports.createUser = (req, res, next) => {
  console.log(' > > create User < < ');
  console.log(' you send -> ', req.body);
  const { name, about, avatar, email, password } = req.body;
  User.create({ name, about, avatar, email, password })
    .then((user) => {
      if (!user) {
        return res.status(400).send({ message: 'Некорректные данные' });
      }
      console.log({ data: user });
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные', err: err.name });
      }
      res.status(500).send({ message: err.message, err: err.name });
    });
};
*/
module.exports.createUser = (req, res, next) => {
  console.log(' > > create User < < ');
  console.log(' you send -> ', req.body);
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(req.body.password, 11)
    .then( hash => User.create({
      email: email,
      password: hash,
    }))
    .then((user) => {
      if (!user) {
        throw new ValidationError();
        //return res.status(400).send({ message: 'Некорректные данные' });
      }
      console.log({ data: user });
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError();
        //res.status(400).send({ message: 'Некорректные данные', err: err.name });
      }
      //res.status(500).send({ message: err.message, err: err.name });
      return res.status(err.statusCode).send({ message: err.message, err: err.name });
    })
    .catch(err => next(err));
};
/*
module.exports.login = (req, res, next) => {
  console.log(' > > Login User < < ');

}
*/


module.exports.login = (req, res, next) => {
  console.log(' > > Login User < < ');
  const { email, password } = req.body;
  console.log(' Email: '+email+' Pass: '+password);
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // пользователь с такой почтой не найден
        /*
        Если пользователя с переданным email нет в базе, обработка запроса должна переходить в блок catch
        */
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      if (bcrypt.compare(password, user.password)) {
        return user
      } else {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
    })
    .then((user) => {
      /*
      if (!matched) {
        // хеши не совпали — отклоняем промис
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      */
      console.log(' = = > ');
      console.log(user);
      console.log(' = = > ');
      // аутентификация успешна
      const token = jwt.sign({ _id: user._id }, '123', { expiresIn: '7d' });
      console.log(' = = > ');
      console.log(user);
      console.log('Bearer '+token);
      console.log(' = = > ');
      res.send( { token } );
    })
    .catch((err) => {
      console.log(' ER R R = = > ');
      res.status(401).send({ message: err.message });
    })
    .catch(err => next(err));
};

module.exports.getMe = (req, res, next) => {
  console.log(' > > get information about me  < < ');
  //console.log(' you send -> ', req.body);
  console.log(' -- - > ', req.user);
  //const { id } = req.user;
  console.log(' id - > '+req.user._id);
  User.findById(req.user._id)
    .then((user) => {
      console.log(' search user: \n', user);
      if (!user) {
        throw new NotFoundError();
        //return res.status(404).send({ message: 'Нет такого пользователя' });
      }
      console.log(' НАШЕЛ ');
      console.log({ data: user });
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError();
        //res.status(400).send({ message: 'Невалидный id', err: err.name });
      }
      res.status(500).send({ message: err.message, err: err.name });
    })
    .catch(err => next(err));
  //return res.status(999).send({ message: 'Не сейчас' });
}
