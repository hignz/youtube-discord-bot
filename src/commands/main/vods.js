const commando = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class VodsCommand extends commando.Command {
  constructor (client) {
    super(client, {
      name: 'vods',
      aliases: ['vods', 'v'],
      group: 'main',
      memberName: 'vods',
      description: 'Lists latest vods.',
      examples: ['!vods', '!v'],
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }

  async run (message) {
    const latestVods = this.client.provider.get('global', 'latestVods')
      .sort(
        (a, b) => ((new Date(a.snippet.publishedAt)).getTime()
          > (new Date(b.snippet.publishedAt)).getTime()
          ? 0 : 1),
      )
      .slice(0, 5);

    latestVods.forEach((vod) => {
      message.channel.send(new RichEmbed()
        .setTitle(vod.snippet.title)
        .setURL(`https://www.youtube.com/watch?v=${vod.id.videoId}`)
        .setFooter(vod.snippet.channelTitle)
        .setTimestamp(new Date(vod.snippet.publishedAt))
        .setColor(0x1687a7));
    });
  }
};
