async function Reaction(args, benar) {
    const { sock, messages, remoteJid } = args

    async function sendBenar() {
        const reactionMessage = {
            react: {
                text: "👍",
                key: messages.key
            }
        }
        await sock.sendMessage(
            remoteJid,
            reactionMessage,
            1000
        );
    }
    async function sendSalah() {
        const reactionSalah = {
            react: {
                text: "👎",
                key: messages.key
            }
        }
        await sock.sendMessage(
            remoteJid,
            reactionSalah,
            1000
        );
    }
    benar ? sendBenar() : sendSalah()
}

export default Reaction