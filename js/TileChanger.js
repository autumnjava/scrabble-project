export default class TileChanger {
  async render() {
    $('changer').remove();
    let pointer = await $('player');
    await pointer.append(`<changer><surface>Change tiles</surface></changer>`);
  }
}