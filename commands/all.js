import "dotenv/config.js";

const All = {
	name: "all",
	description: "tag semua orang yang ada di grup",
	alias: ["everyone"],
	async execute(args) {
		const { sock, messages, remoteJid, sendTyping } = args;

		const isMessageFromGroup = remoteJid.includes("@g.us");

		if (!isMessageFromGroup) {
			await sendTyping(args).then(async () => {
				await sock.sendMessage(remoteJid, { text: `Anda tidak sedang berada di grup` }, { quoted: messages[0] }, 1000);
			})
		} else {
			const grup = await sock.groupMetadata(remoteJid);

			const jids = grup.participants.map((user) => user.id).filter((user) => !user.includes(process.env.nomor));
			const msg = jids.map((jid) => "@" + jid.split("@")[0]).join(" ");

			await sendTyping(args).then(async () => {
				await sock.sendMessage(remoteJid, { text: msg, mentions: jids }, { quoted: messages }, 1000);
			})
		}
	},
};

export default All;
