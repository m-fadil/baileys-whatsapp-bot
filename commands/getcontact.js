import UripGetContact from "urip-getcontact";

const getContact = new UripGetContact(process.env.gcToken, process.env.gcKey);

const Getcontact = {
	name: "getcontact",
	description: "API getcontact",
	alias: ["gc"],
	async execute(args) {
		const { sock, messages, remoteJid, pesan } = args;
		const [_, ...incomeNomor] = pesan.split(" ");

		if (incomeNomor) {
			let nomor = incomeNomor.join().match(/\d/g).join("");

			if (!nomor.startsWith("0")) {
				nomor = `+${nomor}`;
			}
			getContact
				.checkNumber(nomor)
				.then(async (data) => {
					let msg = "";
					data.tags.forEach((e) => {
						msg += e + "\n";
					});
					while (true) {
						if (msg.endsWith("\n")) msg = msg.slice(0, msg.length - 1);
						else break;
					}
					await sendTyping(args).then(async () => {
						await sock.sendMessage(remoteJid, { text: msg }, { quoted: messages });
					})
				})
				.catch(async (err) => {
					try {
						const errorMsg = err.toString();
						const cleanedErrorText = errorMsg.replace(/^Error: /, "");
						const errorJSON = JSON.parse(cleanedErrorText);
						var pesan = `Terdapat ERROR!\n${errorJSON.result.subscriptionInfo.subsInfoButtonIntroText}`;
					} catch {
						var pesan = "Gagal mengurai pesan error";
					}
					await sendTyping(args).then(async () => {
						await sock.sendMessage(remoteJid, { text: pesan }, { quoted: messages });
					})
				});
		} else {
			commands.get("reaction").execute(sock, messages, false);
		}
	},
};

export default Getcontact;
