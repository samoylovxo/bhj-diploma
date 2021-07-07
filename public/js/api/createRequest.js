/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  let xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  const fd = new FormData();

  if (options.method === 'GET') {
    for (let k in options.data) {
      options.url += `?${k}=${options.data[k]}&`;
    }
  }

  xhr.open(options.method, options.url);

  if (options.method === 'GET') {
    xhr.send();
  } else {
    for (let k in options.data) {
      fd.append(k, options.data[k]);
    }
    xhr.send(fd);
  }

  xhr.onload = () => {
    // console.log(xhr.response);
    options.callback(null, xhr.response);
  };
};
