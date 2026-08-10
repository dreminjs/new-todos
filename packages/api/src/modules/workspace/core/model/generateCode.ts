import { customAlphabet } from 'nanoid';

export const generateWorkspaceCode = customAlphabet(
  '23456789ABCDEFGHJKMNPQRSTUVWXYZ',
  8,
);
