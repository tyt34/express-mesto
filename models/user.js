/* eslint-disable */
const mongoose = require('mongoose');
const ValidationError = require('../errors/validation-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  //  required: true,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  //  required: true,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: function(validationAvatar) {
        //console.log(' what -> ',/\d{3}-\d{3}-\d{4}/i.test(validationAvatar));
        return /^http[s]{0,1}[:][\\/]{2}[._~:\\/?#@!$&\[\]'()*+,;=a-z]/i.test(validationAvatar);
      },
      message: props => `${props.value} это не соответствует ссылки на картинку!`
      //throw new ValidationError();
      //return res.status(400).send({ message: 'Неправильные keys в body запроса' });
    }
  //  required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
// https://www.google.ru/
// https://google.ru/
