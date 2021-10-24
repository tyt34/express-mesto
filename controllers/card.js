/* eslint-disable */
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const CastError = require('../errors/cast-error');
const NotFoundOrNotOrderError = require('../errors/not-found-or-not-order-error');

/*
// controllers/cards.js

module.exports.createCard = (req, res) => Card.create({
  name: req.body.name,
  link: req.body.link,
  owner: req.user._id // используем req.user
});

*/


module.exports.delLiked = (req, res, next) => {
  console.log(' > > delete Like for Card < <');
  const { cardId } = req.params;
  console.log(' user id -> ', req.user._id);
  console.log(' id for delete Like Id -> ', cardId);
  Card.findByIdAndUpdate({ _id: cardId }, { $pull: { likes: req.user._id } }, {
    new: true,
    runValidators: true,
  })
    .then((card) => {
      if (!card) {
        // return res.status(404).send({ message: 'Указанные данные отсутствуют' }); // work
        /*
        const err = new Error('Указанные данные отсутствуют 1');
        err.statusCode = 404;
        */
        // next(err);
        throw new NotFoundError(); // good work
        // return new NotFoundError();
      }
      return res.status(200).send({ message: 'Произошло удаление лайка', data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        //return res.status(400).send({ message: 'Невалидный id2', err: err.name }); // work
        throw new CastError();
        //return new CastError();
        // next(err);
      }
      return res.status(err.statusCode).send({ message: err.message, err: err.name });
      // next(err);
    })
    .catch(err => next(err));
};

module.exports.sendLiked = (req, res, next) => {
  console.log(' > > send Like for Card < <');
  const { cardId } = req.params;
  console.log(' user id -> ', req.user._id);
  console.log(' id for send Like Id -> ', cardId);
  Card.findByIdAndUpdate({ _id: cardId }, { $pull: { likes: req.user._id } }, {
    new: true,
    runValidators: true,
  })
    .then((card) => {
      if (!card) {
        //return res.status(404).send({ message: 'Указанные данные отсутствуют' });
        throw new NotFoundError(); // good work
      }
      return res.status(200).send({ message: 'Произошло постановка лайка', data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError();
        //res.status(400).send({ message: 'Невалидный id', err: err.name });
      }
      //return res.status(500).send({ message: err.message, err: err.name });
      return res.status(err.statusCode).send({ message: err.message, err: err.name });
    })
    .catch(err => next(err));
};

module.exports.delCardId = (req, res, next) => {
  console.log(' > > del Card use ID < <');
  console.log(' id for delete -> ', req.params.cardId);
  console.log(' test on id user who want del card -> ', req.user);
  console.log(' таким образом надо удалить по id -> ', req.params.cardId, ' пользователя ', req.user._id);
  //return res.status(999).send({ message: 'Нет такой карточки' });
  Card.deleteOne({
    _id: req.params.cardId,
    owner: req.user._id,
  })
    .then((card) => {
      if (card.deletedCount === 0) {
        //console.log(err);
        //return res.status(404).send({ message: 'Нет такой карточки или вы не имеете прав для удаления' });
        throw new NotFoundOrNotOrderError();
      }
      console.log(card);
      return res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        //res.status(400).send({ message: 'Невалидный id', err: err.name });
        throw new CastError();
      }
      return res.status(err.statusCode).send({ message: err.message, err: err.name });
      //return res.status(500).send({ message: err.message, err: err.name });
    })
    .catch(err => next(err));
};

module.exports.getCards = (req, res) => {
  console.log(' > > get Cards < <');
  Card.find({})
    .then((cards) => {
      console.log({ data: cards });
      return res.status(200).send({ data: cards });
    })
    //.catch((err) => res.status(500).send({ message: err.message }));
    .catch(err => next(err));
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
    /*
    .catch((err) => {
      console.log(' E - R - R - O - R --> \n', err.message);
      return res.status(500).send({
        error: err,
        message: 'ошибка',
      });
    });
    */
    .catch(err => next(err));
};
