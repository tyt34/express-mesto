const mongoose = require('mongoose');
const validator = require('validator');
// const ValidationError = require('../errors/validation-error');

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
      validator: (validationAvatar) => validator.isURL(validationAvatar),
      message: (props) => `${props.value} это не соответствует ссылки на картинку пользователя!`,
    },
  //  required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (validationEmail) => validator.isEmail(validationEmail),
      message: (props) => `${props.value} это не соответствует адресу почты пользователя!`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
