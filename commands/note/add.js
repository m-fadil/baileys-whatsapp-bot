module.exports = {
    name: "add_note",
    description: "menyimpan catatan",
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database) {
        if (text.split(" ").length >= 3) {
            let subjek = text.split(' ')[2]
            
            if (!text.slice(10+subjek.length, text.length)) {
                if (quotedPesan) {
                    let isi = messages[0].message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage.text
                    db.push('note', subjek)
                    db.set(subjek, isi)
                    commands.get("reaction").execute(sock, messages, true)
                }
                else {
                    commands.get("reaction").execute(sock, messages, false)
                }
            }
            else {
                let isi = text.slice(10+subjek.length, text.length)
                if (['add', 'remove', 'del'].includes(subjek)) {
                    commands.get("reaction").execute(sock, messages, false)
                }
                else if (!db.get('note').includes(subjek)) {
                    db.push('note', subjek)
                    db.set(subjek, isi)
                    commands.get("reaction").execute(sock, messages, true)
                }
            }
        }
        else {
            commands.get("reaction").execute(sock, messages, false)
        }
    }
}