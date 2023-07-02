require('dotenv').config()
const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const fs = require('fs');
const thisAPI = require("./functions/server.js")

// require("http").createServer((_, res) => res.end("Uptime!")).listen(8080)

const commands = new Map();
const files = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'))
for (const file of files) {
	const command = require(`./commands/${file}`)
	commands.set(command.name, command)
}

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(process.env.folder);
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        defaultQuertTimeoutMs: undefined
    });

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log("Koneksi terputus karena ", lastDisconnect.error, ", hubugkan kembali!", shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        }
        else if (connection === "open") {
            console.log("Koneksi tersambung!")
        }
    });
    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        if (type === "notify" && !messages[0].key.fromMe) {
            const senderNumber = messages[0].key.remoteJid;
            const nomorPengirim = (messages[0].key.participant == undefined) ? messages[0].key.remoteJid.split('@')[0] : messages[0].key.participant.split('@')[0]
            let incomingMessages = messages[0].message.conversation;
            let quotedPesan = false
            try {
                if (messages[0].message.hasOwnProperty('extendedTextMessage')) {
                    incomingMessages = messages[0].message.extendedTextMessage.text;
                    quotedPesan = messages[0].message.extendedTextMessage.contextInfo.hasOwnProperty('quotedMessage')
                }
                else if (messages[0].message.hasOwnProperty('imageMessage')) {
                    incomingMessages = messages[0].message.imageMessage.caption;
                }
            } catch (err) {
            }

            if (incomingMessages.startsWith(process.env.command)) {
                let text = incomingMessages.substring(process.env.command.length)
                let command = text.toLowerCase().split(' ')[0]
                let ident = ['@me', '@myself', '@saya', '@aku']
                ident.forEach(val => {
                    if (text.includes(val)) {
                        text = text.split(val).join(`@${nomorPengirim}`)
                    }
                })

                commands.forEach(async c => {
                    if (c.alias.includes(command)) {
                        commands.get(c.name).execute(sock, messages, commands, senderNumber, text, quotedPesan)
                    }
                })
                await sock.readMessages([messages[0].key])
            }
            else if (incomingMessages.includes(process.env.tag)) {
                incomingMessages.split(" ").forEach(tag => {
                    if (tag.includes(process.env.tag)) {
                        var text = `tag ${tag.substring(process.env.tag.length)}`
                        commands.get('tag').execute(sock, messages, commands, senderNumber, text, quotedPesan)
                    }
                })
                await sock.readMessages([messages[0].key])
            }
            else if (incomingMessages.startsWith(process.env.ai) && incomingMessages.length > 1) {
                var text = incomingMessages.substring(process.env.ai.length)
                commands.get('AI').execute(sock, messages, commands, senderNumber, text, quotedPesan)
                await sock.readMessages([messages[0].key])
            }
        }
    })
    thisAPI.execute(sock)
}

connectToWhatsApp().catch((err) => {
    console.log("Ada Error: " + err);
});