const User = require('../models/user')

module.exports.getUsers = (req, res) => {
  console.log(' > > get Users < <')
  User.find({})
    .then(users => {
      console.log({ data: users })
      return res.status(200).send({ data: users })
    })
    .catch(err => res.status(500).send({ message: err.message }))
}

module.exports.getUserId = (req, res) => {
  console.log(' > > get User use ID < <')
  const { id } = req.params
  console.log(' id for get -> ', id)
  User.findById( id )
    .then(user => {
      console.log(' search user: \n', user)
      if (!user) {
        return res.status(404).send({message: 'Нет такого пользователя'})
      }
      console.log({ data: user })
      return res.status(200).send({ data: user })
    })
    .catch(err => res.status(500).send({ message: err.message }))
}

module.exports.createUser = (req, res) => {
  console.log(' > > create User < < ')
  console.log(' you send -> ', req.body)
  const { name, about, avatar } = req.body
  User.create({name, about, avatar})
    .then(user => {
      if (!user) {
        return res.status(400).send({message: 'Некорректные данные'})
      }
      console.log({ data: user })
      res.send({ data: user })
    })
    .catch(err => res.status(500).send({ message: err.message }))
}

module.exports.changeUser = (req, res) => {
  console.log(' > > change User < < ')
  console.log(' user id -> ', req.user._id)
  console.log(' you send -> ', req.body)
  const { name, about } = req.body
  User.updateOne({_id: req.user._id}, {$set: {name: name, about: about} })
    .then(user => {
      if (!user.acknowledged) {
        return res.status(400).send({message: 'Некорректные данные'})
      }
      if (!user) {
        return res.status(400).send({message: 'Некорректные данные'})
      }
      console.log(user)
      res.send({ user })
    })
    .catch(err => res.status(500).send({ message: err.message }))
}

module.exports.changeAvatar = (req, res) => {
  console.log(' > > change Avatar < < ')
  console.log(' user id -> ', req.user._id)
  console.log(' you send -> ', req.body)
  const { avatar } = req.body
  User.updateOne({_id: req.user._id}, {$set: {avatar: avatar} })
    .then(user => {
      if (!user.acknowledged) {
        return res.status(400).send({message: 'Некорректные данные'})
      }
      if (!user) {
        return res.status(400).send({message: 'Некорректные данные'})
      }
      console.log(user)
      res.send(user)
    })
    .catch(err => res.status(500).send({ message: err.message }))
}
