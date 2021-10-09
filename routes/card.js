const router = require('express').Router()
const { getCards, createCard, delCardId, sendLiked, delLiked } = require('../controllers/card')

router.get('/cards', getCards)
router.post('/cards', createCard)
router.delete('/cards/:cardId', delCardId)
router.put('/cards/:cardId/likes', sendLiked)
router.delete('/cards/:cardId/likes', delLiked)



/*
router.post('/cards', getCardId)
router.delete('/cards/:cardId', delCard)

router.put('/cards/:cardId/likes', getCards)
router.delete('/cards/:cardId/likes', getCards)
*/
module.exports = router
/*
PATCH /users/me — обновляет профиль
PATCH /users/me/avatar — обновляет аватар
PUT /cards/:cardId/likes — поставить лайк карточке
DELETE /cards/:cardId/likes — убрать лайк с карточки
*/
/*
GET /cards — возвращает все карточки
POST /cards — создаёт карточку
DELETE /cards/:cardId — удаляет карточку по идентификатору
*/

/*
const router = require('express').Router()
const { getUsers, getUserId, createUser } = require('../controllers/user')

router.get('/users', getUsers)
router.get('/:id', getUserId)
router.post('/', createUser)

module.exports = router

*/
