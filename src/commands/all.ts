import { isGroupMessage } from "../utils/helper";
import { Command, CommandExecuteProps } from "../utils/types";

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

    const group = await sock.groupMetadata(remoteJid!);
    const participants = group.participants.map(({ id }) => id);

    await sock.sendMessage(
        remoteJid!,
        {
            text: participants.map((id) => `@${id.split("@")[0]}`).join(" "),
            mentions: participants,
        },
        {
            quoted: data,
        }
    );
};

export default {
    command: "all",
    description: "Tag semua orang",
    execute,
} as Command;
