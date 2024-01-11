import "dotenv/config.js"
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys"
import { Boom } from "@hapi/boom"
import fs from "fs"
import myServer from "./functions/server.js"
import { MongoClient } from "mongodb"

// require('express')().get('/', (_, res) => res.send('Uptime!')).listen(8080);
const client = new MongoClient(process.env.uri);
const database = client.db("whatsapp-bot-baileys")

const commands = new Map();
const files = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'))
for (const file of files) {
	const { default: command } = await import(`./commands/${file}`)
	commands.set(command.name, command)
}

let running = false

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(process.env.folder);
    
    const sock = makeWASocket.default({
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
            if (!running){
                myServer.execute(sock)
                running = true
            }
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
                let ada = false
                for await (let c of commands) {
                    if (c[1].alias.includes(command) && !["ai", "reaction"].includes(command)) {
                        commands.get(c[1].name).execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database)
                        ada = true
                        break
                    }
                }
                if (!ada) commands.get("reaction").execute(sock, messages, false)
                await sock.readMessages([messages[0].key])
            }
            else if (incomingMessages.includes(process.env.tag)) {
                incomingMessages.split(" ").forEach(tag => {
                    if (tag.includes(process.env.tag)) {
                        var text = `tag ${tag.substring(process.env.tag.length)}`
                        commands.get('tag').execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database)
                    }
                })
                await sock.readMessages([messages[0].key])
            }
            else if (incomingMessages.startsWith(process.env.ai) && incomingMessages.length > 1) {
                var text = incomingMessages.substring(process.env.ai.length)
                commands.get('AI').execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database)
                await sock.readMessages([messages[0].key])
            }
        }
    })
}

connectToWhatsApp().catch((err) => {
    console.log("Ada Error: " + err);
});