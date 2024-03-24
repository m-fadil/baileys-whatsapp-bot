import 'dotenv/config.js';

const All = {
	name: 'all',
	description: 'tag semua orang yang ada di grup',
	alias: ['everyone'],
	forGroup: true,
	help: ["all"],
	async execute(args) {
		const { sock, messages, remoteJid, sendWithTyping } = args;

		const grup = await sock.groupMetadata(remoteJid);

		const jids = grup.participants.map((user) => user.id).filter((user) => !user.includes(process.env.nomor));
		const msg = jids.map((jid) => '@' + jid.split('@')[0]).join(' ');

		await sendWithTyping(args, { text: msg, mentions: jids }, { quoted: messages }, 1000);
	},
};

export default All;
