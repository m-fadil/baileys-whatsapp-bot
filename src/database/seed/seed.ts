import '../db';
import mongoose from 'mongoose';
import { User, Role, Group } from '../model/model';

const databases = [
    {
        judul: '120363059665296064@g.us',
        raw: [
            { name: 'all', jids: ['6289603119611@s.whatsapp.net'], msg: '@6289603119611 ' },
            {
                name: 'cabi',
                jids: ['628882021766@s.whatsapp.net', '6289603119611@s.whatsapp.net'],
                msg: '@628882021766 @6289603119611 ',
            },
            { name: 'sabi', jids: ['628882021766@s.whatsapp.net'], msg: '@628882021766' },
        ],
    },
    {
        judul: '120363040147488316@g.us',
        raw: [
            {
                name: 'ARK',
                jids: ['6282166190631@s.whatsapp.net', '6289666091437@s.whatsapp.net', '6289603119611@s.whatsapp.net'],
                msg: '@6282166190631 @6289666091437 @6289603119611 ',
            },
            {
                name: 'manhwa-reader',
                jids: [
                    '6287729957400@s.whatsapp.net',
                    '62895411052887@s.whatsapp.net',
                    '6282121762181@s.whatsapp.net',
                    '6282141691898@s.whatsapp.net',
                    '6282234003100@s.whatsapp.net',
                ],
                msg: '@6287729957400 @62895411052887 @6282121762181 @6282141691898 @6282234003100 ',
            },
            {
                name: 'bengkok',
                jids: [
                    '6282121762181@s.whatsapp.net',
                    '62895411052887@s.whatsapp.net',
                    '6289666091437@s.whatsapp.net',
                    '62818291202@s.whatsapp.net',
                ],
                msg: '@6282121762181 @62895411052887 @6289666091437 @62818291202 ',
            },
            {
                name: 'siscer',
                jids: [
                    '6282166190631@s.whatsapp.net',
                    '6282284703818@s.whatsapp.net',
                    '6282234003100@s.whatsapp.net',
                    '6282338798413@s.whatsapp.net',
                    '6289603119611@s.whatsapp.net',
                ],
                msg: '@6282166190631 @6282284703818 @6282234003100 @6282338798413 @6289603119611 ',
            },
            {
                name: 'BD',
                jids: [
                    '6282166190631@s.whatsapp.net',
                    '6282284703818@s.whatsapp.net',
                    '6287729957400@s.whatsapp.net',
                    '6289603119611@s.whatsapp.net',
                ],
                msg: '@6282166190631 @6282284703818 @6287729957400 @6289603119611 ',
            },
            {
                name: 'shoujo-reader',
                jids: ['6282141691898@s.whatsapp.net', '6282121762181@s.whatsapp.net', '6282284703818@s.whatsapp.net'],
                msg: '@6282141691898 @6282121762181 @6282284703818 ',
            },
            {
                name: 'all',
                jids: [
                    '6281313557991@s.whatsapp.net',
                    '6281324186726@s.whatsapp.net',
                    '62818291202@s.whatsapp.net',
                    '6282121762181@s.whatsapp.net',
                    '6282141691898@s.whatsapp.net',
                    '6282166190631@s.whatsapp.net',
                    '6282234003100@s.whatsapp.net',
                    '6282284703818@s.whatsapp.net',
                    '6282338798413@s.whatsapp.net',
                    '6285156615396@s.whatsapp.net',
                    '6287729957400@s.whatsapp.net',
                    '62895411052887@s.whatsapp.net',
                    '6289603119611@s.whatsapp.net',
                    '6289666091437@s.whatsapp.net',
                    '6281260669090@s.whatsapp.net',
                ],
                msg: '@6281313557991 @6281324186726 @62818291202 @6282121762181 @6282141691898 @6282166190631 @6282234003100 @6282284703818 @6282338798413 @6285156615396 @6287729957400 @62895411052887 @6289603119611 @6289666091437 @6281260669090 ',
            },
            {
                name: 'codm',
                jids: [
                    '6281324186726@s.whatsapp.net',
                    '6287729957400@s.whatsapp.net',
                    '62895411052887@s.whatsapp.net',
                    '6289603119611@s.whatsapp.net',
                ],
                msg: '@6281324186726 @6287729957400 @62895411052887 @6289603119611 ',
            },
            {
                name: 'tft',
                jids: [
                    '6289603119611@s.whatsapp.net',
                    '6282141691898@s.whatsapp.net',
                    '62895411052887@s.whatsapp.net',
                    '6282284703818@s.whatsapp.net',
                ],
                msg: '@6289603119611 @6282141691898 @62895411052887 @6282284703818 ',
            },
            {
                name: 'wr',
                jids: [
                    '6282141691898@s.whatsapp.net',
                    '6289603119611@s.whatsapp.net',
                    '6287729957400@s.whatsapp.net',
                    '6282284703818@s.whatsapp.net',
                    '6281324186726@s.whatsapp.net',
                    '6282234003100@s.whatsapp.net',
                ],
                msg: '@6282141691898 @6289603119611 @6287729957400 @6282284703818 @6281324186726 @6282234003100 ',
            },
            {
                name: 'sot',
                jids: [
                    '6287729957400@s.whatsapp.net',
                    '6282284703818@s.whatsapp.net',
                    '62818291202@s.whatsapp.net',
                    '6289603119611@s.whatsapp.net',
                ],
                msg: '@6287729957400 @6282284703818 @62818291202 @6289603119611 ',
            },
            {
                name: 'Siscer',
                jids: [
                    '6282284703818@s.whatsapp.net',
                    '6289603119611@s.whatsapp.net',
                    '6282338798413@s.whatsapp.net',
                    '6282234003100@s.whatsapp.net',
                    '6282166190631@s.whatsapp.net',
                ],
                msg: '@6282284703818 @6289603119611 @6282338798413 @6282234003100 @6282166190631 ',
            },
            { name: 'gay', jids: ['6285156615396@s.whatsapp.net'], msg: '@6285156615396 ' },
            {
                name: 'balls',
                jids: [
                    '6282141691898@s.whatsapp.net',
                    '6281324186726@s.whatsapp.net',
                    '62895411052887@s.whatsapp.net',
                    '6282338798413@s.whatsapp.net',
                    '6281313557991@s.whatsapp.net',
                    '6281260669090@s.whatsapp.net',
                ],
                msg: '@6282141691898 @6281324186726 @62895411052887 @6282338798413 @6281313557991 @6281260669090',
            },
            {
                name: 'ml',
                jids: [
                    '6282141691898@s.whatsapp.net',
                    '6287729957400@s.whatsapp.net',
                    '6282284703818@s.whatsapp.net',
                    '6289603119611@s.whatsapp.net',
                    '62895411052887@s.whatsapp.net',
                    '6281324186726@s.whatsapp.net',
                    '6281260669090@s.whatsapp.net',
                    '6281313557991@s.whatsapp.net',
                ],
                msg: '@6282141691898 @6287729957400 @6282284703818 @6289603119611 @62895411052887 @6281324186726 @6281260669090 @6281313557991 ',
            },
            {
                name: 'hok',
                jids: [
                    '6289603119611@s.whatsapp.net',
                    '6285707555406@s.whatsapp.net',
                    '6287729957400@s.whatsapp.net',
                    '6281260669090@s.whatsapp.net',
                ],
                msg: '@6289603119611 @6285707555406 @6287729957400 @6281260669090',
            },
        ],
    },
];

const seed = async () => {
    await Promise.all(
        databases.map(async (db) => {
            const group = await Group.findOneAndUpdate(
                { remoteJid: db.judul },
                { remoteJid: db.judul },
                { upsert: true, new: true },
            );

            await Promise.all(
                db.raw.map(async (raw) => {
                    const users = raw.jids;

                    const payload = users.map((user) => ({
                        updateOne: {
                            filter: { remoteJid: user },
                            update: { remoteJid: user },
                            upsert: true,
                        },
                    }));
                    await User.bulkWrite(payload);

                    const userIDs = await User.find({ remoteJid: { $in: users } }).select('_id');

                    await Role.create({ name: raw.name, groupID: group.id, userIDs });
                }),
            );
        }),
    );

    mongoose.connection.close();
};

seed();
