const Card = require('../models/card')

module.exports.delLiked = (req, res) => {
  console.log(' > > delete Like for Card < <')
  console.log(' user id -> ', req.user._id) // _id станет доступен
  //console.log(' -> ', req)
  console.log(' id for delete Like Id -> ', req.params.cardId)
  /*
  Card.updateOne({_id: req.params.cardId}, {$pull: {likes: req.user._id} })
    .then(card => {
      if (card.modifiedCount === 0) {
        return res.status(400).send({message: 'Некорректные данные'})
      }
      console.log({ data: card })
      res.send({ data: card })
    })
    .catch(err => res.status(500).send({ message: err.message }))
    */
    Card.find({_id: req.params.cardId})
      .then( card => {
        if (card.length === 0) {
          return res.status(404).send({message: 'Нет такой карточки'})
        }
        //console.log(' -> ')
        //console.log(card)
        //console.log(' <-')
        Card.updateOne({_id: req.params.cardId}, {$pull: {likes: req.user._id} })
          .then(card => {
            if (card.modifiedCount === 0) {
              return res.status(400).send({message: 'Некорректные данные'})
            }
            console.log({ data: card })
            res.send({ data: card })
          })
          .catch(err => res.status(500).send({ message: err.message }))
      })
      .catch(err => res.status(500).send({ message: err.message }))
}

module.exports.sendLiked = (req, res) => {
  console.log(' > > send Like for Card < <')
  console.log(' user id -> ', req.user._id) // _id станет доступен
  //console.log(' -> ', req)
  console.log(' id for send Like Id -> ', req.params.cardId)

  Card.find({_id: req.params.cardId})
    .then( card => {
      if (card.length === 0) {
        return res.status(404).send({message: 'Нет такой карточки'})
      }
      //console.log(' -> ')
      //console.log(card)
      //console.log(' <-')
      Card.updateOne({_id: req.params.cardId}, {$addToSet: {likes: [req.user._id]} })
        .then(card => {
          if (card.modifiedCount === 0) {
            return res.status(400).send({message: 'Некорректные данные'})
          }
          console.log({ data: card })
          res.send({ data: card })
        })
        .catch(err => res.status(500).send({ message: err.message }))
    })
    .catch(err => res.status(500).send({ message: err.message }))
  /*
  Card.updateOne({_id: req.params.cardId}, {$addToSet: {likes: [req.user._id]} })
    .then(card => {
      if (card.modifiedCount === 0) {
        return res.status(400).send({message: 'Некорректные данные'})
      }
      console.log({ data: card })
      res.send({ data: card })
    })
    .catch(err => res.status(500).send({ message: err.message }))
    */
}

module.exports.delCardId = (req, res) => {
  console.log(' > > del Card use ID < <')
  console.log(' id for delete -> ',req.params.cardId)
  Card.deleteOne({_id: req.params.cardId})
    .then(card => {
      if (card.deletedCount === 0) {
        return res.status(404).send({message: 'Нет такой карточки'})
      }
      console.log(card)
      res.send(card)
    })
    .catch(err => res.status(500).send({ message: err.message }))
}

module.exports.getCards = (req, res) => {
  console.log(' > > get Cards < <')
  Card.find({})
    .then(cards => {
      console.log({ data: cards })
      res.send({ data: cards })
    })
    .catch(err => res.status(500).send({ message: err.message }))
}

module.exports.createCard = (req, res) => {
  console.log(' > > create Card < < ')
  console.log(' user id -> ', req.user._id) // _id станет доступен
  console.log(req.body)
  //let user = req.user._id
  const { name, link, owner, schema  } = req.body
  Card.create({name, link, owner: req.user._id, schema})
    .then(card => {
      console.log(' start create')
      console.log(card)
      console.log({ data: card })
      res.send(
        {
          data: card,
          owner: req.user._id
        }
      )
    })
    .catch(err => res.status(500).send(
      //console.log(' - - - - - - -  -> ')
      console.log(' E - R - R - O - R --> \n',err.message)
      //{ message: err.message }
    ))
}


/*
module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
*/
/*
module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
};
*/
