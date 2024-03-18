/**
 * 
 * @param {AnyMessageContent} msg 
 * @param {string} jid 
 */
const sendTyping = (args) => {
    return new Promise(async (resolve, reject) => {
        const { sock, remoteJid, delay } = args

        await sock.presenceSubscribe(remoteJid)
        await delay(500)

        await sock.sendPresenceUpdate('composing', remoteJid)
        await delay(2000)

        await sock.sendPresenceUpdate('paused', remoteJid)
        resolve()
    })
}

export default sendTyping