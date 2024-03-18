async function Reaction(args, benar) {
    const { sock, messages, remoteJid } = args
    const emote = benar ? '👍' : '👎'

    const reactionMessage = {
        react: {
            text: emote,
            key: messages.key
        }
    }
    await sock.sendMessage(
        remoteJid,
        reactionMessage,
        1000
    );
}

export default Reaction