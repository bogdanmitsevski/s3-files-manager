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
