const Long = require('long');

module.exports = function getDefaultChannel (guild) {
  if (guild.channels.has(guild.id)) {
    return guild.channels.get(guild.id);
  }

  const generalChannel = guild.channels.find(({ name }) => name === 'general');
  if (generalChannel) {
    return generalChannel;
  }

  return guild.channels
    .filter(c => c.type === 'text'
      && c.permissionsFor(guild.client.user).has('SEND_MESSAGES'))
    .sort((a, b) => a.position - b.position
      || Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
    .first();
};
