import 'dotenv/config';
import { WAChat } from '@utils/chat';

export class HandleParse {
    private _remoteJid: string | undefined | null;
    private _sender: string | undefined | null;
    private _fromGroup: boolean;

    constructor(private readonly chat: WAChat) {
        this._remoteJid = this.chat.messages.key.remoteJid;
        this._sender = this.chat.messages.key.participant || this._remoteJid;
        this._fromGroup = this.remoteJid.endsWith('g.us');
    }

    public get remoteJid(): string {
        if (!this._remoteJid) throw new Error('remoteJid not parsed yet');
        return this._remoteJid;
    }

    public get sender(): string {
        if (!this._sender) throw new Error('Sender not parsed yet');
        return this._sender;
    }

    public get fromGroup(): boolean {
        return this._fromGroup;
    }
}
