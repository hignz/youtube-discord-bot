module.exports = {
  youtube: {
    key: process.env.YOUTUBE_API_KEY,
  },
  discord: {
    token: process.env.DISCORD_TOKEN,
    owner: process.env.DISCORD_OWNER,
  },
  highlights: {
    channels: ['UCQA1kBOCDNAjslCB41On_jg', 'UCGddtMnh6bJd4tFhVkPyrpQ'],
    updateInterval: 20 * 60 * 1000,
  },
  vods: {
    channels: ['UCttiUImNb1UVMy8AOtd6YxQ', 'UC6g1I2_vhJBkquBWvQ9qW6g', 'UC2lhY2MA3mxQ0wo6DegKKzg'],
    updateInterval: 5 * 60 * 1000,
  },
  livestreams: {
    channels: [],
    updateInterval: 1 * 60 * 1000,
  },
};
