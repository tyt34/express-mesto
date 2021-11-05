const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const CastError = require('../errors/cast-error');
// const NotFoundOrNotOrderError = require('../errors/not-found-or-not-order-error');
// const WrongKeys = require('../errors/wrong-keys');
const ValidationError = require('../errors/validation-error');
const ForbiddenError = require('../errors/forbidden-error');

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
      if (err.name === 'CastError') next(new CastError());
      if (err.name === 'NotFoundError') next(new NotFoundError());
      next(err);
    });
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
      if (err.name === 'CastError') next(new CastError());
      if (err.name === 'NotFoundError') next(new NotFoundError());
      next(err);
    });
};

module.exports.delCardId = (req, res, next) => {
  console.log(' > > del Card use ID < <');
  Card.findById({ _id: req.params.cardId })
    .orFail(() => new NotFoundError())
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        next(new ForbiddenError());
      } else {
        Card.deleteOne({ card })
          .then(() => res.status(200).send({ message: 'Карточка удалена' }));
      }
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  console.log(' > > get Cards < <');
  Card.find({})
    .then((cards) => {
      console.log(' norm ');
      return res.status(200).send({ data: cards });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  console.log(' > > create Card < < ');
  console.log(' user id -> ', req.user);
  console.log(' user id -> ', req.user._id);
  console.log(' you send -> ', req.body);
  const { name, link } = req.body;
  Card.create({
    name, link, owner: req.user._id,
  })
    .then((card) => {
      console.log('card', card);
      return res.send(
        {
          data: card,
          owner: req.user._id,
        },
      );
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new ValidationError(err.message));
      next(err);
    });
};
