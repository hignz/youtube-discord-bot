const commando = require('discord.js-commando');

module.exports = class TagEveryoneCommand extends commando.Command {
  constructor (client) {
    super(client, {
      name: 'tageveryone',
      aliases: ['te'],
      group: 'settings',
      memberName: 'tageveryone',
      description: 'Sets notifications tagging everyone on or off.',
      examples: ['!tageveryone on', '!te off'],
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
    this.client.provider.set(message.guild, 'notificationsTagEveryone', state);
    return message.channel.send(`${this.name} setting updated! (${state})`);
  }
};
