import { ReactionType } from '@handlers/handle-send';

export interface WAError {
    name: string;
    message?: string;
    type: ReactionType;
}

export class ErrorWithSendMessage extends Error {
    constructor(inMessage: string, type: ReactionType = 'cross') {
        const error: WAError = {
            name: 'send_message',
            message: inMessage,
            type,
        };
        super(JSON.stringify(error));
    }
}

export class ErrorWithSendReaction extends Error {
    constructor(type: ReactionType = 'cross') {
        const error: WAError = {
            name: 'send_reaction',
            type,
        };
        super(JSON.stringify(error));
    }
}
