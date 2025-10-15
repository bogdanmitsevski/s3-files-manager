import { ApiProperty } from '@nestjs/swagger';
import {
  VarcharColumn,
  TextColumn,
  IntColumn,
  BigIntColumn,
} from '@decorators/database.decorator';
import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Media extends BaseEntity {
  @ApiProperty({
    description: 'Media ID',
    minimum: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Media path',
  })
  @VarcharColumn()
  url: string;

  @ApiProperty({
    description: 'Media size (in bytes)',
    example: 1024,
  })
  @IntColumn()
  size: number;

  @ApiProperty({
    description: 'Media original upload filename',
    example: '2022.01-01-20-30-screenshot.jpg',
  })
  @TextColumn()
  fileName: string;

  @ApiProperty({
    description: 'Media extension',
  })
  @VarcharColumn()
  extension: string;

  @ApiProperty({
    description: 'Media uploaded at timestamp (milliseconds UTC)',
    example: 1697289600000,
  })
  @BigIntColumn()
  uploadedAt: number;
}
