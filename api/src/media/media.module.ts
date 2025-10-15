import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { AmazonS3Module } from 'src/amazon-s3/amazon-s3.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from '@entities/media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media]), AmazonS3Module],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
