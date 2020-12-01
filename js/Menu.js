export default class Menu {
  render() {
    let menu = $('<menu></menu>');
    menu.append(`
      <ul>
        <li><a href="#">Check Word</a></li>
        <li><a href="#">Change Tiles</a></li>
        <li><a href="#">Skip Turn</a></li>
        <li><a href="#">End Game</a></li>
      </ul>
    `);
    menu.hide();
    $('game right').append(menu);
    menu.fadeIn(1000);
  }
}