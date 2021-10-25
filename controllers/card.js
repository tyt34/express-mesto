const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const CastError = require('../errors/cast-error');
const NotFoundOrNotOrderError = require('../errors/not-found-or-not-order-error');

module.exports.delLiked = (req, res, next) => {
  console.log(' > > delete Like for Card < <');
  const { cardId } = req.params;
  Card.findByIdAndUpdate({ _id: cardId }, { $pull: { likes: req.user._id } }, {
    new: true,
    runValidators: true,
  })
    .then((card) => {
      if (!card) {
        throw new NotFoundError();
      }
      return res.status(200).send({ message: 'Произошло удаление лайка', data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError();
      }
      return res.status(err.statusCode).send({ message: err.message, err: err.name });
    })
    .catch((err) => next(err));
};

module.exports.sendLiked = (req, res, next) => {
  console.log(' > > send Like for Card < <');
  const { cardId } = req.params;
  Card.findByIdAndUpdate({ _id: cardId }, { $pull: { likes: req.user._id } }, {
    new: true,
    runValidators: true,
  })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(); // good work
      }
      return res.status(200).send({ message: 'Произошло постановка лайка', data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError();
      }
      return res.status(err.statusCode).send({ message: err.message, err: err.name });
    })
    .catch((err) => next(err));
};

module.exports.delCardId = (req, res, next) => {
  console.log(' > > del Card use ID < <');
  Card.deleteOne({
    _id: req.params.cardId,
    owner: req.user._id,
  })
    .then((card) => {
      if (card.deletedCount === 0) {
        throw new NotFoundOrNotOrderError();
      }
      console.log(card);
      return res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError();
      }
      return res.status(err.statusCode).send({ message: err.message, err: err.name });
    })
    .catch((err) => next(err));
};

module.exports.getCards = (req, res, next) => {
  console.log(' > > get Cards < <');
  Card.find({})
    .then((cards) => {
      console.log({ data: cards });
      return res.status(200).send({ data: cards });
    })
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
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
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Неправильные keys в body запроса' });
      }
      next(err);
    });
};
