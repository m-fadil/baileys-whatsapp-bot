const InisialRemove = {
    name: "inisial_remove",
    description: "menghapus anggota pada tag",
    async execute(args, inisial, at) {
		const { remoteJid, Reaction, coll_tag, tags } = args;

        const tag = tags.roles.find(role => role.name == inisial)
		const incomeNum = at.map((at) => at.substring(1)).filter((num) => num.match(/^\d+$/));
        const jids = tag.jids.filter(jid => !incomeNum.includes(jid.split("@")[0]))
		const msg = jids.map((jid) => "@" + jid.split("@")[0]).join(" ");

        const filter = {
            "title": remoteJid,
            "roles.name": inisial
        }

        const update = {
            $set: {
                "roles.$.jids": jids,
                "roles.$.msg": msg
            }
        }

        await coll_tag.updateOne(filter, update).then(() => {
            Reaction(args, true)
        })
    }
}

export default InisialRemove