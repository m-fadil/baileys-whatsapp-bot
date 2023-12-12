const fs = require('fs');

module.exports = {
    name: "tag",
    description: "menampilkan tags",
    alias: ["tag", "t"],
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database) {
        const tagsCommand = new Map();
        fs.readdirSync(`./commands/tags`).filter(file => file.endsWith('.js')).forEach(file => {
            const command = require(`./tags/${file}`)
            tagsCommand.set(command.name, command)
        });

        const isMessageFromGroup = senderNumber.includes("@g.us");
        if (isMessageFromGroup) {
            const grup = await sock.groupMetadata(senderNumber)
            const coll_tags = database.collection("tags")
            const tags = await coll_tags.findOne({"title": grup.id}).then(async (result) => {
                if (!result) {
                    const data = {
                        title: grup.id,
                        roles: []
                    }
                    await coll_tags.insertOne(data)
                }
                return await coll_tags.findOne({"title": grup.id})
            })
            if (text.split(' ').length == 1) {
                const msg = tags.roles.map(role => role.name).join("\n")
                await sock.sendMessage(
                    senderNumber,
                    {text: msg},
                    {quoted: messages[0]},
                    1000
                );
            }
            else if (text.toLowerCase().split(' ')[1] == 'add') {
                tagsCommand.get('add_inisial').execute(...arguments, coll_tags, tags, grup)
            }
            else if (text.toLowerCase().split(' ')[1] == 'edit') {
                tagsCommand.get('edit_inisial').execute(...arguments, coll_tags, tags)
            }
            else if (text.toLowerCase().split(' ')[1] == 'remove' || text.toLowerCase().split(' ')[1] == 'del') {
                tagsCommand.get('remove_inisial').execute(...arguments, coll_tags, tags)
            }
            else if(tags.roles.find(roles => roles.name == text.split(' ')[1])) {
                tagsCommand.get('inisial').execute(...arguments, tagsCommand, coll_tags, tags, grup)
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
