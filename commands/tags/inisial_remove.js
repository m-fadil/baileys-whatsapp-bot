module.exports = {
    name: "inisial_remove",
    description: "menghapus anggota pada tag",
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, db, tags) {
        let role = text.split(' ')[1]
        let arrTagar = ''
        quotedPesan ? arrTagar = messages[0].message.extendedTextMessage.contextInfo.participant : arrTagar = text.split(' ').slice(2, text.length).join('')
        let msg = db.get(role, 'msg')
        arrTagar.split('@').forEach(val => {
            if (db.get(role, 'msg').includes(`@${val}`)){
                db.remove(role, val+'@s.whatsapp.net', 'jids')
                msg = msg.split(`@${val} `).join('')
            }
        })
        db.set(role, msg, 'msg')
        commands.get("reaction").execute(sock, messages, true)
    }
}