import { WAChat } from '@utils/chat';
import { IFeature } from '@utils/interfaces';

class Ping implements IFeature {
    name = 'ping';
    desc = 'answer pong';
    alias = ['p'];
    usage = ['ping'];

    constructor(private readonly chat: WAChat) {}

    async execute(): Promise<void> {
        await this.chat.sendMessage({ text: 'pong' });
    }
}

export default Ping;
