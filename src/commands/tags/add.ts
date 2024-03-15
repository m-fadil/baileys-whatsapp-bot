import { Command, CommandExecuteProps } from "../../utils/types";

const execute = async ({ sock, data }: CommandExecuteProps) => {
    await sock.sendMessage(data.key.remoteJid!, {
        text: "Tambah inisial",
    });
};

export default {
    command: "add",
    description: "Tambahkan inisial baru",
    execute,
} as Command;
