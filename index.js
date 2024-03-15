import "dotenv/config.js"
import { Boom } from "@hapi/boom"
import { MongoClient } from "mongodb"
import Messages from "./handlers/messages.js"
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys"

const client = new MongoClient(process.env.uri);
const database = client.db("whatsapp-bot-baileys")

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(process.env.folder);
    
    const sock = makeWASocket.default({
        auth: state,
        printQRInTerminal: true
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
            Messages({ sock, messages: messages[0], database })
        }
    })
}

connectToWhatsApp().catch((err) => {
    console.log(err);
});