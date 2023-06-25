module.exports = {
    name: "remove_inisial",
    description: "menghapus inisial",
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, db) {
        let role = text.split(' ')[2]
        if (db.get('tag').includes(role)){
            db.delete(role)
            db.remove('tag', role)
            commands.get("reaction").execute(sock, messages, true)
        }
    }
}