const commando = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class HighlightsCommand extends commando.Command {
  constructor (client) {
    super(client, {
      name: 'highlights',
      aliases: ['hl'],
      group: 'main',
      memberName: 'highlights',
      description: 'Lists latest highlights.',
      examples: ['!highlights', '!hl'],
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }

  async run (message) {
    const latestHighlights = this.client.provider.get('global', 'latestHighlights')
      .sort(
        (a, b) => ((new Date(a.snippet.publishedAt)).getTime()
          > (new Date(b.snippet.publishedAt)).getTime()
          ? 0 : 1),
      )
      .slice(0, 5);

    latestHighlights.forEach((highlight) => {
      message.channel.send(new RichEmbed()
        .setTitle(highlight.snippet.title)
        .setURL(`https://www.youtube.com/watch?v=${highlight.id.videoId}`)
        .setFooter(highlight.snippet.channelTitle)
        .setTimestamp(new Date(highlight.snippet.publishedAt))
        .setColor(0x018786));
    });
  }
};
