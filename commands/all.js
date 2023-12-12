require('dotenv').config()

module.exports = {
    name: "all",
    description: "tag semua orang yang ada di grup",
    alias: ["all", "everyone"],
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database) {
        const isMessageFromGroup = senderNumber.includes("@g.us");
        
        if (!isMessageFromGroup) {
            await sock.sendMessage(
                senderNumber,
                { text: `Anda tidak sedang berada di grup`},
                { quoted: messages[0] },
                1000
            );
        } else {
            const jids = []
            let msg = ""
            var grup = await sock.groupMetadata(senderNumber);
            grup['participants'].map( usr => {
                    if (!usr.id.includes(process.env.nomor)) {
                        msg += '@' + usr.id.split('@')[0] + ' ';
                        jids.push(usr.id.replace('c.us', 's.whatsapp.net'));
                    }
                }
            );
            await sock.sendMessage(
                senderNumber,
                {text: msg, mentions: jids},
                {quoted: messages[0]},
                1000
            );
        }
    },
}
