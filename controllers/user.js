const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  console.log(' > > get Users < <');
  User.find({})
    .then((users) => {
      console.log({ data: users });
      return res.status(200).send({ data: users });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserId = (req, res) => {
  console.log(' > > get User use ID < <');
  const { id } = req.params;
  console.log(' id for get -> ', id);
  User.findById(id)
    .then((user) => {
      console.log(' search user: \n', user);
      if (!user) {
        return res.status(404).send({ message: 'Нет такого пользователя' });
      }
      console.log({ data: user });
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id ', err: err.name });
      }
      res.status(500).send({ message: err.message, err: err.name });
    });
};

module.exports.createUser = (req, res) => {
  console.log(' > > create User < < ');
  console.log(' you send -> ', req.body);
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
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

module.exports.changeUser = (req, res) => {
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
        return res.status(404).send({ message: 'Указанные данные отсутствуют' });
      }
      console.log(user);
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные', err: err.name });
      }
      return res.status(500).send({ message: err.message, err: err.name });
    });
};

module.exports.changeAvatar = (req, res) => {
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
        res.status(400).send({ message: 'Некорректные данные', err: err.name });
      }
      res.status(500).send({ message: err.message, err: err.name });
    });
};
