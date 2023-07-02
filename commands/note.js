const Enmap = require("enmap")
const fs = require('fs');

module.exports = {
    name: "note",
    description: "menyimpan catatan",
    alias: ["note"],
    async execute(sock, messages, commands, senderNumber, text, quotedPesan) {
        const note = new Map();
        fs.readdirSync(`./commands/note`).filter(file => file.endsWith('.js')).forEach(file => {
            const command = require(`./note/${file}`)
            note.set(command.name, command)
        });
        
        if (senderNumber.includes("@g.us")) {
            var grup = await sock.groupMetadata(senderNumber);
            var db = new Enmap({name: `${process.env.enmap}${grup.id}`, dataDir: './database'})
        }
        else {
            var db = new Enmap({name: `${process.env.enmap}${senderNumber}`, dataDir: './database'})
        }

        if (db.get('note') == undefined) {
            db.set('note', [])
        }
        if (text.split(' ').length == 1) {
            if (db.get('note').length == 0) var msg = 'belum ada note yang ditambahkan'
            else var msg = db.get('note').join('\n')
            await sock.sendMessage(
                senderNumber,
                {text: msg},
                {quoted: messages[0]},
                1000
            );
        }
        else if (text.toLowerCase().split(' ')[1] == 'add') {
            note.get("add_note").execute(...arguments, db)
        }
        else if (text.toLowerCase().split(' ')[1] == 'remove' || text.toLowerCase().split(' ')[1] == 'del') {
            note.get("remove_note").execute(...arguments, db)
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