const InisialRemove = {
    name: "inisial_remove",
    description: "menghapus anggota pada tag",
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database, tagsCommand, coll_tag, tags, grup) {
        const role = text.split(' ')[1]
        const arrTagar = quotedPesan
                       ? messages[0].message.extendedTextMessage.contextInfo.participant 
                       : text.split(' ').filter(word => word.startsWith("@"))

        const tag = tags.roles.find(roles => roles.name == role)
        const jids = tag.jids.filter(word => !arrTagar.includes("@"+word.split("@")[0]))
        const msg = tag.msg.split(" ").filter(word => !arrTagar.includes(word)).join(" ")

        const filter = {
            "title": tags.title,
            "roles.name": role
        }

        const update = {
            $set: {
                "roles.$.jids": jids,
                "roles.$.msg": msg
            }
        }

        await coll_tag.updateOne(filter, update).then(() => {
            commands.get("reaction").execute(sock, messages, true)
        })
    }
}

export default InisialRemove