import { User, IRole, Role } from '@model/model';
import { TagController } from '../tag.controller';
import { RoleController } from './role.controller';
import { ErrorWithSendMessage, ErrorWithSendReaction } from '@utils/errors';
import Help from '@features/help';
import { WAChat } from '@utils/chat';

export class RoleService {
    constructor(
        private readonly chat: WAChat,
        private readonly tagController: TagController,
        private readonly roleController: RoleController,
    ) {}

    async roleAddUsers(role: IRole, inUsers: string[]): Promise<void> {
        const validatedUsers = await this.tagController.tagService.validatingUsers(inUsers);
        const payload = validatedUsers.map((user) => ({
            updateOne: {
                filter: { remoteJid: user },
                update: { remoteJid: user },
                upsert: true,
            },
        }));
        await User.bulkWrite(payload);

        const userIDs = await User.find({ remoteJid: { $in: validatedUsers } }).select('_id');

        await role.updateOne({ $addToSet: { userIDs: { $each: userIDs } } }).exec();
        await this.chat.sendReaction();
    }

    async roleRemoveUsers(role: IRole, inUsers: string[]): Promise<void> {
        const users = inUsers.map((user) => `${user.substring(1)}@s.whatsapp.net`);
        const userIDs = (await User.find({ remoteJid: { $in: users } }).select('_id')).map((user) => user.id);
        const roleUserIDs = role.userIDs.map((user) => user.toString());

        const validatedUsers = userIDs.filter((user) => roleUserIDs.includes(user));
        if (!validatedUsers.length) {
            throw new ErrorWithSendReaction('EQ');
        }

        await role.updateOne({ $pull: { userIDs: { $in: userIDs } } }).exec();
        await this.chat.sendReaction();
    }

    async roleRename(role: IRole, inArgs: string[]): Promise<void> {
        const [newRoleName] = inArgs;

        const newRole = await Role.findOne({ name: newRoleName });
        if (newRole) {
            throw new ErrorWithSendMessage(`role ${newRoleName} sudah ada`);
        }

        await role.updateOne({ name: newRoleName }).exec();
        await this.chat.sendReaction();
    }

    async roleHelp(inCommand: string): Promise<void> {
        const command = this.roleController.commands.get(inCommand);

        if (!command) {
            throw new ErrorWithSendMessage(`command ${inCommand} tidak ada`);
        }

        const help = this.chat.features.get('help') as Help;
        await help.helpCommand(command);
    }
}
