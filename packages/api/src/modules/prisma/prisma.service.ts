import { Injectable } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../../../generated/prisma/client.js';
import { ConfigService } from "@nestjs/config";
@Injectable()
export class PrismaService extends PrismaClient {

  constructor(private readonly configService: ConfigService) {
    const url = configService.get("POSTGRES_URL")

    if (!url) {
      throw new Error("POSTGRES_URL is not set");
    }

    const adapter = new PrismaPg({
      connectionString: url,
    });
    super({ adapter });
  }
}
