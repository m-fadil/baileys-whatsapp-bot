import fs from "fs";

const tagsCommand = new Map();
const files = fs.readdirSync(`./commands/tags`).filter((file) => file.endsWith(".js"));
for (const file of files) {
	const { default: command } = await import(`./tags/${file}`);
	tagsCommand.set(command.name, command);
}

const Tag = {
	name: "tag",
	description: "menampilkan tags",
	alias: ["t", "tg"],
	forGroup: true,
	async execute(args) {
		const { messages, getTags, remoteJid, pesan, sendWithTyping } = args;

		/**
		 * hapus jika sidah benar
		 */
		const isMessageFromGroup = remoteJid.includes("@g.us");
		if (isMessageFromGroup) {
			const dbTags = await getTags(args)
			const { roles } = dbTags

			if (pesan.split(" ").length == 1) {
				const msg = roles.length <= 0 ? "belum ada tag yang ditambahkan" : roles.join("\n");
				await sendWithTyping(args, { text: msg }, { quoted: messages });
			}
            else {
                const [ _, perintah ] = pesan.split(" ")

                const fitur = [ ...tagsCommand.values() ].find(command => command.name == perintah || command.alias.includes(perintah))

                if (fitur) {
                    fitur.execute({ ...args, ...dbTags })
                }
				else if (roles.includes(perintah)) {
					tagsCommand.get("inisial").execute({ ...args, ...dbTags })
				}
            }
		}
	},
};

export default Tag;
