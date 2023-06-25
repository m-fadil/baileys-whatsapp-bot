module.exports = {
    name: "reaction",
    description: "memberikan reaction",
    alias: ["reaction", "r"],
    async execute(sock, messages, benar) {
        const senderNumber = messages[0].key.remoteJid;
        async function sendBenar() {
            const reactionMessage = {
                react: {
                    text: "👍",
                    key: messages[0].key
                }
            }
            await sock.sendMessage(
                senderNumber,
                reactionMessage,
                1000
            );
        }
        async function sendSalah() {
            const reactionSalah = {
                react: {
                    text: "👎",
                    key: messages[0].key
                }
            }
            await sock.sendMessage(
                senderNumber,
                reactionSalah,
                1000
            );
        }
        benar ? sendBenar() : sendSalah()
    },
}
