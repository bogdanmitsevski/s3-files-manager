import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadResult } from '@media/interfaces/upload-result.interface';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class AmazonS3Service {
  private readonly s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get('app.awsRegion'),
      credentials: {
        accessKeyId: this.configService.get('app.awsAccessKeyId'),
        secretAccessKey: this.configService.get('app.awsSecretAccessKey'),
      },
    });
  }

  async uploadSingleFile(file: Express.Multer.File): Promise<UploadResult> {
    const { originalname, buffer, mimetype, size } = file;

    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${originalname}`;
    const bucket = this.configService.get('app.awsBucket');
    const region = this.configService.get('app.awsRegion');

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: mimetype,
      ContentDisposition: `attachment; filename="${originalname}"`,
      ACL: 'public-read',
    });

    try {
      await this.s3.send(command);

      const url = `https://${bucket}.s3.${region}.amazonaws.com/${uniqueFileName}`;

      return {
        originalName: originalname,
        url,
        key: uniqueFileName,
        size,
        mimetype,
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      throw error;
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const urlParts = fileUrl.split('/');
    const key = urlParts[3];
    const bucketName = this.configService.get('app.awsBucket');

    const params = {
      Bucket: bucketName,
      Key: key,
    };

    try {
      const command = new DeleteObjectCommand(params);
      await this.s3.send(command);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw error;
    }
  }
}
