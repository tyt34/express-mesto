const router = require('express').Router();
const {
  login, createUser,
} = require('../controllers/user');

router.post('/signin', login);
router.post('/signup', createUser);

module.exports = router;
