module.exports = {
    name: "inisial",
    description: "tag anggota",
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, db, tags) {
        if (text.toLowerCase().split(' ')[2] == 'add') {
            tags.get("inisial_add").execute(...arguments)
        }
        else if (text.toLowerCase().split(' ')[2] == 'remove' || text.toLowerCase().split(' ')[2] == 'del') {
            tags.get("inisial_remove").execute(...arguments)
        }
        else if (text.split(' ').length == 2) {
            await sock.sendMessage(
                senderNumber,
                {text: db.get(text.split(' ')[1], 'msg'), mentions: db.get(text.split(' ')[1], 'jids')},
                {quoted: messages[0]},
                1000
            );
        }
        else {
            commands.get("reaction").execute(sock, messages, false)
        }
    }
}