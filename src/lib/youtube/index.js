const got = require('got');
const config = require('../../config');

const baseURL = 'https://www.googleapis.com/youtube/v3';

async function getVideos (channelID, limit = 10, parts = 'snippet,id') {
  const url = `${baseURL}/search?channelId=${channelID}&part=${parts}&order=date&maxResults=${limit}&type=video&key=${config.youtube.key}`;

  const { body } = await got(url);

  const bodyObj = JSON.parse(body || '{}');

  if (bodyObj.items && bodyObj.items[0]) {
    return bodyObj.items;
  }

  return [];
}

async function findLive (channelID) {
  const url = `${baseURL}/search?channelId=${channelID}&part=snippet&eventType=live&type=video&key=${config.youtube.key}`;

  const { body } = await got(url);

  const bodyObj = JSON.parse(body || '{}');

  return bodyObj.items.map((item) => {
    if (item.snippet) {
      item.snippet.publishedAt = new Date(item.snippet.publishedAt);
    }

    return item;
  });
}

module.exports = {
  getVideos,
  findLive,
};
