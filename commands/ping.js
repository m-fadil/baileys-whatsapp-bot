const Ping = {
    name: "ping",
    description: "ping",
    alias: ["ping", "p"],
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database) {
        // const db = database.collection("notes")
        // await db.deleteMany({})
        await sock.sendMessage(
            senderNumber,
            { text: `pong`},
            { quoted: messages[0] },
            1000
        );
    },
}

export default Ping