const Enmap = require("enmap")
const fs = require('fs');

module.exports = {
    name: "note",
    description: "menyimpan catatan",
    alias: ["note"],
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database) {
        const note = new Map();
        fs.readdirSync(`./commands/note`).filter(file => file.endsWith('.js')).forEach(file => {
            const command = require(`./note/${file}`)
            note.set(command.name, command)
        });
        
        const coll_notes = database.collection("notes");
        const title = senderNumber.includes("@g.us") ? grup.id : senderNumber
        await sock.groupMetadata(senderNumber).then(async (grup) => {
            return await coll_notes.findOne({"title": title}).then(async (result) => {
                if (!result) {
                    const data = {
                        title: title,
                        note: []
                    }
                    await coll_notes.insertOne(data)
                }
                return await coll_notes.findOne({"title": title})
            })
        })

        if (text.split(' ').length == 1) {
            const msg = draft.note.length <= 0
                      ? 'belum ada note yang ditambahkan'
                      : draft.note.join('\n')
            await sock.sendMessage(
                senderNumber,
                {text: msg},
                {quoted: messages[0]},
                1000
            );
        }
        else if (text.toLowerCase().split(' ')[1] == 'add') {
            note.get("add_note").execute(...arguments, coll_notes)
        }
        else if (text.toLowerCase().split(' ')[1] == 'remove' || text.toLowerCase().split(' ')[1] == 'del') {
            note.get("remove_note").execute(...arguments, coll_notes)
        }
        else if(db.get('note').includes(text.split(' ')[1])) {
            if (text.split(' ').length == 2) {
                await sock.sendMessage(
                    senderNumber,
                    {text: db.get(text.split(' ')[1])},
                    {quoted: messages[0]},
                    1000
                );
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