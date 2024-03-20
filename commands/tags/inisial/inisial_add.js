const InisialAdd = {
	name: 'inisial_add',
	description: 'menambah anggota pada tag',
	async execute(args, inisial, at) {
		const { remoteJid, Reaction, grup, coll_tag, tags } = args;

		const tag = tags.roles.find((role) => role.name == inisial);
		const incomeNum = at.map((at) => at.substring(1)).filter((num) => num.match(/^\d+$/));
		const jids = [
			...tag.jids,
			...grup.participants.map((user) => user.id).filter((num) => incomeNum.includes(num.split('@')[0])),
		];
		const msg = jids.map((jid) => '@' + jid.split('@')[0]).join(' ');

		const update = {
			$set: {
				'roles.$.jids': jids,
				'roles.$.msg': msg,
			},
		};
		const filter = { title: remoteJid, 'roles.name': inisial };
		await coll_tag.updateOne(filter, update).then(() => {
			Reaction(args, true);
		});
	},
};

export default InisialAdd;
