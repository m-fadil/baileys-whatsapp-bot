const TagInisial = {
	name: "add",
	description: "menambahkan inisial tag dan anggotanya",
	alias: ["new", "a"],
	async execute(args) {
		const { sock, messages, pesan, Reaction, coll_tag, remoteJid, roles, grup } = args;
        const [ _, __, inisial, ...at ] = pesan.split(" ")

		/**
		 * nantinya diganti agar tidak perlu menggunakan if ['add', 'edit', 'remove', 'del'] agar bisa seleksi command
		 */
		if (["add", "edit", "remove", "del"].includes(inisial)) {
			Reaction(args, false);
		} else if (!roles.includes(inisial)) {
			/**
			 * nanti bisa ditambahkan quotedPesan yang seblumnya ada ya!!
			 */
			const incomeNum = at.map((str) => str.substring(1)).filter((num) => num.match(/^\d+$/));
			const jids = grup.participants.map((user) => user.id).filter((num) => incomeNum.includes(num.split("@")[0]));
			const msg = jids.map((jid) => "@" + jid.split("@")[0]).join(" ");

			const data = {
				$push: {
					roles: {
						name: inisial,
						jids: jids,
						msg: msg,
					},
				},
			};
			await coll_tag.updateOne({ title: remoteJid }, data).then(() => {
				Reaction(args, true);
			});
		} else {
			await sendTyping(args).then(async () => {
				await sock.sendMessage(remoteJid, { text: `inisial ${inisial} sudah ada` }, { quoted: messages });
			})
		}
	},
};

export default TagInisial;
