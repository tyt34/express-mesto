const Card = require('../models/card');

// теперь, даже если лайк не был удален, и отправить такой запрос, придет солобщение что лайк удален
// это нормально?

module.exports.delLiked = (req, res) => {
  console.log(' > > delete Like for Card < <');
  const { cardId } = req.params;
  console.log(' user id -> ', req.user._id);
  console.log(' id for delete Like Id -> ', cardId);
  Card.findByIdAndUpdate({ _id: cardId }, { $pull: { likes: req.user._id } }, {
    new: true,
    rawResult: true,
    runValidators: true,
  }, (err, card) => {
    console.log(card);
    if (err) {
      console.log(' Ошибка ');
      console.log(card);
      return res.status(400).send({ message: 'Произошла ошибка' });
    }
    if (card.value === null) {
      console.log(card);
      return res.status(404).send({ message: 'Нет такой карточки' });
    }
    console.log(card);
    console.log(' Произошло удаление лайка');
    return res.status(200).send({ message: 'Произошло удаление лайка' });
  });
};

module.exports.sendLiked = (req, res) => {
  console.log(' > > delete Like for Card < <');
  const { cardId } = req.params;
  console.log(' user id -> ', req.user._id);
  console.log(' id for delete Like Id -> ', cardId);
  Card.findByIdAndUpdate({ _id: cardId }, { $addToSet: { likes: req.user._id } }, {
    new: true,
    rawResult: true,
  }, (err, card) => {
    console.log(card);
    if (err) {
      console.log(' Ошибка ');
      console.log(card);
      return res.status(400).send({ message: 'Произошла ошибка' });
    }
    if (card.value === null) {
      console.log(card);
      return res.status(404).send({ message: 'Нет такой карточки' });
    }
    console.log(card);
    console.log(' Произошло постановка лайка');
    return res.status(200).send({ message: 'Произошло постановка лайка', data: card });
  });
};

module.exports.delCardId = (req, res) => {
  console.log(' > > del Card use ID < <');
  console.log(' id for delete -> ', req.params.cardId);
  Card.deleteOne({ _id: req.params.cardId })
    .then((card) => {
      if (card.deletedCount === 0) {
        return res.status(404).send({ message: 'Нет такой карточки' });
      }
      console.log(card);
      return res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getCards = (req, res) => {
  console.log(' > > get Cards < <');
  Card.find({})
    .then((cards) => {
      console.log({ data: cards });
      return res.status(200).res.send({ data: cards });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  console.log(' > > create Card < < ');
  console.log(' user id -> ', req.user._id);
  console.log(' you send -> ', req.body);
  const { name, link, schema } = req.body;
  Card.create({
    name, link, owner: req.user._id, schema,
  })
    .then((card) => {
      console.log(card);
      return res.send(
        {
          data: card,
          owner: req.user._id,
        },
      );
    })
    .catch((err) => {
      console.log(' E - R - R - O - R --> \n', err.message);
      return res.status(500).send({
        error: err,
        message: 'ошибка',
      });
    });
};
