class ValidationError extends Error {
  constructor(mess) {
    super();
    console.log(' = = > > ', mess)
    this.statusCode = 400;
    if (mess === '') {
      this.message = 'Некорректные данные!';
    } else {
      this.message = mess;
    }
    this.name = 'ValidationError';
  }
}

module.exports = ValidationError;
