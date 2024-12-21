import { customAlphabet } from 'nanoid';

const generateId = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  16
);

export const generateBackupId = () => `bkp_${generateId()}`;