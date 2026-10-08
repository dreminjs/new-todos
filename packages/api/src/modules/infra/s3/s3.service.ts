import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import type { IUploadedFile } from "../../../interfaces/multipart.js";

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucket: string;
  private readonly logger = new Logger(S3Service.name);

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>("S3_REGION", "us-east-1");
    const endpoint = this.configService.get<string>("S3_ENDPOINT");
    const accessKeyId = this.configService.get<string>("S3_ACCESS_KEY_ID", "");
    const secretAccessKey = this.configService.get<string>(
      "S3_SECRET_ACCESS_KEY",
      "",
    );
    this.bucket = this.configService.get<string>("S3_BUCKET_NAME", "chat-attachments");

    this.s3Client = new S3Client({
      region,
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(
    fileBuffer: Buffer,
    filename: string,
    mimetype: string,
  ): Promise<{ key: string; url: string }> {
    const uniqueFilename = `${uuidv4()}-${filename}`;
    const key = `attachments/${uniqueFilename}`

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: fileBuffer,
          ContentType: mimetype,
        }),
      );

      return {
        key,
        url: key,
      };
    } catch (error) {
      this.logger.error(`Failed to upload file ${filename} to S3`, error);
      throw error;
    }
  }

  async uploadMultipleFiles(
    files: IUploadedFile[],
  ): Promise<Array<IUploadedFile & { key: string }>> {
    return Promise.all(
      files.map(async (file) => {
        const { key } = await this.uploadFile(
          file.buffer,
          file.filename,
          file.mimetype,
        );
        return {
          ...file,
          key,
        };
      }),
    );
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
    } catch (error) {
      this.logger.error(`Failed to delete file ${key} from S3`, error);
      throw error;
    }
  }

  async getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      this.logger.error(`Failed to generate presigned URL for ${key}`, error);
      throw error;
    }
  }
}
