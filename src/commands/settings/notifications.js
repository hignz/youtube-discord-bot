const commando = require('discord.js-commando');

module.exports = class NotificationsCommand extends commando.Command {
  constructor (client) {
    super(client, {
      name: 'notifications',
      aliases: ['setnotifications', 'sn'],
      group: 'settings',
      memberName: 'notifications',
      description: 'Sets notifications on or off',
      examples: ['!setnotifications on', '!sn off'],
      guildOnly: true,
      userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          key: 'state',
          prompt: '(on or off)',
          type: 'boolean',
        },
      ],
    });
  }

  async run (message, { state }) {
    state = state ? 'on' : 'off';
    this.client.provider.set(message.guild, 'notifications', state);
    return message.channel.send(`${this.name} setting updated! (${state})`);
  }
};
