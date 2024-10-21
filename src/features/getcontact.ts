import { ErrorWithSendMessage } from '@utils/errors';
import { IFeature } from '@utils/interfaces';
import { ApiGetContact } from './getcontact/get-contact';
import { WAChat } from '@utils/chat';

class GetContact implements IFeature {
    name = 'getcontact';
    desc = 'mendapatkan informasi kontak';
    alias = ['gc'];
    usage = ['getcontact <nomor>'];

    private readonly getContact: ApiGetContact;

    constructor(private readonly chat: WAChat) {
        this.getContact = new ApiGetContact(process.env.GETCONTACT_TOKEN!, process.env.GETCONTACT_KEY!);
    }

    async execute(inArgs: string[]): Promise<void> {
        const [number] = inArgs;

        if (!number) {
            this.chat.sendReaction('cross');
        }

        try {
            const data = await this.getContact.checkNumber(number);
            const text = data.tags.join('\n');

            await this.chat.sendMessage({ text: text });
        } catch (err: Error | any) {
            const error = JSON.parse(err.message);
            throw new ErrorWithSendMessage(error.meta.errorMessage, 'warn');
        }
    }
}

export default GetContact;
