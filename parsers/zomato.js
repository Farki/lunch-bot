const Axios = require("axios");
const Cheerio = require("cheerio");

class Parser {
  constructor(url) {
    this.url = url;
  }

  /**
   * Downloads menu from Zomato
   * @returns {Promise<[]>}
   */
  async downloadMenu() {
    const request = await Axios.get(this.url);
    const html = request.data;
    const $ = Cheerio.load(html, { normalizeWhitespace: true });
    const menu = [];
    const header = $(".ui.res-name.mb0.header.nowrap a")
      .text()
      .trim();

    menu.push({
      name: header,
      price: ""
    });

    $(".tmi", "#menu-preview .tmi-group").each(function() {
      const menuItem = $(this);
      const name = menuItem
        .find($(".tmi-name"))
        .text()
        .trim();
      const price = menuItem
        .find($(".tmi-price .row"))
        .text()
        .trim();

      menu.push({
        name: name,
        price: price
      });
    });

    return menu;
  }
}

module.exports = { Parser };
