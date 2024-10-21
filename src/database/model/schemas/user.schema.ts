import mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    remoteJid: string;
    role: string;
}

const userSchema: Schema<IUser> = new Schema(
    {
        remoteJid: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: ['SUPER_ADMIN', 'ADMIN', 'USER'],
            default: 'USER',
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    },
);

export const User = mongoose.model<IUser>('User', userSchema);
