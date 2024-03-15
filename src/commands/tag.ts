import { getCommands, isGroupMessage } from "../utils/helper";
import { Command, CommandExecuteProps } from "../utils/types";

const commands = getCommands("tags");

const execute = async ({ sock, data }: CommandExecuteProps) => {
    const {
        key: { remoteJid },
    } = data;

    const fromGroup = isGroupMessage(data);

    if (!fromGroup) {
        return await sock.sendMessage(remoteJid!, {
            text: "Anda tidak berada dalam grup!",
        });
    }

    const [command] = commands.filter(
        ({ command }) =>
            data.message?.conversation?.startsWith(`/tag ${command}`) ||
            data.message?.conversation?.startsWith(`@tag ${command}`) ||
            data.message?.conversation?.startsWith(`#tag ${command}`)
    );

    if (!command) {
        /**
         * TODO:
         * - Tag berdasarkan inisial
         */
    }

    // const db = database.collection("tag");
    // const tags = await db.find({ title: remoteJid! }).toArray();

    // const group = await sock.groupMetadata(remoteJid!);
};

export default {
    command: "tag",
    description: "Tag berdasarkan inisial",
    execute,
} as Command;
