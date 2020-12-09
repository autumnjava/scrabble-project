export default class Menu {
  async render() {
    $('menu').remove();
    let menu = $('<menu></menu>');
    menu.append(`
      <ul>
        <li><a href="#" id="check">Check</a></li>
        <li><a href="#" id="change">Change</a></li>
        <li><a href="#" id="end">End Turn</a></li>
        <li><a href="#" id="quit">Quit</a></li>
      </ul>
    `);
    await $('game right').append(menu);
    menu.show()
  }
}