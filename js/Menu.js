export default class Menu {
  render() {
    let menu = $('<menu></menu>');
    menu.append(`
      <ul>
        <li><a href="#">Check</a></li>
        <li><a href="#">Change</a></li>
        <li><a href="#">Skip</a></li>
        <li><a href="#">Quit</a></li>
      </ul>
    `);
    menu.hide();
    $('game right').append(menu);
    menu.fadeIn(1000);
  }
}