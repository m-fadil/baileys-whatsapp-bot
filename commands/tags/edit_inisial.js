module.exports = {
    name: "edit_inisial",
    description: "mengedit inisial",
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database, coll_tags, tags) {
        const namaLama = text.toLowerCase().split(' ')[2]
        const namaBaru = text.toLowerCase().split(' ')[3]

        const tag = tags.roles.find(roles => roles.name == namaLama)
        if (tag) {
            const filter = {"title": tags.title, "roles.name": namaLama}
            const update = { $set: { "roles.$.name": namaBaru } };

            await coll_tags.updateOne(filter, update).then(() => {
                commands.get("reaction").execute(sock, messages, true)
            })
        }
        else{
            await sock.sendMessage(
                senderNumber,
                {text: `tidak ada inisial ${namaLama}`},
                {quoted: messages[0]},
                1000
            );
        }
    }
}