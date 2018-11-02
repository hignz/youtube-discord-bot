const Commando = require('discord.js-commando');
const sqlite = require('sqlite');
const path = require('path');
const updater = require('./updater');
const config = require('../config');

const client = new Commando.Client({
  owner: config.discord.owner,
});

client.setProvider(
  sqlite
    .open(path.join(__dirname, '../../', 'database.sqlite3'))
    .then(db => new Commando.SQLiteProvider(db)),
);

client
  .registry
  .registerGroup('main', 'Main')
  .registerGroup('settings', 'Settings')
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, '../commands'));

client.on('ready', () => {
  console.log('client.user.tag', client.user.tag);
});

(async () => {
  await client.login(config.discord.token);

  await updater(client);
})();
