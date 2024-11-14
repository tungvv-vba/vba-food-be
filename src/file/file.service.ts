import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FileService {
  private s3Client: S3Client;
  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: configService.getOrThrow("AWS_S3_REGION"),
      credentials: {
        accessKeyId: configService.getOrThrow("AWS_S3_ACCESS_KEY"),
        secretAccessKey: configService.getOrThrow("AWS_S3_SECRET_KEY"),
      },
    });
  }

  async uploadFileToPublicBucket(file: Express.Multer.File) {
    const { originalname, buffer, mimetype, size } = file;
    const bucketName = this.configService.getOrThrow("AWS_S3_PUBLIC_BUCKET");
    const key = `${Date.now().toString()}-${originalname}`;

    const objectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
      ContentLength: size,
    });

    await this.s3Client.send(objectCommand);

    return { key, url: `https://${bucketName}.s3.amazonaws.com/${key}` };
  }

  async deleteFileFromPublicBucket(key: string): Promise<void> {
    const objectCommand = new DeleteObjectCommand({
      Bucket: this.configService.getOrThrow("AWS_S3_PUBLIC_BUCKET"),
      Key: key,
    });

    await this.s3Client.send(objectCommand);
  }
}
