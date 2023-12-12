module.exports = {
    name: "add_inisial",
    description: "menambahkan inisial tag dan anggotanya",
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database, coll_tags, tags, grup) {
        const role = text.split(' ')[2]
        const arrTagar = text.split(' ').slice(3, text.length).join('')

        if (['add', 'edit', 'remove', 'del'].includes(role)) {
            commands.get("reaction").execute(sock, messages, false)
        }
        else if (!tags.roles.find(roles => roles.name == role)) {
            const jids = []
            let msg = ''
            if (quotedPesan) {
                msg += '@' + messages[0].message.extendedTextMessage.contextInfo.participant.split('@')[0] + ' ';
                jids.push(messages[0].message.extendedTextMessage.contextInfo.participant.replace('c.us', 's.whatsapp.net'))
            }
            else {
                arrTagar.split('@').forEach(val => {
                    grup['participants'].map(
                        async (usr) => {
                            if (usr.id.includes(val.replace(/\D/g, '')) && val.replace(/\D/g, '') != '') {
                                msg += '@' + usr.id.split('@')[0] + ' ';
                                jids.push(usr.id.replace('c.us', 's.whatsapp.net'));
                            }
                        }
                    );
                })
            }
            const data = {
                $push: {
                    "roles": {
                        name: role,
                        jids: jids,
                        msg: msg
                    }
                }
            }
            await coll_tags.updateOne({"title": tags.title}, data).then(() => {
                commands.get("reaction").execute(sock, messages, true)
            })
        }
        else {
            await sock.sendMessage(
                senderNumber,
                {text: `inisial ${role} sudah ada`},
                1000
            );
        }
    }
}