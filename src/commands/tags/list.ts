import { Command, CommandExecuteProps } from "../../utils/types";

const execute = async ({ sock, data }: CommandExecuteProps) => {
    await sock.sendMessage(data.key.remoteJid!, {
        text: "Tambah tag",
    });
};

export default {
    command: "list",
    description: "Menampilkan semua inisial",
    execute,
} as Command;
