module.exports = {
    name: "ping",
    description: "ping",
    alias: ["ping", "p"],
    async execute(sock, messages, commands, senderNumber, text, quotedPesan) {
        await sock.sendMessage(
            senderNumber,
            { text: `pong`},
            { quoted: messages[0] },
            1000
        );
    },
}
