const commando = require('discord.js-commando');
const getRandomInt = require('../../lib/utils/randomInt');
const { RichEmbed } = require('discord.js');

module.exports = class RandomHighlightCommand extends commando.Command {
  constructor (client) {
    super(client, {
      name: 'randomhighlight',
      aliases: ['rhl'],
      group: 'main',
      memberName: 'randomhighlight',
      description: 'Posts a random highlight.',
      examples: ['!randomhighlight', '!rhl'],
      throttling: {
        usages: 1,
        duration: 2,
      },
    });
  }

  async run (message) {
    const latestHighlights = this.client.provider.get('global', 'latestHighlights');

    if (!latestHighlights.length) {
      return message.reply('Highlights have not loaded yet..');
    }
    const randomHighlight = latestHighlights[getRandomInt(0, latestHighlights.length - 1)];

    return message.channel.send(new RichEmbed()
      .setAuthor(
        randomHighlight.snippet.channelTitle,
        null,
        `https://www.youtube.com/channel/${randomHighlight.snippet.channelId}`,
      )
      .setTitle(randomHighlight.snippet.title)
      .setURL(`https://www.youtube.com/watch?v=${randomHighlight.id.videoId}`)
      .setThumbnail((randomHighlight.snippet.thumbnails.high
        || randomHighlight.snippet.thumbnails.default).url)
      .setFooter('Random Highlight')
      .setTimestamp(new Date(randomHighlight.snippet.publishedAt))
      .setColor(0x018786));
  }
};
