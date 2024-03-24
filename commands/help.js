function parseCommand(commands, fromGroup) {
	return Array.from(commands.values())
		.filter(command => !command.forGroup || fromGroup)
		.map((command) => command.help)
		.filter((command) => command != undefined)
		.map((command) => command.map(c => process.env.command + c).join('\n'))
		.join('\n');
}

function parseFitur(fitur) {
	const { name, alias, description, help } = fitur;
	const aliasString = alias.join(', ');
	const penggunaan = help.map((c) => `${process.env.command}${c}`).join('\n');

	return `*command*: ${name}\n*alias*: ${aliasString}\n*deskripsi*: ${description}\n*penggunaan*:\n${penggunaan}`;
}


const Help = {
	name: 'help',
	description: 'menampilkan commands',
	alias: ['h'],
	help: [
		"help",
		"help *command*"
	],
	async execute(args) {
		const { messages, remoteJid, commands, pesan, sendWithTyping } = args;
		const [_, perintah] = pesan.split(' ');

		const fromGroup = remoteJid.includes('g.us');
		const fitur = Array.from(commands.values()).find(
			(command) => command.name == perintah || command.alias.includes(perintah),
		);

		if (perintah) {
			if (fitur && (fromGroup || !fitur.forGroup)) {
				const text = parseFitur(fitur);
				await sendWithTyping(args, { text}, { quoted: messages });
			}
			else {
				await sendWithTyping(args, { text: `command ${perintah} tidak ada` }, { quoted: messages });
			}
		}
		else {
			const allCommand = parseCommand(commands, fromGroup)
			const text = `${allCommand}\n\n*NB**\nNomor pengirim = @me, @myself, @aku, @saya\n*judul* dan *pembuat* boleh kosong`;
			await sendWithTyping(args, { text }, { quoted: messages });
		}
	},
};

export default Help;
