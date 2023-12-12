module.exports = {
    name: "ping",
    description: "ping",
    alias: ["ping", "p"],
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database) {
        const tags = database.collection("tags")
        await tags.deleteMany({})
        await sock.sendMessage(
            senderNumber,
            { text: `pong`},
            { quoted: messages[0] },
            1000
        );
    },
}
