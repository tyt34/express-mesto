/* eslint-disable */

const router = require('express').Router();
const {
  getUsers, getUserId, /* createUser, */ changeUser, changeAvatar, getMe,
} = require('../controllers/user');

router.get('/users', getUsers);
router.get('/users/me', getMe);
//router.post('/users', createUser);
router.patch('/users/me', changeUser);
router.patch('/users/me/avatar', changeAvatar);
router.get('/users/:id', getUserId);

module.exports = router;
