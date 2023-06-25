const Enmap = require("enmap")
const fs = require('fs');

module.exports = {
    name: "tag",
    description: "menampilkan tags",
    alias: ["tag", "t"],
    async execute(sock, messages, commands, senderNumber, text, quotedPesan) {
        const tags = new Map();
        fs.readdirSync(`./commands/tags`).filter(file => file.endsWith('.js')).forEach(file => {
            const command = require(`./tags/${file}`)
            tags.set(command.name, command)
        });

        const isMessageFromGroup = senderNumber.includes("@g.us");
        if (isMessageFromGroup) {
            var grup = await sock.groupMetadata(senderNumber);
            var db = new Enmap({name: `${process.env.enmap}${grup.id}`, dataDir: './database'})

            if (db.get('tag') == undefined) {
                db.set('tag', [])
            }
            if (text.split(' ').length == 1) {
                if (!db.get('tag').includes('all')) {
                    const jids = []
                    let msg = ""
                    grup["participants"].map(
                        async (usr) => {
                            if (!usr.id.includes(process.env.nomor)) {
                                msg += "@" + usr.id.split("@")[0] + " "
                                jids.push(usr.id.replace("c.us", "s.whatsapp.net"))
                            }
                        }
                    )
                    db.push('tag', 'all')
                    db.set('all', {jids: jids, msg: msg})
                }
                var msg = db.get('tag').join('\n')
                await sock.sendMessage(
                    senderNumber,
                    {text: msg},
                    {quoted: messages[0]},
                    1000
                );
            }
            else if (text.toLowerCase().split(' ')[1] == 'add') {
                tags.get('add_inisial').execute(...arguments, db)
            }
            else if (text.toLowerCase().split(' ')[1] == 'edit') {
                tags.get('edit_inisial').execute(...arguments, db)
            }
            else if (text.toLowerCase().split(' ')[1] == 'remove' || text.toLowerCase().split(' ')[1] == 'del') {
                tags.get('remove_inisial').execute(...arguments, db)
            }
            else if(db.get('tag').includes(text.split(' ')[1])) {
                tags.get('inisial').execute(...arguments, db, tags)
            }
        } 
        else {
            await sock.sendMessage(
                senderNumber,
                { text: `Anda tidak sedang berada di grup`},
                { quoted: messages[0] },
                1000
            );
        }
    },
}
