module.exports = {
    name: "remove_note",
    description: "menghapus catatan",
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, db) {
        if (text.split(" ").length >= 3) {
            let subjek = text.split(' ')[2]
            if (db.get('note').includes(subjek)){
                db.delete(subjek)
                db.remove('note', subjek)
                commands.get("reaction").execute(sock, messages, true)
            }
            else {
                commands.get("reaction").execute(sock, messages, false)
            }
        }
        else {
            commands.get("reaction").execute(sock, messages, false)
        }
    }
}