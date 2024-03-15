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
	private: false,
	async execute(args) {
		const { sock, messages, remoteJid, pesan, database } = args;

		/**
		 * hapus jika sidah benar
		 */
		const isMessageFromGroup = remoteJid.includes("@g.us");
		if (isMessageFromGroup) {
			const grup = await sock.groupMetadata(remoteJid);
			const coll_tag = database.collection("tag");

			const tags = await coll_tag.findOne({ title: grup.id }).then(async (result) => {
				if (!result) {
					const data = {
						title: grup.id,
						roles: [],
					};
					await coll_tag.insertOne(data);
				}
				return await coll_tag.findOne({ title: grup.id });
			});

            const roles = tags.roles.map((role) => role.name);

			if (pesan.split(" ").length == 1) {
				const msg = roles.length <= 0 ? "belum ada tag yang ditambahkan" : roles.join("\n");
				await sock.sendMessage(remoteJid, { text: msg }, { quoted: messages });
			}
            else {
                const [ _, perintah ] = pesan.split(" ")

                const fitur = [ ...tagsCommand.values() ].find(command => command.name == perintah || command.alias.includes(perintah))

                if (fitur) {
                    fitur.execute({ ...args, grup, coll_tag, tags, roles })
                }
				else if (roles.includes(perintah)) {
					tagsCommand.get("inisial").execute({ ...args, grup, coll_tag, tags })
				}

                // if (text.toLowerCase().split(' ')[1] == 'add') {
                //     tagsCommand.get('add_inisial').execute(...arguments, coll_tag, tags, grup)
                // }
                // else if (text.toLowerCase().split(' ')[1] == 'edit') {
                //     tagsCommand.get('edit_inisial').execute(...arguments, coll_tag, tags)
                // }
                // else if (text.toLowerCase().split(' ')[1] == 'remove' || text.toLowerCase().split(' ')[1] == 'del') {
                //     tagsCommand.get('remove_inisial').execute(...arguments, coll_tag, tags)
                // }
                // else if(tags.roles.find(roles => roles.name == text.split(' ')[1])) {
                //     tagsCommand.get('inisial').execute(...arguments, tagsCommand, coll_tag, tags, grup)
                // }
            }
		}
		// else {
		//     await sock.sendMessage(
		//         senderNumber,
		//         { text: `Anda tidak sedang berada di grup`},
		//         { quoted: messages[0] },
		//         1000
		//     );
		// }
	},
};

export default Tag;
