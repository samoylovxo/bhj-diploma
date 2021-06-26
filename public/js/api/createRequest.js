/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  let xhr = new XMLHttpRequest();

  try {
    if (options.method === 'GET') {
      xhr.responseType = options.responseType;
      xhr.open(options.method, options.url);
      xhr.send();
    } else {
      xhr.responseType = options.responseType;
      xhr.open(options.method, options.url);
      console.log(options.data);
      xhr.send(options.data);
    }

    xhr.onload = () => {
      // console.log(xhr.response);
      options.callback(null, xhr.response);
    };
  } catch (e) {
    throw e;
  }
};
