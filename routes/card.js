const router = require('express').Router()
const { getCards, createCard, delCardId, sendLiked, delLiked } = require('../controllers/card')

router.get('/cards', getCards)
router.post('/cards', createCard)
router.delete('/cards/:cardId', delCardId)
router.put('/cards/:cardId/likes', sendLiked)
router.delete('/cards/:cardId/likes', delLiked)

module.exports = router
