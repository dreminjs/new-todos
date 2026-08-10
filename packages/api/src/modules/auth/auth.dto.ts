import { createZodDto } from 'nestjs-zod';
import { authSchema, signUpSchema } from 'types';
export class AuthDto extends createZodDto(authSchema) {}
export class SignUpDto extends createZodDto(signUpSchema) {}
