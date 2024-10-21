import mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

export interface IRole extends Document {
    _id: string;
    name: string;
    groupID: Schema.Types.ObjectId;
    userIDs: Schema.Types.ObjectId[];
}

const roleSchema: Schema<IRole> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        groupID: {
            type: Schema.Types.ObjectId,
            ref: 'Group',
            required: true,
        },
        userIDs: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    },
);

export const Role = mongoose.model<IRole>('Role', roleSchema);
