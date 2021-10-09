const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const { PORT = 3000, BASE_PATH } = process.env
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})

app.use((req, res, next) => {
  req.user = {_id: '615ca641fc1c816c53808953'}
  next()
})

app.use('/', require('./routes/user'))
app.use('/', require('./routes/card'))

app.listen(PORT, () => {
  console.log(PORT)
  console.log('Ссылка на сервер')
  console.log('http://localhost:'+PORT)
  console.log('http://localhost:'+PORT+'/users')
  console.log('http://localhost:'+PORT+'/cards')
  console.log('http://localhost:'+PORT+'/:id')
  console.log('http://localhost:'+PORT+'/')
  console.log('http://localhost:'+PORT+'/users/615ca641fc1c816c53808953')
  console.log(' пользователя которого нет ')
  console.log('http://localhost:'+PORT+'/users/AAAAAAA1c816c538089AAAAA')
  console.log('http://localhost:'+PORT+'/cards/616176cce4a0a39b9d1251c3')
  console.log('http://localhost:'+PORT+'/cards/6161749d41edf073f5cf72f7/likes')

})
