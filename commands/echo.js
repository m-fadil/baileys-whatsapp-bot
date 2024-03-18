const Echo = {
    name: "echo",
    description: "mengembalikan value yang dimasukkan",
    alias: ["print", "ec"],
    async execute(args) {
        const { sock, messages, remoteJid, pesan, sendTyping } = args
        const [ _, ...kata ] = pesan.split(' ')

        await sendTyping(args).then(async () => {
            await sock.sendMessage(
                remoteJid,
                { text: kata.join(' ')},
                { quoted: messages }
            );
        })
    }
}

export default Echo