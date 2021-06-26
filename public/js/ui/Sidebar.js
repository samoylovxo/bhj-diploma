/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const body = document.getElementsByTagName('body')[0];

    const f = (e) => {
      if (e.target.classList.contains('sidebar-toggle')) {
        body.classList.toggle('sidebar-open');
      }
    };

    body.addEventListener('click', f);
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const sidebarMenu = document.querySelectorAll('.menu-item a');

    const open = (e) => {
      let sidebarItem = e.target.parentElement;

      if (sidebarItem.classList.contains('menu-item_login')) {
        App.getModal('login').open();
      }
      if (sidebarItem.classList.contains('menu-item_register')) {
        App.getModal('register').open();
      }
      if (sidebarItem.classList.contains('menu-item_logout')) {
        User.logout();
      }
    };

    [...sidebarMenu].forEach((elem) => elem.addEventListener('click', open));
  }
}
