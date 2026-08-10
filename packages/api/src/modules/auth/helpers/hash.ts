import { hash, compare } from 'bcrypt';

export function hashPassword(password: string) {
  return hash(password, 10);
}

export async function comparePasswords(
  password: string,
  hashedPassword: string,
) {
  return await compare(password, hashedPassword);
}
