import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { Prisma, User } from "generated/prisma/client.js";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(args: Prisma.UserFindFirstArgs): Promise<User | null> {
    return this.prisma.user.findFirst(args);
  }

  async createOne(args: Prisma.UserCreateArgs): Promise<User> {
    return this.prisma.user.create(args);
  }

  async updateOne(args: Prisma.UserUpdateArgs): Promise<User> {
    return this.prisma.user.update(args);
  }

  async confirmEmail(email: string): Promise<User> {
    const user = await this.updateOne({
      where: { email },
      data: {
        emailConfirmed: true,
      },
    });
    return user;
  }
}
