/*eslint-disable */
const jwt = require('jsonwebtoken');
const NeedAuth = require('../errors/need-auth');

module.exports = (req, res, next) => {

  //console.log(req);
  //console.log(' -> ',res.headers);
  //console.log(next());
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NeedAuth());
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    //console.log(' = => ',token);
    //payload = jwt.verify(token, '123');
    payload = jwt.sign(token, '123');
    //console.log(' --> ',payload);
  } catch (e) {
    console.log(' er ', e);
    next(new NeedAuth());
    // throw new NeedAuth()
  }

  req.user = payload; // { _id: '6175a4270f38a2b78ee1051c', iat: 1635099808, exp: 1635704608 }
  //console.log(payload);
  next();

  /*
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NeedAuth('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, '123');
  } catch (err) {
    next(new NeedAuth('Необходима авторизация'));
  }

  req.user = payload;

  next();
  */
};
