export default class Menu {
  async render() {
    let menu = $('<menu></menu>');
    menu.append(`
      <ul>
        <li><a href="#">Check</a></li>
        <li><a href="#">Change</a></li>
        <li><a href="#">Skip</a></li>
        <li><a href="#">Quit</a></li>
      </ul>
    `);
    await $('game right').append(menu);
    menu.show()
  }
}