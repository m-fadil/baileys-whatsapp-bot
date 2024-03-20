const EditInisial = {
	name: 'edit',
	description: 'mengedit inisial',
	alias: ['e'],
	async execute(args) {
		const { messages, remoteJid, pesan, Reaction, coll_tag, roles, sendWithTyping } = args;
		const [_, __, namaLama, namaBaru] = pesan.split(' ');

		const tag = roles.find((role) => role == namaLama);

		if (tag) {
			const filter = { title: remoteJid, 'roles.name': namaLama };
			const update = { $set: { 'roles.$.name': namaBaru } };

			await coll_tag.updateOne(filter, update).then(() => {
				Reaction(args, true);
			});
		} else {
			await sendWithTyping(args, { text: `tidak ada inisial ${namaLama}` }, { quoted: messages });
		}
	},
};

export default EditInisial;
