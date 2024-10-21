import makeWASocket, {
    DisconnectReason,
    fetchLatestBaileysVersion,
    useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import NodeCache from 'node-cache';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import { WAChat } from '@utils/chat';
import 'database/db';

const msgRetryCounterCache = new NodeCache();

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('baileys/baileys_auth_info');
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
        msgRetryCounterCache,
        generateHighQualityLinkPreview: true,
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('opened connection');
        }
    });

    sock.ev.on('messages.upsert', async ({ type, messages }) => {
        if (type === 'notify' && !messages[0].key.fromMe) {
            try {
                if (typeof messages[0].key.remoteJid !== 'string') {
                    throw new Error('Invalid remoteJid');
                }

                new WAChat(sock, messages[0]).handle();
            } catch (err) {
                console.log(err);
            }
        }
    });

    sock.ev.on('creds.update', async () => await saveCreds());
}

connectToWhatsApp().catch((error) => console.log(error));
