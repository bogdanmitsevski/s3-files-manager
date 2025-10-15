import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediaModule } from '@media/media.module';
import { appConfigFactory } from '@config/app';
import { databaseConfigFactory, databaseConfig } from '@config/database';
import { AmazonS3Module } from '@amazon-s3/amazon-s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfigFactory, databaseConfigFactory],
    }),
    TypeOrmModule.forRoot(databaseConfig),
    MediaModule,
    AmazonS3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
