import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Media } from '@entities/media.entity';
import {
  FindAllMediaParams,
  FindAllMediaResponse,
} from '@interfaces/media.interface';
import { AmazonS3Service } from '@amazon-s3/amazon-s3.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private readonly amazonS3Service: AmazonS3Service,
  ) {}

  async findAllMedia(
    params: FindAllMediaParams,
  ): Promise<FindAllMediaResponse> {
    const { page, limit } = params;
    const [media, total] = await this.mediaRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        uploadedAt: 'DESC',
      },
    });

    const formattedMedia = media.map((m) => ({
      id: m.id,
      url: m.url,
      size: m.size,
      fileName: m.fileName,
      extension: m.extension,
      uploadedAt: m.uploadedAt,
    }));

    return {
      data: formattedMedia as Media[],
      total,
      page,
      limit,
    };
  }

  async uploadMedia(files: Express.Multer.File[]): Promise<Media[]> {
    if (!files || !files.length) {
      throw new BadRequestException('No files provided');
    }

    try {
      const uploadPromises = files.map((file) =>
        this.amazonS3Service.uploadSingleFile(file),
      );
      const results = await Promise.all(uploadPromises);

      const media = results.map((result) => {
        const media = new Media();
        media.url = result.url;
        media.size = result.size;
        media.fileName = result.originalName;
        media.extension = result.mimetype;
        media.uploadedAt = Date.now();
        return media;
      });

      const savedMedia = await this.mediaRepository.save(media);

      return savedMedia.map((m) => ({
        id: m.id,
        url: m.url,
        size: m.size,
        fileName: m.fileName,
        extension: m.extension,
        uploadedAt: m.uploadedAt,
      })) as Media[];
    } catch (error) {
      console.error('Upload error:', error);
      throw new BadRequestException(`Failed to upload files: ${error.message}`);
    }
  }

  async deleteMedia(mediaId: number): Promise<void> {
    const media = await this.mediaRepository.findOne({
      where: { id: mediaId },
    });
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    await this.amazonS3Service.deleteFile(media.url);
    await this.mediaRepository.delete(mediaId);
  }
}
