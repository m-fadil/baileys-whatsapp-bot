import { AnyMessageContent, delay, MiscMessageGenerationOptions } from '@whiskeysockets/baileys';
import Chance = require('chance');
import { WAChat } from '@utils/chat';

export interface CustMiscMessageGenerationOptions extends MiscMessageGenerationOptions {
    isQuoted?: boolean;
}

export type ReactionType = 'ok' | 'bad' | 'warn' | 'stop' | 'cross' | 'check' | 'EQ';

export class HandleSend {
    private chance: Chance.Chance;

    constructor(private readonly chat: WAChat) {
        this.chance = new Chance();
    }

    async message(content: AnyMessageContent, custOpts?: CustMiscMessageGenerationOptions) {
        const { isQuoted, ...options } = {
            quoted:
                custOpts?.isQuoted === undefined
                    ? this.chat.messages
                    : custOpts.isQuoted
                      ? this.chat.messages
                      : undefined,
            ...custOpts,
        };

        await this.chat.sock.presenceSubscribe(this.chat.parse.remoteJid);
        await delay(500);

        await this.chat.sock.sendPresenceUpdate('composing', this.chat.parse.remoteJid);
        await delay(this.chance.integer({ min: 1000, max: 2000 }));

        await this.chat.sock.sendPresenceUpdate('paused', this.chat.parse.remoteJid);

        await this.chat.sock.sendMessage(this.chat.parse.remoteJid, content, options);
    }

    async reaction(type: ReactionType = 'ok') {
        const emote = { ok: '👍', bad: '👎', warn: '⚠️', stop: '⛔', cross: '❌', check: '✔️', EQ: '⁉️' }[type];

        const reactionMessage = {
            react: {
                text: emote,
                key: this.chat.messages.key,
            },
        };
        await this.chat.sock.sendMessage(this.chat.parse.remoteJid, reactionMessage);
    }
}
