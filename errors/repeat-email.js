class RepeatEmail extends Error {
  constructor() {
    super();
    this.statusCode = 409;
    this.message = 'Данный email уже зарегистрирован!';
    this.name = 'RepeatEmail';
  }
}

module.exports = RepeatEmail;
