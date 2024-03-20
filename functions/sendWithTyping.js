/**
 * @param {Object} args
 * @param {Array} option
 */
const sendWithTyping = async (args, ...option) => {
	const { sock, remoteJid, delay } = args;

	await sock.presenceSubscribe(remoteJid);
	await delay(500);

	await sock.sendPresenceUpdate('composing', remoteJid);
	await delay(1500);

	await sock.sendPresenceUpdate('paused', remoteJid);

	await sock.sendMessage(remoteJid, ...option);
};

export default sendWithTyping;
