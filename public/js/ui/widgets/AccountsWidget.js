/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Не элемент');
    }
    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      if (e.target.classList.contains('create-account')) {
        App.getModal('createAccount').open();
      }
      if (e.target.closest('.account')) {
        this.onSelectAccount(e.target);
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      let data = User.current();
      Account.list(data, (err, response) => {
        if (response && response.success) {
          console.log(response);
          this.clear();
          this.renderItem(response);
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const account = document.querySelectorAll('.account');
    [...account].forEach((elem) => elem.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    element.closest('.account').classList.add('active');
    for (let i = 0; i < this.element.children.length; i++) {
      if (this.element.children[i] != element.closest('.account')) {
        this.element.children[i].classList.remove('active');
      }
    }
    App.showPage('transactions', { account_id: element.closest('.account').dataset.id });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    let scoreArr = [];
    for (let i = 0; i < item.data.length; i++) {
      let score = `<li class="account" data-id="${item.data[i].id}">
    <a href="#">
        <span>${item.data[i].name}</span> /
        <span>${item.data[i].sum} ₽</span>
    </a>
</li>`;

      scoreArr.push(score);
    }
    return scoreArr;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    this.getAccountHTML(data).forEach((elem) => this.element.insertAdjacentHTML('beforeend', elem));
  }
}
