const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); //
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const CastError = require('../errors/cast-error');
const ValidationError = require('../errors/validation-error');
const RepeatEmail = require('../errors/repeat-email');
const WrongKeys = require('../errors/wrong-keys');
const WrongPass = require('../errors/wrong-pass');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError();
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new CastError());
      if (err.name === 'NotFoundError') next(new NotFoundError());
      next(err);
    });
};

module.exports.changeUser = (req, res, next) => {
  const { name, about } = req.body;
  if ((name === undefined) && (about === undefined)) {
    throw new WrongKeys();
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
      if (!user) {
        throw new NotFoundError();
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new ValidationError());
      if (err.name === 'NotFoundError') next(new NotFoundError());
      next(err);
    });
};

module.exports.changeAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (avatar === undefined) {
    throw new WrongKeys();
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
        next(new NotFoundError());
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new ValidationError());
      if (err.name === 'NotFoundError') next(new NotFoundError());
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (email === undefined || password === undefined) {
    throw new WrongKeys();
  }
  bcrypt.hash(req.body.password, 11)
    .then((hash) => User.create({
      email,
      password: hash,
    }))
    .then((user) => {
      if (!user) {
        throw new ValidationError();
      }
      return res.status(200).send({
        data: {
          name, about, avatar, email,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new ValidationError(err.message));
      if (err.name === 'MongoServerError' && err.code === 11000) {
        // throw new RepeatEmail(err.message); // как было
        next(new RepeatEmail()); // как надо
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (email === undefined || password === undefined) {
    throw new WrongKeys();
  }
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new WrongPass());
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new WrongPass());
          }
          return user;
        });
    })
    .then((user) => {
      if (!user) {
        // return Promise.reject(new WrongPass());
        Promise.reject(new WrongPass());
      }
      const token = jwt.sign({ _id: user._id }, '123', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new WrongPass());
    });
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      console.log(' search user: \n', user);
      if (!user) {
        throw new NotFoundError();
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new CastError());
      next(err);
    });
};
