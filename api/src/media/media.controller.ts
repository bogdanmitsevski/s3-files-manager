import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { MediaService } from './media.service';
import { FindAllMediaResponse } from '@interfaces/media.interface';
import { Media } from '@entities/media.entity';
import { FilesValidationPipe } from './pipes/file-validation.pipe';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  @ApiOperation({ summary: 'Find All Media' })
  @ApiQuery({ name: 'page', type: Number, required: true })
  @ApiQuery({ name: 'limit', type: Number, required: true })
  @ApiResponse({
    status: 200,
    description: 'Media list.',
    type: [Media],
  })
  async findAllMedia(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<FindAllMediaResponse> {
    try {
      return this.mediaService.findAllMedia({ page, limit });
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 20))
  @ApiOperation({
    summary: 'Upload multiple files',
    description: `Upload up to 20 files at once. 
    
    **Validation Rules:**
    - Max file size: 5MB per file
    - Max total size: 50MB
    - Allowed formats: PNG, JPG, JPEG, PDF
    - Max files: 20`,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Files to upload (PNG, JPG, JPEG, PDF)',
          maxItems: 20,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        message: {
          type: 'string',
          example: 'Files uploaded successfully',
        },
        files: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              originalName: {
                type: 'string',
                example: 'document.pdf',
              },
              url: {
                type: 'string',
                example: 'https://s3.amazonaws.com/bucket/file.pdf',
              },
              key: {
                type: 'string',
                example: 'media/1234567890-document.pdf',
              },
              size: {
                type: 'number',
                example: 1024000,
              },
              mimetype: {
                type: 'string',
                example: 'application/pdf',
              },
            },
          },
        },
        totalSize: {
          type: 'number',
          example: 2048000,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation errors',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          type: 'string',
          example: 'File exceeds the maximum size of 5MB',
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Upload failed',
  })
  uploadFiles(
    @UploadedFiles(new FilesValidationPipe()) files: Express.Multer.File[],
  ): Promise<Media[]> {
    return this.mediaService.uploadMedia(files);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete media by ID',
    description: 'Delete a media file from both S3 storage and the database',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the media to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Media deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Media not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404,
        },
        message: {
          type: 'string',
          example: 'Media not found',
        },
        error: {
          type: 'string',
          example: 'Not Found',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Delete failed',
  })
  async deleteMedia(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.mediaService.deleteMedia(id);
  }
}
