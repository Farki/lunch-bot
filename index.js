const SlackBot = require("slackbots");
require("dotenv").config();
const ZomatoParser = require("./parsers/zomato");

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@lunchbot-8g1uc.gcp.mongodb.net/test?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("sample_airbnb").collection("listingsAndReviews");
  console.log(collection.find());

  client.close();
});


// const url = 'https://www.zomato.com/cs/praha/u-%C4%8Desk%C3%A9-chalupy-1-%C5%BEi%C5%BEkov-praha-3/denn%C3%AD-menu';
// const url = "https://www.zomato.com/cs/praha/lok%C3%A1l-star%C3%A9-m%C4%9Bsto-praha-1/denn%C3%AD-menu";

const bot = new SlackBot({
  token: `${process.env.BOT_TOKEN}`,
  name: "Lunch bot"
});

bot.on("start", () => {
  const params = {
    icon_emoji: ":lunch:"
  };

  bot.postMessageToChannel("test_bot", "Ready to serve", params);
});

bot.on("error", err => {
  console.log(err);
});

// Message Handler
bot.on("message", data => {
  if (data.type !== "message") {
    return;
  }
  handleMessage(data.text);
});

function handleMessage(message) {
  if (message.includes(" menu")) {
    menu();
  } else if (message.includes(" test")) {
    testMessage();
  }
}

function printError(err) {
  bot.postMessageToChannel("test_bot", err.message);
}

function menu() {
  new ZomatoParser.Parser("http://kowqeqwe.com/")
    .downloadMenu()
    .then(printMenu)
    .catch(printError);

  function printMenu(array) {
    let output = `*-------------- ${array[0].name} --------------*\n`;
    array.forEach((item, index) => {
      if (index !== 0) {
        output = output + `${item.name} ${item.price} \n`;
      }
    });
    bot.postMessageToChannel("test_bot", output);
  }
}

function testMessage() {
  bot.postMessageToChannel("test_bot", "test");
}
