module.exports = {
    name: "inisial_add",
    description: "menambah anggota pada tag",
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, db, tags) {
        let role = text.split(' ')[1]
        let arrTagar = ''
        quotedPesan ? arrTagar = messages[0].message.extendedTextMessage.contextInfo.participant : arrTagar = text.split(' ').slice(2, text.length).join('')
        let jids = db.get(role, 'jids')
        let msg = db.get(role, 'msg')
        arrTagar.split('@').forEach(val => {
            if (!db.get(role, 'msg').includes(`@${val}`)){
                grup['participants'].map(
                    async (usr) => {
                        if (usr.id.includes(val.replace(/\D/g, '')) && val.replace(/\D/g, '') != '') {
                            msg += '@' + usr.id.split('@')[0] + ' ';
                            jids.push(usr.id.replace('c.us', 's.whatsapp.net'));
                        }
                    }
                );
            }
        })
        db.set(role, {jids: jids, msg: msg})
        commands.get("reaction").execute(sock, messages, true)
    }
}