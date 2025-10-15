import { config } from '../config/env.config';

export interface UploadResult {
  originalName: string;
  url: string;
  key: string;
  size: number;
  mimetype: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  files: UploadResult[];
  totalSize: number;
}

export interface UploadError {
  statusCode: number;
  message: string;
  error: string;
}

export interface MediaFile {
  id: number;
  url: string;
  size: number;
  fileName: string;
  extension: string;
  uploadedAt: string;
}

export interface FetchFilesResponse {
  data: MediaFile[];
  total: number;
  page: number;
  limit: number;
}


const API_BASE_URL = config.api.baseUrl;

export class FilesUploadApi {
  /**
   * Upload multiple files to the server
   * 
   * Validation:
   * - Each file max size: 5MB
   * - Total files max size: 50MB
   * - Allowed formats: PNG, JPG, JPEG, PDF
   * - Maximum files: 20
   * 
   * @param files - Array of File objects to upload
   * @returns Promise with upload response
   * @throws Error if validation fails or upload fails
   */
  static async uploadFiles(files: File[]): Promise<UploadResponse> {
    this.validateFiles(files);

    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error: UploadError = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const result: UploadResponse = await response.json();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred during upload');
    }
  }

  private static validateFiles(files: File[]): void {
    if (!files || files.length === 0) {
      throw new Error('No files selected');
    }

    if (files.length > 20) {
      throw new Error(`Maximum 20 files allowed per upload`);
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const MAX_TOTAL_SIZE = 50 * 1024 * 1024;
    const ALLOWED_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'] as readonly string[];
    const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.pdf'] as readonly string[];

    let totalSize = 0;

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(
          `File "${file.name}" exceeds the maximum size of ${this.formatFileSize(MAX_FILE_SIZE)}`
        );
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(
          `File "${file.name}" has an invalid format. Allowed formats: PNG, JPG, PDF`
        );
      }

      const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        throw new Error(
          `File "${file.name}" has an invalid extension. Allowed extensions: .png, .jpg, .jpeg, .pdf`
        );
      }

      totalSize += file.size;
    }

    if (totalSize > MAX_TOTAL_SIZE) {
      throw new Error(
        `Total file size exceeds the maximum limit of ${this.formatFileSize(MAX_TOTAL_SIZE)}. Current total: ${this.formatFileSize(totalSize)}`
      );
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  static isFileTypeAllowed(file: File): boolean {
    return (['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'] as readonly string[]).includes(file.type);
  }
  static getAcceptedFileTypes(): string {
    return '.png,.jpg,.jpeg,.pdf';
  }

  /**
   * Fetch files from the server with pagination
   * 
   * @param page - Page number (starts from 1)
   * @param limit - Number of items per page
   * @returns Promise with paginated files response
   */
  static async fetchFiles(page: number = 1, limit: number = 10): Promise<FetchFilesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/media?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const error: UploadError = await response.json();
        throw new Error(error.message || 'Failed to fetch files');
      }

      const result: FetchFilesResponse = await response.json();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while fetching files');
    }
  }

  /**
   * Delete a file by ID
   * 
   * @param id - File ID to delete
   * @returns Promise that resolves when file is deleted
   */
  static async deleteFile(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/media/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const error: UploadError = await response.json();
        throw new Error(error.message || 'Failed to delete file');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while deleting file');
    }
  }

  /**
   * Download a file by opening it in a new tab
   * 
   * @param url - File URL to download
   * @param fileName - Original file name
   */
  static downloadFile(url: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

