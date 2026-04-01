import { createHash } from 'node:crypto';

export const hashPassword = (value: string) => createHash('sha256').update(value).digest('hex');

export const verifyPassword = (value: string, hash: string) => hashPassword(value) === hash;
