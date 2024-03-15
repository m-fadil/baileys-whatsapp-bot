const RemoveInisial = {
    name: "remove",
    description: "menghapus inisial",
    alias: ["delete", "del", "rm", "r"],
    async execute(args) {
        const { pesan, remoteJid, Reaction, coll_tag, roles } = args
        const [ _, __, ...inisials ] = pesan.split(" ")

        const delInisial = inisials.filter(inisial => roles.includes(inisial))

        if (delInisial.length != 0) {
            const filter = {"title": remoteJid}
            const updated = {
                $pull: { "roles": { "name": { $in: delInisial } } }
            }

            await coll_tag.updateMany(filter, updated).then(() => {
                Reaction(args, true)
            })
        }
    }
}

export default RemoveInisial