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
        
        const coll_note = database.collection("note");
        const title = senderNumber.includes("@g.us") 
                    ? await sock.groupMetadata(senderNumber).then((grup) => {
                        return grup.id
                      })
                    : senderNumber

        const draft = await coll_note.findOne({"title": title}).then(async (result) => {
            if (!result) {
                const data = {
                    title: title,
                    notes: []
                }
                await coll_note.insertOne(data)
            }
            return await coll_note.findOne({"title": title})
        })

        if (text.split(' ').length == 1) {
            const msg = draft.notes.length <= 0
                      ? 'belum ada note yang ditambahkan'
                      : draft.notes.map((note) => note.subject).join('\n')
            await sock.sendMessage(
                senderNumber,
                {text: msg},
                {quoted: messages[0]},
                1000
            );
        }
        else if (text.toLowerCase().split(' ')[1] == 'add') {
            note.get("add_note").execute(...arguments, coll_note, draft)
        }
        else if (text.toLowerCase().split(' ')[1] == 'remove' || text.toLowerCase().split(' ')[1] == 'del') {
            note.get("remove_note").execute(...arguments, coll_note, draft)
        }
        else if(draft.notes.find(notes => notes.subject == text.split(' ')[1])) {
            if (text.split(" ").length == 2) {
                await sock.sendMessage(
                    senderNumber,
                    {text: draft.notes.find(notes => notes.subject == text.split(' ')[1]).text},
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