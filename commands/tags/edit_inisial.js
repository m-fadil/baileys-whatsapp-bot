module.exports = {
    name: "edit_inisial",
    description: "mengedit inisial",
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, db) {
        namaLama = text.toLowerCase().split(' ')[2]
        namaBaru = text.toLowerCase().split(' ')[3]
        if (db.get('tag').includes(namaLama)) {
            let tempJids = db.get(namaLama, 'jids')
            let tempMsg = db.get(namaLama, 'msg')
            db.remove('tag', namaLama)
            db.delete(namaLama)
            db.push('tag', namaBaru)
            db.set(namaBaru, {jids: tempJids, msg: tempMsg})
            commands.get("reaction").execute(sock, messages, true)
        }else{
            await sock.sendMessage(
                senderNumber,
                {text: `tidak ada inisial ${namaLama}`},
                {quoted: messages[0]},
                1000
            );
        }
    }
}