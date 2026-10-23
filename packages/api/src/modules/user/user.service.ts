import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { Prisma, User } from "generated/prisma/client.js";
import { UploadedMultipartFile } from "@nestjs/platform-fastify/multipart";
import { S3Service } from "../infra/s3/s3.service.js";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  async findOne(args: Prisma.UserFindFirstArgs): Promise<User | null> {
    return this.prisma.user.findFirst(args);
  }

  async createOne(args: Prisma.UserCreateArgs): Promise<User> {
    return this.prisma.user.create(args);
  }

  async updateOne(args: Prisma.UserUpdateArgs): Promise<User> {
    return this.prisma.user.update(args);
  }

  async uploadUserAvatar(
    userId: string,
    avatar: UploadedMultipartFile,
  ): Promise<User> {
    const newFilename = crypto.randomUUID();

    const uploadedAvatar = await this.s3Service.uploadFile(
      avatar.buffer!,
      newFilename,
      avatar.mimetype,
    );

    return await this.updateOne({
      where: { id: userId },
      data: {
        avatarUrl: uploadedAvatar.url,
      },
    });
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
