import { WAMessage } from "@whiskeysockets/baileys";
import { Command } from "./types";
import fs from "fs";
import path from "path";

export const isGroupMessage = ({
    key: { participant, remoteJid },
}: WAMessage) => {
    return participant !== undefined && remoteJid?.endsWith("@g.us");
};

export const getCommands = (folder: string = ""): Command[] => {
    const commands: Command[] = [];
    const commandsFolder = process.env.COMMANDS_FOLDER!;
    const location = path.join(__dirname, `../${commandsFolder}/`, folder);

    const files = fs
        .readdirSync(`src/${commandsFolder}/${folder}`)
        .filter((name) => name.endsWith(".ts"));

    files.map((file) => {
        const { default: command } = require(path.join(
            location,
            file.replace(".ts", ".js")
        ));

        commands.push(command);
    });

    return commands;
};
