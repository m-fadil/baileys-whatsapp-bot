module.exports = {
    name: "inisial",
    description: "tag anggota",
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database, tagsCommand, coll_tags, tags, grup) {
        if (text.toLowerCase().split(' ')[2] == 'add') {
            tagsCommand.get("inisial_add").execute(...arguments)
        }
        else if (text.toLowerCase().split(' ')[2] == 'remove' || text.toLowerCase().split(' ')[2] == 'del') {
            tagsCommand.get("inisial_remove").execute(...arguments)
        }
        else if (text.split(' ').length == 2) {
            const role = (text.split(' ')[1])
            const tag = tags.roles.find(roles => roles.name == role)

            await sock.sendMessage(
                senderNumber,
                {text: tag.msg, mentions: tag.jids},
                {quoted: messages[0]},
                1000
            );
        }
        else {
            commands.get("reaction").execute(sock, messages, false)
        }
    }
}