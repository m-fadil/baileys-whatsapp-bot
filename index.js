import "dotenv/config.js"
import { Boom } from "@hapi/boom"
import NodeCache from 'node-cache'
import { MongoClient } from "mongodb"
import Messages from "./handlers/messages.js"
import MAIN_LOGGER from './functions/logger.js'
import makeWASocket, { DisconnectReason, fetchLatestBaileysVersion, delay, makeCacheableSignalKeyStore, makeInMemoryStore, useMultiFileAuthState } from "@whiskeysockets/baileys"

const client = new MongoClient(process.env.uri);
const database = client.db("whatsapp-bot-baileys")

const logger = MAIN_LOGGER.child({})
logger.level = 'trace'

const useStore = !process.argv.includes('--no-store')
const msgRetryCounterCache = new NodeCache()

const store = useStore ? makeInMemoryStore({ logger }) : undefined
store?.readFromFile('./baileys_store_multi.json')
// save every 10s
setInterval(() => {
	store?.writeToFile('./baileys_store_multi.json')
}, 10_000)

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(process.env.folder);
    const { version, isLatest } = await fetchLatestBaileysVersion()
	console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)

    const sock = makeWASocket.default({
        version,
        logger,
        auth: {
			creds: state.creds,
			/** caching makes the store faster to send/recv messages */
			keys: makeCacheableSignalKeyStore(state.keys, logger),
		},
        printQRInTerminal: true,
        msgRetryCounterCache
    });

    store?.bind(sock.ev)

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
            Messages({ sock, messages: messages[0], database, delay })
        }
    })
}

connectToWhatsApp().catch((err) => {
    console.log(err);
});