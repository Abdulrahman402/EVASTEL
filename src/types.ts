import { Role } from 'src/user/schemas/user.schema';

declare module 'express' {
  interface Request {
    user?: {
      _id: string;
      role: Role;
    };
  }
}
