module.exports = {
    name: "inisial_add",
    description: "menambah anggota pada tag",
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database, tagsCommand, coll_tags, tags, grup) {
        const role = text.split(' ')[1]
        const arrTagar = quotedPesan 
                       ? messages[0].message.extendedTextMessage.contextInfo.participant 
                       : text.split(' ').slice(2, text.length).join('')

        const tag = tags.roles.find(roles => roles.name == role)
        let jids = tag.jids
        let msg = tag.msg

        arrTagar.split('@').forEach(val => {
            if (!msg.includes(`@${val}`)) {
                grup['participants'].map( async (usr) => {
                        if (usr.id.includes(val.replace(/\D/g, '')) && val.replace(/\D/g, '') != '') {
                            msg += '@' + usr.id.split('@')[0] + ' ';
                            jids.push(usr.id.replace('c.us', 's.whatsapp.net'));
                        }
                    }
                );
            }
        })

        const update = {
            $set: {
                "roles.$.jids": jids,
                "roles.$.msg": msg
            }
        }
        const filter = {"title": tags.title, "roles.name": role}
        await coll_tags.updateOne(filter, update).then(() => {
            commands.get("reaction").execute(sock, messages, true)
        })
    }
}