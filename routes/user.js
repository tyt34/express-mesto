const router = require('express').Router()
const { getUsers, getUserId, createUser, changeUser, changeAvatar } = require('../controllers/user')

router.get('/users', getUsers)
router.get('/users/:id', getUserId)
router.post('/users', createUser)
router.patch('/users/me', changeUser)
router.patch('/users/me/avatar', changeAvatar)

module.exports = router
