const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter')
module.exports = {
    name: "sticker",
    description: "membuat sticker dari gambar",
    alias: ["sticker", "stiker", "s"],
    async execute(sock, messages, commands, senderNumber, text, quotedPesan) {
        try {
            if (messages[0].message.hasOwnProperty('imageMessage') || messages[0].message.extendedTextMessage.contextInfo.hasOwnProperty('quotedMessage')) {
                let rdm = Math.floor(Math.random() * 99999).toString()
                let rawId = '0'.repeat(5-rdm.length)+rdm
                let judul = ''
                if (messages[0].message.hasOwnProperty('imageMessage')) {
                    var m = messages[0]
                }
                else if (quotedPesan) {
                    var m = { 
                        key : {
                            remoteJid: messages[0].key.remoteJid,
                            fromMe: messages[0].key.fromMe,
                            id: messages[0].message.extendedTextMessage.contextInfo.stanzaId,
                            participant: messages[0].message.extendedTextMessage.contextInfo.participant
                        },
                        message: {
                            imageMessage: messages[0].message.extendedTextMessage.contextInfo.quotedMessage.imageMessage
                        }
                    }
                }
                if (text.split(' ')[1] != undefined) {
                    judul = text.split(' ')[1]
                }
                let pembuat = messages[0].pushName
                if (text.split(' ')[2] != undefined) {
                    pembuat = text.split(' ')[2]
                }
                const image = await downloadMediaMessage(
                    m,
                    'buffer',
                    { },
                )
                const sticker = new Sticker(image, {
                    pack: judul,
                    author: pembuat,
                    type: StickerTypes.FULL,
                    categories: ['🤩', '🎉'],
                    id: rawId,
                    quality: 50,
                    background: {
                        "r": 255,
                        "g": 255,
                        "b": 255,
                        "alpha": 0
                    }
                })
                await sock.sendMessage(
                    senderNumber,
                    await sticker.toMessage(),
                    {quoted: messages[0]},
                    1000
                );
            }
        }
        catch (error) {
            commands.get("reaction").execute(sock, messages, false)
        }
    }
}