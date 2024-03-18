const EditInisial = {
    name: "edit",
    description: "mengedit inisial",
    alias: ["e"],
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database, coll_tag, tags) {
        const namaLama = text.toLowerCase().split(' ')[2]
        const namaBaru = text.toLowerCase().split(' ')[3]

        const tag = tags.roles.find(roles => roles.name == namaLama)
        if (tag) {
            const filter = {"title": tags.title, "roles.name": namaLama}
            const update = { $set: { "roles.$.name": namaBaru } };

            await coll_tag.updateOne(filter, update).then(() => {
                commands.get("reaction").execute(sock, messages, true)
            })
        }
        else{
            await sendTyping(args).then(async () => {
                await sock.sendMessage(
                    senderNumber,
                    {text: `tidak ada inisial ${namaLama}`},
                    {quoted: messages[0]},
                    1000
                );
            })
        }
    }
}

export default EditInisial