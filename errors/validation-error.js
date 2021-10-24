class ValidationError extends Error {
  constructor() {
    super();
    this.statusCode = 400;
    this.message = 'Некорректные данные!';
    this.name = 'ValidationError';
  }
}

module.exports = ValidationError;
