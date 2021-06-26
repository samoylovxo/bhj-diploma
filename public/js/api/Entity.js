/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {
  static URL = '';
  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static list(data, callback) {
    if (this.URL == '/account') {
      createRequest({
        url: this.URL,
        method: 'GET',
        responseType: 'json',
        callback: (err, response) => {
          try {
            callback(err, response);
          } catch (e) {
            throw new Error(err);
          }
        },
      });
    }
    if (this.URL == '/transaction') {
      createRequest({
        url: this.URL + `?account_id=${data}`,
        method: 'GET',
        responseType: 'json',
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

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback) {
    createRequest({
      url: this.URL,
      method: 'PUT',
      responseType: 'json',
      data,
      callback: (err, response) => {
        try {
          callback(err, response);
        } catch (e) {
          throw new Error(err);
        }
      },
    });
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(data, callback) {
    createRequest({
      url: this.URL,
      method: 'DELETE',
      responseType: 'json',
      data,
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
