/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  static URL = '/account';
  /**
   * Получает информацию о счёте
   * */
  static get(id = '', callback) {
    createRequest({
      url: this.URL,
      method: 'GET',
      responseType: 'json',
      id,
      callback: (err, response) => {
        try {
          callback(err, response);
        } catch (e) {
          throw new Error(err);
        }
      },
    });
  }
}
