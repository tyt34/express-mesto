class NotFoundOrNotOrderError extends Error {
  constructor() {
    super();
    this.statusCode = 404;
    this.message = 'Нет такой карточки или вы не имеете прав для удаления!';
    this.name = 'NotFoundOrNotOrderError';
  }
}

module.exports = NotFoundOrNotOrderError;
