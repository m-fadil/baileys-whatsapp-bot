import { ErrorWithSendMessage, WAError } from '@utils/errors';
import { TagController } from '@features/tag/tag.controller';
import { WAChat } from '@utils/chat';

export class HandleError {
    constructor(private readonly chat: WAChat) {}

    async exe(inError: any) {
        if (!(inError instanceof Error)) return;

        const error: WAError = JSON.parse(inError.message);

        if (error.type) {
            await this.chat.sendReaction(error.type);
        }

        if (error.name === 'send_message' && error.message) {
            await this.chat.sendMessage({ text: error.message });
        }
    }
}

export class HandleIsCommand {
    private readonly tagController: TagController;

    constructor(private readonly chat: WAChat) {
        this.tagController = new TagController(this.chat);
    }

    async exe(inArgs: string[]): Promise<void> {
        const [inWord, ...inRest] = inArgs;

        if (!inWord) {
            return;
        }

        const allCommands = [...new Set([...this.chat.features.keys(), ...this.tagController.commands.keys()])];

        allCommands.push('#', 'all');

        if (allCommands.includes(inWord)) {
            throw new ErrorWithSendMessage(`penamaan ${inWord} dilarang`);
        }
    }
}
