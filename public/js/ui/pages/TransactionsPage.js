/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Не элемент');
    }
    this.element = element;
    this.registerEvents();
  }

  static lastOptions = '';

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render();
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-account')) {
        this.removeAccount();
      }
      // console.log(e.target.closest('.transaction__remove'));
      if (e.target.closest('.transaction__remove')) {
        this.removeTransaction(e.target.dataset.id);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets(),
   * либо обновляйте только виджет со счетами
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return;
    }
    let question = confirm('Вы действительно хотите удалить счёт?');
    let formData = new FormData();
    formData.append('id', this.lastOptions.account_id);

    if (question) {
      Account.remove(formData, (err, response) => {
        try {
          if (response && response.success) {
            App.updateWidgets();
          }
        } catch (e) {
          throw new Error(err);
        }
      });

      this.clear();
      alert('Готово! Счет удален');
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    let question = confirm('Вы действительно хотите удалить эту транзакцию?');
    let formData = new FormData();
    formData.append('id', id);

    if (question) {
      Transaction.remove(formData, (err, response) => {
        try {
          if (response && response.success) {
            App.update();
          }
        } catch (e) {
          throw new Error(err);
        }
      });

      alert('Готово! Транзакция удалена');
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options) {
      return;
    }
    this.lastOptions = options;
    if (options) {
      Account.get(options.account_id, (err, response) => {
        try {
          const item = [...response.data].find((elem) => elem.id == options.account_id);
          this.renderTitle(item.name);
        } catch (e) {
          throw new Error(err);
        }
      });
      Transaction.list(options.account_id, (err, response) => {
        try {
          if (response && response.success) {
            this.renderTransactions(response.data);
          }
        } catch (e) {
          throw new Error(err);
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счета');
    this.lastOptions = '';
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const title = document.getElementsByClassName('content-title')[0];
    title.innerHTML = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    let time = `${new Date(date).getHours()}:${new Date(date).getMinutes()}`;
    let day = new Date(date).getDay();
    let month = new Date(date).toLocaleString('ru', {
      month: 'long',
    });
    let year = new Date(date).getFullYear();
    let finalDate = `${day} ${month} ${year} г. в ${time}`;

    return finalDate;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    let transacArr = [];

    item.forEach((elem) => {
      let transaction = `<div class="transaction transaction_expense row">
            <div class="col-md-7 transaction__details">
              <div class="transaction__icon">
                  <span class="fa fa-money fa-2x"></span>
              </div>
              <div class="transaction__info">
                  <h4 class="transaction__title">${elem.name}</h4>
                  <!-- дата -->
                  <div class="transaction__date">${this.formatDate(elem.created_at)}</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="transaction__summ">
              <!--  сумма -->
                  ${elem.sum}<span class="currency">₽</span>
              </div>
            </div>
            <div class="col-md-2 transaction__controls">
                <!-- в data-id нужно поместить id -->
                <button class="btn btn-danger transaction__remove" data-id="${elem.id}">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        </div>`;

      transacArr.push(transaction);
    });

    return transacArr;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const sectionContent = this.element.getElementsByClassName('content')[0];
    sectionContent.innerHTML = '';
    this.getTransactionHTML(data).forEach((elem) => {
      sectionContent.insertAdjacentHTML('beforeend', elem);
    });
  }
}
