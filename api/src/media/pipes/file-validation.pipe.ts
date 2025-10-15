import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FilesValidationPipe implements PipeTransform {
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
  private readonly maxTotalSize = 50 * 1024 * 1024; // 50MB in bytes
  private readonly allowedMimeTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'application/pdf',
  ];
  private readonly allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf'];

  transform(files: Express.Multer.File[]): Express.Multer.File[] {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    // Validate individual file size and format
    for (const file of files) {
      // Check file size
      if (file.size > this.maxFileSize) {
        throw new BadRequestException(
          `File "${file.originalname}" exceeds the maximum size of 5MB`,
        );
      }

      // Check MIME type
      if (!this.allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `File "${file.originalname}" has an invalid format. Allowed formats: PNG, JPG, PDF`,
        );
      }

      // Check file extension
      const fileExtension = file.originalname
        .toLowerCase()
        .substring(file.originalname.lastIndexOf('.'));
      if (!this.allowedExtensions.includes(fileExtension)) {
        throw new BadRequestException(
          `File "${file.originalname}" has an invalid extension. Allowed extensions: .png, .jpg, .jpeg, .pdf`,
        );
      }
    }

    // Validate total size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > this.maxTotalSize) {
      throw new BadRequestException(
        `Total file size exceeds the maximum limit of 50MB. Current total: ${(totalSize / 1024 / 1024).toFixed(2)}MB`,
      );
    }

    return files;
  }
}
