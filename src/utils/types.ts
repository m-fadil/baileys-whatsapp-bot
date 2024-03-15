import makeWASocket, { WAMessage } from "@whiskeysockets/baileys";

export interface CommandExecuteProps {
    sock: ReturnType<typeof makeWASocket>;
    data: WAMessage;
}

export interface Command {
    command: string;
    description: string;
    execute: (args: CommandExecuteProps) => void;
}
