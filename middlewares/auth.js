const jwt = require('jsonwebtoken');
const NeedAuth = require('../errors/need-auth');

module.exports = (req, res, next) => {
  // console.log(' start auth ');
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log('1 start auth ');
    console.log(req.headers);
    console.log(authorization); // undefined
    /*
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
    */
    // throw new NeedAuth();
    /*
    const err = new Error('Необходима авторизация 1');
    err.statusCode = 401;
    */

    next(new NeedAuth());
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, '123');
    } catch (e) {
      // throw new NeedAuth();
      // const err = new Error('Необходима авторизация 2');
      // err.statusCode = 401;
      next(new NeedAuth());
    }

    req.user = payload; // записываем пейлоуд в объект запроса
    // console.log(req);
    // console.log(' -> payload -> ', req.user);
    //  -- - >  { _id: '6175a4270f38a2b78ee1051c', iat: 1635099808, exp: 1635704608 }
    next(); // пропускаем запрос дальше
    // return 1;
  }
  /*
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, '123');
  } catch (e) {
    const err = new Error('Необходима авторизация 2');
    err.statusCode = 401;
    next(err);
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  // console.log(req);
  // console.log(' -> payload -> ', req.user);
  //  -- - >  { _id: '6175a4270f38a2b78ee1051c', iat: 1635099808, exp: 1635704608 }
  next(); // пропускаем запрос дальше
  // return 1;
  */
};
