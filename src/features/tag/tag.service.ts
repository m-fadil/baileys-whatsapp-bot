import { Group, IRole, IUser, Role, User } from '@model/model';
import { ErrorWithSendMessage, ErrorWithSendReaction } from '@utils/errors';
import { MergeType } from 'mongoose';
import { TagController } from './tag.controller';
import Help from '@features/help';
import { RoleController } from './role/role.controller';
import { WAChat } from '@utils/chat';

export class TagService {
    private roleController: RoleController;

    constructor(
        private readonly chat: WAChat,
        private readonly tagController: TagController,
    ) {
        this.roleController = this.tagController.roleController;
    }

    public async tagAddRole(inArgs: string[]): Promise<void> {
        const [roleName, ...inUsers] = inArgs;

        const role = await Role.findOne({ name: roleName });

        if (role) {
            throw new ErrorWithSendMessage(`role ${roleName} sudah ada`);
        }

        const group = await Group.findOneAndUpdate(
            { remoteJid: this.chat.parse.remoteJid },
            { remoteJid: this.chat.parse.remoteJid },
            { upsert: true, new: true },
        );

        //validasi users
        const validatedUsers = await this.validatingUsers(inUsers);

        const payload = validatedUsers.map((user) => ({
            updateOne: {
                filter: { remoteJid: user },
                update: { remoteJid: user },
                upsert: true,
            },
        }));
        await User.bulkWrite(payload);

        const userIDs = await User.find({ remoteJid: { $in: validatedUsers } }).select('_id');

        await Role.create({ name: roleName, groupID: group.id, userIDs });
        await this.chat.sendReaction();
    }

    async tagRemoveRole(inArgs: string[]): Promise<void> {
        const [roleName] = inArgs;

        const role = await Role.findOne({ name: roleName });
        if (!role) {
            throw new ErrorWithSendMessage(`role ${roleName} tidak ditemukan`);
        }

        await Role.deleteOne({ name: roleName });
        await this.chat.sendReaction();
    }

    async tagSendMembers(role: MergeType<IRole, { userIDs: IUser[] }>) {
        const mentions = role.userIDs.map((user) => user.remoteJid);

        if (mentions.length === 0) {
            throw new ErrorWithSendMessage('tidak ada anggota', 'warn');
        }

        const text = mentions.map((user) => '@' + user.split('@')[0]).join(' ');

        await this.chat.sendMessage({ text, mentions });
    }

    async tagAll() {
        const group = await this.chat.sock.groupMetadata(this.chat.parse.remoteJid);

        const mentions = group.participants.map((user) => user.id).filter((user) => !user.includes(process.env.BOT_NUMBER!));
        const text = mentions.map((user) => '@' + user.split('@')[0]).join(' ');

        await this.chat.sendMessage({ text, mentions });
    }

    async tagWithPrefix(inTags: string[]) {
        const tags = inTags.map((tag) => tag.substring(process.env.TAG_PREFIX!.length));

        if (tags.includes('all')) {
            await this.tagAll();
        }

        const roles = await Role.find({ name: { $in: tags } }).populate<{ userIDs: IUser[] }>('userIDs');

        roles.forEach(async (role) => await this.tagSendMembers(role));
    }

    public async validatingUsers(inUsers: string[]): Promise<string[]> {
        if (!inUsers.length) return [];

        const parseInUsers = inUsers.map((user) => `${user.substring(1)}@s.whatsapp.net`);
        const participant = await this.chat.sock
            .groupMetadata(this.chat.parse.remoteJid)
            .then((group) => group.participants.map((participant) => participant.id));
        const validatedUsers = parseInUsers.filter((user) => participant.includes(user));

        if (!validatedUsers.length) {
            throw new ErrorWithSendMessage('tidak ada user yang valid', 'warn');
        }

        return validatedUsers;
    }

    async tagHelp(inArgs: string[]): Promise<void> {
        const command = this.tagController.commands.get(inArgs[0]);

        if (!command) {
            throw new ErrorWithSendMessage(`command ${inArgs[0]} tidak ada`);
        }

        const help = this.chat.features.get('help') as Help;
        await help.helpCommand(command);
    }

    async tagEdit(inArgs: string[]): Promise<void> {
        /**
         * <role> [commands] <@at> <@at>
         * help add
         */
        const [inRole, inCommand] = inArgs.splice(0, 2);

        /**
         * mengecek agar command dan role ada isinya dan meloloskan help
         */
        if ((!inCommand && !inRole) || !inArgs.length) {
            /**
             * jika command dan role (sebagai help) dan tidak ada args
             * Ex: tag edit help <command>
             */
            if (inRole === 'help') {
                await this.roleController.roleService.roleHelp(inCommand);
                return;
            }

            throw new ErrorWithSendReaction();
        }

        /**
         * cek apakah role ditemukan
         */
        const role = await Role.findOne({ name: inRole });
        if (!role) {
            throw new Error(`role ${inRole} tidak ditemukan`);
        }

        /**
         * cek apakah command ditemukan setelah role berhasil ditemukan
         */
        const command = this.roleController.commands.get(inCommand);
        if (!command) {
            throw new ErrorWithSendMessage(`perintah ${inCommand} tidak ada`);
        }

        await command.execute(role, inArgs);
    }
}
