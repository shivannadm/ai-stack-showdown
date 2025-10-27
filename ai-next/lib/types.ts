// lib/types.ts
export interface MessageRecord {
    _id?: string;
    prompt: string;
    response: string;
    createdAt: Date;
}
