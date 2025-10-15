import { Media } from 'entities/media.entity';

export type SortableMediaField =
  | 'id'
  | 'uploadedAt'
  | 'fileName'
  | 'extension'
  | 'size';
export type SortOrder = 'ASC' | 'DESC';

export interface FindAllMediaParams {
  page: number;
  limit: number;
  sortBy?: SortableMediaField;
  sortOrder?: SortOrder;
}

export interface FindAllMediaResponse {
  data: Media[];
  total: number;
  page: number;
  limit: number;
}
