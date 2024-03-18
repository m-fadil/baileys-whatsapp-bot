const Ping = {
    name: "ping",
    description: "ping",
    alias: ["p"],
    private: false,
    async execute(args) {
        const { sock, messages, sendTyping } = args

        await sendTyping(args).then(async () => {
            await sock.sendMessage(
                messages.key.remoteJid,
                { text: 'pong'},
                { quoted: messages }
            );
        })
    },
}

export default Ping