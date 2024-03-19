const Ping = {
    name: "tes",
    description: "testing",
    alias: [],
    private: false,
    async execute(args) {
        const { sock, messages, sendWithTyping } = args

        await sendTyping(args).then(async () => {
            await sock.sendMessage(
                messages.key.remoteJid,
                {text: "https://www.instagram.com/p/C4kkw19pPIE/?igsh=Z2RiNTVsZzMxYWYw"}
            );
        })
    },
}

export default Ping