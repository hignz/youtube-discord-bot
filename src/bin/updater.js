const getDefaultChannel = require('../lib/utils/getDefaultChannel');
const youtube = require('../lib/youtube/index');
const config = require('../config');
const { RichEmbed } = require('discord.js');

async function updateHighlights (client) {
  const targetKey = 'latestHighlights';

  const latestHighlights = (await Promise.all(
    config.highlights.channels.map(channelID => youtube.getVideos(channelID, 40)),
  ))
    .reduce((videos, results) => videos.concat(results), []);

  const lastLatestHighlights = client.provider.get('global', targetKey);

  if (lastLatestHighlights) {
    for (const latestHighlight of latestHighlights) {
      const foundLastLatestHighlight = lastLatestHighlights
        .find(highlight => highlight.id.videoId === latestHighlight.id.videoId);
      if (foundLastLatestHighlight) {
        continue;
      }

      client.guilds.forEach((guild) => {
        const defaultChannel = getDefaultChannel(guild);

        defaultChannel.send(new RichEmbed()
          .setAuthor(
            latestHighlight.snippet.channelTitle,
            null,
            `https://www.youtube.com/channel/${latestHighlight.snippet.channelId}`,
          )
          .setTitle(latestHighlight.snippet.title)
          .setURL(`https://www.youtube.com/watch?v=${latestHighlight.id.videoId}`)
          .setThumbnail((latestHighlight.snippet.thumbnails.high
            || latestHighlight.snippet.thumbnails.default).url)
          .setFooter('New Highlight!')
          .setTimestamp(new Date(latestHighlight.snippet.publishedAt))
          .setColor(0x018786));
      });
    }
  }

  client.provider.set('global', targetKey, latestHighlights);
}

async function updateVods (client) {
  const targetKey = 'latestVods';

  const latestVods = (await Promise.all(
    config.vods.channels.map(channelID => youtube.getVideos(channelID)),
  ))
    .reduce((videos, results) => videos.concat(results), []);

  const lastLatestVods = client.provider.get('global', targetKey);

  if (lastLatestVods) {
    for (const latestVod of latestVods) {
      const foundLastLatestVod = lastLatestVods
        .find(vod => vod.id.videoId === latestVod.id.videoId);
      if (foundLastLatestVod) {
        continue;
      }

      client.guilds.forEach((guild) => {
        const defaultChannel = getDefaultChannel(guild);

        defaultChannel.send(new RichEmbed()
          .setAuthor(
            latestVod.snippet.channelTitle,
            null,
            `https://www.youtube.com/channel/${latestVod.snippet.channelId}`,
          )
          .setTitle(latestVod.snippet.title)
          .setURL(`https://www.youtube.com/watch?v=${latestVod.id.videoId}`)
          .setThumbnail((latestVod.snippet.thumbnails.high
            || latestVod.snippet.thumbnails.default).url)
          .setFooter('New Vod!')
          .setTimestamp(new Date(latestVod.snippet.publishedAt))
          .setColor(0x1687a7));
      });
    }
  }

  client.provider.set('global', targetKey, latestVods);
}

async function updateLivestreams (client) {
  const targetKey = 'latestLivestreams';

  const latestLivestreams = (await Promise.all(
    config.livestreams.channels
      .map(channelID => youtube.findLive(channelID)
        .then(videos => ({ channelID, videos }))),
  ));

  const lastLatestLivestreams = client.provider.get('global', targetKey);

  if (lastLatestLivestreams) {
    for (const latestLivestream of latestLivestreams) {
      if (!latestLivestream.videos || !latestLivestream.videos.length) {
        continue;
      }

      const foundLastLatestLivestream = lastLatestLivestreams
        .find(livestream => livestream.channelID === latestLivestream.channelID);
      if (!foundLastLatestLivestream) {
        continue;
      }

      if (foundLastLatestLivestream.videos && foundLastLatestLivestream.videos.length) {
        continue;
      }

      const livestreamVideo = latestLivestream.videos[0];
      client.guilds.forEach((guild) => {
        const guildWantsNotifications = client.provider.get(guild, 'notifications') !== 'off';
        if (!guildWantsNotifications) {
          return;
        }

        const guildNotificationsChannelId = client.provider.get(guild, 'notificationsChannel');
        const notificationsChannel = guildNotificationsChannelId
          ? guild.channels.find(channel => channel.id === guildNotificationsChannelId) : undefined;
        const targetChannel = notificationsChannel || getDefaultChannel(guild);

        const shouldTagEveryone = client.provider.get(guild, 'notificationsTagEveryone') !== 'off';

        targetChannel.send(`${shouldTagEveryone ? '@everyone ' : ''}${livestreamVideo.snippet.channelTitle} is live! ${livestreamVideo.snippet.title} - https://www.youtube.com/watch?v=${livestreamVideo.id.videoId}`);
      });
    }
  }

  client.provider.set('global', targetKey, latestLivestreams);
}

module.exports = async function updater (client) {
  setTimeout(async function updateHighlightsLoop () {
    await updateHighlights(client);

    setTimeout(updateHighlightsLoop, config.highlights.updateInterval);
  }, 0);

  setTimeout(async function updateVodsLoop () {
    await updateVods(client);

    setTimeout(updateVodsLoop, config.vods.updateInterval);
  }, 0);

  setTimeout(async function updateLivestreamsLoop () {
    await updateLivestreams(client);

    setTimeout(updateLivestreamsLoop, config.livestreams.updateInterval);
  }, 0);
};
