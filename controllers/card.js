const Card = require('../models/card');

module.exports.delLiked = (req, res) => {
  console.log(' > > delete Like for Card < <');
  const { cardId } = req.params;
  console.log(' user id -> ', req.user._id);
  console.log(' id for delete Like Id -> ', cardId);
  Card.findByIdAndUpdate({ _id: cardId }, { $pull: { likes: req.user._id } }, {
    new: true,
    rawResult: true,
    runValidators: true,
  })
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Указанные данные отсутствуют' });
      }
      return res.status(200).send({ message: 'Произошло удаление лайка', data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id', err: err.name });
      }
      return res.status(500).send({ message: err.message, err: err.name });
    });
};

module.exports.sendLiked = (req, res) => {
  console.log(' > > send Like for Card < <');
  const { cardId } = req.params;
  console.log(' user id -> ', req.user._id);
  console.log(' id for send Like Id -> ', cardId);
  Card.findByIdAndUpdate({ _id: cardId }, { $pull: { likes: req.user._id } }, {
    new: true,
    rawResult: true,
    runValidators: true,
  })
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Указанные данные отсутствуют' });
      }
      return res.status(200).send({ message: 'Произошло постановка лайка', data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id', err: err.name });
      }
      return res.status(500).send({ message: err.message, err: err.name });
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
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id', err: err.name });
      }
      return res.status(500).send({ message: err.message, err: err.name });
    });
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
