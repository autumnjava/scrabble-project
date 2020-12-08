export default class TileChanger {
  async render() {
    let pointer = $('game right ');
    await pointer.append(`
      <changer><surface>Change tiles</surface></changer>`);
  }
}