module.exports = {
    name: "add_inisial",
    description: "menambahkan inisial tag dan anggotanya",
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, db) {
        let role = text.split(' ')[2]
        let arrTagar = text.split(' ').slice(3, text.length).join('')
        if (['add', 'edit', 'remove', 'del'].includes(role)) {
            commands.get("reaction").execute(sock, messages, false)
        }
        else if (!db.get('tag').includes(role)) {
            var grup = await sock.groupMetadata(senderNumber);
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
            db.push('tag', role)
            db.set(role, {jids: jids, msg: msg})
            commands.get("reaction").execute(sock, messages, true)
        }else {
            await sock.sendMessage(
                senderNumber,
                {text: `inisial ${role} sudah ada`},
                1000
            );
        }
    }
}