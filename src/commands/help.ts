import { Command, CommandExecuteProps } from "../utils/types";

const execute = async ({ sock, data }: CommandExecuteProps) => {
    await sock.sendMessage(
        data.key.remoteJid!,
        {
            text: "Hello World!",
        },
        {
            quoted: data,
        }
    );
};

export default {
    command: "help",
    description: "List semua commands",
    execute,
} as Command;
