const commando = require('discord.js-commando');

module.exports = class NotificationChannelCommand extends commando.Command {
  constructor (client) {
    super(client, {
      name: 'notificationchannel',
      aliases: ['notifchannel', 'nc'],
      group: 'settings',
      memberName: 'notificationchannel',
      description: 'Sets the channel where notifications will be sent',
      examples: ['!notifchannel #general', '!nc #everything'],
      guildOnly: true,
      userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          key: 'channel',
          prompt: 'Enter the channel tag',
          type: 'channel',
        },
      ],
    });
  }

  async run (message, { channel }) {
    this.client.provider.set(message.guild, 'notificationsChannel', channel.id);
    return message.channel.send(`${this.name} setting updated! (${channel})`);
  }
};
