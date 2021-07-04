/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    // this.element = element;
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const select = this.element.querySelectorAll('.accounts-select')[0];
    [...select].forEach((elem) => elem.remove());

    Account.list(User.current(), (err, response) => {
      if (response.success) {
        [...response.data].forEach((elem) => {
          let option = `<option value="${elem.id}">${elem.name}</option>`;
          select.insertAdjacentHTML('beforeend', option);
        });
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    data.type = this.element.id == 'new-income-form' ? 'income' : 'expense';
    Transaction.create(data, (err, response) => {
      if (response && response.success) {
        App.update();
        App.getModal(this.element.closest('.modal').dataset.modalId).close();
      }
    });
  }
}
