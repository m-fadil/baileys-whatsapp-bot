import { Boom } from "@hapi/boom";
import makeWASocket, {
    DisconnectReason,
    UserFacingSocketConfig,
    useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { Command } from "../utils/types";
import { getCommands } from "../utils/helper";

export class Baileys {
    folder!: string;
    sock!: ReturnType<typeof makeWASocket>;
    commands!: Command[];

    constructor(folder: string) {
        this.folder = folder;
        this.commands = getCommands();
    }

    async connect() {
        const { state, saveCreds } = await useMultiFileAuthState(this.folder);

        this.sock = makeWASocket({
            auth: state,
            printQRInTerminal: true,
        } as UserFacingSocketConfig);

        this.setConnectionUpdateHandler();
        this.setMessageUpsertHandler();

        this.sock.ev.on("creds.update", saveCreds);
    }

    setConnectionUpdateHandler = () => {
        this.sock.ev.on(
            "connection.update",
            ({ connection, lastDisconnect }): void => {
                if (connection === "close") {
                    const shouldReconnect =
                        (lastDisconnect?.error as Boom)?.output?.statusCode !==
                        DisconnectReason.loggedOut;

                    console.error(`Error: ${lastDisconnect?.error?.message}`);

                    if (shouldReconnect) {
                        this.connect();
                    }
                } else if (connection === "open") {
                    console.log(`Connected!`);
                }
            }
        );
    };

    setMessageUpsertHandler = (): void => {
        this.sock.ev.on("messages.upsert", ({ messages, type }): void => {
            const [
                {
                    key: { fromMe },
                    message,
                },
            ] = messages;

            const isNotify = type === "notify";

            if (isNotify) {
                const [command] = this.commands.filter(
                    ({ command }) =>
                        message?.conversation?.startsWith(`/${command}`) ||
                        message?.conversation?.startsWith(`@${command}`) ||
                        message?.conversation?.startsWith(`#${command}`)
                );

                command?.execute({
                    sock: this.sock,
                    data: messages[0],
                });
            }
        });
    };
}
