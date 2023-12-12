module.exports = {
    name: "remove_inisial",
    description: "menghapus inisial",
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database, coll_tags, tags) {
        let role = text.split(' ')[2]
        const filter = {"title": tags.title}
        const updated = {
            $pull: { "roles": { "name": role } }
        }

        if (tags.roles.find(roles => roles.name == role)) {
            await coll_tags.updateOne(filter, updated).then(() => {
                commands.get("reaction").execute(sock, messages, true)
            })
        }
    }
}