import mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

export interface IGroup extends Document {
    _id: string;
    remoteJid: string;
}

const groupSchema: Schema<IGroup> = new Schema(
    {
        remoteJid: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    },
);

export const Group = mongoose.model<IGroup>('Group', groupSchema);
