const Ping = {
    name: "ping",
    description: "ping",
    alias: ["p"],
    private: false,
    async execute(args) {
        const { sock, messages } = args

        await sock.sendMessage(
            messages.key.remoteJid,
            { text: `pong`},
            { quoted: messages },
            1000
        );
    },
}

export default Ping