const Ping = {
    name: "ping",
    description: "ping",
    alias: ["p"],
    async execute(args) {
        const { messages, sendWithTyping } = args

        await sendWithTyping(
            args,
            { text: 'pong'},
            { quoted: messages }
        )
    },
}

export default Ping